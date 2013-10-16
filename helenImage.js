var http = require('http');
var AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-2',acessKeyId:process.env.AWS_S3_SECRETACCESSKEYID,accessAccessKey:process.env.AWS_S3_SECRETACESSKEY});

var addImg = function(image) {
  var s3bucket = new AWS.S3({params: {Bucket: 'helenimages'}});
  s3bucket.putObject({
    ACL: 'public-read',
    Body: image,
    Bucket: 'helenimages',
    Key: process.env.AWS_S3_SECRETACESSKEY,
    ContenType: 'imgaes/jpeg'
  }
};

var addImage = function(image) {
  var options = {
    hostname: 'helenimages.s3.amazonaws.com',
    port: 80,
    method: 'POST'
  };
  var request = http.request(options,function(resposnse) {
  response.on('data', function(chunk) {
      console.log('add Image', chunk);
    });
  });
  request.on('error', function(e){
    console.log('problemt with request: ' + e.message);
  });
};


