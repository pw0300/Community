import React, { useState, useEffect, useMemo } from 'react';
import { mockApi } from '../services/mockApi';
import type { Category, SKU, SubCategory, Community } from '../types';
import { SparklesIcon, StarIcon } from '../components/icons';

interface DiscoverViewProps {
    navigateTo: (view: string, data?: any) => void;
}

const DiscoverView: React.FC<DiscoverViewProps> = ({ navigateTo }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [allSkus, setAllSkus] = useState<SKU[]>([]);
    const [recommendations, setRecommendations] = useState<SKU[]>([]);
    const [communities, setCommunities] = useState<Community[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const [cats, recs, comms, skus] = await Promise.all([
                mockApi.getCategories(),
                mockApi.getAiRecommendations('user-seeker-123'),
                mockApi.getAllCommunities(),
                mockApi.getAllSkus(),
            ]);
            setCategories(cats);
            setRecommendations(recs);
            setCommunities(comms.sort((a,b) => b.activeNow - a.activeNow));
            setAllSkus(skus);
            setIsLoading(false);
        };
        fetchData();
    }, []);
    
    const popularSkus = useMemo(() => {
        if (!allSkus.length) return [];
        return [...allSkus].sort((a, b) => {
            const attendeesA = a.variants.reduce((sum, v) => sum + v.cohorts.reduce((cSum, c) => cSum + c.attendees.length, 0), 0);
            const attendeesB = b.variants.reduce((sum, v) => sum + v.cohorts.reduce((cSum, c) => cSum + c.attendees.length, 0), 0);
            return attendeesB - attendeesA;
        }).slice(0, 3);
    }, [allSkus]);

    const handleCommunityClick = (community: Community) => {
        navigateTo(community.type === 'club' ? 'journeyMap' : 'communityDetail', { communityId: community.id });
    };

    if (isLoading) {
        return <div className="text-center p-10 text-slate-500">Loading Growth Opportunities...</div>;
    }

    return (
        <div className="space-y-16">
            <section className="animate-fade-in-up">
                <h1 className="text-4xl font-bold tracking-tight text-slate-900">Discover Your Next Step</h1>
                <p className="mt-2 text-lg text-slate-600">Explore communities, experiences, and personalized recommendations.</p>
            </section>
            
            <section className="animate-slide-in-from-bottom" style={{ animationDelay: '100ms' }}>
                 <h2 className="text-3xl font-bold mb-6 tracking-tight text-slate-900">Trending Communities</h2>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {communities.slice(0, 3).map(community => (
                        <div key={community.id} onClick={() => handleCommunityClick(community)} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-slate-100 flex flex-col">
                            <img src={community.coverImageUrl} alt={community.name} className="h-32 w-full object-cover rounded-t-xl" />
                            <div className="p-5 flex flex-col flex-grow">
                               <h3 className="text-xl font-bold text-slate-800">{community.name}</h3>
                               <p className="text-slate-600 text-sm mt-1 flex-grow">{community.description}</p>
                               <div className="mt-4 flex justify-between items-center text-sm">
                                   <div className="flex items-center space-x-2">
                                       <div className="relative flex items-center">
                                           <span className="absolute -left-1 h-3 w-3 rounded-full bg-red-500 animate-pulse-glow"></span>
                                            <span className="ml-3 font-bold text-red-600">{community.activeNow}</span>
                                       </div>
                                       <span className="text-slate-500">active now</span>
                                   </div>
                                   <div className="font-semibold text-green-600">
                                       +{community.weeklyGrowth}% this week
                                   </div>
                               </div>
                            </div>
                        </div>
                    ))}
                 </div>
            </section>
            
            <section className="animate-slide-in-from-bottom" style={{ animationDelay: '200ms' }}>
                 <h2 className="text-3xl font-bold mb-6 tracking-tight text-slate-900">Popular Experiences</h2>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {popularSkus.map(sku => (
                        <div key={sku.id} onClick={() => navigateTo('skuDetail', { sku })} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-slate-100 flex flex-col overflow-hidden">
                             <img src={`https://picsum.photos/seed/${sku.id}/600/400`} alt={sku.name} className="h-40 w-full object-cover" />
                             <div className="p-5 flex flex-col flex-grow">
                               <h3 className="text-xl font-bold text-slate-800">{sku.name}</h3>
                               <p className="text-slate-600 text-sm mt-1 flex-grow line-clamp-2">{sku.description}</p>
                               <div className="mt-4 flex justify-between items-center text-sm">
                                   <p className="font-bold text-teal-600 text-lg">${sku.variants[0].price}</p>
                                   <div className="flex items-center space-x-1">
                                       <StarIcon className="w-5 h-5 text-amber-400" />
                                       <span className="font-bold text-slate-700">4.9</span>
                                       <span className="text-slate-500">(72)</span>
                                   </div>
                               </div>
                            </div>
                        </div>
                    ))}
                 </div>
            </section>

            <section className="animate-slide-in-from-bottom" style={{ animationDelay: '300ms' }}>
                <h2 className="text-3xl font-bold mb-4 tracking-tight text-slate-900">✨ AI Recommendations For You</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendations.map(sku => (
                         <div key={sku.id} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer border border-slate-100 hover:border-teal-300" onClick={() => navigateTo('skuDetail', { sku })}>
                            <div className="flex items-center space-x-4">
                              <div className="bg-teal-100 p-3 rounded-full">
                                  <SparklesIcon className="w-6 h-6 text-teal-600" />
                              </div>
                              <div>
                                  <h3 className="font-bold text-slate-900 text-lg">{sku.name}</h3>
                                  <p className="text-sm text-slate-500 line-clamp-2">{sku.description}</p>
                              </div>
                            </div>
                         </div>
                    ))}
                </div>
            </section>

            {categories.map((category, catIndex) => (
                <section key={category.id} className="animate-slide-in-from-bottom" style={{ animationDelay: `${400 + catIndex * 100}ms` }}>
                    <h2 className="text-3xl font-bold mb-6 tracking-tight text-slate-900">{category.name}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {category.subCategories.flatMap(sub => sub.skus).map(sku => (
                            <div key={sku.id} onClick={() => navigateTo('skuDetail', { sku })} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-slate-100 flex flex-col overflow-hidden">
                                <img src={`https://picsum.photos/seed/${sku.id}/600/400`} alt={sku.name} className="h-40 w-full object-cover" />
                                <div className="p-5 flex flex-col flex-grow">
                                  <h3 className="text-lg font-bold text-slate-800">{sku.name}</h3>
                                  <p className="text-slate-600 text-sm mt-1 flex-grow line-clamp-2">{sku.description}</p>
                                  <div className="mt-4 flex justify-between items-center text-sm">
                                      <p className="font-bold text-teal-600 text-lg">${sku.variants[0].price}</p>
                                  </div>
                               </div>
                           </div>
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
};

export default DiscoverView;
