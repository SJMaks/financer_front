import { PageHeader } from '@/components/ui/PageHeader'
import { useTranslation } from '@/i18n/useTranslation'
import { MonthlyStatisticsView } from './MonthlyStatisticsView'
import { useUserStatistics } from './statistics.hooks'

/** Overall statistics across all user accounts (GET /statistics). */
export function StatisticsPage() {
  const { t } = useTranslation()
  const { data: months, isLoading, isError, error, refetch } =
    useUserStatistics()

  return (
    <div>
      <PageHeader
        title={t('statistics.title')}
        description={t('statistics.subtitle')}
      />

      <MonthlyStatisticsView
        months={months}
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => void refetch()}
      />
    </div>
  )
}