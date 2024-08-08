const puppeteer = require("puppeteer-core");
const dotenv = require("dotenv");
dotenv.config();
const fs = require("fs");

(async () => {
  try {
    const SBR_WS_ENDPOINT = process.env.SBR_WS_ENDPOINT;
    console.log("Connecting to Scraping Browser...");
    const browser = await puppeteer.connect({
      browserWSEndpoint: SBR_WS_ENDPOINT,
    });
    const page = await browser.newPage();

    // Navigate to the login page
    await page.goto("https://x.com/i/flow/login", {
      waitUntil: "networkidle2",
    });

    // Wait for the phone number input field and type the phone number
    await page.waitForSelector('input[name="text"]');
    await page.type('input[name="text"]', "9800279590", { delay: 100 });

    // Click on the "Next" button
    await page.waitForSelector('button[role="button"] span:has-text("Next")');
    await page.click('button[role="button"] span:has-text("Next")');

    // Wait for the login button to appear and click it
    await page.waitForSelector('button[data-testid="LoginForm_Login_Button"]');
    await page.click('button[data-testid="LoginForm_Login_Button"]');

    // Optionally take a screenshot to verify
    await page.screenshot({ path: "login_process.png", fullPage: true });

    // Save the page HTML for further inspection
    const html = await page.content();
    const filePath = "./login.html";
    fs.writeFileSync(filePath, html);

    await browser.close();
  } catch (error) {
    console.error("An error occurred:", error);
  }
})();
