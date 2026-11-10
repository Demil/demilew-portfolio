import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = 'C:\\Users\\hp\\.gemini\\antigravity\\brain\\fbef1fc1-7f89-48ce-84b2-aaf78b3e53f0\\screenshots';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function captureNotification() {
  const tempUserDataDir = path.join(process.env.TEMP || 'C:\\Temp', `puppeteer_${Date.now()}`);
  console.log('Launching browser with temp dir:', tempUserDataDir);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    userDataDir: tempUserDataDir,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    console.log('Navigating to http://127.0.0.1:3000...');
    await page.goto('http://127.0.0.1:3000', { waitUntil: 'domcontentloaded', timeout: 60000 });
    // Wait for the banner timer (1.2s delay) + hydration
    await sleep(2500);

    // 1. Full view showing Hero pointer + floating notification card + Navbar CV link
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'cv_pointer_notification_banner.png') });
    console.log('Captured: cv_pointer_notification_banner.png');

    // 2. Click dismiss button on banner to capture minimized pill
    const closeBtn = await page.$('aside button[title="Dismiss"]');
    if (closeBtn) {
      await closeBtn.click();
      await sleep(600);
      await page.screenshot({ path: path.join(OUTPUT_DIR, 'cv_minimized_pill.png') });
      console.log('Captured: cv_minimized_pill.png');
    }

    // 3. Mobile viewport capture
    await page.setViewport({ width: 390, height: 844, isMobile: true });
    await page.goto('http://127.0.0.1:3000', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await sleep(2500);
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'mobile_cv_notification.png') });
    console.log('Captured: mobile_cv_notification.png');

  } finally {
    await browser.close();
  }

  console.log('Capture script finished.');
}

captureNotification().catch(console.error);
