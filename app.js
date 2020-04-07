const puppeteer = require("puppeteer");

let dataSheetUrl =
  "https://docs.google.com/spreadsheets/u/1/d/e/2PACX-1vSc_2y5N0I67wDU38DjDh35IZSIS30rQf7_NYZhtYYGU1jJYT6_kDx4YpF-qw0LSlGsBYP8pqM_a1Pd/pubhtml#";
(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 926 });
  await page.goto(dataSheetUrl);

  // get hotel details
  let rawData = await page.evaluate(() => {
    let cases = [];
    // get the hotel elements
    let sheetRows = document
      .querySelector("#\\30")
      .querySelectorAll("tbody tr[style]");

    //get table headers
    let tableHeaders = Array.prototype.map.call(
      sheetRows[0].querySelectorAll("td"),
      (cell) => cell.innerText
    );
    console.dir(tableHeaders);
    let tableRows = Array.prototype.slice.call(sheetRows, 1);
    // get the hotel data
    tableRows.forEach((row) => {
      let rowCells = Array.prototype.slice.call(
        row.querySelectorAll("td"),
        0,
        tableHeaders.length
      );

      let rowJson = {};
      rowCells.forEach((rowCell, index) => {
        try {
          rowJson[tableHeaders[index]] = rowCell.innerText;
        } catch (exception) {
          console.err(exception);
        }
      });
      cases.push(rowJson);
    });
    return cases;
  });

  console.dir(rawData);
})();
