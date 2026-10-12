import React, { useState, useEffect } from 'react';
import { CheckSquare, Plus, Flame, Sparkles, Trash2, Trophy, Award, Calendar, CheckCircle } from 'lucide-react';
import { Habit, UserProfile } from '../types';
import { LIFE_PATH_DETAILS } from '../utils/numerology';
import { LifePathArtworkCard } from './LifePathArtworkCard';

interface HabitTrackerProps {
  userProfile: UserProfile | null;
  onOpenIntake: () => void;
  onClaimReward?: (points: number, reason: string) => void;
}

const STORAGE_KEY = 'cosmic_path_habits_v1';

export const HabitTracker: React.FC<HabitTrackerProps> = ({ userProfile, onOpenIntake, onClaimReward }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<Habit['category']>('mindfulness');
  const [showAddModal, setShowAddModal] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  // Load saved habits or populate presets for life path
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setHabits(JSON.parse(stored));
        return;
      } catch (e) {
        console.error('Failed to parse habits', e);
      }
    }

    // Populate Life Path presets if profile exists
    if (userProfile?.lifePathNumber) {
      const detail = LIFE_PATH_DETAILS[userProfile.lifePathNumber] || LIFE_PATH_DETAILS[1];
      const presets: Habit[] = detail.recommendedHabits.map((item, idx) => ({
        id: `preset_${userProfile.lifePathNumber}_${idx}`,
        profileId: userProfile.id,
        title: item.title,
        description: item.description,
        lifePathTarget: userProfile.lifePathNumber,
        frequency: 'daily',
        completedDates: [],
        streakCount: 0,
        category: item.category,
      }));
      setHabits(presets);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
    }
  }, [userProfile?.lifePathNumber]);

  // Save changes
  const saveHabits = (updated: Habit[]) => {
    setHabits(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleToggleHabit = (id: string) => {
    let checkedTitle = '';
    let isNewlyCompleted = false;

    const updated = habits.map((h) => {
      if (h.id !== id) return h;
      const isCompletedToday = h.completedDates.includes(todayStr);

      let nextCompleted = [...h.completedDates];
      let nextStreak = h.streakCount;

      if (isCompletedToday) {
        // Uncheck
        nextCompleted = nextCompleted.filter((d) => d !== todayStr);
        nextStreak = Math.max(0, nextStreak - 1);
      } else {
        // Check
        nextCompleted.push(todayStr);
        nextStreak += 1;
        isNewlyCompleted = true;
        checkedTitle = h.title;
      }

      return {
        ...h,
        completedDates: nextCompleted,
        streakCount: nextStreak,
      };
    });
    saveHabits(updated);

    if (isNewlyCompleted && onClaimReward) {
      onClaimReward(15, `Completed Habit: ${checkedTitle}`);
    }
  };

  const handleAddCustomHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newHabit: Habit = {
      id: `custom_${Date.now()}`,
      profileId: userProfile?.id || 'guest',
      title: newTitle.trim(),
      description: newDesc.trim() || 'Custom Life Path ritual',
      lifePathTarget: userProfile?.lifePathNumber || 1,
      frequency: 'daily',
      completedDates: [],
      streakCount: 0,
      category: newCategory,
    };

    saveHabits([...habits, newHabit]);
    setNewTitle('');
    setNewDesc('');
    setShowAddModal(false);
  };

  const handleDeleteHabit = (id: string) => {
    saveHabits(habits.filter((h) => h.id !== id));
  };

  // Calculate completion statistics
  const completedTodayCount = habits.filter((h) => h.completedDates.includes(todayStr)).length;
  const alignmentRate = habits.length > 0 ? Math.round((completedTodayCount / habits.length) * 100) : 0;
  const maxStreak = habits.reduce((max, h) => Math.max(max, h.streakCount), 0);

  if (!userProfile) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-6 text-center bg-white dark:bg-[#1E1C19] border border-[#EAE3D9] dark:border-[#342F2A] rounded-[32px] shadow-sm space-y-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#5E7E6B]/15 text-[#5E7E6B] flex items-center justify-center">
          <CheckSquare className="w-7 h-7 animate-bounce" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-[#2C2723] dark:text-[#F5F2EC]">Personalized Habit & Ritual Tracker</h2>
        <p className="text-xs text-[#7A7369] dark:text-[#A69E92] max-w-md mx-auto">
          Calculate your Birth Path to unlock habit rituals, daily streaks, and vibrational alignment tailored to your core number.
        </p>
        <button
          onClick={onOpenIntake}
          className="bg-[#5E7E6B] hover:bg-[#4E6B5A] text-white font-bold px-6 py-3 rounded-2xl text-xs uppercase tracking-wider shadow-md transition-all inline-flex items-center space-x-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Calculate Birth Path First</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-4 space-y-6">
      {/* Compact Life Path Artwork Motivation Banner */}
      {userProfile?.lifePathNumber && (
        <LifePathArtworkCard
          lifePathNumber={userProfile.lifePathNumber}
          userProfile={userProfile}
          compact
        />
      )}

      {/* Header Banner */}
      <div className="bg-white dark:bg-[#2D2A26] border border-[#F0EBE5] dark:border-[#3D3A35] rounded-[24px] sm:rounded-[32px] p-4 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#7D8E7A] bg-[#7D8E7A]/10 px-3 py-1 rounded-full border border-[#7D8E7A]/20">
              Life Path #{userProfile.lifePathNumber} Rituals
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#4A4741] dark:text-[#F8F5F2] mt-2.5 break-words">
            Cosmic Habits & Daily Rituals
          </h2>
          <p className="text-xs sm:text-sm text-[#6B665E] dark:text-[#A39E93] mt-1 font-medium break-words">
            Build high-vibration daily routines tailored to strengthen your Life Path core superpowers.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-[#7D8E7A] hover:bg-[#6c7d69] text-white font-bold px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-xs uppercase tracking-wider shadow-md shadow-[#7D8E7A]/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Ritual</span>
        </button>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
        <div className="bg-white dark:bg-[#2D2A26] border border-[#F0EBE5] dark:border-[#3D3A35] rounded-[20px] sm:rounded-[24px] p-4 sm:p-5 flex items-center space-x-4 shadow-sm">
          <div className="p-3 sm:p-3.5 rounded-2xl bg-[#7D8E7A]/15 text-[#7D8E7A] shrink-0">
            <CheckSquare className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#8C867C] block truncate">Today's Completed</span>
            <div className="text-xl sm:text-2xl font-serif italic font-bold text-[#7D8E7A]">
              {completedTodayCount} / {habits.length}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#2D2A26] border border-[#F0EBE5] dark:border-[#3D3A35] rounded-[20px] sm:rounded-[24px] p-4 sm:p-5 flex items-center space-x-4 shadow-sm">
          <div className="p-3 sm:p-3.5 rounded-2xl bg-[#C8826D]/15 text-[#C8826D] shrink-0">
            <Flame className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#8C867C] block truncate">Top Streak</span>
            <div className="text-xl sm:text-2xl font-serif italic font-bold text-[#C8826D]">{maxStreak} Days</div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#2D2A26] border border-[#F0EBE5] dark:border-[#3D3A35] rounded-[20px] sm:rounded-[24px] p-4 sm:p-5 flex items-center space-x-4 shadow-sm">
          <div className="p-3 sm:p-3.5 rounded-2xl bg-[#E0D4C3]/40 text-[#4A4741] shrink-0">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[#C8826D]" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#8C867C] block truncate">Alignment Rate</span>
            <div className="text-xl sm:text-2xl font-serif italic font-bold text-[#4A4741] dark:text-[#F8F5F2]">{alignmentRate}%</div>
          </div>
        </div>
      </div>

      {/* Inspirational Quick Add Preset Rituals Bar */}
      <div className="bg-[#F8F5F2] dark:bg-[#252320] border border-[#E0D4C3] dark:border-[#3D3A35] rounded-[24px] p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#C8826D] flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-[#C8826D]" />
            <span>Need Inspiration? Quick-Add High-Vibration Rituals:</span>
          </span>
          <span className="text-[10px] text-[#8C867C]">Tap + to add instantly</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { title: '5-Min Morning Breathwork', category: 'mindfulness', desc: '5 minutes of box breathing to anchor focus' },
            { title: 'Gratitude & Wins Journal', category: 'mindfulness', desc: 'Write 3 things you are grateful for today' },
            { title: 'Hydration Alignment', category: 'physical', desc: 'Drink a glass of water with positive intention' },
            { title: 'Evening Screen Detox', category: 'mindfulness', desc: 'Unplug devices 30 minutes before rest' },
            { title: 'Sunlight Movement Walk', category: 'physical', desc: '15 minutes of outdoor walking under natural sun' },
            { title: 'Life Path Affirmation Read', category: 'spiritual', desc: 'Recite your core Life Path affirmation aloud' },
          ].map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                const newH: Habit = {
                  id: `preset_${Date.now()}_${idx}`,
                  profileId: userProfile.id,
                  title: preset.title,
                  description: preset.desc,
                  category: preset.category as any,
                  frequency: 'daily',
                  completedDates: [],
                  streakCount: 0,
                  lifePathTarget: userProfile.lifePathNumber,
                };
                setHabits((prev) => [newH, ...prev]);
              }}
              className="bg-white dark:bg-[#2D2A26] hover:bg-[#7D8E7A] hover:text-white text-[#4A4741] dark:text-[#F8F5F2] border border-[#F0EBE5] dark:border-[#3D3A35] px-3.5 py-2 rounded-2xl text-xs font-medium transition-all flex items-center space-x-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{preset.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Habits List */}
      <div className="space-y-3">
        {habits.length === 0 ? (
          <div className="bg-white dark:bg-[#2D2A26] border border-[#F0EBE5] dark:border-[#3D3A35] rounded-[24px] p-8 text-center text-[#8C867C] space-y-2">
            <p>No habits added yet. Click "Add Custom Ritual" to start building your routine!</p>
          </div>
        ) : (
          habits.map((habit) => {
            const isDone = habit.completedDates.includes(todayStr);
            return (
              <div
                key={habit.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl sm:rounded-[24px] border transition-all ${
                  isDone
                    ? 'bg-[#7D8E7A]/10 border-[#7D8E7A]/30 text-[#3D3A35] dark:text-[#F8F5F2]'
                    : 'bg-white dark:bg-[#2D2A26] border-[#F0EBE5] dark:border-[#3D3A35] text-[#3D3A35] dark:text-[#F8F5F2] hover:border-[#E0D4C3]'
                }`}
              >
                <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                  <button
                    onClick={() => handleToggleHabit(habit.id)}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-all shrink-0 mt-0.5 sm:mt-0 ${
                      isDone
                        ? 'bg-[#7D8E7A] text-white border-[#7D8E7A]'
                        : 'border-[#E0D4C3] dark:border-[#3D3A35] bg-[#F8F5F2] dark:bg-[#252320] hover:border-[#C8826D]'
                    }`}
                  >
                    {isDone && <CheckSquare className="w-5 h-5" />}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <h4 className={`text-sm sm:text-base font-semibold break-words ${isDone ? 'line-through text-[#8C867C]' : 'text-[#4A4741] dark:text-[#F8F5F2]'}`}>
                        {habit.title}
                      </h4>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#E0D4C3]/40 text-[#C8826D]">
                        {habit.category}
                      </span>
                    </div>
                    <p className="text-xs text-[#6B665E] dark:text-[#A39E93] mt-0.5 break-words">{habit.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end space-x-3 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-[#F0EBE5] dark:border-[#3D3A35]">
                  <div className="flex items-center space-x-1 text-xs font-serif italic text-[#C8826D] bg-[#C8826D]/10 px-2.5 sm:px-3 py-1 rounded-full border border-[#C8826D]/20 font-bold">
                    <Flame className="w-3.5 h-3.5 text-[#C8826D]" />
                    <span>{habit.streakCount}d streak</span>
                  </div>

                  <button
                    onClick={() => handleDeleteHabit(habit.id)}
                    className="text-[#8C867C] hover:text-rose-500 p-1.5 rounded-xl transition-colors"
                    title="Delete Habit"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Custom Habit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-md bg-white dark:bg-[#2D2A26] border border-[#F0EBE5] dark:border-[#3D3A35] rounded-[24px] sm:rounded-[32px] p-4 sm:p-8 space-y-4 sm:space-y-5 shadow-xl text-[#3D3A35] dark:text-[#F8F5F2] my-4 sm:my-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-serif font-bold text-[#4A4741] dark:text-[#F8F5F2]">Add Life Path Ritual</h3>

            <form onSubmit={handleAddCustomHabit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[#4A4741] dark:text-[#E0D4C3] mb-1">Ritual Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 10-Min Evening Gratitude Meditation"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#F8F5F2] dark:bg-[#252320] border border-[#E0D4C3] dark:border-[#3D3A35] rounded-2xl px-4 py-3 text-sm text-[#3D3A35] dark:text-[#F8F5F2] focus:border-[#7D8E7A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#4A4741] dark:text-[#E0D4C3] mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Recite affirmational intentions before bed"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-[#F8F5F2] dark:bg-[#252320] border border-[#E0D4C3] dark:border-[#3D3A35] rounded-2xl px-4 py-3 text-sm text-[#3D3A35] dark:text-[#F8F5F2] focus:border-[#7D8E7A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#4A4741] dark:text-[#E0D4C3] mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-[#F8F5F2] dark:bg-[#252320] border border-[#E0D4C3] dark:border-[#3D3A35] rounded-2xl px-4 py-3 text-sm text-[#3D3A35] dark:text-[#F8F5F2] focus:border-[#7D8E7A]"
                >
                  <option value="mindfulness">Mindfulness 🧘‍♂️</option>
                  <option value="physical">Physical Vitality 🏃‍♂️</option>
                  <option value="creative">Creative Expression 🎨</option>
                  <option value="purpose">Purpose & Legacy 🎯</option>
                  <option value="relationships">Heart Connection 💖</option>
                </select>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 bg-[#F8F5F2] dark:bg-[#35322D] text-[#4A4741] dark:text-[#F8F5F2] py-3 rounded-2xl text-xs font-bold border border-[#E0D4C3] dark:border-[#3D3A35]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-[#7D8E7A] hover:bg-[#6c7d69] text-white py-3 rounded-2xl text-xs font-bold uppercase tracking-wider shadow"
                >
                  Save Ritual
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
