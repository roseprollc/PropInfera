# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of our application seriously. If you believe you've found a security vulnerability, please follow these steps:

1. **Do not disclose the vulnerability publicly**
2. **Email security@propinfera.com** with details about the vulnerability
3. Include the following information:
   - Type of issue
   - Full paths of affected source files
   - Location of affected code
   - Any special configuration required to reproduce the issue
   - Step-by-step instructions to reproduce the issue
   - Proof-of-concept or exploit code (if possible)
   - Impact of the issue

## What to expect

- We will acknowledge receipt of your vulnerability report within 3 business days
- We will provide a more detailed response within 10 business days
- We will handle your report with strict confidentiality
- We will keep you informed of our progress

## Security Measures

Our application implements the following security measures:

- Rate limiting on API routes
- Content Security Policy headers
- XSS Protection
- Frame protection
- Strict Referrer Policy
- Permissions Policy
- Authentication and authorization
- Input validation and sanitization
- Secure session management
- Regular security audits

## Safe Harbor

We support responsible disclosure practices and will not take legal action against you for security research conducted in good faith and in accordance with this policy. 