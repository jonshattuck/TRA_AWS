const axios = require('axios')

// ************** Start Secrets Manager Code ************** 
var AWS = require('aws-sdk'),
    region = "us-east-1",
    secretName = "arn:aws:secretsmanager:us-east-1:647432058324:secret:ServiceNowServiceAccountencodedcredentials-8zJxww",
    secret,
    decodedBinarySecret;
    
    var secResult;
    var secKey; 

// Create a Secrets Manager client
var client = new AWS.SecretsManager({
    region: region
});


// Use secrets manager client to get authorization
function getAuthorization() {
    return new Promise((resolve, reject)=> {
        client.getSecretValue({SecretId: secretName}, function(err, data){
            if (err) {
                reject(err)
            } 
            else {
                if ('SecretString' in data) {
                    resolve(JSON.parse(data.SecretString)["APIKey"])
                } 
                else {
                    let buff = new Buffer(data.SecretBinary, 'base64');
                    resolve(JSON.parse(buff.toString('ascii'))["APIKey"])
                }
            }
        });
    });
}


exports.handler = async (event,context) => {
    console.log("Process request")
    return await getAuthorization().then(async auth => {
       
        return  await axios.post('https://cmsitsm.servicenowservices.com/api/x_348558_tra_app/trabackend/techicalquestion', event, {
            headers: {
                'Authorization': auth, 'Content-Type': 'application/json'
            }
        })
        .then(response => {
            return response.data.result
        })
    })
};