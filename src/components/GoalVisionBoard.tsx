import React, { useState, useEffect } from 'react';
import { Target, Sparkles, Image as ImageIcon, Plus, CheckCircle2, Trash2, Wand2, BookOpen, Clock, Heart, Play, Eye, Lightbulb, ChevronRight, Check, Volume2, VolumeX, Pause, Square, Award, Radio, Loader2 } from 'lucide-react';
import { GoalVisionItem, UserProfile, AspectRatioOption } from '../types';
import { VISION_TEMPLATES, VISUAL_STYLES, INTENTION_THEMES, VisionTemplate } from '../data/visionTemplates';
import { LifePathArtworkCard } from './LifePathArtworkCard';
import {
  speakSoothingly,
  stopSoothingAudio,
  pauseSoothingAudio,
  resumeSoothingAudio,
  getSelectedVoiceId,
  CosmicVoiceId,
} from '../utils/speech';
import { VoiceSettingsModal } from './VoiceSettingsModal';

interface GoalVisionBoardProps {
  userProfile: UserProfile | null;
  onOpenIntake: () => void;
  onClaimReward?: (points: number, reason: string) => void;
}

const STORAGE_KEY = 'cosmic_path_goals_v1';

export const GoalVisionBoard: React.FC<GoalVisionBoardProps> = ({ userProfile, onOpenIntake, onClaimReward }) => {
  const [goals, setGoals] = useState<GoalVisionItem[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'conceiving' | 'in_progress' | 'manifested'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeMeditationGoal, setActiveMeditationGoal] = useState<GoalVisionItem | null>(null);

  // Audio Speech Narration for Guided Meditation
  const [isSpeakingMeditation, setIsSpeakingMeditation] = useState(false);
  const [isPausedMeditation, setIsPausedMeditation] = useState(false);
  const [isLoadingMeditationAudio, setIsLoadingMeditationAudio] = useState(false);
  const [meditationCompleted, setMeditationCompleted] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [activeVoiceId, setActiveVoiceId] = useState<CosmicVoiceId>(getSelectedVoiceId());

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<GoalVisionItem['category']>('career');
  const [timeline, setTimeline] = useState('Spring Equinox (90 Days)');
  const [affirmation, setAffirmation] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatioOption>('16:9');
  const [selectedStyleIndex, setSelectedStyleIndex] = useState(0);
  const [selectedThemeIndex, setSelectedThemeIndex] = useState(0);
  const [imagePrompt, setImagePrompt] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      stopSoothingAudio();
    };
  }, []);

  // Load saved goals
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setGoals(JSON.parse(stored));
        return;
      } catch (e) {
        console.error('Failed to parse goals', e);
      }
    }

    // Default sample goals from curated templates if fresh
    if (userProfile?.lifePathNumber) {
      const defaultGoals: GoalVisionItem[] = VISION_TEMPLATES.slice(0, 2).map((tmpl) => ({
        id: `goal_${tmpl.id}_${Date.now()}`,
        profileId: userProfile.id,
        title: tmpl.title,
        description: tmpl.description,
        category: tmpl.category,
        timeline: tmpl.timeline,
        aspectRatio: tmpl.aspectRatio,
        imageUrl: tmpl.imageUrl,
        status: 'in_progress',
        affirmation: tmpl.affirmation,
        guidedMeditation: tmpl.guidedMeditation,
        milestones: tmpl.milestones.map((mTitle, idx) => ({
          id: `m_${idx}`,
          title: mTitle,
          completed: idx === 0,
        })),
      }));
      setGoals(defaultGoals);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultGoals));
    }
  }, [userProfile?.lifePathNumber]);

  const saveGoals = (updated: GoalVisionItem[]) => {
    setGoals(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  // Import a template with 1-click
  const handleImportTemplate = (tmpl: VisionTemplate) => {
    const newGoal: GoalVisionItem = {
      id: `goal_imported_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      profileId: userProfile?.id || 'guest',
      title: tmpl.title,
      description: tmpl.description,
      category: tmpl.category,
      timeline: tmpl.timeline,
      aspectRatio: tmpl.aspectRatio,
      imageUrl: tmpl.imageUrl,
      status: 'in_progress',
      affirmation: tmpl.affirmation,
      guidedMeditation: tmpl.guidedMeditation,
      milestones: tmpl.milestones.map((mTitle, idx) => ({
        id: `m_imp_${Date.now()}_${idx}`,
        title: mTitle,
        completed: false,
      })),
    };

    saveGoals([newGoal, ...goals]);
  };

  const handleMixInspirationPrompt = () => {
    const styleObj = VISUAL_STYLES[selectedStyleIndex];
    const themeObj = INTENTION_THEMES[selectedThemeIndex];
    const baseSubject = title.trim() || 'A sacred high-vibration vision sanctuary';

    const fullPrompt = `${baseSubject}, ${styleObj.promptAdd}, ${themeObj.promptAdd}`;
    setImagePrompt(fullPrompt);
  };

  const handleGenerateAIImage = async () => {
    const promptToUse = imagePrompt.trim() || title.trim() || 'A sacred glowing cosmic vision of abundance and peace';
    setIsGeneratingImage(true);
    try {
      const res = await fetch('/api/vision/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToUse,
          aspectRatio,
        }),
      });

      const data = await res.json();
      if (data.imageUrl) {
        setGeneratedImageUrl(data.imageUrl);
      } else if (data.error) {
        alert(`Image Generation Note: ${data.error}`);
      }
    } catch (err) {
      console.error('Failed to generate image:', err);
      alert('Could not generate image at this moment.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newGoal: GoalVisionItem = {
      id: `goal_${Date.now()}`,
      profileId: userProfile?.id || 'guest',
      title: title.trim(),
      description: description.trim() || 'Focusing intention and sustaining high-vibration momentum.',
      category,
      timeline,
      aspectRatio,
      imageUrl: generatedImageUrl || VISION_TEMPLATES[0].imageUrl,
      status: 'in_progress',
      affirmation: affirmation.trim() || `I am fully aligned with Life Path #${userProfile?.lifePathNumber || 1} abundance.`,
      guidedMeditation: `Close your eyes. Take a deep breath in and out. Visualize yourself standing in complete alignment with your vision of "${title.trim()}". Feel the gratitude, clarity, and peace anchoring in your body now.`,
      milestones: [
        { id: `m_${Date.now()}_1`, title: 'Define core action steps', completed: false },
        { id: `m_${Date.now()}_2`, title: 'Establish daily alignment ritual', completed: false },
      ],
    };

    saveGoals([newGoal, ...goals]);
    // Reset Form
    setTitle('');
    setDescription('');
    setAffirmation('');
    setImagePrompt('');
    setGeneratedImageUrl('');
    setShowAddModal(false);
  };

  const handleAutoGenerateMilestones = (goalId: string) => {
    const updated = goals.map((g) => {
      if (g.id !== goalId) return g;
      const extraMilestones = [
        { id: `m_gen_${Date.now()}_1`, title: 'Clarify 3 key monthly priorities', completed: false },
        { id: `m_gen_${Date.now()}_2`, title: 'Align environment & remove friction', completed: false },
        { id: `m_gen_${Date.now()}_3`, title: 'Track weekly progress in ritual log', completed: false },
      ];
      return { ...g, milestones: [...g.milestones, ...extraMilestones] };
    });
    saveGoals(updated);
  };

  // Gemini AI Voice Handlers for Guided Meditation
  const handleStartVoiceMeditation = () => {
    if (!activeMeditationGoal) return;

    const textToRead = `${activeMeditationGoal.guidedMeditation || 'Close your eyes. Breathe slowly in and out. Visualize your vision fulfilled.'} Repeat this core affirmation: ${activeMeditationGoal.affirmation || ''}`;

    speakSoothingly({
      text: textToRead,
      voiceId: activeVoiceId,
      onLoading: (loading) => setIsLoadingMeditationAudio(loading),
      onStart: () => {
        setIsLoadingMeditationAudio(false);
        setIsSpeakingMeditation(true);
        setIsPausedMeditation(false);
      },
      onEnd: () => {
        setIsSpeakingMeditation(false);
        setIsPausedMeditation(false);
        setIsLoadingMeditationAudio(false);
        setMeditationCompleted(true);
      },
      onError: () => {
        setIsSpeakingMeditation(false);
        setIsPausedMeditation(false);
        setIsLoadingMeditationAudio(false);
      },
      rate: 0.82, // Extra calm, slow meditative pace
      pitch: 0.96, // Warm, soothing pitch
    });
  };

  const handlePauseVoiceMeditation = () => {
    pauseSoothingAudio();
    setIsPausedMeditation(true);
  };

  const handleResumeVoiceMeditation = () => {
    resumeSoothingAudio();
    setIsPausedMeditation(false);
  };

  const handleStopVoiceMeditation = () => {
    stopSoothingAudio();
    setIsSpeakingMeditation(false);
    setIsPausedMeditation(false);
    setIsLoadingMeditationAudio(false);
  };

  const handleCloseMeditationModal = () => {
    stopSoothingAudio();
    setIsSpeakingMeditation(false);
    setIsPausedMeditation(false);
    setIsLoadingMeditationAudio(false);

    if (onClaimReward && !meditationCompleted) {
      onClaimReward(25, `Completed Guided Manifestation: ${activeMeditationGoal?.title || 'Practice'}`);
    }
    setMeditationCompleted(false);
    setActiveMeditationGoal(null);
  };
  const handleToggleMilestone = (goalId: string, milestoneId: string) => {
    let wasNewlyCompleted = false;
    const updated = goals.map((g) => {
      if (g.id !== goalId) return g;
      const updatedMilestones = g.milestones.map((m) => {
        if (m.id === milestoneId) {
          if (!m.completed) wasNewlyCompleted = true;
          return { ...m, completed: !m.completed };
        }
        return m;
      });
      return { ...g, milestones: updatedMilestones };
    });
    saveGoals(updated);

    if (wasNewlyCompleted && onClaimReward) {
      onClaimReward(10, 'Milestone Action Step Accomplished ✨');
    }
  };

  const handleChangeStatus = (goalId: string, status: GoalVisionItem['status']) => {
    const updated = goals.map((g) => (g.id === goalId ? { ...g, status } : g));
    saveGoals(updated);

    if (status === 'manifested' && onClaimReward) {
      onClaimReward(50, 'Vision Target Fully Manifested! 🎉');
    }
  };

  const handleDeleteGoal = (goalId: string) => {
    saveGoals(goals.filter((g) => g.id !== goalId));
  };

  const filteredGoals = goals.filter((g) => (filterStatus === 'all' ? true : g.status === filterStatus));

  if (!userProfile) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center bg-white dark:bg-[#2D2A26] border border-[#F0EBE5] dark:border-[#3D3A35] rounded-[32px] space-y-4">
        <Target className="w-12 h-12 text-[#C8826D] mx-auto animate-bounce" />
        <h2 className="text-2xl font-serif font-bold text-[#4A4741] dark:text-[#F8F5F2]">Cosmic Goal Vision Board</h2>
        <p className="text-xs text-[#6B665E] dark:text-[#A39E93]">
          Calculate your Birth Path to access integrated goal visualization tools and AI artwork generation.
        </p>
        <button
          onClick={onOpenIntake}
          className="bg-[#C8826D] hover:bg-[#b5735e] text-white font-bold px-6 py-3 rounded-2xl text-xs uppercase tracking-wider shadow-md transition-all"
        >
          Calculate Birth Path First ✨
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-4 space-y-8">
      {/* Compact Life Path Artwork Motivation Header */}
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
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#C8826D] bg-[#C8826D]/10 px-3 py-1 rounded-full border border-[#C8826D]/20">
              Integrated Goal Visualization & AI Art 🎨
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#4A4741] dark:text-[#F8F5F2] mt-2.5 break-words">
            Cosmic Vision Board & Manifestation Hub
          </h2>
          <p className="text-xs sm:text-sm text-[#6B665E] dark:text-[#A39E93] mt-1 font-medium break-words">
            Explore curated vision templates, interactive prompt builders, and guided 2-minute manifestation practices.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-[#C8826D] hover:bg-[#b5735e] text-white font-bold px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl text-xs uppercase tracking-wider shadow-md shadow-[#C8826D]/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Cosmic Vision Target</span>
        </button>
      </div>

      {/* 1. CURATED VISION INSPIRATION CARDS (1-TAP IMPORT) */}
      <div className="bg-[#F8F5F2] dark:bg-[#252320] border border-[#E0D4C3] dark:border-[#3D3A35] rounded-[24px] sm:rounded-[32px] p-4 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7D8E7A]">
              Need Inspiration? 1-Tap Curated Vision Targets
            </span>
            <p className="text-xs text-[#6B665E] dark:text-[#A39E93] mt-0.5">
              Select any pre-formulated vision goal below to import it straight onto your vision board.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {VISION_TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              className="bg-white dark:bg-[#2D2A26] border border-[#F0EBE5] dark:border-[#3D3A35] rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-sm hover:shadow transition-all"
            >
              <div className="space-y-2">
                <div className="h-28 rounded-xl overflow-hidden relative bg-stone-100 dark:bg-stone-800">
                  <img
                    src={tmpl.imageUrl}
                    alt={tmpl.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 bg-white/90 dark:bg-[#2D2A26]/90 text-[#C8826D] text-[9px] font-bold uppercase px-2 py-0.5 rounded-md border border-[#F0EBE5]">
                    {tmpl.category}
                  </span>
                </div>
                <h4 className="font-serif font-bold text-[#4A4741] dark:text-[#F8F5F2] text-sm leading-tight">
                  {tmpl.title}
                </h4>
                <p className="text-[11px] text-[#6B665E] dark:text-[#A39E93] line-clamp-2">
                  {tmpl.description}
                </p>
              </div>

              <button
                onClick={() => handleImportTemplate(tmpl)}
                className="w-full bg-[#E0D4C3]/40 dark:bg-[#35322D] hover:bg-[#7D8E7A] hover:text-white text-[#4A4741] dark:text-[#F8F5F2] py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-[#7D8E7A]" />
                <span>Import to Board</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-[#F0EBE5] dark:border-[#3D3A35] pb-3 text-xs">
        {(['all', 'conceiving', 'in_progress', 'manifested'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-4 py-2.5 rounded-2xl font-bold capitalize transition-all ${
              filterStatus === st
                ? 'bg-[#7D8E7A] text-white shadow-sm'
                : 'text-[#6B665E] dark:text-[#A39E93] hover:text-[#3D3A35] dark:hover:text-white hover:bg-[#E0D4C3]/30'
            }`}
          >
            {st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Grid of Vision Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredGoals.length === 0 ? (
          <div className="col-span-2 bg-white dark:bg-[#2D2A26] border border-[#F0EBE5] dark:border-[#3D3A35] rounded-[24px] p-8 text-center text-[#8C867C] space-y-2">
            <p>No vision targets found in this status. Import a template above or create a custom target to start manifesting!</p>
          </div>
        ) : (
          filteredGoals.map((goal) => (
            <div
              key={goal.id}
              className="bg-white dark:bg-[#2D2A26] border border-[#F0EBE5] dark:border-[#3D3A35] rounded-[32px] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Vision Image */}
                <div className="relative overflow-hidden bg-[#F8F5F2] dark:bg-[#252320] aspect-[16/9]">
                  <img
                    src={goal.imageUrl}
                    alt={goal.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 dark:bg-[#2D2A26]/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-[#C8826D] border border-[#F0EBE5] dark:border-[#3D3A35]">
                    Ratio {goal.aspectRatio}
                  </div>
                  <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-[#2D2A26]/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] uppercase font-bold text-[#7D8E7A] border border-[#F0EBE5] dark:border-[#3D3A35]">
                    {goal.category}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-serif font-bold text-[#4A4741] dark:text-[#F8F5F2] text-xl leading-snug">{goal.title}</h3>
                      <p className="text-xs text-[#6B665E] dark:text-[#A39E93] mt-1">{goal.description}</p>
                      {goal.timeline && (
                        <div className="inline-flex items-center space-x-1 text-[11px] text-[#7D8E7A] font-bold mt-1.5">
                          <Clock className="w-3 h-3" />
                          <span>Timeline: {goal.timeline}</span>
                        </div>
                      )}
                    </div>

                    <select
                      value={goal.status}
                      onChange={(e) => handleChangeStatus(goal.id, e.target.value as any)}
                      className="bg-[#F8F5F2] dark:bg-[#252320] text-[#3D3A35] dark:text-[#F8F5F2] text-xs border border-[#E0D4C3] dark:border-[#3D3A35] rounded-xl px-2.5 py-1.5 focus:outline-none font-medium shrink-0"
                    >
                      <option value="conceiving">Conceiving 💡</option>
                      <option value="in_progress">In Progress 🚀</option>
                      <option value="manifested">Manifested ✨</option>
                    </select>
                  </div>

                  {/* Affirmation snippet */}
                  {goal.affirmation && (
                    <div className="bg-[#F8F5F2] dark:bg-[#252320] border border-[#E0D4C3] dark:border-[#3D3A35] p-3.5 rounded-2xl text-xs italic text-[#C8826D] font-serif">
                      "{goal.affirmation}"
                    </div>
                  )}

                  {/* Guided Meditation Button */}
                  <div className="pt-1">
                    <button
                      onClick={() => setActiveMeditationGoal(goal)}
                      className="w-full bg-[#7D8E7A]/10 hover:bg-[#7D8E7A] text-[#7D8E7A] hover:text-white border border-[#7D8E7A]/30 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center justify-center space-x-2"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>2-Min Guided Manifestation Practice 🧘‍♂️</span>
                    </button>
                  </div>

                  {/* Milestones Header & Action */}
                  <div className="space-y-2 pt-2 border-t border-[#F0EBE5] dark:border-[#3D3A35]">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#8C867C]">Milestones</span>
                      <button
                        onClick={() => handleAutoGenerateMilestones(goal.id)}
                        className="text-[10px] text-[#C8826D] hover:underline font-bold flex items-center space-x-1"
                      >
                        <Wand2 className="w-3 h-3" />
                        <span>Auto-Generate Action Steps</span>
                      </button>
                    </div>

                    {goal.milestones.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => handleToggleMilestone(goal.id, m.id)}
                        className="flex items-center space-x-2 text-xs text-[#4A4741] dark:text-[#F8F5F2] cursor-pointer hover:text-[#C8826D] transition-colors"
                      >
                        <CheckCircle2
                          className={`w-4 h-4 ${m.completed ? 'text-[#7D8E7A]' : 'text-[#8C867C]'}`}
                        />
                        <span className={m.completed ? 'line-through text-[#8C867C]' : ''}>{m.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-6 py-4 bg-[#F8F5F2] dark:bg-[#252320] border-t border-[#F0EBE5] dark:border-[#3D3A35] flex items-center justify-between text-xs">
                <span className="text-[#8C867C] font-bold text-[10px] uppercase tracking-wider">
                  LP #{userProfile.lifePathNumber} Target
                </span>
                <button
                  onClick={() => handleDeleteGoal(goal.id)}
                  className="text-[#8C867C] hover:text-rose-500 p-1.5 rounded-xl transition-colors"
                  title="Delete Target"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Guided Meditation Practice Modal */}
      {activeMeditationGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-[#2D2A26] border border-[#F0EBE5] dark:border-[#3D3A35] rounded-[24px] sm:rounded-[32px] p-4 sm:p-8 space-y-4 sm:space-y-6 shadow-2xl text-[#3D3A35] dark:text-[#F8F5F2] my-4 sm:my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-[#7D8E7A] text-white flex items-center justify-center shadow-sm shrink-0">
                <Eye className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#7D8E7A] block">
                  2-Min Guided Manifestation Practice
                </span>
                <h3 className="text-lg sm:text-xl font-serif font-bold text-[#4A4741] dark:text-[#F8F5F2] truncate">
                  {activeMeditationGoal.title}
                </h3>
              </div>
            </div>

            {/* Voice Narration Control Bar */}
            <div className="bg-[#F8F5F2] dark:bg-[#252320] border border-[#E0D4C3] dark:border-[#3D3A35] p-3 sm:p-4 rounded-2xl flex flex-wrap items-center justify-between gap-2 sm:gap-3">
              <div className="flex items-center space-x-2 text-xs">
                {isLoadingMeditationAudio ? (
                  <Loader2 className="w-4 h-4 text-[#C8826D] animate-spin" />
                ) : (
                  <Volume2 className={`w-4 h-4 ${isSpeakingMeditation ? 'text-[#C8826D] animate-pulse' : 'text-[#7D8E7A]'}`} />
                )}
                <span className="font-bold text-[#4A4741] dark:text-[#F8F5F2]">
                  {isLoadingMeditationAudio
                    ? 'Connecting to Gemini Voice...'
                    : isSpeakingMeditation
                    ? isPausedMeditation
                      ? 'Narration Paused ⏸️'
                      : `Voice Guide Speaking (${activeVoiceId}) 🗣️`
                    : `Voice Narration Ready (${activeVoiceId}) 🎧`}
                </span>
              </div>

              <div className="flex items-center space-x-1.5">
                {/* Voice Persona Selector */}
                <button
                  type="button"
                  onClick={() => setIsVoiceModalOpen(true)}
                  className="px-2.5 py-1.5 bg-[#C87A5E]/10 hover:bg-[#C87A5E]/20 text-[#C87A5E] border border-[#C87A5E]/30 rounded-xl text-xs font-bold transition-all flex items-center space-x-1"
                  title="Change Meditation Voice Persona"
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>Voice: {activeVoiceId}</span>
                </button>

                {!isSpeakingMeditation ? (
                  <button
                    onClick={handleStartVoiceMeditation}
                    disabled={isLoadingMeditationAudio}
                    className="bg-[#C8826D] hover:bg-[#b5735e] disabled:opacity-50 text-white px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-1 shadow transition-all"
                  >
                    {isLoadingMeditationAudio ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Loading...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        <span>Play Voice Guide</span>
                      </>
                    )}
                  </button>
                ) : (
                  <>
                    {isPausedMeditation ? (
                      <button
                        onClick={handleResumeVoiceMeditation}
                        className="bg-[#7D8E7A] hover:bg-[#6c7d69] text-white px-3 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-1 transition-all"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Resume</span>
                      </button>
                    ) : (
                      <button
                        onClick={handlePauseVoiceMeditation}
                        className="bg-[#E0D4C3]/60 dark:bg-[#35322D] hover:bg-[#E0D4C3] text-[#4A4741] dark:text-[#F8F5F2] px-3 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-1 transition-all"
                      >
                        <Pause className="w-3.5 h-3.5" />
                        <span>Pause</span>
                      </button>
                    )}
                    <button
                      onClick={handleStopVoiceMeditation}
                      className="bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 text-stone-700 dark:text-stone-200 p-1.5 rounded-xl transition-all"
                      title="Stop Voice Guide"
                    >
                      <Square className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="bg-[#F8F5F2] dark:bg-[#252320] border border-[#E0D4C3] dark:border-[#3D3A35] p-6 rounded-[24px] space-y-3 leading-relaxed text-sm italic font-serif text-[#4A4741] dark:text-[#F8F5F2]">
              <p>
                {activeMeditationGoal.guidedMeditation ||
                  'Close your eyes and breathe slowly. Visualize your goal fully realized in vivid detail. Feel the gratitude in your chest.'}
              </p>
            </div>

            <div className="bg-[#7D8E7A]/10 border border-[#7D8E7A]/20 p-4 rounded-2xl text-xs space-y-1">
              <span className="font-bold text-[#7D8E7A] uppercase tracking-wider block">Core Affirmation:</span>
              <p className="text-[#3D3A35] dark:text-[#F8F5F2] italic">"{activeMeditationGoal.affirmation}"</p>
            </div>

            <button
              onClick={handleCloseMeditationModal}
              className="w-full bg-[#7D8E7A] hover:bg-[#6c7d69] text-white font-bold py-3.5 rounded-2xl text-xs uppercase tracking-wider shadow flex items-center justify-center space-x-2"
            >
              <Award className="w-4 h-4" />
              <span>Complete Practice & Claim +25 Karma Points ✨</span>
            </button>
          </div>
        </div>
      )}

      {/* Add New Cosmic Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-xl bg-white dark:bg-[#2D2A26] border border-[#F0EBE5] dark:border-[#3D3A35] rounded-[24px] sm:rounded-[32px] p-4 sm:p-8 space-y-4 sm:space-y-5 shadow-2xl text-[#3D3A35] dark:text-[#F8F5F2] my-4 sm:my-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#4A4741] dark:text-[#F8F5F2]">New Cosmic Vision Target</h3>

            {/* Quick Inspiration Preset Chips */}
            <div className="bg-[#F8F5F2] dark:bg-[#252320] p-3.5 sm:p-4 rounded-2xl border border-[#E0D4C3] dark:border-[#3D3A35] space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C8826D] flex items-center space-x-1">
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Hard to express yourself? Tap a preset to fill:</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { t: 'Financial Freedom Sanctuary', d: 'Building passive income & complete wealth sovereignty', c: 'career', a: 'I attract continuous wealth and abundance.' },
                  { t: 'Soulmate Life Partnership', d: 'Connecting with a deeply loving and supportive partner', c: 'love', a: 'My heart is open to receiving pure love.' },
                  { t: 'Cellular Health & Vitality', d: 'Nourishing energy, sleep, and physical strength', c: 'health', a: 'My body vibrates with perfect health.' },
                  { t: 'Unstoppable Creative Legacy', d: 'Expressing talents and completing major art projects', c: 'career', a: 'My creative gifts flow with ease.' },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setTitle(item.t);
                      setDescription(item.d);
                      setCategory(item.c as any);
                      setAffirmation(item.a);
                    }}
                    className="text-[11px] bg-white dark:bg-[#2D2A26] border border-[#E0D4C3] dark:border-[#3D3A35] hover:bg-[#C8826D] hover:text-white px-3 py-1 rounded-xl transition-all"
                  >
                    + {item.t}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase text-[#4A4741] dark:text-[#E0D4C3] mb-1">Target Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Manifesting Financial Independence & Creative Freedom"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#F8F5F2] dark:bg-[#252320] border border-[#E0D4C3] dark:border-[#3D3A35] rounded-2xl px-4 py-3 text-sm text-[#3D3A35] dark:text-[#F8F5F2]"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-[#4A4741] dark:text-[#E0D4C3] mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Describe your vision and what achieving it feels like..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#F8F5F2] dark:bg-[#252320] border border-[#E0D4C3] dark:border-[#3D3A35] rounded-2xl px-4 py-3 text-sm text-[#3D3A35] dark:text-[#F8F5F2]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-[#4A4741] dark:text-[#E0D4C3] mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-[#F8F5F2] dark:bg-[#252320] border border-[#E0D4C3] dark:border-[#3D3A35] rounded-2xl px-3.5 py-2.5 text-sm text-[#3D3A35] dark:text-[#F8F5F2]"
                  >
                    <option value="career">Career & Legacy 🎯</option>
                    <option value="love">Love & Soulmates 💖</option>
                    <option value="health">Vitality & Health 🌿</option>
                    <option value="spiritual">Spiritual Mastery 🧘‍♂️</option>
                    <option value="travel">Travel & Exploration ✈️</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase text-[#4A4741] dark:text-[#E0D4C3] mb-1">Timeline Target</label>
                  <select
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className="w-full bg-[#F8F5F2] dark:bg-[#252320] border border-[#E0D4C3] dark:border-[#3D3A35] rounded-2xl px-3.5 py-2.5 text-sm text-[#3D3A35] dark:text-[#F8F5F2]"
                  >
                    <option value="Next Full Moon (30 Days)">Next Full Moon (30 Days)</option>
                    <option value="Spring Equinox (90 Days)">Spring Equinox (90 Days)</option>
                    <option value="6 Month Cycle">6 Month Cycle</option>
                    <option value="Solar Return (Annual)">Solar Return (Annual)</option>
                  </select>
                </div>
              </div>

              {/* AI Image Generation Interactive Prompt Builder */}
              <div className="bg-[#F8F5F2] dark:bg-[#252320] p-4 rounded-2xl border border-[#E0D4C3] dark:border-[#3D3A35] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#C8826D] flex items-center space-x-1">
                    <Wand2 className="w-4 h-4 text-[#7D8E7A]" />
                    <span>AI Cosmic Vision Art Prompt Builder</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleMixInspirationPrompt}
                    className="text-[11px] bg-[#7D8E7A]/20 hover:bg-[#7D8E7A] hover:text-white text-[#7D8E7A] px-2.5 py-1 rounded-xl font-bold transition-all"
                  >
                    Mix Selections
                  </button>
                </div>

                {/* Dropdowns for Style & Theme */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#8C867C] mb-1">Visual Art Style</label>
                    <select
                      value={selectedStyleIndex}
                      onChange={(e) => setSelectedStyleIndex(Number(e.target.value))}
                      className="w-full bg-white dark:bg-[#2D2A26] border border-[#E0D4C3] dark:border-[#3D3A35] rounded-xl px-2.5 py-2 text-xs"
                    >
                      {VISUAL_STYLES.map((st, i) => (
                        <option key={i} value={i}>
                          {st.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#8C867C] mb-1">Energy Intention</label>
                    <select
                      value={selectedThemeIndex}
                      onChange={(e) => setSelectedThemeIndex(Number(e.target.value))}
                      className="w-full bg-white dark:bg-[#2D2A26] border border-[#E0D4C3] dark:border-[#3D3A35] rounded-xl px-2.5 py-2 text-xs"
                    >
                      {INTENTION_THEMES.map((th, i) => (
                        <option key={i} value={i}>
                          {th.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Art Prompt (Click Mix Selections or write custom description)"
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    className="flex-1 bg-white dark:bg-[#2D2A26] border border-[#E0D4C3] dark:border-[#3D3A35] rounded-xl px-3.5 py-2 text-xs text-[#3D3A35] dark:text-[#F8F5F2]"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateAIImage}
                    disabled={isGeneratingImage}
                    className="bg-[#7D8E7A] hover:bg-[#6c7d69] text-white px-3.5 py-2 rounded-xl font-bold text-xs transition-all uppercase tracking-wider shrink-0"
                  >
                    {isGeneratingImage ? 'Generating...' : 'Generate Art'}
                  </button>
                </div>

                {generatedImageUrl && (
                  <div className="mt-2 rounded-xl overflow-hidden border border-[#E0D4C3] dark:border-[#3D3A35] aspect-[16/9]">
                    <img src={generatedImageUrl} alt="Generated Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold uppercase text-[#4A4741] dark:text-[#E0D4C3] mb-1">Personal Affirmation</label>
                <input
                  type="text"
                  placeholder="e.g. I am open to receiving divine abundance with ease and gratitude."
                  value={affirmation}
                  onChange={(e) => setAffirmation(e.target.value)}
                  className="w-full bg-[#F8F5F2] dark:bg-[#252320] border border-[#E0D4C3] dark:border-[#3D3A35] rounded-2xl px-4 py-3 text-sm text-[#3D3A35] dark:text-[#F8F5F2]"
                />
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 bg-[#F8F5F2] dark:bg-[#35322D] text-[#4A4741] dark:text-[#F8F5F2] py-3.5 rounded-2xl font-bold text-xs border border-[#E0D4C3] dark:border-[#3D3A35]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-[#C8826D] hover:bg-[#b5735e] text-white py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider shadow"
                >
                  Save Vision Target
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Voice Persona Settings Modal */}
      <VoiceSettingsModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onVoiceChanged={(newVoiceId) => setActiveVoiceId(newVoiceId)}
      />
    </div>
  );
};
