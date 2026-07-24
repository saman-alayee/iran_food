#!/usr/bin/env python3
"""Upload CMS backend files to production and restart Passenger."""
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
    ("backend/src/data/defaultSiteContent.js", "iran_food/backend/src/data/defaultSiteContent.js"),
    ("backend/src/controllers/contentController.js", "iran_food/backend/src/controllers/contentController.js"),
    ("backend/src/controllers/mediaController.js", "iran_food/backend/src/controllers/mediaController.js"),
    ("backend/src/routes/contentRoutes.js", "iran_food/backend/src/routes/contentRoutes.js"),
    ("backend/src/routes/mediaRoutes.js", "iran_food/backend/src/routes/mediaRoutes.js"),
    ("backend/src/routes/index.js", "iran_food/backend/src/routes/index.js"),
    ("backend/src/middleware/cmsUpload.js", "iran_food/backend/src/middleware/cmsUpload.js"),
    ("backend/src/utils/paths.js", "iran_food/backend/src/utils/paths.js"),
    ("backend/src/app.js", "iran_food/backend/src/app.js"),
    ("deploy/prod_backend/src/services/contentService.js", "iran_food/backend/src/services/contentService.js"),
    ("deploy/prod_backend/src/services/mediaService.js", "iran_food/backend/src/services/mediaService.js"),
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
    ftp.storbinary("STOR restart.txt", io.BytesIO(b"restart"))
    print("touched restart.txt")


def main() -> None:
    if not PASSWORD:
        raise SystemExit("Missing FTP password")

    ftp = ftplib.FTP(HOST, timeout=120)
    ftp.login(USER, PASSWORD)

    seen = set()
    for local_rel, remote in UPLOADS:
        if remote in seen:
            continue
        seen.add(remote)
        local = REPO / local_rel.replace("/", os.sep)
        if not local.is_file():
            raise SystemExit(f"missing local file: {local}")
        upload_file(ftp, local, remote)

    restart_passenger(ftp)
    ftp.quit()
    print("done CMS backend upload")


if __name__ == "__main__":
    main()
