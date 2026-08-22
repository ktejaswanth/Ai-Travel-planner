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
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/20 text-sky-700 dark:text-sky-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Next-Gen Travel Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight">
            Craft Your Perfect Journey with{' '}
            <span className="text-sky-600 dark:text-sky-400">TripWise AI</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
            Experience hyper-personalized itineraries, smart budget tracking, and automated travel logistics tailored strictly to your preferences.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              variant="primary"
              rightIcon={<ArrowRight className="h-5 w-5" />}
              onClick={handleCtaClick}
              className="w-full sm:w-auto"
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
              className="w-full sm:w-auto"
            >
              Explore Features
            </Button>
          </div>

          {/* Quick Feature Badges */}
          <div className="mt-14 pt-8 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4 text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-2">
              <Zap className="h-4 w-4 text-sky-600 dark:text-sky-400" />
              <span className="text-xs font-medium">Instant Generation</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-medium">JWT Secure Auth</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <MapPin className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span className="text-xs font-medium">Google Places Ready</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Plane className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-medium">Amadeus API Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* Product Overview Section */}
      <section className="py-16 bg-white dark:bg-slate-900/60 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Everything You Need for Effortless Travel
            </h2>
            <p className="mt-3 text-slate-500 dark:text-slate-400 text-sm">
              Built on a decoupled micro-service architecture for seamless travel organization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="p-2.5 bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-xl w-fit mb-4">
                <Compass className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">Custom Itineraries</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                Define your interests, pace, dietary preferences, and travel style to receive customized daily agendas.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl w-fit mb-4">
                <DollarSign className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">Smart Budget Control</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                Set budget constraints in any currency and allocate estimated expenses across flights, lodging, and activities.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="p-2.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl w-fit mb-4">
                <Hotel className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">Integrated Ecosystem</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                Modular adapters ready for Google Maps, OpenWeather live forecasts, and Amadeus flight/hotel engines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              How TripWise AI Works
            </h2>
            <p className="mt-3 text-slate-500 dark:text-slate-400 text-sm">
              A 3-step workflow from idea to fully organized vacation plan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl text-center border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="w-10 h-10 bg-sky-600 dark:bg-sky-500 text-white rounded-full flex items-center justify-center font-bold text-sm mx-auto mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Select Destination & Dates</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs">
                Enter your origin, destination, start and end dates, along with traveler count.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl text-center border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="w-10 h-10 bg-indigo-600 dark:bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-sm mx-auto mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Define Your Preferences</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs">
                Select your preferred pace, accommodation type, dietary preferences, and travel style.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl text-center border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="w-10 h-10 bg-emerald-600 dark:bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-sm mx-auto mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Review & Manage</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs">
                Save your trip directly to your secure account dashboard and manage your trip parameters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-14 bg-sky-600/10 dark:bg-sky-950/40 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Ready for your next adventure?
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300 text-sm max-w-xl mx-auto">
            Join TripWise AI today and turn travel planning into an effortless experience.
          </p>
          <div className="mt-6">
            <Button
              size="lg"
              variant="primary"
              rightIcon={<ArrowRight className="h-5 w-5" />}
              onClick={handleCtaClick}
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
