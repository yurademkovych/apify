const Apify = require('apify');

const {
    utils: { log },
} = Apify;

const { DETAIL } = require('./consts').LABELS;

exports.SEARCH = async ({ page }, { requestQueue }) => {
    await page.waitForSelector('div.s-asin');

    const asinData = await page.$$eval(
        'div.s-asin',
        (divs) => divs.map((div) => div.dataset.asin),
    );

    await asinData.map((e) => requestQueue.addRequest({
        url: `https://www.amazon.com/dp/${e}/ref=olp_aod_redir_impl1/146-7797046-7532502?_encoding=UTF8&aod=1`,
        userData: { label: DETAIL } }));
};

exports.DETAIL = async ({ page }) => {
    await page.waitForSelector('#aod-price-1');

    log.info('Scraping OFFERS');

    const cost = await page.$$eval('#aod-offer-price .a-price .a-offscreen', (el) => el.map((prs) => {
        return prs.textContent;
    }));

    const shipsFrom = await page.$$eval('#aod-offer-shipsFrom .a-fixed-left-grid-col.a-col-right .a-size-small.a-color-base', (el) => el.map((sh) => {
        return sh.textContent.trim();
    }));

    const shipsPrice = await page.$$eval('#fast-track-message #delivery-message', (el) => el.map((priceResult) => {
        return priceResult.textContent.trim().substring(0, 4);
    }));

    if (await page.$('#exports_desktop_undeliverable_buybox')) {
        log.info(`${url}: There is no offers in this region.`);
        return;
    }

    page.keyboard.press('Escape');

    log.info('Scraping DETAIL');

    const input = await Apify.getValue('INPUT');

    await page.waitForSelector('#ASIN');
    const ASIN = await page.$eval('#ASIN', (el) => el.value);

    const infos = await Apify.openKeyValueStore('info');
    await infos.setValue(ASIN, +await infos.getValue(ASIN) + cost.length);

    const title = await page.$eval('#productTitle', (el) => el.textContent.trim());
    const url = `https://www.amazon.com/dp/${ASIN}`;
    const description = await page.$eval('#productDescription', (el) => el.textContent.trim());
    const keyword = `${input.keyword}`;

    const data = [];

    for (let i = 0; i < cost.length; i++) {
        data.push({
            title,
            url,
            description,
            keyword,
            sellerName: shipsFrom[i],
            price: cost[i],
            shippingPrice: shipsPrice[i],
        });
    }
    await Apify.pushData(data);
};
