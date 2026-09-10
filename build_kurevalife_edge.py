import base64
import gzip
import json
from pathlib import Path

root = Path('/home/ubuntu/kureva-web/dist/public')
out = Path('/home/ubuntu/kureva-web/kurevalife-edge')
out.mkdir(exist_ok=True)

files: dict[str, bytes] = {}
for path in root.rglob('*'):
    if not path.is_file() or path.name == '.gitkeep' or '__manus__' in path.parts:
        continue
    rel = path.relative_to(root).as_posix()
    data = path.read_bytes()
    if rel == 'index.html':
        text = data.decode('utf-8')
        text = text.replace('src="/assets/', 'src="assets/')
        text = text.replace('href="/assets/', 'href="assets/')
        text = text.replace('href="/manifest.webmanifest"', 'href="manifest.webmanifest"')
        text = text.replace('/manus-storage/kureva-isotipo_24d6eb8a.svg', 'brand/kureva-isotipo.svg')
        text = text.replace('/manus-storage/kurevalife-lockup_f908d233.svg', 'brand/kurevalife-lockup.svg')
        data = text.encode('utf-8')
    if rel == 'manifest.webmanifest':
        text = data.decode('utf-8')
        text = text.replace('"start_url": "/vida"', '"start_url": "./vida"')
        text = text.replace('/manus-storage/kureva-isotipo_24d6eb8a.svg', 'brand/kureva-isotipo.svg')
        data = text.encode('utf-8')
    files[rel] = data
files['brand/kureva-isotipo.svg'] = Path('/home/ubuntu/webdev-static-assets/kureva-isotipo.svg').read_bytes()
files['brand/kurevalife-lockup.svg'] = Path('/home/ubuntu/webdev-static-assets/kurevalife-lockup.svg').read_bytes()

mime = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.json': 'application/json; charset=utf-8',
    '.webmanifest': 'application/manifest+json; charset=utf-8',
}
payload = {name: [base64.b64encode(data).decode(), mime.get(Path(name).suffix, 'application/octet-stream')] for name, data in files.items()}
packed = base64.b64encode(gzip.compress(json.dumps(payload, separators=(',', ':')).encode(), compresslevel=9)).decode()

code = f'''import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const BASE = "/functions/v1/kurevalife-piloto";
const PACKED_ASSETS = "{packed}";
let cachedAssets: Map<string, [string, string]> | null = null;

function decode(payload: string) {{
  const binary = atob(payload);
  const output = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index++) output[index] = binary.charCodeAt(index);
  return output;
}}

async function assetMap() {{
  if (cachedAssets) return cachedAssets;
  const compressed = decode(PACKED_ASSETS);
  const stream = new Blob([compressed]).stream().pipeThrough(new DecompressionStream("gzip"));
  const content = await new Response(stream).text();
  cachedAssets = new Map(Object.entries(JSON.parse(content))) as Map<string, [string, string]>;
  return cachedAssets;
}}

Deno.serve(async (request) => {{
  const url = new URL(request.url);
  let path = url.pathname.startsWith(BASE) ? url.pathname.slice(BASE.length).replace(/^\\/+/, "") : "";
  const assets = await assetMap();
  if (!path || path === "vida" || path === "vida/" || !assets.has(path)) path = "index.html";
  const asset = assets.get(path) ?? assets.get("index.html");
  if (!asset) return new Response("KurevaLife no está disponible.", {{ status: 500 }});
  const [encoded, type] = asset;
  const isAppShell = path === "index.html";
  return new Response(decode(encoded), {{
    headers: {{
      "content-type": type,
      "cache-control": isAppShell ? "no-store" : "public, max-age=31536000, immutable",
      "x-content-type-options": "nosniff",
      "access-control-allow-origin": "*",
    }},
  }});
}});
'''
(out / 'index.ts').write_text(code, encoding='utf-8')
print(f'Bundled {len(files)} files into {len(code)} chars (compressed data: {len(packed)} chars).')
