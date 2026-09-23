# AURA landing. Previous Django WSGI saved as index.wsgi.django.bak
import os
from urllib.parse import unquote

ROOT = os.path.dirname(os.path.abspath(__file__))
TYPES = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".txt": "text/plain; charset=utf-8",
    ".webp": "image/webp",
}


def application(environ, start_response):
    path = unquote(environ.get("PATH_INFO") or "/")
    if path in ("/", ""):
        path = "/index.html"
    rel = path.lstrip("/")
    root_norm = os.path.normpath(ROOT)
    full = os.path.normpath(os.path.join(ROOT, rel))
    if full != root_norm and not full.startswith(root_norm + os.sep):
        start_response("403 Forbidden", [("Content-Type", "text/plain; charset=utf-8")])
        return [b"Forbidden"]
    if not os.path.isfile(full):
        full = os.path.join(ROOT, "index.html")
    ext = os.path.splitext(full)[1].lower()
    ctype = TYPES.get(ext, "application/octet-stream")
    with open(full, "rb") as f:
        body = f.read()
    start_response("200 OK", [
        ("Content-Type", ctype),
        ("Content-Length", str(len(body))),
        ("Cache-Control", "no-cache"),
    ])
    return [body]
