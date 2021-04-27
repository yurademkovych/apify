const Apify = require('apify');
const tools = require('./src/tools');
const { SEARCH } = require('./src/consts').LABELS;
const { asinInfo, purgeAsinInfo } = require('./src/asinInfo');

const { utils: { log } } = Apify;

Apify.main(async () => {
    const input = await Apify.getInput();
    if (!input || !input.keyword) throw new Error('INPUT must contain a keyword!');

    const requestQueue = await Apify.openRequestQueue();
    await requestQueue.addRequest({ url: `https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=${input.keyword}`,
        userData: { label: SEARCH } });
    const router = tools.createRouter({ requestQueue });
    const proxyConfiguration = await Apify.createProxyConfiguration({
        groups: ['BUYPROXIES94952'],
        countryCode: 'US',
    });

    await purgeAsinInfo();
    const infos = await Apify.openKeyValueStore('info');
    asinInfo(infos, 20000);

    const crawler = new Apify.PuppeteerCrawler({
        requestQueue,
        proxyConfiguration,
        useSessionPool: true,
        sessionPoolOptions: {
            maxPoolSize: 100,
            sessionOptions: {
                maxUsageCount: 5,
            },
        },
        handlePageTimeoutSecs: 200,

        launchContext: {
            launchOptions: {
                headless: false,
            },
        },
        autoscaledPoolOptions: {
            maxConcurrency: 1,
        },
        maxRequestsPerCrawl: 50,

        handlePageFunction: async (context) => {
            const { request, page, puppeteerPool } = context;
            log.info(`Searching for keyword ${input.keyword}...`);
            log.info(`Processing ${request.url}`);

            await router(request.userData.label, context);
            if (page.url().includes('sorry')) {
                await puppeteerPool.retire(page.browser());
                throw new Error(`We got no way for ${request.url}`);
            }
        },

        handleFailedRequestFunction: async ({ request }) => {
            const debugDataSet = await Apify.openDataset('herme7/amazon');
            await debugDataSet.pushData({
                '#debug': Apify.utils.createRequestDebugInfo(request),
            });
            log.info(`Request ${request.url} failed too many times.`);
        },
    });

    await crawler.run();

    await Apify.call('apify/send-mail', {
        to: 'lukas@apify.com',
        subject: 'This is for the Apify SDK exercise from Yurii Demkovych',
        text: `https://api.apify.com/v2/datasets/${process.env.APIFY_DEFAULT_DATASET_ID}/items?clean=true&format=json`,
    });
});
