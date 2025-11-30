import React from 'react';
import { Angle } from '../types';
import { Lightbulb, Target, MessageSquare, MonitorPlay, Zap, Quote } from 'lucide-react';

interface AngleCardProps {
  angle: Angle;
}

export const AngleCard: React.FC<AngleCardProps> = ({ angle }) => {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-5 hover:border-brand-500/50 transition-colors duration-300">
      
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-white mb-2">{angle.title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{angle.whyItWorks}</p>
      </div>

      <div className="h-px bg-slate-700/50" />

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Column */}
        <div className="space-y-4">
          <div className="flex gap-3">
            <Zap className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Core Benefits</span>
              <p className="text-slate-300 text-sm">{angle.coreBenefits}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Target className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Target Audience</span>
              <p className="text-slate-300 text-sm">{angle.targetAudience}</p>
            </div>
          </div>
          
           <div className="flex gap-3">
            <MonitorPlay className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Visuals</span>
              <p className="text-slate-300 text-sm italic">{angle.visuals}</p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
           <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-green-400" />
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">High-Converting Hooks</span>
            </div>
            <ul className="space-y-2">
              {angle.hooks.map((hook, i) => (
                <li key={i} className="text-sm text-slate-200 flex gap-2">
                  <span className="text-slate-600 select-none">•</span>
                  <span>"{hook}"</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
             <div className="flex items-center gap-2 mb-1">
              <Quote className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tagline</span>
            </div>
            <p className="text-white font-medium text-lg">"{angle.tagline}"</p>
          </div>
        </div>
      </div>

      {/* Footer / Platforms */}
      <div className="pt-4 flex flex-wrap gap-2">
        {angle.platforms.map((platform, i) => (
          <span key={i} className="px-3 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-full border border-slate-600">
            {platform}
          </span>
        ))}
        <span className="ml-auto text-xs text-slate-500 self-center hidden sm:block">
           Fast Ad: {angle.shortVersion}
        </span>
      </div>
    </div>
  );
};