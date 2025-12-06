import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => {
    if (!process.env.API_KEY) {
        console.warn("API_KEY is missing!");
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// --- Collaboration AI (Specific Brands) ---
export const generateCollaborationIdeas = async (businessType: string, goal: string) => {
    const ai = getAI();
    // Prompt engineered for specificity
    const prompt = `Bertindaklah sebagai konsultan kemitraan bisnis senior.
    Saya memiliki usaha: ${businessType}. Tujuan: ${goal}.
    
    Berikan 3 rekomendasi kemitraan yang SANGAT SPESIFIK. 
    JANGAN hanya menyebut "Supplier Kopi", tapi sebutkan "Supplier Kopi seperti Otten Coffee atau Anomali".
    JANGAN hanya menyebut "Jasa Logistik", sebutkan "Paxel atau Lalamove".
    
    Format output JSON array:
    - partnerName: (Nama Brand/Perusahaan spesifik atau contoh nyata)
    - partnerType: (Kategori)
    - mechanism: (Cara kerja kerjasama yang detail)
    - benefit: (Keuntungan finansial/branding konkret)
    
    Gunakan Bahasa Indonesia yang profesional.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            partnerName: { type: Type.STRING },
                            partnerType: { type: Type.STRING },
                            mechanism: { type: Type.STRING },
                            benefit: { type: Type.STRING }
                        }
                    }
                }
            }
        });
        return JSON.parse(response.text || "[]");
    } catch (error) {
        console.error("Collab AI Error:", error);
        throw error;
    }
};

// --- Sentiment AI (Realtime feel) ---
export const analyzeSentiment = async (textData: string) => {
    const ai = getAI();
    const prompt = `Anda adalah analis sentimen pasar real-time. Analisis teks ini: "${textData}".
    
    Berikan output JSON:
    - score (0-100)
    - sentiment (Positif/Netral/Negatif)
    - keywords (5 kata kunci emosi)
    - summary (Ringkasan eksekutif)
    - actionableInsight (Saran tindakan cepat untuk CS/Manajemen)
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        score: { type: Type.NUMBER },
                        sentiment: { type: Type.STRING, enum: ["Positif", "Netral", "Negatif"] },
                        keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                        summary: { type: Type.STRING },
                        actionableInsight: { type: Type.STRING }
                    }
                }
            }
        });
        return JSON.parse(response.text || "{}");
    } catch (error) {
        console.error("Sentiment AI Error:", error);
        throw error;
    }
};

// --- Location AI (Geo-Intelligence) ---
export const analyzeLocation = async (imageBase64: string, description: string, coords?: {lat: number, lng: number}) => {
    const ai = getAI();
    
    let locationContext = "";
    if (coords) {
        locationContext = `Koordinat GPS: Latitude ${coords.lat}, Longitude ${coords.lng}. (Gunakan pengetahuan umum Anda tentang area ini jika data tersedia).`;
    }

    const prompt = `Bertindak sebagai ahli tata kota dan strategi lokasi retail.
    Analisis gambar lokasi ini untuk usaha: ${description}. ${locationContext}
    
    Berikan analisis mendalam tentang:
    1. Kelas Ekonomi lokasi (Grade A/B/C/D).
    2. Demografi (Siapa yang lewat sini? Pekerja, pelajar, keluarga?).
    3. Analisis Kompetitor (Apakah area ini jenuh?).
    
    Output JSON.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } },
                    { text: prompt }
                ]
            },
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        suitabilityScore: { type: Type.NUMBER },
                        economicGrade: { type: Type.STRING, enum: ["A", "B", "C", "D"] },
                        demographicFit: { type: Type.STRING },
                        competitorAnalysis: { type: Type.STRING },
                        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                        recommendation: { type: Type.STRING }
                    }
                }
            }
        });
        return JSON.parse(response.text || "{}");
    } catch (error) {
        console.error("Location AI Error:", error);
        throw error;
    }
};

// --- BrandMaker AI ---
export const generateBrandAssets = async (businessName: string, vibe: string) => {
    const ai = getAI();
    const textPrompt = `Buat strategi branding untuk "${businessName}", gaya "${vibe}".
    Berikan JSON: taglines, description (storytelling merek yang emosional), logoPrompt (prompt inggris detail untuk logo profesional, flat, vector).`;
    
    try {
        const textResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: textPrompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        taglines: { type: Type.ARRAY, items: { type: Type.STRING } },
                        description: { type: Type.STRING },
                        logoPrompt: { type: Type.STRING }
                    }
                }
            }
        });
        
        const textData = JSON.parse(textResponse.text || "{}");
        let logoUrl = null;

        try {
             // Generate High Quality Logo
             const imageResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: {
                    parts: [{text: `Professional vector logo, minimalist, centered, white background, high quality. Brand: ${businessName}. Vibe: ${vibe}. ${textData.logoPrompt}`}]
                }
            });
            
            for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
                if (part.inlineData) {
                    logoUrl = `data:image/png;base64,${part.inlineData.data}`;
                    break;
                }
            }
        } catch (imgError) {
            console.warn("Image generation failed", imgError);
        }

        return { ...textData, logoUrl };

    } catch (error) {
        console.error("Brand AI Error:", error);
        throw error;
    }
};

// --- Business Simulation AI (Expert Level) ---
export const runSimulation = async (params: { price: number; marketingBudget: number; businessType: string; operationalCost: number }) => {
    const ai = getAI();
    const prompt = `Anda adalah Konsultan Bisnis Senior Tingkat Atas (setara McKinsey/BCG).
    Klien: Usaha "${params.businessType}".
    Harga Jual: Rp ${params.price}.
    Budget Marketing: Rp ${params.marketingBudget}.
    Biaya Operasional (Estimasi): Rp ${params.operationalCost}.

    Lakukan simulasi keuangan 6 bulan ke depan dengan ketat dan realistis.
    1. Hitung Break Even Point (BEP) dalam unit/rupiah.
    2. Hitung estimasi ROI (Return on Investment).
    3. Analisis Kejenuhan Pasar (Market Saturation) berdasarkan jenis usaha.
    4. Berikan saran strategis level eksekutif, bukan saran dasar.

    Output JSON.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash', 
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        revenuePrediction: { type: Type.NUMBER },
                        breakEvenPoint: { type: Type.STRING },
                        roi: { type: Type.STRING },
                        marketSaturation: { type: Type.STRING },
                        riskLevel: { type: Type.STRING, enum: ["Rendah", "Sedang", "Tinggi", "Kritis"] },
                        strategicAdvice: { type: Type.ARRAY, items: { type: Type.STRING } },
                        chartData: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    month: { type: Type.STRING },
                                    revenue: { type: Type.NUMBER },
                                    cost: { type: Type.NUMBER }
                                }
                            }
                        }
                    }
                }
            }
        });
        return JSON.parse(response.text || "{}");
    } catch (error) {
        console.error("Simulation AI Error:", error);
        throw error;
    }
};
