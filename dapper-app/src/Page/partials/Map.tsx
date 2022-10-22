import {
  MapContainer,
  Marker,
  TileLayer,
  Popup,
  Polyline,
  ZoomControl,
  Circle,
} from 'react-leaflet'

const DEPO_LAT = 48.152778
const DEPO_LON = 17.127123

interface IRoute {
  geometry: [number, number][]
  cost: number
  distance: number
}
interface ISignificantPoint {
  geometry: { coordinates: [number, number] }
}

interface IMapProps {
  routes?: IRoute[]
  significantPoints?: ISignificantPoint[]
}

const colors = ['#FFABAB', '#87B37A', '#AF9164', '#4281A4', 'orange', 'purple']

export const Map = ({ routes, significantPoints }: IMapProps) => {
  console.log(significantPoints)

  return (
    <div id="map">
      <MapContainer center={[DEPO_LAT, DEPO_LON]} zoom={13} zoomControl={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
        />
        <Marker position={[DEPO_LAT, DEPO_LON]}>
          <Popup>DEPO</Popup>
        </Marker>

        {significantPoints?.map(({ geometry }, index) => (
          <Circle
            key={index}
            center={[geometry.coordinates[1], geometry.coordinates[0]]}
            pathOptions={{
              fillColor: '#E7FFAC',
              color: '#E7FFAC',
            }}
            radius={20}
          />
        ))}

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
