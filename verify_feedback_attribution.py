import asyncio
import os
import re
from pathlib import Path

from playwright.async_api import async_playwright

URL = os.environ.get("KUREVALIFE_TEST_URL", "http://127.0.0.1:4176/vida")
OUT = Path(os.environ.get("KUREVALIFE_QA_OUT", "/tmp/kurevalife-feedback-attribution-qa"))


async def complete_onboarding(page, name: str):
    await page.get_by_role("button", name="Comenzar simulacro").click()
    await page.get_by_role("button", name="Comenzar").click()
    await page.get_by_role("button", name="Continuar").click()
    await page.get_by_role("textbox", name="Nombre").fill(name)
    await page.get_by_role("button", name="Siguiente").click()
    await page.get_by_text(
        "Acepto los términos y condiciones y la política de privacidad.", exact=True
    ).click()
    await page.get_by_role("button", name="Finalizar").click()


async def open_feedback(page):
    await page.get_by_role("button", name="Perfil").click()
    await page.get_by_role("button", name="Dejar valoración").click()


async def submit(page, rating: int, suggestion: str):
    await page.get_by_role(
        "radio", name=f"{rating} {'estrella' if rating == 1 else 'estrellas'}"
    ).click()
    await page.get_by_role("textbox", name="Comentarios o sugerencias").fill(suggestion)
    await page.get_by_role(
        "button", name="Publicar valoración y finalizar simulacro"
    ).click()


async def run():
    OUT.mkdir(parents=True, exist_ok=True)
    results = []
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True
        )
        page = await context.new_page()
        write_requests = []
        errors = []
        page.on("pageerror", lambda exc: errors.append(str(exc)))
        page.on(
            "request",
            lambda request: write_requests.append(request.url)
            if request.method in ("POST", "PUT", "PATCH")
            else None,
        )

        # Named path uses the onboarding alias in the final summary.
        await page.goto(URL, wait_until="networkidle")
        await page.evaluate("localStorage.clear(); sessionStorage.clear()")
        await page.reload(wait_until="networkidle")
        await complete_onboarding(page, "Alex")
        await open_feedback(page)
        assert await page.get_by_label("Publicar con mi nombre o alias").is_checked()
        await submit(page, 4, "La prueba se entiende con claridad.")
        named_summary = await page.locator("body").inner_text()
        assert "Alex" in named_summary
        assert "Valoración: 4 de 5 estrellas." in named_summary
        assert "La prueba se entiende con claridad." in named_summary
        assert "Participante anónimo" not in named_summary
        await page.screenshot(path=str(OUT / "390-named-summary.png"), full_page=True)
        results.append("PASS: la atribución con nombre reutiliza el alias y muestra valoración y sugerencia.")

        # Closing the first contribution restores a new in-memory simulation.
        await page.get_by_role("button", name="Volver a la bienvenida").click()
        await complete_onboarding(page, "Alex")
        await open_feedback(page)
        await page.get_by_label("Publicar de forma anónima").check()
        await submit(page, 5, "Me gustaría ver más ejemplos de uso.")
        anonymous_summary = await page.locator("body").inner_text()
        assert "Participante anónimo · KLV-" in anonymous_summary
        assert re.search(r"KLV-[A-Z0-9-]+", anonymous_summary), anonymous_summary
        assert "Valoración: 5 de 5 estrellas." in anonymous_summary
        assert "Me gustaría ver más ejemplos de uso." in anonymous_summary
        assert "no se ha almacenado, publicado ni transmitido" in anonymous_summary.lower()
        # The shell suppresses the onboarding alias on the final attribution view.
        assert "Hola, Alex" not in anonymous_summary
        assert not write_requests, write_requests
        await page.screenshot(path=str(OUT / "390-anonymous-summary.png"), full_page=True)
        results.append("PASS: la atribución anónima oculta el alias, genera código temporal y no transmite datos.")

        await page.get_by_role("button", name="Volver a la bienvenida").click()
        await complete_onboarding(page, "")
        await open_feedback(page)
        assert await page.get_by_label("Publicar con mi nombre o alias").is_disabled()
        assert await page.get_by_label("Publicar de forma anónima").is_checked()
        results.append("PASS: sin alias inicial, el cierre elige la atribución anónima de forma segura.")

        await page.reload(wait_until="networkidle")
        assert await page.get_by_role(
            "heading", name="Tu día en orden. Tu bienestar más claro."
        ).count() == 1
        assert not errors, errors
        await context.close()
        await browser.close()

    (OUT / "feedback-attribution-verification.txt").write_text(
        "\n".join(results) + "\n", encoding="utf-8"
    )
    print("\n".join(results))


asyncio.run(run())
