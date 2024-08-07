const puppeteer = require("puppeteer-core");
const dotenv = require("dotenv");
dotenv.config();
const fs = require("fs");
async function takeScreenShot() {
  const SBR_WS_ENDPOINT = process.env.SBR_WS_ENDPOINT;
  console.log("Connecting to Scraping Browser...");
  const browser = await puppeteer.connect({
    browserWSEndpoint: SBR_WS_ENDPOINT,
  });
  const page = await browser.newPage();
  await page.goto("https://www.tripadvisor.in");
  await page.screenshot({ path: "screenshot.png" });
  const html = await page.content();
  const filePath = "./page.html";
  fs.writeFileSync(filePath, html);
  await browser.close();
}

takeScreenShot();
