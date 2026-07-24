#!/usr/bin/env python3
"""Mount Node backend on https://iranfoodd.ir/dataset/v1 (Passenger, same SSL as site)."""
from __future__ import annotations

import ftplib
import io
import os
import re
from pathlib import Path

HOST = os.environ.get("IRANFOOD_FTP_HOST", "89.39.208.237")
USER = os.environ.get("IRANFOOD_FTP_USER", "zjdekntt")
ROOT = Path(__file__).resolve().parent
PUBLIC = ROOT / "public_html"

PASSWORD = os.environ.get("IRANFOOD_FTP_PASSWORD", "")
if not PASSWORD:
    secret = ROOT / ".ftp-secret.local"
    if secret.is_file():
        PASSWORD = secret.read_text(encoding="utf-8").strip()

# Same-origin API prefix (Passenger BaseURI)
API_PREFIX = "/dataset/v1"
OLD_BASES = [
    'apiBase:"https://api.iranfoodd.ir"',
    'apiBase:""',
    'apiBase:"/ifood-api"',
]


def upload_file(ftp: ftplib.FTP, local: Path, remote: str) -> None:
    with local.open("rb") as f:
        ftp.storbinary(f"STOR {remote}", f)
    print("uploaded", remote)


def ensure_dir(ftp: ftplib.FTP, parts: list[str]) -> None:
    ftp.cwd("/public_html")
    for part in parts:
        try:
            ftp.cwd(part)
        except ftplib.error_perm:
            ftp.mkd(part)
            ftp.cwd(part)


def patch_html(text: str) -> str:
    for old in OLD_BASES:
        text = text.replace(old, f'apiBase:"{API_PREFIX}"')
    if "https://api.iranfoodd.ir" in text:
        text = text.replace("https://api.iranfoodd.ir", "")
    return text


def patch_js(text: str) -> str:
    text = patch_html(text)
    # Ensure fetch paths use prefix when bundles still call /api/... with empty base
    if API_PREFIX not in text:
        for old, new in [
            ('"/api/', f'"{API_PREFIX}/api/'),
            ("'/api/", f"'{API_PREFIX}/api/"),
            ("`/api/", f"`{API_PREFIX}/api/"),
        ]:
            if old in text and new not in text:
                text = text.replace(old, new)
    return text


def patch_remote_html(ftp: ftplib.FTP, path: str) -> None:
    buf = io.BytesIO()
    try:
        ftp.retrbinary(f"RETR {path}", buf.write)
    except ftplib.error_perm:
        return
    original = buf.getvalue().decode("utf-8", errors="replace")
    patched = patch_html(original)
    if patched == original:
        print("html ok", path)
        return
    bio = io.BytesIO(patched.encode("utf-8"))
    ftp.storbinary(f"STOR {path}", bio)
    print("patched html", path)


def main() -> None:
    if not PASSWORD:
        raise SystemExit("Set deploy/.ftp-secret.local or IRANFOOD_FTP_PASSWORD")

    ftp = ftplib.FTP(HOST, timeout=120)
    ftp.login(USER, PASSWORD)

    upload_file(ftp, PUBLIC / ".htaccess", ".htaccess")
    ensure_dir(ftp, ["dataset", "v1"])
    ftp.cwd("/public_html")
    upload_file(ftp, PUBLIC / "dataset" / "v1" / ".htaccess", "dataset/v1/.htaccess")

    ftp.cwd("/public_html")
    for name in ["index.html", "200.html", "404.html"]:
        patch_remote_html(ftp, name)

    try:
        ftp.cwd("/public_html/admin")
        for item in ftp.nlst():
            if item.endswith(".html"):
                patch_remote_html(ftp, item)
    except ftplib.error_perm:
        pass

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

    # Passenger graceful restart
    try:
        ftp.cwd("/home/zjdekntt/iran_food/backend")
        bio = io.BytesIO(b"restart")
        ftp.storbinary("STOR tmp/restart.txt", bio)
        print("passenger restart touch")
    except ftplib.error_perm as e:
        print("restart skip", e)

    ftp.quit()
    print("done — test:", f"https://iranfoodd.ir{API_PREFIX}/api/health")


if __name__ == "__main__":
    main()
