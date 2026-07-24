#!/usr/bin/env python3
"""Smoke-test CMS API on production without changing visible content."""
from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.request

BASE = "https://iranfoodd.ir/dataset/v1/api"


def call(path, method="GET", data=None, token=None):
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    body = json.dumps(data).encode("utf-8") if data is not None else None
    req = urllib.request.Request(BASE + path, data=body, headers=headers, method=method)
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.status, json.loads(resp.read().decode("utf-8"))


def main() -> int:
    password = os.environ.get("ADMIN_PASSWORD", "")
    if not password:
        print("SKIP_AUTH_TESTS: set ADMIN_PASSWORD to run full CMS save test")
        code, data = call("/content")
        print(f"GET /content: HTTP {code} brand={data.get('data', {}).get('brand')}")
        return 0

    code, login = call("/auth/login", "POST", {"email": "admin@iranfood.ir", "password": password})
    print(f"login: HTTP {code}")
    token = login["data"]["token"]

    code, current = call("/content", token=token)
    print(f"GET /content (auth): HTTP {code}")
    content = current["data"]

    code, saved = call("/content", "PUT", {"content": content}, token=token)
    sys.stdout.buffer.write(
        f"PUT /content (same data): HTTP {code} success={saved.get('success')}\n".encode("utf-8")
    )

    code, verify = call("/content")
    print(f"GET /content after save: HTTP {code} brand={verify.get('data', {}).get('brand')}")
    return 0 if code == 200 and saved.get("success") else 1


if __name__ == "__main__":
    sys.exit(main())
