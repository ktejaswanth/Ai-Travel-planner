import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Compass, DollarSign, Hotel, MapPin, Plane, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../features/auth/AuthContext';
import { Footer } from '../components/layout/Footer';
import { Navbar } from '../components/layout/Navbar';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleCtaClick = () => {
    if (isAuthenticated) {
      navigate('/trips/create');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.15),rgba(255,255,255,0))]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold uppercase tracking-widest mb-8 animate-pulse">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Next-Gen Travel Architecture</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Craft Your Perfect Journey with <span className="bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">TripWise AI</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
            Experience hyper-personalized itineraries, smart budget tracking, and automated travel logistics tailored strictly to your preferences.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              variant="primary"
              rightIcon={<ArrowRight className="h-5 w-5" />}
              onClick={handleCtaClick}
              className="w-full sm:w-auto text-lg px-8 py-4 shadow-xl shadow-sky-500/30 hover:scale-105 transition-transform"
            >
              Plan My Trip
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                const el = document.getElementById('how-it-works');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto text-lg px-8 py-4"
            >
              Explore Features
            </Button>
          </div>

          {/* Quick Feature Badges */}
          <div className="mt-16 pt-10 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-slate-400 max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-2">
              <Zap className="h-4 w-4 text-sky-400" />
              <span className="text-xs font-medium">Instant Generation</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-medium">JWT Secure Auth</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <MapPin className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-medium">Google Places Ready</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Plane className="h-4 w-4 text-indigo-400" />
              <span className="text-xs font-medium">Amadeus API Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* Product Overview Section */}
      <section className="py-20 bg-slate-900/60 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white tracking-tight sm:text-4xl">
              Everything You Need for Effortless Travel
            </h2>
            <p className="mt-4 text-slate-400 text-base">
              Built on a decoupled Spring Boot 3 + React micro-service architecture, prepared for multi-provider API orchestration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel p-8 rounded-2xl border border-slate-800 hover:border-sky-500/30 transition-colors">
              <div className="p-3 bg-sky-500/10 text-sky-400 rounded-xl w-fit mb-6">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-100 mb-3">Custom Itineraries</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Define your interests, pace, dietary preferences, and travel style to receive customized daily agendas.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-2xl border border-slate-800 hover:border-emerald-500/30 transition-colors">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl w-fit mb-6">
                <DollarSign className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-100 mb-3">Smart Budget Control</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Set budget constraints in any currency and allocate estimated expenses across flights, lodging, and activities.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-2xl border border-slate-800 hover:border-indigo-500/30 transition-colors">
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl w-fit mb-6">
                <Hotel className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-100 mb-3">Integrated Ecosystem</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Modular adapters ready for Google Maps, OpenWeather live forecasts, and Amadeus flight/hotel booking engines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white tracking-tight sm:text-4xl">
              How TripWise AI Works
            </h2>
            <p className="mt-4 text-slate-400 text-base">
              A 3-step workflow from idea to fully organized vacation plan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="glass-panel p-8 rounded-2xl text-center border border-slate-800 relative">
              <div className="w-12 h-12 bg-sky-500 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-6 shadow-lg shadow-sky-500/30">
                1
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Select Destination & Dates</h3>
              <p className="text-slate-400 text-sm">
                Enter your origin, destination, start and end dates, along with traveler count.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-2xl text-center border border-slate-800 relative">
              <div className="w-12 h-12 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-6 shadow-lg shadow-indigo-500/30">
                2
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Define Your Preferences</h3>
              <p className="text-slate-400 text-sm">
                Select your preferred pace, accommodation type, dietary preferences, and travel style.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-2xl text-center border border-slate-800 relative">
              <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-6 shadow-lg shadow-emerald-500/30">
                3
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Review & Manage</h3>
              <p className="text-slate-400 text-sm">
                Save your trip directly to your secure account dashboard and manage your trip parameters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-sky-900/40 via-indigo-900/40 to-slate-900 border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            Ready for your next adventure?
          </h2>
          <p className="mt-4 text-slate-300 text-base max-w-2xl mx-auto">
            Join TripWise AI today and turn travel planning from a stress into an effortless experience.
          </p>
          <div className="mt-8">
            <Button
              size="lg"
              variant="primary"
              rightIcon={<ArrowRight className="h-5 w-5" />}
              onClick={handleCtaClick}
              className="px-8 py-4 shadow-xl shadow-sky-500/30"
            >
              Plan My Trip Now
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
