import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    MessageSquare, Send, Plus, Search, X, Phone, Video,
    Info, CheckCheck, UserCircle, Smile, Paperclip,
    Circle, ChevronDown, Zap, Headphones, Star, MoreHorizontal
} from 'lucide-react';
import api from '../../../../utils/api';

/* ───────────────────────── helpers ──────────────────────── */
const fmt = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    const now = new Date();
    if (d.toDateString() === now.toDateString())
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const diff = Math.floor((now - d) / 86400000);
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return d.toLocaleDateString([], { weekday: 'short' });
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
};
const fmtFull = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const STATUS = {
    active:  { color: '#22c55e', bg: 'rgba(34,197,94,.12)',  label: 'Active'  },
    waiting: { color: '#f59e0b', bg: 'rgba(245,158,11,.12)', label: 'Waiting' },
    closed:  { color: '#94a3b8', bg: 'rgba(148,163,184,.12)',label: 'Closed'  },
};

/* ───────────────────────── Avatar ───────────────────────── */
const Avatar = ({ name = '?', size = 40, gradient = ['#023337','#1a6b47'] }) => {
    const initials = name.split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase();
    return (
        <div style={{
            width: size, height: size, borderRadius: '50%', flexShrink: 0,
            background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 800, fontSize: size * .36,
            letterSpacing: '-.5px', boxShadow: '0 2px 8px rgba(2,51,55,.25)',
        }}>{initials}</div>
    );
};

/* ─────────────────────── SessionCard ─────────────────────── */
const SessionCard = ({ session, active, onClick }) => {
    const name = session.customer_name || 'Guest';
    const st   = STATUS[session.status] || STATUS.closed;
    return (
        <button onClick={onClick} style={{
            width:'100%', display:'flex', alignItems:'center', gap:12,
            padding:'13px 16px', border:'none', cursor:'pointer', textAlign:'left',
            background: active
                ? 'linear-gradient(90deg,rgba(2,51,55,.07),rgba(78,166,116,.05))'
                : 'transparent',
            borderLeft: active ? '3px solid #023337' : '3px solid transparent',
            transition:'all .18s',
        }}
            onMouseEnter={e=>{if(!active)e.currentTarget.style.background='rgba(0,0,0,.03)';}}
            onMouseLeave={e=>{if(!active)e.currentTarget.style.background='transparent';}}>
            <div style={{position:'relative',flexShrink:0}}>
                <Avatar name={name} size={44}
                    gradient={active?['#023337','#1a6b47']:['#4b5563','#6b7280']}/>
                <span style={{
                    position:'absolute',bottom:1,right:1,
                    width:11,height:11,borderRadius:'50%',
                    background:st.color,border:'2px solid #fff',
                    boxShadow:`0 0 0 2px ${st.color}33`,
                }}/>
            </div>
            <div style={{flex:1,minWidth:0}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:4}}>
                    <span style={{fontWeight:700,fontSize:13.5,color:active?'#023337':'#1f2937',
                        whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',flex:1}}>
                        {name}
                    </span>
                    <span style={{fontSize:10.5,color:'#94a3b8',flexShrink:0,fontWeight:500}}>
                        {fmt(session.updated_at||session.created_at)}
                    </span>
                </div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:3,gap:4}}>
                    <span style={{fontSize:12,color:'#64748b',whiteSpace:'nowrap',overflow:'hidden',
                        textOverflow:'ellipsis',flex:1,fontStyle:'italic'}}>
                        {session.topic||'No topic'}
                    </span>
                    <span style={{
                        background:st.bg,color:st.color,
                        borderRadius:100,padding:'2px 8px',fontSize:10,
                        fontWeight:700,flexShrink:0,letterSpacing:'.02em',
                    }}>{st.label}</span>
                </div>
            </div>
        </button>
    );
};

/* ─────────────────── MessageBubble ─────────────────────── */
const MessageBubble = ({ msg, prevSender }) => {
    const isAdmin  = msg.sender_type === 'admin';
    const isSystem = msg.sender_type === 'system';
    const showName = !isAdmin && !isSystem && prevSender !== msg.sender_type;

    if (isSystem) return (
        <div style={{display:'flex',justifyContent:'center',margin:'10px 0'}}>
            <span style={{
                background:'rgba(100,116,139,.1)',backdropFilter:'blur(4px)',
                borderRadius:100,padding:'4px 16px',fontSize:11,
                color:'#64748b',fontWeight:500,border:'1px solid rgba(100,116,139,.1)',
            }}>{msg.message}</span>
        </div>
    );

    return (
        <div style={{
            display:'flex',
            justifyContent:isAdmin?'flex-end':'flex-start',
            marginBottom: 3, padding:'0 16px',
            animation:'fadeIn .2s ease',
        }}>
            {!isAdmin && (
                <div style={{marginRight:8,alignSelf:'flex-end',flexShrink:0}}>
                    <Avatar name={msg.sender_name||'C'} size={30}
                        gradient={['#4b5563','#374151']}/>
                </div>
            )}
            <div style={{maxWidth:'62%',display:'flex',flexDirection:'column',
                alignItems:isAdmin?'flex-end':'flex-start'}}>
                {showName && (
                    <span style={{fontSize:11,fontWeight:700,color:'#64748b',
                        marginBottom:3,marginLeft:4}}>
                        {msg.sender_name||'Customer'}
                    </span>
                )}
                <div style={{
                    position:'relative',
                    background: isAdmin
                        ? 'linear-gradient(135deg,#023337,#0f5132)'
                        : '#fff',
                    color: isAdmin ? '#fff' : '#1f2937',
                    borderRadius: isAdmin
                        ? '20px 20px 5px 20px'
                        : '20px 20px 20px 5px',
                    padding:'11px 15px 8px',
                    boxShadow: isAdmin
                        ? '0 4px 15px rgba(2,51,55,.3)'
                        : '0 2px 8px rgba(0,0,0,.07)',
                    border: isAdmin ? 'none' : '1px solid rgba(0,0,0,.05)',
                }}>
                    <p style={{margin:0,fontSize:13.5,lineHeight:1.55,
                        wordBreak:'break-word',letterSpacing:'.01em'}}>
                        {msg.message}
                    </p>
                    <div style={{display:'flex',alignItems:'center',gap:4,
                        justifyContent:'flex-end',marginTop:5}}>
                        <span style={{fontSize:10,
                            color:isAdmin?'rgba(255,255,255,.55)':'#94a3b8',
                            fontWeight:500}}>
                            {fmtFull(msg.created_at)}
                        </span>
                        {isAdmin && <CheckCheck size={12} color="rgba(255,255,255,.6)"/>}
                    </div>
                </div>
            </div>
            {isAdmin && (
                <div style={{marginLeft:8,alignSelf:'flex-end',flexShrink:0}}>
                    <Avatar name="Admin" size={30} gradient={['#023337','#1a6b47']}/>
                </div>
            )}
        </div>
    );
};

/* ─────────────────────── ChatWindow ────────────────────── */
const ChatWindow = ({ session, adminName, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput]       = useState('');
    const [sending, setSending]   = useState(false);
    const [loading, setLoading]   = useState(true);
    const [isTyping, setIsTyping] = useState(false);
    const bottomRef = useRef(null);
    const pollRef   = useRef(null);
    const inputRef  = useRef(null);

    const fetchMessages = useCallback(async () => {
        try {
            const res = await api.get(`/support/chat-messages/?session_id=${session.id}`);
            setMessages(res.data.results || res.data || []);
        } catch(e){ console.error(e); }
        finally{ setLoading(false); }
    }, [session.id]);

    useEffect(() => {
        setMessages([]); setLoading(true);
        fetchMessages();
        pollRef.current = setInterval(fetchMessages, 2500);
        return () => clearInterval(pollRef.current);
    }, [session.id, fetchMessages]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const send = async (e) => {
        e?.preventDefault();
        const text = input.trim();
        if (!text || sending) return;
        setSending(true); setInput('');
        try {
            await api.post('/support/chat-messages/', {
                session_id: session.id, sender_type: 'admin',
                sender_name: adminName || 'Admin', message: text,
            });
            await fetchMessages();
        } catch(err) { setInput(text); }
        finally { setSending(false); inputRef.current?.focus(); }
    };

    const simulateCustomer = async () => {
        const msgs = [
            'Hello! I have a question about my order.',
            'When will my package arrive?',
            'Can you check the status for me?',
            'Thank you so much for the help! 🙏',
            'I received a damaged item, what should I do?',
            'How do I initiate a return?',
            'Great service! Really appreciate it.',
        ];
        setIsTyping(true);
        await new Promise(r => setTimeout(r, 1200));
        try {
            await api.post('/support/chat-messages/', {
                session_id: session.id, sender_type: 'customer',
                sender_name: session.customer_name || 'Customer',
                message: msgs[Math.floor(Math.random() * msgs.length)],
            });
            await fetchMessages();
        } catch(e){ console.error(e); }
        finally { setIsTyping(false); }
    };

    const st   = STATUS[session.status] || STATUS.closed;
    const name = session.customer_name || 'Guest User';

    return (
        <div style={{display:'flex',flexDirection:'column',height:'100%',
            background:'#f8fafc',position:'relative'}}>

            {/* ── Chat bg pattern ── */}
            <div style={{
                position:'absolute',inset:0,
                backgroundImage:`url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='1' fill='%23023337' opacity='.04'/%3E%3C/svg%3E")`,
                pointerEvents:'none',zIndex:0,
            }}/>

            {/* ── Header ── */}
            <div style={{
                display:'flex',alignItems:'center',gap:14,
                padding:'14px 20px',
                background:'linear-gradient(135deg,#023337 0%,#0f5132 100%)',
                boxShadow:'0 4px 20px rgba(2,51,55,.3)',
                flexShrink:0,zIndex:1,position:'relative',
            }}>
                <div style={{position:'relative',cursor:'pointer'}} onClick={onClose}>
                    <Avatar name={name} size={44} gradient={['#4ea674','#22c55e']}/>
                    <span style={{
                        position:'absolute',bottom:2,right:2,
                        width:12,height:12,borderRadius:'50%',
                        background:st.color,border:'2px solid #023337',
                    }}/>
                </div>
                <div style={{flex:1}}>
                    <h3 style={{margin:0,color:'#fff',fontWeight:700,fontSize:15,letterSpacing:'-.01em'}}>
                        {name}
                    </h3>
                    <p style={{margin:0,fontSize:12,color:'rgba(255,255,255,.7)',
                        display:'flex',alignItems:'center',gap:5}}>
                        {isTyping ? (
                            <span style={{display:'flex',alignItems:'center',gap:4}}>
                                <span style={{display:'flex',gap:2}}>
                                    {[0,1,2].map(i=>(
                                        <span key={i} style={{
                                            width:4,height:4,borderRadius:'50%',
                                            background:'rgba(255,255,255,.8)',
                                            animation:`bounce .8s ${i*.2}s infinite`,
                                        }}/>
                                    ))}
                                </span>
                                typing...
                            </span>
                        ) : (
                            <>
                                <span style={{display:'inline-block',width:7,height:7,
                                    borderRadius:'50%',background:st.color}}/>
                                {st.label} · {session.topic}
                            </>
                        )}
                    </p>
                </div>
                <div style={{display:'flex',gap:4,alignItems:'center'}}>
                    <button onClick={simulateCustomer}
                        title="Simulate a customer reply"
                        style={{
                            display:'flex',alignItems:'center',gap:6,
                            padding:'7px 14px',borderRadius:10,border:'none',
                            background:'rgba(255,255,255,.12)',
                            backdropFilter:'blur(8px)',
                            color:'rgba(255,255,255,.9)',cursor:'pointer',
                            fontSize:12,fontWeight:700,
                            transition:'all .15s',letterSpacing:'.01em',
                        }}
                        onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,.2)'}
                        onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,.12)'}>
                        <Zap size={13}/> Simulate Reply
                    </button>
                    {[
                        {icon:<Phone size={17}/>, tip:'Call'},
                        {icon:<Video size={17}/>, tip:'Video'},
                        {icon:<MoreHorizontal size={17}/>, tip:'More'},
                    ].map(({icon,tip})=>(
                        <button key={tip} title={tip} style={{
                            width:36,height:36,borderRadius:'50%',border:'none',
                            background:'rgba(255,255,255,.1)',cursor:'pointer',
                            color:'rgba(255,255,255,.8)',display:'flex',
                            alignItems:'center',justifyContent:'center',
                            transition:'all .15s',
                        }}
                            onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,.2)'}
                            onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,.1)'}>
                            {icon}
                        </button>
                    ))}
                    <button onClick={onClose} title="Close" style={{
                        width:36,height:36,borderRadius:'50%',border:'none',
                        background:'rgba(255,255,255,.1)',cursor:'pointer',
                        color:'rgba(255,255,255,.8)',display:'flex',
                        alignItems:'center',justifyContent:'center',
                        transition:'all .15s',
                    }}
                        onMouseEnter={e=>e.currentTarget.style.background='rgba(220,38,38,.3)'}
                        onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,.1)'}>
                        <X size={17}/>
                    </button>
                </div>
            </div>

            {/* ── Messages ── */}
            <div style={{
                flex:1,overflowY:'auto',
                padding:'20px 0 10px',
                display:'flex',flexDirection:'column',
                gap:4,position:'relative',zIndex:1,
            }}>
                {/* Date separator */}
                <div style={{display:'flex',alignItems:'center',gap:10,padding:'0 24px',marginBottom:8}}>
                    <div style={{flex:1,height:1,background:'rgba(100,116,139,.15)'}}/>
                    <span style={{fontSize:11,color:'#94a3b8',fontWeight:600,letterSpacing:'.05em'}}>TODAY</span>
                    <div style={{flex:1,height:1,background:'rgba(100,116,139,.15)'}}/>
                </div>

                {loading ? (
                    <div style={{display:'flex',flexDirection:'column',gap:12,padding:'0 20px'}}>
                        {[1,0,1,0].map((r,i)=>(
                            <div key={i} style={{display:'flex',justifyContent:r?'flex-end':'flex-start',gap:8}}>
                                {!r && <div style={{width:30,height:30,borderRadius:'50%',background:'#e2e8f0'}}/>}
                                <div style={{width:`${120+i*30}px`,height:40,borderRadius:16,
                                    background:'#e2e8f0',animation:'pulse 1.5s infinite'}}/>
                            </div>
                        ))}
                    </div>
                ) : messages.length === 0 ? (
                    <div style={{
                        flex:1,display:'flex',flexDirection:'column',
                        alignItems:'center',justifyContent:'center',
                        gap:16,padding:40,
                    }}>
                        <div style={{
                            width:80,height:80,borderRadius:'50%',
                            background:'linear-gradient(135deg,#e8f5e9,#f0fdf4)',
                            display:'flex',alignItems:'center',justifyContent:'center',
                            boxShadow:'0 8px 24px rgba(78,166,116,.15)',
                        }}>
                            <MessageSquare size={36} color="#4ea674" strokeWidth={1.5}/>
                        </div>
                        <div style={{textAlign:'center'}}>
                            <p style={{margin:'0 0 6px',fontWeight:700,fontSize:16,color:'#374151'}}>
                                No messages yet
                            </p>
                            <p style={{margin:0,fontSize:13,color:'#94a3b8'}}>
                                Send a message to start the conversation!
                            </p>
                        </div>
                    </div>
                ) : (
                    messages.map((m, i) => (
                        <MessageBubble key={m.id} msg={m}
                            prevSender={i>0?messages[i-1].sender_type:null}/>
                    ))
                )}
                <div ref={bottomRef}/>
            </div>

            {/* ── Input bar ── */}
            <form onSubmit={send} style={{
                display:'flex',alignItems:'flex-end',gap:10,
                padding:'12px 16px 14px',
                background:'rgba(255,255,255,.92)',
                backdropFilter:'blur(12px)',
                borderTop:'1px solid rgba(0,0,0,.06)',
                boxShadow:'0 -4px 20px rgba(0,0,0,.04)',
                flexShrink:0,zIndex:1,position:'relative',
            }}>
                {[
                    {icon:<Smile size={20}/>,tip:'Emoji'},
                    {icon:<Paperclip size={20}/>,tip:'Attach'},
                ].map(({icon,tip})=>(
                    <button key={tip} type="button" title={tip} style={{
                        width:38,height:38,borderRadius:'50%',border:'none',
                        background:'rgba(100,116,139,.08)',cursor:'pointer',
                        color:'#94a3b8',display:'flex',alignItems:'center',
                        justifyContent:'center',flexShrink:0,transition:'all .15s',
                    }}
                        onMouseEnter={e=>{ e.currentTarget.style.background='rgba(2,51,55,.08)'; e.currentTarget.style.color='#023337'; }}
                        onMouseLeave={e=>{ e.currentTarget.style.background='rgba(100,116,139,.08)'; e.currentTarget.style.color='#94a3b8'; }}>
                        {icon}
                    </button>
                ))}
                <div style={{flex:1,position:'relative'}}>
                    <textarea
                        ref={inputRef}
                        value={input}
                        onChange={e=>setInput(e.target.value)}
                        onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}}}
                        placeholder="Type a message…"
                        rows={1}
                        style={{
                            width:'100%',border:'1.5px solid rgba(2,51,55,.15)',
                            borderRadius:24,padding:'10px 20px',fontSize:14,
                            resize:'none',outline:'none',
                            fontFamily:'Inter,sans-serif',background:'rgba(248,250,252,.9)',
                            lineHeight:1.55,maxHeight:120,overflowY:'auto',
                            transition:'all .15s',boxSizing:'border-box',
                            color:'#1f2937',
                        }}
                        onFocus={e=>{ e.target.style.borderColor='#023337'; e.target.style.boxShadow='0 0 0 3px rgba(2,51,55,.08)'; }}
                        onBlur={e=>{ e.target.style.borderColor='rgba(2,51,55,.15)'; e.target.style.boxShadow='none'; }}
                    />
                </div>
                <button type="submit"
                    disabled={!input.trim()||sending}
                    style={{
                        width:44,height:44,borderRadius:'50%',border:'none',
                        background:input.trim()
                            ? 'linear-gradient(135deg,#023337,#1a6b47)'
                            : 'rgba(100,116,139,.1)',
                        cursor:input.trim()?'pointer':'not-allowed',
                        display:'flex',alignItems:'center',justifyContent:'center',
                        transition:'all .2s',flexShrink:0,
                        boxShadow:input.trim()?'0 4px 14px rgba(2,51,55,.35)':'none',
                        transform:input.trim()?'scale(1)':'scale(.95)',
                    }}>
                    <Send size={18} color={input.trim()?'#fff':'#9ca3af'}
                        style={{marginLeft:2}}/>
                </button>
            </form>

            <style>{`
                @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
                @keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}}
                @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
            `}</style>
        </div>
    );
};

/* ───────────────── CreateModal ─────────────────────────── */
const CreateModal = ({ onClose, onCreated }) => {
    const [form,setSaving]  = useState({ customer_name:'',topic:'',status:'waiting' });
    const [saving,setS]     = useState(false);
    const [err,setErr]      = useState('');

    const set = (k,v) => setSaving(f=>({...f,[k]:v}));

    const submit = async (e) => {
        e.preventDefault();
        if(!form.topic.trim()){setErr('Topic is required');return;}
        setS(true); setErr('');
        try{
            const res = await api.post('/support/chat-sessions/',form);
            onCreated(res.data); onClose();
        }catch(error){
            setErr(error?.response?.data?.detail||'Failed to create session');
        }finally{setS(false);}
    };

    return (
        <div style={{
            position:'fixed',inset:0,
            background:'rgba(2,51,55,.4)',
            backdropFilter:'blur(6px)',
            display:'flex',alignItems:'center',justifyContent:'center',zIndex:9999,
        }}>
            <div style={{
                background:'#fff',borderRadius:20,width:440,
                boxShadow:'0 25px 60px rgba(2,51,55,.25)',
                overflow:'hidden',animation:'fadeIn .25s ease',
            }}>
                <div style={{
                    background:'linear-gradient(135deg,#023337,#0f5132)',
                    padding:'20px 24px',
                    display:'flex',justifyContent:'space-between',alignItems:'center',
                }}>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                        <div style={{width:36,height:36,borderRadius:10,
                            background:'rgba(255,255,255,.12)',
                            display:'flex',alignItems:'center',justifyContent:'center'}}>
                            <MessageSquare size={18} color="#4ea674"/>
                        </div>
                        <div>
                            <h3 style={{margin:0,color:'#fff',fontWeight:800,fontSize:16}}>New Chat Session</h3>
                            <p style={{margin:0,fontSize:11,color:'rgba(255,255,255,.6)'}}>Start a support conversation</p>
                        </div>
                    </div>
                    <button onClick={onClose} style={{width:32,height:32,borderRadius:'50%',
                        border:'none',background:'rgba(255,255,255,.1)',
                        cursor:'pointer',color:'rgba(255,255,255,.8)',
                        display:'flex',alignItems:'center',justifyContent:'center'}}>
                        <X size={16}/>
                    </button>
                </div>
                <form onSubmit={submit} style={{padding:24,display:'flex',flexDirection:'column',gap:18}}>
                    {err&&(
                        <div style={{background:'#fef2f2',border:'1px solid #fecaca',color:'#dc2626',
                            borderRadius:10,padding:'10px 14px',fontSize:13,fontWeight:600}}>
                            ⚠️ {err}
                        </div>
                    )}
                    {[
                        {label:'Customer Name (Guest)',key:'customer_name',placeholder:'e.g. Ahmed Khan',required:false},
                        {label:'Topic *',key:'topic',placeholder:'e.g. Order inquiry, Refund request',required:true},
                    ].map(({label,key,placeholder,required})=>(
                        <div key={key}>
                            <label style={{display:'block',fontSize:11,fontWeight:800,
                                color:'#64748b',marginBottom:7,
                                textTransform:'uppercase',letterSpacing:'.07em'}}>
                                {label}
                            </label>
                            <input
                                value={form[key]}
                                onChange={e=>set(key,e.target.value)}
                                placeholder={placeholder}
                                required={required}
                                style={{
                                    width:'100%',border:'1.5px solid #e2e8f0',borderRadius:12,
                                    padding:'11px 14px',fontSize:14,outline:'none',
                                    boxSizing:'border-box',transition:'all .15s',
                                    fontFamily:'Inter,sans-serif',color:'#1f2937',
                                }}
                                onFocus={e=>{e.target.style.borderColor='#023337';e.target.style.boxShadow='0 0 0 3px rgba(2,51,55,.08)';}}
                                onBlur={e=>{e.target.style.borderColor='#e2e8f0';e.target.style.boxShadow='none';}}
                            />
                        </div>
                    ))}
                    <div>
                        <label style={{display:'block',fontSize:11,fontWeight:800,
                            color:'#64748b',marginBottom:7,
                            textTransform:'uppercase',letterSpacing:'.07em'}}>Status</label>
                        <select value={form.status} onChange={e=>set('status',e.target.value)}
                            style={{width:'100%',border:'1.5px solid #e2e8f0',borderRadius:12,
                                padding:'11px 14px',fontSize:14,outline:'none',
                                background:'#fff',boxSizing:'border-box',
                                fontFamily:'Inter,sans-serif',color:'#1f2937',cursor:'pointer'}}>
                            <option value="waiting">⏳ Waiting</option>
                            <option value="active">✅ Active</option>
                            <option value="closed">🔒 Closed</option>
                        </select>
                    </div>
                    <div style={{display:'flex',gap:10,marginTop:4}}>
                        <button type="button" onClick={onClose} style={{
                            flex:1,padding:'12px',borderRadius:12,
                            border:'1.5px solid #e2e8f0',background:'#fff',
                            cursor:'pointer',fontWeight:700,fontSize:14,color:'#64748b',
                        }}>Cancel</button>
                        <button type="submit" disabled={saving} style={{
                            flex:2,padding:'12px',borderRadius:12,border:'none',
                            background:'linear-gradient(135deg,#023337,#1a6b47)',
                            color:'#fff',cursor:saving?'not-allowed':'pointer',
                            fontWeight:800,fontSize:14,opacity:saving?.75:1,
                            boxShadow:'0 4px 14px rgba(2,51,55,.3)',
                        }}>
                            {saving?'Creating…':'+ Start Chat Session'}
                        </button>
                    </div>
                </form>
            </div>
            <style>{`@keyframes fadeIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}`}</style>
        </div>
    );
};

/* ─────────────────── Main Component ───────────────────── */
const ActiveSessions = () => {
    const [sessions,setSessions]   = useState([]);
    const [selected,setSelected]   = useState(null);
    const [loading,setLoading]     = useState(true);
    const [search,setSearch]       = useState('');
    const [filter,setFilter]       = useState('');
    const [showCreate,setCreate]   = useState(false);

    const adminName = (() => {
        try{ const u=JSON.parse(localStorage.getItem('user')||'{}');
            return u.first_name||u.username||'Admin';}
        catch{return 'Admin';}
    })();

    const fetchSessions = useCallback(async()=>{
        try{
            let url=`/support/chat-sessions/?search=${search}`;
            if(filter) url+=`&status=${filter}`;
            const res=await api.get(url);
            const data=res.data.results||res.data||[];
            setSessions(data);
            if(selected){
                const upd=data.find(s=>s.id===selected.id);
                if(upd)setSelected(upd);
            }
        }catch(e){console.error(e);}
        finally{setLoading(false);}
    },[search,filter]);

    useEffect(()=>{
        fetchSessions();
        const id=setInterval(fetchSessions,5000);
        return ()=>clearInterval(id);
    },[fetchSessions]);

    const counts={
        all:sessions.length,
        active:sessions.filter(s=>s.status==='active').length,
        waiting:sessions.filter(s=>s.status==='waiting').length,
        closed:sessions.filter(s=>s.status==='closed').length,
    };

    const filtered = sessions.filter(s=>{
        const q=search.toLowerCase();
        if(filter&&s.status!==filter) return false;
        return !q||(s.customer_name||'').toLowerCase().includes(q)||(s.topic||'').toLowerCase().includes(q);
    });

    return (
        <>
            <style>{`
                * { box-sizing: border-box; }
                ::-webkit-scrollbar{width:4px;height:4px}
                ::-webkit-scrollbar-track{background:transparent}
                ::-webkit-scrollbar-thumb{background:rgba(2,51,55,.2);border-radius:2px}
            `}</style>
            <div style={{
                display:'flex',height:'calc(100vh - 95px)',
                borderRadius:18,overflow:'hidden',
                border:'1px solid rgba(2,51,55,.1)',
                boxShadow:'0 8px 40px rgba(2,51,55,.1)',
                fontFamily:"'Inter',system-ui,sans-serif",
            }}>

                {/* ── LEFT PANEL ── */}
                <div style={{
                    width: selected ? 310 : '100%',
                    minWidth: selected ? 270 : 'auto',
                    borderRight:'1px solid rgba(0,0,0,.06)',
                    display:'flex',flexDirection:'column',
                    transition:'width .25s cubic-bezier(.4,0,.2,1)',
                    background:'#fff',
                }}>
                    {/* Sidebar header */}
                    <div style={{
                        background:'linear-gradient(160deg,#023337 0%,#0a4a2f 100%)',
                        padding:'18px 16px 14px',flexShrink:0,
                    }}>
                        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
                            <div style={{display:'flex',alignItems:'center',gap:9}}>
                                <div style={{width:34,height:34,borderRadius:10,
                                    background:'rgba(78,166,116,.2)',
                                    display:'flex',alignItems:'center',justifyContent:'center'}}>
                                    <Headphones size={16} color="#4ea674"/>
                                </div>
                                <div>
                                    <h2 style={{margin:0,color:'#fff',fontWeight:800,fontSize:15,letterSpacing:'-.01em'}}>Live Chat</h2>
                                    <p style={{margin:0,fontSize:10.5,color:'rgba(255,255,255,.5)',fontWeight:500}}>
                                        {counts.active} active · {counts.waiting} waiting
                                    </p>
                                </div>
                            </div>
                            <button onClick={()=>setCreate(true)} style={{
                                display:'flex',alignItems:'center',gap:5,
                                padding:'7px 14px',borderRadius:10,border:'none',
                                background:'linear-gradient(135deg,#4ea674,#22c55e)',
                                color:'#fff',cursor:'pointer',fontWeight:800,fontSize:12,
                                boxShadow:'0 4px 12px rgba(34,197,94,.3)',
                                letterSpacing:'.01em',
                            }}>
                                <Plus size={14}/>New
                            </button>
                        </div>
                        <div style={{position:'relative'}}>
                            <Search size={13} style={{position:'absolute',left:11,top:'50%',
                                transform:'translateY(-50%)',color:'rgba(255,255,255,.45)'}}/>
                            <input
                                value={search}
                                onChange={e=>setSearch(e.target.value)}
                                placeholder="Search conversations…"
                                style={{
                                    width:'100%',padding:'9px 12px 9px 32px',
                                    borderRadius:12,border:'none',
                                    background:'rgba(255,255,255,.1)',
                                    color:'#fff',fontSize:13,outline:'none',
                                    '::placeholder':{color:'rgba(255,255,255,.4)'},
                                }}
                            />
                        </div>
                    </div>

                    {/* Filter tabs */}
                    <div style={{
                        display:'flex',background:'#fafafa',
                        borderBottom:'1px solid rgba(0,0,0,.05)',flexShrink:0,
                    }}>
                        {[['','All',counts.all,'#64748b'],
                          ['active','Active',counts.active,'#22c55e'],
                          ['waiting','Waiting',counts.waiting,'#f59e0b'],
                          ['closed','Closed',counts.closed,'#94a3b8'],
                        ].map(([val,label,count,col])=>(
                            <button key={val} onClick={()=>setFilter(val)} style={{
                                flex:1,padding:'9px 4px',border:'none',cursor:'pointer',
                                fontSize:10.5,fontWeight:800,
                                color:filter===val?col:'#94a3b8',
                                background:'transparent',
                                borderBottom:filter===val?`2.5px solid ${col}`:'2.5px solid transparent',
                                letterSpacing:'.03em',transition:'all .15s',
                            }}>
                                {label}
                                {count>0&&(
                                    <span style={{
                                        marginLeft:4,background:filter===val?col:'#e2e8f0',
                                        color:filter===val?'#fff':'#94a3b8',
                                        borderRadius:100,padding:'1px 6px',fontSize:9,
                                    }}>{count}</span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Session list */}
                    <div style={{flex:1,overflowY:'auto'}}>
                        {loading ? (
                            Array.from({length:5}).map((_,i)=>(
                                <div key={i} style={{display:'flex',gap:12,
                                    padding:'13px 16px',borderBottom:'1px solid #f8f9fa'}}>
                                    <div style={{width:44,height:44,borderRadius:'50%',
                                        background:'#f1f5f9',flexShrink:0}}/>
                                    <div style={{flex:1,display:'flex',flexDirection:'column',gap:7}}>
                                        <div style={{height:12,borderRadius:6,background:'#f1f5f9',width:'55%'}}/>
                                        <div style={{height:10,borderRadius:6,background:'#f1f5f9',width:'75%'}}/>
                                    </div>
                                </div>
                            ))
                        ) : filtered.length===0 ? (
                            <div style={{padding:48,textAlign:'center',color:'#94a3b8'}}>
                                <MessageSquare size={40} strokeWidth={1} style={{margin:'0 auto 12px',opacity:.4}}/>
                                <p style={{margin:0,fontSize:13,fontWeight:600}}>No conversations found</p>
                                <p style={{margin:'6px 0 0',fontSize:12}}>Try adjusting your search or filter</p>
                            </div>
                        ) : filtered.map(s=>(
                            <div key={s.id} style={{borderBottom:'1px solid rgba(0,0,0,.035)'}}>
                                <SessionCard
                                    session={s}
                                    active={selected?.id===s.id}
                                    onClick={()=>setSelected(s)}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── RIGHT PANEL ── */}
                {selected ? (
                    <div style={{flex:1,display:'flex',flexDirection:'column',minWidth:0}}>
                        <ChatWindow session={selected} adminName={adminName} onClose={()=>setSelected(null)}/>
                    </div>
                ):(
                    <div style={{
                        flex:1,display:'flex',flexDirection:'column',
                        alignItems:'center',justifyContent:'center',
                        background:'linear-gradient(160deg,#f8fafc,#f0fdf4)',
                        gap:20,
                    }}>
                        <div style={{
                            width:100,height:100,borderRadius:'50%',
                            background:'linear-gradient(135deg,#e8f5e9,#dcfce7)',
                            display:'flex',alignItems:'center',justifyContent:'center',
                            boxShadow:'0 12px 40px rgba(78,166,116,.15)',
                        }}>
                            <MessageSquare size={44} color="#4ea674" strokeWidth={1.2}/>
                        </div>
                        <div style={{textAlign:'center',maxWidth:300}}>
                            <h3 style={{margin:'0 0 8px',fontSize:20,fontWeight:800,color:'#1e293b',letterSpacing:'-.02em'}}>
                                Select a Conversation
                            </h3>
                            <p style={{margin:'0 0 24px',fontSize:14,color:'#64748b',lineHeight:1.6}}>
                                Pick a chat from the left panel to view messages and reply in real-time
                            </p>
                            <button onClick={()=>setCreate(true)} style={{
                                padding:'12px 28px',borderRadius:12,border:'none',
                                background:'linear-gradient(135deg,#023337,#1a6b47)',
                                color:'#fff',cursor:'pointer',fontWeight:800,fontSize:14,
                                display:'inline-flex',alignItems:'center',gap:8,
                                boxShadow:'0 6px 20px rgba(2,51,55,.25)',
                                letterSpacing:'.01em',
                            }}>
                                <Plus size={17}/> Start New Chat
                            </button>
                        </div>
                        <div style={{display:'flex',gap:12,marginTop:8}}>
                            {[
                                {icon:<Zap size={16} color="#f59e0b"/>,label:'Instant replies',bg:'#fffbeb'},
                                {icon:<Star size={16} color="#6366f1"/>,label:'Rich history',bg:'#eff6ff'},
                                {icon:<Headphones size={16} color="#4ea674"/>,label:'Live support',bg:'#f0fdf4'},
                            ].map(({icon,label,bg})=>(
                                <div key={label} style={{
                                    display:'flex',alignItems:'center',gap:7,
                                    padding:'8px 14px',borderRadius:10,
                                    background:bg,border:'1px solid rgba(0,0,0,.06)',
                                    fontSize:12,fontWeight:600,color:'#374151',
                                }}>
                                    {icon}{label}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {showCreate && (
                <CreateModal
                    onClose={()=>setCreate(false)}
                    onCreated={(s)=>{
                        setSessions(p=>[s,...p]);
                        setSelected(s);
                        setCreate(false);
                    }}
                />
            )}
        </>
    );
};

export default ActiveSessions;
