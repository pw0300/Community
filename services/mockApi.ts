import type { Category, SKU, Cohort, Provider, Community, Booking, User, CommunityPost, SubCategory, SkuVariant, Milestone, CommunityResource, CommunityMemberProfile } from '../types';

const providers: Provider[] = [
    { id: 'prov-1', name: 'Julianne Voyage', avatarUrl: 'https://picsum.photos/seed/julianne/100/100', onTimeStartRate: 98, isTrusted: true, rating: 4.9, bio: 'Patagonia-certified expedition leader.', quote: 'The greatest growth happens just outside your comfort zone. Let\'s find it together.', otherSkuIds: [] },
    { id: 'prov-2', name: 'Dr. Anya Sharma', avatarUrl: 'https://picsum.photos/seed/anya/100/100', onTimeStartRate: 100, isTrusted: true, rating: 5.0, bio: 'Holistic wellness coach specializing in mindfulness.', quote: 'Inner peace is the new success. It is the foundation from which all else grows.', otherSkuIds: [] },
    { id: 'prov-3', name: 'Elevate Leadership', avatarUrl: 'https://picsum.photos/seed/elevate/100/100', onTimeStartRate: 99, isTrusted: true, rating: 4.8, bio: 'A consortium of Fortune 500 executives.', quote: 'We aren\'t just teaching leadership; we are building the next generation of industry titans.', otherSkuIds: [] },
    { id: 'prov-4', name: 'CodeCrafters Academy', avatarUrl: 'https://picsum.photos/seed/code/100/100', onTimeStartRate: 97, isTrusted: true, rating: 4.9, bio: 'Top-tier bootcamp with direct hiring pipelines.', quote: 'The future is built with code. We provide the tools, you bring the vision.', otherSkuIds: [] },
    { id: 'prov-5', name: 'Leo Sterling', avatarUrl: 'https://picsum.photos/seed/leo/100/100', onTimeStartRate: 96, isTrusted: false, rating: 4.7, bio: 'Veteran wealth manager with a focus on diversified growth.', otherSkuIds: [] },
    { id: 'prov-6', name: 'Melody Masters', avatarUrl: 'https://picsum.photos/seed/melody/100/100', onTimeStartRate: 100, isTrusted: true, rating: 5.0, bio: 'Grammy-award winning producers sharing their secrets.', otherSkuIds: [] },
    { id: 'prov-7', name: 'Lingua Leap', avatarUrl: 'https://picsum.photos/seed/lingua/100/100', onTimeStartRate: 99, isTrusted: true, rating: 4.8, bio: 'Immersive language programs that get you conversational, fast.', otherSkuIds: [] },
    { id: 'prov-8', name: 'Zenith Fitness', avatarUrl: 'https://picsum.photos/seed/zenith/100/100', onTimeStartRate: 95, isTrusted: true, rating: 4.9, bio: 'Elite trainers pushing the boundaries of physical performance.', otherSkuIds: [] },
];

const users: User[] = [
    { id: 'user-seeker-123', name: 'Sam Seeker', avatarUrl: 'https://i.pravatar.cc/150?u=user-seeker-123', role: 'seeker' },
    { id: 'user-2', name: 'Jane Doe', avatarUrl: 'https://i.pravatar.cc/150?u=user-2', role: 'seeker' },
    { id: 'user-3', name: 'Alex Ray', avatarUrl: 'https://i.pravatar.cc/150?u=user-3', role: 'seeker' },
    { id: 'user-4', name: 'Mia Wong', avatarUrl: 'https://i.pravatar.cc/150?u=user-4', role: 'seeker' },
    { id: 'user-5', name: 'Chris Lee', avatarUrl: 'https://i.pravatar.cc/150?u=user-5', role: 'seeker' },
    { id: 'user-6', name: 'Priya Patel', avatarUrl: 'https://i.pravatar.cc/150?u=user-6', role: 'seeker' },
];

const getFutureDate = (days: number, hour: number = 9): Date => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    date.setHours(hour, 0, 0, 0);
    return date;
};

const cohorts: Cohort[] = [
    { id: 'coh-1', skuVariantId: 'var-1', providerId: 'prov-1', startDateTime: getFutureDate(30), endDateTime: getFutureDate(44), timeZone: 'America/Santiago', capacity: 10, attendees: ['user-2', 'user-3', 'user-4', 'user-5'], location: 'Torres del Paine, Chile', announcements: [], chat: [], checklist: [] },
    { id: 'coh-2', skuVariantId: 'var-2', providerId: 'prov-2', startDateTime: getFutureDate(7, 6), endDateTime: getFutureDate(7, 7), timeZone: 'America/New_York', capacity: 50, attendees: [], meetingUrl: 'https://zoom.us/j/1', announcements: [], chat: [], checklist: [] },
    { id: 'coh-3', skuVariantId: 'var-2', providerId: 'prov-2', startDateTime: getFutureDate(14, 6), endDateTime: getFutureDate(14, 7), timeZone: 'America/New_York', capacity: 3, attendees: ['user-2', 'user-seeker-123', 'user-4'], meetingUrl: 'https://zoom.us/j/2', announcements: [{id: 'a1', content: 'Welcome! Pre-course materials have been sent.', timestamp: new Date()}], chat: [{id:'ch1', authorId: 'user-2', content: 'Excited to start!', timestamp: new Date()}], checklist: [] },
    { id: 'coh-4', skuVariantId: 'var-3', providerId: 'prov-3', startDateTime: getFutureDate(21, 9), endDateTime: getFutureDate(66, 17), timeZone: 'America/Chicago', capacity: 25, attendees: ['user-6'], meetingUrl: 'https://teams.com/j/3', announcements: [], chat: [], checklist: [] },
    { id: 'coh-5', skuVariantId: 'var-4', providerId: 'prov-4', startDateTime: getFutureDate(10, 9), endDateTime: getFutureDate(100, 18), timeZone: 'America/Los_Angeles', capacity: 40, attendees: ['user-4', 'user-5'], meetingUrl: 'https://meet.google.com/j/4', announcements: [], chat: [], checklist: [] },
    { id: 'coh-6', skuVariantId: 'var-5', providerId: 'prov-5', startDateTime: getFutureDate(5, 19), endDateTime: getFutureDate(50, 20), timeZone: 'Etc/UTC', capacity: 100, attendees: [], meetingUrl: 'https://zoom.us/j/5', announcements: [], chat: [], checklist: [] },
    { id: 'coh-7', skuVariantId: 'var-6', providerId: 'prov-6', startDateTime: getFutureDate(18, 10), endDateTime: getFutureDate(60, 16), timeZone: 'America/Los_Angeles', capacity: 30, attendees: [], meetingUrl: 'https://zoom.us/j/6', announcements: [], chat: [], checklist: [] },
    { id: 'coh-8', skuVariantId: 'var-7', providerId: 'prov-7', startDateTime: getFutureDate(9, 13), endDateTime: getFutureDate(39, 14), timeZone: 'Europe/Madrid', capacity: 60, attendees: [], meetingUrl: 'https://zoom.us/j/7', announcements: [], chat: [], checklist: [] },
    { id: 'coh-9', skuVariantId: 'var-8', providerId: 'prov-8', startDateTime: getFutureDate(12, 18), endDateTime: getFutureDate(102, 19), timeZone: 'America/New_York', capacity: 20, attendees: [], meetingUrl: 'https://zoom.us/j/8', announcements: [], chat: [], checklist: [] },
];

const skuVariants: SkuVariant[] = [
    { id: 'var-1', skuId: 'sku-1', name: 'All-Inclusive Expedition', description: 'Full package with guides, gear, and lodging.', deliveryMode: 'offline', format: 'group', sessionType: 'multi', price: 7500, cohorts: cohorts.filter(c => c.skuVariantId === 'var-1') },
    { id: 'var-2', skuId: 'sku-2', name: 'Daily Livestream', description: 'Join daily guided mindfulness sessions.', deliveryMode: 'online', format: 'group', sessionType: 'multi', price: 49, cohorts: cohorts.filter(c => c.skuVariantId === 'var-2') },
    { id: 'var-3', skuId: 'sku-3', name: 'Executive Cohort', description: 'An intensive program for senior leaders.', deliveryMode: 'online', format: 'group', sessionType: 'multi', price: 5000, cohorts: cohorts.filter(c => c.skuVariantId === 'var-3') },
    { id: 'var-4', skuId: 'sku-4', name: 'Full-Time Bootcamp', description: 'A comprehensive, career-focused program.', deliveryMode: 'online', format: 'group', sessionType: 'multi', price: 15000, cohorts: cohorts.filter(c => c.skuVariantId === 'var-4') },
    { id: 'var-5', skuId: 'sku-5', name: 'Core Curriculum', description: 'Master the fundamentals of wealth creation.', deliveryMode: 'online', format: 'group', sessionType: 'multi', price: 999, cohorts: cohorts.filter(c => c.skuVariantId === 'var-5') },
    { id: 'var-6', skuId: 'sku-6', name: 'Full Masterclass', description: 'In-depth modules covering production from start to finish.', deliveryMode: 'online', format: 'group', sessionType: 'multi', price: 499, cohorts: cohorts.filter(c => c.skuVariantId === 'var-6') },
    { id: 'var-7', skuId: 'sku-7', name: '30-Day Sprint', description: 'Go from zero to conversational in a month.', deliveryMode: 'online', format: 'group', sessionType: 'multi', price: 299, cohorts: cohorts.filter(c => c.skuVariantId === 'var-7') },
    { id: 'var-8', skuId: 'sku-8', name: '12-Week Transformation', description: 'A holistic program combining fitness and nutrition.', deliveryMode: 'online', format: 'group', sessionType: 'multi', price: 1200, cohorts: cohorts.filter(c => c.skuVariantId === 'var-8') },
    { id: 'var-9', skuId: 'sku-9', name: 'Weekend Retreat', description: 'A virtual weekend of peace and self-discovery.', deliveryMode: 'online', format: 'group', sessionType: 'multi', price: 250, cohorts: cohorts.filter(c => c.skuVariantId === 'var-9') },
];

const peakPerformersJourneyMap: Milestone[] = [
    { id: 'm-1', title: 'Welcome to the Club!', type: 'community', description: 'Introduce yourself and share what you hope to achieve.' },
    { id: 'm-2', title: 'Patagonia Expedition', type: 'sku', description: 'Your first major quest! A 14-day trek through stunning landscapes.', skuId: 'sku-1', isPrerequisite: true, unlocksMilestones: ['m-3', 'm-5'] },
    { id: 'm-3', title: 'Share Your Story', type: 'community', description: 'Post your favorite photo from the expedition and share a key takeaway.' },
    { id: 'm-4', title: 'Body Transformation Challenge', type: 'sku', description: 'Build the strength and endurance for your next adventure.', skuId: 'sku-8' },
    { id: 'm-5', title: 'Gear Up', type: 'community', description: 'Join the discussion on the best gear for high-altitude trekking.' },
];

const futureLeadersResources: CommunityResource[] = [
    { id: 'res-1', title: 'Harvard Business Review: What Makes a Leader?', type: 'article', url: '#', authorId: 'prov-3', timestamp: getFutureDate(-10) },
    { id: 'res-2', title: 'Ray Dalio: Principles for Success (TED Talk)', type: 'video', url: '#', authorId: 'prov-3', timestamp: getFutureDate(-5) },
    { id: 'res-3', title: 'OKR Planning Template (Notion)', type: 'tool', url: '#', authorId: 'prov-3', timestamp: getFutureDate(-2) },
];

const memberProfiles: CommunityMemberProfile[] = [
    { userId: 'user-seeker-123', communityId: 'comm-1', badge: 'Aspiring Alpinist', about: 'Favorite trek: Roopkund. Next up: Everest Base Camp.' },
    { userId: 'user-2', communityId: 'comm-1', badge: 'Trailblazer', about: 'Just got back from Patagonia. The views were unreal! Happy to share tips.' },
    { userId: 'user-3', communityId: 'comm-1', badge: 'Weekend Warrior', about: 'Love finding the best local hikes. Always up for an adventure.' },
    { userId: 'user-seeker-123', communityId: 'comm-3', badge: 'Strategic Visionary', about: 'Scaling my startup. Focused on team building and sustainable growth.' },
    { userId: 'user-6', communityId: 'comm-3', badge: 'Emerging Leader', about: 'Transitioning into my first management role. Here to learn from the best.' },
];

const communities: Community[] = [
    {
        id: 'comm-1', name: 'Peak Performers', type: 'club', description: 'For those who push their limits in the great outdoors.', coverImageUrl: 'https://picsum.photos/seed/peak/800/200',
        members: ['user-seeker-123', 'user-2', 'user-3', 'user-4', 'user-5'], memberProfiles: memberProfiles.filter(p => p.communityId === 'comm-1'), activeNow: 24, weeklyGrowth: 12, journeyMap: peakPerformersJourneyMap,
        posts: [
            { id: 'post-pog-1', authorId: 'user-2', content: 'The Patagonia views were out of this world! This trip pushed all my limits and was worth every second. Can\'t wait for the next one!', photos: ['https://picsum.photos/seed/patagonia1/400/300', 'https://picsum.photos/seed/patagonia2/400/300'], timestamp: getFutureDate(-2), postType: 'proof-of-growth', relatedSkuId: 'sku-1', likes: 42, comments: [{authorId: 'user-3', text: 'Stunning! So glad we did this.', timestamp: getFutureDate(-2)}] },
            { id: 'post-ai-1', authorId: 'ai-agent', content: 'Weekly Challenge: Share your favorite trail from this past week!', isAiAgentPost: true, timestamp: getFutureDate(-1), postType: 'challenge', likes: 15, comments: [] },
        ]
    },
     {
        id: 'comm-2', name: 'Mindful Living', type: 'club', description: 'A space for wellness, meditation, and conscious living.', coverImageUrl: 'https://picsum.photos/seed/mindful/800/200',
        members: ['user-seeker-123', 'user-4', 'user-6'], memberProfiles: [], activeNow: 47, weeklyGrowth: 8,
        posts: [
             { id: 'post-ai-2', authorId: 'ai-agent', content: 'Poll: How do you start your mornings?', isAiAgentPost: true, timestamp: getFutureDate(0), postType: 'poll', pollOptions: ['Meditation', 'Exercise', 'Journaling', 'Coffee & News'], likes: 55, comments: [] },
        ]
    },
    {
        id: 'comm-3', name: 'Future Leaders', type: 'guild', description: 'Connecting the next generation of business innovators.', coverImageUrl: 'https://picsum.photos/seed/leaders/800/200',
        members: ['user-3', 'user-seeker-123', 'user-6'], memberProfiles: memberProfiles.filter(p => p.communityId === 'comm-3'), activeNow: 112, weeklyGrowth: 25, resources: futureLeadersResources,
        posts: [
            { id: 'post-pog-2', authorId: 'user-6', content: 'Just finished the Executive Leadership Accelerator. The ROI module was a game-changer for our Q4 planning. Here\'s a snapshot of our new growth dashboard!', photos: ['https://picsum.photos/seed/dashboard/400/300'], timestamp: getFutureDate(-3), postType: 'proof-of-growth', relatedSkuId: 'sku-3', likes: 61, comments: [] },
            { id: 'post-q1', authorId: 'user-seeker-123', content: 'What are the best frameworks for providing upward feedback to management?', timestamp: getFutureDate(-1), postType: 'question', likes: 12, comments: [{authorId: 'prov-3', text: 'Great question! The Situation-Behavior-Impact (SBI) model is a fantastic, non-confrontational start. I\'ve added an article on it to the Resources tab.', timestamp: getFutureDate(0)}] },
            { id: 'post-res1', authorId: 'prov-3', content: 'New Resource Added: The SBI Feedback Model', timestamp: getFutureDate(0), postType: 'resource', likes: 22, comments: []},
        ]
    },
    {
        id: 'comm-4', name: 'Dev Den', type: 'guild', description: 'Code, collaborate, and create with fellow developers.', coverImageUrl: 'https://picsum.photos/seed/dev/800/200',
        members: ['user-4', 'user-5'], memberProfiles: [], activeNow: 230, weeklyGrowth: 18, posts: [{ id: 'post-3', authorId: 'user-4', content: 'Live now: AMA with a senior engineer from Google!', timestamp: getFutureDate(0), postType: 'prompt', likes: 130, comments: [] }]
    },
    {
        id: 'comm-5', name: 'The Sound Stage', type: 'club', description: 'For musicians, producers, and audio engineers.', coverImageUrl: 'https://picsum.photos/seed/sound/800/200',
        members: [], memberProfiles: [], activeNow: 65, weeklyGrowth: 5, posts: []
    },
    {
        id: 'comm-6', name: 'Wealth Architects', type: 'guild', description: 'Building financial freedom through smart strategies.', coverImageUrl: 'https://picsum.photos/seed/wealth-arch/800/200',
        members: ['user-seeker-123', 'user-2'], memberProfiles: [], activeNow: 98, weeklyGrowth: 15, posts: [{ id: 'post-4', authorId: 'ai-agent', isAiAgentPost: true, content: 'A member just shared a great article on diversification. What\'s one investing principle you live by?', timestamp: getFutureDate(0), postType: 'prompt', likes: 2, comments: [] }]
    },
];

const skus: SKU[] = [
    { id: 'sku-1', name: 'Patagonia Expedition', subCategoryId: 'sub-cat-1', description: 'A 14-day trek through the heart of Patagonia\'s stunning landscapes.', variants: skuVariants.filter(v => v.skuId === 'sku-1'), communityId: 'comm-1', features: [{icon: 'GlobeIcon', text: 'Guided by Experts'}, {icon: 'CheckCircleIcon', text: 'All-Inclusive'}, {icon: 'UsersIcon', text: 'Small Group Size'}], stampIcon: 'HikingBootIcon' },
    { id: 'sku-2', name: 'Mindful Morning Reset', subCategoryId: 'sub-cat-2', description: 'Start your day with intention through guided meditation and mindfulness.', variants: skuVariants.filter(v => v.skuId === 'sku-2'), communityId: 'comm-2', features: [{icon: 'SparklesIcon', text: 'Daily Practice'}, {icon: 'ChatBubbleIcon', text: 'Community Support'}, {icon: 'CalendarIcon', text: 'Flexible Schedule'}], stampIcon: 'YogaPoseIcon' },
    { id: 'sku-3', name: 'Executive Leadership Accelerator', subCategoryId: 'sub-cat-3', description: 'A 6-week program for leaders to scale their impact and influence.', variants: skuVariants.filter(v => v.skuId === 'sku-3'), communityId: 'comm-3', features: [{icon: 'BriefcaseIcon', text: 'C-Suite Coaches'}, {icon: 'ChartBarIcon', text: 'Proven ROI: 350%'}, {icon: 'UsersIcon', text: 'Peer Networking'}], stampIcon: 'BriefcaseIcon' },
    { id: 'sku-4', name: 'Full-Stack Developer Bootcamp', subCategoryId: 'sub-cat-4', description: 'Become a job-ready developer in 12 weeks with our immersive curriculum.', variants: skuVariants.filter(v => v.skuId === 'sku-4'), communityId: 'comm-4', features: [{icon: 'CodeBracketIcon', text: 'Project-Based'}, {icon: 'BriefcaseIcon', text: 'Job Placement: 92%'}, {icon: 'UsersIcon', text: '1-on-1 Mentorship'}], stampIcon: 'CodeBracketIcon' },
    { id: 'sku-5', name: 'Wealth Building Blueprint', subCategoryId: 'sub-cat-5', description: 'A comprehensive guide to investing, saving, and growing your wealth.', variants: skuVariants.filter(v => v.skuId === 'sku-5'), communityId: 'comm-6', features: [{icon: 'ChartBarIcon', text: 'Build a Portfolio'}, {icon: 'SparklesIcon', text: 'Expert Strategies'}, {icon: 'CalendarIcon', text: 'Lifetime Access'}], stampIcon: 'ChartBarIcon' },
    { id: 'sku-6', name: 'Music Production Masterclass', subCategoryId: 'sub-cat-6', description: 'Learn to produce professional-quality music from industry legends.', variants: skuVariants.filter(v => v.skuId === 'sku-6'), communityId: 'comm-5', features: [{icon: 'SparklesIcon', text: 'DAW of Your Choice'}, {icon: 'CheckCircleIcon', text: 'Get Pro Feedback'}, {icon: 'UsersIcon', text: 'Collaborate'}], stampIcon: 'SparklesIcon' },
    { id: 'sku-7', name: 'Spanish Fluency Sprint', subCategoryId: 'sub-cat-7', description: 'An intensive language program designed for rapid conversational fluency.', variants: skuVariants.filter(v => v.skuId === 'sku-7'), communityId: 'comm-5', features: [{icon: 'ChatBubbleIcon', text: 'Native Tutors'}, {icon: 'GlobeIcon', text: 'Immersive Scenarios'}, {icon: 'UsersIcon', text: 'Practice Community'}], stampIcon: 'ChatBubbleIcon' },
    { id: 'sku-8', name: 'Body Transformation Challenge', subCategoryId: 'sub-cat-8', description: 'A 12-week challenge to build strength, endurance, and confidence.', variants: skuVariants.filter(v => v.skuId === 'sku-8'), communityId: 'comm-1', features: [{icon: 'CheckCircleIcon', text: 'Personalized Plan'}, {icon: 'UsersIcon', text: 'Accountability Coach'}, {icon: 'ChartBarIcon', text: 'Track Your Progress'}], stampIcon: 'SparklesIcon' },
    { id: 'sku-9', name: 'Inner Peace Journey', subCategoryId: 'sub-cat-2', description: 'A spiritual retreat to cultivate inner peace and deep self-awareness.', variants: skuVariants.filter(v => v.skuId === 'sku-9'), communityId: 'comm-2', features: [{icon: 'SparklesIcon', text: 'Guided Meditation'}, {icon: 'ChatBubbleIcon', text: 'Silent Reflection'}, {icon: 'GlobeIcon', text: 'Nature Connection'}], stampIcon: 'YogaPoseIcon' },
];

const categories: Category[] = [
    {
        id: 'cat-1', name: 'Travel', theme: 'adventure',
        subCategories: [
            { id: 'sub-cat-1', name: 'Expeditions', imageUrl: 'https://picsum.photos/seed/expeditions/600/400', skus: skus.filter(s => s.subCategoryId === 'sub-cat-1') },
        ]
    },
    {
        id: 'cat-2', name: 'Health & Wellness', theme: 'wellness',
        subCategories: [
            { id: 'sub-cat-2', name: 'Mindfulness', imageUrl: 'https://picsum.photos/seed/mindfulness/600/400', skus: skus.filter(s => s.subCategoryId === 'sub-cat-2') },
            { id: 'sub-cat-8', name: 'Fitness', imageUrl: 'https://picsum.photos/seed/fitness/600/400', skus: skus.filter(s => s.subCategoryId === 'sub-cat-8') },
        ]
    },
    {
        id: 'cat-3', name: 'Business', theme: 'business',
        subCategories: [
             { id: 'sub-cat-3', name: 'Leadership', imageUrl: 'https://picsum.photos/seed/leadership/600/400', skus: skus.filter(s => s.subCategoryId === 'sub-cat-3') },
        ]
    },
    {
        id: 'cat-4', name: 'Technology', theme: 'tech',
        subCategories: [
             { id: 'sub-cat-4', name: 'Development', imageUrl: 'https://picsum.photos/seed/development/600/400', skus: skus.filter(s => s.subCategoryId === 'sub-cat-4') },
        ]
    },
    {
        id: 'cat-5', name: 'Finance', theme: 'finance',
        subCategories: [
            { id: 'sub-cat-5', name: 'Investing', imageUrl: 'https://picsum.photos/seed/investing/600/400', skus: skus.filter(s => s.subCategoryId === 'sub-cat-5') },
        ]
    },
    {
        id: 'cat-6', name: 'Creative Arts', theme: 'creative',
        subCategories: [
            { id: 'sub-cat-6', name: 'Music', imageUrl: 'https://picsum.photos/seed/music/600/400', skus: skus.filter(s => s.subCategoryId === 'sub-cat-6') },
            { id: 'sub-cat-7', name: 'Languages', imageUrl: 'https://picsum.photos/seed/languages/600/400', skus: skus.filter(s => s.subCategoryId === 'sub-cat-7') },
        ]
    }
];


const bookings: Booking[] = [
    {id: 'book-1', userId: 'user-seeker-123', cohortId: 'coh-3', bookingDate: getFutureDate(-5), status: 'confirmed' },
    // This booking is completed and will show up in the passport
    {id: 'book-2', userId: 'user-seeker-123', cohortId: 'coh-1', bookingDate: getFutureDate(-40), status: 'completed' }
];

// MOCK API FUNCTIONS
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const deepCopy = <T>(data: T): T => JSON.parse(JSON.stringify(data));

const hydrateDates = (obj: any, keys: string[]) => {
    if (Array.isArray(obj)) {
        obj.forEach(item => hydrateDates(item, keys));
    } else if (typeof obj === 'object' && obj !== null) {
        for (const key of Object.keys(obj)) {
            if (keys.includes(key) && typeof obj[key] === 'string') {
                obj[key] = new Date(obj[key]);
            } else {
                hydrateDates(obj[key], keys);
            }
        }
    }
    return obj;
}

export const mockApi = {
    getCategories: async (): Promise<Category[]> => {
        await delay(300);
        const data = deepCopy(categories);
        hydrateDates(data, ['startDateTime', 'endDateTime', 'timestamp']);
        return data;
    },
    getAllSkus: async (): Promise<SKU[]> => {
        await delay(50);
        const data = deepCopy(skus);
        hydrateDates(data, ['startDateTime', 'endDateTime']);
        return data;
    },
    getSkuById: async (skuId: string): Promise<SKU | undefined> => {
        await delay(200);
        const sku = skus.find(s => s.id === skuId);
        if (!sku) return undefined;
        const data = deepCopy(sku);
        hydrateDates(data, ['startDateTime', 'endDateTime']);
        return data;
    },
    getCohortById: async (cohortId: string): Promise<Cohort | undefined> => {
        await delay(100);
        const cohort = cohorts.find(c => c.id === cohortId);
        if (!cohort) return undefined;
        const data = deepCopy(cohort);
        hydrateDates(data, ['startDateTime', 'endDateTime']);
        return data;
    },
    getProviderById: async (providerId: string): Promise<Provider | undefined> => {
        await delay(50);
        return providers.find(p => p.id === providerId);
    },
     getAllProviders: async (): Promise<Provider[]> => {
        await delay(50);
        return providers;
    },
    getUserById: async (userId: string): Promise<User | undefined> => {
        await delay(50);
        const user = users.find(u => u.id === userId);
        if(user) return user;
        // Check providers if not in users
        const providerUser = providers.find(p => p.id === userId);
        if (providerUser) {
            return {
                id: providerUser.id,
                name: providerUser.name,
                avatarUrl: providerUser.avatarUrl,
                role: 'provider',
                providerDetails: {
                    role: 'guide', // default
                    isTrusted: providerUser.isTrusted,
                    onTimeStartRate: providerUser.onTimeStartRate
                }
            }
        }
        if (userId === 'ai-agent') {
            return {
                 id: 'ai-agent', name: 'Community AI Agent', avatarUrl: 'https://i.pravatar.cc/150?u=ai-agent', role: 'seeker'
            }
        }
        return undefined;
    },
    getUserBookings: async (userId: string): Promise<Booking[]> => {
        await delay(250);
        const data = deepCopy(bookings.filter(b => b.userId === userId));
        hydrateDates(data, ['bookingDate']);
        return data;
    },
    getCommunityById: async (communityId: string): Promise<Community | undefined> => {
        await delay(200);
        const community = communities.find(c => c.id === communityId);
        if(!community) return undefined;
        const data = deepCopy(community);
        hydrateDates(data, ['timestamp']);
        return data;
    },
    getCommunityMemberProfile: async(userId: string, communityId: string): Promise<CommunityMemberProfile | undefined> => {
        await delay(50);
        return memberProfiles.find(p => p.userId === userId && p.communityId === communityId);
    },
    getUserCommunities: async (userId: string): Promise<Community[]> => {
        await delay(200);
        const data = deepCopy(communities.filter(c => c.members.includes(userId)));
        hydrateDates(data, ['timestamp']);
        return data;
    },
    getAllCommunities: async (): Promise<Community[]> => {
        await delay(200);
        const data = deepCopy(communities);
        hydrateDates(data, ['timestamp']);
        return data;
    },
    getAddOns: async (): Promise<any[]> => {
        await delay(100);
        return [
            { id: 'addon-1', name: 'Equipment Rental', price: 50 },
            { id: 'addon-2', name: '1-on-1 Post-Session', price: 150 },
        ];
    },
    getAiBundleSuggestion: async (skuId: string): Promise<SKU | undefined> => {
        await delay(500);
        // simple mock logic
        if (skuId === 'sku-1') return skus.find(s => s.id === 'sku-2');
        if (skuId === 'sku-2') return skus.find(s => s.id === 'sku-1');
        return skus.find(s => s.id === 'sku-4');
    },
    getAiRecommendations: async (userId: string): Promise<SKU[]> => {
        await delay(600);
        // Just return a couple of SKUs for mock
        return skus.slice(0, 3);
    }
};