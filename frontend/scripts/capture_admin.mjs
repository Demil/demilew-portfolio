import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = 'C:\\Users\\hp\\.gemini\\antigravity\\brain\\fbef1fc1-7f89-48ce-84b2-aaf78b3e53f0\\screenshots';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function getFreshAdminToken() {
  const pythonCmd = '..\\backend\\.venv\\Scripts\\python.exe -c "from app.core.security import create_access_token; print(create_access_token(1))"';
  return execSync(pythonCmd, { cwd: 'd:\\My site\\frontend', encoding: 'utf8' }).trim();
}

async function captureAdminAndAmharic() {
  const adminToken = getFreshAdminToken();
  console.log('Admin token generated successfully.');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    // Set cookie on localhost
    await page.setCookie({
      name: 'access_token',
      value: adminToken,
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      sameSite: 'Lax'
    });

    // 1. Amharic Full View
    console.log('Loading Amharic Homepage...');
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.evaluate(() => {
      localStorage.setItem('portfolio_language', 'am');
      window.location.reload();
    });
    await sleep(2500);
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'desktop_amharic_full.png'), fullPage: false });
    console.log('Captured: desktop_amharic_full.png');

    // Reset language to English
    await page.evaluate(() => {
      localStorage.setItem('portfolio_language', 'en');
    });

    // 2. Admin Dashboard
    console.log('Navigating to Admin Dashboard...');
    await page.goto('http://localhost:3000/admin', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await sleep(2500);
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'admin_dashboard.png'), fullPage: true });
    console.log('Captured: admin_dashboard.png');

    // 3. Admin Skills Management (Showing Dynamic Skill Cards, Add/Rename/Delete Card buttons)
    console.log('Navigating to Admin Skills...');
    await page.goto('http://localhost:3000/admin/skills', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await sleep(2500);
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'admin_skills.png'), fullPage: true });
    console.log('Captured: admin_skills.png');

    // 4. Admin Projects Management
    console.log('Navigating to Admin Projects...');
    await page.goto('http://localhost:3000/admin/projects', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await sleep(2500);
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'admin_projects.png'), fullPage: true });
    console.log('Captured: admin_projects.png');

  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    await browser.close();
  }
}

captureAdminAndAmharic();

