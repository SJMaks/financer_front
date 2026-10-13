import {
  Baby,
  Banknote,
  Bike,
  BookOpen,
  Briefcase,
  Building,
  Bus,
  Camera,
  Car,
  ChartPie,
  Clapperboard,
  Coffee,
  Coins,
  CreditCard,
  DollarSign,
  Euro,
  Flag,
  Fuel,
  Gamepad2,
  Gift,
  Globe,
  GraduationCap,
  HandCoins,
  Heart,
  HeartPulse,
  House,
  Key,
  Landmark,
  Laptop,
  Leaf,
  Lightbulb,
  Music,
  PawPrint,
  Phone,
  PiggyBank,
  Plane,
  Receipt,
  Rocket,
  Shirt,
  ShoppingCart,
  ShoppingBag,
  Smartphone,
  Sprout,
  Stethoscope,
  Star,
  TrainFront,
  TrendingUp,
  Utensils,
  Vault,
  Wallet,
  Wifi,
  Wrench,
  Zap,
  Circle,
  Lock,
  ArrowLeftRight
} from 'lucide-react'
import type { ComponentType } from 'react'

export interface IconOption {
  value: string
  label: string
}

export type AppIconComponent = ComponentType<{
  className?: string
  size?: number | string
  strokeWidth?: number
}>

/**
 * Registry mapping the free-form `icon` string stored by the backend
 * (e.g. "dollar") to a concrete icon component. Unknown names fall back to a
 * neutral circle so old/foreign data never breaks rendering.
 *
 * Keys may use any casing (e.g. `arrowLeftRight`) — consumers must look icons
 * up through `ICON_INDEX`, which normalizes keys to lowercase.
 */
const ICON_REGISTRY: Record<string, AppIconComponent> = {
  wallet: Wallet,
  card: CreditCard,
  bank: Landmark,
  piggy: PiggyBank,
  dollar: DollarSign,
  euro: Euro,
  coins: Coins,
  cash: Banknote,
  vault: Vault,
  building: Building,
  gift: Gift,
  briefcase: Briefcase,
  rocket: Rocket,
  plane: Plane,
  house: House,
  car: Car,
  cart: ShoppingCart,
  shopping: ShoppingBag,
  food: Utensils,
  coffee: Coffee,
  health: HeartPulse,
  medical: Stethoscope,
  book: BookOpen,
  education: GraduationCap,
  music: Music,
  game: Gamepad2,
  phone: Phone,
  mobile: Smartphone,
  laptop: Laptop,
  camera: Camera,
  pet: PawPrint,
  plant: Sprout,
  leaf: Leaf,
  star: Star,
  flag: Flag,
  globe: Globe,
  fuel: Fuel,
  train: TrainFront,
  bus: Bus,
  bike: Bike,
  zap: Zap,
  tools: Wrench,
  shirt: Shirt,
  movie: Clapperboard,
  salary: HandCoins,
  trend: TrendingUp,
  chart: ChartPie,
  receipt: Receipt,
  heart: Heart,
  lightbulb: Lightbulb,
  wifi: Wifi,
  lock: Lock,
  key: Key,
  baby: Baby,
  home: House,
  circle: Circle,
  arrowLeftRight: ArrowLeftRight,
}

export const DEFAULT_ICON = 'circle'

/**
 * Case-insensitive lookup index built once at module load: both registry keys
 * (e.g. `arrowLeftRight`) and icon names stored by the backend are matched
 * lowercased, so casing differences can never silently fall back to a circle.
 * If two keys collide after normalization, the later one wins.
 */
export const ICON_INDEX: Record<string, AppIconComponent> = Object.fromEntries(
  Object.entries(ICON_REGISTRY).map(([key, component]) => [
    key.toLowerCase(),
    component,
  ]),
)

/** Options offered by icon pickers in account/category forms. */
export const ICON_OPTIONS: IconOption[] = Object.keys(ICON_REGISTRY)
  .filter((name) => name !== DEFAULT_ICON)
  .map((value) => ({
    value,
    label: value.charAt(0).toUpperCase() + value.slice(1),
  }))