import { PROFILES, USERS, JOBS } from '../mockData';
import { StudentProfile, User, JobPost, Project } from '../types';
import { GoogleGenAI, Type } from "@google/genai";

const DELAY = 400;

export interface SearchFilters {
  verifiedOnly: boolean;
  hasVideo: boolean;
  hasDataset: boolean;
  minCollaborators: number;
}

// Initialize Gemini
// Note: In a real production app, you might proxy this through a backend to protect the key,
// or use Firebase App Check. For this demo, we assume process.env.API_KEY is available.
const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const api = {
  login: async (email: string): Promise<User | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = USERS.find(u => u.email === email);
        resolve(user);
      }, DELAY);
    });
  },

  getProfile: async (userId: string): Promise<StudentProfile | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(PROFILES.find(p => p.userId === userId));
      }, DELAY);
    });
  },

  getAllProfiles: async (): Promise<StudentProfile[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(PROFILES), DELAY));
  },

  searchCandidates: async (query: string, skills: string[], filters?: SearchFilters): Promise<StudentProfile[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let results = PROFILES;
        
        // Filter by Skills
        if (skills.length > 0) {
          results = results.filter(p => 
            skills.every(skill => p.skills.some(s => s.name.toLowerCase().includes(skill.toLowerCase())))
          );
        }

        // Filter by Text Query
        if (query) {
          const q = query.toLowerCase();
          results = results.filter(p => 
            p.user.name.toLowerCase().includes(q) || 
            p.headline.toLowerCase().includes(q) ||
            p.projects.some(proj => proj.title.toLowerCase().includes(q))
          );
        }

        // Advanced Filters
        if (filters) {
          if (filters.verifiedOnly) {
            // Include profile if they have at least one verified project
            results = results.filter(p => p.projects.some(proj => proj.verifications.length > 0));
          }
          if (filters.hasVideo) {
            results = results.filter(p => p.projects.some(proj => proj.media.some(m => m.type === 'video')));
          }
          if (filters.hasDataset) {
            results = results.filter(p => p.projects.some(proj => proj.media.some(m => m.type === 'link' && m.title.toLowerCase().includes('dataset'))));
          }
          if (filters.minCollaborators > 0) {
            results = results.filter(p => p.projects.some(proj => proj.collaborators.length >= filters.minCollaborators));
          }
        }

        resolve(results);
      }, DELAY);
    });
  },

  getJobs: async (): Promise<JobPost[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(JOBS), DELAY));
  },

  verifyProject: async (projectId: string, verifierId: string, comment: string): Promise<boolean> => {
      console.log(`Verifying project ${projectId} by ${verifierId} with comment: ${comment}`);
      return new Promise((resolve) => setTimeout(() => resolve(true), DELAY));
  },

  // AI Feature: Extract skills from project description
  extractSkills: async (description: string): Promise<string[]> => {
    if (!process.env.API_KEY) {
      console.warn("No API_KEY found. Returning mock AI suggestions.");
      return new Promise((resolve) => setTimeout(() => resolve(['AI Skill 1', 'AI Skill 2']), DELAY));
    }

    try {
      const response = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Extract a list of technical and soft skills from the following project description. Return ONLY a valid JSON array of strings (e.g. ["Python", "Leadership"]). Description: ${description}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
      });

      const text = response.text;
      if (!text) return [];
      return JSON.parse(text);
    } catch (error) {
      console.error("AI Skill extraction failed:", error);
      return [];
    }
  }
};