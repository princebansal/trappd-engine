const service = require("./service");

service.uploadDataToServer(["Prince"], () => {
  console.log("Completed");
});
