# OSINT Lookup Chrome Extension

A Chrome extension that allows users to quickly check IP addresses, SHA hashes, and domain names against multiple OSINT (Open Source Intelligence) platforms. Simply highlight the text on any webpage, right-click, and instantly check its reputation across popular security platforms.

## Features

- Supports multiple types of indicators:
  - IPv4 and IPv6 addresses
  - SHA hashes (SHA-1, SHA-256, SHA-512, MD5)
  - Domain names
- Automatically detects the type of indicator and uses the appropriate OSINT platforms
- Validates format before processing
- Automatically opens lookups in multiple OSINT platforms based on the indicator type:
  - **IP Addresses**: AbuseIPDB, VirusTotal, IPVoid, Shodan, Censys, GreyNoise, ThreatCrowd, AlienVault OTX, IBM X-Force Exchange, Talos Intelligence, URLScan.io
  - **SHA Hashes**: VirusTotal, Malware Bazaar, AlienVault OTX, IBM X-Force Exchange, Hybrid Analysis, ThreatMiner
  - **Domains**: VirusTotal, URLScan.io, Censys, ThreatCrowd, AlienVault OTX, IBM X-Force Exchange, Talos Intelligence, SecurityTrails, DomainTools
- Simple right-click context menu integration
- Clean and intuitive popup interface

## Usage

1. Highlight any IP address, SHA hash, or domain name on a webpage
2. Right-click the selected text
3. Click "Check on OSINT Platforms" from the context menu
4. New tabs will open for each relevant OSINT platform, automatically searching for the selected indicator
5. If the selected text is not a valid indicator, you'll receive an alert


## Development Notes

- The extension uses Manifest V3
- Required permissions:
  - `contextMenus`: For the right-click menu functionality
  - `activeTab`: To interact with the current tab
  - `scripting`: To execute scripts for showing alerts

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is licensed under the MIT License - see the LICENSE file for details.
