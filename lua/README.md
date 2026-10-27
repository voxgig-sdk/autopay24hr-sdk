# Autopay24hr Lua SDK



The Lua SDK for the Autopay24hr API — an entity-oriented client using Lua conventions.

It exposes the API as capitalised, semantic **Entities** — e.g. `client:ChatStatus()` — each with the same small set of operations (`list`, `load`) instead of raw URL paths and query strings. You call meaning, not endpoints, which keeps the cognitive load low.

> Other languages, the CLI, and MCP server live alongside this one — see
> the [top-level README](../README.md).


## Install
This package is not yet published to LuaRocks. Install it from the
GitHub release tag (`lua/vX.Y.Z`, see [Tags](https://github.com/voxgig-sdk/autopay24hr-sdk/tags)),
or add the source directory to your `LUA_PATH`:

```bash
export LUA_PATH="path/to/lua/?.lua;path/to/lua/?/init.lua;;"
```


## Tutorial: your first API call

This tutorial walks through creating a client, listing entities, and
loading a specific record.

### 1. Create a client

```lua
local sdk = require("autopay24hr_sdk")

local client = sdk.new()
```

### 3. Load a chatstatus

`load` returns the entity; `data_get()` reads its record.

```lua
local chatstatus, err = client:ChatStatus():load()
if err then error(err) end
for k, val in pairs(chatstatus:data_get()) do print(k, val) end
```


## Error handling

Entity operations return `(value, err)`. Check `err` before using
the value:

```lua
local health, err = client:Health():load()
if err then error(err) end
```

`direct` follows the same `(value, err)` convention:

```lua
local result, err = client:direct({
  path = "/api/resource/{id}",
  method = "GET",
  params = { id = "example_id" },
})
if err then error(err) end
```


## How-to guides

### Make a direct HTTP request

For endpoints not covered by entity methods:

```lua
local result, err = client:direct({
  path = "/api/resource/{id}",
  method = "GET",
  params = { id = "example" },
})
if err then error(err) end

if result["ok"] then
  print(result["status"])  -- 200
  print(result["data"])    -- response body
end
```

### Prepare a request without sending it

```lua
local fetchdef, err = client:prepare({
  path = "/api/resource/{id}",
  method = "DELETE",
  params = { id = "example" },
})
if err then error(err) end

print(fetchdef["url"])
print(fetchdef["method"])
print(fetchdef["headers"])
```

### Use test mode

Create a mock client for unit testing — no server required:

```lua
local client = sdk.test()

local result, err = client:Health():load()
-- result is the entity; data_get() reads its mock record; err is set on failure
```

### Use a custom fetch function

Replace the HTTP transport with your own function:

```lua
local function mock_fetch(url, init)
  return {
    status = 200,
    statusText = "OK",
    headers = {},
    json = function()
      return { id = "mock01" }
    end,
  }, nil
end

local client = sdk.new({
  base = "http://localhost:8080",
  system = {
    fetch = mock_fetch,
  },
})
```

### Run live tests

Create a `.env.local` file at the project root:

```
AUTOPAY24HR_TEST_LIVE=TRUE
```

Then run:

```bash
cd lua && busted test/
```


## Reference

### Autopay24hrSDK

```lua
local sdk = require("autopay24hr_sdk")
local client = sdk.new(options)
```

Creates a new SDK client.

| Option | Type | Description |
| --- | --- | --- |
| `base` | `string` | Base URL of the API server. |
| `prefix` | `string` | URL path prefix prepended to all requests. |
| `suffix` | `string` | URL path suffix appended to all requests. |
| `feature` | `table` | Feature activation flags. |
| `extend` | `table` | Additional Feature instances to load. |
| `system` | `table` | System overrides (e.g. custom `fetch` function). |

### test

```lua
local client = sdk.test(testopts, sdkopts)
```

Creates a test-mode client with mock transport. Both arguments may be `nil`.

### Autopay24hrSDK methods

| Method | Signature | Description |
| --- | --- | --- |
| `options_map` | `() -> table` | Deep copy of current SDK options. |
| `get_utility` | `() -> Utility` | Copy of the SDK utility object. |
| `prepare` | `(fetchargs) -> table, err` | Build an HTTP request definition without sending. |
| `direct` | `(fetchargs) -> table, err` | Build and send an HTTP request. |
| `ChatStatus` | `(data) -> ChatStatusEntity` | Create a ChatStatus entity instance. |
| `Coin` | `(data) -> CoinEntity` | Create a Coin entity instance. |
| `Health` | `(data) -> HealthEntity` | Create a Health entity instance. |
| `PairLimit` | `(data) -> PairLimitEntity` | Create a PairLimit entity instance. |
| `Quote` | `(data) -> QuoteEntity` | Create a Quote entity instance. |

### Entity interface

All entities share the same interface.

| Method | Signature | Description |
| --- | --- | --- |
| `load` | `(reqmatch, ctrl) -> any, err` | Load a single entity by match criteria, and return it. |
| `list` | `(reqmatch, ctrl) -> any, err` | List entities matching the criteria, one per record. |
| `data_get` | `() -> table` | Get entity data. |
| `data_set` | `(data)` | Set entity data. |
| `match_get` | `() -> table` | Get entity match criteria. |
| `match_set` | `(match)` | Set entity match criteria. |
| `make` | `() -> Entity` | Create a new instance with the same options. |
| `get_name` | `() -> string` | Return the entity name. |

### Result shape

Entity operations return `(value, err)`. The `value` is the entity
itself — there is no wrapper:

| Operation | `value` |
| --- | --- |
| `load` | the entity, whose `data_get()` reads its record (a `table`) |
| `list` | an array (`table`) of entities, one per record |

Check `err` first (it is non-`nil` on failure), then use `value`:

    local chat_status, err = client:ChatStatus():load()
    if err then error(err) end
    -- chat_status is the loaded entity

Only `direct()` returns a response envelope — a `table` with `ok`,
`status`, `headers`, and `data` keys.

### Entities

#### ChatStatus

| Field | Description |
| --- | --- |
| `aiConfigured` | Whether an AI model answers chat questions. |
| `fallbackAvailable` | Whether curated fallback answers are available. |
| `model` | AI model in use, e.g. |

Operations: Load.

API path: `/api/v1/chat/status`

#### Coin

| Field | Description |
| --- | --- |
| `decimals` | Decimal places of the asset on this network. |
| `network` | Network slug, e.g. |
| `providers` | Providers that route this asset; only "autopay" was observed. |
| `symbol` | Ticker symbol, e.g. |

Operations: List.

API path: `/api/v1/coins`

#### Health

| Field | Description |
| --- | --- |
| `checks` | Per-dependency checks. |
| `ok` | Overall health. |
| `service` | Service name; observed "autopay". |
| `status` | Overall status; observed "ok". |
| `ts` | Server time of the check, epoch milliseconds. |

Operations: Load.

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

Operations: Load.

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

Operations: List.

API path: `/api/v1/quote`



## Entities


### ChatStatus

Create an instance: `local chat_status = client:ChatStatus(nil)`

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

```lua
local chat_status, err = client:ChatStatus():load()
```


### Coin

Create an instance: `local coin = client:Coin(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `list(match)` | List entities matching the criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `decimals` | `number` | Decimal places of the asset on this network. |
| `network` | `string` | Network slug, e.g. |
| `providers` | `table` | Providers that route this asset; only "autopay" was observed. |
| `symbol` | `string` | Ticker symbol, e.g. |

#### Example: List

```lua
local coins, err = client:Coin():list()
```


### Health

Create an instance: `local health = client:Health(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `checks` | `table` | Per-dependency checks. |
| `ok` | `boolean` | Overall health. |
| `service` | `string` | Service name; observed "autopay". |
| `status` | `string` | Overall status; observed "ok". |
| `ts` | `number` | Server time of the check, epoch milliseconds. |

#### Example: Load

```lua
local health, err = client:Health():load()
```


### PairLimit

Create an instance: `local pair_limit = client:PairLimit(nil)`

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

```lua
local pair_limit, err = client:PairLimit():load({ from_network = "from_network", from_symbol = "from_symbol", to_network = "to_network", to_symbol = "to_symbol" })
```


### Quote

Create an instance: `local quote = client:Quote(nil)`

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

```lua
local quotes, err = client:Quote():list({ from_amount = 1, from_network = "example", from_symbol = "example", to_network = "example", to_symbol = "example" })
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

Features are the extension mechanism. A feature is a Lua table
with hook methods named after pipeline stages (e.g. `PrePoint`,
`PreSpec`). Each method receives the context.

The SDK ships with built-in features:

- **RatelimitFeature**: Rate limiting
- **RetryFeature**: Retry
- **TestFeature**: Test transport
- **TimeoutFeature**: Timeout

Features are initialized in order. Hooks fire in the order features
were added, so later features can override earlier ones.

### Data as tables

The Lua SDK uses plain Lua tables throughout rather than typed
objects. This mirrors the dynamic nature of the API and keeps the
SDK flexible — no code generation is needed when the API schema
changes.

Use `helpers.to_map()` to safely validate that a value is a table.

### Module structure

```
lua/
├── autopay24hr_sdk.lua    -- Main SDK module
├── config.lua               -- Configuration
├── schema.lua               -- Generated option + entity specs
├── features.lua             -- Feature factory
├── core/                    -- Core types and context
├── entity/                  -- Entity implementations
├── feature/                 -- Built-in features (Base, Test, Log)
├── utility/                 -- Utility functions and struct library
└── test/                    -- Test suites
```

The main module (`autopay24hr_sdk`) exports the SDK constructor
and test helper. Import entity or utility modules directly only
when needed.

### Entity state

Entity instances are stateful. After a successful `load`, the entity
stores the returned data and match criteria internally.

```lua
local health = client:Health()
health:load()

-- health:data_get() now returns the health data from the last load
-- health:match_get() returns the last match criteria
```

Call `make()` to create a fresh instance with the same configuration
but no stored state.

### Direct vs entity access

The entity interface handles URL construction, parameter placement,
and response parsing automatically. Use it for standard CRUD operations.

`direct()` gives full control over the HTTP request. Use it for
non-standard endpoints, bulk operations, or any path not modelled as
an entity. `prepare()` builds the request without sending it — useful
for debugging or custom transport.


## Full Reference

See [REFERENCE.md](REFERENCE.md) for complete API reference
documentation including all method signatures, entity field schemas,
and detailed usage examples.
