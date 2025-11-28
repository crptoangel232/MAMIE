import React, { useState, useEffect } from 'react';
import { api, SearchFilters } from '../services/api';
import { StudentProfile } from '../types';
import { Card, Button, SkillTag, Avatar, VerifiedBadge } from '../components/ui';

export const EmployerSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeSkills, setActiveSkills] = useState<string[]>([]);
  
  // Advanced Filters State
  const [filters, setFilters] = useState<SearchFilters>({
    verifiedOnly: false,
    hasVideo: false,
    hasDataset: false,
    minCollaborators: 0
  });

  const handleSearch = async () => {
    setLoading(true);
    const data = await api.searchCandidates(query, activeSkills, filters);
    setResults(data);
    setLoading(false);
  };

  useEffect(() => {
    handleSearch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSkills, filters]);

  const toggleSkill = (skill: string) => {
    setActiveSkills(prev => 
      prev.includes(skill) ? prev.filter(f => f !== skill) : [...prev, skill]
    );
  };

  const SUGGESTED_FILTERS = ['Python', 'IoT', 'Data', 'Design', 'React'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Find Talent</h1>
          <p className="text-gray-500">Search for verified candidates by skill, project, or institution.</p>
        </div>
        <Button onClick={() => alert("This would open a 'Post Job' modal in a real app.")}>+ Post a Job</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="p-4 space-y-4">
            <h3 className="font-semibold text-gray-900">Advanced Filters</h3>
            
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={filters.verifiedOnly}
                onChange={(e) => setFilters({...filters, verifiedOnly: e.target.checked})}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" 
              />
              <span className="text-sm text-gray-700">Verified Projects Only</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={filters.hasVideo}
                onChange={(e) => setFilters({...filters, hasVideo: e.target.checked})}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" 
              />
              <span className="text-sm text-gray-700">Has Video Demo</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={filters.hasDataset}
                onChange={(e) => setFilters({...filters, hasDataset: e.target.checked})}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" 
              />
              <span className="text-sm text-gray-700">Includes Dataset</span>
            </label>

            <div className="pt-2 border-t border-gray-100">
              <span className="text-sm text-gray-700 block mb-2">Min. Collaborators</span>
              <select 
                value={filters.minCollaborators}
                onChange={(e) => setFilters({...filters, minCollaborators: Number(e.target.value)})}
                className="block w-full text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value={0}>Any</option>
                <option value={1}>At least 1 (Team)</option>
                <option value={2}>2+ People</option>
                <option value={3}>3+ People</option>
              </select>
            </div>
          </Card>
        </div>

        {/* Search Results Area */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="p-6">
            <div className="flex gap-4 mb-6">
              <input
                type="text"
                placeholder="Search keywords (e.g., 'Machine Learning')..."
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch} disabled={loading}>
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
              <span>Popular Skills:</span>
              {SUGGESTED_FILTERS.map(skill => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    activeSkills.includes(skill)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </Card>

          <div className="grid gap-4">
            {results.map(profile => (
              <Card key={profile.userId} className="p-6 hover:border-indigo-300 transition-colors cursor-pointer group">
                <div className="flex items-start space-x-4">
                  <Avatar src={profile.user.avatarUrl} alt={profile.user.name} size="lg" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                          {profile.user.name}
                        </h3>
                        <p className="text-gray-600">{profile.headline}</p>
                      </div>
                      <div className="flex flex-col items-end">
                         {profile.education[0]?.verified && <VerifiedBadge text="Verified Student" />}
                      </div>
                    </div>
                    
                    <div className="mt-3 flex flex-wrap gap-2">
                      {profile.skills.slice(0, 5).map(skill => (
                        <SkillTag key={skill.id} name={skill.name} level={skill.proficiency} verified={skill.verified} />
                      ))}
                      {profile.skills.length > 5 && <span className="text-xs text-gray-400 self-center">+{profile.skills.length - 5} more</span>}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center text-sm text-gray-500">
                       <span className="flex items-center gap-1">
                         {profile.projects.length} Showcased Projects
                         {profile.projects.some(p => p.media.some(m => m.type === 'video')) && (
                           <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-800">
                             Video
                           </span>
                         )}
                       </span>
                       <span className="font-medium text-indigo-600 group-hover:underline">View Profile &rarr;</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            
            {!loading && results.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No candidates found matching your criteria.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};