// This is a placeholder for Gemini API interactions.
// In a real application, you would import and use @google/genai.
// For this example, we will simulate the API calls to avoid requiring an API key.
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import type { CommunityPost } from '../types';

// REAL IMPLEMENTATION
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const availableSkuIds = "sku-1, sku-2, sku-3, sku-4, sku-5";

export const getAiBundleSuggestion = async (currentSkuName: string): Promise<{ skuName: string; discount: number; reason: string } | null> => {
    console.log(`Getting bundle suggestion for: ${currentSkuName}`);
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `A user is checking out with the service "${currentSkuName}". Suggest a complementary service to bundle with it. The user is focused on personal and professional growth.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        skuName: { type: Type.STRING, description: "Name of the suggested complementary SKU." },
                        discount: { type: Type.NUMBER, description: "Percentage discount (e.g., 15 for 15%) offered for the bundle." },
                        reason: { type: Type.STRING, description: "A catchy, short reason why these two SKUs go well together." }
                    },
                    required: ["skuName", "discount", "reason"]
                }
            }
        });
        const result = JSON.parse(response.text);
        return result;
    } catch (error) {
        console.error("Error getting bundle suggestion:", error);
        return null;
    }
};

export const getConciergeResponse = async (prompt: string): Promise<{ text: string; functionCall?: { name: string; args: any } }> => {
    console.log(`Getting concierge response for: "${prompt}"`);
    
    const holdSeatFunction: FunctionDeclaration = {
        name: 'holdSeat',
        description: "Holds a seat for a user in an upcoming cohort for a specific SKU.",
        parameters: {
            type: Type.OBJECT,
            properties: {
                skuName: { type: Type.STRING, description: 'The name of the SKU to hold a seat for, e.g., "Weekend Trek".' }
            },
            required: ['skuName']
        }
    };
    const joinWaitlistFunction: FunctionDeclaration = {
        name: 'joinWaitlist',
        description: "Adds a user to the waitlist for a specific SKU if all cohorts are full.",
        parameters: {
            type: Type.OBJECT,
            properties: {
                skuName: { type: Type.STRING, description: 'The name of the SKU to join the waitlist for, e.g., "F/O Mastery".' }
            },
            required: ['skuName']
        }
    };

    try {
         const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                tools: [{functionDeclarations: [holdSeatFunction, joinWaitlistFunction]}],
            },
        });

        const fc = response.functionCalls?.[0];
        
        return {
            text: response.text,
            functionCall: fc ? { name: fc.name, args: fc.args } : undefined
        };

    } catch(error) {
        console.error("Error getting concierge response:", error);
        return {
            text: "I'm sorry, I encountered an error. Please try again."
        }
    }
};

export const generateCommunityPost = async (communityName: string): Promise<Omit<CommunityPost, 'id' | 'authorId' | 'timestamp'>> => {
    console.log(`Generating AI post for community: ${communityName}`);
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are a friendly and engaging AI community manager for the "${communityName}" community on GrowthQuest. Your goal is to spark engagement. Create a new, natural-feeling post. It can be a question to get members talking (prompt), a fun poll, or a post that shines a spotlight on members. Keep it concise and friendly. The post type must be one of 'prompt', 'poll', or 'spotlight'.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        postType: { 
                            type: Type.STRING, 
                            description: "The type of post. Must be one of: 'prompt', 'poll', or 'spotlight'."
                        },
                        content: { type: Type.STRING },
                        pollOptions: { 
                            type: Type.ARRAY, 
                            items: { type: Type.STRING },
                        }
                    },
                     required: ["postType", "content"]
                }
            }
        });
        const result = JSON.parse(response.text);
        // FIX: Add missing `likes` and `comments` properties to conform to the return type.
        return { ...result, isAiAgentPost: true, likes: 0, comments: [] };
    } catch (error) {
        console.error("Error generating community post:", error);
        // Fallback post
        // FIX: Add missing `likes` and `comments` properties to conform to the return type.
        return {
            isAiAgentPost: true,
            postType: 'prompt',
            content: `Happy Monday, everyone! What's one small step you're taking toward your growth goals this week?`,
            likes: 0,
            comments: [],
        };
    }
};

export const getWhatsNextSuggestion = async (completedSkuName: string): Promise<{ skuName: string; reason: string; skuId: string } | null> => {
    console.log(`Getting 'What's Next' suggestion for completed SKU: ${completedSkuName}`);
     try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `A user just completed the activity "${completedSkuName}". Suggest a relevant next activity from the available list to continue their growth journey. Provide a short, encouraging reason. Available SKU IDs are: ${availableSkuIds}.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        skuName: { type: Type.STRING, description: "The name of the suggested next SKU." },
                        reason: { type: Type.STRING, description: "A short, encouraging reason for the suggestion." },
                        skuId: { type: Type.STRING, description: `The unique ID of the suggested SKU. Must be one of: ${availableSkuIds}` }
                    },
                    required: ["skuName", "reason", "skuId"]
                }
            }
        });
        const result = JSON.parse(response.text);
        return result;
    } catch (error) {
        console.error("Error getting 'What's Next' suggestion:", error);
        return null;
    }
};

export const generateCommunitySnippet = async (communityName: string, posts: CommunityPost[]): Promise<string | null> => {
    if (posts.length === 0) {
        return "A new community is forming. Join the conversation!";
    }
    const postContent = posts.map(p => ({ 
        author: p.isAiAgentPost ? 'AI Agent' : 'Member', 
        content: p.content.slice(0, 100) // Truncate content for prompt efficiency
    }));

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are generating a real-time activity snippet for a community landing page. 
            The community is called "${communityName}". 
            Here is the latest activity: ${JSON.stringify(postContent)}.
            Based on this, generate a single, catchy, and very short sentence (max 12 words) that summarizes the current vibe or a specific hot topic.
            Example snippets: "Members are sharing stunning photos from Patagonia!", "A new AI poll about morning routines is buzzing.", "Live AMA with a Google engineer is happening now!"`,
            config: {
                maxOutputTokens: 60,
                temperature: 0.7,
                stopSequences: ['.', '!', '?'],
            },
        });
        
        const text = response.text;
        
        // FIX: The AI can return an empty response, making `text` undefined.
        // By providing a fallback to an empty string, we can safely call .trim()
        // and prevent a crash.
        const snippet = (text || '').trim().replace(/"/g, '');
        
        return snippet || `Discover what's happening in ${communityName}!`;

    } catch (error) {
        console.error(`Error generating snippet for ${communityName}:`, error);
        return null; 
    }
};