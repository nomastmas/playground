import RDropdown from 'react-dropdown';
import styled from 'styled-components';
import 'react-dropdown/style.css';

import { DEFAULT_NUM_ARTICLE_OPTIONS } from '../constants/';
import { useApp, useAppDispatch } from '../contexts/AppContext';

const DropdownContainer = styled.div`
  display: inline-block;
  width: 200px;

  .Dropdown-root {
    width: 100px;
  }

  .Dropdown-menu {
    width: 76%;
    border: 1px solid black;
  }

  .Dropdown-control {
    padding: 8px 30px 8px 8px;
    border: 1px solid black;
  }
`;

const StyledTitle = styled.span`
  display: inline-block;
  margin-bottom: 0.75rem;
`;

const Dropdown = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { numArticles } = useApp();

  return (
    <DropdownContainer>
      <StyledTitle>Number of Results</StyledTitle>
      <RDropdown
        options={DEFAULT_NUM_ARTICLE_OPTIONS}
        onChange={(Option) => {
          const numArticles = parseInt(Option.value, 10);
          dispatch({
            type: 'UPDATE_NUM_ARTICLES',
            payload: {
              numArticles,
            },
          });
        }}
        value={numArticles.toString()}
      />
    </DropdownContainer>
  );
};

export default Dropdown;
