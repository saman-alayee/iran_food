#!/usr/bin/env python3
"""Upload Nuxt generate output to public_html; preserve API htaccess files."""
from __future__ import annotations

import ftplib
import os
from pathlib import Path

HOST = os.environ.get("IRANFOOD_FTP_HOST", "89.39.208.237")
USER = os.environ.get("IRANFOOD_FTP_USER", "zjdekntt")
ROOT = Path(__file__).resolve().parent
REPO = ROOT.parent
DIST = REPO / "frontend" / ".output" / "public"
DEPLOY_PUBLIC = ROOT / "public_html"

PASSWORD = os.environ.get("IRANFOOD_FTP_PASSWORD", "")
if not PASSWORD:
    PASSWORD = (ROOT / ".ftp-secret.local").read_text(encoding="utf-8").strip()

PRESERVE_AFTER = [
    ".htaccess",
    "dataset/v1/.htaccess",
]


def upload_dir(ftp: ftplib.FTP, local: Path) -> None:
    for path in sorted(local.rglob("*")):
        rel = path.relative_to(local).as_posix()
        if path.is_dir():
            parts = rel.split("/")
            acc = ""
            for part in parts:
                acc = f"{acc}/{part}" if acc else part
                try:
                    ftp.mkd(acc)
                except ftplib.error_perm:
                    pass
            continue
        parent = rel.rsplit("/", 1)[0] if "/" in rel else ""
        if parent:
            parts = parent.split("/")
            acc = ""
            for part in parts:
                acc = f"{acc}/{part}" if acc else part
                try:
                    ftp.mkd(acc)
                except ftplib.error_perm:
                    pass
        with path.open("rb") as f:
            ftp.storbinary(f"STOR {rel}", f)
        print("up", rel)


def upload_file(ftp: ftplib.FTP, local: Path, remote: str) -> None:
    with local.open("rb") as f:
        ftp.storbinary(f"STOR {remote}", f)
    print("up", remote)


def main() -> None:
    if not DIST.is_dir():
        raise SystemExit(f"Run nuxt generate first: missing {DIST}")
    if not PASSWORD:
        raise SystemExit("Missing FTP password")

    ftp = ftplib.FTP(HOST, timeout=180)
    ftp.login(USER, PASSWORD)
    ftp.cwd("public_html")

    upload_dir(ftp, DIST)

    ftp.cwd("/public_html")
    upload_file(ftp, DEPLOY_PUBLIC / ".htaccess", ".htaccess")
    ensure = DEPLOY_PUBLIC / "dataset" / "v1" / ".htaccess"
    if ensure.is_file():
        try:
            ftp.mkd("dataset")
        except ftplib.error_perm:
            pass
        try:
            ftp.mkd("dataset/v1")
        except ftplib.error_perm:
            pass
        upload_file(ftp, ensure, "dataset/v1/.htaccess")

    ftp.quit()
    print("done frontend upload")


if __name__ == "__main__":
    main()
