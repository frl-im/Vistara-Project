import React, { useState, useRef } from 'react';
import { Card, Button, Input, StatBox } from '../components/Components';
import { analyzeLocation } from '../services/geminiService';
import { LocationAnalysis } from '../types';
import { MapPin, Camera, Crosshair, TrendingUp, Users, AlertTriangle } from 'lucide-react';

export const LocationAI: React.FC = () => {
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LocationAnalysis | null>(null);
  const [coords, setCoords] = useState<{lat: number, lng: number} | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getLiveLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            setCoords({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            });
            alert("Lokasi Terkunci: Koordinat berhasil diambil untuk analisis lebih akurat.");
        }, () => {
            alert("Gagal mengambil lokasi. Pastikan izin lokasi aktif.");
        });
    }
  };

  const handleAnalyze = async () => {
    if (!image || !desc) return;
    setLoading(true);
    try {
      const base64Data = image.split(',')[1];
      const data = await analyzeLocation(base64Data, desc, coords);
      setResult(data);
    } catch (e) {
      alert("Gagal memproses lokasi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif font-bold text-nexus-text mb-2">Geo Scout Intelligence</h2>
        <p className="text-nexus-muted">Analisis potensi lokasi berbasis visi komputer dan data geografis.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card title="Data Lapangan">
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-nexus-muted mb-2 font-medium">Rencana Usaha</label>
                <Input 
                  placeholder="Contoh: Barbershop Premium..." 
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2 mb-2">
                  <Button onClick={getLiveLocation} variant="secondary" className="w-full text-xs">
                    <Crosshair className="w-4 h-4" /> {coords ? `Lokasi Terkunci (${coords.lat.toFixed(4)})` : "Ambil Live Location"}
                  </Button>
              </div>

              <div 
                className="border-2 border-dashed border-gray-200 bg-gray-50 rounded-xl h-64 flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-nexus-accent/50 transition-all relative overflow-hidden group"
                onClick={() => fileInputRef.current?.click()}
              >
                {image ? (
                  <img src={image} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="text-center p-6">
                    <Camera className="w-12 h-12 text-nexus-accent mb-4 mx-auto opacity-80" />
                    <span className="text-sm text-nexus-text font-medium">Upload Foto Lingkungan/Ruko</span>
                    <p className="text-xs text-nexus-muted mt-2">Ambil foto jalan atau tampak depan lokasi</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white font-medium">Ganti Foto</p>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>

              <Button onClick={handleAnalyze} disabled={loading || !image} className="w-full">
                {loading ? "Menganalisis Ekonomi Mikro..." : "Jalankan Analisis Geo"}
              </Button>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          {result ? (
              <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <StatBox label="Skor Lokasi" value={`${result.suitabilityScore}/100`} />
                    <StatBox label="Grade Ekonomi" value={result.economicGrade} color={result.economicGrade === 'A' ? 'text-green-500' : 'text-nexus-accent'} />
                  </div>

                  <Card className="border-l-4 border-nexus-accent">
                      <h4 className="text-lg font-serif font-bold text-nexus-text mb-4">Analisis Deep-Dive</h4>
                      
                      <div className="space-y-4">
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                              <div className="flex items-center gap-2 mb-2 text-nexus-accent">
                                  <Users className="w-4 h-4" />
                                  <h5 className="font-bold text-sm uppercase">Demografi</h5>
                              </div>
                              <p className="text-sm text-nexus-text leading-relaxed">{result.demographicFit}</p>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                              <div className="flex items-center gap-2 mb-2 text-red-500">
                                  <TrendingUp className="w-4 h-4" />
                                  <h5 className="font-bold text-sm uppercase">Kompetitor</h5>
                              </div>
                              <p className="text-sm text-nexus-text leading-relaxed">{result.competitorAnalysis}</p>
                          </div>
                      </div>
                  </Card>

                  <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
                          <h5 className="text-green-500 font-bold text-sm mb-2">Kekuatan</h5>
                          <ul className="list-disc list-inside text-xs text-gray-500 space-y-1">
                              {result.strengths.map((s, i) => <li key={i}>{s}</li>)}
                          </ul>
                      </div>
                      <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
                          <h5 className="text-red-500 font-bold text-sm mb-2">Risiko</h5>
                          <ul className="list-disc list-inside text-xs text-gray-500 space-y-1">
                              {result.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                          </ul>
                      </div>
                  </div>

                  <div className="bg-nexus-accent/5 border border-nexus-accent/20 p-5 rounded-xl text-center">
                       <p className="text-xs text-nexus-accent font-bold uppercase mb-2">Rekomendasi Strategis</p>
                       <p className="text-sm text-nexus-text font-medium font-serif italic">"{result.recommendation}"</p>
                  </div>
              </div>
          ) : (
              <div className="h-full flex flex-col items-center justify-center text-nexus-muted bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                  <MapPin className="w-16 h-16 mx-auto mb-4 opacity-10" />
                  <p className="text-center">Unggah foto dan data untuk mendapatkan analisis ekonomi lokasi mendalam.</p>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};