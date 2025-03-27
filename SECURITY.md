# Security Policy

## Reporting a Vulnerability

This project is currently maintained by @staycold666 only.

If you discover a security vulnerability within this OSINT Lookup Chrome Extension, please send an email directly to the maintainer. All security vulnerabilities will be promptly addressed.

## Repository Security

This repository is protected by the following security measures:

1. **Branch Protection**: The main branch is protected and requires code owner approval for any changes.
2. **CODEOWNERS**: All code changes require review and approval from the repository owner (@staycold666).
3. **Limited Contributor Access**: Only the repository owner has push access to the main branch.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Security Best Practices

As this extension handles potentially sensitive data (IP addresses, domains, and hashes), it follows these security practices:

- Does not store user data
- Does not transmit data to any third-party servers (only opens URLs to public OSINT platforms)
- Uses manifest V3 for enhanced security
- Requests minimal permissions required for functionality
