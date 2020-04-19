const service = require("./service");
const commander = require("commander");
const fetch = require("node-fetch");
const { rawDataURL, deathRecoveriesURL } = require("../config");
commander
  .version("1.0.0", "-v, --version")
  .usage("[OPTIONS]...")
  .option(
    "-ds, --dataService <address>",
    "Provide data service container address"
  )
  .parse(process.argv);

const dataServiceUrl = commander["dataService"];
const settings = { method: "GET" };
const data = {};
fetch(deathRecoveriesURL, settings)
  .then((res) => res.json())
  .then((json) => {
    data["deathsAndRecoveries"] = json["deaths_recoveries"];
  });
fetch(rawDataURL, settings)
  .then((res) => res.json())
  .then((json) => {
    data["rawData"] = json["raw_data"];
  })
  .then(() => {
    service.uploadDataToServer(data, dataServiceUrl, () => process.exit(1));
  });
