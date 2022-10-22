import {
  MapContainer,
  Marker,
  TileLayer,
  Popup,
  Polyline,
  ZoomControl,
} from 'react-leaflet'
import { data } from './mock'

const polyline = data.routes[0].geometry.map((step) => [
  step[0] * 10,
  step[1] * 10,
])

const DEPO_LAT = 48.161324
const DEPO_LON = 17.14068

const limeOptions = { color: 'black' }

export const Map = () => {
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

        <Polyline pathOptions={limeOptions} positions={polyline as any} />

        <ZoomControl position="bottomright" />
      </MapContainer>
    </div>
  )
}
