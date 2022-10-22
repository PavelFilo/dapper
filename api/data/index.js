const fs = require('fs')
const { polygonToLine, lineOverlap, lineSegment } = require('@turf/turf')
const { storeGeoJSON } = require('../services/helper')
const { data } = require('./pasport')

const rawdata = fs.readFileSync('./data/trolejbus.geojson')
const trolejbus = JSON.parse(rawdata)
const trolejBusLines = lineSegment(trolejbus)

const rawStreets = fs.readFileSync('./data/cesty.geojson')
const streets = JSON.parse(rawStreets)

// const line = polygonToLine(data.features[10])

// const overlaps = trolejbus.features.map((feature) =>
//   lineIntersect(line, feature)
// )

// const lines = lineSegment(trolejbus)

const overlaps = lineOverlap(streets.features[174], trolejbus.features[1130], {
  tolerance: 0.2,
})

console.log(
  'overlaps',
  streets.features[174].geometry,
  trolejbus.features[1130].geometry,
  overlaps.features[0].geometry
)

// let totalOverlaps = []
// let g = 0
// for (let i = 0; i < streets.features.length; i++) {
//   //   const element = array[i]

//   const overlaps = trolejbus.features.map((feature) =>
//     lineOverlap(streets.features[i], feature, { tolerance: 0.2 })
//   )

//   if (overlaps.filter(({ features }, j) => features.length > 0).length) {
//     g += 1
//   }
//   totalOverlaps.push(...overlaps.flatMap(({ features }) => features))
//   //   console.log(
//   //     'overlap',
//   //     overlaps.filter(({ features }) => features.length > 0)
//   //   )
// }

// storeGeoJSON({ type: 'FeatureCollection', features: totalOverlaps })

// console.log('len', g)
// console.log('overlap', overlaps)

// storeGeoJSON(line)
