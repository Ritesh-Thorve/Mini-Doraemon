---
title: "Web Cache Deception"
date: "2026-09-28"
description: "Notes about web cache deception."
---

# Web Cache Deception

Web Cache Deception (WCD) occurs when an attacker tricks a user into loading a dynamically generated page (which contains sensitive data) in a way that causes the caching proxy to cache the response. The attacker can then fetch the cached response to steal the sensitive data.

## Introduction

Modern applications heavily rely on caching layers to improve performance and reduce server load. These caching layers usually sit between the user and the application server (e.g., CDNs, reverse proxies). If misconfigured, they can cache content that is meant to be private to a specific user.

## Testing

A common testing technique involves manipulating the file extension or path delimiters to trick the cache into believing it is requesting a static resource.

```http
GET /my-account/test.css HTTP/2
Host: example.com
```

If the backend server ignores the `test.css` portion and responds with the user's account page, but the caching layer caches it because it sees the `.css` extension, the attack is successful.

### Common Delimiters

When testing for path mapping issues, try using various delimiters:

- `;` (Semicolon)
- `%00` (Null byte)
- `%0A` (Newline)
- `?` (Question mark)

Example:

```
GET /profile;test.jpg
```

## Remediation

1.  **Cache Control Headers**: Ensure that sensitive endpoints return strict `Cache-Control` headers (e.g., `Cache-Control: no-cache, no-store, must-revalidate`).
2.  **Strict Path Matching**: Configure the caching layer to only cache based on strict, exact path matching rather than relying solely on file extensions.
3.  **Vary Header**: Use the `Vary` header correctly, although it might not prevent all WCD scenarios if the cache key relies on extensions.
