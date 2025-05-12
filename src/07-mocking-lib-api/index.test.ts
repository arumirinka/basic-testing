import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');

jest.mock('lodash', () => ({
  throttle: (fn: () => unknown) => fn,
}));

describe('throttledGetDataFromApi', () => {
  test('should create instance with provided base url', async () => {
    const base = 'https://jsonplaceholder.typicode.com';
    const mockedData = {};

    jest.mocked(axios.create).mockReturnValue(axios);
    jest.mocked(axios.get).mockResolvedValue(mockedData);
    await throttledGetDataFromApi(base);

    expect(axios.create).toHaveBeenCalled();
    expect(axios.create).toHaveBeenCalledWith({ baseURL: base });
  });

  test('should perform request to correct provided url', async () => {
    const endpoint = '/todos';
    const mockedData = {};

    jest.mocked(axios.create).mockReturnValue(axios);
    jest.mocked(axios.get).mockResolvedValue(mockedData);
    await throttledGetDataFromApi(endpoint);

    expect(axios.get).toHaveBeenCalled();
    expect(axios.get).toHaveBeenCalledWith(endpoint);
  });

  test('should return response data', async () => {
    const endpoint = '/todo/1';
    const mockedData = {
      userId: 1,
      id: 1,
      title: 'test title',
      completed: true,
    };

    jest.mocked(axios.create).mockReturnValue(axios);
    jest.mocked(axios.get).mockResolvedValue({ data: mockedData });
    const res = await throttledGetDataFromApi(endpoint);

    expect(res).toEqual(mockedData);
  });
});
