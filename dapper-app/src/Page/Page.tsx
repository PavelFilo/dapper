import { useCallback, useState } from 'react'
import { generateMap, generateRoutes, weatherForecast } from '../api/endpoints'
import { SplashScreenLoader } from '../components/SplashScreenLoader'
import { IRoute, Map } from './partials/Map'
import {
  IModificationFormValues,
  Modifications,
} from './partials/Modifications'
import { IRoutesFormValues, Routes } from './partials/Routes'
import { FormikHelpers } from 'formik'
import weatherImage from '../assets/weather-cloudy.svg'

export const Page = () => {
  const [routeData, setRouteData] = useState<
    { routes: IRoute[]; summary: any } | undefined
  >()
  const [significantPoints, setSignificantPoints] = useState()
  const [weather, setWeather] = useState()
  const [isWeatherShown, setIsWeatherShown] = useState(false)

  const onFetchRoutes = useCallback(
    async (
      { vehiclesCount }: IRoutesFormValues,
      { setSubmitting }: FormikHelpers<IRoutesFormValues>
    ) => {
      setSubmitting(true)
      const res = await generateRoutes({ vehiclesCount })

      if (res.success) {
        setRouteData(res?.content)
        setSubmitting(false)
      }
    },
    [generateRoutes]
  )

  const onFetchSignificantPoints = useCallback(
    async (
      values: IModificationFormValues,
      { setSubmitting }: FormikHelpers<IModificationFormValues>
    ) => {
      setSubmitting(true)

      const res = await generateMap({
        weights: values,
        threshold: 1,
      })

      if (res.success) {
        setRouteData(undefined)
        setSignificantPoints(res?.content?.features.slice(0, 40))
        setSubmitting(false)
      }
    },
    [generateMap]
  )

  const onFetchWeather = useCallback(async () => {
    const res = await weatherForecast()

    setWeather(res?.content?.[0])
  }, [weatherForecast])

  return (
    <>
      {false ? (
        <SplashScreenLoader />
      ) : (
        <div className="flex w-screen h-screen">
          <Modifications onFetchSignificantPoints={onFetchSignificantPoints} />

          <Map
            weather={weather}
            routes={routeData?.routes}
            significantPoints={significantPoints}
          />

          <Routes
            routeData={routeData}
            hasSignificantPoints={!!significantPoints}
            onFetchRoutes={onFetchRoutes}
          />

          <button
            className={`z-500 absolute left-4 bottom-5 p-2 rounded-3xl transition-opacity bg-dark ${
              isWeatherShown ? 'opacity-0' : 'opacity-1'
            }`}
            onClick={() => {
              setIsWeatherShown(true)
              onFetchWeather()
            }}
          >
            <img className="icon" src={weatherImage} alt="" />
          </button>
        </div>
      )}
    </>
  )
}
