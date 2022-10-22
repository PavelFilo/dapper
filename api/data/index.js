const fs = require('fs')
const {
  polygonToLine,
  lineOverlap,
  lineSegment,
  pointsWithinPolygon,
  collect,
} = require('@turf/turf')
const { storeGeoJSON, average } = require('../services/helper')
const { data } = require('./pasport')

// const rawdata = fs.readFileSync('./data/trolejbus.geojson')
// const trolejbus = JSON.parse(rawdata)
// const trolejBusLines = lineSegment(trolejbus)

// const rawStreets = fs.readFileSync('./data/cesty.geojson')
// const streets = JSON.parse(rawStreets)

// // const line = polygonToLine(data.features[10])

// // const overlaps = trolejbus.features.map((feature) =>
// //   lineIntersect(line, feature)
// // )

// // const lines = lineSegment(trolejbus)

// const overlaps = lineOverlap(streets.features[174], trolejbus.features[1130], {
//   tolerance: 0.2,
// })

// console.log(
//   'overlaps',
//   streets.features[174].geometry,
//   trolejbus.features[1130].geometry,
//   overlaps.features[0].geometry
// )

// // let totalOverlaps = []
// // let g = 0
// // for (let i = 0; i < streets.features.length; i++) {
// //   //   const element = array[i]

// //   const overlaps = trolejbus.features.map((feature) =>
// //     lineOverlap(streets.features[i], feature, { tolerance: 0.2 })
// //   )

// //   if (overlaps.filter(({ features }, j) => features.length > 0).length) {
// //     g += 1
// //   }
// //   totalOverlaps.push(...overlaps.flatMap(({ features }) => features))
// //   //   console.log(
// //   //     'overlap',
// //   //     overlaps.filter(({ features }) => features.length > 0)
// //   //   )
// // }

// // storeGeoJSON({ type: 'FeatureCollection', features: totalOverlaps })

// // console.log('len', g)
// // console.log('overlap', overlaps)

// // storeGeoJSON(line)

const loadJsonFromFile = (path) => {
  const raw = fs.readFileSync(path)
  return JSON.parse(raw)
}

const combinePointsMap = () => {
  const grid = loadJsonFromFile('./data/grid.geojson')

  const schools = loadJsonFromFile('./data/schools.geojson')

  const sourceProperty = 'school'
  const targetProperty = 'schoolsCount'

  const collected = collect(grid, schools, sourceProperty, targetProperty)
  collected.features = collected.features.map((feature) => ({
    ...feature,
    properties: {
      ...feature.properties,
      [targetProperty]: average(feature.properties[targetProperty]),
    },
  }))

  // storeGeoJSON(collected)

  const streets = loadJsonFromFile('./data/final.geojson')

  const streetPoints = {
    type: 'FeatureCollection',
    features: streets.features.flatMap((feature, index) =>
      feature.geometry.coordinates[0].map((coordinate) => ({
        type: 'Feature',
        properties: { streetIndex: index },
        geometry: {
          type: 'Point',
          coordinates: coordinate,
        },
      }))
    ),
  }

  console.log('stre', collected.features.length, streetPoints.features.length)

  for (let i = 0; i < collected.features.length; i++) {
    const grid = collected.features[i]

    // console.log('grid', grid.properties)
    if (grid.properties.schoolsCount > 0) {
      const pointsInGridTile = pointsWithinPolygon(streetPoints, grid)

      // console.assert(pointsInGridTile.features.length === 0, i)
      // console.log(
      //   'pointsInGridTile',
      //   pointsInGridTile.features.map((feature) => feature.properties.streetIndex)
      // )

      for (let j = 0; j < pointsInGridTile.features.length; j++) {
        const feature = pointsInGridTile.features[j]

        streets.features[feature.properties.streetIndex].properties = {
          ...streets.features[feature.properties.streetIndex].properties,
          hasSchool: 1,
        }
      }
    }
  }

  storeGeoJSON(streets)
}

combinePointsMap()
