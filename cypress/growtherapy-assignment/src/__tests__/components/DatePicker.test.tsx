import { ChangeEvent } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';

import { AppProvider } from '../../contexts/AppContext';
import DatePicker from '../../components/DatePicker';

jest.mock('../../utils/getYesterdaysDate', () => () => ({
  date: 1,
  month: 5,
  year: 2023,
  fullDate: new Date(2023, 5, 1),
}));
jest.mock(
  'react-date-picker',
  () =>
    ({
      onChange,
    }: {
      onChange: (value: ChangeEvent<HTMLInputElement>) => void;
    }) =>
      (
        <div>
          <input onChange={onChange} type='text' value='2023-06-01' />
        </div>
      ),
);

describe('<DatePicker />', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    fetchMock.mockResponse(
      JSON.stringify({
        items: [
          {
            articles: [
              {
                article: 'Main_Page',
                views: 18793503,
                rank: 1,
              },
            ],
          },
        ],
      }),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  async function renderDatePicker() {
    return act(() => {
      render(
        <AppProvider>
          <DatePicker />
        </AppProvider>,
      );
    });
  }

  test('should display a title and the default date', async () => {
    await renderDatePicker();
    expect(screen.getByText('Start Date')).toBeTruthy();
    expect(screen.getByDisplayValue('2023-06-01')).toBeTruthy();
  });

  test('should update the date on input change', async () => {
    await renderDatePicker();
    fireEvent.change(screen.getByRole('textbox')), { target: { value: '5' } };
    // screen.debug();
  });
});
