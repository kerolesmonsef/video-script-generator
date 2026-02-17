const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');

puppeteer.use(StealthPlugin());

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-blink-features=AutomationControlled'
        ]
    });

    try {
        const page = await browser.newPage();

        await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36');

        const cookiesData = JSON.parse(fs.readFileSync('./cookies.json', 'utf8'));
        await page.setCookie(...cookiesData);
        console.log('✅ Cookies Injected Successfully!');

        console.log('🌐 Opening Grok Imagine...');
        try {
            await page.goto('https://grok.com/imagine', {
                waitUntil: 'networkidle2',
                timeout: 10000
            });
            console.log('✅ Page loaded successfully!');
        } catch (navError) {
            console.log('⚠️ Navigation timeout, but continuing...', navError);
            console.log('Current URL:', page.url());
        }

        console.log('🔍 Looking for Attach button...');
        await page.waitForSelector('button[aria-label="Attach"]', {timeout: 10000});
        await page.click('button[aria-label="Attach"]');
        console.log('✅ Clicked Attach button');

        console.log('🔍 Looking for Animate Image option...');
        await page.waitForSelector('div[role="menuitem"]', {timeout: 5000});


        console.log('✅ Clicked Animate Image option');

        console.log('📤 Waiting for file input...');
        const fileInput = await page.waitForSelector('input[type="file"]', {timeout: 5000});
        await fileInput.uploadFile('/home/kero/Downloads/images/c4.png');
        console.log('✅ Image uploaded successfully!');


    } catch (err) {
        console.error('❌ Error occurred:', err);
    }
})();