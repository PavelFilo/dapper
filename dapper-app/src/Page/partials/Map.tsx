import {
  MapContainer,
  Marker,
  TileLayer,
  Popup,
  Polyline,
  ZoomControl,
} from 'react-leaflet'

const DEPO_LAT = 48.161324
const DEPO_LON = 17.14068

interface IRoute {
  geometry: [number, number][]
  cost: number
  distance: number
}

interface IMapProps {
  routes?: IRoute[]
  significantPoints?: IRoute[]
}

const colors = ['red', 'blue', 'green', 'yellow', 'orange', 'purple']

export const Map = ({ routes }: IMapProps) => {
  console.log(routes)

  return (
    <div id="map">
      <MapContainer center={[DEPO_LAT, DEPO_LON]} zoom={13} zoomControl={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[DEPO_LAT, DEPO_LON]}>
          <Popup>DEPO</Popup>
        </Marker>

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
