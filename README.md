# milkman-api-js-client

## Setup project

### Yarn
This project use `yarn` package manager:
- If you don't have jet run `npm i -g yarn`
- To download *node_modules* dependencies run `yarn install` in the project

Refers to [Yarn](https://yarnpkg.com/cli) for further commands.

### Typescript
This project use Typescript. Each time you push some changes, you must remember to update the generated bundle in the `/dist` directory.
To do so, run `yarn bundle`.

## Import as dependency

Add dependency to the `package.json`

```
"milkman-api-js-client": "git+https://github.com/milkman-deliveries/milkman-api-js-client.git"
```

## API call

`ApiClient` class provides helpful methods to easily do API calls to milkman services.

- Uses a polyfill fetch library for cross-browser compatibility.
- Automatically retrieves last authentication token and inject it in any request header.

### Create an instance of ApiClient

```js
import { ApiClient } from 'milkman-api-js-client'

const api = new ApiClient({
  baseUrl: 'https://test.milkmantechnologies.com/'
})
```

### Basic usage

The 99% of the requests can be done only calling one of the following methods.

```js
api.GET('/v99/foo')
api.DELETE('/v99/foo')
api.POST('/v99/foo', data)
api.PATCH('/v99/foo', data)
api.PUT('/v99/foo', data)
```

- The `url` specified is prefixed with the `baseUrl`.
- POST, PATCH and PUT methods have an additional `data` parameter, that is "stringified" and put in the body of the
  request.

### Custom Fetch option

If you need to customize your request, each method has an additional `options` parameter, accepting all "fetch API"
settings (
see [fetch options](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#supplying_request_options)).

```js
const options = {
  headers: { /* put HERE custom headers */ },
  cache: 'no-cache',
  ...
}

api.GET('/v99/foo', options)
api.DELETE('/v99/foo', options)
api.POST('/v99/foo', data, options)
api.PATCH('/v99/foo', data, options)
api.PUT('/v99/foo', data, options)
```

The specified options will be passed down to the "fetch" primitive with no difference, except for the "authentication"
header, that will always be injected.

## Filtering

This library provides an utility, called `ApiFilters`, to easily compose filtered requests:

```js
const filters = new ApiFilters()
filters.eq('id', 123456)
filters.gt('date', '2021-12-31')
filters.in('status', ['committed', 'unassigned', 'baselineReady'])
```

You can also "chain" conditions:

```js
const filters = new ApiFilters()
  .eq('id', 123456)
  .gt('date', '2021-12-31')
  .in('status', ['committed', 'unassigned', 'baselineReady'])
```

It will compose the following object:

```
{
  'id': 12345,
  'date(gt)': "2021-12-31",
  'status(in)': ['COMMITTED', 'UNASSINGED', 'BASELINE_READY']
}
```

Then you can pass the object directly in the _data_ parameter of the API call:

```js
api.POST('/v99/foo/search', filters)
```

#### Operators

The set of possible operators

| Operator | Meaning | Ex. usage |
| --- | --- | --- |
| eq | "equals" | `filter.eq('name', 'Mario')` |
| ne | "not equals" | `filter.ne('name', 'Mario')` |
| gt | "greater than" | `filter.gt('date', '2021-12-31')` |
| ge | "greater than or equal" | `filter.ge('date', '2021-12-31')` |
| lt | "less than" | `filter.lt('date', '2021-12-31')` |
| le | "less than or equal" | `filter.le('date', '2021-12-31')` |
| in | "one of the values" | `filter.in('name', ['v1', 'v2', 'v3'])`|

#### Custom Operator

If required, a custom operator can be specified calling the `addRule` method:

```js
filter.addRule('field', 'customOp', 'value') // 'field(customOp)': 'value'
```

## Sorting

This library provides an utility, called `ApiSort`, to easily compose sorted requests:

```js
const sort = new ApiSort()
sort.asc('name')
sort.desc('date')

api.GET(`/v99/foo?${sort}`)
```

You can also "chain" rules:

```js
const sort = new ApiSort()
  asc('name')
  desc('date')
```

The resulting URL will looks like this:

`/v99/foo?sort=name(asc),date(desc)`

## Lazy Loading

`ApiLazyLoading` is an utility to easily create lazy-loading requests:

```js
// set initial limit to 50
const lazyLoading = new ApiLazyLoading(50)

// ask first 50 items
api.GET(`/v99/foo?${lazyLoading}`)

// ask next 50 items
api.GET(`/v99/foo?${lazyLoading}`)

// change limit to 30
lazyLoading.setLimit(30)

// ask next 30 items
api.GET(`/v99/foo?${lazyLoading}`)
```

## Pagination

`ApiPagination` is an utility to easily create paginated requests:

```js
// set initial page size to 50
const pagination = new ApiPagination(50)

// ask for page 1 (index 0; items from 0 to 49)
api.GET(`/v99/foo?${pagination.page(0)}`)

// ask for page 4 (index 3; items from 150 to 199)
api.GET(`/v99/foo?${pagination.page(3)}`)

// change page size to 100
pagination.setPageSize(100)

// ask for the new page 4 (index 3; items from 300 to 399)
api.GET(`/v99/foo?${pagination.page(3)}`)
```

## Compose Utilities

We can easily use all the utility together:

```js
const filters = new ApiFilters()
filters.gt('date', '2021-12-31')

const sort = new ApiSort()
sort.asc('name')

const pagination = new ApiPagination(50)
pagination.setPage(1)

api.POST(`/v99/foo?${sort}&${pagination}`, filters)
```

# Legacy

The following are a set of utilities to make legacy API calls.

## Querying

Milkman internal API uses an opinionated query language, based on a "stringified" JSON passed to a query-string
parameter called "query".

#### Example

```js
api.GET('/v99/foo?query={"id":{"$eq":123456}}')
```

This library provides an utility, called `LegacyApiQuery`, to easily compose such a requests:

```js
const legacyQuery = new LegacyApiQuery()
legacyQuery.eq('id', 123456)

api.GET(`/v99/foo?${legacyQuery}`)
```

#### Rules

```js
// equals
legacyQuery.eq('name', 'John')

// not equals
legacyQuery.ne('id', 123456)

// greater than
legacyQuery.gt('age', 18)

// greater than or equal
legacyQuery.gte('age', 18)

// less than
legacyQuery.lt('age', 18)

// less than or equal
legacyQuery.lte('age', 18)

// one of specified values
legacyQuery.in('name', ['John', 20, true])
```

You can also "chain" conditions:

```js
const legacyQuery = new LegacyApiQuery()
  .gt('size', 10)
  .lt('size', 99)
  .in('status', ['Committed', 'InTransit'])
```

Or add custom type of rules:

```js
const legacyQuery = new LegacyApiQuery()
  .addRule('size', '$custom', 'test')
```

## Sorting

Also "sorting" has its own opinionated syntax, similar to the "query" one.

#### Example

```js
api.GET('/v99/foo?sort={"name":1}') // sort by name, ascending
```

`LegacyApiSort` is another utility to compose the object for the `sort` query-string parameter.

```js
const legacySort = new LegacyApiSort()
legacySort.asc('name')

api.GET(`/v99/foo?${legacySort}`)
```

You can also "chain" rules:

```js
const legacySort = new LegacyApiSort()
  .asc('name')
  .desc('age')
```

## Authentication

To call Milkman services you first need to obtain an authentication token. To do so, the `ApiAuth` class provides
methods to manage the user authentication.

### Usage

#### Create an instance of ApiAuth

```js
import { ApiAuth } from 'milkman-api-js-client'

const auth = new ApiAuth({
  application: 'myApplication',
  clientId: '1234560'
})
```

#### First login

This async method will contact the authentication service and store required tokens locally.

```js
auth.login('john.smith@email.com', 'abcde123456')
```

#### Renew authentication

This async method uses the current stored tokens to renew the authentication. New tokens will be stored locally.

```js
auth.refresh()
```

### Enhance API requests

To easily provide authorization token to any API request, use the optional `enhancers` parameter.

`cognitoHeaderEnhancer` enhancer automatically set the Cognito 'bearer' token in the request header.

```js
import { ApiClient, cognitoHeaderEnhancer } from 'milkman-api-js-client'

const api = new ApiClient({
  enhancers: [cognitoHeaderEnhancer]
})
```

#### Old Version

To use the old authentication, add the `sessionHeaderEnhancer` too.

```js
import {
  ApiClient,
  cognitoHeaderEnhancer,
  sessionHeaderEnhancer
} from 'milkman-api-js-client'

const api = new ApiClient({
  enhancers: [cognitoHeaderEnhancer, sessionHeaderEnhancer]
})
```

### Automatic Refresh

It's possible to let `ApiAuth` manage the authentication renewal automatically.

#### Configuration

```js
const auth = new ApiAuth({
  application: 'myApplication',
  clientId: '1234560',
  automaticRefresh: true,
  refreshTimeoutMs: 600000 // 10 minutes. Optional. Default is 55 minutes.
})
```

After the fist call to the `login`, the `refresh` method will be automatically called each time the timeout fired.

### Old (deprecated) Milkman authentication

To use the old authentication, set the `useMilkmanSession` to `true`, and pass the `milkmanBaseUrl`.

#### Configure ApiAuth

```js
const auth = new ApiAuth({
  application: 'myApplication',
  clientId: '1234560',
  useMilkmanSession: true,
  milkmanBaseUrl: 'https://test.milkmantechnologies.com/'
})
```

#### Enhance ApiClient

To use the old authentication, add the `sessionHeaderEnhancer` too.

```js
import {
  ApiClient,
  cognitoHeaderEnhancer,
  sessionHeaderEnhancer
} from 'milkman-api-js-client'

const api = new ApiClient({
  enhancers: [cognitoHeaderEnhancer, sessionHeaderEnhancer]
})
```