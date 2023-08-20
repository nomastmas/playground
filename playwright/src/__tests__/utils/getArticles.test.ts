import { getPinnedArticles, getUnpinnedArticles } from '../../utils/getArticles';
import { PINNED_ARTICLES_SESSION_STORAGE_KEY } from "../../constants/";

describe('getPinnedArticles', () => {
  test('returns [] if no pinned articles exist', () => {
    const result = getPinnedArticles();
    expect(result).toEqual([]);
  });

  test('returns the pinned articles if it exists', () => {
    sessionStorage.__STORE__[PINNED_ARTICLES_SESSION_STORAGE_KEY] = JSON.stringify({
      articleList: [{ article: 'Main', views: 1234, rank: 1 }],
      articleHash: { 'Main': 1 }
    });
    const result = getPinnedArticles();
    expect(result).toEqual([{ article: 'Main', views: 1234, rank: 1 }]);
  });
});

describe('getUnpinnedArticles', () => {
  const articles = [
    { article: 'Main', views: 1234, rank: 1 },
    { article: 'Second', views: 123, rank: 2 },
    { article: 'Third', views: 122, rank: 3 },
  ];

  test('returns the correct number of unpinned articles with the right numArticles', () => {
    sessionStorage.__STORE__[PINNED_ARTICLES_SESSION_STORAGE_KEY] = JSON.stringify({
      articleList: [{ article: 'Main', views: 1234, rank: 1 }],
      articleHash: { 'Main': 1 }
    });
    const result = getUnpinnedArticles(articles, 2);

    expect(result).toEqual(articles.slice(1));
  });
});