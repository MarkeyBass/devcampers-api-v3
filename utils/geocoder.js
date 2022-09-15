const NodeGeocoder = require('node-geocoder');

const options = {
  provider: process.env.GEOCODER_PROVIDER,  
  httpAddapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formater: null
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;