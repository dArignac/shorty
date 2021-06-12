import base64
import json
import re
from urllib.parse import urlsplit
from uuid import uuid4
import logging

import azure.functions as func

alphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"

# The code and most of the comments are taken from https://github.com/django/django/blob/main/django/core/validators.py#L65.
# To not install Django as dependency it was extracted.
# It does NOT contain the IPv6 checks.
def is_valid_url(value):
    # Unicode letters range (must not be a raw string).
    ul = "\u00a1-\uffff"
    # IP patterns
    ipv4_re = (
        r"(?:25[0-5]|2[0-4]\d|[0-1]?\d?\d)(?:\.(?:25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}"
    )
    ipv6_re = r"\[[0-9a-f:.]+\]"  # (simple regex, validated later)
    # Host patterns
    hostname_re = (
        r"[a-z" + ul + r"0-9](?:[a-z" + ul + r"0-9-]{0,61}[a-z" + ul + r"0-9])?"
    )
    # Max length for domain name labels is 63 characters per RFC 1034 sec. 3.1
    domain_re = r"(?:\.(?!-)[a-z" + ul + r"0-9-]{1,63}(?<!-))*"
    tld_re = (
        r"\."  # dot
        r"(?!-)"  # can't start with a dash
        r"(?:[a-z" + ul + "-]{2,63}"  # domain label
        r"|xn--[a-z0-9]{1,59})"  # or punycode label
        r"(?<!-)"  # can't end with a dash
        r"\.?"  # may have a trailing dot
    )
    host_re = "(" + hostname_re + domain_re + tld_re + "|localhost)"

    regex = re.compile(
        r"^(?:[a-z0-9.+-]*)://"  # scheme is validated separately
        r"(?:[^\s:@/]+(?::[^\s:@/]*)?@)?"  # user:pass authentication
        r"(?:" + ipv4_re + "|" + ipv6_re + "|" + host_re + ")"
        r"(?::\d{2,5})?"  # port
        r"(?:[/?#][^\s]*)?"  # resource path
        r"\Z",
        re.IGNORECASE,
    )

    logging.info(regex)

    # check schemes
    if value.split("://")[0].lower() not in ["http", "https", "ftp", "ftps"]:
        return False

    # check regex patterns
    if not regex.search(str(value)):
        return False

    # The maximum length of a full host name is 253 characters per RFC 1034
    # section 3.1. It's defined to be 255 bytes or less, but this includes
    # one byte for the length of the name and one byte for the trailing dot
    # that's used to indicate absolute names in DNS.
    if len(urlsplit(value).hostname) > 253:
        return False

    return True


def create_short_code():
    number = uuid4().int
    output = ""
    while number:
        if len(output) == 5:
            return output
        number, digit = divmod(number, len(alphabet))
        output += alphabet[digit]
    return output


def response_unauthorized():
    return func.HttpResponse(json.dumps({"error": "Not authorized"}), status_code=401)


def main(req: func.HttpRequest, entry: str, result: func.Out[str]) -> func.HttpResponse:
    if not "x-ms-client-principal" in req.headers:
        return response_unauthorized()

    # https://docs.microsoft.com/en-us/azure/static-web-apps/user-information?tabs=javascript
    principal = json.loads(
        base64.b64decode(req.headers["x-ms-client-principal"]).decode("ascii")
    )

    if not "authenticated" in principal["userRoles"]:
        return response_unauthorized()

    # entries contains an URL if it is already existing in the table storage
    # see the functions.json "filter" and "take" properties of the binding
    found_entry = json.loads(entry)
    if len(found_entry) == 1:
        return func.HttpResponse(
            json.dumps({"id": found_entry[0]["RowKey"]}), status_code=201
        )

    try:
        body = req.get_json()
    except ValueError:
        return func.HttpResponse("No body received", status_code=400)

    if not "url" in body:
        return func.HttpResponse("Invalid body received", status_code=400)

    url = body["url"]

    if not is_valid_url(url):
        return func.HttpResponse("Invalid URL received", status_code=400)

    code = create_short_code()
    data = {"URL": url, "PartitionKey": "urls", "RowKey": code}
    result.set(json.dumps(data))

    return func.HttpResponse(json.dumps({"id": code}), status_code=201)
