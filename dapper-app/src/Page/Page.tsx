import { useState } from 'react'
import { generateMap, generateRoutes } from '../api/endpoints'
import { SplashScreenLoader } from '../components/SplashScreenLoader'
import { Map } from './partials/Map'
import { Modifications } from './partials/Modifications'
import { IRoutesFormValues, Routes } from './partials/Routes'
import { FormikHelpers } from 'formik'

export const Page = () => {
  const [routes, setRoutes] = useState()
  const [significantPoints, setSignificantPoints] = useState()

  const onFetchRoutes = async (
    { vehiclesCount }: IRoutesFormValues,
    { setSubmitting }: FormikHelpers<IRoutesFormValues>
  ) => {
    setSubmitting(true)
    const res = await generateRoutes({ vehiclesCount })

    if (res.success) {
      setRoutes(res?.content?.routes)
      setSubmitting(false)
    }
  }

  const onFetchSignificantPoints = async (vehiclesCount: number) => {
    const res = await generateMap({ vehiclesCount })

    setSignificantPoints(res?.content?.routes)
  }

  return (
    <>
      {false ? (
        <SplashScreenLoader />
      ) : (
        <div className="flex w-screen h-screen">
          <Modifications onFetchSignificantPoints={onFetchSignificantPoints} />

          <Map routes={routes} significantPoints={significantPoints} />

          <Routes onFetchRoutes={onFetchRoutes} />
        </div>
      )}
    </>
  )
}
