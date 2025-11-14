import React, { useState, useEffect, useMemo } from 'react';
import type { SKU, Cohort, Provider, CommunityPost, User, Category, CategoryTheme } from '../types';
import { mockApi } from '../services/mockApi';
import { formatDateTime, formatTimeAgo } from '../utils';
import * as Icons from '../components/icons';

interface SKUDetailViewProps {
    sku: SKU;
    navigateTo: (view: string, data?: any) => void;
}

const themeStyles: Record<CategoryTheme, { gradient: string; accentColor: string; buttonClass: string }> = {
    wellness: { gradient: 'from-green-100 to-cyan-100', accentColor: 'text-green-600', buttonClass: 'bg-green-500 hover:bg-green-600 focus:ring-green-500' },
    adventure: { gradient: 'from-orange-100 to-amber-100', accentColor: 'text-orange-600', buttonClass: 'bg-orange-500 hover:bg-orange-600 focus:ring-orange-500' },
    business: { gradient: 'from-blue-100 to-indigo-100', accentColor: 'text-blue-600', buttonClass: 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500' },
    tech: { gradient: 'from-slate-200 to-purple-200', accentColor: 'text-purple-600', buttonClass: 'bg-purple-500 hover:bg-purple-600 focus:ring-purple-500' },
    finance: { gradient: 'from-teal-100 to-emerald-100', accentColor: 'text-teal-600', buttonClass: 'bg-teal-500 hover:bg-teal-600 focus:ring-teal-500' },
    creative: { gradient: 'from-rose-100 to-fuchsia-100', accentColor: 'text-rose-600', buttonClass: 'bg-rose-500 hover:bg-rose-600 focus:ring-rose-500' },
};

const CategoryTemplate: React.FC<{ theme: CategoryTheme }> = ({ theme }) => {
    switch(theme) {
        case 'business':
            return (
                <section>
                    <h2 className="text-2xl font-bold mb-4">Expected ROI & Testimonials</h2>
                    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
                        <p className="text-4xl font-bold text-blue-600">350% Average ROI</p>
                        <p className="text-slate-600">on leadership effectiveness and team productivity.</p>
                        <blockquote className="mt-4 border-l-4 border-blue-200 pl-4 italic text-slate-700">
                            "This program fundamentally changed how I lead. The frameworks are practical and the network is invaluable." - CEO, Tech Startup
                        </blockquote>
                    </div>
                </section>
            );
        case 'tech':
            return (
                <section>
                    <h2 className="text-2xl font-bold mb-4">Career Outcomes</h2>
                    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100 space-y-4">
                        <div>
                            <p className="text-4xl font-bold text-purple-600">92% Job Placement</p>
                            <p className="text-slate-600">within 3 months of graduation.</p>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-800">Top Hiring Partners:</p>
                            <p className="text-slate-600">Google, Amazon, Microsoft, Netflix</p>
                        </div>
                    </div>
                </section>
            );
        case 'finance':
             return (
                <section>
                    <h2 className="text-2xl font-bold mb-4">Key Financial Strategies You'll Master</h2>
                     <ul className="bg-white p-6 rounded-xl shadow-md border border-slate-100 space-y-2 list-disc list-inside text-slate-700">
                        <li>Portfolio diversification for long-term growth.</li>
                        <li>Advanced options and derivatives trading techniques.</li>
                        <li>Tax-efficient investment strategies.</li>
                    </ul>
                </section>
            );
        case 'wellness':
             return (
                <section>
                    <h2 className="text-2xl font-bold mb-4">Your Path to Well-being</h2>
                    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
                         <blockquote className="border-l-4 border-green-200 pl-4 italic text-slate-700">
                            "I haven't felt this calm and centered in years. The morning reset is now an essential part of my day." - Alex R.
                        </blockquote>
                    </div>
                </section>
            );
        default: // Adventure & Creative
             return (
                <section>
                    <h2 className="text-2xl font-bold mb-4">The Experience</h2>
                    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
                        <p className="text-slate-700">
                           This is more than just an activity; it's a chance to connect, create, and challenge yourself. Expect breathtaking views, expert guidance, and memories that will last a lifetime.
                        </p>
                    </div>
                </section>
            );
    }
}


const SKUDetailView: React.FC<SKUDetailViewProps> = ({ sku, navigateTo }) => {
    const [detailedSku, setDetailedSku] = useState<SKU | null>(null);
    const [category, setCategory] = useState<Category | null>(null);
    const [providers, setProviders] = useState<Map<string, Provider>>(new Map());
    const [proofOfGrowthPosts, setProofOfGrowthPosts] = useState<CommunityPost[]>([]);
    const [postAuthors, setPostAuthors] = useState<Map<string, User>>(new Map());
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const [skuData, allCategories] = await Promise.all([
                mockApi.getSkuById(sku.id),
                mockApi.getCategories()
            ]);
            
            if (!skuData) {
                setIsLoading(false); return;
            }
            setDetailedSku(skuData);

            const parentCategory = allCategories.find(cat => cat.subCategories.some(sub => sub.id === skuData.subCategoryId)) || null;
            setCategory(parentCategory);

            const allCohorts = skuData.variants.flatMap(v => v.cohorts);
            const providerIds = new Set(allCohorts.map(c => c.providerId));
            const providerData = await Promise.all(Array.from(providerIds).map(id => mockApi.getProviderById(id)));
            const providerMap = new Map<string, Provider>();
            providerData.forEach(p => p && providerMap.set(p.id, p));
            setProviders(providerMap);

            if (skuData.communityId) {
                const community = await mockApi.getCommunityById(skuData.communityId);
                const posts = community?.posts.filter(p => p.postType === 'proof-of-growth' && p.relatedSkuId === skuData.id) || [];
                setProofOfGrowthPosts(posts);

                const authorIds = new Set(posts.map(p => p.authorId));
                const authorData = await Promise.all(Array.from(authorIds).map(id => mockApi.getUserById(id)));
                const authorMap = new Map<string, User>();
                authorData.forEach(u => u && authorMap.set(u.id, u));
                setPostAuthors(authorMap);
            }
            setIsLoading(false);
        };
        fetchData();
    }, [sku.id]);
    
    const topCohorts = useMemo(() => {
        if (!detailedSku) return [];
        return detailedSku.variants
            .flatMap(variant => variant.cohorts.map(cohort => ({ ...cohort, variant })))
            .filter(c => c.startDateTime > new Date())
            .sort((a, b) => a.startDateTime.getTime() - b.startDateTime.getTime())
            .slice(0, 3);
    }, [detailedSku]);

    const theme = category ? themeStyles[category.theme] : themeStyles.finance;
    const handleCommunityClick = () => {
        if (!detailedSku) return;
        const communityType = detailedSku.communityId === 'comm-1' || detailedSku.communityId === 'comm-2' ? 'club' : 'guild';
        navigateTo(communityType === 'club' ? 'journeyMap' : 'communityDetail', { communityId: detailedSku.communityId });
    }

    if (isLoading) return <div className="text-center p-10">Loading details...</div>
    if (!detailedSku) return <div className="text-center p-10">Could not find details for this activity.</div>

    return (
        <div className="animate-fade-in-up">
            <button onClick={() => navigateTo('discover')} className="text-teal-600 hover:underline font-semibold mb-4 inline-block">
                &larr; Back to Discover
            </button>
            
            <div className={`relative h-48 md:h-64 rounded-2xl overflow-hidden mb-8 bg-gradient-to-br ${theme.gradient}`}>
                <div className="absolute inset-0 bg-black/20"></div>
                 <img src={`https://picsum.photos/seed/${sku.id}/1200/400`} alt={sku.name} className="w-full h-full object-cover opacity-30"/>
                <div className="absolute bottom-0 left-0 p-6 md:p-8">
                    {category && <p className={`font-bold ${theme.accentColor} uppercase tracking-wider`}>{category.name}</p>}
                    <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white">{sku.name}</h1>
                </div>
            </div>

            <div className="lg:grid lg:grid-cols-3 lg:gap-12">
                <div className="lg:col-span-2 space-y-12">
                    <p className="text-lg text-slate-700 leading-relaxed">{sku.description}</p>
                    
                    <section>
                         <h2 className="text-2xl font-bold mb-4">Key Features</h2>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                             {detailedSku.features.map(feature => {
                                 const Icon = Icons[feature.icon as keyof typeof Icons];
                                 return (
                                     <div key={feature.text} className="bg-white p-4 rounded-xl shadow-md border border-slate-100 flex items-center space-x-3">
                                         {Icon && <Icon className={`w-6 h-6 ${theme.accentColor}`} />}
                                         <p className="font-semibold text-slate-800">{feature.text}</p>
                                     </div>
                                 )
                             })}
                         </div>
                    </section>
                    
                    {category && <CategoryTemplate theme={category.theme} />}
                    
                    {proofOfGrowthPosts.length > 0 && (
                        <section>
                             <h2 className="text-2xl font-bold mb-4">Proof of Growth</h2>
                             <div className="space-y-6">
                                {proofOfGrowthPosts.map(post => {
                                    const author = postAuthors.get(post.authorId);
                                    return (
                                        <div key={post.id} className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 transform transition-transform hover:-translate-y-1">
                                            <div className="flex items-center space-x-3 mb-3">
                                                <img src={author?.avatarUrl} alt={author?.name} className="w-12 h-12 rounded-full" />
                                                <div>
                                                    <p className="font-semibold text-slate-800">{author?.name}</p>
                                                    <p className="text-sm text-slate-500">Shared {formatTimeAgo(post.timestamp)}</p>
                                                </div>
                                            </div>
                                            <p className="text-slate-700 italic">"{post.content}"</p>
                                            {post.photos && post.photos.length > 0 && (
                                                <div className="mt-4">
                                                    <img src={post.photos[0]} alt="Proof of growth" className="rounded-lg shadow-md w-full object-cover"/>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                             </div>
                             <div className="text-center mt-6">
                                <button onClick={handleCommunityClick} className={`${theme.accentColor} font-semibold hover:underline`}>
                                    See more in the Community &rarr;
                                </button>
                             </div>
                        </section>
                    )}
                </div>

                <div className="lg:col-span-1 mt-12 lg:mt-0">
                    <div className="lg:sticky lg:top-28">
                        <div className="bg-white p-6 rounded-xl shadow-xl border border-slate-200">
                            <h2 className="text-2xl font-bold mb-4 text-center">Join an Upcoming Cohort</h2>
                            {topCohorts.length > 0 ? (
                                <div className="space-y-4">
                                    {topCohorts.map((cohort) => {
                                         const provider = providers.get(cohort.providerId);
                                         const isFull = cohort.attendees.length >= cohort.capacity;
                                         return provider ? (
                                            <div key={cohort.id} className="border border-slate-200 p-4 rounded-lg">
                                                <p className="font-semibold">{formatDateTime(cohort.startDateTime, cohort.timeZone, {dateStyle: 'medium', timeStyle: 'short'})}</p>
                                                <p className="text-sm text-slate-600">with {provider.name}</p>
                                                <div className="flex justify-between items-center mt-3">
                                                    <p className="text-2xl font-bold text-slate-800">${cohort.variant.price}</p>
                                                    <button 
                                                        onClick={() => !isFull && navigateTo('checkout', { cohortId: cohort.id })}
                                                        disabled={isFull}
                                                        className={`py-2 px-4 rounded-lg font-semibold text-white transition-all duration-300 text-sm ${
                                                            isFull 
                                                            ? 'bg-amber-500 hover:bg-amber-600 cursor-not-allowed' 
                                                            : theme.buttonClass
                                                        } focus:outline-none focus:ring-2 focus:ring-offset-2`}>
                                                        {isFull ? 'Waitlist' : 'Select'}
                                                    </button>
                                                </div>
                                            </div>
                                        ) : null
                                    })}
                                </div>
                            ) : (
                                <div className="text-center p-4 bg-slate-50 rounded-lg">
                                    <p className="text-slate-700">No upcoming dates. Join the waitlist to be notified!</p>
                                    <button className="mt-4 w-full bg-amber-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-amber-600">
                                        Join Waitlist
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SKUDetailView;
