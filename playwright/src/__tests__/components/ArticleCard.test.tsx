import { render, fireEvent, screen } from '@testing-library/react';

import ArticleCard, { CardProps } from '../../components/ArticleCard';

describe('<ArticleCard />', () => {
  let props: CardProps;

  beforeEach(() => {
    props = {
      article: {
        article: 'Main:Page',
        views: 1234,
        rank: 1,
      },
    };
  });

  test('should display a title, subtitle, and views', () => {
    render(<ArticleCard {...props} />);

    expect(screen.getByText('Main: Page')).toBeTruthy();
    expect(screen.getByText('Views:')).toBeTruthy();
    expect(screen.getByText('1234')).toBeTruthy();
  });

  test('on click should set session storage with the article', () => {
    render(<ArticleCard {...props} />);

    const card = screen.getByTestId('article-card');
    fireEvent.click(card);
    expect(sessionStorage.getItem).toHaveBeenCalledWith('grow_pinned_articles');
    expect(sessionStorage.setItem).toHaveBeenCalledWith(
      'grow_pinned_articles',
      JSON.stringify({
        articleList: [
          {
            article: 'Main:Page',
            views: 1234,
            rank: 1,
          },
        ],
        articleHash: { 'Main:Page': 1 },
      }),
    );
  });
});
