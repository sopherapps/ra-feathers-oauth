import generateQuery from '../../../../components/feathers-data-provider/utils/generate-query';

describe('generate-query', () => {
  it('generates a feathersjs query object from params.filter object', () => {
    const filter = {
      author: 'John Doe',
      publisher: 'MK',
      id: 23,
    };
    const expectedQuery = {
      author: filter.author,
      publisher: filter.publisher,
      _id: filter.id,
    };
    expect(generateQuery({ filter }, '_id')).toMatchObject(expectedQuery);
  });

  it('generates an $in query entry if params.ids array exists', () => {
    const ids = [3, 4, 2];
    const primaryKey = '_no';
    expect(generateQuery({ ids }, primaryKey)).toMatchObject({
      [primaryKey]: { $in: ids },
    });
  });

  it('generates a feathersjs pagination query if\
  params.pagination.page and params.pagination.perPage exist', () => {});

  it('generates a $sort feathersjs query if params.sort.field exists', () => {});

  it('defaults to descending order sort if params.sort.order is undefined', () => {});
});
