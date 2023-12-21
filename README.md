# Universal Codes

Welcome! This is Universal Codes!

This is a responsive web application over a GraphQL API.

It is built using Typescript and Rust, with a React Frontend and a DGraph database. The code is heavily 'borrowed' [Notify](https://github.com/openmsupply/notify/)

The test framework is jest; functional areas are separated into packages and managed with [lerna](https://lerna.js.org/)

## Usage

- Install dependencies (Using node v20+ and yarn):
  - `yarn install`
- Setup Dgraph (see instructions [here](unified-codes/tools/scripts/dgraph/README.md))
  - You can then use the [explorer](https://play.dgraph.io/?latest) (server URL is http://localhost:8080)
- Initialise DGraph schema and load data into DGraph:
  - `yarn load-data`
- Start the backend:
  - `yarn start-backend`
  - Access v1 api at http://localhost:4007/v1/graphql
  - Access v2 api at http://localhost:4007/graphql

### Frontend

1. Start the frontend: `yarn start-frontend`

For the old frontend:

1. From the `unified-codes/unified-codes` directory:
2. Run web server: `npx nx serve web`
   1. If using Node >v16, you'll need the to use the openssl legacy provider: `NODE_OPTIONS=--openssl-legacy-provider npx nx serve web`
3. Browse web at http://localhost:4200/

## Testing

- Unit tests across frontend and the backend:
  - `yarn test`
- Test frontend:
  - `yarn test-frontend`
- Test data-service (unit tests):
  - `yarn test-backend`
- Integration tests:
  - `yarn test-integration`

## Other scripts

- Generate GraphQL Types:
  - `yarn generate`

## Build and release

We will need to make some updates to our release scripts since the code rearrange, and for the new frontend, but we'll cross that bridge when we get there :)

### Git hooks

The `prepare` script enables [Husky](https://typicode.github.io/husky/), which we use for our git hooks. It only needs to be run once to be configured.

The `prepare` script should run automatically on post-install (after `yarn install`). If need be, you can also run it manually with `yarn prepare`.

## Development

- `master` branch - is the stable release branch
- `develop` branch - the main development branch

When developing, create an issue first then a branch based on the issue number. Current practice is to use the format `#[issue number]-some-description` for the branch name. When ready, create a PR which targets `develop` and when approved, merge to `develop`. We aim to review PRs promptly and keep the PR list as low as possible as a kindness to other developers ( and reduce merge hell! )

## Wiki

There is also a extensive wiki which we may need to update the live system.

https://github.com/msupply-foundation/unified-codes/wiki/
