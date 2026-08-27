---
name: arn-tracker
description: Looks up live status and consular processing timeline for an Application Reference Number (ARN) like VR-YYYY-XXXXXX.
---

# ARN Tracker Skill

Use this skill when an applicant:

1. Provides an Application Reference Number (ARN) and asks for its status.
2. Inquires what stage their application is currently in (e.g. Under Review, Biometrics Scheduled, Consulate Verified, Approved).
3. Asks what steps are required next before receiving their e-Visa.

## Guidelines

- Call `trackApplicationStatus` tool with the provided ARN.
- Format the response with the stage name, estimated completion date, and actionable next steps.
- Mask the ARN in output if full personal details are displayed.
