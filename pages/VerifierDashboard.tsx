import React, { useState } from 'react';
import { PROFILES } from '../mockData'; // In real app, fetch pending verifications via API
import { ProjectCard } from '../components/ProjectCard';
import { Card, Button } from '../components/ui';
import { Project, UserRole } from '../types';

export const VerifierDashboard = () => {
  // Mock: find projects that are NOT verified from other users
  // In reality, this would be a specific API call "GET /verifications/pending"
  const [pendingProjects, setPendingProjects] = useState<Project[]>(
    PROFILES.flatMap(p => p.projects).filter(proj => proj.verifications.length === 0)
  );

  const handleVerify = (projectId: string) => {
    // Optimistic update
    setPendingProjects(prev => prev.filter(p => p.id !== projectId));
    alert(`Project ${projectId} verified! In a real app, this would sign the cryptographic receipt.`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pending Approvals</h1>
        <p className="text-gray-500">Review and endorse student work as an instructor.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pendingProjects.map(project => (
           <div key={project.id} className="relative">
             <div className="absolute top-0 right-0 z-10 p-2">
               <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded border border-yellow-200 shadow-sm">
                 Action Required
               </span>
             </div>
             <ProjectCard 
               project={project} 
               currentUserRole={UserRole.VERIFIER}
               onVerify={handleVerify}
             />
           </div>
        ))}
        {pendingProjects.length === 0 && (
           <Card className="col-span-full p-12 text-center text-gray-500">
              No pending verifications. Good job, Professor!
           </Card>
        )}
      </div>
    </div>
  );
};