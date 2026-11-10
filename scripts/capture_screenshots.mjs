import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = 'C:\\Users\\hp\\.gemini\\antigravity\\brain\\fbef1fc1-7f89-48ce-84b2-aaf78b3e53f0\\screenshots';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function capture() {
  console.log('Launching browser via Chrome executable at:', CHROME_PATH);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  try {
    const page = await browser.newPage();

    // 1. Desktop Dark Mode (Full Page)
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    // Ensure dark mode is active
    await page.evaluate(() => {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    });
    await new Promise(r => setTimeout(r, 600));

    await page.screenshot({ path: path.join(OUTPUT_DIR, 'desktop_dark_full.png'), fullPage: true });
    console.log('Captured: desktop_dark_full.png');

    // Section captures for detailed inspection
    const sections = [
      { id: 'hero', name: 'desktop_hero.png' },
      { id: 'about', name: 'desktop_about.png' },
      { id: 'experience', name: 'desktop_experience.png' },
      { id: 'projects', name: 'desktop_projects.png' },
      { id: 'research', name: 'desktop_research.png' },
      { id: 'skills', name: 'desktop_skills.png' },
      { id: 'education', name: 'desktop_education.png' },
      { id: 'contact', name: 'desktop_contact.png' }
    ];

    for (const sec of sections) {
      const el = await page.$(`#${sec.id}`) || await page.$(`[data-section="${sec.id}"]`);
      if (el) {
        await el.screenshot({ path: path.join(OUTPUT_DIR, sec.name) });
        console.log(`Captured: ${sec.name}`);
      }
    }

    // 2. Desktop Light Mode
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'desktop_light_full.png'), fullPage: true });
    console.log('Captured: desktop_light_full.png');

    // 3. Amharic Language Mode (Click language switcher)
    // Switch back to dark for consistency
    await page.evaluate(() => {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      // trigger Amharic toggle if button exists
      const buttons = Array.from(document.querySelectorAll('button'));
      const amBtn = buttons.find(b => b.textContent && b.textContent.includes('አማ'));
      if (amBtn) amBtn.click();
    });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'desktop_amharic.png'), fullPage: false });
    console.log('Captured: desktop_amharic.png');

    // 4. Tablet Layout (768x1024)
    await page.setViewport({ width: 768, height: 1024 });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'tablet_hero_view.png') });
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'tablet_full.png'), fullPage: true });
    console.log('Captured: tablet_full.png');

    // 5. Mobile Layout (390x844)
    await page.setViewport({ width: 390, height: 844, isMobile: true });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'mobile_hero.png') });
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'mobile_full.png'), fullPage: true });
    console.log('Captured: mobile_full.png');

    // 6. Admin Login View
    await page.setViewport({ width: 1440, height: 900, isMobile: false });
    await page.goto('http://localhost:3000/admin/login', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'admin_login.png') });
    console.log('Captured: admin_login.png');

    // 7. Admin Skills Management View (Simulate auth or view)
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'mock_jwt_token_for_inspection');
    });
    await page.goto('http://localhost:3000/admin/skills', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'admin_skills.png'), fullPage: true });
    console.log('Captured: admin_skills.png');

    console.log('All screenshots captured successfully.');
  } catch (err) {
    console.error('Error during screenshot capture:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

capture();

