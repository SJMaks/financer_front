import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ChartPie, Pencil, Receipt, Trash } from 'lucide-react'
import { AppIcon } from '@/components/AppIcon'
import { Button } from '@/components/ui/Button'
import { Card, CardBody } from '@/components/ui/Card'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { ErrorState } from '@/components/ui/ErrorState'
import { PageHeader } from '@/components/ui/PageHeader'
import { Skeleton } from '@/components/ui/Spinner'
import { useTranslation } from '@/i18n/useTranslation'
import { useMoney } from '@/hooks/useMoney'
import { getApiErrorStatus } from '@/services/error'
import { AccountFormModal } from './AccountFormModal'
import { useAccount, useDeleteAccount } from './accounts.hooks'

function DetailSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-56 w-full" />
    </div>
  )
}

export function AccountDetailPage() {
  const { accountId } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const money = useMoney()
  const numericId = Number(accountId)
  const isValidId = Number.isInteger(numericId) && numericId > 0

  const {
    data: account,
    isLoading,
    isError,
    error,
    refetch,
  } = useAccount(isValidId ? numericId : undefined)

  const deleteAccount = useDeleteAccount()
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const backLink = (
    <Link
      to="/accounts"
      className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
    >
      <ArrowLeft className="size-3.5" />
      {t('accounts.backToAccounts')}
    </Link>
  )

  if (!isValidId) {
    return (
      <div>
        <PageHeader title={t('nav.accounts')} eyebrow={backLink} />
        <ErrorState
          title={t('accounts.invalidTitle')}
          message={t('accounts.invalidMessage')}
        />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div>
        <PageHeader title={t('nav.accounts')} eyebrow={backLink} />
        <DetailSkeleton />
      </div>
    )
  }

  if (isError || !account) {
    const notFound = getApiErrorStatus(error) === 404
    return (
      <div>
        <PageHeader title={t('nav.accounts')} eyebrow={backLink} />
        <ErrorState
          error={error}
          title={notFound ? t('accounts.notFoundTitle') : t('accounts.loadErrorTitle')}
          onRetry={notFound ? undefined : () => void refetch()}
        />
      </div>
    )
  }

  const confirmDelete = () => {
    deleteAccount.mutate(
      { id: account.id, title: account.title },
      { onSuccess: () => navigate('/accounts', { replace: true }) },
    )
  }

  return (
    <div>
      <PageHeader
        eyebrow={backLink}
        title={account.title}
        description={
          account.description.length > 0 ? account.description : undefined
        }
        actions={
          <>
            <Button
              variant="outline"
              icon={<Receipt className="size-4" />}
              onClick={() => navigate(`/accounts/${account.id}/operations`)}
            >
              {t('accounts.operations')}
            </Button>
            <Button
              variant="outline"
              icon={<ChartPie className="size-4" />}
              onClick={() => navigate(`/accounts/${account.id}/statistics`)}
            >
              {t('accounts.statistics')}
            </Button>
            <Button
              variant="outline"
              icon={<Pencil className="size-4" />}
              onClick={() => setEditOpen(true)}
            >
              {t('common.edit')}
            </Button>
            <Button
              variant="danger"
              icon={<Trash className="size-4" />}
              onClick={() => setDeleteOpen(true)}
            >
              {t('common.delete')}
            </Button>
          </>
        }
      />

      <Card className="max-w-2xl">
        <CardBody>
          <div className="flex items-center gap-4">
            <span
              className="flex size-14 shrink-0 items-center justify-center rounded-2xl"
              style={{
                backgroundColor: `${account.color}26`,
                color: account.color,
              }}
            >
              <AppIcon name={account.icon} size={28} />
            </span>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t('accounts.currentBalance')}
              </p>
              <p className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                {money.format(account.balance)}
              </p>
            </div>
          </div>

          {account.description.length > 0 && (
            <p className="mt-5 border-t border-slate-200/60 pt-4 text-sm leading-relaxed text-slate-600 dark:border-slate-700/50 dark:text-slate-300">
              {account.description}
            </p>
          )}
        </CardBody>
      </Card>

      <AccountFormModal
        open={editOpen}
        account={account}
        onClose={() => setEditOpen(false)}
      />

      <ConfirmDialog
        open={deleteOpen}
        title={t('accounts.deleteTitle')}
        message={t('accounts.deleteMessage', { title: account.title })}
        confirmLabel={t('accounts.deleteConfirm')}
        loading={deleteAccount.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </div>
  )
}
