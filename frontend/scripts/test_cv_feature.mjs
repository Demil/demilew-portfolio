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

async function run() {
  console.log('Generating admin token...');
  const adminToken = getFreshAdminToken();

  // Create a minimal valid PDF file for testing
  const dummyPdfPath = path.join(process.cwd(), 'temp_Demilew_Terefe_CV.pdf');
  const minimalPdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>
endobj
4 0 obj
<< /Length 51 >>
stream
BT
/F1 12 Tf
72 712 Td
(Demilew Terefe - Curriculum Vitae) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000201 00000 n 
trailer
<< /Size 5 /Root 1 0 R >>
startxref
302
%%EOF`;

  fs.writeFileSync(dummyPdfPath, minimalPdfContent, 'binary');
  console.log('Created temporary test PDF at:', dummyPdfPath);

  // Upload via API
  console.log('Uploading CV to http://127.0.0.1:8000/api/v1/profile/cv/upload...');
  const curlCmd = `curl.exe -X POST "http://127.0.0.1:8000/api/v1/profile/cv/upload" -H "Authorization: Bearer ${adminToken}" -F "file=@${dummyPdfPath};type=application/pdf"`;
  const uploadResult = execSync(curlCmd, { encoding: 'utf8' });
  console.log('Upload response:', uploadResult);

  // Launch browser to capture screenshots
  console.log('Launching browser to capture Admin Profile and Homepage...');
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

    // 1. First establish domain context
    console.log('Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await sleep(1500);

    // 2. Admin Profile Page (Showing CV Management Card with uploaded CV)
    console.log('Navigating to http://localhost:3000/admin/profile...');
    await page.goto('http://localhost:3000/admin/profile', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await sleep(3000);
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'admin_profile_cv.png'), fullPage: true });
    console.log('Captured: admin_profile_cv.png');

    // 2. Homepage (Showing View CV & Download CV in Hero and Contact sections)
    console.log('Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await sleep(2500);
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'homepage_hero_cv.png') });
    console.log('Captured: homepage_hero_cv.png');

    // Scroll to contact section
    const contactEl = await page.$('#contact');
    if (contactEl) {
      await contactEl.scrollIntoView();
      await sleep(1000);
      await contactEl.screenshot({ path: path.join(OUTPUT_DIR, 'homepage_contact_cv.png') });
      console.log('Captured: homepage_contact_cv.png');
    }

  } finally {
    await browser.close();
    // Clean up temporary file
    if (fs.existsSync(dummyPdfPath)) {
      fs.unlinkSync(dummyPdfPath);
    }
  }

  console.log('Verification completed successfully!');
}

run().catch(console.error);
