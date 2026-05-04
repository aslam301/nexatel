export interface Office {
  city: string;
  country: string;
  address: string;
  phone: string;
  email: string;
  isHeadquarters: boolean;
}

export interface PartnerCompany {
  name: string;
  legalName?: string;
  url: string;
  country: string;
  note?: string;
}

export interface Company {
  name: string;
  legalName: string;
  tagline: string;
  description: string;
  shortDescription: string;
  founded: string;
  yearsOfExperience: number;
  stats: { label: string; value: string }[];
  verticals: string[];
  offices: Office[];
  social: {
    linkedin: string;
    twitter: string;
    facebook: string;
    instagram: string;
  };
  supportEmail: string;
  supportPhone: string;
  mission?: string;
  vision?: string;
  values?: string[];
  partner?: PartnerCompany;
}

export interface Service {
  slug: string;
  title: string;
  summary: string;
  icon: string;
  highlights: string[];
  details: string;
  image: string;
}

export interface CapabilityStep {
  title: string;
  description: string;
}

export interface Capability {
  slug: string;
  title: string;
  shortTitle?: string;
  summary: string;
  description: string;
  icon: string;
  parentService: string;
  processSteps: CapabilityStep[];
  benefits: string[];
  image: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  description: string;
  features: string[];
  image: string;
  datasheetUrl?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  client: string;
  category: string;
  summary: string;
  year: string;
  image: string;
}

export interface Settings {
  notificationEmail: string;
  ccEmails: string[];
  emailSubjectPrefix: string;
  autoReplyEnabled: boolean;
  updatedAt: string;
}

export type SubmissionKind = "contact" | "quote";

export interface Submission {
  id: string;
  kind: SubmissionKind;
  createdAt: string;
  name: string;
  email: string;
  organisation?: string;
  phone?: string;
  topic?: string;
  // Quote-specific
  serviceArea?: string;
  scope?: string;
  budget?: string;
  timeline?: string;
  location?: string;
  // Common
  message: string;
  // Delivery
  emailDelivered: boolean;
  emailError?: string;
  ip?: string;
}
