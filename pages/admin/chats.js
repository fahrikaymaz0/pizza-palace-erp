'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { MessageSquare, Send, LogOut } from 'lucide-react';

export default function AdminChats() {
  const router = useRouter();
  const [rooms, setRooms] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const esRef = useRef(null);

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) router.push('/admin/login');
  }, [router]);

  useEffect(() => {
    fetchRooms();
    const t = setInterval(fetchRooms, 5000);
    return () => clearInterval(t);
  }, []);

  async function fetchRooms() {
    try {
      const res = await fetch('/api/chat/rooms');
      const data = await res.json();
      if (data.success) setRooms(data.rooms);
    } catch {}
  }

  useEffect(() => {
    if (!selected) return;
    if (esRef.current) esRef.current.close();
    const es = new EventSource(`/api/chat/stream?roomId=${selected.id}`);
    es.addEventListener('messages', e => {
      try { setMessages(JSON.parse(e.data)); } catch {}
    });
    esRef.current = es;
    return () => es.close();
  }, [selected]);

  async function send() {
    if (!selected || !input.trim()) return;
    const text = input.trim();
    setInput('');
    await fetch('/api/chat/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId: selected.id, text, sender: 'admin' })
    });
  }

  const lastPreview = useMemo(() => (r) => r?.messages?.[0]?.text || 'Yeni sohbet', []);

  return (
    <>
      <Head>
        <title>Admin Sohbetler - Pizza Krallığı</title>
      </Head>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-7 h-7 text-red-600" />
                <h1 className="text-2xl font-bold">Sohbetler</h1>
              </div>
              <button onClick={() => { localStorage.removeItem('adminToken'); localStorage.removeItem('adminUser'); router.push('/admin/login'); }} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"><LogOut className="w-4 h-4" />Çıkış</button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b font-semibold">Sohbet Odaları</div>
            <div className="max-h-[70vh] overflow-y-auto">
              {rooms.map(r => (
                <button key={r.id} onClick={() => setSelected(r)} className={`w-full text-left px-4 py-3 border-b hover:bg-gray-50 ${selected?.id===r.id?'bg-gray-50':''}`}>
                  <div className="text-sm font-semibold">Oda #{r.id.slice(0,6)}</div>
                  <div className="text-xs text-gray-600 truncate">{lastPreview(r)}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 bg-white rounded-lg shadow flex flex-col overflow-hidden">
            <div className="p-4 border-b font-semibold">{selected ? `Oda #${selected.id.slice(0,6)}` : 'Bir sohbet seçin'}</div>
            <div className="flex-1 p-4 space-y-2 overflow-y-auto bg-gray-50">
              {messages.map(m => (
                <div key={m.id} className={`max-w-[70%] px-3 py-2 rounded-lg text-sm ${m.sender==='admin'?'ml-auto bg-red-600 text-white':'mr-auto bg-gray-200 text-gray-800'}`}>{m.text}</div>
              ))}
            </div>
            <div className="p-3 border-t flex gap-2">
              <input className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Yanıt yazın..." />
              <button onClick={send} className="bg-red-600 text-white px-4 rounded-lg hover:bg-red-700 flex items-center gap-1"><Send className="w-4 h-4" />Gönder</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


