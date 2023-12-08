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
