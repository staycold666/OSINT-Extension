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

## Installation for Development

### Prerequisites

- Google Chrome browser
- Basic understanding of Chrome extensions

### Local Setup

1. Clone or download this repository to your local machine
2. Open Google Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" by toggling the switch in the top-right corner
4. Click "Load unpacked" button in the top-left corner
5. Select the directory containing the extension files (where manifest.json is located)
6. The extension should now appear in your Chrome toolbar

## Usage

1. Highlight any IP address, SHA hash, or domain name on a webpage
2. Right-click the selected text
3. Click "Check on OSINT Platforms" from the context menu
4. New tabs will open for each relevant OSINT platform, automatically searching for the selected indicator
5. If the selected text is not a valid indicator, you'll receive an alert

## Publishing to Chrome Web Store

### Prerequisites

1. Create a [Google Developer account](https://chrome.google.com/webstore/devconsole)
2. Pay one-time developer registration fee ($5 USD)
3. Prepare the following materials:
   - High-quality icon images (16x16, 48x48, and 128x128 pixels)
   - At least one screenshot of your extension
   - Short description (up to 132 characters)
   - Detailed description
   - Privacy policy (if collecting any user data)

### Submission Process

1. Package your extension:
   - Zip all extension files (manifest.json, background.js, popup.html, icons)
   - Make sure the zip file is under 10MB
   - Don't include unnecessary files like README.md or .git

2. Submit through Chrome Web Store:
   - Go to [Chrome Developer Dashboard](https://chrome.google.com/webstore/devconsole)
   - Click "New Item"
   - Upload your zip file
   - Fill in all required fields:
     - Store listing information
     - Privacy practices
     - Payment and distribution
   - Submit for review

3. Wait for approval:
   - Review process typically takes a few business days
   - Address any feedback from the review team if necessary
   - Once approved, your extension will be published to the Chrome Web Store

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
