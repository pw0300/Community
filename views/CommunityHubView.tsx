import React, { useState, useEffect } from 'react';
import { mockApi } from '../services/mockApi';
import type { Community } from '../types';
import { UsersIcon } from '../components/icons';

interface CommunityHubViewProps {
    navigateTo: (view: string, data?: any) => void;
}

const CommunityHubView: React.FC<CommunityHubViewProps> = ({ navigateTo }) => {
    const [userCommunities, setUserCommunities] = useState<Community[]>([]);
    const [discoverCommunities, setDiscoverCommunities] = useState<Community[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const [userComms, allComms] = await Promise.all([
                mockApi.getUserCommunities('user-seeker-123'),
                mockApi.getAllCommunities()
            ]);
            
            setUserCommunities(userComms);
            const userCommIds = new Set(userComms.map(c => c.id));
            setDiscoverCommunities(allComms.filter(c => !userCommIds.has(c.id)));

            setIsLoading(false);
        };
        fetchData();
    }, []);

    const handleCommunityClick = (community: Community) => {
        if (community.type === 'club') {
            navigateTo('journeyMap', { communityId: community.id });
        } else {
            navigateTo('communityDetail', { communityId: community.id });
        }
    };

    if (isLoading) {
        return <p className="text-center p-10">Loading your communities...</p>;
    }

    const totalMembers = userCommunities.reduce((sum, comm) => sum + comm.members.length, 0);

    return (
        <div className="max-w-6xl mx-auto animate-fade-in-up">
            <header className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">Welcome to the Hub</h1>
                <p className="mt-3 max-w-2xl mx-auto text-lg text-slate-600">This is your central place for connection, discussion, and continued growth with fellow questers.</p>
            </header>

            {/* Stats and Search */}
            <section className="mb-12">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-teal-400">
                        <h3 className="text-slate-500 font-semibold">Your Communities</h3>
                        <p className="text-4xl font-bold text-teal-600 mt-2">{userCommunities.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-amber-400">
                        <h3 className="text-slate-500 font-semibold">Your Network</h3>
                        <p className="text-4xl font-bold text-amber-600 mt-2">{totalMembers}</p>
                        <p className="text-sm text-slate-500">Total members</p>
                    </div>
                     <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-rose-400">
                        <h3 className="text-slate-500 font-semibold">Discover More</h3>
                        <div className="mt-3 relative">
                           <input type="text" placeholder="Search communities..." className="w-full pl-10 pr-4 py-2 border rounded-full focus:ring-rose-500 focus:border-rose-500"/>
                           <UsersIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        </div>
                    </div>
                 </div>
            </section>
            
            <section className="mb-16">
                 <h2 className="text-3xl font-bold tracking-tight text-slate-800 mb-6">Your Communities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {userCommunities.map(community => (
                        <div key={community.id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer border border-slate-100 flex flex-col" onClick={() => handleCommunityClick(community)}>
                             <img src={community.coverImageUrl} alt={community.name} className="h-32 w-full object-cover rounded-lg -mt-10 mb-4 shadow-lg"/>
                            <div className="flex-grow">
                                <h3 className="text-2xl font-bold text-teal-700">{community.name}</h3>
                                <p className="text-slate-600 mt-2">{community.description}</p>
                            </div>
                            <div className="mt-6 flex items-center justify-between">
                                <div className="flex -space-x-3">
                                    {community.members.slice(0,3).map(m => (
                                         <img key={m} className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src={`https://picsum.photos/seed/${m}/50/50`} alt="member"/>
                                    ))}
                                    {community.members.length > 3 && (
                                       <span className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-200 text-sm font-medium text-slate-700 ring-2 ring-white">+{community.members.length - 3}</span>
                                    )}
                                </div>
                                <span className="text-teal-600 font-semibold hover:underline">Enter &rarr;</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

             <section>
                 <h2 className="text-3xl font-bold tracking-tight text-slate-800 mb-6">Discover New Communities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {discoverCommunities.map(community => (
                        <div key={community.id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer border border-slate-100 flex flex-col" onClick={() => handleCommunityClick(community)}>
                            <img src={community.coverImageUrl} alt={community.name} className="h-32 w-full object-cover rounded-lg -mt-10 mb-4 shadow-lg"/>
                            <div className="flex-grow">
                                <h3 className="text-2xl font-bold text-slate-800">{community.name}</h3>
                                <p className="text-slate-600 mt-2">{community.description}</p>
                            </div>
                            <div className="mt-6 flex items-center justify-between">
                                <p className="text-sm font-medium text-slate-500">{community.members.length} members</p>
                                <button className="font-semibold text-teal-600 hover:underline">Join &rarr;</button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default CommunityHubView;