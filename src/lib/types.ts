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
  offices: {
    city: string;
    country: string;
    address: string;
    phone: string;
    email: string;
    isHeadquarters: boolean;
  }[];
  social: {
    linkedin: string;
    twitter: string;
    facebook: string;
    instagram: string;
  };
  supportEmail: string;
  supportPhone: string;
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
