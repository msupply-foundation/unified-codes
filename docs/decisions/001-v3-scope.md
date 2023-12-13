# KDD-001: Scope of the upgrade

- _Date_: Updated 13 Dec 2023
- _Deciders_: Mark, James, Laché
- _Status_: DECIDED
- _Outcome_: Option 5 - Replace Frontend and Backend

## Context

The Universal Codes Server needs an admin interface to manage its data. One was meant to be created last time this was worked on, but it didn't get finished.

We've been managing the data via a spreadsheet, which is error prone. The admin interface needs a way to manipulate the data, and an approval process to ensure mistakes aren't made.

Needing to get back into this repo begs the question of whether this would be a good time to align the UC codebase with our current stack, bringing in the patterns we've now establised across many apps.

## Options

### 1. Full re-write

We would use the opportunity we have now to align UC to our curent stack, so any more work on it in future has the best foundation.

_Pros:_

- Easier to maintain and work on UC in future, as libraries, frameworks and patterns match our other apps (dev team can be productive faster)
- If we want UC to be aligned to our current stack at _some_ point, we may as well do it now, before adding the admin interface/more features, as that would create even more code to rewrite
- Various improvements made in other apps can easily be brought into UC

_Cons:_

- The admin interface (our highest priority) would likely be delivered slower as the rewrite would need to be established first
- If the code works as it is now, and isn't going out of support any time soon, could our time be better spent elsewhere?

### 2. Replace Dgraph

A happy medium option - Dgraph was an experiment with graph databases (?) and does work well, but the requirements of UC don't really need a graph database. It's another tool we have to learn and maintain.

A relational database (likely Postgres, as in our other apps) would meet all our needs, and bring some consistency to our data layer.

_Pros:_

- Our devs know relational DBs, and Postgres specifically, so maintaining UC's data layer will become more of a known - faster and easier to deliver
- Fewer dependencies to learn, keep an eye on and maintain

_Cons:_

- Dgraph works well... is it worth the energy to replace?
- Once you start thinking about replacing Dgraph, it's easy to want to expand the scope to rewriting the backend to be in Rust... otherwise we'll end up needing to define (unless we have them in other apps?) these data layer patterns in Typescript

### 3. Only build the admin interface

An admin interface to manage the data behind UC is the primary need right now. We need to move away from managing the data via a spreadsheet.

_Pros:_

- We put our focus towards delivering this admin interface as quickly as possible
- More budget left for other areas that might need it?

_Cons:_

- We're left with a codebase very different from many of the others in our ecosystem
  - Maintainability is decreased, as more learning/re-learning is required
  - We might be less likely to keep up with developments in UC's tech stack, so this codebase may age poorly
  - If we're likely to extend UC much in the future, the pain of it being in a different stack may be felt more than if we just need to keep the lights on
- If we decide to replace Dgraph/rewrite the app in future, we will have a greater amount of code to replace

### 4. Replace UI layer

A potentially left-field option: retain dgraph but replace the react layer with a copy of the codebase used for other web projects. This gives a good platform for building the admin interface, using existing patterns and toolset.

_Pros:_

- The database layer is working and has a graphQL API; the current UI package is using a graphQL API
- Consistent front end codebase, and
- potentially, consistent UI and component reuse
- A graph database allows us to do a lot of interesting things with the data
- A good platform for developing the admin interface, in a familiar environment

_Cons:_

- We're left with an unfamiliar database engine to maintain
- We aren't using any of the cool graph database features, so why bother with the overhead of maintaining a different server?
- The current UI is working, so there's overhead in replacing

### 4. Replace UI layer and Backend

Retain dgraph but replace the react layer and backend with a copy of the codebase used for other web projects. This gives a good platform for building the admin interface, using existing patterns and toolset.

_Pros:_

- The database layer is working and has a graphQL API; the current UI package is using a graphQL API
- Consistent front end codebase, and
- potentially, consistent UI and component reuse
- A graph database allows us to do a lot of interesting things with the data
- A good platform for developing the admin interface, in a familiar environment
- Most of the backend is familiar to the team, and we can use the same patterns as other apps
- Can re-use backend integrations such as email sending (for password reset), User logins for authentication, etc

_Cons:_

- We're left with an unfamiliar database engine to maintain
- We aren't using any of the cool graph database features, so why bother with the overhead of maintaining a different server?
- The current UI is working, so there's overhead in replacing

## Decision

The decision has been made in favour of **Option 5: Replace UI layer and Backend**.

Given the backend exposes a GraphQL API, we should be able to drop our current frontend package in pretty easily.

The current UC frontend is fairly simple, so shouldn't take too long to replace. It also could use some UX improvements, so we can make these along the way.

A significant component of the admin interface work will be building a sensible UI for it, so it will be beneficial to build this in a familiar environment.

If we have time/budget left at the end, we could then consider replacing DGraph. By that point, we'd also have a better sense of its pain points and how much risk there is in keeping vs replacing it.

## Consequences

We will be left with a DGraph database, which will require additional learning/relearning overhead as we maintain UC, but by using graphql, it should be more accessible than if we were using the DGraph API directly.

We're also going to build out a lot in the backend as we implement this admin interface (all the mutations) which will make it a lot more work to move away from DGraph in future.
