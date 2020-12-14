async function getLegalBuyCounts(page) {
    const hoghoghiBuyCounts = await page.evaluate(() => {
      let counts = [];
      const tds = Array.from(
        document.querySelectorAll("table#ClientTypeTable tr td")
      );
  
      for (let i = 7; i < tds.length; ) {
        counts.push(tds[i].innerHTML);
        i += 25;
      }
  
      return counts;
    });
  
    return hoghoghiBuyCounts;
  }
  
  module.exports = getLegalBuyCounts;
  