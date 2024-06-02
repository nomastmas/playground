import { getSessionStorageItem, setSessionStorageItem } from '../../utils/sessionStorage';
import {PINNED_ARTICLES_SESSION_STORAGE_KEY} from '../../constants/';

describe('sessionStorage', () => {
  const article1 = { article: 'Main', views: 1234, rank: 1 };
  const article2 = { article: 'Second', views: 123, rank: 2 };

  afterEach(() => {
    sessionStorage.clear();
  });

  describe('setSessionStorageItem', () => {
    test('sets the session storage value for the key if no value is present', () => {
      setSessionStorageItem(PINNED_ARTICLES_SESSION_STORAGE_KEY, article1, 'add');
      expect(sessionStorage.__STORE__[PINNED_ARTICLES_SESSION_STORAGE_KEY]).toEqual(JSON.stringify({
        articleList: [article1],
        articleHash: { 'Main': 1 },
      }));
    });

    test('appends the passed article value if a value is present', () => {
      setSessionStorageItem(PINNED_ARTICLES_SESSION_STORAGE_KEY, article1, 'add');
      setSessionStorageItem(PINNED_ARTICLES_SESSION_STORAGE_KEY, article2, 'add');

      expect(sessionStorage.__STORE__[PINNED_ARTICLES_SESSION_STORAGE_KEY]).toEqual(JSON.stringify({
        articleList: [article1, article2],
        articleHash: { 'Main': 1, 'Second': 1 },
      }));
    });

    test('removes the passed article from session storage', () => {
      setSessionStorageItem(PINNED_ARTICLES_SESSION_STORAGE_KEY, article1, 'add');
      setSessionStorageItem(PINNED_ARTICLES_SESSION_STORAGE_KEY, article1, 'remove');

      expect(sessionStorage.__STORE__[PINNED_ARTICLES_SESSION_STORAGE_KEY]).toEqual(JSON.stringify({
        articleList: [],
        articleHash: {},
      }));
    });
  });

  describe('getSessionStorageItem', () => {
    test('returns the session storage value if it exists', () => {
      setSessionStorageItem(PINNED_ARTICLES_SESSION_STORAGE_KEY, article1, 'add');
      const result = getSessionStorageItem(PINNED_ARTICLES_SESSION_STORAGE_KEY);

      expect(result).toEqual({
        articleList: [article1],
        articleHash: { 'Main': 1 },
      })
    });

    test('returns an empty array for articleList and empty object for articleHash if no value exists', () => {
      const result = getSessionStorageItem(PINNED_ARTICLES_SESSION_STORAGE_KEY);
      expect(result).toEqual({
        articleList: [],
        articleHash: {},
      });
    });
  });
});

