# AURA static site.
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
    ".woff2": "font/woff2",
    ".webmanifest": "application/manifest+json",
}
SECURITY = [
    ("X-Content-Type-Options", "nosniff"),
    ("Referrer-Policy", "strict-origin-when-cross-origin"),
    ("X-Frame-Options", "SAMEORIGIN"),
    ("Permissions-Policy", "camera=(), microphone=(), geolocation=()"),
    (
        "Content-Security-Policy",
        "default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; "
        "connect-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'",
    ),
]
BLOCKED_EXT = {".wsgi", ".py", ".md"}


def _headers(ctype, body, cache):
    return [
        ("Content-Type", ctype),
        ("Content-Length", str(len(body))),
        ("Cache-Control", cache),
        *SECURITY,
    ]


def _not_found(start_response):
    page = os.path.join(ROOT, "404.html")
    if os.path.isfile(page):
        with open(page, "rb") as handle:
            body = handle.read()
        ctype = "text/html; charset=utf-8"
    else:
        body = "Страница не найдена".encode("utf-8")
        ctype = "text/plain; charset=utf-8"
    start_response("404 Not Found", _headers(ctype, body, "no-cache"))
    return [body]


def application(environ, start_response):
    path = unquote(environ.get("PATH_INFO") or "/")
    if path in ("/", ""):
        path = "/index.html"
    rel = path.lstrip("/")
    if not rel or rel.startswith(".") or "/." in ("/" + rel):
        body = b"Forbidden"
        start_response("403 Forbidden", _headers("text/plain; charset=utf-8", body, "no-cache"))
        return [body]
    root_norm = os.path.normpath(ROOT)
    full = os.path.normpath(os.path.join(ROOT, rel))
    if full != root_norm and not full.startswith(root_norm + os.sep):
        body = b"Forbidden"
        start_response("403 Forbidden", _headers("text/plain; charset=utf-8", body, "no-cache"))
        return [body]
    ext = os.path.splitext(full)[1].lower()
    if ext in BLOCKED_EXT or not os.path.isfile(full):
        return _not_found(start_response)
    cache = "no-cache" if ext == ".html" else "public, max-age=604800"
    with open(full, "rb") as handle:
        body = handle.read()
    start_response("200 OK", _headers(TYPES.get(ext, "application/octet-stream"), body, cache))
    return [body]
