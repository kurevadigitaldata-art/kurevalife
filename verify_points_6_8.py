import asyncio
import os
from pathlib import Path

from playwright.async_api import async_playwright

URL = os.environ.get("KUREVALIFE_TEST_URL", "http://127.0.0.1:4176/vida")
OUT = Path(os.environ.get("KUREVALIFE_QA_OUT", "/tmp/kurevalife-points-6-8-qa"))


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
        page.on("pageerror", lambda exc: errors.append(str(exc)))
        await page.goto(URL, wait_until="networkidle")
        await page.evaluate("localStorage.clear(); sessionStorage.clear()")
        await page.reload(wait_until="networkidle")
        await complete_onboarding(page)

        # 6. Inicio / Hoy: daily vital records and wellbeing actions.
        text = await page.locator("body").inner_text()
        assert "Hola, Alex" in text
        assert "MIS CONSTANTES VITALES" in text
        assert "Presión arterial" in text and "Glucosa" in text
        assert "DIAGNÓSTICOS Y ANTECEDENTES" in text
        assert "NUTRICIÓN Y BIENESTAR DIARIO" in text
        assert "PLANIFICACIÓN Y AGENDA MÉDICA" in text
        await page.get_by_role("button", name="Añadir").first.click()
        await page.get_by_role("textbox", name="Dato de prueba").fill("120/80 mmHg")
        await page.get_by_role("button", name="Guardar en la prueba").click()
        await page.get_by_role("button", name="Diagnóstico clínico").click()
        await page.get_by_role("button", name="Añadir diagnóstico").click()
        await page.get_by_role("button", name="Añadir vaso").click()
        await page.get_by_role("textbox", name="Registro de comidas").fill(
            "Desayuno: fruta y tostada"
        )
        await page.get_by_role("button", name="Registrar alimento").click()
        await page.get_by_role("button", name="Activar tomas del día").click()
        today_after = await page.locator("body").inner_text()
        assert "Alerta visual de prueba añadida." in today_after
        assert "120/80 mmHg" in today_after
        await assert_no_overflow(page)
        await page.screenshot(path=str(OUT / "390-hoy-interactivo.png"), full_page=True)
        results.append("PASS: 6. Hoy registra constantes, antecedentes, agua, alimentación y un aviso visual solo durante la sesión.")

        # 7. Informes: three analysis modes, local-only upload explanation and PDF.
        await page.get_by_role("button", name="Informes").click()
        reports = await page.locator("body").inner_text()
        assert "Analíticas e informes" in reports
        assert "Seleccionar imagen / subir analítica" in reports
        await page.get_by_role("tab", name="Análisis").click()
        analysis = await page.locator("body").inner_text()
        assert "¿Qué haría Kivi con tus analíticas?" in analysis
        assert "Este simulacro no lee imágenes" in analysis
        await page.get_by_role("tab", name="Revisión").click()
        assert "Análisis evolutivo de prueba" in await page.locator("body").inner_text()
        assert await page.get_by_role("button", name="Descargar PDF").count() == 1
        await assert_no_overflow(page)
        await page.screenshot(path=str(OUT / "390-informes-analiticas.png"), full_page=True)
        results.append("PASS: 7. Informes muestra Imagen, Análisis y Revisión con límites locales y conserva el PDF local.")

        # 8. Kivi: approved quick questions with clinical and feature limits.
        await page.get_by_role("button", name="Abrir Kivi, asistente de organización").click()
        kivi = await page.locator("body").inner_text()
        assert "Chat con Kivi" in kivi
        assert "no puedo diagnosticarte" in kivi
        await page.get_by_role(
            "button", name="¿Para qué sirve registrar lo que como desde el desayuno hasta la cena?"
        ).click()
        nutrition_reply = await page.locator(".kl-kivi-reply").inner_text()
        assert "bitácora limpia" in nutrition_reply and "no evalúa ni interpreta" in nutrition_reply
        await page.get_by_role(
            "button", name="¿Qué detecta Kureva si subo la foto de una analítica?"
        ).click()
        analytics_reply = await page.locator(".kl-kivi-reply").inner_text()
        assert "no lee imágenes" in analytics_reply
        await page.get_by_role(
            "button", name="¿Qué puedo hacer en la sección de Comunidad?"
        ).click()
        community_reply = await page.locator(".kl-kivi-reply").inner_text()
        assert "No está activa en este simulacro" in community_reply
        await assert_no_overflow(page)
        await page.screenshot(path=str(OUT / "390-kivi-interactivo.png"), full_page=True)
        results.append("PASS: 8. Kivi ofrece las preguntas aprobadas y declara límites clínicos, comunitarios y conectados.")

        assert not errors, errors
        await context.close()
        await browser.close()

    (OUT / "points-6-8-verification.txt").write_text("\n".join(results) + "\n", encoding="utf-8")
    print("\n".join(results))


asyncio.run(run())
