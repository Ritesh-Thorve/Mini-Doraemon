---
title: "Reflected Cross-Site Scripting (XSS) via Hidden Endpoint Discovered Through JavaScript Analysis"
date: "2026-04-08"
---

## Vulnerability Class

Reflected Cross-Site Scripting (XSS)

## Summary

While manually reviewing the application's client-side JavaScript bundles, an undocumented endpoint was identified. It was not linked from any visible part of the UI or referenced in standard application flows. Testing revealed that a request parameter was reflected directly into the HTML response without proper output encoding or sanitization.

Submitting a crafted payload in the vulnerable parameter resulted in arbitrary JavaScript execution in the context of the application's origin. The proof of concept was:

```html
<img src=e onerror=alert(document.domain)>
```

The payload executed successfully and displayed the application's domain in an alert, confirming that attacker-controlled script ran under the target origin.

## Impact

Arbitrary JavaScript execution in the context of the vulnerable application could enable actions such as session or cookie theft where cookies are not otherwise protected, credential harvesting through injected fake login forms, or actions performed on behalf of the victim.

Because the endpoint was undocumented and not exposed through normal navigation, it may not have been covered by prior security testing or automated scanning. Any user induced to visit a crafted link containing the payload could be affected. The issue was reflected rather than stored and required user interaction, making phishing or malicious link distribution plausible attack paths.

## Methodology

1. Reviewed the application's client-side JavaScript bundles, retrieved through the browser's network tools and beautified or deobfuscated for readability, to map API routes and endpoints referenced in code but not surfaced in the visible UI.
2. Identified a hidden endpoint referenced in the JavaScript source that was not reachable through normal navigation or linked pages.
3. Manually explored the endpoint's parameters and observed that one parameter was reflected into the page's HTML response.
4. Submitted a benign marker string and confirmed that the value appeared in the response without encoding.
5. Tested the proof-of-concept payload shown above. It triggered JavaScript execution when the response rendered, confirmed by an alert displaying `document.domain`.
6. Captured the request, response, and browser execution, then reproduced the issue in fresh unauthenticated sessions.

## Root Cause

The vulnerable endpoint reflected a user-supplied parameter directly into the HTML response without output encoding or context-aware sanitization, allowing HTML and JavaScript injection. The endpoint's undocumented status and discoverability through JavaScript source analysis suggest it may have been omitted from standard security review or automated scanning coverage.

## Recommended Remediation

- Apply context-aware output encoding to all user-supplied input reflected into HTML, using HTML entity encoding where appropriate.
- Implement and enforce a strict Content Security Policy (CSP) to reduce the impact of any XSS that remains.
- Include all endpoints, including those not linked from the UI, in security testing scope. Client-side JavaScript can reveal routes that normal browsing does not expose.
- Use a template or framework with automatic output escaping rather than relying on manual encoding at each reflection point.

## Program Status

Reported through the program's VDP disclosure process. The target name, domain, and other identifying details have been withheld in accordance with program policy.