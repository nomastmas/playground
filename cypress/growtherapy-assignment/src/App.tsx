import { v4 as uuidv4 } from 'uuid';
import styled from 'styled-components';

import { useApp } from './contexts/AppContext';
import Navbar from './components/Navbar';
import ArticleCard from './components/ArticleCard';
import DatePicker from './components/DatePicker';
import Dropdown from './components/Dropdown';
import Error from './components/Error';

import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';

const StyledUserInputSection = styled.div`
  align-self: center;
  display: flex;
  width: 365px;

  div:first-child {
    margin-right: 1.5rem;
  }
`;

const ArticlesContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const App = () => {
  const { pinnedArticles, unpinnedArticles, error } = useApp();

  return (
    <div>
      <Navbar />
      <ArticlesContainer>
        <StyledUserInputSection>
          <DatePicker />
          <Dropdown />
        </StyledUserInputSection>
        {pinnedArticles?.length !== 0 && (
          <>
            <h1>Pinned Articles</h1>
            {pinnedArticles?.map((article) => (
              <ArticleCard article={article} key={uuidv4()} pinned />
            ))}
          </>
        )}
        {error && <Error />}
        {!error && (
          <>
            <h1>Unpinned Articles</h1>
            {unpinnedArticles?.map((article) => (
              <ArticleCard article={article} key={uuidv4()} />
            ))}
          </>
        )}
      </ArticlesContainer>
    </div>
  );
};

export default App;
