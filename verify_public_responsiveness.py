import asyncio
import os
from pathlib import Path

from playwright.async_api import async_playwright

BASE_URL = os.environ.get("KUREVA_PUBLIC_TEST_URL", "http://127.0.0.1:4180")
OUT = Path(os.environ.get("KUREVA_PUBLIC_QA_OUT", "/tmp/kureva-public-responsive-qa"))
VIEWPORTS = {
    "mobile": {"width": 390, "height": 844},
    "tablet": {"width": 768, "height": 1024},
    "desktop": {"width": 1280, "height": 900},
}


async def assert_no_horizontal_overflow(page, label: str):
    metrics = await page.evaluate(
        """() => ({ scrollWidth: document.documentElement.scrollWidth,
                    clientWidth: document.documentElement.clientWidth })"""
    )
    assert metrics["scrollWidth"] <= metrics["clientWidth"], (label, metrics)


async def run():
    OUT.mkdir(parents=True, exist_ok=True)
    results = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        for name, viewport in VIEWPORTS.items():
            context = await browser.new_context(viewport=viewport, is_mobile=name == "mobile", has_touch=name == "mobile")
            page = await context.new_page()
            errors = []
            page.on("pageerror", lambda exc: errors.append(str(exc)))

            await page.goto(f"{BASE_URL}/", wait_until="networkidle")
            assert await page.get_by_role("heading", name="El marketing digital no tiene una receta única.").count() == 1
            cover = page.locator('img[alt="Portada oficial de KurevaLife"]')
            await cover.scroll_into_view_if_needed()
            cover_loaded = await cover.evaluate(
                """node => node.complete
                  ? node.naturalWidth > 0
                  : new Promise(resolve => node.addEventListener(
                      'load', () => resolve(node.naturalWidth > 0), { once: true }
                    ))"""
            )
            assert cover_loaded
            rotation = await page.locator(".kureva-k-rotate").first.evaluate(
                "node => getComputedStyle(node).animationName"
            )
            assert rotation == "kl-rotate", (name, rotation)
            await assert_no_horizontal_overflow(page, f"landing-{name}")
            await page.screenshot(path=str(OUT / f"landing-{name}.png"), full_page=True)

            await page.goto(f"{BASE_URL}/vida", wait_until="networkidle")
            await page.get_by_role("button", name="Empezar simulacro").click()
            app_rotation = await page.locator(".kl-mark__image").first.evaluate(
                "node => getComputedStyle(node).animationName"
            )
            assert app_rotation == "kl-rotate", (name, app_rotation)
            nav_labels = await page.locator(".kl-bottom-nav__item").all_inner_texts()
            assert nav_labels == ["Hoy", "Registrar", "Informes", "Perfil"], nav_labels
            await assert_no_horizontal_overflow(page, f"simulacro-{name}")
            await page.screenshot(path=str(OUT / f"simulacro-{name}.png"), full_page=True)
            assert not errors, (name, errors)
            results.append(f"PASS: {name} landing + simulacro without overflow and with continuous K rotation.")
            await context.close()

        reduced_context = await browser.new_context(
            viewport=VIEWPORTS["mobile"], reduced_motion="reduce", is_mobile=True, has_touch=True
        )
        reduced_page = await reduced_context.new_page()
        await reduced_page.goto(f"{BASE_URL}/vida", wait_until="networkidle")
        await reduced_page.get_by_role("button", name="Empezar simulacro").click()
        reduced_rotation = await reduced_page.locator(".kl-mark__image").first.evaluate(
            "node => getComputedStyle(node).animationName"
        )
        assert reduced_rotation == "none", reduced_rotation
        results.append("PASS: prefers-reduced-motion disables ornamental K rotation.")
        await reduced_context.close()
        await browser.close()

    (OUT / "report.txt").write_text("\n".join(results) + "\n", encoding="utf-8")
    print("\n".join(results))


asyncio.run(run())
