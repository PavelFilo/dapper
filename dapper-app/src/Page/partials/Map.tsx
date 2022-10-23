import {
  MapContainer,
  Marker,
  TileLayer,
  Popup,
  Polyline,
  ZoomControl,
  Circle,
} from 'react-leaflet'
import { icon } from 'leaflet'
import 'leaflet.heat'
import image from '../../assets/team-locations-marker-not-selected.png'
import { useEffect, useRef, useState } from 'react'
import { DEPO_LAT, DEPO_LON } from '../../constants'

export interface IRoute {
  geometry: [number, number][]
  cost: number
  distance: number
  duration: number
  vehicle: number
}
interface ISignificantPoint {
  geometry: {
    coordinates: [number, number]
  }
  properties: { isTrolley?: boolean; isCriticalPT?: boolean; class: number }
}

interface IWeather {
  points: { lat: number; lon: number; value: number }[]
}

interface IMapProps {
  routes?: IRoute[]
  weather?: IWeather
  significantPoints?: ISignificantPoint[]
}

export const colors = [
  '#FFABAB',
  '#87B37A',
  '#AF9164',
  '#4281A4',
  'orange',
  'purple',
]

export const Map = ({ routes, significantPoints, weather }: IMapProps) => {
  const [map, setMap] = useState(null)

  const markerIcon = icon({
    iconUrl: image,
    iconSize: [25.5, 32.58],
    iconAnchor: [12.75, 32.58],
  })

  useEffect(() => {
    const points = weather
      ? weather.points?.map(({ lat, lon, value }) => {
          return [lat, lon, value]
        })
      : []

    if (points.length) {
      // @ts-ignore
      L?.heatLayer(points)?.addTo(map)
    }
  }, [weather])

  return (
    <div id="map">
      <MapContainer
        ref={setMap}
        center={[DEPO_LAT, DEPO_LON]}
        zoom={13}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
        />
        <Marker icon={markerIcon} position={[DEPO_LAT, DEPO_LON]}>
          <Popup>DEPO</Popup>
        </Marker>

        {significantPoints?.map(({ geometry, properties }, index) => {
          const propertiesArray = [
            properties?.isTrolley ? 'Trolley line' : undefined,
            properties?.isCriticalPT ? 'Critical public transport' : undefined,
            properties?.class === 1
              ? 'Class 1'
              : properties?.class === 0.5
              ? 'Class 2'
              : undefined,
          ].filter(Boolean)

          return (
            <Circle
              key={index}
              center={[geometry.coordinates[1], geometry.coordinates[0]]}
              pathOptions={{
                fillColor: '#E7FFAC',
                color: '#E7FFAC',
              }}
              radius={20}
            >
              {!!propertiesArray.length && (
                <Popup>
                  <div>{propertiesArray.join(', ')}</div>
                </Popup>
              )}
            </Circle>
          )
        })}

        {routes?.map((route, index) => {
          return (
            <Polyline
              key={route.cost + route.distance}
              pathOptions={{ color: colors[index] }}
              positions={route.geometry.map(([lat, lng]) => [
                lat * 10,
                lng * 10,
              ])}
            />
          )
        })}

        <ZoomControl position="bottomright" />
      </MapContainer>
    </div>
  )
}
