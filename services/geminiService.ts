import { GoogleGenAI, Type } from "@google/genai";
import { AgentType, AgentAction, SentimentData, LocationAnalysis, SimResult } from "../types";

const getAI = () => {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// Helper function to robustly parse JSON from AI response
const parseJSON = (text: string) => {
    try {
        if (!text) return {};
        
        // Simple extraction: Find first '{' and last '}'
        const firstOpen = text.indexOf('{');
        const lastClose = text.lastIndexOf('}');

        if (firstOpen !== -1 && lastClose !== -1 && lastClose > firstOpen) {
            const jsonStr = text.substring(firstOpen, lastClose + 1);
            return JSON.parse(jsonStr);
        }
        
        return JSON.parse(text);
    } catch (e) {
        console.error("JSON Parse Error. Raw text snippet:", text.substring(0, 200) + "...");
        return {}; 
    }
};

// --- PERSONA: THE RUTHLESS STRATEGIST ---
const SYSTEM_INSTRUCTION = `
PERAN ANDA:
Anda adalah "Vistara Prime", Venture Capitalist (VC) senior yang kejam, pragmatis, dan hanya peduli pada Profit & Scalability.
Anda BUKAN asisten virtual yang ramah. Anda benci basa-basi. Anda benci data yang tidak jelas.

GAYA KOMUNIKASI (TONE OF VOICE):
1. **Direct & Tajam:** Jangan gunakan kata "Mungkin", "Sebaiknya", "Saya sarankan". Gunakan kalimat perintah: "Lakukan X", "Cut budget Y", "Pecat vendor Z".
2. **No Fluff:** Hapus kata pembuka seperti "Tentu", "Halo", "Terima kasih". Langsung ke inti masalah.
3. **Metric-Obsessed:** Selalu tanyakan atau referensikan: CAC (Cost Acquisition), LTV (Lifetime Value), Churn Rate, dan Margin.
4. **Cynical:** Selalu asumsikan user terlalu optimis. Tantang asumsi mereka.

SPESIFIKASI AGEN:

1. **STRATEGIST (The Hatchet Man)**
   - Fokus: Efisiensi Brutal & Cashflow.
   - Output: Misi yang menyakitkan tapi perlu. Contoh: "Stop bakar uang di Ads Instagram kalau konversi website sampah. Perbaiki Landing Page dulu."
   
2. **CREATIVE (The Growth Hacker)**
   - Fokus: Psikologi Gelap & Viralitas.
   - Output: Copywriting yang memanipulasi emosi (Greed, Fear, Pride).
   - Visual: Warna kontras tinggi untuk memenangkan atensi dalam 0.3 detik.

3. **RESEARCHER (The Spy)**
   - Fokus: Intelijen Kompetitor & Unfair Advantage.
   - Output: Cari celah pasar yang ditinggalkan raksasa.

SKENARIO "OMZET TURUN" / "SEPI":
Jika user mengeluh sepi:
1. **Strategist:** "Masalahmu bukan sepi, tapi produkmu tidak relevan atau retensimu buruk. Cek data returning customer."
2. **Researcher:** "Data menunjukkan ada tren X yang kamu lewatkan. Kompetitor Y sudah melakukannya minggu lalu."
3. **Creative:** "Buat kampanye 'Desperate' yang elegan. Flash Sale 3 Jam. Trigger FOMO sekarang."

FORMAT OUTPUT (JSON ONLY):
{
  "thought_process": "Monolog internal yang kasar & kritis tentang bisnis user (max 20 kata).",
  "responses": [
    {
      "agent": "STRATEGIST" | "CREATIVE" | "RESEARCHER",
      "title": "Judul (Singkat & Menohok)",
      "content": "Analisis tajam. Tanpa basa-basi.",
      "data": { ... } 
    }
  ]
}
`;

export const sendMessageToOrchestrator = async (message: string) => {
    const ai = getAI();
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: message,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                responseMimeType: 'application/json',
                maxOutputTokens: 2500,
                temperature: 0.3, // Low temp for maximum strictness and logic
            }
        });

        const parsed = parseJSON(response.text || "{}");
        const rawResponses = Array.isArray(parsed.responses) ? parsed.responses : [];

        const actions: AgentAction[] = rawResponses.map((r: any) => ({
            agent: r.agent as AgentType,
            title: r.title,
            content: r.content,
            data: r.data
        }));

        if (actions.length === 0) {
             return [{
                agent: AgentType.STRATEGIST,
                content: "Bisnismu tidak jelas. Berikan angka: Berapa omzetmu? Berapa marginmu? Jangan buang waktuku.",
                title: "DATA TIDAK VALID"
            }];
        }

        return actions;

    } catch (error) {
        console.error("Orchestrator Error:", error);
        return [{
            agent: AgentType.STRATEGIST,
            content: "Server overload. Coba lagi nanti.",
            title: "System Error"
        }];
    }
};

export const generateCollaborationIdeas = async (business: string, goal: string) => {
  const ai = getAI();
  const prompt = `Acting as a Senior Business Developer.
  User Business: ${business}. Goal: ${goal}.
  
  Give 3 "Unfair Advantage" partnership ideas. 
  Ignore standard collabs. Find partners that own the audience the user needs.
  Format: JSON Array [{partnerName, partnerType, mechanism (The Tactic), benefit (The Hard Numbers)}]`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: { responseMimeType: 'application/json' }
  });
  
  return parseJSON(response.text || "[]");
};

export const analyzeSentiment = async (text: string): Promise<SentimentData> => {
  const ai = getAI();
  const prompt = `Analyze this customer feedback with BRUTAL HONESTY: "${text}".
  Don't sugarcoat. If they hate it, say they hate it. Find the "Bleeding Neck" problem.
  Output JSON: {score, sentiment, summary, actionableInsight (The fix), keywords}.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: { responseMimeType: 'application/json' }
  });

  return parseJSON(response.text || "{}");
};

export const analyzeLocation = async (base64Image: string, desc: string, coords?: {lat: number, lng: number}): Promise<LocationAnalysis> => {
    const ai = getAI();
    let promptText = `Act as a Real Estate Shark. Analyze this location image/data: "${desc}".`;
    if (coords) promptText += ` GPS: ${coords.lat}, ${coords.lng}.`;
    promptText += `
    Look for red flags: Low foot traffic signs, cheap neighbors, bad visibility.
    Output JSON: {suitabilityScore (Be stingy), economicGrade, demographicFit, competitorAnalysis, strengths, weaknesses, recommendation (Buy/Pass)}.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
                { text: promptText }
            ]
        },
        config: { responseMimeType: 'application/json' }
    });

    return parseJSON(response.text || "{}");
};

export const generateBrandAssets = async (name: string, vibe: string) => {
    const ai = getAI();
    const textPrompt = `Create a World-Class Brand Identity for "${name}", vibe: "${vibe}".
    Taglines must be short, punchy, and arrogant/confident (Apple/Nike style).
    Description must sell a philosophy, not a product.
    Output JSON: { taglines, description }.`;
    
    const textResponsePromise = ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: textPrompt,
        config: { responseMimeType: 'application/json' }
    });

    const imagePrompt = `Logo for "${name}", ${vibe}. Masterpiece, award-winning, simple geometric, white background.`;
    const imageResponsePromise = ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: imagePrompt }] },
    });

    const [textResp, imageResp] = await Promise.all([textResponsePromise, imageResponsePromise]);
    const textData = parseJSON(textResp.text || "{}");
    
    let logoUrl = "";
    if (imageResp.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
        logoUrl = `data:image/png;base64,${imageResp.candidates[0].content.parts[0].inlineData.data}`;
    }

    return { ...textData, logoUrl };
};

export const runSimulation = async (params: { price: number, marketingBudget: number, businessType: string, operationalCost: number }): Promise<SimResult> => {
    const ai = getAI();
    const prompt = `Business Simulation: ${params.businessType}.
    Price: ${params.price}, Ads: ${params.marketingBudget}, Ops: ${params.operationalCost}.
    
    Assume Murphy's Law: Everything that can go wrong, will go wrong.
    Calculate BEP with pessimistic conversion rates.
    Output JSON: {breakEvenPoint, roi, marketSaturation, riskLevel (High/Critical mostly), chartData, strategicAdvice}.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
    });

    return parseJSON(response.text || "{}");
};