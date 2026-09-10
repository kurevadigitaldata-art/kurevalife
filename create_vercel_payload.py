import json
from pathlib import Path

root = Path('/home/ubuntu/kureva-vercel-static')
files = []
for path in sorted(root.rglob('*')):
    if not path.is_file() or path.name == '.gitkeep':
        continue
    files.append({
        'file': path.relative_to(root).as_posix(),
        'data': path.read_text(encoding='utf-8'),
        'encoding': 'utf-8',
    })

payload = {
    'name': 'kurevalife-piloto',
    'target': 'production',
    'files': files,
}
Path('/home/ubuntu/kureva-web/vercel-deploy-payload.json').write_text(json.dumps(payload, ensure_ascii=False), encoding='utf-8')
print(f'Prepared {len(files)} deployment files.')
