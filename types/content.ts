export type CheatSheet = {
  slug: string;
  title: string;
  description: string;
  category: string;
  highlights: string[];
  topics: string[];
  interviews: string[];
  image?: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  image: string;
};

export type Project = {
  slug: string;
  title: string;
  description: string;
  tech: string[];
  github: string;
  demo: string;
};

export type Resource = {
  slug: string;
  title: string;
  description: string;
  tag: string;
  link: string;
};

export type Roadmap = {
  slug: string;
  title: string;
  description: string;
  steps: string[];
};
