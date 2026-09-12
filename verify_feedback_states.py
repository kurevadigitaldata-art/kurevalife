import asyncio
import json
import os
from pathlib import Path

from playwright.async_api import async_playwright

URL = os.environ.get("KUREVALIFE_TEST_URL", "http://127.0.0.1:4176/vida")
OUT = Path(os.environ.get("KUREVALIFE_QA_OUT", "/tmp/kurevalife-feedback-qa"))


async def enter_feedback(page):
    await page.goto(URL, wait_until="networkidle")
    await page.evaluate("localStorage.clear(); sessionStorage.clear()")
    await page.reload(wait_until="networkidle")
    await page.locator("#kl-alias").fill("Test")
    await page.get_by_role("button", name="Empezar simulacro").click()
    await page.get_by_role("button", name="Perfil", exact=True).click()
    await page.get_by_role("button", name="Dejar valoración").click()
    await page.get_by_role("radio", name="4 estrellas").click()
    await page.locator("#feedback-private").fill(
        "La navegación resulta clara durante esta prueba de interfaz."
    )
    await page.get_by_text(
        "Quiero que esta sugerencia quede en el registro privado del piloto."
    ).click()


async def submit_and_read_status(page):
    await page.get_by_role("button", name="Enviar valoración y sugerencia").click()
    status = page.locator(".kl-inline-status").first
    await status.wait_for(state="visible")
    return (await status.inner_text()).lower()


async def run():
    OUT.mkdir(parents=True, exist_ok=True)
    result = {}
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 390, "height": 844})
        await page.route(
            "**/rest/v1/pilot_feedback",
            lambda route: route.fulfill(
                status=201, content_type="application/json", body="{}"
            ),
        )
        await enter_feedback(page)
        success_status = await submit_and_read_status(page)
        result["success"] = "se han guardado" in success_status
        await page.screenshot(path=str(OUT / "feedback-success.png"), full_page=True)

        await page.unroute("**/rest/v1/pilot_feedback")
        await page.route(
            "**/rest/v1/pilot_feedback",
            lambda route: route.fulfill(
                status=500,
                content_type="application/json",
                body='{"message":"unavailable"}',
            ),
        )
        await enter_feedback(page)
        fallback_status = await submit_and_read_status(page)
        result["error_fallback"] = "conservado localmente" in fallback_status
        result["fallback_copy"] = await page.evaluate(
            """() => Object.keys(localStorage).some(key =>
                key.startsWith('kurevalife-feedback-')
            )"""
        )
        await page.screenshot(path=str(OUT / "feedback-error.png"), full_page=True)
        await browser.close()

    (OUT / "report.json").write_text(json.dumps(result, indent=2), encoding="utf-8")
    print(json.dumps(result, indent=2))
    assert all(result.values()), json.dumps(result, indent=2)


asyncio.run(run())
