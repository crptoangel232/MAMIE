import React, { useState } from 'react';
import { StudentProfile, UserRole } from '../types';
import { Card, Button, SkillTag, VerifiedBadge, CheckBadgeIcon, Avatar } from '../components/ui';
import { ProjectCard } from '../components/ProjectCard';
import { api } from '../services/api';

interface StudentProfileProps {
  profile: StudentProfile;
  currentUserRole: UserRole;
  isOwnProfile: boolean;
}

export const StudentProfileView: React.FC<StudentProfileProps> = ({ profile, currentUserRole, isOwnProfile }) => {
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [suggestedSkills, setSuggestedSkills] = useState<{projectId: string, skills: string[]} | null>(null);

  const handleAnalyzeSkills = async (projectId: string, description: string) => {
    setAnalyzingId(projectId);
    setSuggestedSkills(null);
    try {
      const skills = await api.extractSkills(description);
      // Filter out skills already listed in the project
      const currentProject = profile.projects.find(p => p.id === projectId);
      const newSkills = skills.filter(s => !currentProject?.skills.includes(s));
      
      setSuggestedSkills({ projectId, skills: newSkills });
    } catch (e) {
      console.error(e);
      alert("Failed to analyze skills.");
    } finally {
      setAnalyzingId(null);
    }
  };

  const handleAddSkill = (projectId: string, skill: string) => {
    // In a real app, this would call API to update project
    alert(`Added "${skill}" to Project ${projectId} (Simulated)`);
    // Remove from suggestions
    if (suggestedSkills) {
      setSuggestedSkills({
        ...suggestedSkills,
        skills: suggestedSkills.skills.filter(s => s !== skill)
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <Card className="p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
        <div className="relative pt-12 flex flex-col sm:flex-row items-start sm:items-end space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="border-4 border-white rounded-full bg-white shadow-md">
            <Avatar src={profile.user.avatarUrl} alt={profile.user.name} size="xl" />
          </div>
          <div className="flex-1 pb-2">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              {profile.user.name}
              {profile.education.some(e => e.verified) && <CheckBadgeIcon className="ml-2 w-6 h-6 text-emerald-500" />}
            </h1>
            <p className="text-lg text-gray-600 font-medium">{profile.headline}</p>
            <div className="flex items-center mt-2 text-sm text-gray-500 space-x-4">
              <span>📍 {profile.location}</span>
              <span>🎓 {profile.education[0]?.institution || 'University'}</span>
            </div>
          </div>
          <div className="flex space-x-3 pb-2">
             {currentUserRole === UserRole.EMPLOYER && (
                <Button>Message Candidate</Button>
             )}
             {isOwnProfile && (
                <Button variant="outline">Edit Profile</Button>
             )}
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-100 pt-6">
           <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">About</h3>
           <p className="text-gray-600 max-w-4xl">{profile.about}</p>
        </div>
      </Card>

      {/* AI Suggestion Alert */}
      {suggestedSkills && suggestedSkills.skills.length > 0 && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in slide-in-from-top-2">
          <div>
            <h4 className="font-bold text-indigo-900 flex items-center">
              <span className="mr-2 text-xl">✨</span> AI Suggestions Found
            </h4>
            <p className="text-sm text-indigo-700 mt-1">
              Based on your project description, you might want to add these skills:
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {suggestedSkills.skills.map(skill => (
                <button 
                  key={skill}
                  onClick={() => handleAddSkill(suggestedSkills.projectId, skill)}
                  className="px-2 py-1 bg-white text-indigo-600 text-xs font-semibold rounded shadow-sm border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-colors"
                >
                  + {skill}
                </button>
              ))}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setSuggestedSkills(null)}>Dismiss</Button>
        </div>
      )}

      {analyzingId && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
             <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
             <p className="font-medium text-gray-900">Analyzing Project with Gemini AI...</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Skills & Education */}
        <div className="space-y-6">
           <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900">Skills</h2>
                {isOwnProfile && <Button size="sm" variant="ghost">+</Button>}
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map(skill => (
                   <SkillTag key={skill.id} name={skill.name} level={skill.proficiency} verified={skill.verified} />
                ))}
              </div>
           </Card>

           <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900">Education</h2>
              </div>
              <div className="space-y-4">
                 {profile.education.map(edu => (
                    <div key={edu.id} className="relative pl-4 border-l-2 border-indigo-100">
                       <h3 className="font-semibold text-gray-900">{edu.institution}</h3>
                       <p className="text-sm text-gray-600">{edu.degree} in {edu.field}</p>
                       <p className="text-xs text-gray-500 mt-1">{edu.startDate} - {edu.endDate} • GPA: {edu.gpa}</p>
                       {edu.verified && <div className="mt-2"><VerifiedBadge text="Transcript Verified" /></div>}
                    </div>
                 ))}
              </div>
           </Card>
        </div>

        {/* Right Column: Projects */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Featured Projects</h2>
              {isOwnProfile && <Button variant="outline" size="sm">Add Project</Button>}
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.projects.map(project => (
                 <ProjectCard 
                    key={project.id} 
                    project={project} 
                    currentUserRole={currentUserRole}
                    isOwner={isOwnProfile}
                    onAnalyzeSkills={handleAnalyzeSkills}
                 />
              ))}
           </div>
           
           {profile.projects.length === 0 && (
             <Card className="p-12 text-center text-gray-500 border-dashed">
               No projects showcased yet.
             </Card>
           )}
        </div>
      </div>
    </div>
  );
};