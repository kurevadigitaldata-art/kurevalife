import asyncio
import os
from pathlib import Path

from playwright.async_api import async_playwright

URL = os.environ.get("KUREVALIFE_TEST_URL", "http://127.0.0.1:4176/vida")
OUT = Path(os.environ.get("KUREVALIFE_QA_OUT", "/tmp/kurevalife-mobile-qa"))


async def run():
    OUT.mkdir(parents=True, exist_ok=True)
    results = []
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={"width": 390, "height": 844},
            user_agent=(
                "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) "
                "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 "
                "Mobile/15E148 Safari/604.1"
            ),
            is_mobile=True,
            has_touch=True,
            device_scale_factor=3,
            accept_downloads=True,
        )
        page = await context.new_page()
        errors = []
        page.on("pageerror", lambda exc: errors.append(str(exc)))
        await page.goto(URL, wait_until="networkidle")
        await page.evaluate("localStorage.clear(); sessionStorage.clear()")
        await page.reload(wait_until="networkidle")

        await page.get_by_role("button", name="Empezar simulacro").click()
        nav_labels = await page.locator(".kl-bottom-nav__item").all_inner_texts()
        assert nav_labels == ["Hoy", "Registrar", "Informes", "Perfil"], nav_labels
        assert await page.locator(".kl-bottom-nav").get_by_text("Kivi", exact=True).count() == 0
        results.append("PASS: La barra inferior conserva Hoy, Registrar, Informes y Perfil; Kivi es secundario.")

        await page.get_by_role("button", name="Registrar", exact=True).click()
        await page.locator("#record-value").fill("120/80 mmHg")
        await page.locator("#record-note").fill("Medición de prueba")
        await page.get_by_role("button", name="Guardar registro local").click()
        assert "Registro guardado localmente" in await page.locator("body").inner_text()
        results.append("PASS: El registro de tensión se guarda de manera local.")

        await page.get_by_role("tab", name="Avisos").click()
        await page.locator("#reminder-title").fill("Preparar la consulta")
        await page.get_by_role("button", name="Crear aviso visual").click()
        assert "Aviso visual creado" in await page.locator("body").inner_text()
        results.append("PASS: El recordatorio visual se crea dentro del simulacro.")

        await page.get_by_role("tab", name="Agua").click()
        await page.get_by_role("button", name="Añadir vaso").click()
        assert "1 de 8 vasos" in await page.locator("body").inner_text()
        results.append("PASS: El progreso de hidratación se actualiza localmente.")

        await page.reload(wait_until="networkidle")
        assert await page.locator("#kl-alias").count() == 0
        await page.get_by_role("button", name="Informes", exact=True).click()
        report_text = await page.locator("body").inner_text()
        assert "120/80 mmHg" in report_text, report_text[:1500]
        results.append("PASS: El registro continúa disponible después de recargar.")

        async with page.expect_download(timeout=20_000) as download_info:
            await page.get_by_role("button", name="Descargar PDF").click()
        download = await download_info.value
        download_path = OUT / download.suggested_filename
        await download.save_as(str(download_path))
        assert download_path.suffix == ".pdf" and download_path.stat().st_size > 1_000
        results.append(
            f"PASS: El PDF local se genera y descarga ({download.suggested_filename}, {download_path.stat().st_size} bytes)."
        )

        await page.get_by_role("button", name="Perfil", exact=True).click()
        await page.get_by_role("switch", name="Modo nocturno").check()
        assert await page.locator("#kurevalife-app").evaluate(
            "node => node.classList.contains('kl-theme-night')"
        )
        await page.get_by_role("button", name="Abrir Kivi, asistente de organización").click()
        assert await page.locator(".kl-kivi-panel").evaluate(
            "node => document.activeElement === node"
        )
        results.append("PASS: El modo nocturno cambia de tema y Kivi abre como asistente secundario con foco.")

        assert not errors, errors
        await page.screenshot(path=str(OUT / "390-final.png"), full_page=True)
        await context.close()
        await browser.close()

    report = OUT / "mobile-interaction-verification.txt"
    report.write_text("\n".join(results) + "\n", encoding="utf-8")
    print("\n".join(results))


asyncio.run(run())
