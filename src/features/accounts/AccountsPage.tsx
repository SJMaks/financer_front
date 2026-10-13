import { useState } from 'react'
import { Wallet } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { PageHeader } from '@/components/ui/PageHeader'
import { Skeleton } from '@/components/ui/Spinner'
import { useTranslation } from '@/i18n/useTranslation'
import type { Account } from '@/types/api'
import { AccountCard } from './AccountCard'
import { AccountFormModal } from './AccountFormModal'
import { useAccounts, useDeleteAccount } from './accounts.hooks'

function AccountsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} className="h-44 w-full" />
      ))}
    </div>
  )
}

export function AccountsPage() {
  const { data: accounts, isLoading, isError, error, refetch } = useAccounts()
  const deleteAccount = useDeleteAccount()
  const { t } = useTranslation()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Account | undefined>(undefined)
  const [deleting, setDeleting] = useState<Account | undefined>(undefined)

  const openCreate = () => {
    setEditing(undefined)
    setFormOpen(true)
  }

  const openEdit = (account: Account) => {
    setEditing(account)
    setFormOpen(true)
  }

  const confirmDelete = () => {
    if (!deleting) return
    deleteAccount.mutate(
      { id: deleting.id, title: deleting.title },
      { onSuccess: () => setDeleting(undefined) },
    )
  }

  return (
    <div>
      <PageHeader
        title={t('accounts.title')}
        description={t('accounts.subtitle')}
        actions={
          <Button onClick={openCreate}>
            <span aria-hidden>+</span>
            {t('accounts.newAccount')}
          </Button>
        }
      />

      {isLoading && <AccountsGridSkeleton />}

      {isError && (
        <ErrorState error={error} onRetry={() => void refetch()} />
      )}

      {!isLoading && !isError && accounts?.length === 0 && (
        <EmptyState
          icon={<Wallet className="size-6" />}
          title={t('accounts.noAccountsTitle')}
          description={t('accounts.noAccountsDescription')}
          action={<Button onClick={openCreate}>{t('accounts.createAccount')}</Button>}
        />
      )}

      {!isLoading && !isError && (accounts?.length ?? 0) > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {accounts?.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              onEdit={() => openEdit(account)}
              onDelete={() => setDeleting(account)}
            />
          ))}
        </div>
      )}

      <AccountFormModal
        open={formOpen}
        account={editing}
        onClose={() => setFormOpen(false)}
      />

      <ConfirmDialog
        open={deleting !== undefined}
        title={t('accounts.deleteTitle')}
        message={t('accounts.deleteMessage', { title: deleting?.title ?? '' })}
        confirmLabel={t('accounts.deleteConfirm')}
        loading={deleteAccount.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(undefined)}
      />
    </div>
  )
}