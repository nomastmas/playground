import getYesterdaysDate from '../../utils/getYesterdaysDate';

describe('getYesterdaysDate', () => {
  const mockDate = new Date('August 19, 2022');

  beforeEach(() => {
    jest.useFakeTimers({ legacyFakeTimers: false }).setSystemTime(mockDate);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test("returns the correct value for yesterday's date", () => {
    const result = getYesterdaysDate();

    expect(result).toEqual({
      date: 18,
      month: 7,
      year: 2022,
      fullDate: new Date('August 18, 2022'),
    });
  });
});