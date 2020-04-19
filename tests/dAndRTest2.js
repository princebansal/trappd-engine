const data = require("../data/rawData2.json");

const obj = data["deathsAndRecoveries"].filter((value) => value.slno === null);
console.log(obj);
