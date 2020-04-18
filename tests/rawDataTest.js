const data= require("../data/rawData.json")

const totalDeaths=data["raw_data"].filter(value=>value.currentstatus==="Deceased").length;
console.log(totalDeaths);