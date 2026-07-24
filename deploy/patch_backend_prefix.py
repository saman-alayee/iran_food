"""Patch production src/app.js with Passenger subpath strip middleware."""
from __future__ import annotations

import ftplib
import io
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PASSWORD = os.environ.get("IRANFOOD_FTP_PASSWORD", "")
if not PASSWORD:
    PASSWORD = (ROOT / ".ftp-secret.local").read_text(encoding="utf-8").strip()

MARKER = "PASSENGER_MAIN_DOMAIN_PREFIX"
MIDDLEWARE = f"""
  // {MARKER}
  app.use((req, _res, next) => {{
    const prefix = '/dataset/v1';
    if (req.url.startsWith(prefix)) {{
      req.url = req.url.slice(prefix.length) || '/';
    }}
    next();
  }});
"""


def main() -> None:
    ftp = ftplib.FTP("89.39.208.237", timeout=120)
    ftp.login("zjdekntt", PASSWORD)
    buf = io.BytesIO()
    ftp.retrbinary("RETR iran_food/backend/src/app.js", buf.write)
    text = buf.getvalue().decode("utf-8")
    if MARKER in text:
        print("already patched")
    else:
        normalized = text.replace("\r\n", "\n")
        needle = "  app.set('trust proxy', 1);\n\n"
        if needle not in normalized:
            raise SystemExit("unexpected app.js shape")
        normalized = normalized.replace(needle, needle + MIDDLEWARE + "\n")
        text = normalized.replace("\n", "\r\n")
        bio = io.BytesIO(text.encode("utf-8"))
        ftp.storbinary("STOR iran_food/backend/src/app.js", bio)
        print("patched src/app.js")

    # restart Passenger
    try:
        ftp.cwd("iran_food/backend/tmp")
    except ftplib.error_perm:
        ftp.mkd("iran_food/backend/tmp")
        ftp.cwd("iran_food/backend/tmp")
    bio = io.BytesIO(b"restart")
    ftp.storbinary("STOR restart.txt", bio)
    print("touched restart.txt")
    ftp.quit()


if __name__ == "__main__":
    main()
