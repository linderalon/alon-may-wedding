#!/usr/bin/env python3
import os, sys, mimetypes, urllib.request, json

APP_ID = "897e6db0-d4af-4a81-9cd3-d69c1b835ff4"
TOKEN  = "eyJhbGciOiJIUzI1NiJ9.eyJhcHBJZCI6Ijg5N2U2ZGIwLWQ0YWYtNGE4MS05Y2QzLWQ2OWMxYjgzNWZmNCIsInN1YiI6IjM4ZGUyZDY2LWJhMmEtNDBkYi1hNDZmLWVhODJhYTYwM2E1YiIsInR5cGUiOiJ1cGxvYWQiLCJleHAiOjE3ODExOTUxOTYsImlhdCI6MTc4MTE5MzM5Nn0.5Rzup21dcBpnUpW6VCutYCBHc8dok2rlKllMG4N47Y4"
URL    = f"https://kvibe.demo.qa.kaltura.ai/api/upload/apps/{APP_ID}/files"

# Only upload source files — NOT build artefacts or deps
SKIP_DIRS = {
    'node_modules', '.git', '.next', '.turbo', 'coverage',
    '__pycache__', '.cache', 'dist', 'out',
}
SKIP_FILES = {'.DS_Store', '.env', '.env.local', 'upload.py'}

def collect(root):
    result = []
    for dirpath, dirnames, filenames in os.walk(root):
        # prune skipped dirs in-place
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for fname in filenames:
            if fname in SKIP_FILES:
                continue
            full = os.path.join(dirpath, fname)
            rel  = os.path.relpath(full, root).replace('\\', '/')
            result.append((rel, full))
    return result

def build_multipart(fields, boundary=b'WeddingUploadBoundary42'):
    body = b''
    for name, (filename, data, ctype) in fields.items():
        body += b'--' + boundary + b'\r\n'
        body += f'Content-Disposition: form-data; name="{name}"; filename="{filename}"\r\n'.encode()
        body += f'Content-Type: {ctype}\r\n\r\n'.encode()
        body += data + b'\r\n'
    body += b'--' + boundary + b'--\r\n'
    return body, 'multipart/form-data; boundary=' + boundary.decode()

root  = os.path.dirname(os.path.abspath(__file__))
files = collect(root)
print(f"Uploading {len(files)} source files in batches...")

BATCH = 30
errors = 0
for i in range(0, len(files), BATCH):
    batch = files[i:i + BATCH]
    fields = {}
    for rel, full in batch:
        with open(full, 'rb') as fh:
            data = fh.read()
        ctype = mimetypes.guess_type(full)[0] or 'application/octet-stream'
        fields[rel] = (os.path.basename(full), data, ctype)

    body, ct = build_multipart(fields)
    req = urllib.request.Request(URL, data=body, method='POST')
    req.add_header('Authorization', f'Bearer {TOKEN}')
    req.add_header('Content-Type', ct)

    batch_num = i // BATCH + 1
    total_batches = (len(files) + BATCH - 1) // BATCH
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            json.loads(resp.read())
            print(f"  [{batch_num}/{total_batches}] OK  — {[r for r,_ in batch][:2]}...")
    except urllib.error.HTTPError as e:
        body_err = e.read().decode()[:300]
        print(f"  [{batch_num}/{total_batches}] ERROR {e.code}: {body_err}")
        errors += 1
        if errors > 3:
            print("Too many errors, aborting.")
            sys.exit(1)

if errors == 0:
    print(f"\n✓ Done! Live at: https://alon-may-wedding.demo.qa.kaltura.ai")
else:
    print(f"\nCompleted with {errors} batch error(s).")
