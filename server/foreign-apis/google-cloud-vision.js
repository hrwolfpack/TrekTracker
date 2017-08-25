const path = require('path');

// Imports the Google Cloud client library
const Vision = require('@google-cloud/vision');

// Instantiates a client
const vision = Vision();

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