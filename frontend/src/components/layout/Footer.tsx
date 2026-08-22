import React from 'react';
import { Compass, Github, Heart, Shield, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/80 pt-10 pb-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-200/80 dark:border-slate-800/80">
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-sky-500/10 rounded-lg text-sky-600 dark:text-sky-400">
                <Compass className="h-4 w-4" />
              </div>
              <span className="text-base font-bold text-slate-900 dark:text-slate-100">TripWise AI</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Empowering global travelers with intelligent, personalized trip itineraries, budget tracking, and real-time travel insights.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">Product</h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li><a href="#features" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">AI Itineraries</a></li>
              <li><a href="#how-it-works" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Budget Optimizer</a></li>
              <li><a href="#destination" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Destinations</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">Integrations</h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li className="flex items-center space-x-1.5">
                <Sparkles className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
                <span>Google Maps & Places</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <Shield className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Amadeus Flight/Hotel Engine</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">Legal & Security</h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li><span className="hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer">Terms of Service</span></li>
              <li><span className="hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer">Security Overview</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} TripWise AI Platform. All rights reserved.</p>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <span className="flex items-center">
              Made with <Heart className="h-3.5 w-3.5 text-rose-500 mx-1 fill-rose-500" /> for travelers worldwide
            </span>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
              <Github className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
