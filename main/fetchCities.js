const stateList = require("./stateList.json");
const util = require("util");
const fs = require("fs");
const puppeteer = require("puppeteer");

let dataSheetUrl =
  "https://docs.google.com/spreadsheets/u/1/d/e/2PACX-1vSc_2y5N0I67wDU38DjDh35IZSIS30rQf7_NYZhtYYGU1jJYT6_kDx4YpF-qw0LSlGsBYP8pqM_a1Pd/pubhtml#";
(async () => {
  console.log("Starting operation [", new Date(), "]");
  const startTime = new Date().getTime();
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 926 });
  await page.goto(dataSheetUrl, { timeout: 60000 });
  console.log("Connected to target");
  console.log("Evaluating website");
  // get hotel details
  let rawData = await page.evaluate(() => {
    let cases = [];
    // get the hotel elements
    let sheetRows = document
      .querySelector("#\\31\\32\\30\\37\\33\\37\\38\\30\\32\\33")
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
      if (rowCells[0].innerText && rowCells[1].innerText) {
        let rowJson = {};
        rowCells.forEach((rowCell, index) => {
          try {
            rowJson[tableHeaders[index]] = rowCell.innerText;
          } catch (exception) {
            console.err(exception);
          }
        });
        cases.push(rowJson);
      }
    });
    return cases;
  });
  const endTime = new Date().getTime();
  console.log("Response time ", (endTime - startTime) / 1000, "s");
  console.log(rawData.length);
  console.dir(rawData.slice(0, 3));
  generateInsertQueries(rawData, () => process.exit(1));
})();

function generateInsertQueries(data, callback) {
  var insertQueries = [];

  insertQueries = data.map((city, index) => {
    var code = city["District"];
    var name = code;
    var stateCode = stateList[city["State"].toLowerCase()];
    var otherName =
      city["Other Names/Spellings"] != null
        ? city["Other Names/Spellings"]
        : city["Notes"];
    return util.format(
      "INSERT into city (id,code, name, other_name, state_code,country_code) values(%d,'%s','%s','%s','%s','IN');",
      index + 1,
      code,
      name,
      otherName,
      stateCode
    );
  });
  //console.dir(insertQueries);
  fs.writeFile("citiesInsertQueries.txt", insertQueries.join("\n"), function (
    err
  ) {
    if (err) return console.log(err);
    console.log("File written successfully");
    callback();
  });
}
