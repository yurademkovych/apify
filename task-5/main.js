const Apify = require('apify');

const ApifyClient = require('apify-client');

const apifyClient = new ApifyClient({ token: 'k5YEny5rFcRAz7t5ZSQbL2fmF' });
const { utils: { log } } = Apify;

Apify.main(async () => {
    const input = await Apify.getValue('INPUT');
    process.env.APIFY_MEMORY_MBYTES = input.memory;
    const { maxItems } = input;
    const { fields } = input;

    function mapOut(sourceObject, removeKeys = []) {
        const sourceKeys = Object.keys(sourceObject);
        const returnKeys = sourceKeys.filter((k) => removeKeys.includes(k));
        const returnObject = {};
        returnKeys.forEach((k) => {
            returnObject[k] = sourceObject[k];
        });
        return returnObject;
    }

    if (input.useClient) {
        const actorClient = apifyClient.task('herme7/amazon-task');
        const lastSucceededRunClient = actorClient.lastRun({ status: 'SUCCEEDED' });
        const { items } = await lastSucceededRunClient.dataset().listItems();

        const itm = items.slice(0, maxItems);
        const newArray = itm.map((obj) => mapOut(obj, fields));

        const item = newArray;
        const replacer = (key, value) => (value === null ? '' : value);
        const header = Object.keys(item[0]);
        const csv = [
            header.join(','),
            ...item.map((row) => header.map((fieldName) => JSON.stringify(row[fieldName], replacer)).join(',')),
        ].join('\r\n');

        const store = await Apify.openKeyValueStore('OUTPUT');
        await store.setValue('OUTPUT', `${csv}`, { contentType: 'text/csv' });
    } else {
        const run = await Apify.callTask('herme7/amazon-task');
        log.info(`Received message: ${run.output.body.message}`);
    }
});
