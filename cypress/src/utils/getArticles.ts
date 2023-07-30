import { ArticleType } from "../types/AppTypes";
import { getSessionStorageItem } from "./sessionStorage";
import { PINNED_ARTICLES_SESSION_STORAGE_KEY } from "../constants/";

/**
 * Returns the pinned article list that are saved in session storage under the key
 * value of PINNED_ARTICLES_SESSION_STORAGE_KEY
 *
 * @returns The pinned article list in session storage
 */
const getPinnedArticles = (): ArticleType[] => {
  const sessionStorageValue = getSessionStorageItem(PINNED_ARTICLES_SESSION_STORAGE_KEY);
  if (!sessionStorageValue) {
    return [];
  }
  return sessionStorageValue.articleList;
};

/**
 * Returns the number of unpinned articles from the passed articles.
 * If numArticles is passed as a parameter, it returns the total unpinned articles of the
 * passed number.
 *
 * @param articles - Passed list of articles
 * @param numArticles - The number of articles to be returned, according to user input
 * @returns The list of unpinned articles
 */
const getUnpinnedArticles = (articles: ArticleType[], numArticles?: number): ArticleType[] => {
  const sessionStorageValue = getSessionStorageItem(PINNED_ARTICLES_SESSION_STORAGE_KEY);
  const unpinnedArticles = articles.filter(
    (article) => sessionStorageValue.articleHash[article.article] !== 1
  );

  if (numArticles) {
    return unpinnedArticles.slice(0, numArticles);
  }

  return unpinnedArticles;
};

export {
  getPinnedArticles,
  getUnpinnedArticles,
}
