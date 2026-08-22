import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Calendar,
  Compass,
  DollarSign,
  Grid,
  List,
  MapPin,
  Plus,
  Search,
  Trash2,
  Users,
} from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { tripService } from '../../services/tripService';
import { Trip, TripStatus } from '../../types/trip';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Toast, ToastMessage } from '../../components/ui/Toast';

type ViewMode = 'grid' | 'table';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'ALL' | 'UPCOMING' | 'PAST' | 'PLANNING'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [tripToDelete, setTripToDelete] = useState<Trip | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Fetch Trips via TanStack Query
  const { data: trips = [], isLoading, isError, refetch } = useQuery<Trip[]>({
    queryKey: ['trips'],
    queryFn: tripService.getTrips,
  });

  // Delete Trip Mutation
  const deleteMutation = useMutation({
    mutationFn: (tripId: string) => tripService.deleteTrip(tripId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      setToast({
        id: Date.now().toString(),
        type: 'success',
        title: 'Trip Removed',
        message: 'The trip has been successfully deleted.',
      });
      setTripToDelete(null);
    },
    onError: (err: any) => {
      setToast({
        id: Date.now().toString(),
        type: 'error',
        title: 'Delete Failed',
        message: err.response?.data?.message || 'Could not delete trip',
      });
    },
  });

  const today = new Date().toISOString().split('T')[0];

  const upcomingTrips = useMemo(
    () => trips.filter((t) => t.startDate >= today && t.status !== 'CANCELLED'),
    [trips, today]
  );
  const pastTrips = useMemo(
    () => trips.filter((t) => t.endDate < today || t.status === 'COMPLETED'),
    [trips, today]
  );
  const planningTrips = useMemo(
    () => trips.filter((t) => t.status === 'PLANNING' || t.status === 'DRAFT'),
    [trips]
  );

  const totalBudget = useMemo(
    () => trips.reduce((acc, t) => acc + (t.budget || 0), 0),
    [trips]
  );

  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      // Filter by Active Tab Category
      let matchesTab = true;
      if (activeTab === 'UPCOMING') matchesTab = trip.startDate >= today && trip.status !== 'CANCELLED';
      if (activeTab === 'PAST') matchesTab = trip.endDate < today || trip.status === 'COMPLETED';
      if (activeTab === 'PLANNING') matchesTab = trip.status === 'PLANNING' || trip.status === 'DRAFT';

      // Filter by Search Query
      let matchesSearch = true;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        matchesSearch =
          trip.title.toLowerCase().includes(q) ||
          trip.destination.toLowerCase().includes(q) ||
          (trip.origin ? trip.origin.toLowerCase().includes(q) : false);
      }

      return matchesTab && matchesSearch;
    });
  }, [trips, activeTab, searchQuery, today]);

  const getStatusBadge = (status: TripStatus) => {
    switch (status) {
      case 'DRAFT':
        return <Badge variant="slate">Draft</Badge>;
      case 'PLANNING':
        return <Badge variant="sky">Planning</Badge>;
      case 'READY':
        return <Badge variant="emerald">Ready</Badge>;
      case 'COMPLETED':
        return <Badge variant="indigo">Completed</Badge>;
      case 'CANCELLED':
        return <Badge variant="rose">Cancelled</Badge>;
      default:
        return <Badge variant="slate">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout searchQuery={searchQuery} onSearchChange={setSearchQuery}>
      {toast && (
        <div className="fixed top-20 right-5 z-50">
          <Toast toast={toast} onClose={() => setToast(null)} />
        </div>
      )}

      {/* Welcome Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome back, <span className="text-sky-600 dark:text-sky-400">{user?.name}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Overview of your active travel itineraries and upcoming adventures.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => navigate('/trips/create')}
        >
          Create New Trip
        </Button>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-xl">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Trips
            </p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{trips.length}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Upcoming
            </p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
              {upcomingTrips.length}
            </h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              In Planning
            </p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
              {planningTrips.length}
            </h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Budget
            </p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
              ₹{totalBudget.toLocaleString()}
            </h3>
          </div>
        </div>
      </div>

      {/* Toolbar Controls: Search, Tabs & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        {/* Category Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { key: 'ALL', label: `All (${trips.length})` },
            { key: 'UPCOMING', label: `Upcoming (${upcomingTrips.length})` },
            { key: 'PLANNING', label: `Planning (${planningTrips.length})` },
            { key: 'PAST', label: `Past (${pastTrips.length})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-sky-600 dark:bg-sky-500 text-white shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Grid/Table View Toggle */}
        <div className="flex items-center space-x-3">
          {/* Mobile Search bar */}
          <div className="relative md:hidden flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex items-center bg-slate-200/70 dark:bg-slate-800 p-1 rounded-xl border border-slate-300/60 dark:border-slate-700/60">
            <button
              onClick={() => setViewMode('grid')}
              title="Grid View"
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              title="Table View"
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl space-y-4 border border-slate-200 dark:border-slate-800">
              <div className="h-6 w-3/4 animate-skeleton" />
              <div className="h-4 w-1/2 animate-skeleton" />
              <div className="h-10 w-full animate-skeleton" />
            </div>
          ))}
        </div>
      )}

      {/* Error View */}
      {isError && (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl text-center border border-rose-200 dark:border-rose-500/30 space-y-4">
          <p className="text-rose-600 dark:text-rose-400 text-sm font-medium">
            Could not load trip data. Please verify backend server connection.
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry Loading
          </Button>
        </div>
      )}

      {/* Empty View */}
      {!isLoading && !isError && filteredTrips.length === 0 && (
        <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl text-center border border-dashed border-slate-300 dark:border-slate-800 space-y-4 max-w-md mx-auto my-8">
          <div className="p-3 bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-full w-fit mx-auto">
            <Compass className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No trips found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {searchQuery
                ? `No trips matching "${searchQuery}"`
                : activeTab === 'ALL'
                ? "You haven't created any trips yet. Start planning now!"
                : `No trips found in the '${activeTab.toLowerCase()}' tab.`}
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={() => navigate('/trips/create')}>
            Plan Your First Trip
          </Button>
        </div>
      )}

      {/* GRID VIEW RENDERING */}
      {!isLoading && !isError && filteredTrips.length > 0 && viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTrips.map((trip) => (
            <Card key={trip.id} hoverEffect className="flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight line-clamp-1">
                    {trip.title}
                  </h3>
                  {getStatusBadge(trip.status)}
                </div>

                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{trip.destination}</span>
                    {trip.origin && <span className="text-slate-400 text-[11px]">(from {trip.origin})</span>}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Calendar className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>
                      {trip.startDate} → {trip.endDate}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 pt-1">
                    <div className="flex items-center space-x-1">
                      <Users className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                      <span>{trip.travelers} Traveler{trip.travelers > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      <span>
                        {trip.currency} {trip.budget.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {trip.preferences?.interests && trip.preferences.interests.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {trip.preferences.interests.slice(0, 3).map((interest) => (
                      <span
                        key={interest}
                        className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60"
                      >
                        {interest}
                      </span>
                    ))}
                    {trip.preferences.interests.length > 3 && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-400">
                        +{trip.preferences.interests.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs py-1.5"
                  onClick={() => navigate(`/trips/${trip.id}`)}
                >
                  View Details
                </Button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setTripToDelete(trip);
                  }}
                  title="Delete Trip"
                  className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* TABLE VIEW RENDERING */}
      {!isLoading && !isError && filteredTrips.length > 0 && viewMode === 'table' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 uppercase text-slate-500 dark:text-slate-400 font-semibold tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Trip Title</th>
                  <th className="px-5 py-3.5">Destination</th>
                  <th className="px-5 py-3.5">Dates</th>
                  <th className="px-5 py-3.5">Travelers</th>
                  <th className="px-5 py-3.5">Budget</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filteredTrips.map((trip) => (
                  <tr
                    key={trip.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                    onClick={() => navigate(`/trips/${trip.id}`)}
                  >
                    <td className="px-5 py-3.5 font-semibold text-slate-900 dark:text-slate-100">
                      {trip.title}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center space-x-1.5">
                        <MapPin className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                        <span>{trip.destination}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {trip.startDate} → {trip.endDate}
                    </td>
                    <td className="px-5 py-3.5">{trip.travelers} Person(s)</td>
                    <td className="px-5 py-3.5 font-medium">
                      {trip.currency} {trip.budget.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5">{getStatusBadge(trip.status)}</td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/trips/${trip.id}`);
                        }}
                      >
                        View
                      </Button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setTripToDelete(trip);
                        }}
                        title="Delete Trip"
                        className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors inline-flex items-center"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!tripToDelete}
        onClose={() => setTripToDelete(null)}
        title="Confirm Trip Deletion"
      >
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Are you sure you want to delete <strong className="text-slate-900 dark:text-white">{tripToDelete?.title}</strong>? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setTripToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={deleteMutation.isPending}
              onClick={() => tripToDelete && deleteMutation.mutate(tripToDelete.id)}
            >
              Delete Trip
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};
