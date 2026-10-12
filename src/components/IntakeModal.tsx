import React, { useState, useEffect } from 'react';
import { X, Sparkles, Calendar, Heart, Compass, CheckCircle2, ArrowRight, User, Users, Briefcase } from 'lucide-react';
import { IntakeSurvey, UserProfile } from '../types';
import { calculateLifePath } from '../utils/numerology';

interface IntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, birthDate: string, survey: IntakeSurvey, relationship?: UserProfile['relationship']) => void;
  initialProfile?: UserProfile | null;
  mode?: 'create' | 'edit';
}

export const IntakeModal: React.FC<IntakeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialProfile,
  mode = 'create',
}) => {
  // Fresh, completely blank input fields by default as requested by user!
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [relationship, setRelationship] = useState<UserProfile['relationship']>('self');
  const [step, setStep] = useState<1 | 2>(1);

  const [focusArea, setFocusArea] = useState<IntakeSurvey['focusArea']>('spiritual');
  const [energyLevel, setEnergyLevel] = useState<IntakeSurvey['energyLevel']>('balanced');
  const [currentChallenge, setCurrentChallenge] = useState('');
  const [intention, setIntention] = useState('');

  // Sync when editing an existing profile
  useEffect(() => {
    if (isOpen) {
      if (initialProfile && mode === 'edit') {
        setName(initialProfile.name || '');
        setBirthDate(initialProfile.birthDate || '');
        setRelationship(initialProfile.relationship || 'self');
        if (initialProfile.primaryFocus) setFocusArea(initialProfile.primaryFocus as any);
        if (initialProfile.currentMood) setEnergyLevel(initialProfile.currentMood as any);
        if (initialProfile.notes) setIntention(initialProfile.notes);
      } else {
        // Completely blank for new profile creation
        setName('');
        setBirthDate('');
        setRelationship('self');
        setCurrentChallenge('');
        setIntention('');
        setStep(1);
      }
    }
  }, [isOpen, initialProfile, mode]);

  if (!isOpen) return null;

  // Live calculation preview only when valid date entered
  const hasValidDate = birthDate.trim().length >= 8;
  const trace = hasValidDate ? calculateLifePath(birthDate) : null;

  const handleDateChange = (val: string) => {
    setBirthDate(val);
  };

  const handleNativeDateSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      // Convert YYYY-MM-DD to MM/DD/YYYY
      const [y, m, d] = e.target.value.split('-');
      if (y && m && d) {
        setBirthDate(`${m}/${d}/${y}`);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthDate.trim()) {
      alert('Please enter a birth date to calculate your Life Path.');
      return;
    }

    onSubmit(
      name.trim() || 'Honored Soul',
      birthDate.trim(),
      {
        focusArea,
        energyLevel,
        currentChallenge: currentChallenge.trim() || 'Cultivating spiritual alignment and focus',
        intention: intention.trim() || 'To align daily actions with my highest purpose',
      },
      relationship
    );
    onClose();
  };

  return (
    <div
      id="intake-wizard-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-md overflow-y-auto animate-fade-in"
    >
      <div
        id="intake-wizard-dialog"
        className="relative w-full max-w-lg bg-white dark:bg-[#1E1C19] border border-[#EAE3D9] dark:border-[#38332D] rounded-[28px] sm:rounded-[36px] shadow-2xl text-[#2C2723] dark:text-[#F5F2EC] overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="bg-[#FAF7F2] dark:bg-[#141311] px-5 sm:px-6 py-4 border-b border-[#EAE3D9] dark:border-[#38332D] flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-[#C87A5E] flex items-center justify-center text-white shrink-0 shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-serif font-bold text-[#2C2723] dark:text-[#F5F2EC] truncate">
                {mode === 'edit' ? 'Update Soul Profile' : 'New Soul Profile Setup'}
              </h2>
              <p className="text-[11px] text-[#7A7369] dark:text-[#A69E92]">
                {step === 1 ? 'Step 1 of 2: Birth Code & Identity' : 'Step 2 of 2: Intentions & Alignment'}
              </p>
            </div>
          </div>
          {/* Allow close if there is already an existing active profile */}
          {initialProfile && (
            <button
              onClick={onClose}
              className="text-[#7A7369] hover:text-[#2C2723] dark:hover:text-white p-1.5 rounded-xl hover:bg-[#EAE3D9]/50 transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1">
          {step === 1 ? (
            <div className="space-y-4 sm:space-y-5">
              {/* Profile Relation Category */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7A7369] dark:text-[#A69E92]">
                  Who is this profile for?
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                  {[
                    { id: 'self', label: 'Myself', icon: User },
                    { id: 'partner', label: 'Partner', icon: Heart },
                    { id: 'child', label: 'Child', icon: Sparkles },
                    { id: 'family', label: 'Friend', icon: Users },
                    { id: 'client', label: 'Client', icon: Briefcase },
                  ].map((rel) => {
                    const Icon = rel.icon;
                    const isSelected = relationship === rel.id;
                    return (
                      <button
                        type="button"
                        key={rel.id}
                        onClick={() => setRelationship(rel.id as any)}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all ${
                          isSelected
                            ? 'bg-[#C87A5E]/15 border-[#C87A5E] text-[#C87A5E] font-bold shadow-xs'
                            : 'bg-[#FAF7F2] dark:bg-[#25221E] border-[#EAE3D9] dark:border-[#38332D] text-[#7A7369] dark:text-[#A69E92] hover:border-amber-300'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 mb-1" />
                        <span className="text-[10px] truncate w-full">{rel.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Blank Name input */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7A7369] dark:text-[#A69E92]">
                  Full Name or Nickname *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Elena Vance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#FAF7F2] dark:bg-[#141311] border border-[#EAE3D9] dark:border-[#38332D] rounded-xl px-3.5 py-2.5 text-sm text-[#2C2723] dark:text-[#F5F2EC] placeholder-[#A69E92] focus:outline-none focus:border-[#C87A5E] transition-colors"
                />
              </div>

              {/* Blank Birth Date Input with Calendar helper */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7A7369] dark:text-[#A69E92]">
                    Date of Birth (MM/DD/YYYY) *
                  </label>
                  <label className="text-[10px] text-[#C87A5E] font-bold cursor-pointer hover:underline flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Pick on Calendar</span>
                    <input
                      type="date"
                      onChange={handleNativeDateSelect}
                      className="sr-only"
                    />
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="MM/DD/YYYY (e.g. 04/18/1992)"
                    value={birthDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="w-full bg-[#FAF7F2] dark:bg-[#141311] border border-[#EAE3D9] dark:border-[#38332D] rounded-xl px-3.5 py-2.5 text-sm text-[#2C2723] dark:text-[#F5F2EC] placeholder-[#A69E92] focus:outline-none focus:border-[#C87A5E] transition-colors pr-10"
                  />
                  <Calendar className="w-4 h-4 text-[#C87A5E] absolute right-3.5 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Live Numerology Preview Card when date is entered */}
              {trace ? (
                <div className="bg-[#FAF7F2] dark:bg-[#141311] border border-[#EAE3D9] dark:border-[#38332D] rounded-2xl p-3.5 space-y-2.5 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase text-[#5E7E6B] tracking-wider">
                      Calculation Breakdown
                    </span>
                    <span className="text-[11px] bg-[#5E7E6B] text-white px-2.5 py-0.5 rounded-full font-bold font-serif shadow-xs">
                      Life Path #{trace.finalLifePath}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-white dark:bg-[#1E1C19] p-2 rounded-xl border border-[#EAE3D9] dark:border-[#38332D]">
                      <span className="block text-[#7A7369] text-[10px]">Month ({trace.month})</span>
                      <span className="text-[#C87A5E] font-bold text-xs">→ {trace.monthReduced}</span>
                    </div>
                    <div className="bg-white dark:bg-[#1E1C19] p-2 rounded-xl border border-[#EAE3D9] dark:border-[#38332D]">
                      <span className="block text-[#7A7369] text-[10px]">Day ({trace.day})</span>
                      <span className="text-[#C87A5E] font-bold text-xs">→ {trace.dayReduced}</span>
                    </div>
                    <div className="bg-white dark:bg-[#1E1C19] p-2 rounded-xl border border-[#EAE3D9] dark:border-[#38332D]">
                      <span className="block text-[#7A7369] text-[10px]">Year ({trace.year})</span>
                      <span className="text-[#C87A5E] font-bold text-xs">→ {trace.yearReduced}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#7A7369] dark:text-[#A69E92] leading-relaxed border-t border-[#EAE3D9] dark:border-[#38332D] pt-1.5">
                    {trace.explanation}
                  </p>
                </div>
              ) : (
                <div className="p-3 rounded-2xl border border-dashed border-[#EAE3D9] dark:border-[#38332D] text-center text-xs text-[#A69E92]">
                  Enter birth date to view your real-time mathematical reduction trace.
                </div>
              )}

              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!name.trim() || !birthDate.trim()}
                className="w-full py-3 rounded-xl bg-[#2C2723] dark:bg-[#F5F2EC] text-white dark:text-[#2C2723] font-bold text-xs uppercase tracking-wider hover:opacity-90 disabled:opacity-40 transition-opacity flex items-center justify-center space-x-1.5 shadow-md"
              >
                <span>Next: Soul Intentions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-5 animate-fade-in">
              {/* Primary Focus Selector */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7A7369] dark:text-[#A69E92]">
                  Primary Focus Area
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'career', label: 'Career & Legacy', emoji: '💼' },
                    { id: 'relationships', label: 'Love & Partnership', emoji: '💖' },
                    { id: 'spiritual', label: 'Soul Purpose', emoji: '🔮' },
                    { id: 'wellness', label: 'Health & Vitality', emoji: '🌿' },
                    { id: 'abundance', label: 'Wealth & Power', emoji: '🪙' },
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setFocusArea(item.id as any)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                        focusArea === item.id
                          ? 'border-[#C87A5E] bg-[#C87A5E]/10 font-bold text-[#C87A5E]'
                          : 'border-[#EAE3D9] dark:border-[#38332D] bg-[#FAF7F2] dark:bg-[#141311] text-[#7A7369] dark:text-[#A69E92] hover:border-amber-300'
                      }`}
                    >
                      <span className="block text-base">{item.emoji}</span>
                      <span className="block mt-0.5 truncate">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Energy State */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7A7369] dark:text-[#A69E92]">
                  Current Energy Resonance
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'high', label: 'High Vitality', desc: 'Ready for major expansion' },
                    { id: 'balanced', label: 'Centered & Grounded', desc: 'Sustaining peaceful rhythm' },
                    { id: 'seeking_clarity', label: 'Seeking Direction', desc: 'At an important crossroads' },
                    { id: 'transformational', label: 'Major Transition', desc: 'Shedding an old life chapter' },
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setEnergyLevel(item.id as any)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                        energyLevel === item.id
                          ? 'border-[#5E7E6B] bg-[#5E7E6B]/10 font-bold text-[#5E7E6B]'
                          : 'border-[#EAE3D9] dark:border-[#38332D] bg-[#FAF7F2] dark:bg-[#141311] text-[#7A7369] dark:text-[#A69E92] hover:border-emerald-300'
                      }`}
                    >
                      <span className="block font-bold">{item.label}</span>
                      <span className="block text-[10px] text-[#A69E92] truncate">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Blank Intention input with quick inspiration chips */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7A7369] dark:text-[#A69E92]">
                  Personal Cosmic Intention (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. To attract prosperity and authentic connection..."
                  value={intention}
                  onChange={(e) => setIntention(e.target.value)}
                  className="w-full bg-[#FAF7F2] dark:bg-[#141311] border border-[#EAE3D9] dark:border-[#38332D] rounded-xl px-3.5 py-2.5 text-xs text-[#2C2723] dark:text-[#F5F2EC] placeholder-[#A69E92] focus:outline-none focus:border-[#C87A5E]"
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    'Peace & Clarity',
                    'Abundance & Mastery',
                    'Soulful Romance',
                    'Creative Freedom',
                    'Career Leap',
                  ].map((chip) => (
                    <button
                      type="button"
                      key={chip}
                      onClick={() => setIntention(chip)}
                      className="px-2 py-0.5 rounded-full bg-[#FAF7F2] dark:bg-[#141311] border border-[#EAE3D9] dark:border-[#38332D] text-[10px] text-[#7A7369] dark:text-[#A69E92] hover:border-[#C87A5E]"
                    >
                      + {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-3 rounded-xl border border-[#EAE3D9] dark:border-[#38332D] text-xs font-bold text-[#7A7369] hover:bg-[#FAF7F2] transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#C87A5E] to-amber-600 hover:from-[#B86C52] hover:to-amber-700 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center space-x-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Reveal Cosmic Life Path</span>
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
