export interface OutlineSection {
  title: string;
  points: string[];
}

export interface ReportOutline {
  overallSituation: OutlineSection;
  mainProblems: OutlineSection;
  typicalCases: OutlineSection;
  workSuggestions: OutlineSection;
}

export interface ReportHistoryItem {
  id: number;
  title: string;
  date: string;
  userInput: string;
  outline: ReportOutline;
  report: string;
}

export type Step = 'input' | 'outline' | 'report';
