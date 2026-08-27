---
name: visa-advisor
description: Recommends the appropriate visa category, explains validity, entry types (Single/Multiple), and processing turnaround times based on destination country and trip purpose.
---

# Visa Advisor Skill

Use this skill when an applicant:

1. Asks which visa they need for a specific destination (e.g. USA, UK, France, Germany, UAE, Singapore, Japan).
2. Asks about single vs multiple entry visas.
3. Inquires about processing durations or express options.

## Guidelines

- Query the `getVisaDetails` tool with `destination` and `purpose`.
- Clearly explain if multiple visa types exist (e.g., Tourist vs Business vs Transit).
- Mention processing time ranges (minimum to maximum business days).
