import {
  Dispatch,
  ReactNode,
  createContext,
  useContext,
  useReducer,
} from 'react';
import { AppActions, appReducer, initialState } from '../state/reducer';
import { ArticleType, DateObjType } from '../types/AppTypes';
import useGetArticles from '../hooks/useGetArticles';

interface AppProviderProps {
  children: ReactNode;
}

type AppContext = {
  dateValue: DateObjType;
  numArticles: number;
  pinnedArticles: ArticleType[];
  unpinnedArticles: ArticleType[];
  error: boolean;
};

type AppDispatchContext = {
  dispatch: (arg: any) => void;
};

const AppContext = createContext({} as AppContext);

// eslint-disable-next-line @typescript-eslint/no-empty-function
const AppDispatchContext = createContext<Dispatch<AppActions>>(() => {});

export function useApp() {
  return useContext(AppContext);
}

export function useAppDispatch() {
  return useContext(AppDispatchContext);
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { dateValue, numArticles, pinnedArticles, unpinnedArticles, error } =
    state;

  useGetArticles(state, dispatch, initialState);

  return (
    <AppContext.Provider
      value={{
        dateValue,
        numArticles,
        pinnedArticles,
        unpinnedArticles,
        error,
      }}
    >
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppContext.Provider>
  );
};
