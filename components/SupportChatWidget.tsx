'use client';

import { useEffect, useRef, useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

type ChatMessage = {
  id: string;
  text: string;
  sender: 'user' | 'admin';
  createdAt: string;
};

export default function SupportChatWidget() {
  const [open, setOpen] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const eventRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    async function ensureRoom() {
      if (roomId) return;
      try {
        const res = await fetch('/api/chat/create-room', { method: 'POST' });
        if (!res.ok) throw new Error('create-room failed');
        const data = await res.json();
        if (!data?.room?.id) throw new Error('no room id');
        if (!cancelled) setRoomId(data.room.id);
      } catch (e) {
        // geçici hata: yeniden dene
        setTimeout(ensureRoom, 2000);
      }
    }

    ensureRoom();
    return () => { cancelled = true; };
  }, [open, roomId]);

  useEffect(() => {
    if (!open || !roomId) return;
    if (eventRef.current) eventRef.current.close();
    const es = new EventSource(`/api/chat/stream?roomId=${roomId}`);
    es.onmessage = () => {};
    es.addEventListener('messages', (e: MessageEvent) => {
      try {
        const batch: ChatMessage[] = JSON.parse(e.data);
        setMessages(prev => {
          const all = [...prev, ...batch];
          const map = new Map(all.map(m => [m.id, m]));
          return Array.from(map.values()).sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
        });
      } catch {}
    });
    eventRef.current = es;
    return () => { es.close(); };
  }, [open, roomId]);

  async function send() {
    if (!roomId || !input.trim()) return;
    const text = input.trim();
    setInput('');
    await fetch('/api/chat/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId, text, sender: 'user' })
    });
  }

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {!open && (
        <button onClick={() => setOpen(true)} className="flex items-center gap-2 bg-yellow-500 text-purple-900 px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:bg-yellow-400">
          <MessageSquare className="w-5 h-5" />
          <span className="font-semibold hidden sm:block">Destek Ekibi</span>
        </button>
      )}

      {open && (
        <div className="w-80 sm:w-96 h-96 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2"><MessageSquare className="w-5 h-5" /><span className="font-semibold">Canlı Destek</span></div>
            <button onClick={() => setOpen(false)} className="p-1 hover:bg-white/20 rounded"><X className="w-4 h-4" /></button>
          </div>
          <div className="flex-1 p-3 space-y-2 overflow-y-auto bg-gray-50">
            {messages.map(m => (
              <div key={m.id} className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${m.sender === 'user' ? 'ml-auto bg-red-600 text-white' : 'mr-auto bg-gray-200 text-gray-800'}`}>{m.text}</div>
            ))}
          </div>
          <div className="p-3 border-t bg-white flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==='Enter'&&send()} className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Mesajınızı yazın..." />
            <button onClick={send} className="bg-red-600 text-white px-4 rounded-lg hover:bg-red-700 flex items-center gap-1"><Send className="w-4 h-4" />Gönder</button>
          </div>
        </div>
      )}
    </div>
  );
}


