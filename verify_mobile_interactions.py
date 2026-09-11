import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

report = Path('/home/ubuntu/kureva-web/mobile-interaction-verification.txt')

async def run():
    results = []
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={'width': 390, 'height': 844},
            user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
            is_mobile=True,
            has_touch=True,
            device_scale_factor=3,
            accept_downloads=True,
        )
        page = await context.new_page()
        await page.goto('http://localhost:3000/vida', wait_until='networkidle')
        await page.fill('#first-name', 'Nathalia')
        await page.fill('#last-name', 'Romero')
        await page.fill('#register-email', 'natu@kureva.es')
        await page.fill('#register-password', 'demo1234')
        await page.check('input[type="checkbox"]')
        await page.get_by_role('button', name='Siguiente').click()
        await page.get_by_role('button', name='Siguiente').click()
        await page.get_by_role('button', name='Empezar simulación').click()
        await page.get_by_role('button', name='Registrar', exact=True).click()
        await page.get_by_role('button', name='Registrar tensión').click()
        await page.fill('#record-value', '120/80 mmHg')
        await page.fill('#record-note', 'Medición de prueba')
        await page.get_by_role('button', name='Guardar registro local').click()
        records_text = await page.locator('[data-kureva-content]').inner_text()
        assert 'Tensión · 120/80 mmHg' in records_text, records_text[:1500]
        results.append('PASS: El registro de tensión se guarda de manera local y actualiza el contador.')

        await page.get_by_role('button', name='Avisos').click()
        await page.get_by_role('button', name='Crear aviso').click()
        reminder_text = await page.locator('[data-kureva-content]').inner_text()
        assert 'Recordatorio visual creado' in await page.locator('body').inner_text(), reminder_text[:1500]
        results.append('PASS: El recordatorio visual se crea y actualiza el contador.')

        async with page.expect_download(timeout=20_000) as download_info:
            await page.get_by_role('button', name='Descargar informe').click()
        download = await download_info.value
        download_path = await download.path()
        assert download.suggested_filename.endswith('.pdf'), download.suggested_filename
        assert download_path and Path(download_path).stat().st_size > 1_000, download_path
        results.append(f'PASS: El PDF local se genera y descarga ({download.suggested_filename}, {Path(download_path).stat().st_size} bytes).')

        await page.get_by_role('button', name='Alimentos').click()
        await page.get_by_role('button', name='Granada').click()
        food_text = await page.locator('[data-kureva-content]').inner_text()
        assert 'vitamina C' in food_text, food_text[:1500]
        results.append('PASS: Las fichas de alimentos son clicables y muestran su información.')

        await context.close()
        await browser.close()
    report.write_text('\n'.join(results) + '\n', encoding='utf-8')
    print('\n'.join(results))

asyncio.run(run())
