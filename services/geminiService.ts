import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import type { CommunityPost } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const availableSkuIds = "sku-1, sku-2, sku-3, sku-4, sku-5";

// ONBOARDING
export const generateOnboardingQuestion = async (previousAnswers: { question: string, answer: string }[]): Promise<{ question: string; options: string[]; isFinal: boolean; recommendedCommunityIds?: string[] }> => {
    console.log("Generating onboarding question with answers:", previousAnswers);
    const context = previousAnswers.map(pa => `Q: ${pa.question}\nA: ${pa.answer}`).join('\n');
    
    // Simulate API call for procedural generation
    await new Promise(res => setTimeout(res, 500)); 
    
    if (previousAnswers.length === 0) {
        return {
            question: "What's your primary focus right now?",
            options: ["Personal Growth & Hobbies", "Career & Skill Development"],
            isFinal: false,
        };
    }

    if (previousAnswers.length === 1) {
        const firstAnswer = previousAnswers[0].answer;
        if (firstAnswer === "Personal Growth & Hobbies") {
            return {
                question: "How do you prefer to unwind and grow?",
                options: ["Through outdoor adventures and physical challenges", "Through mindfulness, wellness, and creativity"],
                isFinal: false
            };
        } else { // Career & Skill Development
            return {
                question: "What's your main career objective?",
                options: ["Building wealth and financial mastery", "Advancing in leadership and business", "Mastering a technical skill"],
                isFinal: false
            };
        }
    }
    
    // Final step - recommend communities
    const lastAnswer = previousAnswers[previousAnswers.length - 1].answer;
    let communityIds: string[] = [];
    switch(lastAnswer) {
        case "Through outdoor adventures and physical challenges": communityIds = ['comm-1']; break;
        case "Through mindfulness, wellness, and creativity": communityIds = ['comm-2']; break;
        case "Building wealth and financial mastery": communityIds = ['comm-6']; break;
        case "Advancing in leadership and business": communityIds = ['comm-3']; break;
        case "Mastering a technical skill": communityIds = ['comm-4']; break;
        default: communityIds = ['comm-1', 'comm-3']; // fallback
    }

    return {
        question: "Based on your answers, here are a few communities we think you'll love!",
        options: [],
        isFinal: true,
        recommendedCommunityIds: communityIds,
    };
};

export const generateCommunityOnboarding = async (communityName: string): Promise<{ questions: string[] }> => {
    console.log(`Generating onboarding for community: ${communityName}`);
    // Simulated for brevity
     await new Promise(res => setTimeout(res, 300));
    const questionBank: Record<string, string[]> = {
        'Peak Performers': ["What's your most memorable outdoor adventure?", "What's the next big challenge on your bucket list?"],
        'Future Leaders': ["What's a leadership quality you admire most?", "What's one professional skill you're focused on developing this year?"],
        'Mindful Living': ["What's one mindfulness practice you can't live without?", "What does 'living well' mean to you?"],
        'Dev Den': ["What's your favorite programming language and why?", "What's a project you're proud of?"],
        'Wealth Architects': ["What's the best piece of financial advice you've ever received?", "What's your long-term financial goal?"],
        'default': ["What brings you to this community?", "What do you hope to achieve with us?"],
    };

    return {
        questions: questionBank[communityName] || questionBank['default'],
    };
};

export const generateMemberBadge = async (communityName: string, answers: { question: string, answer: string }[]): Promise<{ badge: string, about: string }> => {
    console.log(`Generating badge for ${communityName} with answers:`, answers);
    // Simulated for brevity
    await new Promise(res => setTimeout(res, 500));
    
    // Create a simple "About Me" from the second answer
    const about = answers[1]?.answer || "Excited to be here!";
    
    // Create a badge based on keywords in the first answer
    const firstAnswer = answers[0]?.answer.toLowerCase() || "";
    let badge = "New Member";
    if (firstAnswer.includes("climb") || firstAnswer.includes("mountain") || firstAnswer.includes("trek")) {
        badge = "Aspiring Alpinist";
    } else if (firstAnswer.includes("lead") || firstAnswer.includes("team") || firstAnswer.includes("manage")) {
        badge = "Strategic Visionary";
    } else if (firstAnswer.includes("meditate") || firstAnswer.includes("calm") || firstAnswer.includes("peace")) {
        badge = "Mindfulness Maven";
    } else if (firstAnswer.includes("code") || firstAnswer.includes("react") || firstAnswer.includes("python")) {
        badge = "Code Craftsman";
    } else if (firstAnswer.includes("invest") || firstAnswer.includes("market") || firstAnswer.includes("finance")) {
        badge = "Financial Futurist";
    }
    
    return { badge, about };
};


// EXISTING FUNCTIONS
export const getAiBundleSuggestion = async (currentSkuName: string): Promise<{ skuName: string; discount: number; reason: string } | null> => {
    // This is a simplified mock. The real implementation would use the Gemini API.
    await new Promise(res => setTimeout(res, 500));
    if (currentSkuName.toLowerCase().includes('patagonia')) {
        return { skuName: 'Mindful Morning Reset', discount: 15, reason: "Balance your outer adventures with inner peace." };
    }
    return { skuName: 'Executive Leadership Accelerator', discount: 20, reason: "Master your mind and your career path." };
};

export const getConciergeResponse = async (prompt: string): Promise<{ text: string; functionCall?: { name: string; args: any } }> => {
    console.log(`Getting concierge response for: "${prompt}"`);
    
    const holdSeatFunction: FunctionDeclaration = {
        name: 'holdSeat',
        description: "Holds a seat for a user in an upcoming cohort for a specific SKU.",
        parameters: { type: Type.OBJECT, properties: { skuName: { type: Type.STRING } }, required: ['skuName'] }
    };

    // For demonstration, we'll simulate a function call if the prompt includes 'hold seat'
    if (prompt.toLowerCase().includes('hold seat for patagonia')) {
        return {
            text: "Great! I'm redirecting you to the Patagonia Expedition page to select your dates.",
            functionCall: { name: 'holdSeat', args: { skuName: 'Patagonia Expedition' } }
        };
    }

    return { text: "I can help with that. Let me show you what's available." };
};

export const generateCommunityPost = async (communityName: string): Promise<Omit<CommunityPost, 'id' | 'authorId' | 'timestamp'>> => {
    // This is a simplified mock. The real implementation would use the Gemini API.
    await new Promise(res => setTimeout(res, 800));
    const content = `Happy Monday, ${communityName}! What's one small step you're taking toward your growth goals this week?`;
    return { isAiAgentPost: true, postType: 'prompt', content, likes: 0, comments: [] };
};

export const getWhatsNextSuggestion = async (completedSkuName: string): Promise<{ skuName: string; reason: string; skuId: string } | null> => {
    await new Promise(res => setTimeout(res, 500));
    if (completedSkuName.toLowerCase().includes('patagonia')) {
        return { skuName: 'Body Transformation Challenge', reason: 'Build the strength for your next big adventure!', skuId: 'sku-8' };
    }
    return { skuName: 'Spanish Fluency Sprint', reason: 'You conquered the mountains, now conquer a language!', skuId: 'sku-7' };
};

export const generateCommunitySnippet = async (communityName: string, posts: CommunityPost[]): Promise<string | null> => {
    if (posts.length === 0) return "A new community is forming. Join the conversation!";
    
    const latestPost = posts.sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
    if(latestPost.postType === 'proof-of-growth') {
        return "A member just shared their latest achievement!";
    }
    if(latestPost.postType === 'question') {
        return `A member is asking about "${latestPost.content.substring(0, 30)}..."`;
    }
    return `"${latestPost.content.substring(0, 50)}..."`;
};
