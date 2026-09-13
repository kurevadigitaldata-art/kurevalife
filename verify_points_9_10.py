import asyncio
import os
from pathlib import Path

from playwright.async_api import async_playwright

URL = os.environ.get("KUREVALIFE_TEST_URL", "http://127.0.0.1:4176/vida")
OUT = Path(os.environ.get("KUREVALIFE_QA_OUT", "/tmp/kurevalife-points-9-10-qa"))


async def complete_onboarding(page):
    await page.get_by_role("button", name="Comenzar simulacro").click()
    await page.get_by_role("button", name="Comenzar").click()
    await page.get_by_role("button", name="Continuar").click()
    await page.get_by_role("textbox", name="Nombre").fill("Alex")
    await page.get_by_role("button", name="Siguiente").click()
    await page.get_by_text(
        "Acepto los términos y condiciones y la política de privacidad.", exact=True
    ).click()
    await page.get_by_role("button", name="Finalizar").click()


async def assert_no_overflow(page):
    dimensions = await page.evaluate(
        "({ width: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth })"
    )
    assert dimensions["scrollWidth"] <= dimensions["width"], dimensions


async def run():
    OUT.mkdir(parents=True, exist_ok=True)
    results = []
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={"width": 390, "height": 844},
            is_mobile=True,
            has_touch=True,
            device_scale_factor=3,
        )
        page = await context.new_page()
        errors = []
        unexpected_requests = []
        page.on("pageerror", lambda exc: errors.append(str(exc)))
        page.on(
            "request",
            lambda request: unexpected_requests.append(request.url)
            if request.method in ("POST", "PUT", "PATCH")
            else None,
        )
        await page.goto(URL, wait_until="networkidle")
        await page.evaluate("localStorage.clear(); sessionStorage.clear()")
        await page.reload(wait_until="networkidle")
        await complete_onboarding(page)

        # 9. Fourth required tab retains Profile label and contains Environment.
        await page.get_by_role("button", name="Perfil").click()
        environment = await page.locator("body").inner_text()
        assert "Entorno Social y Ciencia" in environment
        assert "Comunidad Abierta" in environment
        assert "Alimentos de Temporada" in environment
        assert "La Comunidad no está activa en este simulacro" in environment
        assert "fuentes públicas y consenso sanitario" in environment
        assert await page.locator(".kl-community-post").count() == 3
        nav_labels = await page.locator(".kl-bottom-nav__item").all_inner_texts()
        assert nav_labels == ["Hoy", "Registrar", "Informes", "Perfil"], nav_labels
        await assert_no_overflow(page)
        await page.screenshot(path=str(OUT / "390-entorno.png"), full_page=True)
        results.append("PASS: 9. Perfil integra Entorno Social y Ciencia con comunidad simulada, ciencia estacional y cuatro destinos de navegación.")

        # 10. Feedback is a final local-only simulation with no request.
        await page.get_by_role("button", name="Dejar valoración").click()
        closing = await page.locator("body").inner_text()
        assert "¡Has completado el recorrido por el simulacro!" in closing
        assert "no se publica ni se envía" in closing
        await page.get_by_role("radio", name="4 estrellas").click()
        await page.get_by_role("textbox", name="Comentarios o sugerencias").fill(
            "La experiencia de prueba es clara y ordenada."
        )
        await page.get_by_role(
            "button", name="Publicar valoración y finalizar simulacro"
        ).click()
        done = await page.locator("body").inner_text()
        assert "Gracias por ser parte de este simulacro." in done
        assert "no se publicó ni se envió a ningún servicio" in done
        assert not unexpected_requests, unexpected_requests
        await assert_no_overflow(page)
        await page.screenshot(path=str(OUT / "390-cierre.png"), full_page=True)
        results.append("PASS: 10. El cierre conserva estrellas y comentario temporal, no transmite datos y vuelve a Bienvenida.")

        await page.get_by_role("button", name="Volver a la bienvenida").click()
        assert await page.get_by_role(
            "heading", name="Tu día en orden. Tu bienestar más claro."
        ).count() == 1
        assert not errors, errors
        await context.close()
        await browser.close()

    (OUT / "points-9-10-verification.txt").write_text("\n".join(results) + "\n", encoding="utf-8")
    print("\n".join(results))


asyncio.run(run())
