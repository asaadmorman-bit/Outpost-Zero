import React, { useState, useRef, useEffect } from 'react';
import { BrainCircuit, X, CornerDownLeft, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { InvokeLLM } from '@/integrations/Core';

const AIAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'ai',
            content: "Hello! I'm the Outpost Zero AI Assistant. How can I help you navigate your security landscape today?"
        }
    ]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollAreaRef = useRef(null);

    useEffect(() => {
        if (isOpen && scrollAreaRef.current) {
            const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (viewport) {
                setTimeout(() => viewport.scrollTop = viewport.scrollHeight, 0);
            }
        }
    }, [messages, isOpen]);

    const handleSendMessage = async (messageContent) => {
        if (!messageContent.trim()) return;

        const userMessage = { role: 'user', content: messageContent };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        setUserInput('');

        try {
            const prompt = `You are the Outpost Zero AI Assistant, an intelligent helper for the Outpost Zero cybersecurity platform. Your purpose is to help security professionals navigate the platform, understand complex data, and take action. The platform includes dashboards, incident management, threat intelligence, SOAR, compliance tools, and more. Be concise, helpful, and an expert. User question: "${messageContent}"`;
            
            const aiResponseContent = await InvokeLLM({ prompt });
            
            const aiMessage = { role: 'ai', content: aiResponseContent };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error("AI Assistant Error:", error);
            const errorMessage = { role: 'ai', content: "Sorry, I encountered an error. Please try again." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        handleSendMessage(userInput);
    };

    const suggestionPrompts = [
        "What's our current threat level?",
        "Summarize recent critical events.",
        "Are there any new high-priority incidents?",
        "Explain Quantum-Safe Security."
    ];

    return (
        <>
            {isOpen && (
                <div
                    className="fixed bottom-24 right-4 md:right-8 z-50 w-full max-w-md h-[60vh] bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-xl shadow-2xl flex flex-col transition-all duration-300"
                >
                    <header className="flex items-center justify-between p-4 border-b border-gray-700">
                        <div className="flex items-center gap-3">
                            <Sparkles className="w-6 h-6 text-blue-400" />
                            <h3 className="font-bold text-white">Outpost Zero AI</h3>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                            <X className="w-5 h-5" />
                        </Button>
                    </header>
                    <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                        <div className="space-y-6">
                            {messages.map((message, index) => (
                                <div key={index} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                                    {message.role === 'ai' && <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0"><BrainCircuit className="w-5 h-5 text-blue-400"/></div>}
                                    <div className={`p-3 rounded-lg max-w-xs md:max-w-sm text-sm ${message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-200'}`}>
                                       <p>{message.content}</p>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0"><BrainCircuit className="w-5 h-5 text-blue-400"/></div>
                                    <div className="p-3 rounded-lg bg-gray-800 flex items-center">
                                        <Loader2 className="w-5 h-5 animate-spin text-gray-400"/>
                                    </div>
                                </div>
                            )}
                        </div>
                        {messages.length <= 1 && (
                            <div className="mt-8">
                                <p className="text-sm text-gray-400 mb-3 text-center">Or try one of these suggestions:</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {suggestionPrompts.map(prompt => (
                                        <Button key={prompt} variant="outline" size="sm" className="text-xs h-auto py-2 border-gray-700 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300" onClick={() => handleSendMessage(prompt)}>
                                            {prompt}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </ScrollArea>
                    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700 flex items-center gap-3">
                        <Input
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="Ask Outpost Zero AI anything..."
                            className="flex-1 bg-gray-800 border-gray-600 text-white"
                            disabled={isLoading}
                        />
                        <Button type="submit" size="icon" disabled={isLoading || !userInput.trim()}>
                            <CornerDownLeft className="w-5 h-5" />
                        </Button>
                    </form>
                </div>
            )}

            <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50">
                <Button 
                    size="icon" 
                    onClick={() => setIsOpen(!isOpen)} 
                    className="rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700 shadow-2xl"
                >
                    {isOpen ? 
                        <X className="w-7 h-7"/> :
                        <BrainCircuit className="w-7 h-7"/>
                    }
                </Button>
            </div>
        </>
    );
};

export default AIAssistant;