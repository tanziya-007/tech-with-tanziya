const devIconMap: Record<string, string> = {
  python: 'python',
  java: 'java',
  javascript: 'javascript',
  js: 'javascript',
  typescript: 'typescript',
  ts: 'typescript',
  react: 'react',
  nextjs: 'nextjs',
  'next.js': 'nextjs',
  'next js': 'nextjs',
  nodejs: 'nodejs',
  'node.js': 'nodejs',
  'node js': 'nodejs',
  node: 'nodejs',
  express: 'express',
  'express.js': 'express',
  'express js': 'express',
  html: 'html5',
  html5: 'html5',
  css: 'css3',
  css3: 'css3',
  sql: 'mysql',
  mysql: 'mysql',
  postgresql: 'postgresql',
  postgres: 'postgresql',
  mongodb: 'mongodb',
  git: 'git',
  'git and github': 'git',
  'git-and-github': 'git',
  github: 'github',
  docker: 'docker',
  linux: 'linux',
  bash: 'bash',
  c: 'c',
  'c++': 'cplusplus',
  cpp: 'cplusplus',
  'c#': 'csharp',
  csharp: 'csharp',
  php: 'php',
  ruby: 'ruby',
  swift: 'swift',
  kotlin: 'kotlin',
  go: 'go',
  rust: 'rust',
  flutter: 'flutter',
  dart: 'dart',
  firebase: 'firebase',
  aws: 'amazonwebservices',
  tensorflow: 'tensorflow',
  pytorch: 'pytorch',
  flask: 'flask',
  django: 'django',
  spring: 'spring',
  'spring boot': 'spring',
  'spring-boot': 'spring',
  springboot: 'spring',
  bootstrap: 'bootstrap',
  keras: 'keras',
  fastapi: 'fastapi',
  pandas: 'pandas',
  numpy: 'numpy',
  matplotlib: 'matplotlib',
  opencv: 'opencv',
  jupyter: 'jupyter',
  kubernetes: 'kubernetes',
  k8s: 'kubernetes',
  'scikit learn': 'scikitlearn',
  'scikit-learn': 'scikitlearn',
  scikitlearn: 'scikitlearn',
  tailwind: 'tailwindcss',
  tailwindcss: 'tailwindcss',
  figma: 'figma',
  redux: 'redux',
  graphql: 'graphql',
  jwt: 'express', // Safe fallback or alternative mapping if jwt icon path drops
  'json web token': 'express',
};

export function getTechLogo(name: string): string | null {
  if (!name) return null;

  const normalized = name
    .toLowerCase()
    .replace(/^\d+\./, "")
    .replace(/^\d+\s*/, "")
    .replace(/[_/\\-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const key = normalized;
  const icon = devIconMap[key];

  if (!icon) return null;

  const plainOnly = ["github", "express", "nextjs", "bash", "jsonwebtokens"];
  const variant = plainOnly.includes(icon) ? "plain" : "original";

  return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${icon}/${icon}-${variant}.svg`;
}