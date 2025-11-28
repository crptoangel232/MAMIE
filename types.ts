export enum UserRole {
  STUDENT = 'STUDENT',
  VERIFIER = 'VERIFIER', // Instructor/TA
  EMPLOYER = 'EMPLOYER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Skill {
  id: string;
  name: string;
  proficiency: number; // 1-5
  verified: boolean;
}

export interface EducationRecord {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: number;
  verified: boolean;
}

export interface MediaArtifact {
  id: string;
  type: 'image' | 'video' | 'pdf' | 'link';
  url: string;
  thumbnailUrl?: string;
  title: string;
}

export interface Verification {
  id: string;
  verifierName: string;
  verifierId: string;
  verifiedAt: string;
  comment: string;
  signatureHash: string;
}

export interface Project {
  id: string;
  ownerId: string;
  title: string;
  descriptionShort: string;
  descriptionLong: string;
  skills: string[]; // skill names
  media: MediaArtifact[];
  collaborators: { userId: string; name: string; role: string }[];
  verifications: Verification[];
  tags: string[];
  createdAt: string;
}

export interface StudentProfile {
  userId: string;
  user: User;
  headline: string;
  about: string;
  location: string;
  education: EducationRecord[];
  skills: Skill[];
  projects: Project[];
}

export interface JobPost {
  id: string;
  employerId: string;
  companyName: string;
  title: string;
  description: string;
  requiredSkills: string[];
  postedAt: string;
}
