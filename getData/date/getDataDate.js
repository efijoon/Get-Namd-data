
async function getDataDate(page) {
    const dates = await page.evaluate(() => {

        let dates = [];
        let table = document.querySelector('#ClientTypeBody');
        let months = Array.from(table.getElementsByClassName("CalMonth"));
        let days = Array.from(table.getElementsByClassName("CalDay"));
    
        for (let i = 0; i < months.length; i++) {
            dates.push({ month: months[i].innerHTML, day: days[i].innerHTML });
        }

        return dates;

    });

    return dates;
}

module.exports = getDataDate;