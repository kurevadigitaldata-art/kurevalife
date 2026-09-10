from pathlib import Path
import shutil

source = Path('/home/ubuntu/kureva-vercel-static')
target = Path('/home/ubuntu/kurevalife-pilot-public')
if target.exists():
    shutil.rmtree(target)
shutil.copytree(source, target)

index = target / 'index.html'
html = index.read_text(encoding='utf-8')
html = html.replace('<head>', '<head>\n    <base href="/kurevalife-piloto/" />', 1)
html = html.replace('src="/assets/', 'src="assets/')
html = html.replace('href="/assets/', 'href="assets/')
html = html.replace('href="/manifest.webmanifest"', 'href="manifest.webmanifest"')
index.write_text(html, encoding='utf-8')

manifest = target / 'manifest.webmanifest'
content = manifest.read_text(encoding='utf-8')
content = content.replace('"start_url": "/vida"', '"start_url": "/kurevalife-piloto/vida/"')
content = content.replace('"display": "standalone"', '"scope": "/kurevalife-piloto/",\n  "display": "standalone"')
manifest.write_text(content, encoding='utf-8')

life = target / 'vida'
life.mkdir(exist_ok=True)
(life / 'index.html').write_text(html, encoding='utf-8')
(target / '404.html').write_text(html, encoding='utf-8')
print(target)
