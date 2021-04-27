const Apify = require('apify');
const axios = require('axios');

const apifyClient = Apify.newClient({ token: process.env.APIFY_TOKEN });

Apify.main(async () => {
    const input = await Apify.getInput();
    const { memory, maxItems, fields } = input;

    if (input.useClient) {
        const actorClient = apifyClient.task('herme7/amazon-task');
        if (!actorClient) throw new Error('Actor not found!');

        await Apify.callTask('herme7/amazon-task', { memoryMbytes: memory, waitSecs: 12000 });

        const runsClient = actorClient.runs();
        if (!runsClient) throw new Error('There is no succeeded runs!');

        const lastSucceededRunClient = actorClient.lastRun({ status: 'SUCCEEDED' });
        const { items } = await lastSucceededRunClient.dataset().listItems({ limit: maxItems, fields });

        const item = items;
        const replacer = (key, value) => (value === null ? '' : value);
        const header = Object.keys(item[0]);

        const csv = [
            header.join(','),
            ...item.map((row) => header.map((fieldName) => JSON.stringify(row[fieldName], replacer)).join(',')),
        ].join('\r\n');

        const store = await Apify.openKeyValueStore('OUTPUT');
        await store.setValue('OUTPUT', `${csv}`, { contentType: 'text/csv' });
    } else {
        await Apify.callTask('herme7/amazon-task', { memoryMbytes: memory, waitSecs: 12000 });
        const store = await Apify.openKeyValueStore('OUTPUT');
        // eslint-disable-next-line max-len
        const response = await axios.get(`https://api.apify.com/v2/datasets/KmkcNZuf9qRyzm44U/items?token=${process.env.APIFY_TOKEN}&format=csv&limit=${maxItems}&fields=${fields}`);
        await store.setValue('OUTPUT', `${response.data}`, { contentType: 'text/csv' });
    }
});
