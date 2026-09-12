import asyncio
import os

from playwright.async_api import async_playwright

URL = os.environ.get("KUREVALIFE_TEST_URL", "http://127.0.0.1:4176/vida")


def parse_rgb(value: str):
    channels = value.removeprefix("rgb(").removesuffix(")").split(",")
    return tuple(int(channel.strip()) for channel in channels[:3])


def relative_luminance(color):
    channels = []
    for channel in color:
        normalized = channel / 255
        channels.append(
            normalized / 12.92
            if normalized <= 0.04045
            else ((normalized + 0.055) / 1.055) ** 2.4
        )
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]


def contrast_ratio(foreground: str, background: str):
    light = max(relative_luminance(parse_rgb(foreground)), relative_luminance(parse_rgb(background)))
    dark = min(relative_luminance(parse_rgb(foreground)), relative_luminance(parse_rgb(background)))
    return (light + 0.05) / (dark + 0.05)


async def color(page, selector):
    return await page.locator(selector).first.evaluate("el => getComputedStyle(el).color")


async def background(page, selector):
    return await page.locator(selector).first.evaluate("el => getComputedStyle(el).backgroundColor")


async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 390, "height": 844})
        await page.goto(URL, wait_until="networkidle")
        await page.evaluate("localStorage.clear(); sessionStorage.clear()")
        await page.reload(wait_until="networkidle")
        await page.get_by_role("button", name="Empezar simulacro").click()
        await page.get_by_role("button", name="Perfil", exact=True).click()
        await page.get_by_role("switch", name="Modo nocturno").check()

        samples = {
            "heading": (
                await color(page, ".kl-section-heading h1"),
                await background(page, "#kurevalife-app"),
            ),
            "card_heading": (
                await color(page, ".kl-card-heading h2"),
                await background(page, ".kl-profile-card"),
            ),
            "setting_label": (
                await color(page, ".kl-setting-row strong"),
                await background(page, ".kl-settings-card"),
            ),
        }
        results = {
            label: {
                "foreground": foreground,
                "background": backdrop,
                "ratio": round(contrast_ratio(foreground, backdrop), 2),
            }
            for label, (foreground, backdrop) in samples.items()
        }
        print(results)
        assert all(item["ratio"] >= 4.5 for item in results.values()), results
        await browser.close()


asyncio.run(run())
