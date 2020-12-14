
async function getLegalBuyAmounts(page) {
    const buyAmounts = await page.evaluate(() => {
        let hoghoghiBuyAmounts = [];
    
        let table = document.querySelector('#ClientTypeBody');
        let amounts = table.getElementsByClassName("inline");
    
        for (let i = 2; i < amounts.length;i++) {
            hoghoghiBuyAmounts.push(amounts[i].getAttribute("title"));
            i += 12;
        }
    
        return hoghoghiBuyAmounts;
    });

    return buyAmounts;
}

module.exports = getLegalBuyAmounts;