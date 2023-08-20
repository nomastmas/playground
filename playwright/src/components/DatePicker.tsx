import RCalendar from 'react-date-picker';
import styled from 'styled-components';

import { useApp, useAppDispatch } from '../contexts/AppContext';

const DatePickerContainer = styled.div`
  .react-date-picker__wrapper {
    padding: 0.3rem 0.2rem;
  }
`;

const StyledTitle = styled.span`
  display: inline-block;
  margin-bottom: 0.75rem;
`;

const DatePicker = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { dateValue } = useApp();
  const { date, month, year } = dateValue;

  const handleCalendarChange = (value: any): void => {
    const newDate = {
      date: value.getDate(),
      month: value.getMonth(),
      year: value.getFullYear(),
    };
    dispatch({
      type: 'UPDATE_DATE',
      payload: {
        dateValue: {
          ...newDate,
          fullDate: value,
        },
      },
    });
  };

  return (
    <DatePickerContainer>
      <StyledTitle>Start Date</StyledTitle>
      <RCalendar
        calendarAriaLabel='Date Picker'
        clearIcon={null}
        value={new Date(year, month, date)}
        onChange={handleCalendarChange}
      />
    </DatePickerContainer>
  );
};

export default DatePicker;
