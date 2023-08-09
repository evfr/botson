const { Client } = require('@elastic/elasticsearch');
let { main, searchDocuments, calculateEventRate } = require('../index');
const { mockedPingResponse, mockedSearchResponse, events } = require('./__mocks__/elasticsearch');

jest.mock('@elastic/elasticsearch');

describe('Elasticsearch Tests', () => {
  const consoleSpy = jest.spyOn(console, 'log');

  beforeAll(() => {
    client = {
      search: jest.fn().mockResolvedValue(mockedSearchResponse),
      ping: jest.fn()
    };
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should search documents and calculate event rates', async () => {
    await searchDocuments(client);

    expect(client.search).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith('by GEO', expect.any(Object));
    expect(consoleSpy).toHaveBeenCalledWith('by BOT', expect.any(Object));

    consoleSpy.mockRestore();
  });

  it('should calculate event rate for specific events', () => {
    const result = calculateEventRate(events);

    expect(result).toEqual({
      min: expect.any(Number),
      max: expect.any(Number),
      minKey: expect.any(String),
      maxKey: expect.any(String),
    });
  });
});
