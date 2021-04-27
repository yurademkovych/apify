const Apify = require('apify');

const { utils: { log } } = Apify;

exports.asinInfo = async function (infos, interval) {
    setInterval(async () => {
        const data = {};
        const keys = [];

        await infos.forEachKey((key) => {
            keys.push(key);
        });

        const dataValue = await Promise.all(keys.map((key) => infos.getValue(key)));
        keys.forEach((key, i) => {
            data[key] = dataValue[i];
        });
        log.info('Dataset statistics: ', data);
    }, interval);
};

exports.purgeAsinInfo = async () => {
    const dataset = await Apify.openDataset();

    if (!await dataset.getInfo().itemCount) {
        const infos = await Apify.openKeyValueStore('info');

        await infos.drop();
    }
};
