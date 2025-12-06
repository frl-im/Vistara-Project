import React from 'react';
import { Loader2, Download } from 'lucide-react';

export const Card: React.FC<{ children: React.ReactNode; title?: string; className?: string; action?: React.ReactNode }> = ({ children, title, className = '', action }) => (
  <div className={`card-premium rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${className}`}>
    {title && (
      <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white/50 backdrop-blur-sm">
        <h3 className="font-serif font-bold text-xl text-nexus-text tracking-tight flex items-center gap-3">
          {title}
        </h3>
        {action && <div>{action}</div>}
      </div>
    )}
    <div className="p-8 relative z-10">
      {children}
    </div>
  </div>
);

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' }> = ({ children, className = '', variant = 'primary', ...props }) => {
  const baseStyles = "relative font-sans font-medium text-sm py-3 px-8 rounded-xl transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md";
  
  const variants = {
    // Luxury Gradient
    primary: "bg-gradient-gold text-white hover:shadow-lg hover:brightness-110 border border-transparent", 
    secondary: "bg-white text-nexus-text border border-gray-200 hover:border-nexus-accent hover:text-nexus-accent hover:shadow-md",
    outline: "bg-transparent border-2 border-nexus-accent text-nexus-accent hover:bg-nexus-accent/5 font-bold"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {props.disabled ? <Loader2 className="w-5 h-5 animate-spin" /> : children}
    </button>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <div className="relative group">
    <input 
      {...props}
      className={`w-full bg-white border border-gray-200 text-nexus-text font-sans p-4 pl-5 rounded-xl focus:outline-none focus:border-nexus-accent focus:ring-2 focus:ring-nexus-accent/20 placeholder-gray-400 transition-all shadow-sm group-hover:border-gray-300 ${props.className}`}
    />
  </div>
);

export const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
  <div className="relative group">
    <textarea 
      {...props}
      className={`w-full bg-white border border-gray-200 text-nexus-text font-sans p-4 pl-5 rounded-xl focus:outline-none focus:border-nexus-accent focus:ring-2 focus:ring-nexus-accent/20 placeholder-gray-400 transition-all shadow-sm group-hover:border-gray-300 ${props.className}`}
    />
  </div>
);

export const StatBox: React.FC<{ label: string; value: string | number; color?: string; subtext?: string }> = ({ label, value, color = 'text-nexus-text', subtext }) => (
  <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all hover:border-nexus-accent/30 relative overflow-hidden group">
    {/* Decorative background element */}
    <div className="absolute -right-6 -top-6 w-24 h-24 bg-nexus-accent/5 rounded-full group-hover:bg-nexus-accent/10 transition-colors"></div>
    
    <div className="relative z-10">
      <div className="text-nexus-muted text-xs font-sans mb-3 uppercase tracking-widest font-bold">{label}</div>
      <div className={`text-3xl font-serif font-bold ${color}`}>{value}</div>
      {subtext && <div className="text-xs text-nexus-muted mt-3 pt-3 border-t border-gray-100">{subtext}</div>}
    </div>
  </div>
);

export const downloadImage = (base64Data: string, filename: string) => {
    const link = document.createElement('a');
    link.href = base64Data;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};