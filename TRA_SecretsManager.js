class TRA_SecretsManager {
  static getSecrets() {
    var AWS = require("aws-sdk"),
      region = "us-east-1",
      secretName =
        "arn:aws:secretsmanager:us-east-1:906170153649:secret:ServiceNowServiceAccountencodedcredentials-tnvKUZ",
      secret,
      decodedBinarySecret;

    var secResult;
    var secKey;

    // Create a Secrets Manager client
    var client = new AWS.SecretsManager({
      region: region,
    });

    client.getSecretValue({ SecretId: secretName }, function (err, data) {
      if (err) {
        reject(err);
      } else {
        if ("SecretString" in data) {
          resolve(JSON.parse(data.SecretString)["APIKey"]);
        } else {
          let buff = new Buffer(data.SecretBinary, "base64");
          resolve(JSON.parse(buff.toString("ascii"))["APIKey"]);
        }
      }
    });
  }
}
