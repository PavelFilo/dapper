import { colors, IRoute } from './Map'
import { TRouteData } from './Routes'

interface IVehiclesTableProps {
  routeData?: TRouteData
}

export const VehiclesTable = ({ routeData }: IVehiclesTableProps) => {
  return (
    <div className="flex mt-4 flex-col w-full">
      <div className="overflow-x-auto">
        {(routeData?.routes?.length || 0) > 1
          ? routeData?.routes.map((route, index) => (
              <div className="text-white mt-2" key={index}>
                <h4 className="font-bold border-b">
                  Vehicle {route.vehicle}{' '}
                  <span
                    className="relative rounded-full w-2.5 h-2.5 inline-block"
                    style={{ backgroundColor: colors[index] }}
                  />
                </h4>
                <p className="flex">
                  <span className="flex-1 font-semibold">Distance:</span>{' '}
                  {(2 * route.distance) / 1000} km
                </p>
                <p className="flex">
                  <span className="flex-1 font-semibold">Duration:</span>{' '}
                  {((2 * route.duration) / 60).toFixed(2)} min
                </p>
              </div>
            ))
          : null}

        {routeData?.summary ? (
          <div className="text-white mt-2">
            <h4 className="font-bold border-b">Summary</h4>
            <p className="flex">
              <span className="flex-1 font-semibold">Distance:</span>{' '}
              {(2 * routeData?.summary?.distance) / 1000} km
            </p>
            <p className="flex">
              <span className="flex-1 font-semibold">Duration :</span>{' '}
              {((2 * routeData?.summary?.duration) / 60).toFixed(2)} min
            </p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
