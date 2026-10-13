import { Provider } from 'react-redux'
import { QueryClientProvider } from '@tanstack/react-query'
import { AppRouter } from '@/app/AppRouter'
import { ThemeEffect } from '@/components/ThemeEffect'
import { ToastHost } from '@/components/ui/ToastHost'
import { queryClient } from '@/services/queryClient'
import { store } from '@/store'

/**
 * Application root: Redux (client state) + React Query (server state) +
 * React Router. The theme effect and toast host are mounted globally.
 */
export default function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeEffect />
        <AppRouter />
        <ToastHost />
      </QueryClientProvider>
    </Provider>
  )
}