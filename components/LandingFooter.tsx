import React from 'react';
import { TwitterIcon, LinkedInIcon } from './icons';

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

const LandingFooter: React.FC = () => {
    return (
        <footer className="bg-slate-800 text-slate-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                    <div className="col-span-2 lg:col-span-1">
                        <div className="flex items-center space-x-3">
                           <GrowthQuestIcon />
                           <h1 className="text-xl font-bold text-white tracking-tight">GrowthQuest</h1>
                        </div>
                        <p className="mt-4 text-sm text-slate-400">Community is the catalyst.</p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-white tracking-wider uppercase">Product</h3>
                        <ul className="mt-4 space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">Personal Clubs</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Professional Guilds</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">For Providers</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-white tracking-wider uppercase">Company</h3>
                        <ul className="mt-4 space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-white tracking-wider uppercase">Legal</h3>
                        <ul className="mt-4 space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-slate-400">&copy; {new Date().getFullYear()} GrowthQuest Concierge. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="text-slate-400 hover:text-white transition-colors"><TwitterIcon /></a>
                        <a href="#" className="text-slate-400 hover:text-white transition-colors"><LinkedInIcon /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default LandingFooter;
