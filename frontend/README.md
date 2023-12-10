### Overview

Contains all of the packages for running the UC frontend

Each package is co-located by shared code functionality, not by shared GUI space.

### Intentions

The intention is that packages have an explicit boundary to ensure bundle sizes are kept minimal by reducing the chance of accidental imports increasing bundle sizes.

The only packages which should be imported by any other package are:

- `common`
- `system`

These are shared libraries for common functionality between each of the packages.

### Gotchas

- Don't import from other packages! For example, if you import something from `invoices` into `requisitions`, the bundle size of `requisitions` could double

### Development

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
