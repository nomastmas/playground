// ● A user is able to select a time on a calendar (defaulting to yesterday)
// ● A user is able to decide how many results to show (options being 25, 50, 75, 100, 200
//   default to 100)
// ● Based on what is selected, a user will see a frontend view that includes the name of the
//   article, the number of views and the rank.
// ● Users can “pin” articles of interest above their search results

describe('Homepage', () => {
  const dayOffset = 24*3600*1000;
  const monthOffset = dayOffset * 30;   // not a perfect month offset, avoiding bike shedding
  const now = new Date();
  const expectedDate = new Date(now.getTime() - dayOffset).toISOString().match(/\d{4}-\d{2}-\d{2}/)[0];
  const lastMonthDateObj = new Date(now.getTime() - monthOffset);
  const lastMonthDate = lastMonthDateObj.toISOString().match(/\d{4}-\d{2}-\d{2}/)[0];

  beforeEach(() => {
    cy.clearAllSessionStorage();
    cy.visit('/');

    cy.get('.react-date-picker__inputGroup input').as('datePickerInput');
    cy.get('.react-date-picker__inputGroup__month').as('datePickerInputMonth');
    cy.get('.react-date-picker__inputGroup__day').as('datePickerInputDay');

    cy.get('[data-testid="article-card"]').as('cards');
    cy.get('[data-testid="article-card-title"]').as('cardTitles');
    cy.get('[data-testid="article-card-viewcount"]').as('cardViewCounts');

    cy.get('span').contains('Grow Therapy SDET Take Home').as('title');

  })

  it('successfully selects a prior date', () => {
    cy.get('@datePickerInput')
      .invoke('prop', 'value')
      .should('equal', expectedDate);

    cy.get('@datePickerInputMonth').type(lastMonthDateObj.getMonth()+1);
    cy.get('@datePickerInputDay').type(lastMonthDateObj.getDate());

    // bug: cannot enter year
    // cy.get('.react-date-picker__inputGroup__year').type(lastMonthDateObj.getFullYear());

    cy.get('@datePickerInput')
      .invoke('prop', 'value')
      .should('equal', lastMonthDate);

  });

  it('successfully updates the results filter', () => {
    const dropdownTarget = '25';

    cy.get('.Dropdown-control').click();
    cy.get('.Dropdown-menu')
      .find('.Dropdown-option')
      .contains(dropdownTarget)
      .click();

    cy.get('.Dropdown-placeholder')
      .invoke('text')
      .should('equal', dropdownTarget);
  });

  it('successfully views results', () => {
    cy.get('[data-testid="article-card"]')
    .its('length')
    .should('equal', 100);
  });

  it('successfully views results based on selection', () => {
    cy.get('@cardViewCounts')
    .eq(0)
    .invoke('text')
    .then(viewCount => {
      cy.get('@datePickerInputMonth').type(lastMonthDateObj.getMonth()+1);
      cy.get('@datePickerInputDay').type(lastMonthDateObj.getDate());
      cy.get('@title').click();

      cy.get('@cardViewCounts')
        .eq(0)
        .invoke('text')
        .should('not.equal', viewCount);
    });
  });

  it('successfully pins articles', () => {
    cy.get('@cards').eq(0).click();

    cy.get('[data-test-pinned="true"] > div > p')
     .its('length')
     .should('equal', 1)
  });

  it('successfully pins articles that persist above results', () => {
    cy.get('@cardTitles').eq(0).click()

    cy.get('[data-test-pinned="true"] > div > div > p:nth-child(2)')
      .eq(0)
      .invoke('text')
      .then(viewCount => {
        cy.get('@datePickerInputMonth').type(lastMonthDateObj.getMonth()+1);
        cy.get('@datePickerInputDay').type(lastMonthDateObj.getDate());
        cy.get('@title').click();

        cy.get('[data-test-pinned="true"] > div > div > p:nth-child(2)')
          .eq(0)
          .invoke('text')
          .should('equal', viewCount);
      })

    cy.get('@cards')
      .its('length')
      .then((totalCards) => {
        cy.get('[data-test-pinned="true"]')
          .its('length')
          .then((pinnedCards) => {
            expect(totalCards - pinnedCards).to.equal(100);
          })
      })
  });

});
