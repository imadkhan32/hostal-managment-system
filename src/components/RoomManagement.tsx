import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Room, RoomStatus, RoomType, Bed } from '../types';
import { THEME_CONFIG } from '../utils/theme';
import {
  BedDouble,
  Search,
  Filter,
  CheckCircle,
  Sparkles,
  Wrench,
  Ban,
  Plus,
  Building2,
  Layers,
  User,
  Users,
  Shield,
  Tag,
  Check,
} from 'lucide-react';

export const RoomManagement: React.FC = () => {
  const { rooms, setRooms, t, themeAccent, setOpenNewBookingModal, currentUser } = useApp();
  const theme = THEME_CONFIG[themeAccent];

  // Filters
  const [search, setSearch] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState<string>('all');
  const [selectedFloor, setSelectedFloor] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedRoomForInspect, setSelectedRoomForInspect] = useState<Room | null>(null);

  // Buildings list
  const buildings = Array.from(new Set(rooms.map((r) => r.building)));
  const floors = Array.from(new Set(rooms.map((r) => r.floor))).sort();

  const filteredRooms = rooms.filter((room) => {
    const matchSearch =
      room.number.toLowerCase().includes(search.toLowerCase()) ||
      room.description.toLowerCase().includes(search.toLowerCase()) ||
      room.beds.some((b) => b.studentName?.toLowerCase().includes(search.toLowerCase()));

    const matchBuilding = selectedBuilding === 'all' || room.building === selectedBuilding;
    const matchFloor = selectedFloor === 'all' || String(room.floor) === selectedFloor;
    const matchType = selectedType === 'all' || room.type === selectedType;
    const matchStatus = selectedStatus === 'all' || room.status === selectedStatus;

    return matchSearch && matchBuilding && matchFloor && matchType && matchStatus;
  });

  const updateRoomStatus = (roomId: string, newStatus: RoomStatus) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id === roomId) {
          return {
            ...r,
            status: newStatus,
            lastCleaned: newStatus === 'available' ? new Date().toISOString().split('T')[0] : r.lastCleaned,
          };
        }
        return r;
      })
    );
  };

  const getStatusBadge = (status: RoomStatus) => {
    switch (status) {
      case 'available':
        return {
          label: 'Available',
          badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300',
          dot: 'bg-emerald-500',
        };
      case 'occupied':
        return {
          label: 'Occupied',
          badge: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300',
          dot: 'bg-blue-500',
        };
      case 'cleaning':
        return {
          label: 'Housekeeping',
          badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300',
          dot: 'bg-amber-500',
        };
      case 'maintenance':
        return {
          label: 'Repair / Maintenance',
          badge: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300',
          dot: 'bg-rose-500',
        };
      default:
        return {
          label: status,
          badge: 'bg-slate-100 text-slate-800 border-slate-300',
          dot: 'bg-slate-500',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Rooms & Bed Allocation Grid
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time visual map of all hostel rooms, individual bed allocations, housekeeping status, and student residents.
          </p>
        </div>

        <button
          onClick={() => setOpenNewBookingModal(true)}
          className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-white text-xs font-bold ${theme.primary} ${theme.primaryHover} shadow-sm transition`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Allocate Bed / Book Room</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 rtl:left-auto rtl:right-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search room (e.g. A-101, B-301) or resident..."
              className="w-full pl-9 pr-3 rtl:pl-3 rtl:pr-9 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Building Filter */}
          <div>
            <select
              value={selectedBuilding}
              onChange={(e) => setSelectedBuilding(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="all">All Campus Blocks</option>
              {buildings.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Floor Filter */}
          <div>
            <select
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="all">All Floors</option>
              {floors.map((fl) => (
                <option key={fl} value={String(fl)}>
                  Floor {fl}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="all">All Room Types</option>
              <option value="single">Single Studio</option>
              <option value="double">Double Sharing</option>
              <option value="dorm-4">4-Bed Dorm</option>
              <option value="dorm-6">6-Bed Dorm</option>
              <option value="suite">Executive Suite</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="available">Available Rooms</option>
              <option value="occupied">Occupied</option>
              <option value="cleaning">Under Housekeeping</option>
              <option value="maintenance">Under Repair</option>
            </select>
          </div>
        </div>

        {/* Quick status counters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
          <span>Results: <strong>{filteredRooms.length}</strong> rooms</span>
          <span className="text-slate-300">•</span>
          <span className="text-emerald-600 font-semibold">
            {rooms.filter((r) => r.status === 'available').length} Available
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-blue-600 font-semibold">
            {rooms.filter((r) => r.status === 'occupied').length} Fully Occupied
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-amber-600 font-semibold">
            {rooms.filter((r) => r.status === 'cleaning').length} Cleaning
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-rose-600 font-semibold">
            {rooms.filter((r) => r.status === 'maintenance').length} Maintenance
          </span>
        </div>
      </div>

      {/* Room Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredRooms.map((room) => {
          const statusConfig = getStatusBadge(room.status);
          const availableBeds = room.totalBeds - room.occupiedBeds;

          return (
            <div
              key={room.id}
              className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                {/* Top Row: Room number, building & status */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-black text-slate-900 dark:text-white">
                        {room.number}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        Floor {room.floor}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {room.gender === 'all' ? 'Co-ed' : `${room.gender} only`}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {room.building}
                    </p>
                  </div>

                  <span
                    className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${statusConfig.badge}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${statusConfig.dot}`} />
                    <span>{statusConfig.label}</span>
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">
                  {room.description}
                </p>

                {/* Bed Allocation Slots Graphic */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    <span className="flex items-center space-x-1">
                      <BedDouble className="w-3.5 h-3.5 text-slate-400" />
                      <span>Bed Slots ({room.occupiedBeds}/{room.totalBeds} Occupied)</span>
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      ${room.pricePerSemester}/sem
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {room.beds.map((bed) => {
                      const isOccupied = bed.status === 'occupied';
                      return (
                        <div
                          key={bed.id}
                          className={`p-2 rounded-xl border text-xs transition ${
                            isOccupied
                              ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/40 text-blue-950 dark:text-blue-200'
                              : 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/40 text-emerald-950 dark:text-emerald-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[11px]">{bed.bedNumber}</span>
                            <span
                              className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded ${
                                isOccupied ? 'bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-300' : 'bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300'
                              }`}
                            >
                              {bed.status}
                            </span>
                          </div>
                          {isOccupied ? (
                            <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 truncate mt-1 flex items-center space-x-1">
                              <User className="w-3 h-3 text-blue-500 shrink-0" />
                              <span className="truncate">{bed.studentName}</span>
                            </p>
                          ) : (
                            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                              Vacant • Ready
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Amenities pills */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {room.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Action Bar */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                {/* Staff room state fast switcher */}
                {currentUser.role !== 'student' && (
                  <div className="flex items-center space-x-1 text-xs">
                    {room.status !== 'available' && (
                      <button
                        type="button"
                        onClick={() => updateRoomStatus(room.id, 'available')}
                        className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 hover:bg-emerald-100 hover:text-emerald-700 text-slate-600 text-[10px] font-bold"
                        title="Mark Ready & Inspected"
                      >
                        ✓ Ready
                      </button>
                    )}
                    {room.status !== 'cleaning' && (
                      <button
                        type="button"
                        onClick={() => updateRoomStatus(room.id, 'cleaning')}
                        className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 hover:bg-amber-100 hover:text-amber-700 text-slate-600 text-[10px] font-bold"
                        title="Mark for Housekeeping"
                      >
                        Clean
                      </button>
                    )}
                    {room.status !== 'maintenance' && (
                      <button
                        type="button"
                        onClick={() => updateRoomStatus(room.id, 'maintenance')}
                        className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 hover:bg-rose-100 hover:text-rose-700 text-slate-600 text-[10px] font-bold"
                        title="Flag for Maintenance"
                      >
                        Repair
                      </button>
                    )}
                  </div>
                )}

                {/* Allocate / Reserve button */}
                <button
                  type="button"
                  onClick={() => setOpenNewBookingModal(true)}
                  disabled={availableBeds === 0}
                  className={`ml-auto px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1 ${
                    availableBeds > 0
                      ? `${theme.primary} text-white ${theme.primaryHover}`
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{availableBeds > 0 ? `Book (${availableBeds} left)` : 'Room Full'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
