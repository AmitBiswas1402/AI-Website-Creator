import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"

const MenuOptions = [
  {
    name: 'Pricing',
    path: '/pricing'
  },
  {
    name: 'Contact us',
    path: '/contact'
  }
]

const Header = () => {
  return (
    <div className="flex items-center justify-between p-3 shadow">
      {/* logo */}
      <div className="flex gap-2 items-center">
        <Image src={'/logo.svg'} alt='logo' width={35} height={35} />
        <h2 className="font-bold text-xl">AI Creator</h2>
      </div>

      {/* menu */}
      <div className="flex gap-3">
        {MenuOptions.map((menu, index) => (
          <Button key={index} variant={'ghost'}>{menu.name}</Button>
        ))}
      </div>

      {/* get started */}
      <div>
        <Button>Get Started <ArrowRight /></Button>
      </div>
    </div>
  )
}
export default Header