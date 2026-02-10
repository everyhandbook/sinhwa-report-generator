import { Project, AppSettings } from '../types';
import { STORAGE_KEYS, DEFAULT_WEBHOOK_URL } from '../constants';

export const getProjects = (): Project[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to load projects", e);
    return [];
  }
};

export const saveProject = (project: Project): void => {
  const projects = getProjects();
  const updatedProjects = [project, ...projects];
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updatedProjects));
};

export const getProjectById = (id: string): Project | undefined => {
  const projects = getProjects();
  return projects.find(p => p.id === id);
};

export const getSettings = (): AppSettings => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : { webhookUrl: DEFAULT_WEBHOOK_URL };
  } catch (e) {
    return { webhookUrl: DEFAULT_WEBHOOK_URL };
  }
};

export const saveSettings = (settings: AppSettings): void => {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
};