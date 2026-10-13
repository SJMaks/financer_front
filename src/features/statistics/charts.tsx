import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useTranslation } from '@/i18n/useTranslation'
import { useAppSelector } from '@/store/hooks'
import { formatMoney, formatMonth } from '@/utils/format'

/** Minimal monthly row shape shared by user and account statistics. */
export interface MonthlyPoint {
  month: string
  income: number
  expense: number
  profit: number
}

interface ChartCommonProps {
  /** Currency code of the user; shown in tooltips. */
  currency?: string
}

/** Palette + text colors that follow the active theme. */
function useChartTheme() {
  const theme = useAppSelector((state) => state.ui.theme)
  const isDark = theme === 'dark'

  return {
    incomeColor: isDark ? '#34d399' : '#059669',
    expenseColor: isDark ? '#fb7185' : '#e11d48',
    profitColor: isDark ? '#38bdf8' : '#0284c7',
    axis: isDark ? '#94a3b8' : '#64748b',
    grid: isDark ? 'rgba(148, 163, 184, 0.12)' : 'rgba(100, 116, 139, 0.15)',
    tooltipBg: isDark ? '#0f172a' : '#ffffff',
    tooltipText: isDark ? '#e2e8f0' : '#0f172a',
    border: isDark ? '#334155' : '#e2e8f0',
  }
}

function ChartTooltip({
  active,
  payload,
  label,
  theme,
  currency,
}: {
  active?: boolean
  payload?: Array<{ name?: string; value?: number | string; color?: string }>
  label?: string | number
  theme: ReturnType<typeof useChartTheme>
  currency?: string
}) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div
      className="rounded-lg border px-3 py-2 text-xs shadow-lg"
      style={{
        backgroundColor: theme.tooltipBg,
        borderColor: theme.border,
        color: theme.tooltipText,
      }}
    >
      <p className="mb-1 font-semibold">{formatMonth(String(label ?? ''))}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="flex items-center gap-2">
          <span
            className="size-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          {entry.name}: {formatMoney(Number(entry.value ?? 0), currency)}
        </p>
      ))}
    </div>
  )
}

/** Grouped bars comparing income vs expense per month. */
export function IncomeExpenseChart({
  data,
  currency,
}: ChartCommonProps & { data: MonthlyPoint[] }) {
  const theme = useChartTheme()
  const { t } = useTranslation()

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} vertical={false} />
        <XAxis
          dataKey="month"
          tickFormatter={formatMonth}
          stroke={theme.axis}
          fontSize={12}
          tickLine={false}
          axisLine={{ stroke: theme.border }}
        />
        <YAxis
          stroke={theme.axis}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value: number) => value.toLocaleString()}
        />
        <Tooltip
          content={<ChartTooltip theme={theme} currency={currency} />}
          cursor={{ fill: theme.grid }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar
          dataKey="income"
          name={t('statistics.income')}
          fill={theme.incomeColor}
          radius={[4, 4, 0, 0]}
          maxBarSize={28}
        />
        <Bar
          dataKey="expense"
          name={t('statistics.expense')}
          fill={theme.expenseColor}
          radius={[4, 4, 0, 0]}
          maxBarSize={28}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

/** Profit trend per month with a zero reference line. */
export function ProfitChart({
  data,
  currency,
}: ChartCommonProps & { data: MonthlyPoint[] }) {
  const theme = useChartTheme()
  const { t } = useTranslation()

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} vertical={false} />
        <XAxis
          dataKey="month"
          tickFormatter={formatMonth}
          stroke={theme.axis}
          fontSize={12}
          tickLine={false}
          axisLine={{ stroke: theme.border }}
        />
        <YAxis
          stroke={theme.axis}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value: number) => value.toLocaleString()}
        />
        <Tooltip content={<ChartTooltip theme={theme} currency={currency} />} />
        <ReferenceLine y={0} stroke={theme.border} />
        <Line
          type="monotone"
          dataKey="profit"
          name={t('statistics.profit')}
          stroke={theme.profitColor}
          strokeWidth={2.5}
          dot={{ r: 3, fill: theme.profitColor }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}