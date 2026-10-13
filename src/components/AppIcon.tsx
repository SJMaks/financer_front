import {
  DEFAULT_ICON,
  ICON_INDEX,
  type AppIconComponent,
} from './iconRegistry'
import { Circle } from 'lucide-react'

interface AppIconProps {
  /** Free-form icon name stored by the backend (e.g. "dollar"). */
  name: string
  className?: string
  size?: number
  strokeWidth?: number
}

/**
 * Renders an icon from the registry for the free-form `icon` strings used by
 * accounts and categories, with a safe fallback for unknown names. Lookup is
 * case-insensitive (via ICON_INDEX), so `arrowLeftRight`, `arrowleftright`
 * and stored backend values all resolve to the same icon.
 */
export function AppIcon({
  name,
  className,
  size = 20,
  strokeWidth = 2,
}: AppIconProps) {
  const Component: AppIconComponent =
    ICON_INDEX[name.trim().toLowerCase()] ??
    ICON_INDEX[DEFAULT_ICON] ??
    Circle

  return (
    <Component className={className} size={size} strokeWidth={strokeWidth} />
  )
}