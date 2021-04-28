const Apify = require('apify');
const axios = require('axios');

const client = Apify.newClient({ token: process.env.APIFY_TOKEN });
const { utils: { log } } = Apify;

Apify.main(async () => {
    const input = await Apify.getInput();
    const { memory, maxItems, fields } = input;
    const store = await Apify.openKeyValueStore('OUTPUT');

    if (input.useClient) {
        const actorClient = client.task('herme7/amazon-task');
        if (!actorClient) throw new Error('Actor not found!');

        await Apify.callTask('herme7/amazon-task', { memoryMbytes: memory });

        const runsClient = actorClient.runs();
        if (!runsClient) throw new Error('There is no succeeded runs!');

        const { defaultDatasetId, id } = runsClient;

        if (!id) {
            log.error('Invalid task parameters');
            await Apify.setValue('OUTPUT', {
                result: 'Invalid task parameters',
            });
            return;
        }

        const datasetClient = client.dataset(defaultDatasetId);
        const options = {
            limit: maxItems,
            fields,
        };

        const data = await datasetClient.downloadItems('csv', options);

        if (!data) {
            log.error('Failed to fetch dataset');

            await Apify.setValue('OUTPUT', {
                result: 'Failed to fetch dataset',
            });
            return;
        }
        await Apify.setValue('OUTPUT', data, { contentType: 'text/csv' });
    } else {
        const taskRunResponse = await axios.post(`https://api.apify.com/v2/actor-tasks/herme7~amazon-task/runs?token=${process.env.APIFY_TOKEN}`,
            { memoryMbytes: memory, waitSecs: 12000 });
        const { data: { data: { defaultDatasetId } } } = taskRunResponse;
        log.debug('taskRunResponse: ', taskRunResponse.data.data);
        // eslint-disable-next-line max-len
        const response = await axios.get(`https://api.apify.com/v2/datasets/${defaultDatasetId}/items?token=${process.env.APIFY_TOKEN}&format=csv&limit=${maxItems}&fields=${fields}`);
        await store.setValue('OUTPUT', `${response.data}`, { contentType: 'text/csv' });
    }
});
