import json
from pathlib import Path

source = Path('/home/ubuntu/kureva-web/kurevalife-edge/index.ts').read_text(encoding='utf-8')
payload = {
    'project_id': 'ikhvfugfmqulxbxrkdvl',
    'name': 'kurevalife-piloto',
    'entrypoint_path': 'index.ts',
    'verify_jwt': False,
    'files': [{'name': 'index.ts', 'content': source}],
}
Path('/home/ubuntu/kureva-web/kurevalife-edge-deploy.json').write_text(json.dumps(payload, ensure_ascii=False), encoding='utf-8')
print(f'Prepared public edge deployment ({len(source)} characters).')
