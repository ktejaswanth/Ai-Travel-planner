import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Compass,
  DollarSign,
  Heart,
  MapPin,
  Sparkles,
  Users,
} from 'lucide-react';
import { tripService } from '../../services/tripService';
import { CreateTripRequest, Interest } from '../../types/trip';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Toast, ToastMessage } from '../../components/ui/Toast';

const INTEREST_OPTIONS: { id: Interest; label: string; icon: string }[] = [
  { id: 'BEACH', label: 'Beach & Ocean', icon: '🏖️' },
  { id: 'ADVENTURE', label: 'Adventure & Sports', icon: '🧗' },
  { id: 'NATURE', label: 'Nature & Wildlife', icon: '🌿' },
  { id: 'CULTURE', label: 'Culture & Arts', icon: '🎭' },
  { id: 'HISTORY', label: 'History & Heritage', icon: '🏛️' },
  { id: 'FOOD', label: 'Food & Culinary', icon: '🍕' },
  { id: 'NIGHTLIFE', label: 'Nightlife & Clubs', icon: '🍸' },
  { id: 'SHOPPING', label: 'Shopping & Markets', icon: '🛍️' },
  { id: 'PHOTOGRAPHY', label: 'Photography', icon: '📸' },
  { id: 'RELAXATION', label: 'Relaxation & Spa', icon: '🧘' },
];

export const CreateTripPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState<number>(1);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Form State
  const [destination, setDestination] = useState<string>('');
  const [origin, setOrigin] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [travelers, setTravelers] = useState<number>(2);
  const [budget, setBudget] = useState<number>(30000);
  const [currency, setCurrency] = useState<string>('INR');

  // Preferences State
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>(['BEACH', 'FOOD']);
  const [travelStyle, setTravelStyle] = useState<string>('Balanced');
  const [pace, setPace] = useState<string>('Moderate');
  const [accommodationPreference, setAccommodationPreference] = useState<string>('Resort');
  const [transportPreference, setTransportPreference] = useState<string>('Flight & Rental');
  const [dietaryPreference, setDietaryPreference] = useState<string>('None');
  const [specialRequirements, setSpecialRequirements] = useState<string>('');

  const createTripMutation = useMutation({
    mutationFn: (payload: CreateTripRequest) => tripService.createTrip(payload),
    onSuccess: (newTrip) => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      navigate(`/trips/${newTrip.id}`);
    },
    onError: (err: any) => {
      const errorMsg = err.response?.data?.message || 'Failed to save trip';
      setToast({
        id: Date.now().toString(),
        type: 'error',
        title: 'Validation Error',
        message: errorMsg,
      });
    },
  });

  const toggleInterest = (interest: Interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const validateStep = (currentStep: number): boolean => {
    if (currentStep === 1) {
      if (!destination.trim()) {
        setToast({ id: '1', type: 'error', title: 'Destination Required', message: 'Please enter a trip destination.' });
        return false;
      }
    } else if (currentStep === 2) {
      if (!startDate || !endDate) {
        setToast({ id: '2', type: 'error', title: 'Dates Required', message: 'Please select both start and end dates.' });
        return false;
      }
      if (new Date(endDate) < new Date(startDate)) {
        setToast({ id: '2', type: 'error', title: 'Invalid Dates', message: 'End date cannot be before start date.' });
        return false;
      }
    } else if (currentStep === 3) {
      if (travelers < 1) {
        setToast({ id: '3', type: 'error', title: 'Invalid Travelers', message: 'Travelers count must be at least 1.' });
        return false;
      }
    } else if (currentStep === 4) {
      if (budget < 0) {
        setToast({ id: '4', type: 'error', title: 'Invalid Budget', message: 'Budget cannot be negative.' });
        return false;
      }
    }
    setToast(null);
    return true;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 7));
    }
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    const payload: CreateTripRequest = {
      title: title.trim() || `Trip to ${destination}`,
      origin: origin.trim() || undefined,
      destination: destination.trim(),
      startDate,
      endDate,
      travelers,
      budget,
      currency,
      preferences: {
        interests: selectedInterests,
        travelStyle,
        pace,
        accommodationPreference,
        transportPreference,
        dietaryPreference,
        specialRequirements: specialRequirements.trim() || undefined,
      },
    };
    createTripMutation.mutate(payload);
  };

  return (
    <DashboardLayout>
      {toast && (
        <div className="fixed top-20 right-5 z-50">
          <Toast toast={toast} onClose={() => setToast(null)} />
        </div>
      )}

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Step Progress Timeline Header */}
        <div className="space-y-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Create New Trip</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Step {step} of 7 — {getStepTitle(step)}</p>
            </div>
            <div className="flex items-center space-x-1.5">
              {[1, 2, 3, 4, 5, 6, 7].map((s) => (
                <div
                  key={s}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    s === step
                      ? 'w-7 bg-sky-600 dark:bg-sky-500'
                      : s < step
                      ? 'w-2.5 bg-emerald-500'
                      : 'w-2.5 bg-slate-200 dark:bg-slate-800'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Form Wizard Step Card */}
        <Card className="border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
          {/* STEP 1: Destination */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
                  <MapPin className="h-5 w-5 text-sky-600 dark:text-sky-400 mr-2" /> Where are you traveling?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Specify your main destination and origin city.</p>
              </div>

              <div className="space-y-4 pt-2">
                <Input
                  label="Destination *"
                  placeholder="e.g., Goa, India or Paris, France"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />

                <Input
                  label="Origin City (Optional)"
                  placeholder="e.g., Hyderabad or New York"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                />

                <Input
                  label="Trip Title (Optional)"
                  placeholder={`e.g., ${destination ? `${destination} Getaway` : 'Summer Vacation'}`}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* STEP 2: Dates */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
                  <Calendar className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-2" /> When are you going?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Select your start and end travel dates.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <Input
                  label="Start Date *"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />

                <Input
                  label="End Date *"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* STEP 3: Travelers */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
                  <Users className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2" /> Who is traveling?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Select the total number of travelers.</p>
              </div>

              <div className="space-y-3 pt-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
                  Number of Travelers
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => setTravelers((prev) => Math.max(1, prev - 1))}
                    className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-lg flex items-center justify-center border border-slate-300 dark:border-slate-700 transition-colors"
                  >
                    -
                  </button>
                  <span className="text-2xl font-extrabold text-slate-900 dark:text-white w-12 text-center">
                    {travelers}
                  </span>
                  <button
                    type="button"
                    onClick={() => setTravelers((prev) => prev + 1)}
                    className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-lg flex items-center justify-center border border-slate-300 dark:border-slate-700 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Budget */}
          {step === 4 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
                  <DollarSign className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" /> What is your budget?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Set total target budget for this trip.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="sm:col-span-2">
                  <Input
                    label="Total Budget *"
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
                    Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-sky-500/20 focus:outline-none"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Preferences */}
          {step === 5 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
                  <Heart className="h-5 w-5 text-rose-600 dark:text-rose-400 mr-2" /> Personal Preferences
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Select interests, travel pace, and lodging style.</p>
              </div>

              <div className="space-y-2 pt-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">Interests</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {INTEREST_OPTIONS.map((item) => {
                    const isSelected = selectedInterests.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleInterest(item.id)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-medium flex items-center space-x-2 transition-all ${
                          isSelected
                            ? 'bg-sky-50 dark:bg-sky-500/10 border-sky-500 text-sky-700 dark:text-sky-300 font-semibold'
                            : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <span className="text-base">{item.icon}</span>
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">Travel Pace</label>
                  <select
                    value={pace}
                    onChange={(e) => setPace(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none"
                  >
                    <option value="Relaxed">Relaxed (Slow & easy)</option>
                    <option value="Moderate">Moderate (Balanced)</option>
                    <option value="Fast-paced">Fast-paced (See everything)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">Lodging Style</label>
                  <select
                    value={accommodationPreference}
                    onChange={(e) => setAccommodationPreference(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none"
                  >
                    <option value="Hotel">Hotel</option>
                    <option value="Resort">Resort</option>
                    <option value="Hostel">Hostel</option>
                    <option value="Apartment">Apartment / Airbnb</option>
                    <option value="Boutique">Boutique Hotel</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Review */}
          {step === 6 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
                  <Compass className="h-5 w-5 text-sky-600 dark:text-sky-400 mr-2" /> Review Summary
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Review trip parameters before finalizing.</p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-xs text-slate-700 dark:text-slate-300">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-3 border-b border-slate-200 dark:border-slate-700/60">
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 font-semibold block">Destination</span>
                    <strong className="text-slate-900 dark:text-white text-sm">{destination}</strong>
                    {origin && <span className="text-slate-400 block text-[11px]">From: {origin}</span>}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 font-semibold block">Dates</span>
                    <strong className="text-slate-900 dark:text-white text-sm">{startDate} → {endDate}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-3 border-b border-slate-200 dark:border-slate-700/60">
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 font-semibold block">Travelers</span>
                    <strong className="text-slate-900 dark:text-white">{travelers} Person(s)</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 font-semibold block">Budget</span>
                    <strong className="text-slate-900 dark:text-white">{currency} {budget.toLocaleString()}</strong>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-semibold block mb-1.5">Selected Interests</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedInterests.map((i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-500/20 font-medium">
                        {i}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: Confirm & Submit */}
          {step === 7 && (
            <div className="space-y-5 text-center animate-in fade-in duration-200 py-4">
              <div className="w-14 h-14 bg-sky-600 dark:bg-sky-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                <Sparkles className="h-7 w-7" />
              </div>

              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Your Trip is Ready to Create!</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Click below to save this trip to your dashboard.
                </p>
              </div>

              <Button
                variant="primary"
                size="lg"
                isLoading={createTripMutation.isPending}
                onClick={handleSubmit}
                className="px-8 py-3"
              >
                Save & View Trip
              </Button>
            </div>
          )}

          {/* Navigation Step Controls */}
          <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            {step > 1 ? (
              <Button variant="outline" size="sm" onClick={prevStep}>
                Previous
              </Button>
            ) : (
              <div />
            )}

            {step < 7 && (
              <Button variant="primary" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />} onClick={nextStep}>
                Next Step
              </Button>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

function getStepTitle(step: number): string {
  switch (step) {
    case 1: return 'Destination & Title';
    case 2: return 'Travel Dates';
    case 3: return 'Travelers';
    case 4: return 'Budget & Currency';
    case 5: return 'Preferences';
    case 6: return 'Review';
    case 7: return 'Confirm & Save';
    default: return '';
  }
}
