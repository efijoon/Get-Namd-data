const puppeteer = require("puppeteer");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const Joi = require("joi");
const getDataDate = require("./getData/date/getDataDate");

const app = express();

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ====================  Haghighi section ============================ //
const getRealBuyAmounts = require("./getData/real/getRealBuyAmounts");
const getRealBuyCounts = require("./getData/real/getRealBuyCounts");
const getRealSellAmounts = require("./getData/real/getRealSellAmounts");
const getRealSellCounts = require("./getData/real/getRealSellCounts");
// ====================  Haghighi section ============================ //

// ====================  Hoghoghi section ============================ //
const getLegalBuyAmounts = require("./getData/legal/getLegalBuyAmounts");
const getLegalBuyCounts = require("./getData/legal/getLegalBuyCounts");
const getLegalSellCounts = require("./getData/legal/getLegalSellCounts");
const getLegalSellAmounts = require("./getData/legal/getLegalSellAmounts");
// ====================  Hoghoghi section ============================ //

const schema = Joi.object({
  namadName: Joi.string().required()
})

app.get("/", (req, res) => {
  res.render("index.html");
});

app.post("/goToData", (req, res) => {
  (async () => {
    try {
      const { namadName } = req.body;

      const browser = await puppeteer.launch({
        headless: false,
        waitUntil: "domcontentloaded",
      });

      const page = await browser.newPage();
      await page.goto("http://tsetmc.com/Loader.aspx?ParTree=15");

      await page.click("#search");

      await page.click("#SearchKey");
      await page.type("#SearchKey", `${req.body.namadName}`, {
        delay: 100,
      });
      await page.keyboard.press("Enter");

      await page.waitForTimeout(3000);

      page
        .waitForXPath(
          '//*[@id="SearchResult"]/div/div[2]/table/tbody/tr[1]/td[1]/a'
        )
        .then((selector) => selector.click())
        .catch(async (reason) => {
          await browser.close();
          return res.redirect('/');
        });

      await page.waitForTimeout(3000);
      // ================= we now enter to the namad page ============================= //
      await page.evaluate(async () => {
        let dataTab = document.getElementsByClassName("violet");
        await dataTab[0].click();
      });

      await page.waitForTimeout(3000);

      const realBuyPower = [];
      const realSellPower = [];
      const realBuyAmounts = await getRealBuyAmounts(page);
      const realBuyCounts = await getRealBuyCounts(page);
      const realSellAmounts = await getRealSellAmounts(page);
      const realSellCounts = await getRealSellCounts(page);

      const legalBuyPower = [];
      const legalSellPower = [];
      const legalBuyAmounts = await getLegalBuyAmounts(page);
      const legalBuyCounts = await getLegalBuyCounts(page);
      const legalSellAmounts = await getLegalSellAmounts(page);
      const legalSellCounts = await getLegalSellCounts(page);

      // ==== Loops throw Haghighi data and make their powers ======= //
      for (let i = 0; i < realBuyAmounts.length; i++) {
        realBuyPower.push(
          parseInt(numberWithOutCommas(realBuyAmounts[i])) /
            parseInt(numberWithOutCommas(realBuyCounts[i]))
        );

        realSellPower.push(
          parseInt(numberWithOutCommas(realSellAmounts[i])) /
            parseInt(numberWithOutCommas(realSellCounts[i]))
        );
      }

      // ==== Loops throw Hoghoghi data and make their powers ======= //
      for (let i = 0; i < legalBuyAmounts.length; i++) {
        legalBuyPower.push(
          parseInt(numberWithOutCommas(legalBuyAmounts[i])) /
            parseInt(numberWithOutCommas(legalBuyCounts[i]))
        );

        legalSellPower.push(
          parseInt(numberWithOutCommas(legalSellAmounts[i])) /
            parseInt(numberWithOutCommas(legalSellCounts[i]))
        );
      }

      // قدرت خریدار حقیقی به فروشنده حقیقی
      let realBuyerToSellerPower = [];
      // قدرت خریدار حقوقی به فروشنده حقوقی
      let legalBuyerToSellerPower = [];
      // ====== Loops throw haghighipower and make someother calculations
      for (let i = 0; i < realBuyPower.length; i++) {
        realBuyerToSellerPower.push(realBuyPower[i] / realSellPower[i]);

        legalBuyerToSellerPower.push(legalBuyPower[i] / legalSellPower[i]);
      }

      // Get date of each field
      const dates = await getDataDate(page);

      await browser.close();

      let dataToRespond = {
        name: req.body.namadName,
        dates,
        realBuyPower,
        realSellPower,
        legalBuyPower,
        legalSellPower,
        realBuyerToSellerPower,
        legalBuyerToSellerPower,
      };

      await browser.close();

      fs.writeFileSync(`./data/اطلاعات-حقیقی-حقوقی-نماد-${req.body.namadName}.json`, JSON.stringify(dataToRespond));
      return res.download(`./data/اطلاعات-حقیقی-حقوقی-نماد-${req.body.namadName}.json`);
    } catch (e) {
      if (e instanceof puppeteer.errors.TimeoutError) {
        console.log(e);
        await browser.close();
      }
    }
  })();
});

function numberWithOutCommas(number) {
  return number.toString().replace(/,/g, "");
}

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
