// Cross-feature primitive types. Keep dependency-free.

export interface Pagination {
  page: number;
  pageSize: number;
  total?: number;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface SortState<TField extends string = string> {
  field: TField;
  direction: 'asc' | 'desc';
}

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

export type ID = string;
