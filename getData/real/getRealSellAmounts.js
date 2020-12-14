
async function getRealSellAmounts(page) {
    const buyAmounts = await page.evaluate(() => {
        let haghighiBuyAmount = [];
    
        let table = document.querySelector('#ClientTypeBody');
        let amounts = table.getElementsByClassName("inline");
    
        for (let i = 4; i < amounts.length;i++) {
            haghighiBuyAmount.push(amounts[i].getAttribute("title"));
            i += 12;
        }
    
        return haghighiBuyAmount;
    });

    return buyAmounts;
}

module.exports = getRealSellAmounts;