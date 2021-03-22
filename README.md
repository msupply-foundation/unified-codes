# unified-codes

## Getting started

1. Install dependencies: `npm install`.
2. Follow application instructions below.

## Applications

### data-loader

Application for parsing product data and populating Dgraph database.

1. Setup Dgraph (see instructions [here](unified-codes/tools/scripts/dgraph/README.md)).
3. Populate graph schema and demo data: `npx nx serve data-loader`.
4. Dgraph is now running, you can access at [http://localhost:9080](http://localhost:9080).

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

