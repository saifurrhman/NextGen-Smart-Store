import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, User, ChevronDown, Smile, Paperclip, Phone, Video } from 'lucide-react';
import api from '../../utils/api';

const fmtFull = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const WhatsAppIcon = ({ size = 24, color = "currentColor" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
    </svg>
);

const PublicChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [sessionId, setSessionId] = useState(localStorage.getItem('support_session_id'));
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);
    const pollRef = useRef(null);

    // Initialize session if none exists
    const initSession = async () => {
        try {
            setLoading(true);
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const name = user.first_name || user.username || 'Guest Customer';

            const res = await api.post('/support/chat-sessions/', {
                customer_name: name,
                topic: 'General Inquiry',
                status: 'waiting',
            });
            const newId = res.data.id;
            setSessionId(newId);
            localStorage.setItem('support_session_id', newId);
            
            // Add a welcome message from the system
            await api.post('/support/chat-messages/', {
                session_id: newId,
                sender_type: 'system',
                sender_name: 'NextGen Assistant',
                message: 'Hi there! 👋 How can we help you today?',
            });
            
            fetchMessages(newId);
        } catch (e) {
            console.error("Failed to start chat session", e);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (id = sessionId) => {
        if (!id) return;
        try {
            const res = await api.get(`/support/chat-messages/?session_id=${id}`);
            setMessages(res.data.results || res.data || []);
        } catch (e) {
            console.error('Failed to fetch messages', e);
        }
    };

    useEffect(() => {
        if (isOpen) {
            if (!sessionId) {
                initSession();
            } else {
                fetchMessages();
                pollRef.current = setInterval(() => fetchMessages(), 3000);
            }
        } else {
            if (pollRef.current) clearInterval(pollRef.current);
        }
        return () => {
            if (pollRef.current) clearInterval(pollRef.current);
        };
    }, [isOpen, sessionId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    const sendMessage = async (e) => {
        e?.preventDefault();
        const text = input.trim();
        if (!text || !sessionId || sending) return;

        setSending(true);
        setInput('');
        
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const name = user.first_name || user.username || 'Customer';

            await api.post('/support/chat-messages/', {
                session_id: sessionId,
                sender_type: 'customer',
                sender_name: name,
                message: text,
            });
            await fetchMessages();
        } catch (err) {
            console.error('Send failed', err);
            setInput(text); // Restore input on fail
        } finally {
            setSending(false);
        }
    };

    const adminWhatsApp = localStorage.getItem('admin_whatsapp') || '923001234567';

    return (
        <div className="fixed bottom-6 right-6 z-[9999] font-sans flex flex-col items-end gap-4">
            {/* WhatsApp Button */}
            {!isOpen && (
                <a
                    href={`https://wa.me/${adminWhatsApp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-transform hover:scale-110 active:scale-95 animate-fade-in-up"
                    style={{ background: '#25D366' }}
                    title="Chat with Admin on WhatsApp"
                >
                    <WhatsAppIcon size={30} color="#fff" />
                </a>
            )}

            {/* Chat Bubble Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-110 active:scale-95 animate-fade-in-up"
                    style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                    title="Live Support Chat"
                >
                    <MessageSquare size={26} color="#fff" />
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="w-[360px] h-[540px] max-h-[80vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-100 animate-fade-in-up">
                    
                    {/* Header */}
                    <div className="p-4 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm shadow-inner">
                                <span className="text-xl">👋</span>
                            </div>
                            <div>
                                <h3 className="text-white font-bold m-0 leading-tight">NextGen Support</h3>
                                <p className="text-white/80 text-xs m-0 flex items-center gap-1 mt-0.5">
                                    <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse"></span>
                                    Typically replies instantly
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors" onClick={() => alert('Audio call connecting...')}>
                                <Phone size={16} />
                            </button>
                            <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors" onClick={() => alert('Video call connecting...')}>
                                <Video size={16} />
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors ml-2"
                            >
                                <ChevronDown size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50/50 flex flex-col gap-4 relative">
                        {loading ? (
                            <div className="flex justify-center items-center h-full text-gray-400">
                                <span className="animate-pulse">Connecting to support...</span>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="flex flex-col justify-center items-center h-full text-gray-400">
                                <MessageSquare size={32} className="mb-2 opacity-50" />
                                <p className="text-sm">Start a conversation</p>
                            </div>
                        ) : (
                            messages.map((msg, i) => {
                                const isCustomer = msg.sender_type === 'customer';
                                const isSystem = msg.sender_type === 'system';
                                const isAdmin = msg.sender_type === 'admin';

                                if (isSystem) {
                                    return (
                                        <div key={msg.id || i} className="flex justify-center my-2">
                                            <span className="bg-gray-100/80 text-gray-500 text-[11px] px-4 py-1.5 rounded-full font-medium border border-gray-200 backdrop-blur-sm">
                                                {msg.message}
                                            </span>
                                        </div>
                                    );
                                }

                                return (
                                    <div key={msg.id || i} className={`flex ${isCustomer ? 'justify-end' : 'justify-start'}`}>
                                        {!isCustomer && (
                                            <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center mr-2 shrink-0 self-end mb-1">
                                                <User size={14} className="text-emerald-700" />
                                            </div>
                                        )}
                                        <div className={`max-w-[75%] ${isCustomer ? 'items-end' : 'items-start'}`}>
                                            {!isCustomer && (
                                                <span className="text-[10px] font-bold text-gray-500 ml-1 mb-1 block">
                                                    {msg.sender_name || 'Agent'}
                                                </span>
                                            )}
                                            <div className={`p-3 text-[14px] leading-relaxed shadow-sm relative ${
                                                isCustomer 
                                                ? 'bg-emerald-600 text-white rounded-[20px_20px_4px_20px]' 
                                                : 'bg-white text-gray-800 rounded-[20px_20px_20px_4px] border border-gray-100'
                                            }`}>
                                                {msg.message}
                                            </div>
                                            <span className={`text-[9px] text-gray-400 mt-1 block ${isCustomer ? 'text-right mr-1' : 'ml-1'}`}>
                                                {fmtFull(msg.created_at)}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
                        <form onSubmit={sendMessage} className="flex items-center gap-2 relative bg-gray-50 rounded-full border border-gray-200 focus-within:border-emerald-500 focus-within:bg-white transition-colors p-1 pr-1.5 pl-3">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Write a message..."
                                className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400 py-2"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || sending}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm ${
                                    input.trim() 
                                    ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                            >
                                <Send size={14} className={input.trim() ? "ml-0.5" : ""} />
                            </button>
                        </form>
                        <div className="text-center mt-2">
                            <span className="text-[10px] text-gray-400 font-medium tracking-wide">
                                Powered by <span className="text-emerald-600 font-bold">NextGen AI</span>
                            </span>
                        </div>
                    </div>
                </div>
            )}

            <style dangerouslySetInnerHTML={{__html: `
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    transform-origin: bottom right;
                }
            `}} />
        </div>
    );
};

export default PublicChatWidget;
