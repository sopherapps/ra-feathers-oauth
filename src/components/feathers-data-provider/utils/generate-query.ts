import { decodeObjectFromReactAdmin } from './ra-feathers-transpiler';

export enum SortOrders {
  ascending = 'asc',
  descending = 'desc',
}

export default (
  {
    pagination = {},
    sort = {},
    filter = {},
    ids,
  }: {
    ids?: string[] | number[];
    filter?: { [key: string]: any };
    sort?: { field?: string; order?: SortOrders };
    pagination?: { page?: number; perPage?: number };
    [key: string]: any;
  },
  primaryKeyField = 'id',
) => {
  let query = {};
  query = { ...decodeObjectFromReactAdmin(filter, primaryKeyField) };

  if (Array.isArray(ids)) {
    query = { ...query, [primaryKeyField]: { $in: ids } };
  }

  const { page, perPage } = pagination;
  if (page !== undefined && perPage !== undefined) {
    query = { ...query, $limit: perPage, $skip: (page - 1) * perPage };
  }

  let { field, order } = sort;

  if (field === 'id') {
    field = primaryKeyField;
  }

  if (field !== undefined) {
    query = {
      ...query,
      $sort: {
        [field]: order === SortOrders.ascending ? 1 : -1,
      },
    };
  }
  return query;
};
