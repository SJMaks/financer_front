/**
 * TypeScript types mirroring the Swagger 2.0 specification in `swagger.json`.
 * Field names and shapes follow the backend contract exactly.
 */

/** Error body returned by the API (`HTTPError` definition). */
export interface HTTPError {
  code: string
  error: string
}

/* ------------------------------------------------------------------ */
/* Users / auth                                                        */
/* ------------------------------------------------------------------ */

/** POST /auth/login — `LoginRequestDTO` */
export interface LoginRequest {
  login: string
  password: string
}

/** POST /auth/login — `LoginResponseDTO` */
export interface LoginResponse {
  jwt: string
}

/** POST /auth/register — `UserRegisterDTO` */
export interface RegisterRequest {
  full_name: string
  login: string
  password: string
}

/** GET/PATCH /users/me — `UserResponseDTO` (includes default currency) */
export interface User {
  full_name: string
  login: string
  /** Currency code chosen by the user, e.g. 'dollar' or 'euro'. */
  currency: string
}

/** PATCH /users/me — `UpdateRequestDTO` */
export interface UpdateUserRequest {
  full_name: string
  currency: string
}

/* ------------------------------------------------------------------ */
/* Accounts                                                            */
/* ------------------------------------------------------------------ */

/** GET/POST /accounts, GET/PATCH/DELETE /accounts/{id} — `ResponseAccountDTO` */
export interface Account {
  id: number
  title: string
  description: string
  balance: number
  color: string
  icon: string
  version: number
}

/** POST /accounts — `CreateAccountDTO` */
export interface CreateAccountRequest {
  title: string
  description: string
  balance: number
  color: string
  icon: string
}

/** PATCH /accounts/{id} — `UpdateAccountDTO` */
export interface UpdateAccountRequest extends CreateAccountRequest {
  version: number
}

/** GET /accounts — `ResponseAccountsDTO` */
export interface AccountsResponse {
  accounts: Account[]
}

/* ------------------------------------------------------------------ */
/* Operation types                                                     */
/* ------------------------------------------------------------------ */

/** GET /operation_types — `ResponseOperationTypeDTO` */
export interface OperationType {
  id: number
  title: string
}

/** GET /operation_types — `ResponseOperationTypesDTO` */
export interface OperationTypesResponse {
  operation_types: OperationType[]
}

/* ------------------------------------------------------------------ */
/* Categories                                                          */
/* ------------------------------------------------------------------ */

/** GET/POST /categories, GET/PATCH/DELETE /categories/{id} — `ResponseCategoryDTO` */
export interface Category {
  id: number
  title: string
  color: string
  icon: string
  operation_type_id: number
  version: number
}

/** POST /categories — `CreateCategoryDTO` */
export interface CreateCategoryRequest {
  title: string
  color: string
  icon: string
  operation_type_id: number
}

/** PATCH /categories/{id} — `UpdateCategoryDTO` */
export interface UpdateCategoryRequest extends CreateCategoryRequest {
  version: number
}

/** GET /categories — `ResponseCategoriesDTO` */
export interface CategoriesResponse {
  categories: Category[]
}

/* ------------------------------------------------------------------ */
/* Operations                                                          */
/* ------------------------------------------------------------------ */

/** GET/POST/PATCH/DELETE operations — `ResponseOperationDTO` */
export interface Operation {
  id: number
  account_id: number
  category_id: number
  title: string
  description: string
  sum: number
  exec_at: string
  version: number
}

/** POST /accounts/{accountID}/operations — `CreateOperationDTO` */
export interface CreateOperationRequest {
  title: string
  description: string
  sum: number
  exec_at: string
  category_id: number
}

/** PATCH /accounts/{accountID}/operations/{operationID} — `UpdateOperationDTO` */
export interface UpdateOperationRequest extends CreateOperationRequest {
  version: number
}

/** GET /accounts/{accountID}/operations — `ResponseOperationsDTO` */
export interface OperationsResponse {
  items: Operation[]
  limit: number
  offset: number
  total: number
}

/** Supported values of the `sort` query parameter. */
export type OperationSortField = 'exec_at' | 'sum'

/** Supported values of the `order` query parameter. */
export type SortOrder = 'asc' | 'desc'

/** Query parameters supported by GET /accounts/{accountID}/operations. */
export interface OperationsQuery {
  limit?: number
  offset?: number
  /** Operation type title as accepted by the API ('income' | 'expense'). */
  type?: string
  category_id?: number
  /** RFC3339 timestamp. */
  min_date?: string
  /** RFC3339 timestamp. */
  max_date?: string
  sort?: OperationSortField
  order?: SortOrder
}

/* ------------------------------------------------------------------ */
/* Statistics                                                          */
/* ------------------------------------------------------------------ */

/** GET /statistics — `UserStatisticsDTO` */
export interface UserStatistics {
  user_id: number
  month: string
  income: number
  expense: number
  profit: number
}

/** GET /statistics — `UserStatisticsSliceDTO` */
export interface UserStatisticsResponse {
  months: UserStatistics[]
}

/** GET /accounts/{accountID}/statistics — `AccountStatisticsDTO` */
export interface AccountStatistics {
  account_id: number
  user_id: number
  month: string
  income: number
  expense: number
  profit: number
}

/** GET /accounts/{accountID}/statistics — `AccountStatisticsSliceDTO` */
export interface AccountStatisticsResponse {
  months: AccountStatistics[]
}