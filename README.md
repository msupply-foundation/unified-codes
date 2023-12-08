# Universal Codes

Welcome! This is the front end application for Universal Codes

This is a responsive web application utilising the Universal Codes Backend.

It is built using React, with Typescript, and a heavy reliance on hooks. The code is heavily 'borrowed' from the [Notify frontend](https://github.com/openmsupply/notify/tree/main/frontend)

The test framework is jest; functional areas are separated into packages and managed with [lerna](https://lerna.js.org/)

## Usage

- Install dependencies (Using node v16+ and using yarn):

`yarn install`

- Run on development mode:

`yarn start`

- Bundle for production:

`yarn build`

- Test:

`yarn test`

- Generate GraphQL Types:

`yarn generate`

### Git hooks

The `prepare` script enables [Husky](https://typicode.github.io/husky/), which we use for our git hooks. It only needs to be run once to be configured.

The `prepare` script should run automatically on post-install (after `yarn install`). If need be, you can also run it manually with `yarn prepare`.

## Development

- `main` branch - is the (un?)stable release branch

When developing, create an issue first then a branch based on the issue number. Current practice is to use the format `#[issue number]-some-description` for the branch name. When ready, create a PR which targets `main` and when approved, merge to `main`. We aim to review PRs promptly and keep the PR list as low as possible as a kindness to other developers ( and reduce merge hell! )

When creating a new component: for functional areas, please add a test or two - just check the current examples of tests and stories to see how things works now.

Code is separated into functional areas, so that we can isolate bundles to these areas. These are not the same as areas in the site; there is a separation between code organisation and UI organisation.

Within each area you'll see a similar pattern of this for tabular data, which is pretty much everything:

```
.
├── [package name]
│   └── src
│        └── [functional area]
│            ├── DetailView
│            │   ├── api.ts
│            │   ├── DetailView.tsx
│            │   └── [other components]
│            └── ListView
│                ├── api.ts
│                ├── ListView.tsx
│                └── [other components]
├── [package name]
│   └── src
```

Couple of things to note:

- There is a pre-commit hook ( thanks husky ) which will run a typescript compilation and a linter to ensure that your changes will compile
- When you create a PR, there is a GitHub webhook which uses the webpack bundle size analyzer plugin and will create a comment on your PR telling you the size difference introduced by your change
- When merging to `main` there is another webhook which will deploy your change to the demo server

Once we are through the initial development phase, we'll move to a `develop` branch and keep `main` as a stable release branch. We're not there yet!

## Queries

We're using [React Query](https://react-query.tanstack.com/overview) to query the server and manage a local cache of queries.

Check out the existing implementation using `api.ts` files and integration with the `DataTable` component.

## Localisation

We're using [react-i18next](https://react.i18next.com/) for localisations. Collections of translatable items are grouped into namespaces so that we can reduce bundle sizes and keep files contained to specific areas. The namespace files are json files - kept separate from the main bundles and downloaded on demand. These are also cached locally in the browser.

When using translations in your code, you may need to specify the namespace to use e.g.

```
import { useTranslation } from '@uc-frontend/common';

...

const t = useTranslation('common');

...
<ModalLabel label={t('label.code')} />
```

You can also specify multiple namespaces when using the hook:

```
  const t = useTranslation(['common', 'distribution']);
```

the t function will be set to first namespace as default

```
const { t, i18n } = useTranslation(['ns1', 'ns2', 'ns3']);
t('key');
t('key', { ns: 'ns2' });
```

The first call will by default call the initial key: 'ns1'
The second call will call the specified key: 'ns2'

# unified-codes

## Getting started

1. Install dependencies: `npm install`.
2. Follow application instructions below.

## Applications

### data-loader

Application for parsing product data and populating Dgraph database.

1. Setup Dgraph (see instructions [here](unified-codes/tools/scripts/dgraph/README.md)).
2. Populate graph schema and demo data: `npx nx serve data-loader`.
3. Dgraph is now running, you can access at [http://localhost:9080](http://localhost:9080).

### data-service

Backend GraphQL server for accessing product data.

1. Run GraphQL server: `npx nx serve data-service`.
2. Access v1 api at http://localhost:4000/v1/graphql
3. Access v2 api at http://localhost:4000/v2/graphql

### web

Frontend for browsing and searching product data.

1. Run web server: `npx nx serve web`.
2. Browse web at http://localhost:4200/.

## Libraries

### data

Reusable types and interfaces used by both frontend and backend code.

### ui

Reusable frontend React components. Component grouping based on [material-ui][https://material-ui.com/] and [atomic design](https://bradfrost.com/blog/post/atomic-web-design/) principles.

## Testing

### web

1. Start storybook: `npx nx storybook web` (web components).
2. Browse storybook at http://localhost:4400/.

### ui

1. Start storybook: `npx nx storybook ui` (library components).
2. Browse storybook at http://localhost:4400/.

## Wiki

There is also a extensive wiki which we may need to update the live system.

https://github.com/msupply-foundation/unified-codes/wiki/
