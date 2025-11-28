import { UserRole, StudentProfile, User, JobPost, Project } from './types';

// Users
export const USERS: User[] = [
  { id: 'u1', name: 'Alice Chen', email: 'alice@uni.edu', role: UserRole.STUDENT, avatarUrl: 'https://picsum.photos/id/64/200/200' },
  { id: 'u2', name: 'Binta Osei', email: 'binta@agri.edu', role: UserRole.STUDENT, avatarUrl: 'https://picsum.photos/id/65/200/200' },
  { id: 'u3', name: 'Carlo Rossini', email: 'carlo@design.edu', role: UserRole.STUDENT, avatarUrl: 'https://picsum.photos/id/91/200/200' },
  { id: 'v1', name: 'Prof. Mensah', email: 'mensah@uni.edu', role: UserRole.VERIFIER, avatarUrl: 'https://picsum.photos/id/103/200/200' },
  { id: 'e1', name: 'AgroTech HR', email: 'hr@agrotech.com', role: UserRole.EMPLOYER, avatarUrl: 'https://picsum.photos/id/106/200/200' },
];

// Projects
const PROJECT_MALARIA: Project = {
  id: 'p1',
  ownerId: 'u1',
  title: 'Malaria Spread Analysis using Python',
  descriptionShort: 'Data analysis of regional malaria vectors using public health datasets.',
  descriptionLong: 'Conducted extensive data cleaning and regression analysis on 10 years of public health data to identify correlation between rainfall patterns and malaria outbreaks.',
  skills: ['Python', 'Data Science', 'Pandas', 'Statistics'],
  media: [
    { id: 'm1', type: 'image', url: 'https://picsum.photos/id/20/800/600', title: 'Data Heatmap' },
    { id: 'm1-dataset', type: 'link', url: '#', title: 'Public Health Dataset (Cleaned)' }
  ],
  collaborators: [],
  verifications: [
    { id: 'ver1', verifierId: 'v1', verifierName: 'Prof. Mensah', verifiedAt: '2023-10-15', comment: 'Excellent use of regression models. Methodology is sound.', signatureHash: '0x9a8b...7c' }
  ],
  tags: ['Research', 'Health', 'Data'],
  createdAt: '2023-09-01'
};

const PROJECT_IOT: Project = {
  id: 'p2',
  ownerId: 'u2',
  title: 'Smart Irrigation System',
  descriptionShort: 'IoT based automated irrigation for small-hold farmers.',
  descriptionLong: 'Designed and built a solar-powered irrigation controller using ESP32. Reduced water usage by 30% in field trials. Includes a demo video of the system in action.',
  skills: ['IoT', 'C++', 'Hardware Design', 'Agriculture'],
  media: [
    { id: 'm2', type: 'image', url: 'https://picsum.photos/id/119/800/600', title: 'Prototype Circuit' },
    { id: 'm2-video', type: 'video', url: '#', title: 'Field Trial Demo' }
  ],
  collaborators: [{ userId: 'u1', name: 'Alice Chen', role: 'Software Lead' }],
  verifications: [],
  tags: ['Hardware', 'Sustainability'],
  createdAt: '2023-11-20'
};

const PROJECT_PORTFOLIO: Project = {
  id: 'p3',
  ownerId: 'u3',
  title: 'Urban Mobility UX Redesign',
  descriptionShort: 'Complete UI/UX overhaul for the city transit app.',
  descriptionLong: 'User research, wireframing, and high-fidelity prototyping for a more accessible transit application.',
  skills: ['Figma', 'UX Research', 'Prototyping'],
  media: [
    { id: 'm3', type: 'image', url: 'https://picsum.photos/id/48/800/600', title: 'App Screens' }
  ],
  collaborators: [],
  verifications: [],
  tags: ['Design', 'Mobile'],
  createdAt: '2024-01-10'
};

// Profiles
export const PROFILES: StudentProfile[] = [
  {
    userId: 'u1',
    user: USERS[0],
    headline: 'Computer Science Senior specializing in Data & ML',
    about: 'Passionate about using technology to solve public health problems. Seeking roles in data analytics.',
    location: 'Accra, Ghana',
    education: [
      { id: 'e1', institution: 'Tech University', degree: 'B.Sc.', field: 'Computer Science', startDate: '2020', endDate: '2024', gpa: 3.8, verified: true }
    ],
    skills: [
      { id: 's1', name: 'Python', proficiency: 5, verified: true },
      { id: 's2', name: 'React', proficiency: 3, verified: false },
      { id: 's3', name: 'Data Visualization', proficiency: 4, verified: true }
    ],
    projects: [PROJECT_MALARIA, {...PROJECT_IOT, ownerId: 'u1', title: 'Smart Irrigation (Collab)'}] 
  },
  {
    userId: 'u2',
    user: USERS[1],
    headline: 'Agricultural Engineering Student',
    about: 'Building sustainable tech for the future of farming.',
    location: 'Nairobi, Kenya',
    education: [
      { id: 'e2', institution: 'Agri Tech Institute', degree: 'B.Eng.', field: 'Agricultural Engineering', startDate: '2021', endDate: '2025', gpa: 3.6, verified: true }
    ],
    skills: [
      { id: 's4', name: 'IoT', proficiency: 4, verified: false },
      { id: 's5', name: 'Circuit Design', proficiency: 4, verified: true }
    ],
    projects: [PROJECT_IOT]
  },
  {
    userId: 'u3',
    user: USERS[2],
    headline: 'Digital Product Designer',
    about: 'Merging aesthetics with usability.',
    location: 'Milan, Italy',
    education: [],
    skills: [{ id: 's6', name: 'Figma', proficiency: 5, verified: true }],
    projects: [PROJECT_PORTFOLIO]
  }
];

export const JOBS: JobPost[] = [
  {
    id: 'j1',
    employerId: 'e1',
    companyName: 'AgroTech Solutions',
    title: 'Junior IoT Engineer',
    description: 'Looking for a hands-on engineer to work on smart sensors.',
    requiredSkills: ['IoT', 'C++', 'Hardware'],
    postedAt: '2023-12-01'
  },
  {
    id: 'j2',
    employerId: 'e1',
    companyName: 'DataAnalytics Lab',
    title: 'Data Analyst Intern',
    description: 'Join our health data team to crunch numbers and save lives.',
    requiredSkills: ['Python', 'Statistics', 'Data'],
    postedAt: '2024-01-15'
  }
];