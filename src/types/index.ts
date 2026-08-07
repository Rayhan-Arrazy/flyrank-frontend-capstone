export interface CVExperience {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface CVEducation {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

export interface JobSuggestion {
  jobTitle: string;
  company: string;
  matchScore: number;
  reason: string;
  location: string;
  salary: string;
}

export interface ImportedLinks {
  linkedin?: string;
  github?: string;
  social?: string[];
}

export interface CVData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
  skills: string[];
  experience: CVExperience[];
  education: CVEducation[];
  summary: string;
  rawText: string;
  importedFrom: ImportedLinks;
  aiSuggestions: JobSuggestion[];
}

export type ApplicationStatus = "Applied" | "Interviewing" | "Offer" | "Rejected";

export interface Application {
  id: string;
  company: string;
  role: string;
  status: ApplicationStatus;
  date: string;
  notes: string;
  coverLetter: string;
  cv: CVData | null;
}
