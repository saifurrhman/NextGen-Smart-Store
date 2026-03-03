import React, { useState } from 'react';
import {
    MessageSquare, Send, User, Clock,
    CheckCircle, AlertCircle, Phone, Mail,
    ArrowLeft, MoreVertical, Paperclip, Smile
} from 'lucide-react';
import { Link } from 'react-router-dom';

const TicketDetail = () => {
    const [messages, setMessages] = useState([
        { id: 1, sender: 'Customer', name: 'John Doe', text: 'Hi, I received my order but it seems to be damaged. How can I get a replacement?', time: '10:30 AM', isStaff: false },
        { id: 2, sender: 'Staff', name: 'Support Bot', text: 'Hello John! I am sorry to hear that. Could you please provide your order number?', time: '10:31 AM', isStaff: true },
        { id: 3, sender: 'Customer', name: 'John Doe', text: 'Sure, it is #ORD-9981. I have attached the photos too.', time: '10:35 AM', isStaff: false },
    ]);

    const [reply, setReply] = useState('');

    const handleSend = (e) => {
        e.preventDefault();
        if (!reply.trim()) return;
        const newMessage = {
            id: messages.length + 1,
            sender: 'Staff',
            name: 'Ali (Admin)',
            text: reply,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isStaff: true
        };
        setMessages([...messages, newMessage]);
        setReply('');
    };

    return (
        <div className="max-w-[1200px] mx-auto h-[calc(100vh-140px)] flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mt-4">
            {/* Ticket Header */}
            <div className="p-4 border-b border-gray-50 bg-gray-50/20 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <Link to="/admin/support/tickets" className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-gray-100">
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-800">Order Damage Issue</h3>
                            <span className="text-[10px] font-bold bg-amber-50 text-amber-600 px-2 py-0.5 rounded border border-amber-100">Pending</span>
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Ticket #TK-4421 | Opened by John Doe</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => alert('Ticket marked as Resolved!')}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-bold hover:bg-emerald-600 transition-colors"
                    >
                        <CheckCircle size={14} /> Resolve Ticket
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-800 transition-colors"><MoreVertical size={18} /></button>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#fcfdfd]">
                <div className="flex justify-center">
                    <span className="text-[10px] font-bold text-gray-400 bg-white border border-gray-100 px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm">Today, 15 March 2025</span>
                </div>

                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.isStaff ? 'justify-end' : 'justify-start'} items-end gap-3`}>
                        {!msg.isStaff && (
                            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-[10px] shrink-0 border border-blue-100">
                                {msg.name[0]}
                            </div>
                        )}
                        <div className="flex flex-col gap-1 max-w-[70%]">
                            <div className={`p-4 rounded-2xl text-sm shadow-sm ${msg.isStaff
                                ? 'bg-emerald-500 text-white rounded-br-none'
                                : 'bg-white border border-gray-100 text-gray-700 rounded-bl-none'
                                }`}>
                                <p className="font-medium leading-relaxed">{msg.text}</p>
                            </div>
                            <span className={`text-[9px] font-bold ${msg.isStaff ? 'text-right' : 'text-left'} text-gray-400 uppercase`}>
                                {msg.name} • {msg.time}
                            </span>
                        </div>
                        {msg.isStaff && (
                            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-[10px] shrink-0 border border-emerald-200">
                                {msg.name[0]}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-50 bg-white shrink-0">
                <form onSubmit={handleSend} className="flex items-center gap-3">
                    <button type="button" className="p-2 text-gray-400 hover:text-emerald-500 transition-colors"><Paperclip size={20} /></button>
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                            placeholder="Write your reply here..."
                            className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 font-medium transition-all"
                        />
                        <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-500 transition-colors">
                            <Smile size={18} />
                        </button>
                    </div>
                    <button
                        type="submit"
                        disabled={!reply.trim()}
                        className="p-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100 disabled:opacity-50 disabled:shadow-none"
                    >
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TicketDetail;
