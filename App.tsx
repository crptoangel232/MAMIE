import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { StudentProfileView } from './pages/StudentProfile';
import { EmployerSearch } from './pages/EmployerSearch';
import { VerifierDashboard } from './pages/VerifierDashboard';
import { User, UserRole, StudentProfile } from './types';
import { api } from './services/api';
import { USERS, PROFILES } from './mockData';

const LoginScreen = ({ onLogin }: { onLogin: (email: string) => void }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center">
           <span className="text-white font-bold text-2xl">M</span>
        </div>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Sign in to MAMIE</h2>
        <p className="mt-2 text-sm text-gray-600">Select a demo persona to continue</p>
      </div>
      <div className="mt-8 space-y-4">
        <button onClick={() => onLogin('alice@uni.edu')} className="w-full flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all group">
           <div className="text-left">
             <p className="font-bold text-gray-900">Alice Chen</p>
             <p className="text-xs text-gray-500">Student (Computer Science)</p>
           </div>
           <span className="text-indigo-600 opacity-0 group-hover:opacity-100 font-medium">Select &rarr;</span>
        </button>
        <button onClick={() => onLogin('hr@agrotech.com')} className="w-full flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all group">
           <div className="text-left">
             <p className="font-bold text-gray-900">AgroTech HR</p>
             <p className="text-xs text-gray-500">Employer</p>
           </div>
           <span className="text-indigo-600 opacity-0 group-hover:opacity-100 font-medium">Select &rarr;</span>
        </button>
        <button onClick={() => onLogin('mensah@uni.edu')} className="w-full flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all group">
           <div className="text-left">
             <p className="font-bold text-gray-900">Prof. Mensah</p>
             <p className="text-xs text-gray-500">Verifier (Instructor)</p>
           </div>
           <span className="text-indigo-600 opacity-0 group-hover:opacity-100 font-medium">Select &rarr;</span>
        </button>
      </div>
    </div>
  </div>
);

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [page, setPage] = useState<string>('home');
  const [profileData, setProfileData] = useState<StudentProfile | null>(null);

  const handleLogin = async (email: string) => {
    const loggedInUser = await api.login(email);
    if (loggedInUser) {
      setUser(loggedInUser);
      // Determine default landing page based on role
      if (loggedInUser.role === UserRole.STUDENT) setPage('profile');
      else if (loggedInUser.role === UserRole.EMPLOYER) setPage('search');
      else if (loggedInUser.role === UserRole.VERIFIER) setPage('verifier');
      else setPage('home');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setPage('login');
    setProfileData(null);
  };

  const handleRoleSwitch = (newRole: UserRole) => {
     if (user) {
        // Quick hack to switch identity for demo purposes
        let nextUser = user;
        if(newRole === UserRole.STUDENT) nextUser = USERS[0]; // Alice
        if(newRole === UserRole.EMPLOYER) nextUser = USERS[4]; // HR
        if(newRole === UserRole.VERIFIER) nextUser = USERS[3]; // Prof
        setUser(nextUser);
        
        // Redirect if on a page not accessible by new role
        if(newRole === UserRole.STUDENT) setPage('profile');
        if(newRole === UserRole.EMPLOYER) setPage('search');
        if(newRole === UserRole.VERIFIER) setPage('verifier');
     }
  };

  useEffect(() => {
    if (user?.role === UserRole.STUDENT) {
      api.getProfile(user.id).then(setProfileData);
    }
  }, [user, page]);

  // Render logic
  if (!user) return <LoginScreen onLogin={handleLogin} />;

  return (
    <Layout 
      user={user} 
      onLogout={handleLogout} 
      onRoleSwitch={handleRoleSwitch}
      currentPage={page} 
      onNavigate={setPage}
    >
      {page === 'profile' && (
        profileData 
          ? <StudentProfileView profile={profileData} currentUserRole={user.role} isOwnProfile={user.id === profileData.userId} />
          : <div className="text-center p-10">Loading profile...</div>
      )}
      
      {page === 'search' && <EmployerSearch />}
      
      {page === 'verifier' && <VerifierDashboard />}
      
      {page === 'jobs' && (
        <div className="space-y-4">
           <h1 className="text-2xl font-bold">Job Board</h1>
           {/* Simple placeholder for job board */}
           <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
             <h3 className="font-bold text-lg">Junior IoT Engineer</h3>
             <p className="text-gray-600 text-sm mb-2">AgroTech Solutions • Nairobi</p>
             <p className="text-gray-700">Looking for a hands-on engineer to work on smart sensors.</p>
             <div className="mt-4 flex gap-2">
               <span className="px-2 py-1 bg-gray-100 text-xs rounded">IoT</span>
               <span className="px-2 py-1 bg-gray-100 text-xs rounded">C++</span>
             </div>
           </div>
        </div>
      )}
      
      {page === 'home' && (
        <div className="text-center py-20">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to MAMIE</h1>
          <p className="text-xl text-gray-600 mb-8">The trusted network for verified educational achievements.</p>
          <div className="inline-flex space-x-4">
             <button onClick={() => setPage('profile')} className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">Go to My Profile</button>
          </div>
        </div>
      )}
    </Layout>
  );
}
