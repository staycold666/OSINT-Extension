# Changelog

All notable changes to the OSINT Lookup Chrome Extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0.0] - 2025-01-26

### Added
- **IPQualityScore Integration**: Added IPQualityScore as the 11th IP lookup platform for comprehensive threat intelligence and fraud detection
- **Chrome Tab Groups Management**: Implemented automatic tab grouping for OSINT lookups to reduce tab clutter and improve organization
  - OSINT tabs are automatically organized into color-coded groups
  - Groups are collapsible for better tab management
  - Fallback support for older Chrome versions (pre-89) without tab groups API
- Enhanced user experience with organized, color-coded tab groups for better workflow management

### Changed
- Updated total IP platform count from 10 to 11 platforms
- Improved popup interface with notification about new tab grouping feature
- Enhanced documentation to reflect new features and platform count

### Technical Notes
- Requires Chrome 89+ for full tab groups functionality (graceful degradation for older versions)
- Added `tabGroups` permission to manifest for tab organization features
- Maintained backward compatibility with existing functionality

---

## [1.2.0.0] - Previous Release

### Features
- Support for IP addresses, SHA hashes, and domain lookups
- Integration with 10 IP platforms, 6 hash platforms, and 9 domain platforms
- Context menu integration for easy access
- Automatic indicator type detection and validation
- Clean and intuitive popup interface
