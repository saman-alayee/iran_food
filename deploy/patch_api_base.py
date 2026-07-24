#!/usr/bin/env python3
"""Patch production static frontend to call https://api.iranfoodd.ir (CORS already OK)."""
from __future__ import annotations

import ftplib
import io
import os
import re
from pathlib import Path

HOST = os.environ.get("IRANFOOD_FTP_HOST", "89.39.208.237")
USER = os.environ.get("IRANFOOD_FTP_USER", "zjdekntt")
ROOT = Path(__file__).resolve().parent

PASSWORD = os.environ.get("IRANFOOD_FTP_PASSWORD", "")
if not PASSWORD:
    secret_file = ROOT / ".ftp-secret.local"
    if secret_file.is_file():
        PASSWORD = secret_file.read_text(encoding="utf-8").strip()

API_BASE = "https://api.iranfoodd.ir"

HTML_FILES = [
    "/public_html/index.html",
    "/public_html/200.html",
    "/public_html/404.html",
]


def patch_html(text: str) -> str:
    text = re.sub(r'apiBase:""', f'apiBase:"{API_BASE}"', text)
    text = text.replace("/dataset/v1/", "/api/")
    return text


def patch_js(text: str) -> str:
    text = text.replace("/dataset/v1/", "/api/")
    if API_BASE not in text and 'apiBase:""' in text:
        text = text.replace('apiBase:""', f'apiBase:"{API_BASE}"')
    return text


def main() -> None:
    if not PASSWORD:
        raise SystemExit("Set IRANFOOD_FTP_PASSWORD or deploy/.ftp-secret.local")

    ftp = ftplib.FTP(HOST, timeout=120)
    ftp.login(USER, PASSWORD)

    for remote in HTML_FILES:
        buf = io.BytesIO()
        try:
            ftp.retrbinary(f"RETR {remote.lstrip('/')}", buf.write)
        except ftplib.error_perm:
            print("skip", remote)
            continue
        original = buf.getvalue().decode("utf-8", errors="replace")
        patched = patch_html(original)
        if patched == original:
            print("unchanged", remote)
            continue
        bio = io.BytesIO(patched.encode("utf-8"))
        ftp.storbinary(f"STOR {remote.lstrip('/')}", bio)
        print("patched", remote)

    ftp.cwd("/public_html/admin")
    for item in ftp.nlst():
        if not item.endswith(".html"):
            continue
        buf = io.BytesIO()
        ftp.retrbinary(f"RETR {item}", buf.write)
        original = buf.getvalue().decode("utf-8", errors="replace")
        patched = patch_html(original)
        if patched != original:
            bio = io.BytesIO(patched.encode("utf-8"))
            ftp.storbinary(f"STOR {item}", bio)
            print("patched admin", item)

    ftp.cwd("/public_html/_nuxt")
    for item in ftp.nlst():
        if not item.endswith(".js"):
            continue
        buf = io.BytesIO()
        ftp.retrbinary(f"RETR {item}", buf.write)
        text = buf.getvalue().decode("utf-8", errors="replace")
        patched = patch_js(text)
        if patched == text:
            continue
        bio = io.BytesIO(patched.encode("utf-8"))
        ftp.storbinary(f"STOR {item}", bio)
        print("patched js", item)

    ftp.quit()
    print("done — open https://api.iranfoodd.ir once and accept certificate if browser warns")


if __name__ == "__main__":
    main()
