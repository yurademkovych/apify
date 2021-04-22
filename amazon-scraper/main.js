const Apify = require('apify');
const tools = require('./src/tools');

const { utils: { log } } = Apify;

Apify.main(async () => {
    const input = await Apify.getValue('INPUT');
    if (!input || !input.keyword) throw new Error('INPUT must contain a keyword!');
    log.info(`Searching for keyword ${input.keyword}...`);

    const requestQueue = await Apify.openRequestQueue();
    await requestQueue.addRequest({ url: `https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=${input.keyword}`,
        userData: { label: 'SEARCH' } });
    const router = tools.createRouter({ requestQueue });
    const proxyConfiguration = await Apify.createProxyConfiguration({
        groups: ['BUYPROXIES94952'],
        countryCode: 'US',
    });

    const crawler = new Apify.PuppeteerCrawler({
        requestQueue,
        proxyConfiguration,
        useSessionPool: true,
        sessionPoolOptions: {
            maxPoolSize: 5,
        },
        handlePageTimeoutSecs: 200,

        launchContext: {
            launchOptions: {
                headless: true,
            },
        },
        autoscaledPoolOptions: {
            maxConcurrency: 1,
        },
        maxRequestsPerCrawl: 50,

        handlePageFunction: async (context) => {
            const { request, page, puppeteerPool } = context;
            log.info(`Processing ${request.url}`);
            await router(request.userData.label, context);
            if (page.url().includes('sorry')) {
                await puppeteerPool.retire(page.browser());
                throw new Error(`We got no way for ${request.url}`);
            }
        },

        handleFailedRequestFunction: async ({ request }) => {
            log.info(`Request ${request.url} failed too many times.`);
        },
    });

    await Apify.addWebhook({
        eventTypes: ['ACTOR.RUN.SUCCEEDED'],
        requestUrl: 'https://api.apify.com/v2/acts/herme7~best-offer/runs?token=k5YEny5rFcRAz7t5ZSQbL2fmF',
        idempotencyKey: 'vpByZGo6Fs6AynxoB',
    });

    await crawler.run();

    log.info('Crawler finished.');
});
