const fs = require('fs')

const storeGeoJSON = (geojson) => {
  fs.writeFileSync('./data/geojson.json', JSON.stringify(geojson))
}

const average = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length || 0

module.exports = { storeGeoJSON, average }
