const fs = require('fs')

const storeGeoJSON = (geojson) => {
  fs.writeFileSync('./data/geojson.json', JSON.stringify(geojson))
}

module.exports = { storeGeoJSON }
