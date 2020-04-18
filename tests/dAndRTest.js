const data= require("../data/deaths_recoveries.json")

const totalDeaths=data["deaths_recoveries"].filter(value=>value.patientstatus==="Deceased").length;
console.log(totalDeaths);