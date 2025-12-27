# Changelog

All notable changes to this project will be documented in this file.

**Release Notes**:
- [Korean](docs/RELEASE_NOTES/RELEASE_NOTES.md)

## [Unreleased]

## [1.0.0] - 2025-12-24

### Changed
- Refine recommended OpenAI models for Codex CLI, Cursor, GitHub Copilot, and Windsurf agents to prioritize `gpt-5.1-codex medium/high`, keeping `gpt-5.1 medium/high` as a general-purpose fallback.
- Align templates, rules, and prompts with GPT-5.1 by updating recommended OpenAI model names for Codex CLI, Cursor, GitHub Copilot, and Windsurf agents to `GPT-5.1 high or medium`.
- Tighten language handling so all generated Markdown (requirements, design, tasks, research, validation) uses the spec’s target language (`spec.json.language`) and defaults to English (`en`) when unspecified.
- Make EARS patterns and requirements traceability more consistent by keeping EARS trigger phrases (`When`, `If`, `While`, `Where`, `The system shall`, `The [system] shall`) as fixed English fragments, localizing only the variable slots, and enforcing numeric requirement IDs across all phases (e.g. `Requirement 1`, `1.1`, `2.3`) with fast failure when IDs are missing or invalid instead of falling back to free-form labels.
### Fixed
- Align DEV_GUIDELINES-related tests with the stricter language-handling rules introduced in v0.5.0 so `npm test` passes cleanly for v1.0.0.

## [0.5.0] - 2025-11-10

### Added
- Kiro IDE-style Spec-Driven Development system
- 3-phase approval workflow (Requirements → Design → Tasks → Implementation)
- EARS format requirement definition support
- Hierarchical requirement structure
- Automatic progress tracking and hooks
- Basic Slash Commands set
- Manual approval gates for quality assurance
- Specification compliance checking
- Context preservation functionality

## [0.0.1] - 2025-09-10

### Added
- Initial project structure

---

## Links

- **Repository**: [gaebalai/k-sdd](https://github.com/gaebalai/k-sdd)
- **npm Package**: [k-sdd](https://www.npmjs.com/package/k-sdd)
- **Release Notes**:
  - [Korean](docs/RELEASE_NOTES/RELEASE_NOTES.md)
- **Documentation**:
  - [English](tools/k-sdd/README_en.md)
  - [Korean](tools/k-sdd/README.md)

---
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
