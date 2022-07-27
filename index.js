const puppeteer = require('puppeteer');

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
    const browser = await puppeteer.launch();

    // Create a new page
    const page = await browser.newPage();

    // Website URL to export as pdf
    const website_url = 'https://dev-ohto.pantheonsite.io/tnb-pdf?nid=1588';

    // Open URL in current page
    await page.goto(website_url, { waitUntil: 'networkidle0' });

    //To reflect CSS used for screens instead of print
    await page.emulateMediaType('screen');

    await scrollPage(page);

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