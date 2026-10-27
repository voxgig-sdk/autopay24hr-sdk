# Autopay24hr TypeScript SDK



The TypeScript SDK for the Autopay24hr API — a type-safe, entity-oriented client with full async/await support.

The API is exposed as capitalised, semantic **Entities** — e.g.
`client.ChatStatus()` — each with a small set of operations (`list`, `load`)
instead of raw URL paths and query parameters. This keeps the surface
predictable and low-friction for both humans and AI agents.

> Also generated from this model: `go`, `go-cli`, `go-mcp`, `lua`, `php`, `py`, `rb` — see
> the [top-level README](../README.md).


## Install
This package is not yet published to npm. Install it from the GitHub
release tag (`ts/vX.Y.Z`, see [Tags](https://github.com/voxgig-sdk/autopay24hr-sdk/tags)), or from a
clone, which carries the compiled `dist/`:

```bash
git clone https://github.com/voxgig-sdk/autopay24hr-sdk
npm install ./autopay24hr-sdk/ts
```


## Tutorial: your first API call

This tutorial walks through creating a client, listing entities, and
loading a specific record.

### 1. Create a client

```ts
import { Autopay24hrSDK } from '@voxgig-sdk/autopay24hr-sdk'

const client = new Autopay24hrSDK()
```

### 3. Load a chatstatus

`load()` returns the entity and throws on failure; `.data()` reads its record:

```ts
try {
  const chatstatus = await client.ChatStatus().load()
  console.log(chatstatus.data())
} catch (err) {
  console.error('load failed:', err)
}
```


## Error handling

Entity operations reject on failure, so wrap them in `try` / `catch`:

```ts
try {
  const health = await client.Health().load()
  console.log(health.data())
} catch (err) {
  console.error('load failed:', err)
}
```

The low-level `direct()` method does **not** throw — it returns the
result envelope. Branch on `ok`; on failure `status` holds the HTTP status
(for error responses) and `err` holds the error:

```ts
const result = await client.direct({
  path: '/api/resource/{id}',
  method: 'GET',
  params: { id: 'example_id' },
})

if (!result.ok) {
  console.error('request failed:', result.status, result.err)
}
```


## How-to guides

### Make a direct HTTP request

For endpoints not covered by entity methods:

```ts
const result = await client.direct({
  path: '/api/resource/{id}',
  method: 'GET',
  params: { id: 'example' },
})

if (result.ok) {
  console.log(result.status)  // 200
  console.log(result.data)    // response body
}
```

### Prepare a request without sending it

```ts
const fetchdef = await client.prepare({
  path: '/api/resource/{id}',
  method: 'DELETE',
  params: { id: 'example' },
})

// Inspect before sending
console.log(fetchdef.url)
console.log(fetchdef.method)
console.log(fetchdef.headers)
```

### Use test mode

Create a mock client for unit testing — no server required:

```ts
const client = Autopay24hrSDK.test()

const health = await client.Health().load()
// health is the Health entity; .data() reads its mock record
console.log(health.data())
```

You can also use the instance method:

```ts
const client = new Autopay24hrSDK()
const testClient = client.tester()
```

### Retain entity state across calls

Entity instances remember their last match and data:

```ts
const entity = client.Health()

// First call runs the operation and stores its result
await entity.load()

// Subsequent calls reuse the stored state
const data = entity.data()
console.log(data)
```

### Add custom middleware

Pass features via the `extend` option:

```ts
const logger = {
  hooks: {
    PreRequest: (ctx: any) => {
      console.log('Requesting:', ctx.spec.method, ctx.spec.path)
    },
    PreResponse: (ctx: any) => {
      console.log('Status:', ctx.out.request?.status)
    },
  },
}

const client = new Autopay24hrSDK({
  extend: [logger],
})
```

### Run live tests

Create a `.env.local` file at the project root:

```
AUTOPAY24HR_TEST_LIVE=TRUE
```

Then run:

```bash
cd ts && npm test
```

Live entity tests continue independent operations after errors and attempt
supported cleanup. Their final result reports failures and missing prerequisites
after the remaining work completes. The model and test inputs determine which
API operations the generated scenarios cover.


## Reference

### Autopay24hrSDK

#### Constructor

```ts
new Autopay24hrSDK(options?: {
  base?: string
  prefix?: string
  suffix?: string
  feature?: Record<string, { active: boolean }>
  extend?: Feature[]
})
```

| Option | Type | Description |
| --- | --- | --- |
| `base` | `string` | Base URL of the API server. |
| `prefix` | `string` | URL path prefix prepended to all requests. |
| `suffix` | `string` | URL path suffix appended to all requests. |
| `feature` | `object` | Feature activation flags (e.g. `{ test: { active: true } }`). |
| `extend` | `Feature[]` | Additional feature instances to load. |

#### Methods

| Method | Returns | Description |
| --- | --- | --- |
| `options()` | `object` | Deep copy of current SDK options. |
| `utility()` | `Utility` | Deep copy of the SDK utility object. |
| `prepare(fetchargs?)` | `Promise<FetchDef>` | Build an HTTP request definition without sending it. |
| `direct(fetchargs?)` | `Promise<DirectResult>` | Build and send an HTTP request. |
| `ChatStatus(data?)` | `ChatStatusEntity` | Create a ChatStatus entity instance. |
| `Coin(data?)` | `CoinEntity` | Create a Coin entity instance. |
| `Health(data?)` | `HealthEntity` | Create a Health entity instance. |
| `PairLimit(data?)` | `PairLimitEntity` | Create a PairLimit entity instance. |
| `Quote(data?)` | `QuoteEntity` | Create a Quote entity instance. |
| `tester(testopts?, sdkopts?)` | `Autopay24hrSDK` | Create a test-mode client instance. |

#### Static methods

| Method | Returns | Description |
| --- | --- | --- |
| `Autopay24hrSDK.test(testopts?, sdkopts?)` | `Autopay24hrSDK` | Create a test-mode client. |

### Entity interface

All entities share the same interface.

#### Methods

| Method | Signature | Description |
| --- | --- | --- |
| `load` | `load(reqmatch?, ctrl?): Promise<Entity>` | Load a single entity by match criteria, and return it. |
| `list` | `list(reqmatch?, ctrl?): Promise<Entity[]>` | List entities matching the criteria, one per record. |
| `data` | `data(data?: Partial<Entity>): Entity` | Get or set entity data. |
| `match` | `match(match?: Partial<Entity>): Partial<Entity>` | Get or set entity match criteria. |
| `make` | `make(): Entity` | Create a new instance with the same options. |
| `client` | `client(): Autopay24hrSDK` | Return the parent SDK client. |
| `entopts` | `entopts(): object` | Return a copy of the entity options. |

#### Return values

Entity operations resolve to the entity itself — there is no result
envelope, and an entity's `data()` reads its record:

- `load` resolves to a single entity object.
- `list` resolves to an **array** of entity objects (iterate it directly;
  there is no `.data` and no `.ok`).

On a failed request these methods **throw**, so wrap calls in
`try`/`catch` to handle errors. Only `direct()` returns the result
envelope described below.

### DirectResult shape

The `direct()` method returns:

```ts
{
  ok: boolean
  status: number
  headers: object
  data: any
}
```

On error, `ok` is `false` and an `err` property contains the error.

### FetchDef shape

The `prepare()` method returns:

```ts
{
  url: string
  method: string
  headers: Record<string, string>
  body?: any
}
```

### Entities

#### ChatStatus

| Field | Description |
| --- | --- |
| `aiConfigured` | Whether an AI model answers chat questions. |
| `fallbackAvailable` | Whether curated fallback answers are available. |
| `model` | AI model in use, e.g. |

Operations: load.

API path: `/api/v1/chat/status`

#### Coin

| Field | Description |
| --- | --- |
| `decimals` | Decimal places of the asset on this network. |
| `network` | Network slug, e.g. |
| `providers` | Providers that route this asset; only "autopay" was observed. |
| `symbol` | Ticker symbol, e.g. |

Operations: list.

API path: `/api/v1/coins`

#### Health

| Field | Description |
| --- | --- |
| `checks` | Per-dependency checks. |
| `ok` | Overall health. |
| `service` | Service name; observed "autopay". |
| `status` | Overall status; observed "ok". |
| `ts` | Server time of the check, epoch milliseconds. |

Operations: load.

API path: `/api/health`

#### PairLimit

| Field | Description |
| --- | --- |
| `fromNetwork` | Source coin network. |
| `fromSymbol` | Source coin symbol. |
| `maxAmount` | Maximum send amount. |
| `maxUsdApprox` | Approximate USD value of maxAmount. |
| `minAmount` | Minimum send amount. |
| `minNetReceive` | Net amount of the destination coin received at the minimum send amount (undocumented). |
| `minUsdApprox` | Approximate USD value of minAmount. |

Operations: load.

API path: `/api/v1/pair-limits`

#### Quote

| Field | Description |
| --- | --- |
| `estimatedTime` | Human-readable completion estimate, e.g. |
| `estimatedTimeTier` | Speed tier; observed "fast" and "slow". |
| `fromAmount` | Amount sent, in units of the source coin. |
| `grossToAmount` | Amount of the destination coin before the spread. |
| `isBest` | True for the route chosen as best. |
| `maxAmount` | Route maximum send amount, in units of the source coin. |
| `minAmount` | Route minimum send amount, in units of the source coin. |
| `netToAmount` | Amount of the destination coin the user receives. |
| `networkFee` | Network fee charged by the route (observed 0). |
| `providerFeePercent` | Provider fee in percent (observed 0). |
| `providerName` | Route (provider) name; only "AutoPay Instant" was observed. |
| `spreadPercent` | Spread applied by the route, in percent (observed 0 and 0.5). |

Operations: list.

API path: `/api/v1/quote`



## Entities


### ChatStatus

Create an instance: `const chat_status = client.ChatStatus()`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `aiConfigured` | `boolean` | Whether an AI model answers chat questions. |
| `fallbackAvailable` | `boolean` | Whether curated fallback answers are available. |
| `model` | `string` | AI model in use, e.g. |

#### Example: Load

```ts
const chat_status = await client.ChatStatus().load()
```


### Coin

Create an instance: `const coin = client.Coin()`

#### Operations

| Method | Description |
| --- | --- |
| `list(match)` | List entities matching the criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `decimals` | `number` | Decimal places of the asset on this network. |
| `network` | `string` | Network slug, e.g. |
| `providers` | `any[]` | Providers that route this asset; only "autopay" was observed. |
| `symbol` | `string` | Ticker symbol, e.g. |

#### Example: List

```ts
const coins = await client.Coin().list()
```


### Health

Create an instance: `const health = client.Health()`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `checks` | `Record<string, any>` | Per-dependency checks. |
| `ok` | `boolean` | Overall health. |
| `service` | `string` | Service name; observed "autopay". |
| `status` | `string` | Overall status; observed "ok". |
| `ts` | `number` | Server time of the check, epoch milliseconds. |

#### Example: Load

```ts
const health = await client.Health().load()
```


### PairLimit

Create an instance: `const pair_limit = client.PairLimit()`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `fromNetwork` | `string` | Source coin network. |
| `fromSymbol` | `string` | Source coin symbol. |
| `maxAmount` | `number` | Maximum send amount. |
| `maxUsdApprox` | `number` | Approximate USD value of maxAmount. |
| `minAmount` | `number` | Minimum send amount. |
| `minNetReceive` | `number` | Net amount of the destination coin received at the minimum send amount (undocumented). |
| `minUsdApprox` | `number` | Approximate USD value of minAmount. |

#### Example: Load

```ts
const pair_limit = await client.PairLimit().load({ from_network: 'from_network', from_symbol: 'from_symbol', to_network: 'to_network', to_symbol: 'to_symbol' })
```


### Quote

Create an instance: `const quote = client.Quote()`

#### Operations

| Method | Description |
| --- | --- |
| `list(match)` | List entities matching the criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `estimatedTime` | `string` | Human-readable completion estimate, e.g. |
| `estimatedTimeTier` | `string` | Speed tier; observed "fast" and "slow". |
| `fromAmount` | `number` | Amount sent, in units of the source coin. |
| `grossToAmount` | `number` | Amount of the destination coin before the spread. |
| `isBest` | `boolean` | True for the route chosen as best. |
| `maxAmount` | `number` | Route maximum send amount, in units of the source coin. |
| `minAmount` | `number` | Route minimum send amount, in units of the source coin. |
| `netToAmount` | `number` | Amount of the destination coin the user receives. |
| `networkFee` | `number` | Network fee charged by the route (observed 0). |
| `providerFeePercent` | `number` | Provider fee in percent (observed 0). |
| `providerName` | `string` | Route (provider) name; only "AutoPay Instant" was observed. |
| `spreadPercent` | `number` | Spread applied by the route, in percent (observed 0 and 0.5). |

#### Example: List

```ts
const quotes = await client.Quote().list({ from_amount: 1, from_network: "example", from_symbol: "example", to_network: "example", to_symbol: "example" })
```

## Features

This SDK ships 4 optional features. Each is **inactive until you
switch it on**, so an SDK you have not configured behaves exactly as if none of
them existed — no retries, no cache, no logging, no measurable overhead.

Activate a feature by name in the client options, alongside the options shown
above:

| Feature | What it does |
|---|---|
| [`ratelimit`](#ratelimit) | Rate limiting |
| [`retry`](#retry) | Retry |
| [`test`](#test) | Test transport |
| [`timeout`](#timeout) | Timeout |

> **Order matters for `ratelimit`, `retry`, `timeout`.** These wrap the
> transport, so each one wraps whatever is already installed: the order you
> activate them in IS the nesting order. Activating them as an ordered list
> rather than a map is what fixes that order.

### ratelimit

Rate limiting.

| Option | Default |
|---|---|
| `active` | `false` |
| `burst` | `5` |
| `rate` | `5` |

Set `feature.ratelimit.active` to enable it, then override any of the options above.

`ratelimit` wraps the transport, so its position among the other
transport features decides what it sees. A feature activated later wraps one
activated earlier.

### retry

Retry.

| Option | Default |
|---|---|
| `active` | `false` |
| `factor` | `2` |
| `maxDelay` | `2000` |
| `minDelay` | `50` |
| `retries` | `2` |
| `statuses` | `[408, 425, 429, 500, 502, 503, 504]` |

Set `feature.retry.active` to enable it, then override any of the options above.

`retry` wraps the transport, so its position among the other
transport features decides what it sees. A feature activated later wraps one
activated earlier.

### test

Test transport.

| Option | Default |
|---|---|
| `active` | `false` |

Set `feature.test.active` to enable it, then override any of the options above.

### timeout

Timeout.

| Option | Default |
|---|---|
| `active` | `false` |
| `ms` | `30000` |

Set `feature.timeout.active` to enable it, then override any of the options above.

`timeout` wraps the transport, so its position among the other
transport features decides what it sees. A feature activated later wraps one
activated earlier.


## Advanced

> The sections above cover everyday use. The material below explains the
> SDK's internals — useful when extending it with custom features, but not
> needed for normal use.

### The operation pipeline

Every entity operation follows a six-stage pipeline. Each stage fires a
feature hook before executing:

```
PrePoint → PreSpec → PreRequest → PreResponse → PreResult → PreDone
```

- **PrePoint**: Resolves which API endpoint to call based on the
  operation name and entity configuration.
- **PreSpec**: Builds the HTTP spec — URL, method, headers, body —
  from the resolved point and the caller's parameters.
- **PreRequest**: Sends the HTTP request. Features can intercept here
  to replace the transport (as TestFeature does with mocks).
- **PreResponse**: Parses the raw HTTP response.
- **PreResult**: Extracts the business data from the parsed response.
- **PreDone**: Final stage before returning to the caller. Entity
  state (match, data) is updated here.

If any stage errors, the pipeline short-circuits and the error surfaces
to the caller — see [Error handling](#error-handling) for how that looks
in this language.

### Features and hooks

Features are the extension mechanism. A feature is an object with a
`hooks` map. Each hook key is a pipeline stage name, and the value is
a function that receives the context.

The SDK ships with built-in features:

- **RatelimitFeature**: Rate limiting
- **RetryFeature**: Retry
- **TestFeature**: Test transport
- **TimeoutFeature**: Timeout

Features are initialized in order. Hooks fire in the order features
were added, so later features can override earlier ones.

### Module structure

```
autopay24hr/
├── src/
│   ├── Autopay24hrSDK.ts        # Main SDK class
│   ├── entity/             # Entity implementations
│   ├── feature/            # Built-in features (Base, Test, Log)
│   └── utility/            # Utility functions
├── test/                   # Test suites
└── dist/                   # Compiled output
```

Import the SDK from the package root:

```ts
import { Autopay24hrSDK } from '@voxgig-sdk/autopay24hr-sdk'
```

### Entity state

Entity instances are stateful. After a successful `load`, the entity
stores the returned data and match criteria internally. Subsequent
calls on the same instance can rely on this state.

```ts
const health = client.Health()
await health.load()

// health.data() now returns the health data from the last `load`
// health.match() returns the last match criteria
```

Call `make()` to create a fresh instance with the same configuration
but no stored state.

### Direct vs entity access

The entity interface handles URL construction, parameter placement,
and response parsing automatically. Use it for standard CRUD operations.

The `direct` method gives full control over the HTTP request. Use it
for non-standard endpoints, bulk operations, or any path not modelled
as an entity. The `prepare` method is useful for debugging — it
shows exactly what `direct` would send.


## Full Reference

See [REFERENCE.md](REFERENCE.md) for complete API reference
documentation including all method signatures, entity field schemas,
and detailed usage examples.
