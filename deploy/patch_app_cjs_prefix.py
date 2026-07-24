"""Inject /dataset/v1 prefix strip into production app.cjs and use app.cjs for Passenger."""
from __future__ import annotations

import ftplib
import io
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PASSWORD = (ROOT / ".ftp-secret.local").read_text(encoding="utf-8").strip()
MARKER = "PASSENGER_MAIN_DOMAIN_PREFIX"
SNIPPET = f"""
  // {MARKER}
  app2.use((req, _res, next) => {{
    const prefix = "/dataset/v1";
    if (req.url.startsWith(prefix)) {{
      req.url = req.url.slice(prefix.length) || "/";
    }}
    next();
  }});
"""

HTACCESS = ROOT / "public_html" / "dataset" / "v1" / ".htaccess"


def main() -> None:
    ftp = ftplib.FTP("89.39.208.237", timeout=120)
    ftp.login("zjdekntt", PASSWORD)

    buf = io.BytesIO()
    ftp.retrbinary("RETR iran_food/backend/app.cjs", buf.write)
    text = buf.getvalue().decode("utf-8")
    if MARKER not in text:
        needle = 'app2.set("trust proxy", 1);'
        if needle not in text:
            raise SystemExit("app.cjs trust proxy anchor missing")
        text = text.replace(needle, needle + SNIPPET)
        bio = io.BytesIO(text.encode("utf-8"))
        ftp.storbinary("STOR iran_food/backend/app.cjs", bio)
        print("patched app.cjs")
    else:
        print("app.cjs already patched")

    ftp.cwd("public_html")
    with HTACCESS.open("rb") as f:
        ht = f.read().decode("utf-8")
    ht = ht.replace("PassengerStartupFile app.js", "PassengerStartupFile app.cjs")
    bio = io.BytesIO(ht.encode("utf-8"))
    ftp.storbinary("STOR dataset/v1/.htaccess", bio)
    print("uploaded dataset/v1/.htaccess (app.cjs)")

    try:
        ftp.cwd("iran_food/backend/tmp")
    except ftplib.error_perm:
        ftp.mkd("iran_food/backend/tmp")
        ftp.cwd("iran_food/backend/tmp")
    ftp.storbinary("STOR restart.txt", io.BytesIO(b"restart"))
    print("restart touched")
    ftp.quit()


if __name__ == "__main__":
    main()
