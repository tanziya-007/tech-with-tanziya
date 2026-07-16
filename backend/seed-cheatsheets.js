require('dotenv').config();
const mongoose = require('mongoose');
const { CheatSheet } = require('./models');

const cheatSheets = [
  { slug: 'java', title: 'Java', description: 'Basics, syntax, OOP and common interview patterns.', category: 'Programming', highlights: ['Classes and objects', 'Data types', 'Collections', 'Streams'], topics: ['Syntax', 'OOP', 'Exceptions', 'Lambda'], interviews: ['What is JVM?', 'Explain inheritance.'] },
  { slug: 'python', title: 'Python', description: 'From variables to modules, data handling, and scripting.', category: 'Programming', highlights: ['Data structures', 'Functions', 'OOP', 'File IO'], topics: ['Syntax', 'Comprehensions', 'Modules', 'Decorators'], interviews: ['What is PEP 8?', 'Explain list comprehension.'] },
  { slug: 'sql', title: 'SQL', description: 'Queries, joins, normalization, and database design.', category: 'Databases', highlights: ['SELECT', 'JOIN', 'GROUP BY', 'Indexes'], topics: ['CRUD', 'Joins', 'Window functions', 'Transactions'], interviews: ['What is normalization?', 'Different types of joins?'] },
  { slug: 'html', title: 'HTML', description: 'Structure web pages with modern HTML5 elements.', category: 'Web', highlights: ['Semantic tags', 'Forms', 'Accessibility'], topics: ['Layout', 'Media', 'Accessibility', 'Forms'], interviews: ['What is semantic HTML?', 'How to create accessible forms?'] },
  { slug: 'css', title: 'CSS', description: 'Styling, layout, responsive design, and effects.', category: 'Web', highlights: ['Flexbox', 'Grid', 'Responsive design', 'Animations'], topics: ['Selectors', 'Layout', 'Media queries', 'Transforms'], interviews: ['What is CSS specificity?', 'Explain grid vs flexbox.'] },
  { slug: 'javascript', title: 'JavaScript', description: 'Core concepts, DOM interaction, and modern patterns.', category: 'Web', highlights: ['ES6+', 'Async', 'DOM APIs', 'Closures'], topics: ['Variables', 'Functions', 'Promises', 'DOM'], interviews: ['What is event bubbling?', 'Explain closures.'] },
  { slug: 'git', title: 'Git', description: 'Version control workflows for reliable code management.', category: 'Tools', highlights: ['Branches', 'Merging', 'Rebase', 'Collaboration'], topics: ['Init', 'Commit', 'Branching', 'Remote workflows'], interviews: ['How to resolve merge conflicts?', 'What is git rebase?'] },
  { slug: 'linux', title: 'Linux', description: 'Core terminal commands, file permissions, and shell skills.', category: 'Tools', highlights: ['File system', 'Permissions', 'Shell', 'Networking'], topics: ['CLI', 'Process management', 'Permissions', 'SSH'], interviews: ['How to change file permissions?', 'What is grep?'] },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  for (const sheet of cheatSheets) {
    await CheatSheet.findOneAndUpdate({ slug: sheet.slug }, sheet, { upsert: true, new: true });
    console.log(`✅ ${sheet.title}`);
  }
  await mongoose.disconnect();
  console.log('\n🎉 All cheatsheets seeded!');
}

seed().catch(console.error);
