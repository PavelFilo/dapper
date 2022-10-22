import { useState } from 'react'
import { generateRoutes } from '../api/endpoints'
import { SplashScreenLoader } from '../components/SplashScreenLoader'
import { Map } from './partials/Map'
import { Modifications } from './partials/Modifications'
import { Vehlices } from './partials/Vehlices'

export const Page = () => {
  const [routes, setRoutes] = useState()

  const onFetchRoutes = async (vehiclesCount: number) => {
    const res = await generateRoutes({ vehiclesCount })

    setRoutes(res?.content?.routes)
  }

  return (
    <>
      {false ? (
        <SplashScreenLoader />
      ) : (
        <div className="flex w-screen h-screen">
          <Modifications />

          <Map routes={routes} />

          <Vehlices onFetchRoutes={onFetchRoutes} />
        </div>
      )}
    </>
  )
}
