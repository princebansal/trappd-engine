const service = require("./service");
const commander = require("commander");

const puppeteer = require("puppeteer");

commander
  .version('1.0.0', '-v, --version')
  .usage('[OPTIONS]...')
  .option('-ds, --dataService <address>', 'Provide data service container address')
  .parse(process.argv);
  
  const dataServiceUrl=commander["dataService"];
  console.log(dataServiceUrl);
  if(!dataServiceUrl){
    console.log("Please provide the data service address");
    process.exit(1);
  }

let dataSheetUrl =
  "https://docs.google.com/spreadsheets/u/1/d/e/2PACX-1vSc_2y5N0I67wDU38DjDh35IZSIS30rQf7_NYZhtYYGU1jJYT6_kDx4YpF-qw0LSlGsBYP8pqM_a1Pd/pubhtml#";
(async () => {
  console.log("Starting operation [", new Date(), "]");
  const startTime = new Date().getTime();
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox',
    '--disable-setuid-sandbox',
    // This will write shared memory files into /tmp instead of /dev/shm,
    // because Docker’s default for /dev/shm is 64MB
    '--disable-dev-shm-usage'],
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
      if (rowCells[0].innerText) {
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
  service.uploadDataToServer(rawData,dataServiceUrl, () => process.exit(1));
})();
