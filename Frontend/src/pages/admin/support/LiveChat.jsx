import React, { useState, useEffect } from 'react';
import { MessageCircle, Search, Send, User, ChevronRight, MoreVertical } from 'lucide-react';
import api from '../../../utils/api';

const LiveChat = () => {
    // Simple premium chat UI fetching support tickets as "chats" for now 
    // since we don't have a dedicated Chat message model yet.
    // In a real app, this would use WebSockets and a Message model.

    const [activeChats, setActiveChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedChat, setSelectedChat] = useState(null);

    useEffect(() => {
        const fetchChats = async () => {
            setLoading(true);
            try {
                // Fetch unresolved tickets as active chats
                const response = await api.get('/api/v1/support/tickets/?status=open');
                setActiveChats(response.data.results);
                if (response.data.results.length > 0) {
                    setSelectedChat(response.data.results[0]);
                }
            } catch (error) {
                console.error("Failed to fetch chats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchChats();
    }, []);

    return (
        <div className="flex h-[calc(100vh-140px)] bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Sidebar */}
            <div className="w-80 border-r border-gray-100 flex flex-col bg-gray-50/30">
                <div className="p-5 border-b border-gray-100 bg-white">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <MessageCircle size={20} className="text-brand" />
                        Live Support
                    </h2>
                    <div className="relative mt-4">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search chats..."
                            className="w-full pl-9 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-1 focus:ring-brand/20 transition-all"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {loading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="h-16 bg-white rounded-xl animate-pulse"></div>
                        ))
                    ) : activeChats.length > 0 ? (
                        activeChats.map((chat) => (
                            <button
                                key={chat.id}
                                onClick={() => setSelectedChat(chat)}
                                className={`w-full p-4 rounded-xl flex items-center gap-3 transition-all ${selectedChat?.id === chat.id ? 'bg-white shadow-sm ring-1 ring-gray-100' : 'hover:bg-white/50'}`}
                            >
                                <div className="w-10 h-10 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold relative">
                                    {chat.user_details?.username?.charAt(0).toUpperCase()}
                                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                                </div>
                                <div className="flex-1 text-left">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <span className="font-bold text-gray-900 truncate text-sm">{chat.user_details?.username}</span>
                                        <span className="text-[10px] text-gray-400">12:45 PM</span>
                                    </div>
                                    <p className="text-xs text-gray-500 truncate">{chat.subject}</p>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="py-20 text-center text-gray-400 text-xs italic">No active chat sessions.</div>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            {selectedChat ? (
                <div className="flex-1 flex flex-col bg-white">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold">
                                {selectedChat.user_details?.username?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 leading-none mb-1">{selectedChat.user_details?.username}</h3>
                                <p className="text-xs text-emerald-500 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Online
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 transition-colors"><ChevronRight size={20} /></button>
                            <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 transition-colors"><MoreVertical size={20} /></button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/20">
                        <div className="flex items-start gap-3 max-w-[80%]">
                            <div className="w-8 h-8 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold text-xs shrink-0">{selectedChat.user_details?.username?.charAt(0).toUpperCase()}</div>
                            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 text-sm text-gray-700">
                                <p className="font-bold mb-1 text-xs text-brand">{selectedChat.subject}</p>
                                {selectedChat.description}
                                <span className="block text-[10px] text-gray-400 mt-2 text-right">12:45 PM</span>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 max-w-[80%] ml-auto flex-row-reverse">
                            <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-xs shrink-0">AD</div>
                            <div className="bg-brand p-3 rounded-2xl rounded-tr-none shadow-sm text-sm text-white">
                                Hello! How can I assist you with your {selectedChat.subject.toLowerCase()} issue today?
                                <span className="block text-[10px] text-white/70 mt-2 text-right">12:46 PM</span>
                            </div>
                        </div>
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-white border-t border-gray-100">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Type your message here..."
                                className="w-full pl-4 pr-12 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-1 focus:ring-brand/20 transition-all"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-brand text-white rounded-lg hover:bg-brand-dark transition-all shadow-md">
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400 italic">
                    Select a conversation to start chatting.
                </div>
            )}
        </div>
    );
};

export default LiveChat;
