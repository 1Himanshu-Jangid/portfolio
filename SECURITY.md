# Security Policy

## Supported Versions

The following versions of this project are currently supported with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 20.x    | :white_check_mark: |
| < 20.0  | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability within this repository, please report it responsibly:

1. **Do not create a public issue** on GitHub.
2. Send an email to the repository owner: [Himanshu Jangid](https://github.com/1Himanshu-Jangid).
3. Include details of the vulnerability, steps to reproduce, and potential impact.

All legitimate vulnerability reports will be acknowledged within 48 hours, and a fix will be published promptly.

## Security Practices Implemented

- **Content Security Policy (CSP)**: Strict restriction of trusted script, style, font, and image execution.
- **Referrer Policy**: Set to `strict-origin-when-cross-origin` to minimize private data leakage across origins.
- **Permissions Policy**: Unnecessary sensor, camera, microphone, and geolocation APIs explicitly blocked.
- **Link Target Protection**: All external links enforce `rel="noopener noreferrer"` to protect against tabnabbing and window tampering.
- **Automated Scanning**: Monitored via GitHub CodeQL and Dependabot.
