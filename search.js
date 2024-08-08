const puppeteer = require("puppeteer-core");
const dotenv = require("dotenv");
dotenv.config();
const fs = require("fs");

(async () => {
  const SBR_WS_ENDPOINT = process.env.SBR_WS_ENDPOINT;
  console.log("Connecting to Scraping Browser...");
  const browser = await puppeteer.connect({
    browserWSEndpoint: SBR_WS_ENDPOINT,
  });
  const page = await browser.newPage();

  // Set a higher timeout for navigation
  page.setDefaultNavigationTimeout(60000);

  // Set geolocation to New Delhi, India
  await page.setGeolocation({ latitude: 28.6139, longitude: 77.209 });

  // Intercept permission requests and allow geolocation access
  const context = browser.defaultBrowserContext();
  await context.overridePermissions("https://www.tripadvisor.in", [
    "geolocation",
  ]);

  // Navigate to the page with an increased timeout
  await page.goto("https://www.tripadvisor.in", {
    waitUntil: "networkidle2",
    timeout: 0,
  });

  // Wait for the search box and type "Dubai"
  await page.waitForSelector('input[name="q"]');
  await page.type('input[name="q"]', "Dubai", { delay: 100 });

  await page.screenshot({ path: "search1.png", fullPage: true });

  // Submit the search using the Enter key and wait for navigation
  await Promise.all([
    page.keyboard.press("Enter"),
    page.waitForNavigation({ waitUntil: "networkidle2", timeout: 0 }), // Increased timeout
  ]);

  // Wait for all the content to load completely
  //   await page.waitForFunction(
  //     'document.querySelectorAll("img").length > 0 && Array.from(document.querySelectorAll("img")).every(img => img.complete && img.naturalHeight > 0)',
  //     { timeout: 60000 }
  //   );

  // Custom function to wait for a specific amount of time
  //   const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  //   await wait(5000); // Wait for an additional 5 seconds

  // Take a screenshot after ensuring all content is fully loaded
  await page.screenshot({ path: "search_results.png", fullPage: false });

  // Save the page HTML
  const html = await page.content();
  const filePath = "./search.html";
  fs.writeFileSync(filePath, html);

  await browser.close();
})();
