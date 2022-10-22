import logo from '../assets/dapper.png'

export const SplashScreenLoader = () => (
  <div className="flex w-screen h-screen items-center justify-center">
    <img className="animate-pulse w-96" src={logo} alt="logo" />
  </div>
)
