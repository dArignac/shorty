// The code and most of the comments are taken from https://github.com/django/django/blob/main/django/core/validators.py#L65.
// It does NOT contain the IPv6 checks.
const ul = "\u00a1-\uffff";
const ipv4_re =
  "(?:25[0-5]|2[0-4]\\d|[0-1]?\\d?\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|[0-1]?\\d?\\d)){3}";
const ipv6_re = "\\[[0-9a-f:.]+\\]";
const hostname_re =
  "[a-z" + ul + "0-9](?:[a-z" + ul + "0-9-]{0,61}[a-z" + ul + "0-9])?";
const domain_re = "(?:\\.(?!-)[a-z" + ul + "0-9-]{1,63}(?<!-))*";
const tld_re =
  "\\." +
  "(?!-)" +
  "(?:[a-z" +
  ul +
  "-]{2,63}" +
  "|xn--[a-z0-9]{1,59})" +
  "(?<!-)" +
  "\\.?";
const host_re = "(" + hostname_re + domain_re + tld_re + "|localhost)";
const regexURL = new RegExp(
  "^(?:[a-z0-9.+-]*)://" +
    "(?:[^\\s:@/]+(?::[^\\s:@/]*)?@)?" +
    "(?:" +
    ipv4_re +
    "|" +
    ipv6_re +
    "|" +
    host_re +
    ")" +
    "(?::\\d{2,5})?" +
    "(?:[/?#][^\\s]*)?",
  "i"
);

export function isValidURL(value: string): boolean {
  // check schemes
  const splitScheme = value.split("://");
  if (
    !["http", "https", "ftp", "ftps"].includes(
      splitScheme[0].toLocaleLowerCase()
    )
  )
    return false;

  // check regex
  if (value.search(regexURL) < 0) return false;

  // check hostname length
  const url = new URL(value);
  if (url.hostname.length > 253) return false;

  return true;
}
