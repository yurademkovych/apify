const Apify = require('apify');
const { MAX_SCROLL_ITERATIONS } = require('./consts');

const { utils: { log } } = Apify;

exports.Scroll = async function (page) {
    let offersCount;
    log.debug('Starting lazy load scroll.');

    for (let i = 0; i < MAX_SCROLL_ITERATIONS; i++) {
        offersCount = (await page.$$('#aod-offer')).length;

        await page.$eval('#aod-offer:last-of-type', (scroller) => {
            scroller.scrollIntoView(true);
        });

        if (!await page.$('#aod-end-of-results.aod-hide')) {
            log.debug(`offersCount after scroll - ${offersCount}`);
        }

        try {
            await page.waitForFunction(
                `document.querySelectorAll('#aod-offer').length > ${offersCount}`,
            );
        } catch (err) {
            log.error('Lazy scroll timeout.');
        }

        if (!await page.$('#aod-show-more-offers.aod-hide')) {
            log.error('Need more scroll.');
        }
    }
};
