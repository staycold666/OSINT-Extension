// Regular expressions for validation
const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
const ipv6Regex = /^(?:(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,7}:|(?:[0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,5}(?::[0-9a-fA-F]{1,4}){1,2}|(?:[0-9a-fA-F]{1,4}:){1,4}(?::[0-9a-fA-F]{1,4}){1,3}|(?:[0-9a-fA-F]{1,4}:){1,3}(?::[0-9a-fA-F]{1,4}){1,4}|(?:[0-9a-fA-F]{1,4}:){1,2}(?::[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:(?:(?::[0-9a-fA-F]{1,4}){1,6})|:(?:(?::[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(?::[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(?:ffff(?::0{1,4}){0,1}:){0,1}(?:(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])|(?:[0-9a-fA-F]{1,4}:){1,4}:(?:(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;

// SHA hash regex patterns (supports SHA-1, SHA-256, SHA-512, and others)
const sha1Regex = /^[a-fA-F0-9]{40}$/;
const sha256Regex = /^[a-fA-F0-9]{64}$/;
const sha512Regex = /^[a-fA-F0-9]{128}$/;
const md5Regex = /^[a-fA-F0-9]{32}$/;

// Domain name regex
const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;

// OSINT platform URLs for IP addresses
const IP_OSINT_PLATFORMS = {
  AbuseIPDB: 'https://www.abuseipdb.com/check/',
  VirusTotal: 'https://www.virustotal.com/gui/ip-address/',
  IPVoid: 'https://www.ipvoid.com/scan/',
  Shodan: 'https://www.shodan.io/host/',
  Censys: 'https://censys.io/ipv4/',
  GreyNoise: 'https://viz.greynoise.io/ip/',
  ThreatCrowd: 'https://www.threatcrowd.org/ip.php?ip=',
  AlienVaultOTX: 'https://otx.alienvault.com/indicator/ip/',
  IBMXForce: 'https://exchange.xforce.ibmcloud.com/ip/',
  TalosIntelligence: 'https://talosintelligence.com/reputation_center/lookup?search=',
  URLScan: 'https://urlscan.io/ip/'
};

// OSINT platform URLs for SHA hashes
const HASH_OSINT_PLATFORMS = {
  VirusTotal: 'https://www.virustotal.com/gui/file/',
  Malware_Bazaar: 'https://bazaar.abuse.ch/sample/',
  AlienVaultOTX: 'https://otx.alienvault.com/indicator/file/',
  IBMXForce: 'https://exchange.xforce.ibmcloud.com/malware/',
  Hybrid_Analysis: 'https://www.hybrid-analysis.com/search?query=',
  ThreatMiner: 'https://www.threatminer.org/sample.php?q=',
  MalwareBazaar: 'https://bazaar.abuse.ch/sample/'
};

// OSINT platform URLs for domains
const DOMAIN_OSINT_PLATFORMS = {
  VirusTotal: 'https://www.virustotal.com/gui/domain/',
  URLScan: 'https://urlscan.io/domain/',
  Censys: 'https://censys.io/certificates?q=',
  ThreatCrowd: 'https://www.threatcrowd.org/domain.php?domain=',
  AlienVaultOTX: 'https://otx.alienvault.com/indicator/domain/',
  IBMXForce: 'https://exchange.xforce.ibmcloud.com/url/',
  TalosIntelligence: 'https://talosintelligence.com/reputation_center/lookup?search=',
  SecurityTrails: 'https://securitytrails.com/domain/',
  DomainTools: 'https://whois.domaintools.com/'
};

// Create context menu item when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'checkOSINT',
    title: 'Check on OSINT Platforms',
    contexts: ['selection']
  });
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'checkOSINT') {
    const selectedText = info.selectionText.trim();
    
    // Determine the type of the selected text
    const inputType = determineInputType(selectedText);
    
    if (inputType === 'ip') {
      // Open IP OSINT platforms
      for (const [platform, baseUrl] of Object.entries(IP_OSINT_PLATFORMS)) {
        chrome.tabs.create({
          url: `${baseUrl}${selectedText}`,
          active: false // Keep the current tab focused
        });
      }
    } else if (inputType === 'hash') {
      // Open Hash OSINT platforms
      for (const [platform, baseUrl] of Object.entries(HASH_OSINT_PLATFORMS)) {
        chrome.tabs.create({
          url: `${baseUrl}${selectedText}`,
          active: false
        });
      }
    } else if (inputType === 'domain') {
      // Open Domain OSINT platforms
      for (const [platform, baseUrl] of Object.entries(DOMAIN_OSINT_PLATFORMS)) {
        chrome.tabs.create({
          url: `${baseUrl}${selectedText}`,
          active: false
        });
      }
    } else {
      // Show error message if input is invalid
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          alert('Invalid format. Please select a valid IP address, SHA hash, or domain name.');
        }
      });
    }
  }
});

// Function to determine the type of input (IP, hash, or domain)
function determineInputType(text) {
  if (isValidIP(text)) {
    return 'ip';
  } else if (isValidHash(text)) {
    return 'hash';
  } else if (isValidDomain(text)) {
    return 'domain';
  } else {
    return 'unknown';
  }
}

// Function to validate IP address format
function isValidIP(ip) {
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

// Function to validate hash format
function isValidHash(hash) {
  return md5Regex.test(hash) || sha1Regex.test(hash) || sha256Regex.test(hash) || sha512Regex.test(hash);
}

// Function to validate domain format
function isValidDomain(domain) {
  return domainRegex.test(domain);
}
