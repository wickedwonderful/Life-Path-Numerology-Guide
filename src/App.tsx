import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { IntakeModal } from './components/IntakeModal';
import { InteractiveTutorial } from './components/InteractiveTutorial';
import { ReadingView } from './components/ReadingView';
import { HoroscopeWidget } from './components/HoroscopeWidget';
import { HabitTracker } from './components/HabitTracker';
import { GoalVisionBoard } from './components/GoalVisionBoard';
import { AIOracleChat } from './components/AIOracleChat';
import { NumerologySuite } from './components/NumerologySuite';
import { RewardCelebrationToast } from './components/RewardCelebrationToast';
import { CosmicAchievementsModal } from './components/CosmicAchievementsModal';
import { VoiceSettingsModal } from './components/VoiceSettingsModal';
import { ProfileSwitcherModal } from './components/ProfileSwitcherModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { Footer } from './components/Footer';
import { TermsAndPrivacyModal } from './components/TermsAndPrivacyModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { UserProfile, LifePathReading, IntakeSurvey, LifePathNumber } from './types';
import { calculateLifePath, LIFE_PATH_DETAILS, formatMarkdownReading, CalculationTrace } from './utils/numerology';
import {
  getActiveProfile,
  getProfileReading,
  saveProfileReading,
  saveProfileRecord,
  setActiveProfileId,
} from './utils/profileStore';
import { isProSubscriber } from './utils/subscriptionStore';
import { profile } from 'console';

const KARMA_STORAGE_KEY = 'cosmic_karma_points_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<'reading' | 'horoscope' | 'habits' | 'goals' | 'suite' | 'chat'>('reading');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [reading, setReading] = useState<LifePathReading | null>(null);
  const [trace, setTrace] = useState<CalculationTrace | null>(null);
  const [selectedLibraryNumber, setSelectedLibraryNumber] = useState<LifePathNumber | undefined>(undefined);

  // Modals state
  const [isIntakeOpen, setIsIntakeOpen] = useState(false);
  const [isProfilesOpen, setIsProfilesOpen] = useState(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isVoiceSettingsOpen, setIsVoiceSettingsOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [termsTab, setTermsTab] = useState<'terms' | 'privacy' | 'disclaimer'>('terms');

  // Subscription status
  const [isPro, setIsPro] = useState<boolean>(() => isProSubscriber());

  const [isLoadingReading, setIsLoadingReading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('cosmic_theme_dark_v1') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('cosmic_theme_dark_v1', isDarkMode ? 'true' : 'false');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Reward Karma Points System
  const [karmaPoints, setKarmaPoints] = useState<number>(25);
  const [rewardToast, setRewardToast] = useState<{
    isOpen: boolean;
    pointsEarned: number;
    reason: string;
  }>({
    isOpen: false,
    pointsEarned: 0,
    reason: '',
  });

  const handleClaimReward = useCallback((points: number, reason: string) => {
    setKarmaPoints((prev) => {
      const nextPts = prev + points;
      localStorage.setItem(KARMA_STORAGE_KEY, nextPts.toString());
      return nextPts;
    });

    setRewardToast({
      isOpen: true,
      pointsEarned: points,
      reason,
    });
  }, []);

  // Helper to switch active profile and load their personalized reading & trace
  const handleSwitchProfile = useCallback((profile: UserProfile) => {
    setUserProfile(profile);
    setActiveProfileId(profile.id);

    const cached = getProfileReading(profile.id);
    if (cached && cached.reading) {
      setReading(cached.reading);
      setTrace(cached.trace);
    } else {
      // Deterministic calculation
      const tr = calculateLifePath(profile.birthDate);
      const detail = LIFE_PATH_DETAILS[tr.finalLifePath] || LIFE_PATH_DETAILS[1];
      const baseR = formatMarkdownReading(profile.name, profile.birthDate, detail, tr);
      setReading(baseR);
      setTrace(tr);
      saveProfileReading(profile.id, baseR, tr);
    }
  }, []);

  // Load existing profile, cached reading & karma points on mount
  useEffect(() => {
    const savedKarma = localStorage.getItem(KARMA_STORAGE_KEY);
    if (savedKarma) {
      setKarmaPoints(parseInt(savedKarma, 10) || 25);
    }

    const activeP = getActiveProfile();
    if (activeP) {
      handleSwitchProfile(activeP);
    } else {
      // Open intake wizard modal by default with 100% blank fill-in spaces for new users!
      setIsIntakeOpen(true);
    }

    // Listen for subscription and profile changes
    const onSubChange = () => setIsPro(isProSubscriber());
    const onProfileChange = () => {
      const p = getActiveProfile();
      if (p) setUserProfile(p);
    };

    window.addEventListener('cosmic-subscription-changed', onSubChange);
    window.addEventListener('cosmic-active-profile-changed', onProfileChange);

    return () => {
      window.removeEventListener('cosmic-subscription-changed', onSubChange);
      window.removeEventListener('cosmic-active-profile-changed', onProfileChange);
    };
  }, [handleSwitchProfile]);

  const handleProfileSubmit = async (name: string, birthDate: string, survey: IntakeSurvey) => {
    setIsLoadingReading(true);

    const tr = calculateLifePath(birthDate);
    const detail = LIFE_PATH_DETAILS[tr.finalLifePath] || LIFE_PATH_DETAILS[1];

    // Create or update profile record
    const profileId = userProfile && userProfile.name === name ? userProfile.id : `usr_${Date.now()}`;
    const profile: UserProfile = {
      id: profileId,
      name,
      birthDate: tr.rawDate,
      relationship: survey.relationship || 'self',
      primaryFocus: survey.focusArea,
      currentMood: survey.energyLevel,
      lifePathNumber: tr.finalLifePath,
      createdAt: userProfile?.createdAt || new Date().toISOString(),
      notes: survey.intention || '',
    };

    saveProfileRecord(profile);
    setUserProfile(profile);

    // Call API for Gemini AI enhanced intuitive reading
    try {
      const res = await fetch('/api/numerology/reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          birthDate: tr.rawDate,
          survey,
        }),
      });

      const data = await res.json();
      if (data.reading) {
        setReading(data.reading);
        setTrace(data.trace || tr);
        saveProfileReading(profile.id, data.reading, data.trace || tr);
      } else {
        const baseR = formatMarkdownReading(name, tr.rawDate, detail, tr, survey);
        setReading(baseR);
        setTrace(tr);
        saveProfileReading(profile.id, baseR, tr);
      }
    } catch (err) {
      console.error('API Reading fetch failed, using fallback:', err);
      const baseR = formatMarkdownReading(name, tr.rawDate, detail, tr, survey);
      setReading(baseR);
      setTrace(tr);
      saveProfileReading(profile.id, baseR, tr);
    } finally 'p'varr.finalLifePath
  } for ${ profile.name } 🌟`);
    }
  };

  const handleOpenTerms = (tab: 'terms' | 'privacy' | 'disclaimer' = 'terms') => {
    setTermsTab(tab);
    setIsTermsOpen(true);
  };

  const handleResetAllData = () => {
    try {
      localStorage.clear();
      setUserProfile(null);
      setReading(null);
      setTrace(null);
      setIsPro(false);
      setKarmaPoints(25);
;      setIsIntakeOpen(true);
      setActiveTab('reading');
    } catch (e) {
      console.error('Error clearing data:', e);
    }
  };

  return (
    <ErrorBoundary>
      <div
        className={`min - h - screen w - full overflow - x - hidden relative font - sans antialiased transition - colors ${
    isDarkMode ? 'bg-[#181716] text-[#F5F2EC]' : 'bg-[#FAF8F5] text-[#292524]'
  } `}
      >
        {/* Background ambient natural tone glow */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-gradient-to-b from-amber-500/5 via-teal-500/5 to-transparent pointer-events-none blur-3xl -z-10" />

        {/* Navigation Header */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userProfile={userProfile}
          onOpenIntake={() => setIsIntakeOpen(true)}
          onOpenProfiles={() => setIsProfilesOpen(true)}
          onOpenSubscription={() => setIsSubscriptionOpen(true)}
          isPro={isPro}
          onOpenTutorial={() => setIsTutorialOpen(true)}
          onOpenAchievements={() => setIsAchievementsOpen(true)}
          onOpenVoiceSettings={() => setIsVoiceSettingsOpen(true)}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          karmaPoints={karmaPoints}
        />

        {/* Main View Container with mobile bottom dock spacing */}
        <main className="py-6 sm:py-8 pb-16">
          {activeTab === 'reading' && (
            <ReadingView
              reading={reading}
              trace={trace}
              userProfile={userProfile}
              onRefresh={() => setIsIntakeOpen(true)}
              isLoading={isLoadingReading}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onSelectLibraryNumber={(num) => setSelectedLibraryNumber(num)}
              onClaimReward={handleClaimReward}
              onOpenAchievements={() => setIsAchievementsOpen(true)}
              karmaPoints={karmaPoints}
            />
          )}

          {activeTab === 'horoscope' && (
            <HoroscopeWidget
              userProfile={userProfile}
              onOpenIntake={() => setIsIntakeOpen(true)}
              onClaimReward={handleClaimReward}
            />
          )}

          {activeTab === 'habits' && (
            <HabitTracker
              userProfile={userProfile}
              onOpenIntake={() => setIsIntakeOpen(true)}
              onClaimReward={handleClaimReward}
            />
          )}

          {activeTab === 'goals' && (
            <GoalVisionBoard
              userProfile={userProfile}
              onOpenIntake={() => setIsIntakeOpen(true)}
              onClaimReward={handleClaimReward}
            />
          )}

          {activeTab === 'suite' && (
            <NumerologySuite
              onClaimReward={handleClaimReward}
              initialNumber={selectedLibraryNumber}
            />
          )}

          {activeTab === 'chat' && (
            <AIOracleChat
              userProfile={userProfile}
              onOpenIntake={() => setIsIntakeOpen(true)}
              onClaimReward={handleClaimReward}
            />
          )}
        </main>

        {/* Compliant Footer with Terms, Privacy, Disclaimers, and Data Controls */}
        <Footer
          onOpenTerms={handleOpenTerms}
          onNavigateTab={(tab) => setActiveTab(tab)}
          userProfile={userProfile}
          onResetData={handleResetAllData}
        />

        {/* Multi-Profile & Client Manager Modal */}
        <ProfileSwitcherModal
          isOpen={isProfilesOpen}
          onClose={() => setIsProfilesOpen(false)}
          onSelectProfile={handleSwitchProfile}
          onAddNewProfile={() => {
            setIsProfilesOpen(false);
            setIsIntakeOpen(true);
          }}
          onOpenSubscription={() => {
            setIsProfilesOpen(false);
            setIsSubscriptionOpen(true);
          }}
        />

        {/* Cosmic Path Pro / VIP Monetization Subscription Modal */}
        <SubscriptionModal
          isOpen={isSubscriptionOpen}
          onClose={() => setIsSubscriptionOpen(false)}
        />

        {/* Cosmic Mastery Hub & Achievements Modal */}
        <CosmicAchievementsModal
          isOpen={isAchievementsOpen}
          onClose={() => setIsAchievementsOpen(false)}
          karmaPoints={karmaPoints}
          userProfile={userProfile}
          onNavigateTab={(tab) => {
            setIsAchievementsOpen(false);
            setActiveTab(tab);
          }}
          onClaimReward={handleClaimReward}
        />

        {/* Reward Celebration Toast Banner */}
        <RewardCelebrationToast
          isOpen={rewardToast.isOpen}
          pointsEarned={rewardToast.pointsEarned}
          totalPoints={karmaPoints}
          reason={rewardToast.reason}
          onClose={() => setRewardToast((prev) => ({ ...prev, isOpen: false }))}
        />

        {/* Interactive Birth Intake Pop-up Wizard (Blank Startup Inputs) */}
        <IntakeModal
          isOpen={isIntakeOpen}
          onClose={() => setIsIntakeOpen(false)}
          onSubmit={handleProfileSubmit}
          initialProfile={userProfile}
        />

        {/* Interactive Platform Onboarding Tutorial */}
        <InteractiveTutorial
          isOpen={isTutorialOpen}
          onClose={() => setIsTutorialOpen(false)}
          onNavigateTab={(tab) => setActiveTab(tab)}
        />

        {/* Cosmic Voice Settings Modal (Live audible preview, distinct acoustic personas) */}
        <VoiceSettingsModal
          isOpen={isVoiceSettingsOpen}
          onClose={() => setIsVoiceSettingsOpen(false)}
        />

        {/* Legal, Privacy & Spiritual Compliance Modal */}
        <TermsAndPrivacyModal
          isOpen={isTermsOpen}
          onClose={() => setIsTermsOpen(false)}
          initialTab={termsTab}
        />
      </div>
    </ErrorBoundary>
  );
}
