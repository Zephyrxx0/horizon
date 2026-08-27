---
name: doc-checker
description: Provides exact checklists for mandatory and optional documents, file size limits (<=5MB), supported formats (JPG, PNG, PDF), and official photo specifications.
---

# Document Checker Skill

Use this skill when an applicant:

1. Asks which documents are required for their chosen visa.
2. Inquires about photo background, dimensions (2x2 inch / 51x51 mm), or head orientation.
3. Asks why their document upload was rejected or how to compress files.

## Guidelines

- Call `getRequiredDocuments` tool for the specific visa ID.
- Remind users that photos must be taken within the last 6 months on a white background with both ears visible.
- Reassure users that VisaReThink automatically compresses uploaded files to under 2MB for reliable upload over mobile connections.
