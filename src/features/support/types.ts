export type FaqCategory = 'all' | 'passport' | 'documents' | 'payment' | 'tracking' | 'general';

export interface FaqItem {
  id: string;
  category: FaqCategory;
  questionKey: string;
  answerKey: string;
  tags: string[];
  defaultQuestion: string;
  defaultAnswer: string;
}

export interface SupportTicket {
  ticketId: string;
  applicantName: string;
  contactInfo: string;
  category: string;
  description: string;
  createdAt: string;
}

export type JargonKey =
  'givenNameVsSurname' | 'dateOfIssueVsExpiry' | 'placeOfIssue' | 'cvv' | 'vpa' | 'mrz';

export interface JargonDefinition {
  key: JargonKey;
  titleKey: string;
  explanationKey: string;
  exampleKey: string;
  defaultTitle: string;
  defaultExplanation: string;
  defaultExample: string;
  hasDiagram?: boolean;
}
