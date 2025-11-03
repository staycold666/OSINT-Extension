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

// Check if Tab Groups API is available
function isTabGroupsSupported() {
  const hasAPI = typeof chrome.tabGroups !== 'undefined' &&
                 typeof chrome.tabGroups.group === 'function' &&
                 typeof chrome.tabGroups.update === 'function';
  
  // Force Tab Groups API usage if we have the permission in manifest
  // This works around Chrome service worker API detection issues
  return hasAPI || (chrome.runtime.getManifest().permissions?.includes('tabGroups'));
}

// Color mapping for different input types
const TYPE_COLORS = {
  'ip': 'blue',
  'hash': 'red',
  'domain': 'green'
};

// Tab grouping utility functions
async function createTabsAndGroup(inputType, selectedText, platforms) {
  try {
    if (isTabGroupsSupported()) {
      return await createTabsWithGroups(inputType, selectedText, platforms);
    } else {
      // Fallback to legacy behavior for Chrome < 89
      return await createTabsLegacy(selectedText, platforms);
    }
  } catch (error) {
    console.error('Tab creation/grouping failed, falling back to legacy:', error);
    // Fallback to legacy behavior on any error
    return await createTabsLegacy(selectedText, platforms);
  }
}

// Create tabs with Tab Groups API
async function createTabsWithGroups(inputType, selectedText, platforms) {
  const tabIds = [];
  
  // Create all tabs first
  for (const [platform, baseUrl] of Object.entries(platforms)) {
    try {
      const tab = await chrome.tabs.create({
        url: `${baseUrl}${selectedText}`,
        active: false
      });
      tabIds.push(tab.id);
    } catch (error) {
      console.error(`Failed to create tab for ${platform}:`, error);
    }
  }
  
  if (tabIds.length === 0) {
    throw new Error('No tabs were created successfully');
  }
  
  // Wait a moment for tabs to be ready
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Group the tabs using chrome.tabs.group (Manifest V3 correct API)
  let groupId;
  try {
    groupId = await chrome.tabs.group({ tabIds });
  } catch (error) {
    console.error('Failed to group tabs:', error);
    throw error;
  }
  
  // Set group properties
  const typeLabel = inputType.toUpperCase();
  try {
    await chrome.tabGroups.update(groupId, {
      title: `OSINT - ${typeLabel} Lookup`,
      color: TYPE_COLORS[inputType],
      collapsed: true
    });
  } catch (error) {
    console.error('Failed to update group properties:', error);
    throw error;
  }
  
  return { success: true, groupId, tabIds };
}

// Legacy tab creation (fallback for Chrome < 89)
async function createTabsLegacy(selectedText, platforms) {
  const tabIds = [];
  
  for (const [platform, baseUrl] of Object.entries(platforms)) {
    const tab = await chrome.tabs.create({
      url: `${baseUrl}${selectedText}`,
      active: false
    });
    tabIds.push(tab.id);
  }
  
  return { success: true, tabIds };
}

// OSINT platform URLs for IP addresses
const IP_OSINT_PLATFORMS = {
  AbuseIPDB: 'https://www.abuseipdb.com/check/',
  VirusTotal: 'https://www.virustotal.com/gui/ip-address/',
  IPVoid: 'https://www.ipvoid.com/scan/',
  Shodan: 'https://www.shodan.io/host/',
  Censys: 'https://censys.io/ipv4/',
  GreyNoise: 'https://viz.greynoise.io/ip/',
  AlienVaultOTX: 'https://otx.alienvault.com/indicator/ip/',
  IBMXForce: 'https://exchange.xforce.ibmcloud.com/ip/',
  TalosIntelligence: 'https://talosintelligence.com/reputation_center/lookup?search=',
  URLScan: 'https://urlscan.io/ip/',
  IPQualityScore: 'https://www.ipqualityscore.com/free-ip-lookup-proxy-vpn-test/lookup/'
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
  AlienVaultOTX: 'https://otx.alienvault.com/indicator/domain/',
  IBMXForce: 'https://exchange.xforce.ibmcloud.com/url/',
  TalosIntelligence: 'https://talosintelligence.com/reputation_center/lookup?search=',
  SecurityTrails: 'https://securitytrails.com/domain/',
  DomainTools: 'https://whois.domaintools.com/'
};

// Create context menu items when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'checkOSINT',
    title: 'Check on OSINT Platforms',
    contexts: ['selection']
  });
  
  chrome.contextMenus.create({
    id: 'checkAnyRunSafe',
    title: 'Check with any.run Safebrowsing',
    contexts: ['link', 'selection']
  });
});

// Global execution tracker to prevent double execution
let isExecuting = false;

// Handle context menu click
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'checkOSINT') {
    // Prevent concurrent executions
    if (isExecuting) {
      return;
    }
    
    isExecuting = true;
    const selectedText = info.selectionText.trim();
    
    try {
      // Determine the type of the selected text
      const inputType = determineInputType(selectedText);
      
      if (inputType === 'ip') {
        // Open IP OSINT platforms with Tab Groups API
        await createTabsAndGroup(inputType, selectedText, IP_OSINT_PLATFORMS);
      } else if (inputType === 'hash') {
        // Open Hash OSINT platforms with Tab Groups API
        await createTabsAndGroup(inputType, selectedText, HASH_OSINT_PLATFORMS);
      } else if (inputType === 'domain') {
        // Open Domain OSINT platforms with Tab Groups API
        await createTabsAndGroup(inputType, selectedText, DOMAIN_OSINT_PLATFORMS);
      } else {
        // Show error message if input is invalid
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            alert('Invalid format. Please select a valid IP address, SHA hash, or domain name.');
          }
        });
      }
    } catch (error) {
      console.error('Context menu execution failed:', error);
    } finally {
      // Always reset the execution flag
      isExecuting = false;
    }
  } else if (info.menuItemId === 'checkAnyRunSafe') {
    // Handle any.run Safebrowsing
    // Prefer linkUrl (actual href) over selectionText (display text)
    const urlToCheck = info.linkUrl || info.selectionText?.trim();
    
    if (urlToCheck) {
      try {
        // Open any.run Safebrowsing with the selected URL
        await chrome.tabs.create({
          url: `https://app.any.run/safe/${urlToCheck}`,
          active: true
        });
      } catch (error) {
        console.error('Failed to open any.run Safebrowsing:', error);
      }
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
