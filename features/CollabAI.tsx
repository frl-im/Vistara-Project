import React, { useState } from 'react';
import { Card, Button, Input } from '../components/Components';
import { generateCollaborationIdeas } from '../services/geminiService';
import { Users, Handshake, Building2, Briefcase } from 'lucide-react';

export const CollabAI: React.FC = () => {
  const [business, setBusiness] = useState('');
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleGenerate = async () => {
    if (!business || !goal) return;
    setLoading(true);
    try {
      const ideas = await generateCollaborationIdeas(business, goal);
      setResults(ideas);
    } catch (e) {
      alert("Koneksi terganggu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif font-bold text-nexus-text mb-2">Mitra Link Intelligence</h2>
        <p className="text-nexus-muted">Temukan partner strategis spesifik untuk mengakselerasi bisnis Anda.</p>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        <div className="md:col-span-4">
            <Card title="Profil Bisnis Anda">
            <div className="space-y-6">
                <div>
                <label className="block text-sm text-nexus-muted mb-2 font-medium">Jenis Usaha</label>
                <Input 
                    placeholder="Contoh: Coffee Shop Specialty..." 
                    value={business}
                    onChange={(e) => setBusiness(e.target.value)}
                />
                </div>
                <div>
                <label className="block text-sm text-nexus-muted mb-2 font-medium">Tujuan Utama</label>
                <Input 
                    placeholder="Contoh: Ekspansi ke luar kota..." 
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                />
                </div>
                <Button onClick={handleGenerate} disabled={loading} className="w-full">
                {loading ? "Menganalisis Database..." : "Cari Mitra Spesifik"}
                </Button>
            </div>
            </Card>
        </div>

        <div className="md:col-span-8 space-y-6">
          {results.length > 0 ? (
            results.map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all border-l-4 border-l-nexus-accent">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-nexus-text flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-nexus-accent" />
                        {item.partnerName}
                    </h4>
                    <span className="text-sm text-nexus-muted flex items-center gap-1 mt-1">
                        <Briefcase className="w-3 h-3" /> {item.partnerType}
                    </span>
                  </div>
                  <div className="bg-nexus-accent/10 text-nexus-accent px-3 py-1 rounded-full text-xs font-bold border border-nexus-accent/20">
                    RECOMMENDED
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 mt-4 bg-gray-50 p-5 rounded-xl border border-gray-100">
                    <div>
                        <p className="text-xs text-nexus-muted uppercase font-bold mb-1">Mekanisme Kerjasama</p>
                        <p className="text-sm text-nexus-text leading-relaxed">{item.mechanism}</p>
                    </div>
                    <div>
                        <p className="text-xs text-nexus-muted uppercase font-bold mb-1">Potensi Benefit</p>
                        <p className="text-sm text-nexus-accent font-medium">{item.benefit}</p>
                    </div>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-nexus-muted border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
              <Handshake className="w-16 h-16 mb-4 opacity-20" />
              <p>Masukkan data untuk mendapatkan rekomendasi mitra konkret.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};