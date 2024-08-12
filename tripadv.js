const puppeteer = require("puppeteer-core");
const dotenv = require("dotenv");
const fs = require("fs");
dotenv.config();

(async () => {
  const SBR_WS_ENDPOINT = process.env.SBR_WS_ENDPOINT;
  console.log("Connecting to Scraping Browser...");
  const browser = await puppeteer.connect({
    browserWSEndpoint: SBR_WS_ENDPOINT,
  });
  const page = await browser.newPage();

  await page.goto("https://www.booking.com/", {
    waitUntil: "networkidle2",
    timeout: 0,
  });

  await page.waitForSelector('input[name="ss"]');

  // Type "Abu Dhabi" into the input field
  await page.type('input[name="ss"]', "Abu Dhabi", { delay: 1000 });
  console.log("Searched Abu Dhabi");

  // Take a screenshot before the search
  await page.screenshot({ path: "before_search.png", fullPage: true });

  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ waitUntil: "networkidle2", timeout: 60000 }),
  ]);
  console.log("Pressed submit and navigated");

  await page.screenshot({ path: "after_search.png", fullPage: true });

  const html = await page.content();
  const filePath = "./search.html";
  fs.writeFileSync(filePath, html);

  await browser.close();
})();
