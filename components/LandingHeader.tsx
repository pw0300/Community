import React from 'react';

interface LandingHeaderProps {
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


const LandingHeader: React.FC<LandingHeaderProps> = ({ navigateTo }) => {
    return (
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200/80">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigateTo('landing')}>
                       <GrowthQuestIcon />
                       <h1 className="text-xl font-bold text-slate-800 tracking-tight">GrowthQuest</h1>
                    </div>

                    <nav className="hidden md:flex items-center space-x-2">
                        <a href="#clubs-guilds" className="text-slate-600 hover:text-teal-600 font-medium cursor-pointer px-4 py-2 rounded-lg transition-colors">Personal Clubs</a>
                        <a href="#clubs-guilds" className="text-slate-600 hover:text-teal-600 font-medium cursor-pointer px-4 py-2 rounded-lg transition-colors">Professional Guilds</a>
                        <a href="#how-it-works" className="text-slate-600 hover:text-teal-600 font-medium cursor-pointer px-4 py-2 rounded-lg transition-colors">Why Join?</a>
                    </nav>
                   
                    <div className="flex items-center space-x-4">
                        <button onClick={() => navigateTo('discover')} className="text-slate-600 hover:text-teal-600 font-medium transition-colors text-sm">
                           Log In
                        </button>
                        <button onClick={() => navigateTo('onboarding')} className="bg-teal-500 text-white font-semibold py-2 px-5 rounded-full hover:bg-teal-600 transition-all transform hover:scale-105 shadow-sm hover:shadow-md">
                           Find Your Community
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default LandingHeader;