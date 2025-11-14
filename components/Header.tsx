import React from 'react';
import type { ProviderRole } from '../types';

interface HeaderProps {
    userMode: 'seeker' | 'provider';
    setUserMode: (mode: 'seeker' | 'provider') => void;
    providerRole: ProviderRole;
    setProviderRole: (role: ProviderRole) => void;
    navigateTo: (view: string) => void;
}

const GrowthQuestIcon: React.FC = () => (
     <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: '#2dd4bf', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#06b6d4', stopOpacity: 1}} />
            </linearGradient>
        </defs>
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM11 16.5v-3.5L7.5 16.5l-1.42-1.42L9.58 12 6.08 8.42 7.5 7l3.5 3.5V7h2v10h-1.5zM16.5 16.5h-2v-2h2v2zm0-4.5h-2v-2h2v2z" fill="url(#grad1)" />
    </svg>
);


const Header: React.FC<HeaderProps> = ({ userMode, setUserMode, providerRole, setProviderRole, navigateTo }) => {
    
    const handleModeToggle = () => {
        setUserMode(userMode === 'seeker' ? 'provider' : 'seeker');
    };

    return (
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200/80">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigateTo('discover')}>
                       <GrowthQuestIcon />
                        <h1 className="text-xl font-bold text-slate-800 tracking-tight">GrowthQuest</h1>
                    </div>

                    {userMode === 'seeker' && (
                         <nav className="hidden md:flex items-center space-x-2">
                            <a onClick={() => navigateTo('discover')} className="text-slate-600 hover:bg-slate-100 font-medium cursor-pointer px-4 py-2 rounded-lg transition-colors">Discover</a>
                            <a onClick={() => navigateTo('myActivities')} className="text-slate-600 hover:bg-slate-100 font-medium cursor-pointer px-4 py-2 rounded-lg transition-colors">My Activities</a>
                            <a onClick={() => navigateTo('communityHub')} className="text-slate-600 hover:bg-slate-100 font-medium cursor-pointer px-4 py-2 rounded-lg transition-colors">Communities</a>
                        </nav>
                    )}
                   
                    <div className="flex items-center space-x-4">
                       { userMode === 'provider' && (
                           <div className="flex items-center bg-slate-100 rounded-full p-1 text-sm">
                               <button 
                                   onClick={() => setProviderRole('guide')}
                                   className={`px-3 py-1 rounded-full font-semibold ${providerRole === 'guide' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:bg-slate-200/50'}`}
                               >
                                   Guide
                               </button>
                               <button 
                                   onClick={() => setProviderRole('partner')}
                                   className={`px-3 py-1 rounded-full font-semibold ${providerRole === 'partner' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:bg-slate-200/50'}`}
                               >
                                   Partner
                               </button>
                           </div>
                       )}
                       
                       <button className="relative text-slate-500 hover:text-slate-700">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                           </svg>
                           <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                       </button>

                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-slate-600">{userMode === 'seeker' ? 'Seeker' : 'Provider'}</span>
                            <button
                                onClick={handleModeToggle}
                                className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 bg-teal-600"
                                type="button"
                            >
                                <span className={`${userMode === 'provider' ? 'translate-x-5' : 'translate-x-0'} inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}/>
                            </button>
                        </div>
                        <img className="h-10 w-10 rounded-full" src="https://picsum.photos/seed/user/100/100" alt="User Avatar" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;