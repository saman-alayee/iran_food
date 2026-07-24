#!/usr/bin/env python3
"""Upload auth change-password backend files to production and restart Passenger."""
from __future__ import annotations

import ftplib
import io
import os
from pathlib import Path

HOST = os.environ.get("IRANFOOD_FTP_HOST", "89.39.208.237")
USER = os.environ.get("IRANFOOD_FTP_USER", "zjdekntt")
ROOT = Path(__file__).resolve().parent
REPO = ROOT.parent

PASSWORD = os.environ.get("IRANFOOD_FTP_PASSWORD", "")
if not PASSWORD:
    PASSWORD = (ROOT / ".ftp-secret.local").read_text(encoding="utf-8").strip()

UPLOADS = [
    ("backend/src/controllers/authController.js", "iran_food/backend/src/controllers/authController.js"),
    ("backend/src/routes/authRoutes.js", "iran_food/backend/src/routes/authRoutes.js"),
    ("backend/src/validators/index.js", "iran_food/backend/src/validators/index.js"),
    ("deploy/prod_backend/src/services/authService.js", "iran_food/backend/src/services/authService.js"),
    ("deploy/prod_backend/src/models/Admin.js", "iran_food/backend/src/models/Admin.js"),
]


def upload_file(ftp: ftplib.FTP, local: Path, remote: str) -> None:
    with local.open("rb") as handle:
        ftp.storbinary(f"STOR {remote}", handle)
    print("uploaded", remote)


def restart_passenger(ftp: ftplib.FTP) -> None:
    try:
        ftp.cwd("iran_food/backend/tmp")
    except ftplib.error_perm:
        ftp.mkd("iran_food/backend/tmp")
        ftp.cwd("iran_food/backend/tmp")
    bio = io.BytesIO(b"restart")
    ftp.storbinary("STOR restart.txt", bio)
    print("touched restart.txt")


def main() -> None:
    if not PASSWORD:
        raise SystemExit("Set IRANFOOD_FTP_PASSWORD or deploy/.ftp-secret.local")

    ftp = ftplib.FTP(HOST, timeout=120)
    ftp.login(USER, PASSWORD)

    for local_rel, remote in UPLOADS:
        local = REPO / local_rel.replace("/", os.sep)
        if not local.is_file():
            raise SystemExit(f"missing local file: {local}")
        upload_file(ftp, local, remote)

    restart_passenger(ftp)
    ftp.quit()
    print("done backend auth upload")


if __name__ == "__main__":
    main()
