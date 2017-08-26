const path = require('path');

// Imports the Google Cloud client library
const Vision = require('@google-cloud/vision');

const vision;
if (process.env.NODE_ENV === 'development') {
  vision = Vision();
} else {
  vision = Vision({
    credentials: {
      "type": process.env.type,
      "project_id": process.env.project_id,
      "private_key_id": process.env.private_key_id,
      "private_key": process.env.private_key,
      "client_email": process.env.client_email,
      "client_id": process.env.client_id,
      "auth_uri": process.env.auth_uri,
      "token_uri": process.env.token_uri,
      "auth_provider_x509_cert_url": process.env.auth_provider_x509_cert_url,
      "client_x509_cert_url": process.env.client_x509_cert_url
    }
  });
}

// Instantiates a client
// const vision = Vision({
//   keyFilename: path.join(__dirname, '../../GAC.config.json')
// });

// The name of the image file to annotate
// const fileName = path.join(__dirname, 'bigsur.jpg');
// const imgUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/PRlight.jpg/260px-PRlight.jpg';


module.exports = (imgUrl) => {
  // Prepare the request object
  const request = {
    source: {
      // filename: fileName
      imageUri: imgUrl
    }
  };

  // Performs label detection on the image file
  return vision.labelDetection(request)
    .then((results) => {
      const labels = results[0].labelAnnotations;
      return labels;
      // console.log('Labels:');
      // labels.forEach((label) => console.log(label));
    })
    .catch((err) => {
      console.error('ERROR:', err);
    });
}