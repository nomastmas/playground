import { Dispatch } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import useGetArticles from '../../hooks/useGetArticles';
import { AppActions } from '../../state/reducer';

describe('useGetArticles', () => {
  const state = {
    dateValue: {
      date: 2,
      month: 5,
      year: 2023,
      fullDate: new Date('June 2, 2023'),
    },
    numArticles: 25,
    articles: [],
    pinnedArticles: [],
    unpinnedArticles: [],
    error: false,
  };
  const initialState = {
    dateValue: {
      date: 2,
      month: 5,
      year: 2023,
      fullDate: new Date('June 2, 2023'),
    },
    numArticles: 25,
    articles: [],
    pinnedArticles: [],
    unpinnedArticles: [],
    error: false,
  };
  let dispatch: jest.MockedFunction<Dispatch<AppActions>>;

  beforeEach(() => {
    dispatch = jest.fn();
    fetchMock.resetMocks();

    fetchMock.mockResponse(
      JSON.stringify({
        items: [
          {
            articles: [
              {
                article: 'Main_Page',
                views: 18793503,
                rank: 1,
              },
            ],
          },
        ],
      }),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('dispatches UPDATE_ARTICLES and UPDATE_UNPINNED_ARTICLES actions upon successful article fetch', async () => {
    renderHook(() => {
      useGetArticles(state, dispatch, initialState);
    });

    await waitFor(() => {
      expect(dispatch.mock.calls[0][0]).toMatchObject({
        payload: {
          articles: [{ article: 'Main_Page', rank: 1, views: 18793503 }],
        },
        type: 'UPDATE_ARTICLES',
      });
      expect(dispatch.mock.calls[1][0]).toMatchObject({
        payload: {
          unpinnedArticles: [
            { article: 'Main_Page', rank: 1, views: 18793503 },
          ],
        },
        type: 'UPDATE_UNPINNED_ARTICLES',
      });
    });
  });

  test('dispatches UPDATE_ERROR action upon failed article fetch', async () => {
    fetchMock.mockReject(new Error('Bad response'));
    renderHook(() => {
      useGetArticles(state, dispatch, initialState);
    });

    await waitFor(() =>
      expect(dispatch.mock.calls[0][0]).toMatchObject({
        payload: { error: true },
        type: 'UPDATE_ERROR',
      }),
    );
  });
});
