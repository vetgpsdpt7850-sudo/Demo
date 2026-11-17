import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { CAMBODIA_STOPS, estimateRoadDistanceKm } from '../utils/cambodiaLocations';
import { Language } from '../types/gps';
import { Search, ChevronDown, MapPin, Check, X, Building2 } from 'lucide-react';

interface VetBranchSelectProps {
  selectedId: string;
  onSelect: (branchId: string) => void;
  currentLat: number;
  currentLng: number;
  lang: Language;
  variant?: 'inline' | 'button';
}

export const VetBranchSelect: React.FC<VetBranchSelectProps> = ({
  selectedId,
  onSelect,
  currentLat,
  currentLng,
  lang,
  variant = 'inline'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [provinceFilter, setProvinceFilter] = useState<string>('all');
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);
  const [dropdownRect, setDropdownRect] = useState<{
    top: number;
    left: number;
    width: number;
    openUpward: boolean;
  } | null>(null);

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const selectedBranch =
    CAMBODIA_STOPS.find(b => b.id === selectedId) || CAMBODIA_STOPS[0];

  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    const desiredWidth = Math.min(390, viewportW - 24);

    // Align right edge with trigger if near right side, otherwise align left
    let left = rect.right - desiredWidth;
    if (left < 12) left = Math.max(12, rect.left);
    if (left + desiredWidth > viewportW - 12) {
      left = viewportW - desiredWidth - 12;
    }

    const spaceBelow = viewportH - rect.bottom;
    const openUpward = spaceBelow < 340 && rect.top > 340;
    const top = openUpward ? Math.max(12, rect.top - 340) : rect.bottom + 6;

    setDropdownRect({
      top,
      left,
      width: desiredWidth,
      openUpward
    });
  };

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      const focusTimer = requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
      const handleResizeOrScroll = () => updatePosition();
      window.addEventListener('resize', handleResizeOrScroll);
      window.addEventListener('scroll', handleResizeOrScroll, true);
      return () => {
        cancelAnimationFrame(focusTimer);
        window.removeEventListener('resize', handleResizeOrScroll);
        window.removeEventListener('scroll', handleResizeOrScroll, true);
      };
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  const filteredBranches = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return CAMBODIA_STOPS.filter(branch => {
      const matchesProvince =
        provinceFilter === 'all' ||
        branch.provinceKm.includes(provinceFilter) ||
        branch.provinceEn.toLowerCase().includes(provinceFilter.toLowerCase());

      if (!matchesProvince) return false;
      if (!q) return true;

      return (
        branch.nameKm.toLowerCase().includes(q) ||
        branch.nameEn.toLowerCase().includes(q) ||
        branch.capitalNameKm.toLowerCase().includes(q) ||
        branch.capitalNameEn.toLowerCase().includes(q) ||
        branch.provinceKm.toLowerCase().includes(q) ||
        branch.provinceEn.toLowerCase().includes(q) ||
        branch.highway.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, provinceFilter]);

  useEffect(() => {
    const idx = filteredBranches.findIndex(b => b.id === selectedId);
    setHighlightedIndex(idx >= 0 ? idx : 0);
  }, [filteredBranches, selectedId]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (filteredBranches.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => {
        const next = (prev + 1) % filteredBranches.length;
        const itemEl = listRef.current?.children[next] as HTMLElement | undefined;
        itemEl?.scrollIntoView({ block: 'nearest' });
        return next;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => {
        const next = (prev - 1 + filteredBranches.length) % filteredBranches.length;
        const itemEl = listRef.current?.children[next] as HTMLElement | undefined;
        itemEl?.scrollIntoView({ block: 'nearest' });
        return next;
      });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = filteredBranches[highlightedIndex];
      if (target) {
        onSelect(target.id);
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  const quickProvinces = [
    { key: 'all', labelKm: 'ទាំងអស់', labelEn: 'All' },
    { key: 'ភ្នំពេញ', labelKm: 'ភ្នំពេញ', labelEn: 'Phnom Penh' },
    { key: 'ព្រះសីហនុ', labelKm: 'ព្រះសីហនុ', labelEn: 'Sihanoukville' },
    { key: 'សៀមរាប', labelKm: 'សៀមរាប', labelEn: 'Siem Reap' },
    { key: 'បាត់ដំបង', labelKm: 'បាត់ដំបង', labelEn: 'Battambang' },
    { key: 'កំពត', labelKm: 'កំពត', labelEn: 'Kampot' },
    { key: 'កោះកុង', labelKm: 'កោះកុង', labelEn: 'Koh Kong' },
    { key: 'កំពង់ចាម', labelKm: 'កំពង់ចាម', labelEn: 'Kampong Cham' }
  ];

  return (
    <>
      {/* Smooth Interactive Trigger Button */}
      {variant === 'inline' ? (
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsOpen(prev => !prev)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border font-bold text-xs transition-all duration-150 cursor-pointer max-w-full group ${
            isOpen
              ? 'bg-cyan-500/25 border-cyan-400 text-white shadow-lg shadow-cyan-500/15'
              : 'bg-cyan-500/15 hover:bg-cyan-500/25 border-cyan-400/40 text-cyan-300'
          }`}
          title={lang === 'km' ? 'ចុចដើម្បីស្វែងរកសាខា វីរៈប៊ុនថាំ' : 'Search & select Vireak Buntham branch'}
        >
          <Search className="w-3 h-3 text-cyan-400 shrink-0" />
          <span className="truncate">
            {lang === 'km' ? selectedBranch.capitalNameKm : selectedBranch.capitalNameEn}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-cyan-400 shrink-0 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : 'group-hover:translate-y-0.5'
            }`}
          />
        </button>
      ) : (
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsOpen(prev => !prev)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all duration-150 cursor-pointer shrink-0 max-w-[235px] ${
            isOpen
              ? 'bg-slate-800 border-cyan-400 text-white shadow-lg shadow-cyan-500/15'
              : 'bg-slate-900/95 hover:bg-slate-800 border-cyan-500/40 text-cyan-300'
          }`}
        >
          <Search className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="truncate">
            {lang === 'km' ? selectedBranch.capitalNameKm : selectedBranch.capitalNameEn}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-cyan-400 shrink-0 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      )}

      {/* Anchored Floating Search + Dropdown Combobox via Portal */}
      {isOpen &&
        dropdownRect &&
        createPortal(
          <div
            className="fixed inset-0 z-[1400]"
            onClick={() => setIsOpen(false)}
          >
            <div
              style={{
                top: `${dropdownRect.top}px`,
                left: `${dropdownRect.left}px`,
                width: `${dropdownRect.width}px`
              }}
              className="fixed animate-dropdown-pop rounded-2xl bg-[#0b1222]/98 backdrop-blur-2xl border border-cyan-400/40 shadow-[0_24px_60px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col max-h-[340px]"
              onClick={e => e.stopPropagation()}
              onKeyDown={handleKeyDown}
            >
              {/* Compact Search Input Header */}
              <div className="p-2.5 border-b border-white/10 bg-slate-950/90 space-y-2">
                <div className="relative flex items-center">
                  <Search className="w-3.5 h-3.5 text-cyan-400 absolute left-3 pointer-events-none" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder={
                      lang === 'km'
                        ? 'ស្វែងរកសាខា វីរៈប៊ុនថាំ (ឧ. ព្រះសីហនុ, សៀមរាប, ជ្រោយចង្វារ)...'
                        : 'Search Vireak Buntham branch...'
                    }
                    className="w-full pl-8 pr-8 py-1.5 rounded-xl bg-slate-900/90 border border-cyan-500/35 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 select-text"
                  />
                  {searchQuery ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        inputRef.current?.focus();
                      }}
                      className="absolute right-2.5 text-slate-400 hover:text-white p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span className="absolute right-2.5 text-[10px] font-mono text-slate-500 pointer-events-none">
                      {filteredBranches.length}
                    </span>
                  )}
                </div>

                {/* Quick Filter Pills */}
                <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar">
                  {quickProvinces.map(p => (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => {
                        setProvinceFilter(p.key);
                        inputRef.current?.focus();
                      }}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                        provinceFilter === p.key
                          ? 'bg-cyan-400 text-slate-950 font-extrabold'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-white/10'
                      }`}
                    >
                      {lang === 'km' ? p.labelKm : p.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Smooth Scrollable Branch List */}
              <div
                ref={listRef}
                className="flex-1 overflow-y-auto p-1.5 space-y-1 overscroll-contain"
              >
                {filteredBranches.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    {lang === 'km'
                      ? 'មិនមានសាខាត្រូវនឹងការស្វែងរកទេ'
                      : 'No matching Vireak Buntham branch'}
                  </div>
                ) : (
                  filteredBranches.map((branch, idx) => {
                    const isSelected = branch.id === selectedId;
                    const isHighlighted = idx === highlightedIndex;
                    const distKm = estimateRoadDistanceKm(
                      currentLat,
                      currentLng,
                      branch.lat,
                      branch.lng
                    );

                    return (
                      <button
                        key={branch.id}
                        type="button"
                        onMouseEnter={() => setHighlightedIndex(idx)}
                        onClick={() => {
                          onSelect(branch.id);
                          setIsOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-2 rounded-xl transition-colors duration-100 flex items-center justify-between gap-2 cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-500/20 border border-cyan-400/50 text-white'
                            : isHighlighted
                            ? 'bg-white/10 border border-white/10 text-white'
                            : 'border border-transparent text-slate-200 hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div
                            className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                              isSelected
                                ? 'bg-cyan-400 text-slate-950'
                                : 'bg-slate-900 text-cyan-400 border border-white/10'
                            }`}
                          >
                            <Building2 className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-white truncate">
                              {lang === 'km' ? branch.capitalNameKm : branch.capitalNameEn}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate">
                              {lang === 'km' ? branch.provinceKm : branch.provinceEn} · {branch.highway}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-md border border-emerald-500/20">
                            {distKm} km
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
