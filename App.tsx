import React, { useState } from 'react';
import { AppModule, NavItem } from './types';
import { LayoutGrid, Users, MessageSquare, Map, PenTool, TrendingUp, Menu, X, ChevronRight, Hexagon, BarChart3, Globe2, Zap } from 'lucide-react';
import { CollabAI } from './features/CollabAI';
import { SentimentAI } from './features/SentimentAI';
import { LocationAI } from './features/LocationAI';
import { BrandAI } from './features/BrandAI';
import { SimAI } from './features/SimAI';

const NAV_ITEMS: NavItem[] = [
  { id: AppModule.DASHBOARD, label: 'Overview', icon: <LayoutGrid size={20} />, description: 'Executive Dashboard' },
  { id: AppModule.COLLAB, label: 'Partner Link', icon: <Users size={20} />, description: 'Strategic Alliances' },
  { id: AppModule.SENTIMENT, label: 'Market Pulse', icon: <MessageSquare size={20} />, description: 'Customer Sentiment' },
  { id: AppModule.LOCATION, label: 'Geo Vision', icon: <Map size={20} />, description: 'Location Intelligence' },
  { id: AppModule.BRANDING, label: 'Brand Atelier', icon: <PenTool size={20} />, description: 'Identity Design' },
  { id: AppModule.SIMULATION, label: 'Future Cast', icon: <TrendingUp size={20} />, description: 'Financial Simulation' },
];

const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<AppModule>(AppModule.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeModule) {
      case AppModule.COLLAB: return <CollabAI />;
      case AppModule.SENTIMENT: return <SentimentAI />;
      case AppModule.LOCATION: return <LocationAI />;
      case AppModule.BRANDING: return <BrandAI />;
      case AppModule.SIMULATION: return <SimAI />;
      default:
        return (
          <div className="space-y-12 animate-slide-up">
            {/* Hero Section */}
            <div className="relative w-full overflow-hidden rounded-3xl bg-gradient-onyx text-white p-12 shadow-2xl">
                {/* Abstract Texture */}
                <div className="absolute inset-0 opacity-20" 
                     style={{backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '32px 32px'}}>
                </div>
                <div className="absolute top-0 right-0 p-12 opacity-10 text-nexus-accent">
                    <Hexagon size={400} />
                </div>
                
                <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-nexus-accent/20 border border-nexus-accent/30 text-nexus-accent text-xs font-bold uppercase tracking-wider mb-6">
                            <Zap size={12} /> Strategic Intelligence Engine
                        </div>
                        <h1 className="text-5xl md:text-6xl font-serif font-medium mb-6 leading-tight">
                        Expand Your <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-nexus-accent to-yellow-200">Vision with Vistara</span>
                        </h1>
                        <p className="text-lg text-gray-300 font-light leading-relaxed mb-8 max-w-xl">
                        Sebuah ekosistem inteligensi bisnis yang menyatukan visi data, analitik lokasi, dan intuisi pasar untuk pertumbuhan yang terukur.
                        </p>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setActiveModule(AppModule.SIMULATION)}
                                className="bg-nexus-accent text-white font-bold px-8 py-4 rounded-xl hover:bg-yellow-600 transition-all flex items-center gap-2 shadow-lg hover:shadow-nexus-accent/50"
                            >
                                Mulai Konsultasi <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                    
                    {/* Hero Stats/Visuals */}
                    <div className="hidden lg:grid grid-cols-2 gap-4">
                        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                            <BarChart3 className="text-nexus-accent mb-4" size={32} />
                            <div className="text-2xl font-bold text-white mb-1">Precision</div>
                            <div className="text-sm text-gray-400">Data-Driven Insight</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 mt-8">
                            <Globe2 className="text-blue-400 mb-4" size={32} />
                            <div className="text-2xl font-bold text-white mb-1">Scalable</div>
                            <div className="text-sm text-gray-400">Growth Solutions</div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Modules Grid */}
            <div>
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-nexus-text font-serif text-2xl font-bold">Vistara Suite</h3>
                    <div className="h-px flex-1 bg-gray-200 ml-6"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {NAV_ITEMS.slice(1).map((item) => (
                    <button 
                        key={item.id}
                        onClick={() => setActiveModule(item.id)}
                        className="group bg-white hover:bg-nexus-accent/5 border border-gray-100 p-8 rounded-2xl transition-all duration-300 text-left hover:border-nexus-accent/50 hover:shadow-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-nexus-accent/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150"></div>
                        
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-nexus-text text-white rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:bg-nexus-accent group-hover:scale-110 transition-all duration-300">
                                {item.icon}
                            </div>
                            <div className="font-serif font-bold text-xl text-nexus-text mb-2">{item.label}</div>
                            <p className="text-sm text-nexus-muted font-light leading-relaxed">{item.description}</p>
                            
                            <div className="mt-6 flex items-center text-nexus-accent text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                Akses Modul <ChevronRight size={16} className="ml-1" />
                            </div>
                        </div>
                    </button>
                ))}
                </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex bg-nexus-base text-nexus-text overflow-hidden font-sans">
      {/* Mobile Menu Button */}
      <button 
        className="lg:hidden fixed top-4 right-4 z-50 bg-white/90 backdrop-blur p-2 rounded-xl border border-gray-200 text-nexus-text shadow-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar - Dark Luxury Style for Contrast */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-nexus-onyx text-white transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col shadow-2xl lg:shadow-none`}>
        <div className="p-8">
          <div className="flex items-center gap-3 mb-1">
             <div className="w-10 h-10 bg-gradient-to-br from-nexus-accent to-yellow-600 rounded-xl flex items-center justify-center shadow-lg shadow-nexus-accent/20">
                <Hexagon size={24} className="text-white" />
             </div>
             <div>
                <h2 className="text-2xl font-serif font-bold tracking-wide">Vistara</h2>
                <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Strategic Suite</div>
             </div>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto py-6">
          <div className="px-4 mb-2 text-xs font-bold text-gray-500 uppercase tracking-widest">Main Menu</div>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveModule(item.id);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center px-5 py-4 rounded-xl transition-all duration-300 group relative
                ${activeModule === item.id 
                  ? 'text-white bg-white/10 shadow-inner' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              {activeModule === item.id && <div className="absolute left-0 top-2 bottom-2 w-1 bg-nexus-accent rounded-r-full"></div>}
              <span className={`mr-4 transition-transform duration-300 ${activeModule === item.id ? 'text-nexus-accent' : 'group-hover:text-nexus-accent'}`}>{item.icon}</span>
              <div className="text-left">
                <div className={`text-sm tracking-wide ${activeModule === item.id ? 'font-bold' : 'font-medium'}`}>{item.label}</div>
              </div>
            </button>
          ))}
        </nav>
        
        <div className="p-8">
            <div className="bg-white/5 rounded-2xl p-5 border border-white/5 relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 text-white opacity-5 group-hover:opacity-10 transition-opacity">
                    <Hexagon size={80} />
                </div>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">System Status</span>
                    <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></span>
                </div>
                <div className="text-xs text-gray-300 font-medium">Vistara Core Online</div>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative bg-[#f8fafc]">
         {/* Top Header */}
         <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-8 py-4 flex justify-between items-center">
            <div>
                <h1 className="text-lg font-bold font-serif text-nexus-text uppercase tracking-wider flex items-center gap-2">
                    {NAV_ITEMS.find(n => n.id === activeModule)?.label}
                </h1>
            </div>
            
            <div className="flex items-center gap-4">
               <div className="text-xs text-right hidden md:block">
                  <div className="font-bold text-nexus-text">John Doe</div>
                  <div className="text-gray-400">Enterprise Member</div>
               </div>
               <div className="w-8 h-8 rounded-full bg-nexus-accent text-white flex items-center justify-center font-bold font-serif">
                 J
               </div>
            </div>
        </header>

        <div className="p-6 md:p-12 max-w-7xl mx-auto pb-24">
            {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;