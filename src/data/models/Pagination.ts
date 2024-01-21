interface Pagination<Type> {
  data: Type[];
  page: number;
}
interface InfinitePagintion<Type> {
  pages: Pagination<Type>[];
  pageParams: any[];
}
