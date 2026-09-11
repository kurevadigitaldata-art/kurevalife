import asyncio
import json
import os
from pathlib import Path
from playwright.async_api import async_playwright

BASE = os.environ.get("KUREVALIFE_TEST_URL", "http://127.0.0.1:4176/vida")
OUT = Path("/home/ubuntu/kureva-phase-cj-qa")
VIEWPORTS = {
    "360": {"width": 360, "height": 800},
    "390": {"width": 390, "height": 844},
    "412": {"width": 412, "height": 915},
    "430": {"width": 430, "height": 932},
}

async def overflow(page):
    return await page.evaluate("document.documentElement.scrollWidth > window.innerWidth")

async def run():
    OUT.mkdir(parents=True, exist_ok=True)
    report = {}
    async with async_playwright() as p:
        for name, viewport in VIEWPORTS.items():
            browser = await p.chromium.launch()
            page = await browser.new_page(viewport=viewport)
            errors = []
            page.on("pageerror", lambda exc: errors.append(str(exc)))
            await page.goto(BASE, wait_until="networkidle")
            await page.evaluate("localStorage.clear(); sessionStorage.clear()")
            await page.reload(wait_until="networkidle")
            await page.locator("#kl-alias").fill("Nathalia")
            await page.get_by_role("button", name="Empezar simulacro").click()
            await page.wait_for_timeout(150)
            await page.screenshot(path=str(OUT / f"{name}-hoy.png"), full_page=True)
            states = {"hoy": not await overflow(page)}

            await page.get_by_role("button", name="Registrar", exact=True).click()
            await page.locator("#record-file").set_input_files({"name": "analitica-prueba.pdf", "mimeType": "application/pdf", "buffer": b"simulacro"})
            await page.locator("#record-value").fill("120 / 80 mmHg")
            await page.locator("#record-note").fill("Registro de prueba local")
            await page.get_by_role("button", name="Guardar registro local").click()
            states["registrar"] = ("Registro guardado localmente" in await page.locator("body").inner_text()) and not await overflow(page)
            await page.get_by_role("tab", name="Avisos").click()
            await page.locator("#reminder-title").fill("Preparar mi consulta")
            await page.get_by_role("button", name="Crear aviso visual").click()
            states["avisos"] = "Aviso visual creado" in await page.locator("body").inner_text()
            await page.get_by_role("tab", name="Agua").click()
            await page.get_by_role("button", name="Añadir vaso").click()
            states["agua"] = "1 de 8 vasos" in await page.locator("body").inner_text()

            await page.get_by_role("button", name="Informes", exact=True).click()
            states["informes"] = ("120 / 80 mmHg" in await page.locator("body").inner_text()) and not await overflow(page)
            async with page.expect_download() as download_info:
                await page.get_by_role("button", name="Descargar PDF").click()
            download = await download_info.value
            pdf_path = OUT / f"{name}-resumen.pdf"
            await download.save_as(str(pdf_path))
            states["pdf"] = pdf_path.exists() and pdf_path.stat().st_size > 1000
            await page.screenshot(path=str(OUT / f"{name}-informes.png"), full_page=True)

            await page.get_by_role("button", name="Perfil", exact=True).click()
            await page.get_by_role("switch", name="Modo nocturno").check()
            states["perfil_modo_nocturno"] = await page.locator("#kurevalife-app").evaluate("node => node.classList.contains('kl-theme-night')")
            await page.screenshot(path=str(OUT / f"{name}-perfil-nocturno.png"), full_page=True)
            await page.get_by_role("button", name="Abrir Kivi, asistente de organización").click()
            states["kivi"] = "Kivi no diagnostica" in await page.locator("body").inner_text()
            await page.get_by_role("button", name="Cerrar Kivi").click()
            await page.get_by_role("button", name="Dejar valoración").click()
            states["feedback"] = "Valoración y sugerencias" in await page.locator("body").inner_text() and not await overflow(page)
            await page.screenshot(path=str(OUT / f"{name}-feedback.png"), full_page=True)

            focus_visible = await page.evaluate("""() => {
              const target = document.querySelector('.kl-bottom-nav__item');
              target?.focus();
              return document.activeElement === target;
            }""")
            target_sizes = await page.locator("button, input, select, textarea").evaluate_all("els => els.map(el => { const r=el.getBoundingClientRect(); return {tag:el.tagName, width:r.width, height:r.height, label:el.getAttribute('aria-label') || el.textContent?.trim() || el.id}; })")
            undersized = [item for item in target_sizes if item["height"] and item["height"] < 40 and item["tag"] == "BUTTON"]
            report[name] = {
                "overflow": await overflow(page),
                "states": states,
                "focus_reachable": focus_visible,
                "undersized_buttons": undersized,
                "page_errors": errors,
            }
            await browser.close()
    (OUT / "report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))

asyncio.run(run())
