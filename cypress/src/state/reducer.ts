import getDate from "../utils/getYesterdaysDate";
import { getPinnedArticles, getUnpinnedArticles } from "../utils/getArticles";
import { ArticleType, DateObjType } from "../types/AppTypes";
import { DEFAULT_NUM_ARTICLES } from "../constants";

export interface AppState {
  dateValue: DateObjType;
  numArticles: number;
  articles: ArticleType[] | [];
  pinnedArticles: ArticleType[] | [];
  unpinnedArticles: ArticleType[] | [];
  error: boolean;
}

interface UpdateArticles {
  type: 'UPDATE_ARTICLES';
  payload: {
    articles: ArticleType[];
  }
}

interface UpdateUnpinnedArticles {
  type: 'UPDATE_UNPINNED_ARTICLES';
  payload: {
    unpinnedArticles: ArticleType[];
  }
}

interface UpdatePinnedArticles {
  type: 'UPDATE_PINNED_ARTICLES';
  payload: {
    pinnedArticles: ArticleType[];
  }
}

interface UpdateDate {
  type: 'UPDATE_DATE';
  payload: {
    dateValue: DateObjType;
  };
}

interface UpdateNumArticles {
  type: 'UPDATE_NUM_ARTICLES',
  payload: {
    numArticles: number;
  };
}

interface UpdateError {
  type: 'UPDATE_ERROR';
  payload: {
    error: boolean;
  };
}

export type AppActions =
  UpdateArticles |
  UpdateUnpinnedArticles |
  UpdatePinnedArticles |
  UpdateDate |
  UpdateNumArticles |
  UpdateError;

export const initialState = {
  dateValue: getDate(),
  numArticles: DEFAULT_NUM_ARTICLES,
  articles: [],
  pinnedArticles: getPinnedArticles(),
  unpinnedArticles: [],
  error: false,
}

export const appReducer = (state: AppState, action: AppActions): AppState => {
  const { type, payload} = action;

  switch (type) {
    case 'UPDATE_PINNED_ARTICLES':
      return {
        ...state,
        pinnedArticles: payload.pinnedArticles,
        unpinnedArticles: getUnpinnedArticles(state.articles, state.numArticles),
      };
    case 'UPDATE_ARTICLES':
      return {
        ...state,
        articles: payload.articles,
        error: false,
      };
    case 'UPDATE_UNPINNED_ARTICLES':
      return {
        ...state,
        unpinnedArticles: payload.unpinnedArticles,
      };
    case 'UPDATE_DATE':
      return {
        ...state,
        dateValue: payload.dateValue,
      }
    case 'UPDATE_NUM_ARTICLES':
        return {
          ...state,
          numArticles: payload.numArticles,
        }
    case 'UPDATE_ERROR':
      return {
        ...state,
        articles: [],
        unpinnedArticles: [],
        error: true,
      }
    default:
      return state;
  }
}