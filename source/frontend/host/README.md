## host

### Overview

Primary/shell package for uc-frontend

### Intentions

The intention is that this package is the shell for the Universal Codes, which brings together all the required modules. Responsibilities:

- Primary shell: App drawers, footer, header.
- Routing.
- Lazily loading packages.
- Setting up app-wide contexts.

### Tips & Things to keep in mind

- To add components into the shell, use the `AppDrawer`/`AppFooter` etc portals.

### Future considerations
