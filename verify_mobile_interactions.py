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
        )
        page = await context.new_page()
        errors = []
        page.on("pageerror", lambda exc: errors.append(str(exc)))
        await page.goto(URL, wait_until="networkidle")
        await page.evaluate("localStorage.clear(); sessionStorage.clear()")
        await page.reload(wait_until="networkidle")

        # 1. Bienvenida
        welcome = await page.locator("body").inner_text()
        assert "Tu día en orden." in welcome and "Tu bienestar más claro." in welcome
        assert "KurevaLife es más que una app." in welcome
        assert "No se guardarán datos reales." in welcome
        assert await page.get_by_role("link", name="Conocer Kureva").get_attribute("href") in ("/kurevalife/", "/")
        results.append("PASS: 1. Bienvenida muestra el texto aprobado, CTAs y aviso de datos reales.")

        await page.get_by_role("button", name="Comenzar simulacro").click()

        # 2. Introducción neutral
        introduction = await page.locator("body").inner_text()
        assert "Bienvenidos" in introduction
        assert "Muchas gracias por formar parte de este simulacro" in introduction
        assert "Tómate el tiempo que necesites" in introduction
        assert "herramienta humanizada" in introduction
        assert "Hola," not in introduction and "Nathalia" not in introduction and "Carlos" not in introduction
        assert "Este simulacro es solo informativo" in introduction
        assert await page.locator(".kl-onboarding__title-accent").count() == 1
        motion = await page.locator(".kl-onboarding__title-accent").evaluate(
            "node => getComputedStyle(node, '::before').animationName"
        )
        assert motion == "kl-introduction-lime-slide"
        await page.emulate_media(reduced_motion="reduce")
        reduced_motion = await page.locator(".kl-onboarding__title-accent").evaluate(
            "node => getComputedStyle(node, '::before').animationName"
        )
        assert reduced_motion == "none"
        await page.emulate_media(reduced_motion="no-preference")
        await page.get_by_role("button", name="English").click()
        assert await page.locator("html").get_attribute("lang") == "en"
        await page.get_by_role("button", name="Español").click()
        assert await page.locator("html").get_attribute("lang") == "es"
        results.append("PASS: 2. Introducción usa título genérico, lenguaje neutral, idioma, aviso informativo y acento lima accesible.")

        await page.get_by_role("button", name="Comenzar").click()

        # 3. Inclusión
        inclusion = await page.locator("body").inner_text()
        assert "Personas con discapacidad visual" in inclusion
        assert "Personas con discapacidad auditiva" in inclusion
        assert "Mayores de 18 años" in inclusion and "Modo familiar" in inclusion
        await page.get_by_role("button", name="Personas con discapacidad visual").click()
        results.append("PASS: 3. Inclusión conserva los cuatro bloques y el apoyo activable.")

        await page.get_by_role("button", name="Continuar").click()

        # 4. Registro: campos vacíos y tamaño configurable
        fields = await page.locator("input").evaluate_all("nodes => nodes.map(node => node.value)")
        assert fields[:4] == ["", "", "", ""]
        await page.get_by_role("textbox", name="Nombre").fill("Alex")
        await page.get_by_role("textbox", name="Apellidos").fill("Ríos")
        await page.get_by_role("button", name="Muy grande").click()
        assert await page.locator(".kl-onboarding").evaluate(
            "node => node.classList.contains('kl-text-muy-grande')"
        )
        results.append("PASS: 4. Registro inicia vacío y aplica texto muy grande.")

        await page.get_by_role("button", name="Siguiente").click()

        # 5. Configuración y permisos
        preferences = await page.locator("body").inner_text()
        assert "Sonido" in preferences
        assert "Traducción en línea" in preferences
        assert "Modo de lectura fácil" in preferences
        assert "¿Qué te gustaría recibir de Kureva?" in preferences
        assert "Kureva no será la tóxica" in preferences
        finish = page.get_by_role("button", name="Finalizar")
        assert await finish.is_disabled()
        await page.get_by_role("switch", name="Sonido").check()
        await page.get_by_role("switch", name="Traducción en línea").check()
        await page.get_by_text("Recibir novedades y lanzamientos.", exact=True).click()
        await page.get_by_text("Acepto los términos y condiciones y la política de privacidad.", exact=True).click()
        assert not await finish.is_disabled()
        results.append("PASS: 5. Configuración contiene los tres controles, lista opcional, aviso cercano y consentimiento requerido.")

        await finish.click()
        dashboard = await page.locator("body").inner_text()
        assert "Hola, Alex" in dashboard
        assert await page.locator(".kl-text-muy-grande").count() == 1
        results.append("PASS: El simulacro aplica el nombre y tamaño de texto al finalizar.")

        await page.screenshot(path=str(OUT / "390-first-five-points.png"), full_page=True)
        await page.reload(wait_until="networkidle")
        assert await page.get_by_role("heading", name="Tu día en orden. Tu bienestar más claro.").count() == 1
        assert "Alex" not in await page.locator("body").inner_text()
        results.append("PASS: Recargar elimina los datos de simulación y vuelve a Bienvenida.")

        assert not errors, errors
        await context.close()
        await browser.close()

    report = OUT / "five-point-mobile-verification.txt"
    report.write_text("\n".join(results) + "\n", encoding="utf-8")
    print("\n".join(results))


asyncio.run(run())
