console.log('starting tra review comments')
const axios = require('axios')

// ************** Start Secrets Manager Code ************** 
var AWS = require('aws-sdk'),
    region = "us-east-1",
    secretName = "arn:aws:secretsmanager:us-east-1:906170153649:secret:ServiceNowServiceAccountencodedcredentials-tnvKUZ",
    secret,
    decodedBinarySecret;
    
    
    var secResult;
    var secKey; 

// Create a Secrets Manager client
var client = new AWS.SecretsManager({
    region: region
});

// console.log("print aws data")
// console.log(AWS)

// console.log("client")
// console.log(client)

// console.log("SecretName: " + secretName)

// console.log(client.getSecretValue({SecretId: secretName}))

async function getSecrets() {
    return new Promise((resolve, reject)=> {
        client.getSecretValue({SecretId: secretName}, function(err, data){
            if (err) {
                reject(err)
            } 
            else {
                if ('SecretString' in data) {
                    resolve(data.SecretString);
                } 
                else {
                    let buff = new Buffer(data.SecretBinary, 'base64');
                    resolve(buff.toString('ascii'));
                }
            }
        });
    });
    // return new Promise((resolve, reject) => {
    //     client.getSecretValue({SecretId: secretName}, function(err, data) {
    //     console.log("getting secret value")
    //     if (err) {
    //         reject(err);
    //     }
    //     else {
    //         // Decrypts secret using the associated KMS CMK.
    //         // Depending on whether the secret is a string or binary, one of these fields will be populated.
    //         if ('SecretString' in data) {
    //             resolve(data.SecretString);
    //         } else {
    //             let buff = new Buffer(data.SecretBinary, 'base64');
    //             resolve(buff.toString('ascii'));
    //         }
    //     }
        
    //     // secResult = JSON.parse(secret);
    //     // secKey = "APIKey";
    //     console.log('End Secrets Manager');
    // });
    // }
}


// console.log('Key: ' + secKey);
// console.log('Sec Result: ' + secResult[secKey]);

// ************** End Secrets Manageer Code ************** 

exports.handler = async (event,context) => {
    console.log('handling')
    try {
        //console.log('Start Request Body');
        //console.log(JSON.stringify(event));
        const secret = await getSecrets();
        console.log(secret)
        console.log(JSON.parse(secret)["APIKey"])
        const booger = JSON.parse(secret)["APIKey"]
        // console.log("result")
        // console.log(result.SecretString)
        //     console.log('Key: ' + secKey);
        // console.log('Sec Result: ' + secResult[secKey]);
    const res = await axios.post('https://cmsdevelop.servicenowservices.com/api/x_348558_tra_app/trabackend/feedbacks',event , {
    headers: {
            'Authorization': booger, 'Content-Type': 'application/json' 
            }
    });
    
    
    
       console.log('###### Start Response Body');
       console.log('Showing Event');
    //   console.log(JSON.stringify(event));
        console.log(res)
        console.log('End Response Body');
        return {
            statusCode: 200,
             headers: {'Access-Control-Allow-Origin': '*' , "Access-Control-Allow-Methods": "OPTIONS,POST,GET"},
            body: 'Rest API call successful !'
        }
    } catch (e) {
        console.log(e)
        return {
            statusCode: 400,
             headers: {'Access-Control-Allow-Origin': '*' , "Access-Control-Allow-Methods": "OPTIONS,POST,GET"},
            body: JSON.stringify(e)
        }
    }
};