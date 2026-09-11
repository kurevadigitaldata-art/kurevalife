import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 390, "height": 844})
        await page.goto("http://127.0.0.1:4176/vida", wait_until="networkidle")
        await page.evaluate("localStorage.clear(); sessionStorage.clear()")
        await page.reload(wait_until="networkidle")
        await page.locator("#kl-alias").fill("Nathalia")
        await page.get_by_role("button", name="Empezar simulacro").click()
        await page.get_by_role("button", name="Perfil", exact=True).click()
        await page.get_by_role("switch", name="Modo nocturno").check()
        selectors = [".kl-section-heading h1", ".kl-card-heading h2", ".kl-setting-row strong", ".kl-check-row span", ".kl-brand-signature strong"]
        for selector in selectors:
            print(selector, await page.locator(selector).first.evaluate("el => ({color:getComputedStyle(el).color, background:getComputedStyle(el).backgroundColor, opacity:getComputedStyle(el).opacity})"))
        print("imports", await page.evaluate("Array.from(document.styleSheets).map(s => s.href || 'inline')"))
        await browser.close()

asyncio.run(run())
