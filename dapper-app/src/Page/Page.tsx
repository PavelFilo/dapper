import { Modifications } from './partials/Modifications'
import { Vehlices } from './partials/Vehlices'

export const Page = () => {
  return (
    <div className="flex">
      <Modifications />

      <div className="w-full">map</div>

      <Vehlices />
    </div>
  )
}
