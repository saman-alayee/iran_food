#!/usr/bin/env python3
"""Upload proxy/htaccess fixes and patch built frontend API paths on production FTP."""
from __future__ import annotations

import ftplib
import io
import os
from pathlib import Path

HOST = os.environ.get("IRANFOOD_FTP_HOST", "89.39.208.237")
USER = os.environ.get("IRANFOOD_FTP_USER", "zjdekntt")
ROOT = Path(__file__).resolve().parent
PUBLIC = ROOT / "public_html"

PASSWORD = os.environ.get("IRANFOOD_FTP_PASSWORD", "")
if not PASSWORD:
    secret_file = ROOT / ".ftp-secret.local"
    if secret_file.is_file():
        PASSWORD = secret_file.read_text(encoding="utf-8").strip()

UPLOADS = [
    ".htaccess",
    "ifood-bridge.php",
    "ifood-uploads-bridge.php",
]

JS_REPLACEMENTS = [
    ('"/api/', '"/dataset/v1/'),
    ("'/api/", "'/dataset/v1/"),
    ("`/api/", "`/dataset/v1/"),
    ('"/ifood-api/', '"/dataset/v1/'),
    ("'/ifood-api/", "'/dataset/v1/"),
    ("`/ifood-api/", "`/dataset/v1/"),
]


def upload_file(ftp: ftplib.FTP, local: Path, remote: str) -> None:
    with local.open("rb") as f:
        ftp.storbinary(f"STOR {remote}", f)
    print("uploaded", remote)


def patch_js_bundle(text: str) -> tuple[str, bool]:
    patched = text
    changed = False
    for old, new in JS_REPLACEMENTS:
        if old in patched:
            patched = patched.replace(old, new)
            changed = True
    return patched, changed


def main() -> None:
    if not PASSWORD:
        raise SystemExit("Set IRANFOOD_FTP_PASSWORD environment variable")

    ftp = ftplib.FTP(HOST, timeout=120)
    ftp.login(USER, PASSWORD)
    ftp.cwd("/public_html")

    for name in UPLOADS:
        upload_file(ftp, PUBLIC / name, name)

    try:
        ftp.cwd("/public_html/_nuxt")
        for item in ftp.nlst():
            if not item.endswith(".js"):
                continue
            buf = io.BytesIO()
            ftp.retrbinary(f"RETR {item}", buf.write)
            text = buf.getvalue().decode("utf-8", errors="replace")
            patched, changed = patch_js_bundle(text)
            if not changed:
                continue
            bio = io.BytesIO(patched.encode("utf-8"))
            ftp.storbinary(f"STOR {item}", bio)
            print("patched js", item)
    except ftplib.error_perm as e:
        print("nuxt patch skip", e)

    ftp.quit()
    print("done")


if __name__ == "__main__":
    main()
