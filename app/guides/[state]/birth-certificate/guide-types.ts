export interface GuideLink {
  label: string;
  href: string;
}

export interface GuideSection {
  id: string;
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  note?: string;
  links?: GuideLink[];
}

export interface GuideFaq {
  question: string;
  answer: string;
}

export interface BirthGuideContent {
  stateName: string;
  metaTitle: string;
  metaDescription: string;
  subtitle: string;
  intro: string[];
  quickFacts: { label: string; value: string }[];
  sections: GuideSection[];
  faqs: GuideFaq[];
  sources: GuideLink[];
  sourceChecked: string;
  ctaLabel: string;
  ctaNote: string;
}
