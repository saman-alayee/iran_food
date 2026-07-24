#!/usr/bin/env python3
import json
import os
import sys
import urllib.error
import urllib.request

BASE = "https://iranfoodd.ir/dataset/v1/api/auth"


def safe_print(label: str, code: int, text: str) -> None:
    line = f"{label}: HTTP {code} {text}"
    sys.stdout.buffer.write((line + "\n").encode("utf-8", errors="replace"))


def call(path, method="GET", data=None, token=None):
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    body = json.dumps(data).encode("utf-8") if data is not None else None
    req = urllib.request.Request(
        BASE + path, data=body, headers=headers, method=method
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            text = resp.read().decode("utf-8")
            return resp.status, text
    except urllib.error.HTTPError as exc:
        text = exc.read().decode("utf-8")
        return exc.code, text


def main() -> int:
    email = os.environ.get("ADMIN_EMAIL", "admin@iranfood.ir")
    password = os.environ.get("ADMIN_PASSWORD", "")
    if not password:
        print("SKIP_FULL_TEST: set ADMIN_PASSWORD env var to run live password change test")
        code, text = call(
            "/change-password",
            "POST",
            {
                "currentPassword": "x",
                "newPassword": "12345678",
                "confirmPassword": "12345678",
            },
        )
        safe_print("no_auth_change_password", code, text)
        code, text = call(
            "/change-password",
            "POST",
            {
                "currentPassword": "x",
                "newPassword": "12345678",
                "confirmPassword": "12345678",
            },
            token="invalid",
        )
        safe_print("invalid_token_change_password", code, text)
        return 0 if code in (401, 400) else 1

    code, text = call("/login", "POST", {"email": email, "password": password})
    safe_print("login", code, text)
    if code != 200:
        return 1
    token = json.loads(text)["data"]["token"]

    code, text = call(
        "/change-password",
        "POST",
        {
            "currentPassword": "definitely-wrong",
            "newPassword": "TempPass123!",
            "confirmPassword": "TempPass123!",
        },
        token=token,
    )
    safe_print("wrong_current_password", code, text)
    if code != 400:
        return 1

    temp = "TempPass123!"
    code, text = call(
        "/change-password",
        "POST",
        {
            "currentPassword": password,
            "newPassword": temp,
            "confirmPassword": temp,
        },
        token=token,
    )
    safe_print("change_to_temp", code, text)
    if code != 200:
        return 1
    new_token = json.loads(text)["data"]["token"]

    code, text = call(
        "/change-password",
        "POST",
        {
            "currentPassword": temp,
            "newPassword": password,
            "confirmPassword": password,
        },
        token=new_token,
    )
    safe_print("revert_password", code, text)
    return 0 if code == 200 else 1


if __name__ == "__main__":
    sys.exit(main())
