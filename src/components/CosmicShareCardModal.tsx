import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Share2,
  Copy,
  Check,
  Download,
  Printer,
  X,
  Crown,
  MessageCircle,
  Mail,
  Send,
  ExternalLink,
} from 'lucide-react';
import { UserProfile, LifePathReading, LifePathNumber } from '../types';
import { ARCHETYPE_ART_DATA } from './LifePathArtworkCard';
import { calculateCoreNumbers } from '../utils/numerology';

interface CosmicShareCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile | null;
  reading?: LifePathReading | null;
  onOpenSubscription?: () => void;
}

export const CosmicShareCardModal: React.FC<CosmicShareCardModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  reading,
}) => {
  const [copiedText, setCopiedText] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [activePlatformShare, setActivePlatformShare] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !userProfile) return null;

  const lpNum = (userProfile.lifePathNumber || 1) as LifePathNumber;
  const art = ARCHETYPE_ART_DATA[lpNum] || ARCHETYPE_ART_DATA[1];
  const coreNums = calculateCoreNumbers(userProfile.name, userProfile.birthDate);

  const shareCaption = `✨ My Cosmic Life Path is #${lpNum} — "${art.title}" (${art.archetype})!\n\n` +
    `🔮 Element: ${art.element}\n` +
    `💫 Soul Motto: "${art.motto}"\n` +
    `⚡ Power Traits: ${art.powerTraits.join(' • ')}\n\n` +
    `Explore your sacred numerological blueprint on Cosmic Path!\n` +
    `#Numerology #LifePath${lpNum} #SacredGeometry #CosmicPath #SpiritualGrowth`;

  const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://cosmicpath.app';

  const handleCopyCaption = async () => {
    try {
      await navigator.clipboard.writeText(shareCaption);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    } catch (err) {
      console.error('Failed to copy caption:', err);
    }
  };

  const handleWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Cosmic Life Path #${lpNum} — ${userProfile.name}`,
          text: shareCaption,
          url: appUrl,
        });
        return;
      } catch {
        // User cancelled or unsupported
      }
    }
    handleCopyCaption();
  };

  // Direct Social Platform Sharing URLs
  const shareToPlatform = (platform: 'whatsapp' | 'twitter' | 'facebook' | 'linkedin' | 'reddit' | 'sms' | 'email') => {
    const encodedText = encodeURIComponent(shareCaption);
    const encodedUrl = encodeURIComponent(appUrl);
    let url = '';

    switch (platform) {
      case 'whatsapp':
        url = `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'reddit':
        url = `https://reddit.com/submit?url=${encodedUrl}&title=${encodeURIComponent(`Cosmic Life Path #${lpNum} — ${art.title}`)}`;
        break;
      case 'sms':
        url = `sms:?&body=${encodedText}%20${encodedUrl}`;
        break;
      case 'email':
        url = `mailto:?subject=${encodeURIComponent(`Cosmic Life Path #${lpNum} Blueprint — ${userProfile.name}`)}&body=${encodedText}%0A%0A${encodedUrl}`;
        break;
    }

    if (url) {
      setActivePlatformShare(platform);
      window.open(url, '_blank', 'noopener,noreferrer');
      setTimeout(() => setActivePlatformShare(null), 2000);
    }
  };

  // High-Res Canvas Image Generator & Download (Zero dependency, works everywhere)
  const handleDownloadImage = () => {
    setDownloading(true);
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = 1080;
      const height = 1350; // Ideal 4:5 Instagram Portrait / Phone Wallpaper ratio
      canvas.width = width;
      canvas.height = height;

      // Dark obsidian background
      ctx.fillStyle = '#161514';
      ctx.fillRect(0, 0, width, height);

      // Radial background glow matching Life Path color
      const glow = ctx.createRadialGradient(width / 2, 450, 50, width / 2, 450, 500);
      glow.addColorStop(0, `${art.accentColor}33`);
      glow.addColorStop(1, '#16151400');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      // Outer Decorative Border
      ctx.strokeStyle = `${art.accentColor}66`;
      ctx.lineWidth = 6;
      ctx.strokeRect(36, 36, width - 72, height - 72);

      // Inner Corner Accents
      ctx.strokeStyle = art.accentColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(48, 48, width - 96, height - 96);

      // Brand Title
      ctx.textAlign = 'center';
      ctx.fillStyle = art.accentColor;
      ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
      ctx.letterSpacing = '6px';
      ctx.fillText('COSMIC PATH SANCTUARY', width / 2, 120);

      // User Name
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 52px "Playfair Display", Georgia, serif';
      ctx.fillText(userProfile.name || 'Honored Soul', width / 2, 190);

      // Birth Date & Element
      ctx.fillStyle = '#A8A29E';
      ctx.font = '500 24px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`${userProfile.birthDate}  •  ${art.element}`, width / 2, 235);

      // Life Path Emblem Circle
      ctx.beginPath();
      ctx.arc(width / 2, 410, 110, 0, Math.PI * 2);
      ctx.fillStyle = art.accentColor;
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF40';
      ctx.lineWidth = 8;
      ctx.stroke();

      // LP Label
      ctx.fillStyle = '#FFFFFFD9';
      ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('LIFE PATH', width / 2, 365);

      // LP Value
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 110px "Playfair Display", Georgia, serif';
      ctx.fillText(String(lpNum), width / 2, 465);

      // Archetype Title
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 44px "Playfair Display", Georgia, serif';
      ctx.fillText(art.title, width / 2, 590);

      // Archetype Subtitle
      ctx.fillStyle = art.accentColor;
      ctx.font = 'italic 28px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(art.archetype, width / 2, 635);

      // Soul Motto Box
      ctx.fillStyle = '#22201D';
      ctx.roundRect(100, 680, width - 200, 110, 20);
      ctx.fill();
      ctx.strokeStyle = `${art.accentColor}40`;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#F5F2EC';
      ctx.font = 'italic 25px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`"${art.motto}"`, width / 2, 745);

      // 4 Core Numbers Box Grid
      const boxY = 825;
      const boxW = 195;
      const boxH = 125;
      const gap = 20;
      const startX = (width - (4 * boxW + 3 * gap)) / 2;

      const coreItems = [
        { label: 'Life Path', val: lpNum, col: art.accentColor },
        { label: 'Destiny', val: coreNums.destiny, col: '#FFFFFF' },
        { label: 'Soul Urge', val: coreNums.soulUrge, col: '#FFFFFF' },
        { label: 'Personality', val: coreNums.personality, col: '#FFFFFF' },
      ];

      coreItems.forEach((item, i) => {
        const x = startX + i * (boxW + gap);
        ctx.fillStyle = '#24221F';
        ctx.roundRect(x, boxY, boxW, boxH, 16);
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF15';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#A8A29E';
        ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(item.label.toUpperCase(), x + boxW / 2, boxY + 42);

        ctx.fillStyle = item.col;
        ctx.font = 'bold 44px "Playfair Display", serif';
        ctx.fillText(String(item.val), x + boxW / 2, boxY + 98);
      });

      // Power Traits Pills
      const traitsY = 1010;
      const traitStr = art.powerTraits.map(t => `⚡ ${t}`).join('    •    ');
      ctx.fillStyle = '#E7E5E4';
      ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(traitStr, width / 2, traitsY);

      // Motivation Quote (Word Wrapped)
      ctx.fillStyle = '#A8A29E';
      ctx.font = 'italic 22px "Plus Jakarta Sans", sans-serif';
      const quote = `"${art.motivationQuote}"`;
      if (quote.length > 80) {
        ctx.fillText(quote.slice(0, 75) + '...', width / 2, 1090);
      } else {
        ctx.fillText(quote, width / 2, 1090);
      }

      // Verification Footer
      ctx.fillStyle = '#78716C';
      ctx.font = '500 20px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('✦ Authenticated Cosmic Blueprint • cosmicpath.app ✦', width / 2, 1220);

      // Trigger instant PNG Download
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `Cosmic_Soul_Card_${(userProfile.name || 'Seeker').replace(/\s+/g, '_')}_LP${lpNum}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('Failed to generate canvas image:', err);
    } finally {
      setDownloading(false);
    }
  };

  const handlePrintCard = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Cosmic Card - ${userProfile.name} (LP #${lpNum})</title>
            <style>
              body {
                margin: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                background: #111;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              }
              .card-container {
                width: min(500px, 90vw);
                border-radius: 28px;
                background: #181716;
                color: #F5F2EC;
                border: 2px solid ${art.accentColor};
                padding: 32px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.5);
                position: relative;
                overflow: hidden;
              }
              .card-header { text-align: center; margin-bottom: 20px; }
              .brand { font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: ${art.accentColor}; font-weight: bold; }
              .name { font-size: 24px; font-weight: bold; margin: 6px 0 2px; }
              .date { font-size: 12px; color: #888; font-family: monospace; }
              .lp-circle {
                width: 80px;
                height: 80px;
                margin: 16px auto;
                border-radius: 50%;
                background: ${art.accentColor};
                color: #fff;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
              }
              .lp-label { font-size: 9px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.85; }
              .lp-val { font-size: 34px; font-weight: bold; line-height: 1; font-family: Georgia, serif; }
              .title { font-size: 18px; font-weight: bold; text-align: center; color: #fff; margin-bottom: 4px; }
              .archetype { font-size: 12px; text-align: center; color: ${art.accentColor}; font-style: italic; margin-bottom: 16px; }
              .motto { background: rgba(255,255,255,0.05); border-left: 3px solid ${art.accentColor}; padding: 10px 14px; border-radius: 8px; font-style: italic; font-size: 12px; margin-bottom: 16px; }
              .nums-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; text-align: center; margin-bottom: 16px; }
              .num-box { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 8px; }
              .num-lbl { font-size: 8px; text-transform: uppercase; color: #aaa; margin-bottom: 2px; }
              .num-val { font-size: 16px; font-weight: bold; color: ${art.accentColor}; }
              .footer { text-align: center; font-size: 10px; color: #666; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 12px; }
              @media print {
                body { background: white; }
                .card-container { box-shadow: none; border-color: #333; }
              }
            </style>
          </head>
          <body>
            <div class="card-container">
              <div class="card-header">
                <div class="brand">Cosmic Path Sanctuary</div>
                <div class="name">${userProfile.name}</div>
                <div class="date">${userProfile.birthDate} • ${art.element}</div>
              </div>
              <div class="lp-circle">
                <span class="lp-label">Life Path</span>
                <span class="lp-val">${lpNum}</span>
              </div>
              <div class="title">${art.title}</div>
              <div class="archetype">${art.archetype}</div>
              <div class="motto">"${art.motto}"</div>
              <div class="nums-grid">
                <div class="num-box"><div class="num-lbl">Life Path</div><div class="num-val">${lpNum}</div></div>
                <div class="num-box"><div class="num-lbl">Destiny</div><div class="num-val">${coreNums.destiny}</div></div>
                <div class="num-box"><div class="num-lbl">Soul Urge</div><div class="num-val">${coreNums.soulUrge}</div></div>
                <div class="num-box"><div class="num-lbl">Persona</div><div class="num-val">${coreNums.personality}</div></div>
              </div>
              <div class="footer">
                ✦ Authenticated Cosmic Blueprint • cosmicpath.app ✦
              </div>
            </div>
            <script>
              setTimeout(() => { window.print(); }, 350);
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-card-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl max-h-[92dvh] flex flex-col rounded-3xl bg-[#1A1917] text-[#F5F2EC] border border-stone-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="p-3.5 sm:p-5 border-b border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0"
              style={{ backgroundColor: art.accentColor }}
            >
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 id="share-card-modal-title" className="font-serif font-bold text-sm sm:text-base md:text-lg text-white">
                Personalized Social Share Card
              </h2>
              <p className="text-[11px] text-stone-400">
                Visual card crafted for Life Path #{lpNum} & sacred geometry
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Visual Card Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-4">
          {/* The High-End Visual Card (Auto-Fits Phone, Tablet, PC screens) */}
          <div
            ref={cardRef}
            className="w-full max-w-md mx-auto rounded-3xl p-4 sm:p-6 md:p-7 relative overflow-hidden shadow-2xl border transition-all"
            style={{
              backgroundColor: '#1E1D1B',
              borderColor: `${art.accentColor}60`,
              boxShadow: `0 15px 40px -10px ${art.accentColor}25`,
            }}
          >
            {/* Ambient Background Gradient based on Life Path */}
            <div
              className="absolute -top-20 -right-20 w-56 h-56 rounded-full blur-3xl opacity-20 pointer-events-none"
              style={{ backgroundColor: art.accentColor }}
            />
            <div
              className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full blur-3xl opacity-15 pointer-events-none"
              style={{ backgroundColor: art.accentColor }}
            />

            {/* Header / Brand */}
            <div className="flex items-center justify-between border-b border-stone-800 pb-2.5 mb-4">
              <div>
                <span
                  className="text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.25em] block font-mono"
                  style={{ color: art.accentColor }}
                >
                  Cosmic Path Sanctuary
                </span>
                <span className="text-xs text-stone-300 font-semibold truncate block max-w-[170px] sm:max-w-xs">
                  {userProfile.name} • <span className="font-mono text-stone-400">{userProfile.birthDate}</span>
                </span>
              </div>
              <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-stone-300 font-mono shrink-0">
                {art.element}
              </span>
            </div>

            {/* Sacred Geometry SVG & Life Path Badge */}
            <div className="flex flex-row items-center gap-3 sm:gap-4 my-2 text-left">
              <div className="shrink-0 flex items-center justify-center p-2 rounded-2xl bg-black/40 border border-white/10 shadow-inner w-16 h-16 sm:w-20 sm:h-20">
                <div className="scale-75 sm:scale-90 transform-gpu">
                  {art.svgIcon}
                </div>
              </div>

              <div className="min-w-0">
                <div
                  className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white mb-1 shadow-xs"
                  style={{ backgroundColor: art.accentColor }}
                >
                  <Crown className="w-3 h-3" />
                  <span>LIFE PATH #{lpNum}</span>
                </div>
                <h3 className="text-base sm:text-xl font-serif font-bold text-white tracking-tight truncate">
                  {art.title}
                </h3>
                <p className="text-[11px] sm:text-xs italic text-stone-300 truncate">
                  {art.archetype}
                </p>
              </div>
            </div>

            {/* Soul Motto */}
            <div
              className="my-3 p-2.5 sm:p-3 rounded-2xl bg-black/40 border text-xs sm:text-sm italic text-stone-200 text-center leading-relaxed"
              style={{ borderColor: `${art.accentColor}30` }}
            >
              &quot;{art.motto}&quot;
            </div>

            {/* Core 4 Numbers Grid (2x2 on mobile, 4 across on desktop) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-3 text-center">
              <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                <div className="text-[9px] uppercase tracking-wider text-stone-400 font-mono">Life Path</div>
                <div className="text-base sm:text-lg font-bold font-serif" style={{ color: art.accentColor }}>{lpNum}</div>
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                <div className="text-[9px] uppercase tracking-wider text-stone-400 font-mono">Destiny</div>
                <div className="text-base sm:text-lg font-bold font-serif text-white">{coreNums.destiny}</div>
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                <div className="text-[9px] uppercase tracking-wider text-stone-400 font-mono">Soul Urge</div>
                <div className="text-base sm:text-lg font-bold font-serif text-white">{coreNums.soulUrge}</div>
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                <div className="text-[9px] uppercase tracking-wider text-stone-400 font-mono">Persona</div>
                <div className="text-base sm:text-lg font-bold font-serif text-white">{coreNums.personality}</div>
              </div>
            </div>

            {/* Power Traits */}
            <div className="flex items-center justify-center gap-1.5 flex-wrap my-2">
              {art.powerTraits.map((trait, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-semibold bg-white/5 text-stone-300 border border-white/10"
                >
                  ⚡ {trait}
                </span>
              ))}
            </div>

            {/* Motivation Quote */}
            <p className="text-[10px] sm:text-[11px] text-stone-400 text-center mt-2.5 pt-2 border-t border-stone-800 leading-normal line-clamp-2">
              {art.motivationQuote}
            </p>
          </div>

          {/* Direct 1-Tap Share to Other Platforms */}
          <div className="space-y-2 pt-1 max-w-md mx-auto">
            <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block text-center">
              Share Direct to Social Platforms
            </span>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 text-center">
              <button
                onClick={() => shareToPlatform('whatsapp')}
                className="p-2 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] text-[10px] font-bold flex flex-col items-center justify-center transition-colors"
                title="Share via WhatsApp"
              >
                <MessageCircle className="w-4 h-4 mb-0.5" />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={() => shareToPlatform('twitter')}
                className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 text-[10px] font-bold flex flex-col items-center justify-center transition-colors"
                title="Post to X / Twitter"
              >
                <span className="font-bold text-xs mb-0.5 leading-none">𝕏</span>
                <span>Post</span>
              </button>

              <button
                onClick={() => shareToPlatform('facebook')}
                className="p-2 rounded-xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border border-[#1877F2]/30 text-[#1877F2] text-[10px] font-bold flex flex-col items-center justify-center transition-colors"
                title="Share to Facebook"
              >
                <span className="font-bold text-xs mb-0.5 leading-none">fb</span>
                <span>Facebook</span>
              </button>

              <button
                onClick={() => shareToPlatform('linkedin')}
                className="p-2 rounded-xl bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 border border-[#0A66C2]/30 text-[#0A66C2] text-[10px] font-bold flex flex-col items-center justify-center transition-colors"
                title="Share on LinkedIn"
              >
                <span className="font-bold text-xs mb-0.5 leading-none">in</span>
                <span>LinkedIn</span>
              </button>

              <button
                onClick={() => shareToPlatform('sms')}
                className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 text-[10px] font-bold flex flex-col items-center justify-center transition-colors"
                title="Send as Text Message"
              >
                <Send className="w-3.5 h-3.5 mb-0.5" />
                <span>SMS</span>
              </button>

              <button
                onClick={() => shareToPlatform('email')}
                className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 text-[10px] font-bold flex flex-col items-center justify-center transition-colors"
                title="Share via Email"
              >
                <Mail className="w-3.5 h-3.5 mb-0.5" />
                <span>Email</span>
              </button>

              <button
                onClick={handleWebShare}
                className="p-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-[10px] font-bold flex flex-col items-center justify-center transition-colors"
                title="Open Native Device Share Sheet"
              >
                <Share2 className="w-3.5 h-3.5 mb-0.5" />
                <span>More</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-3.5 sm:p-5 border-t border-stone-800 bg-stone-900/80 flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0">
          <button
            onClick={handleCopyCaption}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 border border-stone-700"
          >
            {copiedText ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Caption & Tags Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Story Text</span>
              </>
            )}
          </button>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={handlePrintCard}
              className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 border border-stone-700"
              title="Print Keepsake Card"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={handleDownloadImage}
              disabled={downloading}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5 shadow-md"
              style={{ backgroundColor: art.accentColor }}
              title="Download high-resolution image to camera roll or files"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloading ? 'Rendering...' : 'Download Image'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
