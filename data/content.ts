import type { BlogPost, CheatSheet, Project, Resource, Roadmap } from '@/types/content';

export const navLinks = [
  { title: 'Home', href: '/' },
  { title: 'Cheat Sheets', href: '/cheatsheets' },
  { title: 'Blog', href: '/blog' },
  { title: 'Projects', href: '/projects' },
  { title: 'Roadmaps', href: '/roadmaps' },
  { title: 'Resources', href: '/resources' },
  { title: 'About', href: '/about' },
  { title: 'Contact', href: '/contact' },
];

export const cheatSheets: CheatSheet[] = [
  {
    slug: 'java',
    title: 'Java',
    description: 'Basics, syntax, OOP and common interview patterns.',
    category: 'Programming',
    highlights: ['Classes and objects', 'Data types', 'Collections', 'Streams'],
    topics: ['Syntax', 'OOP', 'Exceptions', 'Lambda'],
    interviews: ['What is JVM?', 'Explain inheritance.'],
  },
  {
    slug: 'python',
    title: 'Python',
    description: 'From variables to modules, data handling, and scripting.',
    category: 'Programming',
    highlights: ['Data structures', 'Functions', 'OOP', 'File IO'],
    topics: ['Syntax', 'Comprehensions', 'Modules', 'Decorators'],
    interviews: ['What is PEP 8?', 'Explain list comprehension.'],
  },
  {
    slug: 'sql',
    title: 'SQL',
    description: 'Queries, joins, normalization, and database design.',
    category: 'Databases',
    highlights: ['SELECT', 'JOIN', 'GROUP BY', 'Indexes'],
    topics: ['CRUD', 'Joins', 'Window functions', 'Transactions'],
    interviews: ['What is normalization?', 'Different types of joins?'],
  },
  {
    slug: 'html',
    title: 'HTML',
    description: 'Structure web pages with modern HTML5 elements.',
    category: 'Web',
    highlights: ['Semantic tags', 'Forms', 'Accessibility'],
    topics: ['Layout', 'Media', 'Accessibility', 'Forms'],
    interviews: ['What is semantic HTML?', 'How to create accessible forms?'],
  },
  {
    slug: 'css',
    title: 'CSS',
    description: 'Styling, layout, responsive design, and effects.',
    category: 'Web',
    highlights: ['Flexbox', 'Grid', 'Responsive design', 'Animations'],
    topics: ['Selectors', 'Layout', 'Media queries', 'Transforms'],
    interviews: ['What is CSS specificity?', 'Explain grid vs flexbox.'],
  },
  {
    slug: 'javascript',
    title: 'JavaScript',
    description: 'Core concepts, DOM interaction, and modern patterns.',
    category: 'Web',
    highlights: ['ES6+', 'Async', 'DOM APIs', 'Closures'],
    topics: ['Variables', 'Functions', 'Promises', 'DOM'],
    interviews: ['What is event bubbling?', 'Explain closures.'],
  },
  {
    slug: 'git',
    title: 'Git',
    description: 'Version control workflows for reliable code management.',
    category: 'Tools',
    highlights: ['Branches', 'Merging', 'Rebase', 'Collaboration'],
    topics: ['Init', 'Commit', 'Branching', 'Remote workflows'],
    interviews: ['How to resolve merge conflicts?', 'What is git rebase?'],
  },
  {
    slug: 'linux',
    title: 'Linux',
    description: 'Core terminal commands, file permissions, and shell skills.',
    category: 'Tools',
    highlights: ['File system', 'Permissions', 'Shell', 'Networking'],
    topics: ['CLI', 'Process management', 'Permissions', 'SSH'],
    interviews: ['How to change file permissions?', 'What is grep?'],
  },
];

export const blogs: BlogPost[] = [
  {
    slug: '7-java-concepts-for-new-developers',
    title: '7 Java concepts every beginner should master',
    description: 'Build confidence with essential Java concepts and practice questions.',
    category: 'Java',
    date: '2026-07-08',
    image: '/logo.svg',
  },
  {
    slug: 'python-productivity-hacks',
    title: 'Python productivity hacks for faster coding',
    description: 'Use tools, patterns, and clean code practices to speed up your workflow.',
    category: 'Python',
    date: '2026-07-01',
    image: '/logo.svg',
  },
  {
    slug: 'sql-queries-for-interviews',
    title: 'SQL queries every interview candidate should know',
    description: 'Practical examples for SELECT, JOIN, GROUP BY and advanced queries.',
    category: 'SQL',
    date: '2026-06-24',
    image: '/logo.svg',
  },
];

export const projects: Project[] = [
  {
    slug: 'skillnest',
    title: 'SkillNest',
    description: 'A learning hub for guided skill-building and real project exercises.',
    tech: ['Next.js', 'TypeScript', 'Tailwind'],
    github: 'https://github.com/techwithtanziya/skillnest',
    demo: '#',
  },
  {
    slug: 'rice-grain-classification',
    title: 'Rice Grain Classification',
    description: 'A machine learning showcase for classifying rice varieties from images.',
    tech: ['Python', 'TensorFlow', 'Flask'],
    github: 'https://github.com/techwithtanziya/rice-grain-classification',
    demo: '#',
  },
  {
    slug: 'portfolio-redesign',
    title: 'Portfolio Redesign',
    description: 'A polished personal portfolio with focus on clean design and accessibility.',
    tech: ['React', 'CSS', 'Animations'],
    github: 'https://github.com/techwithtanziya/portfolio',
    demo: '#',
  },
];

export const resources: Resource[] = [
  {
    slug: 'resume-template',
    title: 'Resume Template',
    description: 'Clean, modern resume design for tech job applications.',
    tag: 'Template',
    link: '#',
  },
  {
    slug: 'interview-notes',
    title: 'Interview Notes',
    description: 'Saved answers and questions for technical interviews.',
    tag: 'Notes',
    link: '#',
  },
  {
    slug: 'project-checklist',
    title: 'Project Launch Checklist',
    description: 'A checklist for taking a project from idea to deployment.',
    tag: 'PDF',
    link: '#',
  },
  {
    slug: 'cheatsheet-collection',
    title: 'Cheat Sheet Collection',
    description: 'A growing library of quick reference guides for dev topics.',
    tag: 'Cheatsheets',
    link: '#',
  },
];

export const roadmaps: Roadmap[] = [
  {
    slug: 'java-roadmap',
    title: 'Java Roadmap',
    description: 'Structured learning path from Java basics to backend development.',
    steps: ['Java fundamentals', 'OOP & data structures', 'Spring Boot', 'Microservices'],
  },
  {
    slug: 'python-roadmap',
    title: 'Python Roadmap',
    description: 'A path through Python scripting, automation, and data science.',
    steps: ['Syntax & data types', 'Libraries', 'Web APIs', 'Machine learning'],
  },
  {
    slug: 'frontend-roadmap',
    title: 'Frontend Roadmap',
    description: 'From HTML/CSS to React and modern web experiences.',
    steps: ['HTML & CSS', 'JavaScript', 'React', 'Performance'],
  },
  {
    slug: 'fullstack-roadmap',
    title: 'Full Stack Roadmap',
    description: 'Combine frontend and backend skills into deployable apps.',
    steps: ['Frontend basics', 'Backend APIs', 'Databases', 'Hosting'],
  },
];
