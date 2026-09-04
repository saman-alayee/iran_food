#!/usr/bin/env python3
"""Fast frontend deploy: upload only HTML/JS/CSS bundles, skip static images."""
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

SKIP_PREFIXES = ("images/",)
SKIP_NAMES = {"favicon.svg", "og-image.svg"}
ALWAYS_UPLOAD = {"images/iran-food-logo.png"}


def should_upload(rel: str) -> bool:
    if rel in SKIP_NAMES:
        return False
    if rel in ALWAYS_UPLOAD:
        return True
    return not rel.startswith(SKIP_PREFIXES)


def ensure_dirs(ftp: ftplib.FTP, rel: str) -> None:
    parent = rel.rsplit("/", 1)[0] if "/" in rel else ""
    if not parent:
        return
    acc = ""
    for part in parent.split("/"):
        acc = f"{acc}/{part}" if acc else part
        try:
            ftp.mkd(acc)
        except ftplib.error_perm:
            pass


def upload_file(ftp: ftplib.FTP, local: Path, rel: str) -> None:
    ensure_dirs(ftp, rel)
    with local.open("rb") as handle:
        ftp.storbinary(f"STOR {rel}", handle)
    print("up", rel)


def main() -> None:
    if not DIST.is_dir():
        raise SystemExit(f"Run nuxt generate first: missing {DIST}")
    if not PASSWORD:
        raise SystemExit("Missing FTP password")

    files = sorted(
        path
        for path in DIST.rglob("*")
        if path.is_file() and should_upload(path.relative_to(DIST).as_posix())
    )
    skipped = sum(
        1 for path in DIST.rglob("*") if path.is_file() and not should_upload(path.relative_to(DIST).as_posix())
    )

    ftp = ftplib.FTP(HOST, timeout=180)
    ftp.login(USER, PASSWORD)
    ftp.cwd("public_html")

    for path in files:
        upload_file(ftp, path, path.relative_to(DIST).as_posix())

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
    print(f"done fast upload ({len(files)} files, skipped {skipped} static assets)")


if __name__ == "__main__":
    main()
