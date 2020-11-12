# unified-codes

## Getting started

### Dgraph 
1. Install docker [here](https://docs.docker.com/get-docker/).
2. Run standalone dgraph instance: `/unified-codes/tools/scripts/dgraph/run.sh`.
3. Dgraph is now running, you can access Ratel at http://localhost:8000.


#### Usage

Scripts subdirectory: `/unified-codes/tools/scripts/dgraph/`
Note: Prior to running the shell scripts you may have to allow execute permission: `chmod +x alter.sh mutate.sh init.sh`

#### Initialise Sample Database
This will create a sample schema and populate data for you. Great if you want to get up and running quickly!

```
./setup.sh
```

### Applications
1. Install dependencies: `npm install`

#### Data-Service (serves GraphQL api)
1. Start service: `npx nx serve data-service`
2. Access v1 api at http://localhost:4000/v1/graphql  
3. Access v2 api at http://localhost:4000/v2/graphql

#### Web
1. Start service: `npx nx serve web`
2. Browse web at http://localhost:4200/
3. Start storybook: `npx nx storybook ui` (ui shared component browser) or `npx nx storybook web` (web component browser)
4. Browse storybook at http://localhost:4400/