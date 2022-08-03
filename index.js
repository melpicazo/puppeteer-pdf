const puppeteer = require("puppeteer");

const scrollPage = async (page) => {
  await page.evaluate(() => {
    return new Promise((resolve, reject) => {
      let interval;
      const reachedBottom = () =>
        document.scrollingElement.scrollTop + window.innerHeight >=
        document.scrollingElement.scrollHeight;
      const scroll = async () => {
        document.scrollingElement.scrollTop += window.innerHeight / 2;
        if (reachedBottom()) {
          clearInterval(interval);
          document.scrollingElement.scrollTop = 0;
          resolve();
        }
      };
      interval = setInterval(scroll, 100);
    });
  });
};

(async () => {
  // Create a browser instance
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: {
      width: 450,
      height: 0,
    },
  });

  // Create a new page
  const page = await browser.newPage();

  // Website URL to export as pdf
  const website_url = "https://dev-ohto.pantheonsite.io/tnb-pdf?nid=1588";

  // Open URL in current pageå
  await page.goto(website_url, { waitUntil: "networkidle0" });

  //To reflect CSS used for screens instead of print
  await page.emulateMediaType("screen");

  // HACK: Scroll through whole page to load all images
  await scrollPage(page);

  // HACK: Save PDF as one page
  const scrollDimension = await page.evaluate(async () => {
    return {
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight + 1,
    };
  });

  await page.setViewport({
    width: 450,
    // width: scrollDimension.width,
    height: scrollDimension.height,
  });

  // Downlaod the PDF
  const pdf = await page.pdf({
    path: "result.pdf",
    printBackground: true,
    width: 450,
    height: scrollDimension.height,
    pageRanges: "1",
  });

  // Close the browser instance
  await browser.close();
})();
