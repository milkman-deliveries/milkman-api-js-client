# milkman-api-js-client

## Setup

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

const apiClient = new ApiClient({
  baseUrl: 'https://test.milkmantechnologies.com/'
})
```

### Basic usage

The 99% of the requests can be done only calling one of the following methods.

```js
apiClient.get('/v99/foo')
apiClient.delete('/v99/foo')
apiClient.post('/v99/foo', data)
apiClient.path('/v99/foo', data)
apiClient.put('/v99/foo', data)
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
  headers: { /* put HERE custom headers */ }
  cache: 'no-cache',
  ...
}

apiClient.get('/v99/foo', options)
apiClient.delete('/v99/foo', options)
apiClient.post('/v99/foo', data, options)
apiClient.path('/v99/foo', data, options)
apiClient.put('/v99/foo', data, options)
```

The specified options will be passed down to the "fetch" primitive with no difference, except for the "authentication"
header, that will always be injected.

## Filtering

This library provides an utility, called `ApiFilter`, to easily compose filtered requests:

```js
const filter = new ApiFilter()
filter.eq('id', 123456)
filter.gt('date', '2021-12-31')
filter.in('status', ['committed', 'unassigned', 'baselineReady'])

apiClient.get(`/v99/foo?${filter}`)
```

It will compose the filtering parameters as the following:

```
id=123456
date[gt]=2021-12-31
status[in]=committed,unassigned,baselineReady
```

and the resulting URL will looks like this:

`/v99/foo?id=123456&date[gt]=2021-12-31&status[in]=committed,unassigned,baselineReady`

#### Ooperators

The set of possible operators

| Operator | Meaning | Ex. usage | Ex. result |
| --- | --- | --- | --- |
| eq | "equals" | `filter.eq('name', 'Mario')` | `name=Mario` |
| ne | "not equals" | `filter.ne('name', 'Mario')` | `name[ne]=Mario` |
| gt | "greater than" | `filter.gt('date', '2021-12-31')` | `date[gt]=2021-12-31` |
| ge | "greater than or equal" | `filter.ge('date', '2021-12-31')` | `date[ge]=2021-12-31` |
| lt | "less than" | `filter.lt('date', '2021-12-31')` | `date[lt]=2021-12-31` |
| le | "less than or equal" | `filter.le('date', '2021-12-31')` | `date[le]=2021-12-31` |
| in | "one of the values" | `filter.in('name', ['v1', 'v2', 'v3'])` | `name[in]=v1,v2,v3` |

#### Custom Operator

If required, a custom operator can be specified calling the `addRule` method:

```js
filter.addRule('param', 'customOp', 'value') // param[customOp]=value
```

## Sorting

This library provides an utility, called `ApiSort`, to easily compose sorted requests:

```js
const sort = new ApiSort()
sort.asc('name')
sort.desc('date')

apiClient.get(`/v99/foo?${sort}`)
```

The resulting URL will looks like this:

`/v99/foo?sort=name:asc,date:desc`

## Lazy Loading

`ApiLazyLoading` is an utility to easily create lazy-loading requests:

```js
const lazyLoading = new ApiLazyLoading()

// ask first 50 items
lazyLoading.setLimit(50)
apiClient.get(`/v99/foo?${lazyLoading}`)

// ask next 50 items
apiClient.get(`/v99/foo?${lazyLoading}`)

// ask next 30 items
lazyLoading.setLimit(30)
apiClient.get(`/v99/foo?${lazyLoading}`)
```

## Pagination

`ApiPagination` is an utility to easily create paginated requests:

```js
const pagination = new ApiPagination(50)

// ask items from 0 to 49 (page 1)
pagination.setPage(1)
apiClient.get(`/v99/foo?${pagination}`)

// ask items from 150 to 199 (page 4)
pagination.setPage(4)
apiClient.get(`/v99/foo?${pagination}`)
```

## Compose Utilities

We can easily use all the utility together:

```js
const filter = new ApiFilter()
filters.gt('date', '2021-12-31')

const sort = new ApiSort()
sort.asc('name')

const pagination = new ApiPagination(50)
pagination.setPage(1)

apiClient.get(`/v99/foo?${filter}&${sort}&${pagination}`)
```

# Legacy

The following are a set of utilities to make legacy API calls.

## Querying

Milkman internal API uses an opinionated query language, based on a "stringified" JSON passed to a query-string
parameter called "query".

#### Example

```js
apiClient.get('/v99/foo?query={"id":{"$eq":123456}}')
```

This library provides an utility, called `LegacyApiQuery`, to easily compose such a requests:

```js
const query = new LegacyApiQuery()
query.eq('id', 123456)

apiClient.get(`/v99/foo?query=${query}`)
```

#### Rules

```js
// equals
query.eq('id', 123456)
query.eq('name', 'John')

// not equals
query.ne('id', 123456)
query.ne('name', 'John')

// greater than
query.gt('age', 18)

// greater than or equal
query.gte('age', 18)

// less than
query.lt('age', 18)

// less than or equal
query.lte('age', 18)

// one of specified values
query.in('name', ['John', 'jack'])
query.in('age', [18, 21, 30])
```

You can also "chain" conditions:

```js
const query = new LegacyApiQuery()
  .gt('size', 10)
  .lt('size', 99)
  .in('status', ['Committed', 'InTransit'])
```

Or add custom type of rules:

```js
const query = new LegacyApiQuery()
  .addRule('size', '$custom', 'test')
```

## Sorting

Also "sorting" has its own opinionated syntax, similar to the "query" one.

#### Example

```js
apiClient.get('/v99/foo?sort={"name":1') // sort by name, ascending
```

`LegacyApiSort` is another utility to compose the object for the `sort` query-string parameter.

```js
const sort = new LegacyApiSort()
sort.asc('name')

apiClient.get(`/v99/foo?sort=${sort}`)
```

You can also "chain" rules:

```js
const sort = new LegacyApiSort()
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

const apiClient = new ApiClient({
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

const apiClient = new ApiClient({
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

const apiClient = new ApiClient({
  enhancers: [cognitoHeaderEnhancer, sessionHeaderEnhancer]
})
```