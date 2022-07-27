const puppeteer = require('puppeteer');

function imagesHaveLoaded() { return Array.from(document.images).every((i) => i.complete); }

(async () => {

    // Create a browser instance
    const browser = await puppeteer.launch();

    // Create a new page
    const page = await browser.newPage();

    // Website URL to export as pdf
    const website_url = 'https://dev-ohto.pantheonsite.io/tnb-pdf?nid=1588';

    // Open URL in current page
    await page.goto(website_url, { waitUntil: 'networkidle0' });

    // await page.waitForFunction(imagesHaveLoaded);

    //To reflect CSS used for screens instead of print
    await page.emulateMediaType('screen');

// Downlaod the PDF
    const pdf = await page.pdf({
        path: 'result.pdf',
        margin: { top: '100px', right: '50px', bottom: '100px', left: '50px' },
        printBackground: true,
        format: 'A4',
    });

    // Close the browser instance
    await browser.close();
})();