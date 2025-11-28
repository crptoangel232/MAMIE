import React from 'react';
import { Project, UserRole } from '../types';
import { Card, VerifiedBadge, Button, CheckBadgeIcon } from './ui';

interface ProjectCardProps {
  project: Project;
  currentUserRole?: UserRole;
  isOwner?: boolean;
  onVerify?: (id: string) => void;
  onAnalyzeSkills?: (id: string, description: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  currentUserRole, 
  isOwner,
  onVerify,
  onAnalyzeSkills
}) => {
  const isVerified = project.verifications.length > 0;
  const isVerifier = currentUserRole === UserRole.VERIFIER;

  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow duration-200">
      {project.media.length > 0 && (
        <div className="h-48 bg-gray-100 relative group overflow-hidden rounded-t-lg">
          <img 
            src={project.media.find(m => m.type === 'image')?.url || project.media[0].url} 
            alt={project.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          />
          {isVerified && (
            <div className="absolute top-2 right-2 shadow-lg">
              <VerifiedBadge text="Endorsed" />
            </div>
          )}
          {/* Media Indicators */}
          <div className="absolute bottom-2 left-2 flex gap-1">
            {project.media.some(m => m.type === 'video') && (
              <span className="px-2 py-0.5 bg-black/50 text-white text-[10px] uppercase font-bold rounded backdrop-blur-sm">Video</span>
            )}
            {project.media.some(m => m.type === 'link' && m.title.toLowerCase().includes('dataset')) && (
              <span className="px-2 py-0.5 bg-blue-600/50 text-white text-[10px] uppercase font-bold rounded backdrop-blur-sm">Data</span>
            )}
          </div>
        </div>
      )}
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1" title={project.title}>
            {project.title}
          </h3>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1">
          {project.descriptionShort}
        </p>

        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {project.skills.slice(0, 3).map(skill => (
              <span key={skill} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs rounded-full font-medium">
                {skill}
              </span>
            ))}
            {project.skills.length > 3 && (
              <span className="px-2 py-0.5 bg-gray-50 text-gray-500 text-xs rounded-full">+{project.skills.length - 3}</span>
            )}
          </div>
        </div>

        {/* Action Section */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          {isVerified ? (
             <div className="flex items-start space-x-2">
                <div className="mt-0.5 text-emerald-600">
                  <CheckBadgeIcon className="w-4 h-4"/>
                </div>
                <div>
                   <p className="text-xs text-gray-900 font-semibold">Verified by {project.verifications[0].verifierName}</p>
                   <p className="text-xs text-gray-500 italic">"{project.verifications[0].comment}"</p>
                </div>
             </div>
          ) : (
            <div className="flex justify-between items-center min-h-[32px]">
               <span className="text-xs text-gray-400">Not verified yet</span>
               {isVerifier && onVerify && (
                 <Button size="sm" variant="secondary" onClick={() => onVerify(project.id)}>
                   Verify This
                 </Button>
               )}
            </div>
          )}

          {isOwner && onAnalyzeSkills && (
            <div className="mt-3 pt-3 border-t border-dashed border-gray-200">
              <button 
                onClick={() => onAnalyzeSkills(project.id, project.descriptionLong)}
                className="w-full flex items-center justify-center space-x-2 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 py-2 rounded transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Analyze & Suggest Skills (AI)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};