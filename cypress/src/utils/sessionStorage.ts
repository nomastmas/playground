import { ArticleType } from "../types/AppTypes";

type SessionStorageItemType = {
  articleList: ArticleType[] | [];
  articleHash: Record<string, number> | Record<string, never>;
}

/**
 * Sets the session storage value for the key parameter.
 *
 * If the value already exists, it will append the passed article value to the
 * articleList and articleHash. Otherwise, it will just set the value.
 *
 * @param key - The session storage key
 * @param value - The value to set for the passed session storage key
 * @param type - Whether the action is to add or remove a value from session storage key value
 */
const setSessionStorageItem = (key: string, value: ArticleType, type: 'add' | 'remove'): void => {
  const valueStringified = JSON.stringify(
    {
      articleList: [value],
      articleHash: {
        [value.article]: 1,
      },
    },
  );
  const valueInStorage = sessionStorage.getItem(key);

  if (!valueInStorage) {
    sessionStorage.setItem(key, valueStringified);
  } else {
    const parsedCurrentStorageValue = JSON.parse(valueInStorage);
    const currentArticleHash = parsedCurrentStorageValue.articleHash;
    let updatedValue;

    if (type === 'add') {
      updatedValue = {
        articleList: [...parsedCurrentStorageValue.articleList, value],
        articleHash: {
          ...currentArticleHash,
          [value.article]: 1,
        }
      };
    } else {
      updatedValue = {
        articleList: parsedCurrentStorageValue.articleList.filter(
          (article: ArticleType) => article.article !== value.article
        ),
        articleHash: Object.keys(currentArticleHash).reduce(
          (newObj: Record<string, number>, key: string) => {
            if (key !== value.article) {
              newObj[key] = currentArticleHash[key];
            }
            return newObj;
          }, {}),
      };
    }
    sessionStorage.setItem(key, JSON.stringify(updatedValue));
  }
}

/**
 * Returns the value of the session storage key.
 *
 * If the value does not exist, the default return is empty lists
 * representing the articleList and articleHash.
 *
 * @param key - The session storage key
 * @returns The value of the passed session storage key
 */
const getSessionStorageItem = (key: string): SessionStorageItemType => {
  const value = sessionStorage.getItem(key);
  if (value) {
    const parsedValue = JSON.parse(value);

    return parsedValue;
  }

  return { articleList: [], articleHash: {}};
}

export {
  setSessionStorageItem,
  getSessionStorageItem
}