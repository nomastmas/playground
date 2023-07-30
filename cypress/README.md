# Grow Therapy SDET Take Home

Web application using the [Wikipedia Pageview API](https://wikitech.wikimedia.org/wiki/Analytics/AQS/Pageviews). See the prompt for the takehome exercise for details on the app's functionality.

[React](https://react.dev/), [vite](https://vitejs.dev/), and [TypeScript](https://www.typescriptlang.org/) are used within the application, but no specific knowledge in any of these technologies is required! To ignore type errors from TypeScript, see [this post on Stack Overflow](https://stackoverflow.com/a/59003954).

## Usage
### Getting Started

[Node.js](https://nodejs.org/) (`>= 14.16`) is required to run the API server. `Node` can be obtained directly from [Node.js](https://nodejs.org/en/download/), through a version manager (e.g. [nvm](https://github.com/nvm-sh/nvm)), etc. Note that the codebase was tested on `v19.5.0`.

Dependencies can be installed using `npm`:
```
npm install
```

Afterwards, the local server can be started using:
```
npm start
```

Visit [http://localhost:5173/](http://localhost:5173/) in your browser to see the app.

### Linting
The codebase is linted using `eslint`. See [`.eslintrc.cjs`](.eslintrc.cjs) in this directory for the full configuration.

From the command line, linting can be performed via:
```
npm run lint
```

Linting can also be enabled in code editors, _e.g._ VS Code via plugins/extensions. For example, see [here](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) for the VS Code ESLint extension.

### Tests
#### Unit
[`jest`](https://jestjs.io/) is used as the unit testing framework. They can be run via:
```
npm run test:unit
```

They can be run in [watch mode](https://jestjs.io/docs/cli#--watch) via:
```
npm run test:unit-watch
```

Test files are in [`src/__tests__`](src/__tests__) with mocks in [`test/__mocks__`](`test/__mocks__`).

#### End-to-End (E2E)
[Cypress](https://www.cypress.io/) is used as the end-to-end test framework. To run Cypress with the dev server:
```
npm run test:e2e
```

To run Cypress in `open` mode:
```
npm run test:e2e:open
```

See [here for a full list](https://docs.cypress.io/guides/guides/command-line#cypress-run) of Cypress command line arguments. Note that command line arguments with `npm run` need to be passed using `--`. 

For example, to run [Cypress using Chrome rather than a headless browser](https://docs.cypress.io/guides/guides/command-line#cypress-run-browser-lt-browser-name-or-path-gt):
```
npm run test:e2e -- --browser chrome
```

See `cypress.config.ts` for the configuration file. Feel free to make adjustments as necessary, _e.g._ update the `viewportWidth` and `viewportHeight` for your screen size. See [this page for configuration options](https://docs.cypress.io/guides/references/configuration#Options) for Cypress.

Test files are in [`cypress/e2e`](cypress/e2e/). They must end in `cy.js` or `cy.ts`. Cypress is configured by default to look for this glob pattern `cypress/e2e/**/*.cy.{js,jsx,ts,tsx}`.