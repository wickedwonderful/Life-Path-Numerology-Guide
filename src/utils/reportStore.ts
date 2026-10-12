import { CustomCuratedReport, ReportBlock, ReportBlockSource, UserProfile, LifePathReading } from '../types';
import { formatBirthDate } from './numerology';

const REPORT_STORAGE_KEY = 'cosmic_custom_curated_report_v1';
const REPORT_NOTES_KEY = 'cosmic_report_custom_notes_v1';

export function getCustomReportBlocks(): ReportBlock[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(REPORT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn('Failed to load custom report blocks from localStorage:', e);
    return [];
  }
}

export function saveCustomReportBlocks(blocks: ReportBlock[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(REPORT_STORAGE_KEY, JSON.stringify(blocks));
    window.dispatchEvent(new CustomEvent('cosmic-report-updated', { detail: { blocks } }));
  } catch (e) {
    console.warn('Failed to save custom report blocks to localStorage:', e);
  }
}

export function getCustomReportNotes(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(REPORT_NOTES_KEY) || '';
}

export function saveCustomReportNotes(notes: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(REPORT_NOTES_KEY, notes);
}

export function isBlockInReport(source: ReportBlockSource, title?: string): boolean {
  const blocks = getCustomReportBlocks();
  if (title) {
    return blocks.some((b) => b.source === source && b.title.trim().toLowerCase() === title.trim().toLowerCase());
  }
  return blocks.some((b) => b.source === source);
}

export function addReportBlock(blockData: Omit<ReportBlock, 'id' | 'addedAt'>): boolean {
  const blocks = getCustomReportBlocks();
  const exists = blocks.some((b) => b.source === blockData.source && b.title.trim().toLowerCase() === blockData.title.trim().toLowerCase());
  if (exists) return false;

  const newBlock: ReportBlock = {
    ...blockData,
    id: `block_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    addedAt: new Date().toISOString(),
  };

  const updated = [...blocks, newBlock];
  saveCustomReportBlocks(updated);
  return true;
}

export function removeReportBlock(id: string): void {
  const blocks = getCustomReportBlocks();
  const updated = blocks.filter((b) => b.id !== id);
  saveCustomReportBlocks(updated);
}

export function toggleReportBlock(blockData: Omit<ReportBlock, 'id' | 'addedAt'>): boolean {
  const blocks = getCustomReportBlocks();
  const existingIndex = blocks.findIndex(
    (b) => b.source === blockData.source && b.title.trim().toLowerCase() === blockData.title.trim().toLowerCase()
  );

  if (existingIndex >= 0) {
    blocks.splice(existingIndex, 1);
    saveCustomReportBlocks(blocks);
    return false; // Removed
  } else {
    const newBlock: ReportBlock = {
      ...blockData,
      id: `block_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      addedAt: new Date().toISOString(),
    };
    saveCustomReportBlocks([...blocks, newBlock]);
    return true; // Added
  }
}

export function clearCustomReport(): void {
  saveCustomReportBlocks([]);
}

/**
 * Builds the complete Custom Curated Report object
 */
export function assembleCuratedReport(
  profile: UserProfile,
  reading: LifePathReading,
  customNotes?: string
): CustomCuratedReport {
  const blocks = getCustomReportBlocks();
  return {
    id: `report_${profile.id || 'soul'}_${Date.now()}`,
    title: `Cosmic Life Path Blueprint — ${profile.name || 'Honored Soul'}`,
    profileName: profile.name || 'Honored Soul',
    birthDateFormatted: formatBirthDate(profile.birthDate),
    lifePathNumber: reading.lifePathNumber,
    archetype: reading.archetype,
    blocks,
    customNotes: customNotes || getCustomReportNotes(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Generates formatted Markdown for saving / copying
 */
export function generateMarkdownReport(report: CustomCuratedReport): string {
  const dateStr = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  let md = `# 🔮 ${report.title}\n`;
  md += `*Curated Personal Cosmic Report for ${report.profileName}*\n`;
  md += `**Birth Date**: ${report.birthDateFormatted} | **Life Path**: #${report.lifePathNumber} (${report.archetype})\n`;
  md += `**Curated On**: ${dateStr}\n\n`;
  md += `---\n\n`;

  if (report.customNotes) {
    md += `## ✍️ Personal Cosmic Intentions & Notes\n`;
    md += `> ${report.customNotes}\n\n---\n\n`;
  }

  if (report.blocks.length === 0) {
    md += `*No custom blocks selected yet. Browse your Cosmic Reading or Library and click "+ Add to Report" to build your personalized dossier.*\n`;
  } else {
    report.blocks.forEach((block, idx) => {
      md += `### ${idx + 1}. ${block.title} (${block.category})\n`;
      md += `${block.fullContent}\n\n`;
      md += `---\n\n`;
    });
  }

  md += `\n*Crafted with sacred geometric resonance by the Cosmic Numerology Engine.*\n`;
  return md;
}

/**
 * Generates email share link
 */
export function generateEmailShareLink(report: CustomCuratedReport): string {
  const subject = encodeURIComponent(`Cosmic Life Path #${report.lifePathNumber} Report — ${report.profileName}`);
  const summaryLines = report.blocks.map((b, i) => `${i + 1}. ${b.title}: ${b.summaryText}`).join('\n\n');
  const body = encodeURIComponent(
    `Greetings,\n\nHere is the curated Cosmic Life Path Report for ${report.profileName} (Life Path #${report.lifePathNumber} - ${report.archetype}, born ${report.birthDateFormatted}):\n\n` +
    `${summaryLines}\n\n` +
    (report.customNotes ? `Personal Notes:\n"${report.customNotes}"\n\n` : '') +
    `Explored with the Cosmic Numerology Sanctuary.`
  );
  return `mailto:?subject=${subject}&body=${body}`;
}

/**
 * Generates SMS / Text message share link
 */
export function generateSmsShareLink(report: CustomCuratedReport): string {
  const body = encodeURIComponent(
    `✨ Check out my Cosmic Life Path #${report.lifePathNumber} (${report.archetype}) Curated Report for ${report.profileName}! Born ${report.birthDateFormatted}. Key Highlights: ${report.blocks.slice(0, 3).map(b => b.title).join(', ')}`
  );
  return `sms:?&body=${body}`;
}

/**
 * Generates social share snippet for Twitter / Instagram / Threads / LinkedIn
 */
export function generateSocialPostText(report: CustomCuratedReport): string {
  const topStrengths = report.blocks.find(b => b.source === 'reading_strengths')?.summaryText || 'Mastery & Purpose';
  return (
    `✨ My Cosmic Life Path is #${report.lifePathNumber} (${report.archetype})!\n` +
    `Governed by sacred vibration & deep celestial insight. Curated report highlights: ${topStrengths}.\n\n` +
    `#Numerology #LifePath${report.lifePathNumber} #CosmicWisdom #SpiritualJourney`
  );
}

const LP_THEMES: Record<number, { accent: string; bgSoft: string; border: string; element: string }> = {
  1: { accent: '#D97706', bgSoft: '#FEF3C7', border: '#F59E0B', element: 'Solar Fire ☀️' },
  2: { accent: '#0284C7', bgSoft: '#E0F2FE', border: '#38BDF8', element: 'Lunar Waters 🌙' },
  3: { accent: '#E11D48', bgSoft: '#FFE4E6', border: '#FB7185', element: 'Prismatic Light 🎨' },
  4: { accent: '#059669', bgSoft: '#D1FAE5', border: '#34D399', element: 'Sacred Earth 🏛️' },
  5: { accent: '#0D9488', bgSoft: '#CCFBF1', border: '#2DD4BF', element: 'Cosmic Air 🌬️' },
  6: { accent: '#9333EA', bgSoft: '#F3E8FF', border: '#C084FC', element: 'Sacred Heart ❤️' },
  7: { accent: '#4F46E5', bgSoft: '#E0E7FF', border: '#818CF8', element: 'Deep Ether 🔮' },
  8: { accent: '#B45309', bgSoft: '#FEF3C7', border: '#FBBF24', element: 'Golden Earth 👑' },
  9: { accent: '#A21CAF', bgSoft: '#FAE8FF', border: '#F0ABFC', element: 'Starlight Galaxy 🌌' },
  11: { accent: '#D97706', bgSoft: '#FEF3C7', border: '#F59E0B', element: 'Cosmic Lightning ⚡' },
  22: { accent: '#0284C7', bgSoft: '#E0F2FE', border: '#38BDF8', element: 'Universal Architect 🏛️' },
  33: { accent: '#7C3AED', bgSoft: '#EDE9FE', border: '#A78BFA', element: 'Divine Compassion 💫' },
};

/**
 * Generates personalized standalone HTML printable report with visual styling
 * relative to the user's Life Path number and sacred geometry.
 */
export function generateHtmlReport(report: CustomCuratedReport): string {
  const theme = LP_THEMES[report.lifePathNumber] || LP_THEMES[1];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${report.title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
    
    * { box-sizing: border-box; }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      line-height: 1.65;
      color: #262422;
      max-width: 860px;
      margin: 40px auto;
      padding: 0 24px;
      background: #FAF8F5;
    }
    .dossier-frame {
      background: #FFFFFF;
      border: 2px solid ${theme.border};
      border-radius: 24px;
      padding: 44px;
      box-shadow: 0 15px 35px rgba(0,0,0,0.06);
      position: relative;
    }
    .header-banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid ${theme.border};
      padding-bottom: 24px;
      margin-bottom: 30px;
      gap: 20px;
    }
    .header-titles h1 {
      font-family: 'Cinzel', Georgia, serif;
      font-size: 26px;
      color: ${theme.accent};
      margin: 0 0 6px 0;
      letter-spacing: -0.01em;
    }
    .header-titles .subtitle {
      font-size: 14px;
      color: #78716C;
      font-style: italic;
    }
    .lp-emblem {
      width: 84px;
      height: 84px;
      border-radius: 20px;
      background: ${theme.accent};
      color: #FFFFFF;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      box-shadow: 0 8px 20px ${theme.border}60;
      flex-shrink: 0;
    }
    .lp-emblem .lbl { font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; opacity: 0.9; }
    .lp-emblem .num { font-size: 36px; line-height: 1; font-family: 'Cinzel', serif; }
    .meta-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      align-items: center;
      font-size: 13px;
      color: #57534E;
      margin-bottom: 28px;
      padding: 12px 18px;
      background: ${theme.bgSoft};
      border-radius: 12px;
      border: 1px solid ${theme.border}40;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      background: #FFFFFF;
      color: ${theme.accent};
      padding: 4px 12px;
      border-radius: 999px;
      font-weight: 700;
      font-size: 12px;
      border: 1px solid ${theme.border}80;
    }
    .notes-box {
      background: #FDFBF7;
      border-left: 4px solid ${theme.accent};
      padding: 16px 20px;
      border-radius: 8px;
      margin-bottom: 28px;
      font-style: italic;
      color: #44403C;
      box-shadow: inset 0 1px 3px rgba(0,0,0,0.02);
    }
    .card {
      background: #FFFFFF;
      border: 1px solid #E7E5E4;
      border-radius: 16px;
      padding: 22px 26px;
      margin-bottom: 20px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.02);
      page-break-inside: avoid;
    }
    .category {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: ${theme.accent};
      font-weight: 700;
      margin-bottom: 4px;
    }
    .card h2 {
      font-family: 'Cinzel', Georgia, serif;
      font-size: 18px;
      margin: 4px 0 12px 0;
      color: #1C1917;
    }
    .card-content {
      font-size: 14.5px;
      color: #44403C;
      line-height: 1.7;
    }
    footer {
      margin-top: 40px;
      text-align: center;
      font-size: 12px;
      color: #A8A29E;
      border-top: 1px solid #E7E5E4;
      padding-top: 20px;
      font-family: 'Cinzel', Georgia, serif;
      letter-spacing: 1px;
    }
    @media print {
      body { background: #FFFFFF; margin: 0; padding: 0; }
      .dossier-frame { border: 1px solid #999; box-shadow: none; padding: 20px; }
      .card { box-shadow: none; border-color: #DDD; }
    }
  </style>
</head>
<body>
  <div class="dossier-frame">
    <div class="header-banner">
      <div class="header-titles">
        <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: ${theme.accent}; margin-bottom: 4px;">Cosmic Path Sanctuary • Blueprint Dossier</div>
        <h1>${report.title}</h1>
        <div class="subtitle">Personalized numerological transmission for ${report.profileName}</div>
      </div>
      <div class="lp-emblem">
        <span class="lbl">Life Path</span>
        <span class="num">${report.lifePathNumber}</span>
      </div>
    </div>

    <div class="meta-bar">
      <span class="badge">Archetype: ${report.archetype}</span>
      <span class="badge">Element: ${theme.element}</span>
      <span>Born: <strong>${report.birthDateFormatted}</strong></span>
      <span>•</span>
      <span>Generated: <strong>${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong></span>
    </div>

    ${report.customNotes ? `<div class="notes-box"><strong>Personal Intentions & Reflections:</strong><br>${report.customNotes}</div>` : ''}

    ${report.blocks.length === 0
      ? `<div style="text-align:center; padding: 30px; color: #78716C;">No curated blocks selected. This blueprint was generated as a foundation dossier.</div>`
      : report.blocks.map((b, i) => `
        <div class="card">
          <div class="category">${b.category}</div>
          <h2>${i + 1}. ${b.title}</h2>
          <div class="card-content">${b.fullContent.replace(/\n/g, '<br>')}</div>
        </div>
      `).join('')
    }

    <footer>
      ✦ Consecrated by Cosmic Path Sanctuary • Intuitive Numerology Engine ✦
    </footer>
  </div>
</body>
</html>`;
}

