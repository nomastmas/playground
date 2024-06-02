import { Dispatch, useEffect, useState } from 'react';
import { AppActions, AppState } from '../state/reducer';
import { getUnpinnedArticles } from '../utils/getArticles';

const useGetArticles = (
  state: AppState,
  dispatch: Dispatch<AppActions>,
  initialState: AppState,
) => {
  const { dateValue, numArticles, articles, error } = state;
  const { date, month, year, fullDate } = dateValue;

  const [prevDateValue, setPrevDateValue] = useState(
    initialState.dateValue.fullDate,
  );

  useEffect(() => {
    (async () => {
      try {
        if (fullDate !== prevDateValue || (articles.length === 0 && !error)) {
          const twoDigitDateStr = ('0' + date).slice(-2);

          // Wiki Pageview API uses month values that are not zero based
          // See https://wikitech.wikimedia.org/wiki/Analytics/AQS/Pageviews#Most_viewed_articles
          const notZeroBasedMonth = month + 1;
          const twoDigitMonthStr = ('0' + notZeroBasedMonth).slice(-2);

          const result = await fetch(
            `https://wikimedia.org/api/rest_v1/metrics/pageviews/top/en.wikipedia/all-access/${
              '' + year
            }/${twoDigitMonthStr}/${twoDigitDateStr}`,
          );

          if (result.ok) {
            const { items } = await result.json();
            const { articles: articlesFromResult } = items[0];
            const unpinnedArticles = getUnpinnedArticles(
              articlesFromResult,
              numArticles,
            );

            dispatch({
              type: 'UPDATE_ARTICLES',
              payload: {
                articles: articlesFromResult,
              },
            });
            dispatch({
              type: 'UPDATE_UNPINNED_ARTICLES',
              payload: {
                unpinnedArticles,
              },
            });

            setPrevDateValue(fullDate);
          } else {
            throw new Error(`${result.status}`);
          }
        } else {
          const unpinnedArticles = getUnpinnedArticles(articles, numArticles);
          dispatch({
            type: 'UPDATE_UNPINNED_ARTICLES',
            payload: {
              unpinnedArticles,
            },
          });
        }
      } catch (err) {
        setPrevDateValue(fullDate);
        dispatch({
          type: 'UPDATE_ERROR',
          payload: { error: true },
        });
      }
    })();
  }, [
    date,
    month,
    year,
    fullDate,
    dateValue,
    prevDateValue,
    numArticles,
    dispatch,
    articles,
    error,
  ]);
};

export default useGetArticles;
