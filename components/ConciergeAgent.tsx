import React, { useState } from 'react';
import { getConciergeResponse } from '../services/geminiService';
import { mockApi } from '../services/mockApi';

interface ConciergeAgentProps {
    navigateTo: (view: string, data?: any) => void;
}

interface Message {
    sender: 'user' | 'ai';
    text: string;
}

const ConciergeAgent: React.FC<ConciergeAgentProps> = ({ navigateTo }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'ai', text: "Hello! I'm your GrowthQuest Concierge. How can I help you act on your growth today?" }
    ]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSendMessage = async () => {
        if (!userInput.trim()) return;
        
        const newMessages: Message[] = [...messages, { sender: 'user', text: userInput }];
        setMessages(newMessages);
        const currentInput = userInput;
        setUserInput('');
        setIsLoading(true);

        const response = await getConciergeResponse(currentInput);
        
        // Add AI text response first
        let finalMessages: Message[] = [...newMessages, { sender: 'ai', text: response.text }];
        setMessages(finalMessages);
        
        if (response.functionCall) {
            const { name: functionName, args } = response.functionCall;

            if ((functionName === 'holdSeat' || functionName === 'joinWaitlist') && args.skuName) {
                const allSkus = await mockApi.getAllSkus();
                const targetSku = allSkus.find(s => s.name.toLowerCase() === args.skuName.toLowerCase());

                if (targetSku) {
                    const detailedSku = await mockApi.getSkuById(targetSku.id);
                    if (detailedSku) {
                        navigateTo('skuDetail', { sku: detailedSku });
                    } else {
                        finalMessages = [...finalMessages, { sender: 'ai', text: `I'm sorry, I couldn't find the details for "${args.skuName}".` }];
                        setMessages(finalMessages);
                    }
                } else {
                    finalMessages = [...finalMessages, { sender: 'ai', text: `I'm sorry, I couldn't find an activity called "${args.skuName}".` }];
                    setMessages(finalMessages);
                }
            }
        }
        setIsLoading(false);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-teal-500 text-white rounded-full p-4 shadow-lg hover:bg-teal-600 transition-transform transform hover:scale-110 z-50"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 2a6 6 0 00-6 6v3.586l-1.707 1.707A1 1 0 003 15h14a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 w-full max-w-sm bg-white rounded-lg shadow-2xl z-50 flex flex-col h-[60vh]">
            <div className="flex items-center justify-between p-4 bg-teal-500 text-white rounded-t-lg">
                <h3 className="font-bold text-lg">GrowthQuest Concierge</h3>
                <button onClick={() => setIsOpen(false)} className="text-white hover:text-teal-100">&times;</button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-3`}>
                        <div className={`rounded-lg px-4 py-2 max-w-xs ${msg.sender === 'user' ? 'bg-teal-100 text-teal-900' : 'bg-gray-200 text-gray-800'}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                     <div className="flex justify-start mb-3">
                         <div className="rounded-lg px-4 py-2 max-w-xs bg-gray-200 text-gray-800">
                           <span className="animate-pulse">...</span>
                         </div>
                     </div>
                )}
            </div>
            <div className="p-4 border-t">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="e.g., Hold a seat for a trek..."
                        className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        disabled={isLoading}
                    />
                    <button onClick={handleSendMessage} disabled={isLoading} className="bg-teal-500 text-white rounded-full px-4 py-2 hover:bg-teal-600 disabled:bg-teal-300">Send</button>
                </div>
            </div>
        </div>
    );
};

export default ConciergeAgent;