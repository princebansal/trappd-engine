const request = require("request");
const { Readable } = require("stream");

class ReadableString extends Readable {
  //sent = false;
  //str = "";
  constructor(str) {
    super();
    this.str = str;
    this.sent=false;
  }

  _read() {
    if (!this.sent) {
      this.push(Buffer.from(this.str));
      this.sent = true;
    } else {
      this.push(null);
    }
  }
}
module.exports = {
  uploadDataToServer: (content,url, callback) => {
    console.log("Uploading data to server");
    //const readable = Readable.from(data);
    var boundary = "xxxxxxxxxx";
    var data = "";
    data += "--" + boundary + "\r\n";
    data +=
      'Content-Disposition: form-data; name="data"; filename="' +
      "filename" +
      '"\r\n';
    data += "Content-Type:application/octet-stream\r\n\r\n";
    data += JSON.stringify(content);
    data += "\r\n--" + boundary + "--\r\n";
    var payload = new ReadableString(data);
    const options = {
      method: "POST",
      url: `http://${url}/engine/updateData`,
      port: 443,
      headers: {
        "Content-Type": "multipart/form-data; boundary=" + boundary,
      },
      body: payload,
    };

    request(options, function (err, res, body) {
      if (err) console.log(err);
      console.log(body);
      callback();
    });
  },
};
