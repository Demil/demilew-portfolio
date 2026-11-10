import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = 'C:\\Users\\hp\\.gemini\\antigravity\\brain\\fbef1fc1-7f89-48ce-84b2-aaf78b3e53f0\\screenshots';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function getFreshAdminToken() {
  try {
    const pythonCmd = '..\\backend\\.venv\\Scripts\\python.exe -c "from app.core.security import create_access_token; print(create_access_token(1))"';
    const token = execSync(pythonCmd, { cwd: 'd:\\My site\\frontend', encoding: 'utf8' }).trim();
    return token;
  } catch (err) {
    console.error('Failed to generate token via python:', err);
    return null;
  }
}

async function capture() {
  console.log('Launching Chrome from:', CHROME_PATH);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  try {
    const page = await browser.newPage();

    // 1. Desktop Dark Mode (Full Page)
    console.log('Capturing Desktop Dark Mode...');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto('http://127.0.0.1:3000', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await sleep(2500);

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
    console.log('Capturing Desktop Light Mode...');
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    });
    await sleep(600);
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'desktop_light_full.png'), fullPage: true });
    console.log('Captured: desktop_light_full.png');

    // 3. Amharic Language Mode (Hero view)
    console.log('Capturing Amharic Language Mode...');
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      const buttons = Array.from(document.querySelectorAll('button'));
      const amBtn = buttons.find(b => b.textContent && b.textContent.includes('አማ'));
      if (amBtn) amBtn.click();
    });
    await sleep(800);
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'desktop_amharic_hero.png') });
    console.log('Captured: desktop_amharic_hero.png');

    // 4. Tablet Layout (768x1024)
    console.log('Capturing Tablet Layout...');
    await page.setViewport({ width: 768, height: 1024 });
    await page.goto('http://127.0.0.1:3000', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await sleep(2000);
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'tablet_hero_view.png') });
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'tablet_full.png'), fullPage: true });
    console.log('Captured: tablet_full.png');

    // 5. Mobile Layout (390x844)
    console.log('Capturing Mobile Layout...');
    await page.setViewport({ width: 390, height: 844, isMobile: true });
    await page.goto('http://127.0.0.1:3000', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await sleep(2000);
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'mobile_hero.png') });
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'mobile_full.png'), fullPage: true });
    console.log('Captured: mobile_full.png');

    // 6. Admin Login View
    console.log('Capturing Admin Login...');
    await page.setViewport({ width: 1440, height: 900, isMobile: false });
    await page.goto('http://127.0.0.1:3000/admin/login', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await sleep(1500);
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'admin_login.png') });
    console.log('Captured: admin_login.png');

    // 7. Admin Authenticated Views
    const adminToken = getFreshAdminToken();
    if (adminToken) {
      console.log('Generated fresh admin token. Setting auth cookie on 127.0.0.1 and localhost...');
      await page.setCookie(
        {
          name: 'access_token',
          value: adminToken,
          domain: '127.0.0.1',
          path: '/',
          httpOnly: true,
          sameSite: 'Lax'
        },
        {
          name: 'access_token',
          value: adminToken,
          domain: 'localhost',
          path: '/',
          httpOnly: true,
          sameSite: 'Lax'
        }
      );

      // Admin Dashboard
      console.log('Capturing Admin Dashboard...');
      await page.goto('http://127.0.0.1:3000/admin', { waitUntil: 'domcontentloaded', timeout: 60000 });
      await sleep(2500);
      await page.screenshot({ path: path.join(OUTPUT_DIR, 'admin_dashboard.png'), fullPage: true });
      console.log('Captured: admin_dashboard.png');

      // Admin Skills Management
      console.log('Capturing Admin Skills Management...');
      await page.goto('http://127.0.0.1:3000/admin/skills', { waitUntil: 'domcontentloaded', timeout: 60000 });
      await sleep(2500);
      await page.screenshot({ path: path.join(OUTPUT_DIR, 'admin_skills.png'), fullPage: true });
      console.log('Captured: admin_skills.png');
    }

    console.log('All inspections and captures completed successfully!');
  } catch (err) {
    console.error('Error during screenshot capture:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

capture();
