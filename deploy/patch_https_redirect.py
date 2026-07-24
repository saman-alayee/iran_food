#!/usr/bin/env python3
"""Patch live index.html with HTTP->HTTPS redirect script + upload htaccess."""
from __future__ import annotations

import ftplib
import io
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PASSWORD = (ROOT / ".ftp-secret.local").read_text(encoding="utf-8").strip()
SNIPPET = (
    '<script>if(location.protocol==="http:"){location.replace("https://"+location.host+location.pathname+location.search+location.hash);}</script>'
)


def main() -> None:
    ftp = ftplib.FTP("89.39.208.237", timeout=120)
    ftp.login("zjdekntt", PASSWORD)

    for name in ["index.html", "200.html", "404.html"]:
        buf = io.BytesIO()
        try:
            ftp.retrbinary(f"RETR public_html/{name}", buf.write)
        except ftplib.error_perm:
            continue
        html = buf.getvalue().decode("utf-8", errors="replace")
        if SNIPPET in html:
            print(name, "already patched")
            continue
        if "<head>" in html:
            html = html.replace("<head>", "<head>" + SNIPPET, 1)
        elif "<head " in html:
            i = html.find(">", html.find("<head"))
            html = html[: i + 1] + SNIPPET + html[i + 1 :]
        else:
            print(name, "skip no head")
            continue
        bio = io.BytesIO(html.encode("utf-8"))
        ftp.storbinary(f"STOR public_html/{name}", bio)
        print(name, "patched")

    ht = ROOT / "public_html" / ".htaccess"
    with ht.open("rb") as f:
        ftp.storbinary("STOR public_html/.htaccess", f)
    print(".htaccess uploaded")
    ftp.quit()


if __name__ == "__main__":
    main()
