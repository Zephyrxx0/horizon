---
name: passport-checker
description: Checks Indian passport validity against the strict 6-month validity rule from the date of arrival and checks required blank pages.
---

# Passport Checker Skill

Use this skill when an applicant:

1. Asks if their passport is valid for their upcoming trip.
2. Inquires about the 6-month expiry rule or number of blank pages needed.
3. Asks how to handle an expiring passport.

## Guidelines

- Call `checkPassportValidity` tool with passport expiry date and planned travel arrival date.
- Explain clearly: Passports must have at least 6 months validity remaining from the date of arrival in the destination country.
- Remind users that at least 2 blank visa pages are mandatory for immigration stamps.
