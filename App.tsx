
import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import StyleCard from './components/StyleCard';
import { RENDER_STYLES, PATTERN_MODES } from './constants';
import { RenderingState } from './types';
import { generateUrbanRender } from './services/geminiService';

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    aistudio?: AIStudio;
  }
}

const App: React.FC = () => {
  const [state, setState] = useState<RenderingState>({
    sourceImage: null,
    resultImage: null,
    isLoading: false,
    error: null,
    selectedStyle: 'planning-aerial',
    granularity: 50,
    patternMode: 'natural',
  });
  
  const [hasKey, setHasKey] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio) {
        try {
          const selected = await window.aistudio.hasSelectedApiKey();
          setHasKey(selected);
        } catch (e) {
          console.error("Key check failed", e);
        }
      }
    };
    checkKey();
  }, []);

  const handleConnectKey = async () => {
    if (window.aistudio) {
      try {
        await window.aistudio.openSelectKey();
        setHasKey(true);
      } catch (e) {
        console.error("Key selection failed", e);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = event.target?.result as string;
        setState(prev => ({ 
          ...prev, 
          sourceImage: data,
          resultImage: null,
          error: null 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!state.sourceImage) return;

    if (!hasKey) {
      await handleConnectKey();
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const style = RENDER_STYLES.find(s => s.id === state.selectedStyle);
      const result = await generateUrbanRender(
        state.sourceImage, 
        style?.prompt || "Professional urban render", 
        state.granularity, 
        state.patternMode
      );
      
      setState(prev => ({ ...prev, resultImage: result, isLoading: false }));
    } catch (err: any) {
      if (err.message?.toLowerCase().includes("not found") || err.message?.includes("403") || err.message?.includes("entity")) {
        setHasKey(false);
      }
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: err.message || "An unexpected error occurred during rendering."
      }));
    }
  };

  const handleDownload = () => {
    if (!state.resultImage) return;
    const link = document.createElement('a');
    link.href = state.resultImage;
    link.download = `urban-render.png`;
    link.click();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-200">
      <Header />
      
      {!hasKey && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-center text-[11px] font-bold text-amber-400 flex items-center justify-center gap-3">
          <span>SETUP REQUIRED: CONNECT YOUR PAID API KEY TO ENABLE RENDERING</span>
          <button 
            onClick={handleConnectKey}
            className="bg-amber-600 hover:bg-amber-500 text-white px-3 py-1 rounded transition-colors"
          >
            CONNECT KEY
          </button>
        </div>
      )}

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar Controls */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-4 flex items-center justify-between">
              1. Upload Fabric Map
              {state.sourceImage && <button onClick={() => setState(p => ({...p, sourceImage: null, resultImage: null}))} className="text-[10px] text-red-500 hover:underline lowercase font-normal">Clear</button>}
            </h2>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center transition-all cursor-pointer h-48 group ${
                state.sourceImage ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-slate-700 hover:border-slate-600 hover:bg-slate-800/30'
              }`}
            >
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
              {state.sourceImage ? (
                <img src={state.sourceImage} className="w-full h-full object-cover rounded-lg shadow-lg" />
              ) : (
                <div className="text-center">
                  <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Urban Fabric</p>
                  <p className="text-[8px] mt-1 text-slate-600">JPG, PNG or TIFF (Max 5MB)</p>
                </div>
              )}
            </div>
          </section>

          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 flex flex-col gap-6">
             <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">2. Choose Aesthetics</label>
                <div className="grid grid-cols-2 gap-2">
                  {RENDER_STYLES.map(style => (
                    <StyleCard key={style.id} style={style} isSelected={state.selectedStyle === style.id} onSelect={(id) => setState(prev => ({ ...prev, selectedStyle: id }))} />
                  ))}
                </div>
             </div>

             <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Detail Complexity</label>
                  <span className="text-[10px] font-mono text-indigo-400">{state.granularity}%</span>
                </div>
                <input type="range" min="0" max="100" value={state.granularity} onChange={(e) => setState(p => ({ ...p, granularity: parseInt(e.target.value) }))} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
             </div>

             <button
                onClick={handleGenerate}
                disabled={!state.sourceImage || state.isLoading}
                className={`w-full py-4 rounded-xl font-bold transition-all shadow-xl group overflow-hidden relative ${
                  !state.sourceImage || state.isLoading 
                    ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white active:scale-[0.98]'
                }`}
             >
                {state.isLoading ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Synthesizing Layers...
                  </span>
                ) : 'RENDER URBAN FABRIC'}
             </button>

             {state.error && (
               <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[10px] leading-relaxed">
                 <p className="font-bold mb-1 flex items-center gap-2">
                   <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   Error
                 </p>
                 {state.error}
               </div>
             )}
          </section>
        </div>

        {/* Preview Canvas Area */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-3">
              Output Canvas
              <span className="text-[9px] bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded border border-indigo-500/20 font-mono tracking-widest">GEMINI 2.5 FLASH</span>
            </h2>
            {state.resultImage && <button onClick={handleDownload} className="text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-all shadow-lg shadow-indigo-500/20">Download Result</button>}
          </div>

          <div className="flex-1 bg-slate-900/20 rounded-2xl border border-slate-800/50 flex items-center justify-center relative min-h-[600px] overflow-hidden group shadow-inner">
            {state.isLoading && (
              <div className="absolute inset-0 bg-slate-950/90 z-10 flex flex-col items-center justify-center gap-8 backdrop-blur-sm">
                <div className="relative">
                  <div className="w-24 h-24 border-2 border-indigo-500/10 rounded-full"></div>
                  <div className="absolute inset-0 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  <div className="absolute inset-4 border-2 border-indigo-300/20 border-b-transparent rounded-full animate-spin [animation-duration:1.5s]"></div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-100 animate-pulse">Rendering Architectural Volumes...</p>
                  <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-[0.3em]">Maintaining Geometry Integrity</p>
                </div>
              </div>
            )}

            {!state.resultImage ? (
              <div className="text-center text-slate-700 px-12 transition-opacity group-hover:opacity-100">
                <svg className="w-20 h-20 mx-auto mb-6 opacity-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                <p className="text-sm font-medium mb-2 text-slate-500">Workspace Ready</p>
                <p className="text-[10px] leading-relaxed max-w-xs mx-auto">Upload a city fabric map to start the synthesis process. The AI will strictly follow your geometry while applying architectural rendering techniques.</p>
              </div>
            ) : (
              <div className="w-full h-full p-8 flex flex-col gap-8">
                <div className="flex-1 rounded-2xl overflow-hidden shadow-2xl bg-black border border-slate-800 flex items-center justify-center group/result">
                  <img src={state.resultImage} className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover/result:scale-[1.02]" />
                </div>
                
                {/* Visual Feedback Grid */}
                <div className="grid grid-cols-2 gap-6 h-32">
                   <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden relative group/map shadow-lg">
                      <img src={state.sourceImage!} className="w-full h-full object-cover opacity-20 grayscale transition-opacity group-hover/map:opacity-50" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-[8px] font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full uppercase tracking-widest border border-indigo-500/20">Original Fabric</span>
                        <p className="text-[8px] text-slate-500 mt-2">Geometry Preserved</p>
                      </div>
                   </div>
                   
                   <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden relative p-4 flex flex-col justify-center gap-1 shadow-lg">
                      <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1">Rendering Profile</p>
                      <p className="text-xs text-slate-200 font-semibold truncate">{RENDER_STYLES.find(s => s.id === state.selectedStyle)?.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500" style={{width: `${state.granularity}%`}}></div>
                        </div>
                        <span className="text-[10px] text-indigo-400 font-mono">{state.granularity}%</span>
                      </div>
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-900 bg-slate-950/80 p-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-700 font-bold uppercase tracking-widest">
          <p>© URBANRENDER AI • 2024 STABLE RELEASE</p>
          <div className="flex gap-6 items-center">
            <button onClick={handleConnectKey} className="hover:text-indigo-500 transition-colors">CONFIGURE API KEY</button>
            <span className="hidden md:block w-1.5 h-1.5 bg-slate-800 rounded-full"></span>
            <span>ENGINE: GEMINI-2.5-FLASH-IMAGE</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
