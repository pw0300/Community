import type {
  ActivityRecord,
  Category,
  Cohort,
  Community,
  Provider,
  SKU,
  ThemeTile,
  User,
} from './types'

const createDate = (iso: string) => new Date(iso)

const providers: Provider[] = [
  {
    id: 'prov-maya',
    name: 'Maya Chen',
    avatar: 'https://i.pravatar.cc/100?img=32',
    headline: 'Ultra-light trek guide & breathwork coach',
    onTimeStartRate: 0.98,
    trusted: true,
    specialties: ['Altitude pacing', 'Mindful hiking', 'Micro-adventure design'],
    bio: 'Maya has led 120+ micro-expeditions across four continents and brings a calm, grounded presence to every cohort.',
    homeBase: 'Kathmandu, Nepal',
  },
  {
    id: 'prov-arjun',
    name: 'Arjun Patel',
    avatar: 'https://i.pravatar.cc/100?img=12',
    headline: 'Functional medicine chef & gut health mentor',
    onTimeStartRate: 0.92,
    trusted: true,
    specialties: ['Fermentation', 'Habit scaffolding', 'Nutrition systems'],
    bio: 'Arjun pairs evidence-backed protocols with joyful food rituals to help you reset sustainably.',
    homeBase: 'Goa, India',
  },
  {
    id: 'prov-lena',
    name: 'Lena Ortiz',
    avatar: 'https://i.pravatar.cc/100?img=5',
    headline: 'Strategic communication coach',
    onTimeStartRate: 0.96,
    trusted: true,
    specialties: ['Executive storytelling', 'Hybrid facilitation', 'Confidence labs'],
    bio: 'Lena works with exec teams across LATAM + US to build influential communicators.',
    homeBase: 'Austin, USA',
  },
  {
    id: 'prov-noah',
    name: 'Noah Williams',
    avatar: 'https://i.pravatar.cc/100?img=22',
    headline: 'Founder-in-residence, Flow Operators',
    onTimeStartRate: 0.89,
    trusted: false,
    specialties: ['Cashflow systems', 'Angel readiness', 'Fractional CFO workflows'],
    bio: 'Noah helps early-stage founders operationalise finance without the overwhelm.',
    homeBase: 'Singapore',
  },
  {
    id: 'prov-elise',
    name: 'Dr. Elise Kang',
    avatar: 'https://i.pravatar.cc/100?img=44',
    headline: 'Neuroscientist & resilience facilitator',
    onTimeStartRate: 0.94,
    trusted: true,
    specialties: ['Stress physiology', 'Executive resilience', 'Neuroleadership'],
    bio: 'Elise designs data-backed training for enterprise teams navigating hyper-growth.',
    homeBase: 'Seoul, South Korea',
  },
]

const tiles: ThemeTile[] = [
  {
    id: 'tile-weekend-trek',
    skuId: 'sku-weekend-trek',
    name: 'Weekend Trek: Himalayan Sunrise',
    coverImage:
      'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1200&q=80',
    narrative: 'Move from "someday" to summit with a ready-to-go micro-expedition.',
  },
  {
    id: 'tile-gut-reset',
    skuId: 'sku-gut-reset',
    name: 'Gut Reset Sprint',
    coverImage:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
    narrative: '90-day ritual to rebuild energy, focus, and digestion in community.',
  },
  {
    id: 'tile-celebration-lab',
    skuId: 'sku-celebration-lab',
    name: 'Celebration Design Lab',
    coverImage:
      'https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=1200&q=80',
    narrative: 'Spin up a milestone celebration with pro stylists and local makers.',
  },
  {
    id: 'tile-flow-operators',
    skuId: 'sku-flow-operators',
    name: 'Flow Operators Mastery',
    coverImage:
      'https://images.unsplash.com/photo-1483478550801-7817f0553d5b?auto=format&fit=crop&w=1200&q=80',
    narrative: 'Build a founder finance cockpit without spreadsheets running you.',
  },
  {
    id: 'tile-communication-studio',
    skuId: 'sku-communication-studio',
    name: 'Leadership Communication Studio',
    coverImage:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
    narrative: 'Prototype high-stakes narratives with peer coaching and AI loops.',
  },
]

const categories: Category[] = [
  {
    id: 'cat-personal-growth',
    label: 'Personal Growth',
    description: 'Curated escapes, rituals, and resets for your whole-life momentum.',
    themeColor: 'teal',
    tiles: tiles.filter((tile) =>
      ['sku-weekend-trek', 'sku-gut-reset', 'sku-celebration-lab', 'sku-flow-operators'].includes(tile.skuId),
    ),
  },
  {
    id: 'cat-professional-growth',
    label: 'Professional Growth',
    description: 'Programs and cohorts that move careers forward now.',
    themeColor: 'amber',
    tiles: tiles.filter((tile) => ['sku-communication-studio', 'sku-flow-operators'].includes(tile.skuId)),
  },
]

const skus: SKU[] = [
  {
    id: 'sku-weekend-trek',
    categoryId: 'cat-personal-growth',
    theme: 'Weekend Trek',
    tagline: 'Micro-expedition with concierge logistics and pre-training checks.',
    description:
      'Launch into action with a fully-scaffolded Himalayan sunrise trek. Concierge prep, acclimatisation plan, and a private cohort room keep you progressing from day one.',
    heroImage:
      'https://images.unsplash.com/photo-1517821365201-1dc3f75e9a1c?auto=format&fit=crop&w=1200&q=80',
    deliveryMode: 'offline',
    format: 'group',
    sessionType: 'multi',
    intensity: 'intermediate',
    upcomingCohortIds: ['cohort-trek-1', 'cohort-trek-2'],
    relatedCommunityIds: ['community-trekkers'],
    addOns: [
      {
        id: 'addon-gear',
        name: 'Performance Gear Kit',
        description: 'Curated essentials shipped to your door before departure.',
        price: 220,
      },
      {
        id: 'addon-recovery',
        name: 'Recovery Lounge Pass',
        description: 'Access to post-trek spa and guided recovery session.',
        price: 140,
      },
    ],
    communityHighlights: [
      {
        id: 'highlight-trek-1',
        title: 'Sunrise Summit Circle',
        description: '12 alumni celebrating their pre-dawn summit ritual together.',
        image: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    qa: [
      {
        question: 'How fit do I need to be?',
        answer: 'Able to comfortably jog 5km. Maya’s pacing and acclimatisation makes it achievable.',
        answeredBy: 'Maya Chen',
      },
      {
        question: 'What if the weather shifts?',
        answer: 'We confirm forecasts 72 hours prior. Backup sunrise ridge ensures experience even if peaks close.',
        answeredBy: 'Operations Team',
      },
    ],
    bundleTargets: ['sku-gut-reset', 'sku-communication-studio'],
  },
  {
    id: 'sku-gut-reset',
    categoryId: 'cat-personal-growth',
    theme: 'Gut Reset',
    tagline: 'Chef-led protocols, live labs, and AI habit nudges.',
    description:
      'Sprint through a joyful 6-week rebuild of your gut health with community accountability, live cook-alongs, and automated check-ins that keep you on track.',
    heroImage:
      'https://images.unsplash.com/photo-1464306076886-da185f6a9d05?auto=format&fit=crop&w=1200&q=80',
    deliveryMode: 'mixed',
    format: 'group',
    sessionType: 'multi',
    intensity: 'introductory',
    upcomingCohortIds: ['cohort-gut-1', 'cohort-gut-2'],
    relatedCommunityIds: ['community-gut-reset'],
    addOns: [
      {
        id: 'addon-labkit',
        name: 'Microbiome Lab Kit',
        description: 'Home testing with personalised read-out session.',
        price: 180,
      },
      {
        id: 'addon-coaching',
        name: '1:1 Habit Calibration',
        description: '30-minute personalised plan with Arjun.',
        price: 95,
      },
    ],
    communityHighlights: [
      {
        id: 'highlight-gut-1',
        title: 'Sunday Fermentation Crew',
        description: 'Members traded kimchi recipes + progress photos in week 2.',
        image: 'https://images.unsplash.com/photo-1514516430032-7f40ed986ca9?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    qa: [
      {
        question: 'Is it vegetarian friendly?',
        answer: 'Yes. Plant-based playbooks with optional adaptogens ship in the welcome kit.',
        answeredBy: 'Arjun Patel',
      },
    ],
    bundleTargets: ['sku-weekend-trek', 'sku-communication-studio'],
  },
  {
    id: 'sku-celebration-lab',
    categoryId: 'cat-personal-growth',
    theme: 'Celebrations',
    tagline: 'Design a milestone celebration in 48 hours with pro stylists.',
    description:
      'Plug into a curated roster of experience designers and stylists to spin up your next celebration. Includes AI concept board + vendor negotiation scripts.',
    heroImage:
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80',
    deliveryMode: 'online',
    format: '1-to-1',
    sessionType: 'single',
    intensity: 'introductory',
    upcomingCohortIds: ['cohort-celebrate-1'],
    relatedCommunityIds: ['community-celebrators'],
    addOns: [
      {
        id: 'addon-stylist',
        name: 'On-site stylist squad',
        description: 'Trusted partners execute your design in-market.',
        price: 420,
      },
    ],
    communityHighlights: [
      {
        id: 'highlight-celebrate-1',
        title: 'Pop-up rooftop engagement',
        description: 'Community-sourced vendor list activated in under 24 hours.',
        image: 'https://images.unsplash.com/photo-1455734729978-db1ae4f687fc?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    qa: [
      {
        question: 'Can you work in new cities?',
        answer: 'Yes. Our vendor map covers 30+ cities globally with hyper-local partners.',
        answeredBy: 'Celebration Concierge',
      },
    ],
    bundleTargets: ['sku-gut-reset'],
  },
  {
    id: 'sku-flow-operators',
    categoryId: 'cat-personal-growth',
    theme: 'Flow Operators',
    tagline: 'Finance cockpit for founders in four sprints.',
    description:
      'Operationalise your finance function with guided sprints, automated dashboards, and peer templates from venture-backed operators.',
    heroImage:
      'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80',
    deliveryMode: 'online',
    format: 'group',
    sessionType: 'multi',
    intensity: 'advanced',
    upcomingCohortIds: ['cohort-flow-1', 'cohort-flow-2'],
    relatedCommunityIds: ['community-wealth-builders'],
    addOns: [
      {
        id: 'addon-fractional',
        name: 'Fractional CFO Hotline',
        description: '4 async office hours with Noah’s operator desk.',
        price: 260,
      },
    ],
    communityHighlights: [
      {
        id: 'highlight-flow-1',
        title: 'Cash runway dashboard swap',
        description: 'Members shared investor-ready dashboards ahead of board meetings.',
        image: 'https://images.unsplash.com/photo-1517433456452-f9633a875f6f?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    qa: [
      {
        question: 'Will templates fit APAC compliance?',
        answer: 'Yes. We ship region-specific tax packs + intros to vetted accountants.',
        answeredBy: 'Noah Williams',
      },
    ],
    bundleTargets: ['sku-communication-studio'],
  },
  {
    id: 'sku-communication-studio',
    categoryId: 'cat-professional-growth',
    theme: 'Communication Studio',
    tagline: 'C-suite communication intensive with AI rehearsal loops.',
    description:
      'Prototype high-stakes narratives with Lena’s peer coaching circles, AI-assisted rehearsal loops, and global cohort dialogues.',
    heroImage:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
    deliveryMode: 'mixed',
    format: 'group',
    sessionType: 'multi',
    intensity: 'intermediate',
    upcomingCohortIds: ['cohort-comm-1', 'cohort-comm-2'],
    relatedCommunityIds: ['community-communicators'],
    addOns: [
      {
        id: 'addon-ai',
        name: 'AI Rehearsal Coach',
        description: 'Personal AI twin calibrates tone + pacing between sessions.',
        price: 130,
      },
      {
        id: 'addon-studio',
        name: 'Studio Lighting Kit',
        description: 'Ships globally with plug-and-play setup video.',
        price: 90,
      },
    ],
    communityHighlights: [
      {
        id: 'highlight-comm-1',
        title: 'Board meeting rewind',
        description: 'Alumni share clips + receive rapid-fire rewrites before presenting.',
        image: 'https://images.unsplash.com/photo-1525130413817-d45c1d127c42?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    qa: [
      {
        question: 'What time zones do live labs cover?',
        answer: 'We run APAC-friendly and Americas-friendly cohorts in parallel with recordings same-day.',
        answeredBy: 'Program Team',
      },
    ],
    bundleTargets: ['sku-weekend-trek', 'sku-flow-operators'],
  },
]

const cohorts: Cohort[] = [
  {
    id: 'cohort-trek-1',
    skuId: 'sku-weekend-trek',
    providerId: 'prov-maya',
    startDate: createDate('2025-12-05T02:00:00Z'),
    endDate: createDate('2025-12-07T10:00:00Z'),
    location: 'Nagarkot, Nepal',
    timeZone: 'Asia/Kathmandu',
    price: 890,
    capacity: 12,
    seatsLeft: 3,
    deliveryMode: 'offline',
    format: 'group',
    sessionType: 'multi',
    perks: ['Private transfer', 'Acclimatisation kit', 'Sunrise photography'],
    weatherOutlook: 'Crisp mornings, clear skies (8°C)',
  },
  {
    id: 'cohort-trek-2',
    skuId: 'sku-weekend-trek',
    providerId: 'prov-maya',
    startDate: createDate('2026-01-17T02:00:00Z'),
    endDate: createDate('2026-01-19T10:00:00Z'),
    location: 'Ridge Above Pokhara, Nepal',
    timeZone: 'Asia/Kathmandu',
    price: 910,
    capacity: 12,
    seatsLeft: 0,
    deliveryMode: 'offline',
    format: 'group',
    sessionType: 'multi',
    perks: ['Heated basecamp tents', 'Pre-trip conditioning plan'],
    weatherOutlook: 'Cool nights, chance of snow (5°C)',
  },
  {
    id: 'cohort-gut-1',
    skuId: 'sku-gut-reset',
    providerId: 'prov-arjun',
    startDate: createDate('2025-11-22T13:00:00Z'),
    endDate: createDate('2026-01-03T14:00:00Z'),
    location: 'Hybrid · Global Zoom + Retreat pop-ups',
    timeZone: 'Asia/Kolkata',
    price: 540,
    capacity: 40,
    seatsLeft: 8,
    deliveryMode: 'mixed',
    format: 'group',
    sessionType: 'multi',
    perks: ['Live cook-alongs', 'Nutrition AI check-ins', 'Local sourcing guide'],
  },
  {
    id: 'cohort-gut-2',
    skuId: 'sku-gut-reset',
    providerId: 'prov-arjun',
    startDate: createDate('2026-02-10T13:00:00Z'),
    endDate: createDate('2026-03-23T14:00:00Z'),
    location: 'Hybrid · Global Zoom + Retreat pop-ups',
    timeZone: 'Europe/Amsterdam',
    price: 560,
    capacity: 40,
    seatsLeft: 20,
    deliveryMode: 'mixed',
    format: 'group',
    sessionType: 'multi',
    perks: ['Seasonal recipes', 'Peer accountability pods'],
  },
  {
    id: 'cohort-celebrate-1',
    skuId: 'sku-celebration-lab',
    providerId: 'prov-maya',
    startDate: createDate('2025-11-18T17:00:00Z'),
    endDate: createDate('2025-11-18T18:30:00Z'),
    location: 'Remote Design Studio',
    timeZone: 'America/Los_Angeles',
    price: 320,
    capacity: 1,
    seatsLeft: 1,
    deliveryMode: 'online',
    format: '1-to-1',
    sessionType: 'single',
    perks: ['AI concept board', 'Supplier roster'],
  },
  {
    id: 'cohort-flow-1',
    skuId: 'sku-flow-operators',
    providerId: 'prov-noah',
    startDate: createDate('2025-12-02T15:00:00Z'),
    endDate: createDate('2026-01-14T16:30:00Z'),
    location: 'Virtual HQ + Singapore immersion',
    timeZone: 'Asia/Singapore',
    price: 740,
    capacity: 25,
    seatsLeft: 5,
    deliveryMode: 'online',
    format: 'group',
    sessionType: 'multi',
    perks: ['Notion finance OS', 'Investor Q&A'],
  },
  {
    id: 'cohort-flow-2',
    skuId: 'sku-flow-operators',
    providerId: 'prov-noah',
    startDate: createDate('2026-02-15T15:00:00Z'),
    endDate: createDate('2026-03-28T16:30:00Z'),
    location: 'Virtual HQ + Singapore immersion',
    timeZone: 'America/New_York',
    price: 720,
    capacity: 25,
    seatsLeft: 17,
    deliveryMode: 'online',
    format: 'group',
    sessionType: 'multi',
    perks: ['Board reporting templates', 'Capital stack simulator'],
  },
  {
    id: 'cohort-comm-1',
    skuId: 'sku-communication-studio',
    providerId: 'prov-lena',
    startDate: createDate('2025-11-25T17:00:00Z'),
    endDate: createDate('2026-01-06T18:30:00Z'),
    location: 'Hybrid: Austin studio + virtual labs',
    timeZone: 'America/Chicago',
    price: 680,
    capacity: 18,
    seatsLeft: 2,
    deliveryMode: 'mixed',
    format: 'group',
    sessionType: 'multi',
    perks: ['Executive feedback panel', 'AI rehearsal loops'],
  },
  {
    id: 'cohort-comm-2',
    skuId: 'sku-communication-studio',
    providerId: 'prov-lena',
    startDate: createDate('2026-02-04T09:00:00Z'),
    endDate: createDate('2026-03-17T10:30:00Z'),
    location: 'Hybrid: Austin studio + virtual labs',
    timeZone: 'Europe/London',
    price: 720,
    capacity: 18,
    seatsLeft: 12,
    deliveryMode: 'mixed',
    format: 'group',
    sessionType: 'multi',
    perks: ['Executive feedback panel', 'Voice training toolkit'],
  },
]

const communities: Community[] = [
  {
    id: 'community-trekkers',
    name: 'Weekend Trekkers',
    description: 'Micro-adventurers trading altitude tips, gear hacks, and sunrise wins.',
    coverImage:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    members: 862,
    activeNow: 38,
    relatedSkuIds: ['sku-weekend-trek'],
    memberIds: ['user-ava', 'user-luis'],
    feed: [
      {
        id: 'post-trek-1',
        author: 'Priya S.',
        authorType: 'member',
        avatar: 'https://i.pravatar.cc/100?img=48',
        createdAt: createDate('2025-11-12T03:45:00Z'),
        content: 'Back from the Nagarkot cohort! Sharing our sunrise playlist + packing tweaks that saved our knees.',
        media: ['https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80'],
      },
    ],
    aiAgentConfig: {
      cadenceMinutes: 0.5,
      tone: 'energizing',
      defaultPrompts: [
        'Who is locking in their sunrise stretch this week? Drop a photo from your training walk.',
        'Weather check: where in the world are you trekking from? Let’s map the climates.',
      ],
    },
  },
  {
    id: 'community-gut-reset',
    name: 'Gut Reset Circle',
    description: 'Joyful food rituals, fermentation wins, and body-metric check-ins.',
    coverImage:
      'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80',
    members: 1120,
    activeNow: 52,
    relatedSkuIds: ['sku-gut-reset'],
    memberIds: ['user-ava', 'user-jo'],
    feed: [
      {
        id: 'post-gut-1',
        author: 'AI Prep Bot',
        authorType: 'ai-agent',
        avatar: 'https://cdn-icons-png.flaticon.com/512/4712/4712035.png',
        createdAt: createDate('2025-11-12T05:45:00Z'),
        content: 'Poll: What’s your biggest win from week 2? Energy, digestion, sleep, or mood?',
        poll: {
          prompt: 'Week 2 wins check-in',
          options: [
            { id: 'energy', label: 'Energy is up', votes: 48 },
            { id: 'digestion', label: 'Digestion reset', votes: 36 },
            { id: 'sleep', label: 'Sleeping deeper', votes: 27 },
            { id: 'mood', label: 'Mood stability', votes: 21 },
          ],
        },
      },
    ],
    aiAgentConfig: {
      cadenceMinutes: 0.75,
      tone: 'warm',
      defaultPrompts: [
        'Drop a photo of tonight’s gut-friendly dinner—we’ll compile a community zine.',
        'Who wants a shout-out in tomorrow’s habit ladder spotlight? Reply with your win.',
      ],
    },
  },
  {
    id: 'community-wealth-builders',
    name: 'Wealth Builders Guild',
    description: 'Operators building modern wealth systems together.',
    coverImage:
      'https://images.unsplash.com/photo-1454165205744-3b78555e5572?auto=format&fit=crop&w=1200&q=80',
    members: 640,
    activeNow: 19,
    relatedSkuIds: ['sku-flow-operators'],
    memberIds: ['user-ava'],
    feed: [
      {
        id: 'post-wealth-1',
        author: 'Noah Williams',
        authorType: 'provider',
        avatar: 'https://i.pravatar.cc/100?img=22',
        createdAt: createDate('2025-11-11T16:10:00Z'),
        content: 'Uploading the investor memo template that helped a member close $1.2M last week—grab it in resources.',
      },
    ],
    aiAgentConfig: {
      cadenceMinutes: 1.2,
      tone: 'energizing',
      defaultPrompts: [
        'Flash audit: drop your cash runway number and we’ll celebrate movement next Friday.',
        'Voting time—who wants a teardown of their ops dashboard on Thursday? Reply with a 📊.',
      ],
    },
  },
  {
    id: 'community-communicators',
    name: 'Communication Studio Alumni',
    description: 'Leaders refining narrative craft with peers + AI loops.',
    coverImage:
      'https://images.unsplash.com/photo-1488998527040-85054a85150e?auto=format&fit=crop&w=1200&q=80',
    members: 410,
    activeNow: 14,
    relatedSkuIds: ['sku-communication-studio'],
    memberIds: ['user-ava'],
    feed: [
      {
        id: 'post-comm-1',
        author: 'Elena T.',
        authorType: 'member',
        avatar: 'https://i.pravatar.cc/100?img=41',
        createdAt: createDate('2025-11-11T09:20:00Z'),
        content: 'Shared a before/after of our Series B narrative—AI loop flagged filler words I hadn’t noticed.',
      },
    ],
    aiAgentConfig: {
      cadenceMinutes: 1,
      tone: 'celebratory',
      defaultPrompts: [
        'Show us your before/after slide glow-ups! We’ll highlight a hero deck Friday.',
        'Quick-fire poll: Which stakeholder conversation needs the most support this week?',
      ],
    },
  },
  {
    id: 'community-celebrators',
    name: 'Celebration Architects',
    description: 'Design-lovers shipping unforgettable gatherings.',
    coverImage:
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    members: 290,
    activeNow: 11,
    relatedSkuIds: ['sku-celebration-lab'],
    memberIds: ['user-ava'],
    feed: [
      {
        id: 'post-celebrate-1',
        author: 'Marcelo R.',
        authorType: 'member',
        avatar: 'https://i.pravatar.cc/100?img=14',
        createdAt: createDate('2025-11-10T21:10:00Z'),
        content: 'Our pop-up dinner series launched! Sharing the vendor checklist that saved the day.',
      },
    ],
    aiAgentConfig: {
      cadenceMinutes: 1.5,
      tone: 'celebratory',
      defaultPrompts: [
        'Spotlight time: who deserves the confetti canon this week? Tag them below!',
        'Drop your moodboard-in-progress—we’ll remix it live on Thursday.',
      ],
    },
  },
]

const user: User = {
  id: 'user-ava',
  name: 'Ava Laurent',
  avatar: 'https://i.pravatar.cc/100?img=55',
  timeZone: 'Europe/Paris',
  isReturning: true,
  interests: ['trekking', 'longevity', 'leadership'],
  joinedCommunityIds: ['community-trekkers', 'community-gut-reset', 'community-wealth-builders'],
  upcomingActivities: [
    {
      cohortId: 'cohort-trek-1',
      skuId: 'sku-weekend-trek',
      title: 'Weekend Trek: Himalayan Sunrise',
      startDate: createDate('2025-12-05T02:00:00Z'),
      endDate: createDate('2025-12-07T10:00:00Z'),
      status: 'upcoming',
      deliveryMode: 'offline',
      format: 'group',
    },
    {
      cohortId: 'cohort-comm-1',
      skuId: 'sku-communication-studio',
      title: 'Leadership Communication Studio',
      startDate: createDate('2025-11-25T17:00:00Z'),
      endDate: createDate('2026-01-06T18:30:00Z'),
      status: 'upcoming',
      deliveryMode: 'mixed',
      format: 'group',
    },
  ],
  waitlistedActivities: [
    {
      cohortId: 'cohort-trek-2',
      skuId: 'sku-weekend-trek',
      title: 'Weekend Trek: Himalayan Sunrise',
      startDate: createDate('2026-01-17T02:00:00Z'),
      endDate: createDate('2026-01-19T10:00:00Z'),
      status: 'waitlisted',
      deliveryMode: 'offline',
      format: 'group',
    },
  ],
  pastActivities: [
    {
      cohortId: 'cohort-gut-1',
      skuId: 'sku-gut-reset',
      title: 'Gut Reset Sprint',
      startDate: createDate('2025-05-10T13:00:00Z'),
      endDate: createDate('2025-06-20T14:00:00Z'),
      status: 'completed',
      deliveryMode: 'mixed',
      format: 'group',
      certificateUrl: '#',
      gallery: [
        'https://images.unsplash.com/photo-1456406644174-8ddd4cd52a06?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1453838956707-38a7aa3cd62d?auto=format&fit=crop&w=800&q=80',
      ],
    },
  ],
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const mockApi = {
  async getProviders() {
    await delay(180)
    return providers
  },
  async getCategories() {
    await delay(120)
    return categories
  },
  async getSkus() {
    await delay(120)
    return skus
  },
  async getCohorts() {
    await delay(120)
    return cohorts
  },
  async getCommunities() {
    await delay(140)
    return communities
  },
  async getUserProfile() {
    await delay(160)
    return structuredClone(user) as User
  },
  async holdSeat(cohortId: string) {
    await delay(200)
    const cohort = cohorts.find((c) => c.id === cohortId)
    if (!cohort) throw new Error('Cohort not found')
    if (cohort.seatsLeft <= 0) throw new Error('No seats available')
    cohort.seatsLeft -= 1
    return cohort
  },
  async joinWaitlist(cohortId: string) {
    await delay(120)
    return cohorts.find((c) => c.id === cohortId) ?? null
  },
  async postCommunityMessage(communityId: string, content: string) {
    await delay(90)
    const community = communities.find((c) => c.id === communityId)
    if (!community) throw new Error('Community not found')
    const post = {
      id: `post-${Date.now()}`,
      author: user.name,
      authorType: 'member' as const,
      avatar: user.avatar,
      createdAt: new Date(),
      content,
    }
    community.feed.unshift(post)
    return post
  },
  async refreshActivityRecord(): Promise<ActivityRecord[]> {
    await delay(120)
    return structuredClone(user.upcomingActivities)
  },
}

export const dataIndex = {
  providers,
  categories,
  skus,
  cohorts,
  communities,
  user,
}
