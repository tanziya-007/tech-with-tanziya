const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function fetchCheatSheets() {
  const res = await fetch(`${API_BASE_URL}/cheatsheets`);
  if (!res.ok) throw new Error('Failed to fetch cheat sheets');
  return res.json();
}

export async function fetchCheatSheet(slug: string) {
  const res = await fetch(`${API_BASE_URL}/cheatsheets/${slug}`);
  if (!res.ok) throw new Error('Failed to fetch cheat sheet');
  return res.json();
}

export async function fetchBlogs() {
  const res = await fetch(`${API_BASE_URL}/blogs`);
  if (!res.ok) throw new Error('Failed to fetch blogs');
  return res.json();
}

export async function fetchBlog(slug: string) {
  const res = await fetch(`${API_BASE_URL}/blogs/${slug}`);
  if (!res.ok) throw new Error('Failed to fetch blog');
  return res.json();
}

export async function fetchProjects() {
  const res = await fetch(`${API_BASE_URL}/projects`);
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
}

export async function fetchProject(slug: string) {
  const res = await fetch(`${API_BASE_URL}/projects/${slug}`);
  if (!res.ok) throw new Error('Failed to fetch project');
  return res.json();
}

export async function fetchResources() {
  const res = await fetch(`${API_BASE_URL}/resources`);
  if (!res.ok) throw new Error('Failed to fetch resources');
  return res.json();
}

export async function fetchRoadmaps() {
  const res = await fetch(`${API_BASE_URL}/roadmaps`);
  if (!res.ok) throw new Error('Failed to fetch roadmaps');
  return res.json();
}

export async function fetchRoadmap(slug: string) {
  const res = await fetch(`${API_BASE_URL}/roadmaps/${slug}`);
  if (!res.ok) throw new Error('Failed to fetch roadmap');
  return res.json();
}
