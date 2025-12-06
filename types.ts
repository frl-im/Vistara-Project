import React from 'react';

export enum AppModule {
  DASHBOARD = 'DASHBOARD',
  COLLAB = 'COLLAB',
  SENTIMENT = 'SENTIMENT',
  LOCATION = 'LOCATION',
  BRANDING = 'BRANDING',
  SIMULATION = 'SIMULATION'
}

export interface NavItem {
  id: AppModule;
  label: string;
  icon: React.ReactNode;
  description: string;
}

export interface SentimentData {
  score: number;
  sentiment: 'Positif' | 'Netral' | 'Negatif';
  keywords: string[];
  summary: string;
  actionableInsight: string; 
}

export interface SimResult {
  revenuePrediction: number;
  breakEvenPoint: string; // New: BEP
  roi: string; // New: Return on Investment
  marketSaturation: string; // New: Market analysis
  riskLevel: 'Rendah' | 'Sedang' | 'Tinggi' | 'Kritis';
  strategicAdvice: string[]; // Renamed from insights for deeper tone
  chartData: { month: string; revenue: number; cost: number }[]; // Added cost
}

export interface LocationAnalysis {
  suitabilityScore: number;
  economicGrade: 'A' | 'B' | 'C' | 'D'; // New: Grading system
  demographicFit: string;
  competitorAnalysis: string;
  strengths: string[];
  weaknesses: string[];
  recommendation: string;
}