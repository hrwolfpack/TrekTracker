const path = require('path');

// Imports the Google Cloud client library
const Vision = require('@google-cloud/vision');

// Instantiates a client
const vision = Vision();

// The name of the image file to annotate
const fileName = path.join(__dirname, 'bigsur.jpg');
const imgUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Dean_Franklin_-_06.04.03_Mount_Rushmore_Monument_(by-sa)-3_new.jpg/1200px-Dean_Franklin_-_06.04.03_Mount_Rushmore_Monument_(by-sa)-3_new.jpg';

// Prepare the request object
const request = {
  source: {
    // filename: imgUrl
    imageUri: imgUrl
  }
};

// Performs label detection on the image file
vision.labelDetection(request)
  .then((results) => {
    const labels = results[0].labelAnnotations;

    console.log('Labels:');
    labels.forEach((label) => console.log(label.description));
  })
  .catch((err) => {
    console.error('ERROR:', err);
  });