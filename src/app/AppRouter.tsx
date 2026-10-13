import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { GuestOnlyRoute, ProtectedRoute } from '@/components/GuardRoutes'
import { Spinner } from '@/components/ui/Spinner'
import { AppLayout } from '@/layouts/AppLayout'

/* Route-level code splitting keeps the initial (guest) bundle small. */
const LoginPage = lazy(() =>
  import('@/features/auth/LoginPage').then((m) => ({ default: m.LoginPage })),
)
const RegisterPage = lazy(() =>
  import('@/features/auth/RegisterPage').then((m) => ({ default: m.RegisterPage })),
)
const DashboardPage = lazy(() =>
  import('@/features/dashboard/DashboardPage').then((m) => ({ default: m.DashboardPage })),
)
const AccountsPage = lazy(() =>
  import('@/features/accounts/AccountsPage').then((m) => ({ default: m.AccountsPage })),
)
const AccountDetailPage = lazy(() =>
  import('@/features/accounts/AccountDetailPage').then((m) => ({ default: m.AccountDetailPage })),
)
const OperationsPage = lazy(() =>
  import('@/features/operations/OperationsPage').then((m) => ({ default: m.OperationsPage })),
)
const CategoriesPage = lazy(() =>
  import('@/features/categories/CategoriesPage').then((m) => ({ default: m.CategoriesPage })),
)
const StatisticsPage = lazy(() =>
  import('@/features/statistics/StatisticsPage').then((m) => ({ default: m.StatisticsPage })),
)
const AccountStatisticsPage = lazy(() =>
  import('@/features/statistics/AccountStatisticsPage').then((m) => ({ default: m.AccountStatisticsPage })),
)
const ProfilePage = lazy(() =>
  import('@/features/profile/ProfilePage').then((m) => ({ default: m.ProfilePage })),
)

function RouteFallback() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <Spinner className="size-8" />
    </div>
  )
}

/**
 * Route map:
 * - /login, /register         → guest only
 * - everything else           → protected, rendered inside the app shell
 */
export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route element={<GuestOnlyRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="/accounts" element={<AccountsPage />} />
              <Route path="/accounts/:accountId" element={<AccountDetailPage />} />
              <Route
                path="/accounts/:accountId/operations"
                element={<OperationsPage />}
              />
              <Route
                path="/accounts/:accountId/statistics"
                element={<AccountStatisticsPage />}
              />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/statistics" element={<StatisticsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}