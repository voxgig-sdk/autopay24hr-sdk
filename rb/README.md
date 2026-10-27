# Autopay24hr Ruby SDK



The Ruby SDK for the Autopay24hr API — an entity-oriented client using idiomatic Ruby conventions.

The SDK exposes the API as capitalised, semantic **Entities** — for example `client.ChatStatus` — with named operations (`list`/`load`) instead of raw URL paths and query strings. Working with resources and verbs keeps call sites self-describing and reduces cognitive load.

> Other languages, the CLI, and MCP server live alongside this one — see
> the [top-level README](../README.md).


## Install
This package is not yet published to RubyGems. Install it from the
GitHub release tag (`rb/vX.Y.Z`, see [Tags](https://github.com/voxgig-sdk/autopay24hr-sdk/tags)), or
from a clone:

```bash
git clone https://github.com/voxgig-sdk/autopay24hr-sdk
```

Then add it to your `Gemfile` by path, and run `bundle install`:

```ruby
gem "voxgig-sdk-autopay24hr-sdk", path: "./autopay24hr-sdk/rb"
```


## Tutorial: your first API call

This tutorial walks through creating a client, listing entities, and
loading a specific record.

### 1. Create a client

```ruby
require_relative "Autopay24hr_sdk"

client = Autopay24hrSDK.new
```

### 3. Load a chatstatus

```ruby
begin
  # load returns the ENTITY — call data_get for the ChatStatus record (raises on error).
  chatstatus = client.ChatStatus.load()
  puts chatstatus.data_get
rescue => err
  warn "load failed: #{err}"
end
```


## Error handling

Entity operations raise on failure, so rescue them:

```ruby
begin
  health = client.Health.load()
rescue => err
  warn "load failed: #{err}"
end
```

`direct` does **not** raise — it returns the result hash. Branch on
`ok`; on failure `status` holds the HTTP status (for error responses) and
`err` holds a transport error, so read both defensively:

```ruby
result = client.direct({
  "path" => "/api/resource/{id}",
  "method" => "GET",
  "params" => { "id" => "example_id" },
})

warn "request failed: #{result["err"] || "HTTP #{result["status"]}"}" unless result["ok"]
```


## How-to guides

### Make a direct HTTP request

For endpoints not covered by entity methods:

```ruby
result = client.direct({
  "path" => "/api/resource/{id}",
  "method" => "GET",
  "params" => { "id" => "example" },
})

if result["ok"]
  puts result["status"]  # 200
  puts result["data"]    # response body
else
  # On an HTTP error status there is no err (only a transport failure sets
  # it), so fall back to the status code.
  warn(result["err"] || "HTTP #{result["status"]}")
end
```

### Prepare a request without sending it

```ruby
begin
  fetchdef = client.prepare({
    "path" => "/api/resource/{id}",
    "method" => "DELETE",
    "params" => { "id" => "example" },
  })
  puts fetchdef["url"]
  puts fetchdef["method"]
  puts fetchdef["headers"]
rescue => err
  warn "prepare failed: #{err}"
end
```

### Use test mode

Create a mock client for unit testing — no server required:

```ruby
client = Autopay24hrSDK.test

# Entity ops return the ENTITY (raises on error);
# data_get reads its mock record.
health = client.Health.load()
puts health.data_get
```

### Use a custom fetch function

Replace the HTTP transport with your own function:

```ruby
mock_fetch = ->(url, init) {
  return {
    "status" => 200,
    "statusText" => "OK",
    "headers" => {},
    "json" => ->() { { "id" => "mock01" } },
  }, nil
}

client = Autopay24hrSDK.new({
  "base" => "http://localhost:8080",
  "system" => {
    "fetch" => mock_fetch,
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
cd rb && ruby -Itest -e "Dir['test/*_test.rb'].each { |f| require_relative f }"
```


## Reference

### Autopay24hrSDK

```ruby
require_relative "Autopay24hr_sdk"
client = Autopay24hrSDK.new(options)
```

Creates a new SDK client.

| Option | Type | Description |
| --- | --- | --- |
| `base` | `String` | Base URL of the API server. |
| `prefix` | `String` | URL path prefix prepended to all requests. |
| `suffix` | `String` | URL path suffix appended to all requests. |
| `feature` | `Hash` | Feature activation flags. |
| `extend` | `Hash` | Additional Feature instances to load. |
| `system` | `Hash` | System overrides (e.g. custom `fetch` lambda). |

### test

```ruby
client = Autopay24hrSDK.test(testopts, sdkopts)
```

Creates a test-mode client with mock transport. Both arguments may be `nil`.

### Autopay24hrSDK methods

| Method | Signature | Description |
| --- | --- | --- |
| `options_map` | `() -> Hash` | Deep copy of current SDK options. |
| `get_utility` | `() -> Utility` | Copy of the SDK utility object. |
| `prepare` | `(fetchargs) -> Hash` | Build an HTTP request definition without sending. Raises on error. |
| `direct` | `(fetchargs) -> Hash` | Build and send an HTTP request. Returns a result hash (`result["ok"]`); does not raise. |
| `ChatStatus` | `(data) -> ChatStatusEntity` | Create a ChatStatus entity instance. |
| `Coin` | `(data) -> CoinEntity` | Create a Coin entity instance. |
| `Health` | `(data) -> HealthEntity` | Create a Health entity instance. |
| `PairLimit` | `(data) -> PairLimitEntity` | Create a PairLimit entity instance. |
| `Quote` | `(data) -> QuoteEntity` | Create a Quote entity instance. |

### Entity interface

All entities share the same interface.

| Method | Signature | Description |
| --- | --- | --- |
| `load` | `(reqmatch, ctrl) -> any` | Load a single entity by match criteria, and return it. Raises on error. |
| `list` | `(reqmatch = nil, ctrl) -> Array` | List entities matching the criteria (call with no argument to list all), one per record. Raises on error. |
| `data_get` | `() -> Hash` | Get entity data. |
| `data_set` | `(data)` | Set entity data. |
| `match_get` | `() -> Hash` | Get entity match criteria. |
| `match_set` | `(match)` | Set entity match criteria. |
| `make` | `() -> Entity` | Create a new instance with the same options. |
| `get_name` | `() -> String` | Return the entity name. |

### Result shape

Entity operations return the entity, and `list` an `Array` of entities, one
per record; an entity's `data_get` reads its record. On failure they raise a
`Autopay24hrError` (a `StandardError` subclass), so wrap calls in
`begin`/`rescue` where you need to handle errors.

The `direct` escape hatch is the exception: it never raises and instead
returns a result `Hash` with these keys:

| Key | Type | Description |
| --- | --- | --- |
| `ok` | `Boolean` | `true` if the HTTP status is 2xx. |
| `status` | `Integer` | HTTP status code. |
| `headers` | `Hash` | Response headers. |
| `data` | `any` | Parsed JSON response body. |
| `err` | `Error` | Present when `ok` is `false`. |

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

Create an instance: `chat_status = client.ChatStatus`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `aiConfigured` | `Boolean` | Whether an AI model answers chat questions. |
| `fallbackAvailable` | `Boolean` | Whether curated fallback answers are available. |
| `model` | `String` | AI model in use, e.g. |

#### Example: Load

```ruby
# load returns the ENTITY — call data_get for the ChatStatus record (raises on error).
chat_status = client.ChatStatus.load()
```


### Coin

Create an instance: `coin = client.Coin`

#### Operations

| Method | Description |
| --- | --- |
| `list(match)` | List entities matching the criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `decimals` | `Integer` | Decimal places of the asset on this network. |
| `network` | `String` | Network slug, e.g. |
| `providers` | `Array` | Providers that route this asset; only "autopay" was observed. |
| `symbol` | `String` | Ticker symbol, e.g. |

#### Example: List

```ruby
# list returns an Array of Coin entities, one per record (raises on error).
coins = client.Coin.list
coins.each { |item| puts item.data_get }
```


### Health

Create an instance: `health = client.Health`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `checks` | `Hash` | Per-dependency checks. |
| `ok` | `Boolean` | Overall health. |
| `service` | `String` | Service name; observed "autopay". |
| `status` | `String` | Overall status; observed "ok". |
| `ts` | `Integer` | Server time of the check, epoch milliseconds. |

#### Example: Load

```ruby
# load returns the ENTITY — call data_get for the Health record (raises on error).
health = client.Health.load()
```


### PairLimit

Create an instance: `pair_limit = client.PairLimit`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `fromNetwork` | `String` | Source coin network. |
| `fromSymbol` | `String` | Source coin symbol. |
| `maxAmount` | `Float` | Maximum send amount. |
| `maxUsdApprox` | `Float` | Approximate USD value of maxAmount. |
| `minAmount` | `Float` | Minimum send amount. |
| `minNetReceive` | `Float` | Net amount of the destination coin received at the minimum send amount (undocumented). |
| `minUsdApprox` | `Float` | Approximate USD value of minAmount. |

#### Example: Load

```ruby
# load returns the ENTITY — call data_get for the PairLimit record (raises on error).
pair_limit = client.PairLimit.load({ "from_network" => "from_network", "from_symbol" => "from_symbol", "to_network" => "to_network", "to_symbol" => "to_symbol" })
```


### Quote

Create an instance: `quote = client.Quote`

#### Operations

| Method | Description |
| --- | --- |
| `list(match)` | List entities matching the criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `estimatedTime` | `String` | Human-readable completion estimate, e.g. |
| `estimatedTimeTier` | `String` | Speed tier; observed "fast" and "slow". |
| `fromAmount` | `Float` | Amount sent, in units of the source coin. |
| `grossToAmount` | `Float` | Amount of the destination coin before the spread. |
| `isBest` | `Boolean` | True for the route chosen as best. |
| `maxAmount` | `Float` | Route maximum send amount, in units of the source coin. |
| `minAmount` | `Float` | Route minimum send amount, in units of the source coin. |
| `netToAmount` | `Float` | Amount of the destination coin the user receives. |
| `networkFee` | `Float` | Network fee charged by the route (observed 0). |
| `providerFeePercent` | `Float` | Provider fee in percent (observed 0). |
| `providerName` | `String` | Route (provider) name; only "AutoPay Instant" was observed. |
| `spreadPercent` | `Float` | Spread applied by the route, in percent (observed 0 and 0.5). |

#### Example: List

```ruby
# list returns an Array of Quote entities, one per record (raises on error).
quotes = client.Quote.list({ "from_amount" => 1, "from_network" => "example", "from_symbol" => "example", "to_network" => "example", "to_symbol" => "example" })
quotes.each { |item| puts item.data_get }
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

Features are the extension mechanism. A feature is a Ruby class
with hook methods named after pipeline stages (e.g. `PrePoint`,
`PreSpec`). Each method receives the context.

The SDK ships with built-in features:

- **RatelimitFeature**: Rate limiting
- **RetryFeature**: Retry
- **TestFeature**: Test transport
- **TimeoutFeature**: Timeout

Features are initialized in order. Hooks fire in the order features
were added, so later features can override earlier ones.

### Data as hashes

The Ruby SDK uses plain Ruby hashes throughout rather than typed
objects. This mirrors the dynamic nature of the API and keeps the
SDK flexible — no code generation is needed when the API schema
changes.

Use `Helpers.to_map()` to safely validate that a value is a hash.

### Module structure

```
rb/
├── Autopay24hr_sdk.rb       -- Main SDK module
├── config.rb                  -- Configuration
├── schema.rb                  -- Generated option + entity specs
├── features.rb                -- Feature factory
├── core/                      -- Core types and context
├── entity/                    -- Entity implementations
├── feature/                   -- Built-in features (Base, Test, Log)
├── utility/                   -- Utility functions and struct library
└── test/                      -- Test suites
```

The main module (`Autopay24hr_sdk`) exports the SDK class
and test helper. Import entity or utility modules directly only
when needed.

### Entity state

Entity instances are stateful. After a successful `load`, the entity
stores the returned data and match criteria internally.

```ruby
health = client.Health
health.load()

# health.data_get now returns the health data from the last load
# health.match_get returns the last match criteria
```

Call `make` to create a fresh instance with the same configuration
but no stored state.

### Direct vs entity access

The entity interface handles URL construction, parameter placement,
and response parsing automatically. Use it for standard CRUD operations.

`direct` gives full control over the HTTP request. Use it for
non-standard endpoints, bulk operations, or any path not modelled as
an entity. `prepare` builds the request without sending it — useful
for debugging or custom transport.


## Full Reference

See [REFERENCE.md](REFERENCE.md) for complete API reference
documentation including all method signatures, entity field schemas,
and detailed usage examples.
