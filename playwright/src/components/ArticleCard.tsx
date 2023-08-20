import formatText from '../utils/formatText';
import styled from 'styled-components';
import { setSessionStorageItem } from '../utils/sessionStorage';
import { ArticleType } from '../types/AppTypes';
import { ReactComponent as PushPin } from '../assets/push-pin-blue-icon.svg';
import { PINNED_ARTICLES_SESSION_STORAGE_KEY } from '../constants/';
import { useAppDispatch } from '../contexts/AppContext';
import { getPinnedArticles } from '../utils/getArticles';

export interface CardProps {
  article: ArticleType;
  pinned?: boolean;
}

const CardContainer = styled.div`
  position: relative;
  width: 100%;
  margin: 1rem;
  box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
  border: 0.5px solid lightgrey;
  padding: 1.5rem 0.5rem;

  &:hover {
    cursor: pointer;
  }

  @media (min-width: 768px) {
    max-width: 350px;
  }
`;

const PinIcon = styled((props) => <PushPin {...props} />)<{
  $pinned?: boolean;
}>`
  position: absolute;
  right: 0.75rem;
  margin-top: -0.75rem;
  width: 20px;
  height: 20px;

  path,
  polygon {
    fill: ${(props) => (props.$pinned ? 'black' : 'white')};
    stroke-width: ${(props) => (props.$pinned ? '0' : '6px')};
    stroke: black;
  }
`;

const CardContent = styled.div`
  display: flex;
  align-content: center;
  justify-content: space-evenly;
  margin: 0 1rem 0 1.5rem;

  div:first-of-type {
    margin-right: 1rem;
  }
`;

const Title = styled.p`
  align-self: center;
  font-size: 1.25rem;
  font-weight: bold;
  flex-grow: 2;
`;

const Subtitle = styled.p`
  margin-bottom(not-last-child): 1rem;
`;

const ArticleCard = ({ article, pinned }: CardProps): JSX.Element => {
  const dispatch = useAppDispatch();

  const handleOnClick = () => {
    if (pinned) {
      setSessionStorageItem(
        PINNED_ARTICLES_SESSION_STORAGE_KEY,
        {
          article: article.article,
          views: Number(article.views),
          rank: article.rank,
        },
        'remove',
      );
    } else {
      setSessionStorageItem(
        PINNED_ARTICLES_SESSION_STORAGE_KEY,
        {
          article: article.article,
          views: Number(article.views),
          rank: article.rank,
        },
        'add',
      );
    }

    const pinnedArticles = getPinnedArticles();

    dispatch({
      type: 'UPDATE_PINNED_ARTICLES',
      payload: { pinnedArticles },
    });
  };

  return (
    <CardContainer
      onClick={handleOnClick}
      data-testid='article-card'
      data-test-pinned={pinned}
      aria-label={article.article}
    >
      <PinIcon $pinned={pinned} />
      <CardContent>
        <Title data-testid='article-card-title'>{formatText(article.article)}</Title>
        <div>
          <Subtitle>Views:</Subtitle>
          <p data-testid='article-card-viewcount'>{article.views}</p>
        </div>
        <div>
          <Subtitle>Rank:</Subtitle>
          <p data-testid='article-card-rank'>{article.rank}</p>
        </div>
      </CardContent>
    </CardContainer>
  );
};

export default ArticleCard;
