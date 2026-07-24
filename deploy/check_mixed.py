import re
import ssl
import socket
import urllib.request
from pathlib import Path

for host in ["iranfoodd.ir", "www.iranfoodd.ir"]:
    ctx = ssl.create_default_context()
    try:
        with ctx.wrap_socket(socket.socket(), server_hostname=host) as s:
            s.settimeout(12)
            s.connect((host, 443))
            cert = s.getpeercert()
            sans = [v for k, v in cert.get("subjectAltName", []) if k == "DNS"]
            print(host, "OK", "SAN=", sans)
    except Exception as e:
        print(host, "FAIL", e)

html = urllib.request.urlopen("https://iranfoodd.ir/", timeout=20).read().decode("utf-8", "replace")
mixed = re.findall(r"http://[^\s\"'<>]+", html)
print("mixed http count", len(mixed))
for u in mixed[:20]:
    print(" ", u)
m = re.search(r'apiBase:"([^"]*)"', html)
print("apiBase", m.group(1) if m else "?")
