import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  CheckCircle2,
  Trash2,
  Sparkles,
  Crown,
  Heart,
  UserCheck,
  Smile,
  Briefcase,
  X,
  ArrowRight,
  Download,
  Upload,
} from 'lucide-react';
import { UserProfile } from '../types';
import {
  getSavedProfiles,
  getActiveProfileId,
  setActiveProfileId,
  deleteProfileRecord,
  saveProfilesList,
} from '../utils/profileStore';
import { isProSubscriber } from '../utils/subscriptionStore';
import { ARCHETYPE_ART_DATA } from './LifePathArtworkCard';

interface ProfileSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProfile: (profile: UserProfile) => void;
  onAddNewProfile: () => void;
  onOpenSubscription: () => void;
}

export const ProfileSwitcherModal: React.FC<ProfileSwitcherModalProps> = ({
  isOpen,
  onClose,
  onSelectProfile,
  onAddNewProfile,
  onOpenSubscription,
}) => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isPro, setIsPro] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const loadData = () => {
    const list = getSavedProfiles();
    setProfiles(list);
    setActiveId(getActiveProfileId() || (list[0]?.id ?? null));
    setIsPro(isProSubscriber());
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleProfilesChanged = () => loadData();
    const handleActiveChanged = () => setActiveId(getActiveProfileId());
    const handleSubChanged = () => setIsPro(isProSubscriber());

    window.addEventListener('cosmic-profiles-changed', handleProfilesChanged);
    window.addEventListener('cosmic-active-profile-changed', handleActiveChanged);
    window.addEventListener('cosmic-subscription-changed', handleSubChanged);

    return () => {
      window.removeEventListener('cosmic-profiles-changed', handleProfilesChanged);
      window.removeEventListener('cosmic-active-profile-changed', handleActiveChanged);
      window.removeEventListener('cosmic-subscription-changed', handleSubChanged);
    };
  }, []);

  if (!isOpen) return null;

  const handleSwitch = (profile: UserProfile) => {
    setActiveProfileId(profile.id);
    setActiveId(profile.id);
    onSelectProfile(profile);
    onClose();
  };

  const handleAddClick = () => {
    // Check free limit: 2 profiles
    if (!isPro && profiles.length >= 2) {
      onOpenSubscription();
      return;
    }
    onAddNewProfile();
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (profiles.length <= 1) {
      alert('You cannot delete your only profile. Add another profile first or update your current one.');
      return;
    }
    deleteProfileRecord(id);
    loadData();
    setDeleteConfirmId(null);
  };

  const handleExportProfiles = () => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(profiles, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `cosmic_profiles_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e) {
      console.error('Backup export failed:', e);
    }
  };

  const handleImportProfiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported) && imported.length > 0) {
          // Merge without duplicate IDs
          const existingIds = new Set(profiles.map((p) => p.id));
          const merged = [...profiles];
          for (const item of imported) {
            if (item.name && item.birthDate && !existingIds.has(item.id)) {
              merged.push(item);
            }
          }
          saveProfilesList(merged);
          loadData();
          alert(`Successfully imported ${imported.length} profile(s)!`);
        }
      } catch (err) {
        alert('Invalid JSON file format. Please upload a valid Cosmic Path backup.');
      }
    };
    reader.readAsText(file);
  };

  const getRelationshipBadge = (rel?: string) => {
    switch (rel) {
      case 'partner':
        return { label: 'Partner', icon: Heart, color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-900/60' };
      case 'child':
        return { label: 'Child / Family', icon: Smile, color: 'text-sky-500 bg-sky-50 dark:bg-sky-950/60 border-sky-200 dark:border-sky-900/60' };
      case 'client':
        return { label: 'Client / Seeker', icon: Briefcase, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-900/60' };
      case 'friend':
        return { label: 'Friend', icon: Sparkles, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900/60' };
      default:
        return { label: 'Self', icon: UserCheck, color: 'text-teal-600 bg-teal-50 dark:bg-teal-950/60 border-teal-200 dark:border-teal-900/60' };
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="profiles-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl max-h-[90vh] flex flex-col rounded-3xl bg-white dark:bg-[#1E1D1B] border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-stone-100 dark:border-stone-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-teal-600 flex items-center justify-center text-white shadow-sm">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 id="profiles-modal-title" className="text-lg sm:text-xl font-serif font-bold text-stone-900 dark:text-stone-100">
                Cosmic Profiles & Clients
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Switch profiles to instantly load their saved reports, numbers & blueprints.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pro Tier Limit Callout (if free) */}
        {!isPro && (
          <div className="mx-5 sm:mx-6 mt-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <Crown className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span className="text-stone-700 dark:text-stone-300">
                <strong>Free Tier:</strong> {profiles.length}/2 profiles saved. Upgrade for <strong>unlimited</strong> client reports!
              </span>
            </div>
            <button
              onClick={onOpenSubscription}
              className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-bold text-[11px] shadow-xs flex items-center space-x-1 shrink-0 ml-2"
            >
              <span>Unlock Pro</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Profile List */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3">
          {profiles.length === 0 ? (
            <div className="text-center py-10">
              <Users className="w-12 h-12 text-stone-300 dark:text-stone-600 mx-auto mb-3" />
              <p className="text-stone-600 dark:text-stone-400 font-medium">No saved profiles found yet.</p>
              <p className="text-xs text-stone-400 mt-1">Create your first reading to save your cosmic blueprint.</p>
            </div>
          ) : (
            profiles.map((profile) => {
              const isActive = profile.id === activeId;
              const badge = getRelationshipBadge(profile.relationship);
              const BadgeIcon = badge.icon;
              const art = ARCHETYPE_ART_DATA[profile.lifePathNumber] || ARCHETYPE_ART_DATA[1];

              return (
                <div
                  key={profile.id}
                  onClick={() => handleSwitch(profile)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                    isActive
                      ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-400/60 dark:border-amber-500/50 shadow-sm ring-1 ring-amber-400/40'
                      : 'bg-stone-50/70 dark:bg-stone-800/40 border-stone-200 dark:border-stone-800 hover:border-amber-300 dark:hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center space-x-3.5 min-w-0">
                    {/* Life Path Number Badge */}
                    <div
                      className="w-11 h-11 rounded-2xl flex flex-col items-center justify-center font-bold text-white shadow-xs shrink-0"
                      style={{ backgroundColor: art.accentColor }}
                    >
                      <span className="text-[10px] uppercase font-mono tracking-tighter opacity-80 leading-none">LP</span>
                      <span className="text-base font-serif leading-none mt-0.5">{profile.lifePathNumber}</span>
                    </div>

                    {/* Name & Details */}
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base truncate">
                          {profile.name}
                        </h3>
                        {isActive && (
                          <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Active</span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-1 text-xs text-stone-500 dark:text-stone-400 flex-wrap gap-y-1">
                        <span className="font-mono">{profile.birthDate}</span>
                        <span>•</span>
                        <span className="italic truncate">{art.title}</span>
                        <span
                          className={`inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium border ${badge.color}`}
                        >
                          <BadgeIcon className="w-2.5 h-2.5" />
                          <span>{badge.label}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-1 shrink-0 ml-2">
                    {deleteConfirmId === profile.id ? (
                      <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => handleDelete(profile.id, e)}
                          className="px-2 py-1 rounded-lg bg-rose-600 text-white text-[11px] font-bold hover:bg-rose-700"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirmId(null);
                          }}
                          className="px-2 py-1 rounded-lg bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 text-[11px]"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      profiles.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirmId(profile.id);
                          }}
                          className="p-2 rounded-xl text-stone-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Delete Profile"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs text-stone-500 dark:text-stone-400">
            <button
              onClick={handleExportProfiles}
              className="inline-flex items-center space-x-1 hover:text-stone-900 dark:hover:text-stone-200 transition-colors"
              title="Export all profiles to JSON backup"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Backup</span>
            </button>
            <span>•</span>
            <label className="inline-flex items-center space-x-1 hover:text-stone-900 dark:hover:text-stone-200 transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Import</span>
              <input type="file" accept=".json" onChange={handleImportProfiles} className="hidden" />
            </label>
          </div>

          <button
            onClick={handleAddClick}
            className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center space-x-2 shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add New Person</span>
          </button>
        </div>
      </div>
    </div>
  );
};
