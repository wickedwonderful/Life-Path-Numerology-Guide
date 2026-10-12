import assert from 'node:assert';
import { calculateLifePath, reduceNumber, calculateNameNumerology, calculatePersonalVibrations, formatMarkdownReading, LIFE_PATH_DETAILS, calculateCoreNumbers } from '../src/utils/numerology.ts';
import { generateHtmlReport } from '../src/utils/reportStore.ts';
import { PRO_PLANS, PRO_PERKS } from '../src/utils/subscriptionStore.ts';

console.log('🧪 Starting Comprehensive Automated App Verification Suite...\n');

let passedTests = 0;
let failedTests = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`, err.message);
    failedTests++;
  }
}

async function runAsyncTest(name, fn) {
  try {
    await fn();
    console.log(`  ✅ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`, err.message);
    failedTests++;
  }
}

// 1. Numerology Reduction Tests
console.log('--- 1. Testing Numerology Core Engine ---');

runTest('reduceNumber preserves Master Numbers (11, 22, 33)', () => {
  assert.strictEqual(reduceNumber(11, true), 11);
  assert.strictEqual(reduceNumber(22, true), 22);
  assert.strictEqual(reduceNumber(33, true), 33);
  assert.strictEqual(reduceNumber(11, false), 2);
  assert.strictEqual(reduceNumber(22, false), 4);
  assert.strictEqual(reduceNumber(33, false), 6);
});

runTest('reduceNumber reduces single digit numbers correctly', () => {
  assert.strictEqual(reduceNumber(15, false), 6);
  assert.strictEqual(reduceNumber(28, false), 1); // 2+8=10 -> 1+0=1
  assert.strictEqual(reduceNumber(9, true), 9);
});

runTest('calculateLifePath handles MM/DD/YYYY format', () => {
  const trace = calculateLifePath('08/15/1995');
  assert.strictEqual(trace.month, 8);
  assert.strictEqual(trace.day, 15);
  assert.strictEqual(trace.year, 1995);
  // Month 8 -> 8, Day 15 -> 6, Year 1995 (1+9+9+5=24 -> 6) -> 8+6+6=20 -> 2
  assert.strictEqual(trace.finalLifePath, 2);
});

runTest('calculateLifePath handles YYYY-MM-DD format (standard HTML date input)', () => {
  const trace = calculateLifePath('1995-08-15');
  assert.strictEqual(trace.month, 8);
  assert.strictEqual(trace.day, 15);
  assert.strictEqual(trace.year, 1995);
  assert.strictEqual(trace.finalLifePath, 2);
});

runTest('calculateLifePath handles 2-digit years correctly (e.g. 08/15/95)', () => {
  const trace = calculateLifePath('08/15/95');
  assert.strictEqual(trace.year, 1995);
  assert.strictEqual(trace.finalLifePath, 2);
});

runTest('calculateLifePath handles European format (15/08/1995)', () => {
  const trace = calculateLifePath('15/08/1995');
  assert.strictEqual(trace.month, 8);
  assert.strictEqual(trace.day, 15);
  assert.strictEqual(trace.year, 1995);
  assert.strictEqual(trace.finalLifePath, 2);
});

runTest('calculateLifePath handles ISO date strings (2000-01-15T12:00:00.000Z)', () => {
  const trace = calculateLifePath('2000-01-15T12:00:00.000Z');
  assert.strictEqual(trace.year, 2000);
  assert.strictEqual(trace.month, 1);
  assert.strictEqual(trace.day, 15);
  assert.strictEqual(trace.finalLifePath, 9); // 1 + 6 + 2 = 9
});

runTest('calculateNameNumerology calculates Expression, Soul Urge, and Personality', () => {
  const res = calculateNameNumerology('Elena Vance');
  assert.ok(res.expression >= 1 && res.expression <= 33);
  assert.ok(res.soulUrge >= 1 && res.soulUrge <= 33);
  assert.ok(res.personality >= 1 && res.personality <= 33);
  assert.ok(res.details.words.length === 2);
});

runTest('calculatePersonalVibrations returns valid transit numbers', () => {
  const vib = calculatePersonalVibrations('08/15/1995', new Date('2026-10-01'));
  assert.ok(vib.personalYear >= 1 && vib.personalYear <= 9);
  assert.ok(vib.personalMonth >= 1 && vib.personalMonth <= 9);
  assert.ok(vib.personalDay >= 1 && vib.personalDay <= 9);
});

runTest('calculateCoreNumbers computes all 4 core blueprint energies', () => {
  const core = calculateCoreNumbers('Ada Lovelace', '1815-12-10');
  assert.strictEqual(typeof core.lifePath, 'number');
  assert.strictEqual(typeof core.destiny, 'number');
  assert.strictEqual(typeof core.soulUrge, 'number');
  assert.strictEqual(typeof core.personality, 'number');
  assert.ok(core.lifePath >= 1 && core.lifePath <= 33);
  assert.ok(core.destiny >= 1 && core.destiny <= 33);
});

runTest('generateHtmlReport produces personalized Life Path styling and element', () => {
  const mockReport = {
    id: 'test_rep',
    title: 'Cosmic Life Path Blueprint — Sophia',
    profileName: 'Sophia',
    birthDateFormatted: 'August 15, 1995',
    lifePathNumber: 2,
    archetype: 'The Intuitive Harmonizer',
    blocks: [
      {
        id: 'b1',
        title: 'Divine Diplomat',
        category: 'Essence',
        summaryText: 'Peace and empathy',
        fullContent: 'In unity, quiet strength moves mountains.',
        source: 'core_vibration',
        addedAt: new Date().toISOString(),
      },
    ],
    customNotes: 'Peace and balance.',
    updatedAt: new Date().toISOString(),
  };

  const html = generateHtmlReport(mockReport);
  assert.ok(html.includes('Lunar Waters 🌙'), 'HTML report contains Life Path #2 element');
  assert.ok(html.includes('#0284C7'), 'HTML report contains Life Path #2 accent color');
  assert.ok(html.includes('Sophia'), 'HTML report contains user profile name');
  assert.ok(html.includes('Life Path'), 'HTML report contains Life Path badge');
});

runTest('PRO_PLANS configuration contains monthly, annual, and lifetime VIP options', () => {
  assert.ok(PRO_PLANS.monthly && PRO_PLANS.monthly.price === '$9.99');
  assert.ok(PRO_PLANS.annual && PRO_PLANS.annual.price === '$4.99');
  assert.ok(PRO_PLANS.lifetime && PRO_PLANS.lifetime.price === '$99.00');
  assert.ok(PRO_PERKS.length >= 5);
});

// 2. Testing End-to-End HTTP Endpoints
console.log('\n--- 2. Testing Live API Endpoints (http://localhost:3000) ---');

async function runApiTests() {
  await runAsyncTest('GET / returns HTML frontend bundle', async () => {
    const res = await fetch('http://localhost:3000/');
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes('<div id="root">') || html.includes('Cosmic Path') || html.includes('Numerology'));
  });

  await runAsyncTest('POST /api/numerology/reading returns complete reading & trace', async () => {
    const res = await fetch('http://localhost:3000/api/numerology/reading', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Jordan Sparks',
        birthDate: '07/21/1988',
        survey: {
          focusArea: 'career',
          energyLevel: 'high_vitality',
          currentChallenge: 'Scaling my business',
          intention: 'Exponential prosperity and balance',
        },
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.reading, 'reading object present');
    assert.ok(data.trace, 'trace object present');
    assert.strictEqual(typeof data.reading.lifePathNumber, 'number');
    assert.ok(data.reading.markdownContent.length > 50);
  });

  await runAsyncTest('POST /api/horoscope/daily returns daily transit with lucky numbers', async () => {
    const res = await fetch('http://localhost:3000/api/horoscope/daily', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        birthDate: '07/21/1988',
        lifePathNumber: 9,
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.horoscope, 'horoscope object present');
    assert.strictEqual(typeof data.horoscope.personalDayNumber, 'number');
    assert.ok(data.horoscope.vibrationTheme);
    assert.ok(data.horoscope.luckyColor);
  });

  await runAsyncTest('POST /api/gemini/chat responds cleanly with advice', async () => {
    const res = await fetch('http://localhost:3000/api/gemini/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ sender: 'user', text: 'How do I align with my life path?' }],
        userProfile: { name: 'Jordan', lifePathNumber: 9 },
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.reply && data.reply.length > 10, 'reply string present');
  });

  await runAsyncTest('POST /api/vision/generate-image returns curated or generated image', async () => {
    const res = await fetch('http://localhost:3000/api/vision/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Golden sunrise over tranquil sacred temple',
        aspectRatio: '16:9',
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.imageUrl && data.imageUrl.startsWith('http') || data.imageUrl.startsWith('data:image'));
  });

  await runAsyncTest('POST /api/gemini/tts handles voice synthesis request with graceful fallback', async () => {
    const res = await fetch('http://localhost:3000/api/gemini/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: 'Embrace this moment of stillness.',
        voice: 'Kore',
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    // Either synthesizes audio or triggers device synthesis fallback
    assert.ok(data.audioUrl || data.fallback === true);
  });

  console.log('\n=============================================');
  console.log(`📊 Test Results: ${passedTests} passed, ${failedTests} failed`);
  console.log('=============================================');

  if (failedTests > 0) {
    process.exit(1);
  } else {
    console.log('✨ All automated verifications passed successfully! App is verified launch-ready.');
  }
}

runApiTests();
