import { ChangeEvent } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';

import { AppProvider } from '../../contexts/AppContext';
import Dropdown from '../../components/Dropdown';

jest.mock('../../utils/getYesterdaysDate', () => () => ({
  date: 1,
  month: 5,
  year: 2023,
  fullDate: new Date(2023, 5, 1),
}));

jest.mock(
  'react-dropdown',
  () =>
    ({
      options,
      value,
      onChange,
    }: {
      options: string[];
      value: number;
      onChange: ({ value }: { value: string | undefined }) => void;
    }) => {
      function handleChange(event: ChangeEvent<HTMLSelectElement>) {
        const option = options.find(
          (option) => option === event.currentTarget.value,
        );
        onChange({ value: option });
      }

      return (
        <select
          data-testid='select'
          value={value.toString()}
          onChange={handleChange}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    },
);

describe('<Dropdown />', () => {
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

  async function renderDropdown() {
    return act(() => {
      render(
        <AppProvider>
          <Dropdown />
        </AppProvider>,
      );
    });
  }

  test('should display a title and the default dropdown value', async () => {
    await renderDropdown();
    expect(screen.getByText('Number of Results')).toBeTruthy();
    expect(screen.getByText('100')).toBeTruthy();
  });

  test('should update the date on input change', async () => {
    await renderDropdown();
    const defaultOption = screen.getByRole('option', {
      name: '100',
    }) as HTMLOptionElement;
    const newSelectedOption = screen.getByRole('option', {
      name: '50',
    }) as HTMLOptionElement;

    expect(defaultOption.selected).toBe(true);
    fireEvent.change(screen.getByTestId('select'), {
      target: { value: '50' },
    });
    expect(newSelectedOption.selected).toBe(true);
  });
});
