const Apify = require('apify');

const apifyClient = Apify.newClient({ token: process.env.APIFY_TOKEN });

Apify.main(async () => {
    const actorClient = apifyClient.actor('herme7/amazon-scraper');
    if (!actorClient) throw new Error('Actor not found!');

    const lastSucceededRunClient = actorClient.lastRun({ status: 'SUCCEEDED' });
    if (!lastSucceededRunClient) throw new Error('There is no succeeded runs!');

    const { items } = await lastSucceededRunClient.dataset().listItems();

    function getGroupedBy(products, key) {
        const groups = {}; const

            result = [];
        products.forEach((a) => {
            if (!(a[key] in groups)) {
                groups[a[key]] = [];
                result.push(groups[a[key]]);
            }
            groups[a[key]].push(a);
            return result;
        });
        const arr = [];
        for (let i = 0; i < result.length; i++) {
            const sortByPrice = result[i].map((elem) => {
                elem.price = +elem.price.slice(-(elem.price.length - 1));
                return elem;
            });

            let minPrice = sortByPrice[0];

            sortByPrice.map((elem) => {
                if (elem.price < minPrice.price) minPrice = elem;
            });

            minPrice.price = `$${minPrice.price}`;
            arr.push(minPrice);
        }
        return arr;
    }
    await Apify.pushData(getGroupedBy(items, 'title'));
});
