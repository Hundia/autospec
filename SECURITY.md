# Security Policy

## Supported Versions

| Version | Supported          |
|---------|--------------------|
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in AutoSpec, please report it responsibly.

**Do NOT open a public GitHub issue for security vulnerabilities.**

Instead, please email the maintainers or use [GitHub's private vulnerability reporting](https://github.com/Hundia/autospec/security/advisories/new).

### What to include

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### Response timeline

- **Acknowledgment**: Within 48 hours
- **Initial assessment**: Within 1 week
- **Fix timeline**: Depends on severity, typically within 2 weeks for critical issues

## Scope

AutoSpec is a CLI tool that generates files locally. It does not:
- Run a server or accept network connections
- Process untrusted user input in production contexts
- Store or transmit credentials

Security concerns are primarily around:
- Template injection in generated files
- Dependency supply chain
- File system operations (path traversal)
