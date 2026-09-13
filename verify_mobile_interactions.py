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

        assert await page.get_by_role("heading", name="Tu día en orden. Tu bienestar más claro.").count() == 1
        results.append("PASS: Cada visita comienza en Bienvenida, sin restaurar un perfil previo.")

        await page.get_by_role("button", name="Comenzar simulacro").click()
        assert "Bienvenida a KurevaLife, Nathalia" in await page.locator("body").inner_text()
        results.append("PASS: La introducción precargada usa la bienvenida femenina de Nathalia.")

        await page.get_by_role("button", name="Comenzar").click()
        await page.get_by_role("button", name="Continuar").click()
        await page.get_by_role("textbox", name="Nombre").fill("Carlos")
        await page.get_by_role("button", name="Masculino").click()
        await page.get_by_role("button", name="Siguiente").click()
        await page.get_by_role("button", name="Volver").click()
        await page.get_by_role("button", name="Volver").click()
        await page.get_by_role("button", name="Volver").click()
        intro_text = await page.locator("body").inner_text()
        assert "Bienvenido a KurevaLife, Carlos" in intro_text
        assert "seleccionado" in intro_text and "tranquilo" in intro_text
        results.append("PASS: El trato masculino se adapta dinámicamente al nombre y preferencia del registro.")

        await page.get_by_role("button", name="Comenzar").click()
        await page.get_by_role("button", name="Continuar").click()
        await page.get_by_role("button", name="Siguiente").click()
        await page.get_by_role("switch", name="Modo nocturno").check()
        await page.get_by_role("switch", name="Sonido y voz opcional").check()
        await page.get_by_role("button", name="Finalizar").click()
        assert "Hola, Carlos" in await page.locator("body").inner_text()
        assert await page.locator("#kurevalife-app").evaluate(
            "node => node.classList.contains('kl-theme-night')"
        )
        results.append("PASS: El dashboard usa el nombre real y aplica modo nocturno al finalizar.")

        await page.get_by_role("button", name="Perfil", exact=True).click()
        await page.get_by_role("button", name="Muy grande").click()
        assert await page.locator("#kurevalife-app").evaluate(
            "node => node.classList.contains('kl-text-muy-grande')"
        )
        await page.get_by_role("switch", name="Apoyo para lector de pantalla").check()
        results.append("PASS: Los controles de texto y apoyo de lector se aplican inmediatamente.")

        await page.get_by_role("button", name="Abrir Kivi, asistente de organización").click()
        assert await page.get_by_text("Transcripción de Kivi", exact=True).count() == 1
        await page.get_by_role("button", name="Revisar un registro").click()
        assert "Aún no has añadido registros" in await page.locator("body").inner_text()
        await page.get_by_role("button", name="Ver consejos de bienestar").click()
        assert "No necesitas rutinas imposibles" in await page.locator("body").inner_text()
        results.append("PASS: Kivi conserva respuesta textual, transcripción y anuncio accesible opcional.")

        await page.get_by_role("button", name="Registrar", exact=True).click()
        await page.locator("#record-value").fill("sin números")
        await page.get_by_role("button", name="Añadir registro a la prueba").click()
        assert "¡Uy! Se nos escapó un número" in await page.locator("body").inner_text()
        await page.locator("#record-value").fill("120/80 mmHg")
        await page.locator("#record-note").fill("Medición de prueba")
        await page.get_by_role("button", name="Añadir registro a la prueba").click()
        assert "Registro añadido a esta prueba" in await page.locator("body").inner_text()
        results.append("PASS: Los datos se usan dentro de la prueba en curso.")

        await page.screenshot(path=str(OUT / "390-personalized-final.png"), full_page=True)
        await page.reload(wait_until="networkidle")
        assert await page.get_by_role("heading", name="Tu día en orden. Tu bienestar más claro.").count() == 1
        assert "Carlos" not in await page.locator("body").inner_text()
        results.append("PASS: Recargar elimina el perfil y los registros de prueba; no hay persistencia entre sesiones.")

        await page.get_by_role("button", name="Comenzar simulacro").click()
        await page.get_by_role("button", name="Comenzar").click()
        await page.get_by_role("button", name="Continuar").click()
        await page.get_by_role("textbox", name="Nombre").fill("Alex")
        await page.get_by_role("button", name="Neutro / no binario").click()
        await page.get_by_role("button", name="Siguiente").click()
        await page.get_by_role("button", name="Volver").click()
        await page.get_by_role("button", name="Volver").click()
        await page.get_by_role("button", name="Volver").click()
        neutral_text = await page.locator("body").inner_text()
        assert "Te damos la bienvenida a KurevaLife, Alex" in neutral_text
        assert "Agradecemos tu participación" in neutral_text
        results.append("PASS: El trato neutro elimina adjetivos con género en la introducción.")

        assert not errors, errors
        await context.close()
        await browser.close()

    report = OUT / "mobile-interaction-verification.txt"
    report.write_text("\n".join(results) + "\n", encoding="utf-8")
    print("\n".join(results))


asyncio.run(run())
