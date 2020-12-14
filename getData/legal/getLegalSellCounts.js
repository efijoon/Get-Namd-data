async function getLegalSellCounts(page) {
  const haghighiBuyCounts = await page.evaluate(() => {
    let counts = [];
    const tds = Array.from(
      document.querySelectorAll("table#ClientTypeTable tr td")
    );

    for (let i = 9; i < tds.length; ) {
      counts.push(tds[i].innerHTML);
      i += 25;
    }

    return counts;
  });

  return haghighiBuyCounts;
}

module.exports = getLegalSellCounts;
