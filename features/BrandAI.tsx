import React, { useState } from 'react';
import { Card, Button, Input, downloadImage } from '../components/Components';
import { generateBrandAssets } from '../services/geminiService';
import { Sparkles, Download, Copy, Share2 } from 'lucide-react';

export const BrandAI: React.FC = () => {
  const [name, setName] = useState('');
  const [vibe, setVibe] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleGenerate = async () => {
    if (!name || !vibe) return;
    setLoading(true);
    try {
      const data = await generateBrandAssets(name, vibe);
      setResult(data);
    } catch (e) {
      alert("Gagal generate brand assets.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
       <div className="text-center mb-8">
        <h2 className="text-3xl font-serif font-bold text-nexus-text mb-2">Brand Atelier</h2>
        <p className="text-nexus-muted">Bangun identitas visual dan narasi brand yang kuat dalam hitungan detik.</p>
      </div>

      <div className="max-w-3xl mx-auto">
        <Card>
           <div className="flex flex-col md:flex-row gap-6 items-end">
              <div className="flex-1 w-full">
                <label className="text-xs text-nexus-muted mb-2 block uppercase font-bold tracking-wider">Nama Bisnis</label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Vistara Coffee" />
              </div>
              <div className="flex-1 w-full">
                <label className="text-xs text-nexus-muted mb-2 block uppercase font-bold tracking-wider">Style / Nuansa</label>
                <Input value={vibe} onChange={e => setVibe(e.target.value)} placeholder="Futuristic, Luxury, Eco-friendly..." />
              </div>
              <Button onClick={handleGenerate} disabled={loading} className="w-full md:w-auto min-w-[150px]">
                  {loading ? <Sparkles className="animate-spin" /> : "GENERATE BRAND"}
              </Button>
           </div>
        </Card>
      </div>

      {result && (
          <div className="grid md:grid-cols-2 gap-8 mt-12">
              {/* Logo Section */}
              <div className="flex flex-col items-center">
                <div className="bg-white p-12 rounded-2xl shadow-xl border border-gray-100 mb-6 relative group overflow-hidden w-full flex items-center justify-center h-[400px]">
                    {result.logoUrl ? (
                        <img src={result.logoUrl} alt="Generated Logo" className="w-64 h-64 object-contain transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                        <div className="w-64 h-64 flex items-center justify-center text-gray-300 font-serif italic text-xl">Preview Logo</div>
                    )}
                </div>
                {result.logoUrl && (
                    <Button 
                        onClick={() => downloadImage(result.logoUrl, `${name}-logo.png`)} 
                        variant="outline"
                        className="w-full max-w-xs"
                    >
                        <Download className="w-4 h-4" /> Download High-Res Logo
                    </Button>
                )}
              </div>

              {/* Text Assets Section */}
              <div className="space-y-6">
                  <div className="space-y-4">
                      <h4 className="text-nexus-accent text-sm uppercase font-bold tracking-widest border-b border-gray-200 pb-2">Tagline Options</h4>
                      <div className="space-y-3">
                        {result.taglines.map((t: string, i: number) => (
                            <div key={i} className="bg-white border border-gray-200 p-5 rounded-xl text-nexus-text font-serif text-lg italic hover:border-nexus-accent/50 hover:shadow-md transition-all cursor-pointer group flex justify-between items-center">
                                "{t}"
                                <Copy className="w-4 h-4 opacity-0 group-hover:opacity-100 text-nexus-muted" />
                            </div>
                        ))}
                      </div>
                  </div>

                  <div className="mt-8">
                       <h4 className="text-nexus-accent text-sm uppercase font-bold tracking-widest border-b border-gray-200 pb-2 mb-4">Brand Storytelling</h4>
                       <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                            <p className="text-nexus-text leading-loose text-justify font-light text-lg">
                                {result.description}
                            </p>
                       </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};