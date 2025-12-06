import React, { useState } from 'react';
import { Card, Button, Input, StatBox } from '../components/Components';
import { runSimulation } from '../services/geminiService';
import { SimResult } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, DollarSign, ShieldAlert, PieChart, Briefcase } from 'lucide-react';

export const SimAI: React.FC = () => {
  const [price, setPrice] = useState(15000);
  const [budget, setBudget] = useState(500000);
  const [opCost, setOpCost] = useState(3000000);
  const [bizType, setBizType] = useState('Coffee Shop');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimResult | null>(null);

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const data = await runSimulation({ 
          price, 
          marketingBudget: budget, 
          businessType: bizType,
          operationalCost: opCost
      });
      setResult(data);
    } catch (e) {
      alert("Simulasi gagal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
       <div className="text-center mb-8">
        <h2 className="text-3xl font-serif font-bold text-nexus-text mb-2">Business Simulator Pro</h2>
        <p className="text-nexus-muted">Konsultasi strategi tingkat lanjut dengan proyeksi keuangan riil.</p>
      </div>

      <Card title="Parameter Bisnis" className="border-t-4 border-nexus-accent">
        <div className="grid md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
                <label className="block text-nexus-muted text-xs mb-2 uppercase font-bold">Jenis Usaha</label>
                <Input value={bizType} onChange={e => setBizType(e.target.value)} />
            </div>
            <div>
                <label className="block text-nexus-muted text-xs mb-2 uppercase font-bold">Harga Jual (Rp {price.toLocaleString()})</label>
                <input 
                    type="range" min="1000" max="500000" step="1000" 
                    value={price} onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full accent-nexus-accent"
                />
            </div>
            <div>
                <label className="block text-nexus-muted text-xs mb-2 uppercase font-bold">Marketing Budget (Rp {budget.toLocaleString()})</label>
                <input 
                    type="range" min="0" max="20000000" step="500000" 
                    value={budget} onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full accent-nexus-accent"
                />
            </div>
             <div>
                <label className="block text-nexus-muted text-xs mb-2 uppercase font-bold">Ops Cost/Bulan (Rp {opCost.toLocaleString()})</label>
                <input 
                    type="range" min="500000" max="50000000" step="500000" 
                    value={opCost} onChange={(e) => setOpCost(Number(e.target.value))}
                    className="w-full accent-nexus-accent"
                />
            </div>
        </div>
        <div className="mt-6 flex justify-end">
            <Button onClick={handleSimulate} disabled={loading} className="w-full md:w-auto px-12">
                {loading ? "Menghitung Financial Model..." : "Jalankan Konsultasi"}
            </Button>
        </div>
      </Card>

      {result && (
          <div className="grid lg:grid-cols-12 gap-6">
              {/* Financial Metrics */}
              <div className="lg:col-span-8 space-y-6">
                 <div className="grid grid-cols-3 gap-4">
                    <StatBox label="Break Even Point (BEP)" value={result.breakEvenPoint} subtext="Titik impas penjualan" />
                    <StatBox label="Est. ROI (6 Bulan)" value={result.roi} color="text-green-500" subtext="Pengembalian Investasi" />
                    <StatBox label="Market Saturation" value={result.marketSaturation} color="text-nexus-text" />
                 </div>

                 <Card title="Proyeksi Revenue vs Cost">
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={result.chartData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#d4af37" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="#d4af37" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="month" stroke="#64748b" />
                                <YAxis stroke="#64748b" />
                                <Tooltip contentStyle={{backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b'}} />
                                <Legend />
                                <Area type="monotone" name="Revenue" dataKey="revenue" stroke="#d4af37" fillOpacity={1} fill="url(#colorRev)" />
                                <Area type="monotone" name="Cost" dataKey="cost" stroke="#ef4444" fillOpacity={0.1} fill="#ef4444" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                 </Card>
              </div>

              {/* Strategic Advice */}
              <div className="lg:col-span-4 space-y-6">
                  <div className={`p-6 rounded-2xl border ${
                      result.riskLevel === 'Tinggi' || result.riskLevel === 'Kritis' ? 'bg-red-50 border-red-200 text-red-700' : 
                      result.riskLevel === 'Sedang' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 'bg-green-50 border-green-200 text-green-700'
                  }`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs uppercase font-bold tracking-widest opacity-80">Level Risiko</span>
                            <ShieldAlert className="w-5 h-5 opacity-80" />
                        </div>
                        <div className="text-3xl font-serif font-bold">{result.riskLevel}</div>
                  </div>

                  <div className="bg-white border border-gray-100 p-6 rounded-2xl h-full shadow-sm">
                        <h4 className="text-nexus-accent text-sm font-bold uppercase mb-4 flex items-center gap-2">
                            <Briefcase className="w-4 h-4" /> Strategic Roadmap
                        </h4>
                        <div className="space-y-4">
                            {result.strategicAdvice.map((advice, idx) => (
                                <div key={idx} className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full bg-gray-100 text-xs flex items-center justify-center font-bold text-nexus-text border border-gray-200 mt-0.5">
                                        {idx + 1}
                                    </div>
                                    <p className="text-sm text-nexus-text leading-relaxed">{advice}</p>
                                </div>
                            ))}
                        </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};