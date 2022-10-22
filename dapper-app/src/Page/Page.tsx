import { SplashScreenLoader } from '../components/SplashScreenLoader'
import { Map } from './partials/Map'
import { Modifications } from './partials/Modifications'
import { Vehlices } from './partials/Vehlices'

export const Page = () => {
  return (
    <>
      {false ? (
        <SplashScreenLoader />
      ) : (
        <div className="flex w-screen h-screen">
          <Modifications />

          <Map />

          <Vehlices />
        </div>
      )}
    </>
  )
}
