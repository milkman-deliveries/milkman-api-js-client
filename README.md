# milkman-api-js-client

## Setup

Coming soon...


## Authentication

To call Milkman services you first need to obtain an authentication token.
To do so, the `ApiAuth` class provides methods to manage the user authentication.

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
- POST, PATCH and PUT methods have an additional `data` parameter, that is "stringified" and put in the body of the request.

### Custom Fetch option
If you need to customize your request, each method has an additional `options` parameter, accepting all "fetch API" settings (see [fetch options](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#supplying_request_options)).

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

The specified options will be passed down to the "fetch" primitive with no difference, except for the "authentication" header, that will always be injected.

## Querying
Milkman internal API uses an opinionated query language, based on a "stringified" JSON passed to a query-string parameter called "query".

#### Example
```js
apiClient.get('/v99/foo?query={"id":{"$eq":123456}}')
```

This library provides an utility, called `ApiQuery`, to easily compose such a requests:
```js
const query = new ApiQuery()
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
const query = new ApiQuery()
  .gt('size', 10)
  .lt('size', 99)
  .in('status', ['Committed', 'InTransit'])
```

Or add custom type of rules:
```js
const query = new ApiQuery()
  .addRule('size', '$custom', 'test')
```

## Sorting

Also "sorting" has its own opinionated syntax, similar to the "query" one.

#### Example
```js
apiClient.get('/v99/foo?sort={"name":1') // sort by name, ascending
```

`ApiSort` is another utility to compose the object for the `sort` query-string parameter.
```js
const sort = new ApiSort()
sort.asc('name')

apiClient.get(`/v99/foo?sort=${sort}`)
```

You can also "chain" rules:
```js
const sort = new ApiSort()
  .asc('name')
  .desc('age')
```
