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

client.getSecretValue({SecretId: secretName}, function(err, data) {
    if (err) {
        if (err.code === 'DecryptionFailureException')
            throw err;
        else if (err.code === 'InternalServiceErrorException')
            throw err;
        else if (err.code === 'InvalidParameterException')
            throw err;
        else if (err.code === 'InvalidRequestException')
            throw err;
        else if (err.code === 'ResourceNotFoundException')
            throw err;
    }
    else {
        // Decrypts secret using the associated KMS CMK.
        // Depending on whether the secret is a string or binary, one of these fields will be populated.
        if ('SecretString' in data) {
            secret = data.SecretString;
        } else {
            let buff = new Buffer(data.SecretBinary, 'base64');
            decodedBinarySecret = buff.toString('ascii');
        }
    }
    
    secResult = JSON.parse(secret);
    secKey = "APIKey";
    console.log('End Secrets Manager');
});

// ************** End Secrets Manageer Code ************** 



exports.handler = async (event,context) => {
    try {
       // console.log('Start API Key');
       //  console.log(getAPIKey());
       // console.log('END API Key');
        console.log('Start Request Body');
        console.log(JSON.stringify(event));
        console.log('End Request Body');
       //const res = await axios.post('https://cmsdevelop.servicenowservices.com/api/x_348558_tra_app/trabackend/techicalquestion', {"user_question":"Lambda Question","user_name":"Arun Mandalika","user_email":"arun.mandalika@cms.hhs.gov","user_preferred_name":"M1I2","URLRef":"https://trapoc.cms.gov/Content/Foundation_Introduction.htm"})
    //    const res = await axios.post('https://cmsdevelop.servicenowservices.com/api/x_348558_tra_app/trabackend/techicalquestion',JSON.stringify(event));
    
   
   
    const res = await axios.post('https://cmsdevelop.servicenowservices.com/api/x_348558_tra_app/trabackend/annotations', JSON.stringify(event), {
    headers: {
            'Authorization': secResult[secKey], 'Content-Type': 'application/json' 
            }
    });
    
    
    
       console.log('###### Start Response Body');
        console.log(res)
        console.log('End Response Body');
        
        return {
            statusCode: 200,
             headers: {'Access-Control-Allow-Origin': '*' , "Access-Control-Allow-Methods": "OPTIONS,POST,GET"},
           // body: (res)
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