import React from 'react';
import { User, UserRole } from '../types';
import { Button, Avatar } from './ui';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  onRoleSwitch: (role: UserRole) => void;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, onRoleSwitch, currentPage, onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-2">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <span className="font-bold text-xl tracking-tight text-gray-900">MAMIE</span>
              </div>
              
              {user && (
                <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                  <NavButton active={currentPage === 'profile'} onClick={() => onNavigate('profile')}>
                    My Profile
                  </NavButton>
                  {user.role === UserRole.EMPLOYER && (
                     <NavButton active={currentPage === 'search'} onClick={() => onNavigate('search')}>
                       Candidate Search
                     </NavButton>
                  )}
                  {user.role === UserRole.VERIFIER && (
                     <NavButton active={currentPage === 'verifier'} onClick={() => onNavigate('verifier')}>
                       Pending Approvals
                     </NavButton>
                  )}
                  <NavButton active={currentPage === 'jobs'} onClick={() => onNavigate('jobs')}>
                    Job Board
                  </NavButton>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <div className="hidden md:flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                    <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Dev Mode:</span>
                    <select 
                      value={user.role} 
                      onChange={(e) => onRoleSwitch(e.target.value as UserRole)}
                      className="text-sm bg-transparent border-none focus:ring-0 text-gray-700 font-medium cursor-pointer"
                    >
                      <option value={UserRole.STUDENT}>View as Student</option>
                      <option value={UserRole.EMPLOYER}>View as Employer</option>
                      <option value={UserRole.VERIFIER}>View as Verifier</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-3 ml-4">
                    <div className="text-right hidden sm:block">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.role}</div>
                    </div>
                    <Avatar src={user.avatarUrl} alt={user.name} />
                    <Button variant="ghost" size="sm" onClick={onLogout}>Sign out</Button>
                  </div>
                </>
              ) : (
                <Button onClick={() => onNavigate('login')}>Sign In</Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          &copy; 2024 MAMIE Education Network. All verified.
        </div>
      </footer>
    </div>
  );
};

const NavButton = ({ active, children, onClick }: { active: boolean, children: React.ReactNode, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-full transition-colors ${
      active
        ? 'border-indigo-500 text-gray-900'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`}
  >
    {children}
  </button>
);
