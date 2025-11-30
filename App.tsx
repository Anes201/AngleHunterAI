import React, { useState } from 'react';
import { analyzeImage } from './services/gemini';
import { ImageState, MarketingAnalysis } from './types';
import { ImageUpload } from './components/ImageUpload';
import { CategorySection } from './components/CategorySection';
import { BrainCircuit, Loader2, Sparkles, AlertCircle } from 'lucide-react';

export default function App() {
  const [imageState, setImageState] = useState<ImageState>({
    file: null,
    previewUrl: null,
    base64: null
  });
  const [analysis, setAnalysis] = useState<MarketingAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!imageState.base64) return;

    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await analyzeImage(imageState.base64);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-brand-500/30 selection:text-brand-100">
      
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-brand-600 to-purple-600 p-2 rounded-lg shadow-lg shadow-brand-500/20">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              AngleHunter AI
            </span>
          </div>
          <div className="text-sm text-slate-400 font-medium hidden sm:block">
            Gemini 2.5 Powered
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Panel - Input */}
          <div className="w-full lg:w-1/3 space-y-8 lg:sticky lg:top-24 h-fit">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-white leading-tight">
                Turn Product Images into <span className="text-brand-400">Marketing Gold</span>
              </h1>
              <p className="text-slate-400">
                Upload your product photo. We'll extract exhaustive marketing angles, hooks, and creative strategies instantly.
              </p>
            </div>

            <div className="space-y-6">
              <ImageUpload 
                imageState={imageState} 
                onImageChange={setImageState} 
                isLoading={loading}
              />
              
              <button
                onClick={handleAnalyze}
                disabled={!imageState.file || loading}
                className={`w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all shadow-lg
                  ${!imageState.file || loading
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white shadow-brand-500/25 hover:shadow-brand-500/40 hover:-translate-y-0.5'
                  }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing Deeply...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Extract Marketing Angles
                  </>
                )}
              </button>

              {/* Status Messages */}
              {loading && (
                <div className="bg-brand-900/20 border border-brand-500/20 rounded-lg p-4 text-center animate-pulse">
                  <p className="text-brand-300 text-sm font-medium">
                    Our AI is acting as your creative strategist... <br/>Identifying hooks, pain points, and personas.
                  </p>
                </div>
              )}

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div className="text-sm text-red-300">
                    <p className="font-semibold mb-1">Analysis Failed</p>
                    {error}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Results */}
          <div className="w-full lg:w-2/3 min-h-[500px]">
            {!analysis && !loading && !error && (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4 border-2 border-dashed border-slate-800 rounded-2xl p-12 bg-slate-900/30">
                <BrainCircuit className="w-16 h-16 opacity-20" />
                <p className="text-lg">Results will appear here after analysis</p>
              </div>
            )}

            {analysis && (
              <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                {/* Summary Card */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-8 rounded-2xl shadow-xl">
                  <h2 className="text-sm font-bold text-brand-400 uppercase tracking-widest mb-3">
                    Product Analysis
                  </h2>
                  <p className="text-lg text-slate-200 leading-relaxed font-light">
                    {analysis.productSummary}
                  </p>
                </div>

                {/* Categories */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-2 pb-2">
                     <h3 className="text-xl font-bold text-white">Strategy Breakdown</h3>
                     <span className="text-xs text-slate-500 uppercase tracking-wider">
                       {analysis.categories.reduce((acc, cat) => acc + cat.angles.length, 0)} Total Angles
                     </span>
                  </div>
                  
                  <div className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
                    {analysis.categories.map((category, idx) => (
                      <CategorySection 
                        key={idx} 
                        category={category} 
                        defaultOpen={idx === 0} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}