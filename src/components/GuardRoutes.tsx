import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'

/** Blocks anonymous users and forwards them to the login page. */
export function ProtectedRoute() {
  const token = useAppSelector((state) => state.auth.token)
  const location = useLocation()

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    )
  }

  return <Outlet />
}

/** Keeps authenticated users away from /login and /register. */
export function GuestOnlyRoute() {
  const token = useAppSelector((state) => state.auth.token)

  if (token) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}