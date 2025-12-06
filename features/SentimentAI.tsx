import React, { useState, useEffect } from 'react';
import { Card, Button, TextArea, StatBox } from '../components/Components';
import { analyzeSentiment } from '../services/geminiService';
import { SentimentData } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ThumbsUp, ThumbsDown, Activity, Radio, Search } from 'lucide-react';

export const SentimentAI: React.FC = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SentimentData | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [liveLog, setLiveLog] = useState<string[]>([]);

  // Simulate Live Stream
  useEffect(() => {
    let interval: any;
    if (isLive) {
        const dummyComments = [
            "Produknya bagus banget kak! ✨", 
            "Pengiriman agak lama ya...", 
            "Admin ramah, makasih!", 
            "Harga kemahalan dibanding toko sebelah.",
            "Kualitas ok, tapi packing penyok."
        ];
        interval = setInterval(() => {
            const randomComment = dummyComments[Math.floor(Math.random() * dummyComments.length)];
            const time = new Date().toLocaleTimeString();
            setLiveLog(prev => [`[${time}] ${randomComment}`, ...prev].slice(0, 5));
        }, 2000);
    }
    return () => clearInterval(interval);
  }, [isLive]);

  const handleAnalyze = async () => {
    if (!text) return;
    setLoading(true);
    try {
      const result = await analyzeSentiment(text);
      setData(result);
    } catch (e) {
      alert("Error analisis sentimen.");
    } finally {
      setLoading(false);
    }
  };

  const chartData = data ? [
    { name: 'Positif', value: data.score, color: '#10b981' }, // Emerald
    { name: 'Negatif', value: 100 - data.score, color: '#ef4444' } // Red
  ] : [];

  return (
    <div className="space-y-8 animate-fade-in">
       <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-6 border-b border-gray-200 pb-6">
            <div>
                <h2 className="text-3xl font-serif font-bold text-nexus-text mb-1">Emosi Meter</h2>
                <p className="text-nexus-muted">Analisis sentimen pelanggan mendalam & monitoring (Simulasi).</p>
            </div>
            <div className="flex items-center gap-3 mt-4 md:mt-0">
                <span className={`text-sm ${isLive ? 'text-red-500 animate-pulse font-bold' : 'text-gray-400'}`}>
                    {isLive ? '● LIVE MONITORING' : '○ OFFLINE'}
                </span>
                <button 
                    onClick={() => setIsLive(!isLive)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm ${isLive ? 'bg-red-50 text-red-500 border border-red-200' : 'bg-white border border-gray-200 text-nexus-muted hover:bg-gray-50'}`}
                >
                    {isLive ? 'STOP STREAM' : 'START STREAM'}
                </button>
            </div>
       </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
            {/* Live Feed Simulator */}
            {isLive && (
                <div className="bg-white p-4 rounded-xl border border-red-100 border-t-4 border-t-red-500 h-48 overflow-hidden relative shadow-sm">
                    <div className="absolute top-2 right-2"><Activity className="w-4 h-4 text-red-500 animate-bounce" /></div>
                    <h4 className="text-xs font-bold text-red-500 mb-3 uppercase tracking-wider">Live Chat Stream</h4>
                    <div className="space-y-2">
                        {liveLog.map((log, i) => (
                            <div key={i} className="text-xs text-nexus-text font-mono border-b border-gray-100 pb-1 animate-fade-in">
                                {log}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <Card title="Analisis Manual">
                <p className="text-sm text-nexus-muted mb-4">Paste ulasan atau chat history untuk analisis deep-dive.</p>
                <TextArea 
                rows={5} 
                placeholder="Contoh: Makanannya enak tapi tempatnya panas banget..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="mb-4"
                />
                <Button onClick={handleAnalyze} disabled={loading} className="w-full">
                {loading ? "Menganalisis Psikologi..." : "Analisis Mendalam"}
                </Button>
            </Card>
        </div>

        <div className="lg:col-span-7">
            {data ? (
            <Card title="Hasil Analisis Psikografis" className="h-full">
                <div className="space-y-8">
                    <div className="grid grid-cols-3 gap-4">
                        <StatBox label="Skor Kepuasan" value={`${data.score}/100`} color={data.score > 70 ? 'text-green-500' : data.score > 40 ? 'text-yellow-500' : 'text-red-500'} />
                        <StatBox label="Dominan Emosi" value={data.sentiment} />
                        <div className="bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center">
                            {data.sentiment === 'Positif' ? <ThumbsUp className="text-green-500 w-8 h-8" /> : <ThumbsDown className="text-red-500 w-8 h-8" />}
                        </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <h4 className="text-sm font-bold text-nexus-text mb-2 flex items-center gap-2">
                            <Search className="w-4 h-4 text-nexus-accent" /> Insight Utama
                        </h4>
                        <p className="text-gray-600 italic mb-4 font-serif text-lg">"{data.summary}"</p>
                        
                        <div className="bg-nexus-accent/5 p-4 rounded-lg border border-nexus-accent/20">
                            <p className="text-xs text-nexus-accent font-bold uppercase mb-1">Rekomendasi Tindakan</p>
                            <p className="text-sm text-nexus-text font-medium">{data.actionableInsight}</p>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs uppercase text-nexus-muted mb-3 font-bold">Keyword Cloud</h4>
                        <div className="flex flex-wrap gap-2">
                            {data.keywords.map((k, i) => (
                                <span key={i} className="px-3 py-1 bg-white hover:bg-gray-50 text-nexus-text text-xs border border-gray-200 rounded-full transition-colors cursor-default shadow-sm">{k}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </Card>
            ) : (
            <div className="h-full flex flex-col items-center justify-center text-nexus-muted bg-white rounded-2xl min-h-[400px] border border-gray-100 shadow-sm">
                <Activity className="w-16 h-16 opacity-10 mb-4" />
                <p>Menunggu data untuk dianalisis...</p>
            </div>
            )}
        </div>
      </div>
    </div>
  );
};