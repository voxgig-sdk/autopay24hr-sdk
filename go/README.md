# Autopay24hr Golang SDK



The Golang SDK for the Autopay24hr API — an entity-oriented client using standard Go conventions. No generics required; data flows as `map[string]any`.

It exposes the API as capitalised, semantic **Entities** — e.g. `client.ChatStatus(nil)` — each with the same small set of operations (`List`, `Load`) instead of raw URL paths and query strings. You call meaning, not endpoints, which keeps the cognitive load low.

> Also generated from this model: `go-cli`, `go-mcp`, `lua`, `php`, `py`, `rb`, `ts` — see
> the [top-level README](../README.md).


## Install
```bash
go get github.com/voxgig-sdk/autopay24hr-sdk/go@latest
```

The Go module proxy resolves the version from the `go/vX.Y.Z` GitHub
release tag — see [Tags](https://github.com/voxgig-sdk/autopay24hr-sdk/tags) for the available versions.

To vendor from a local checkout instead, clone this repo alongside your
project and add a `replace` directive pointing at the checked-out
`go/` directory:

```bash
go mod edit -replace github.com/voxgig-sdk/autopay24hr-sdk/go=../autopay24hr-sdk/go
```


## Tutorial: your first API call

This tutorial walks through creating a client, listing entities, and
loading a specific record.

### Quickstart

A complete program: create a client, then call the entity operations.
Each operation returns `(value, error)` — the value is the entity, and for
`List` a `[]any` of entities, one per record (there is no `{ok, data}`
wrapper), so check `err` and read a record through the entity's
`Data()`.

```go
package main

import (
    "fmt"
    sdk "github.com/voxgig-sdk/autopay24hr-sdk/go"
)

func main() {
    client := sdk.New()

    // Load a single chatStatus — the value is the entity; Data() reads its record.
    chatStatus, err := client.ChatStatus(nil).Load(nil, nil)
    if err != nil {
        panic(err)
    }
    fmt.Println(chatStatus.(sdk.Entity).Data())
}
```


## Error handling

Every entity operation returns `(value, error)`. Check `err` before
using the value — there is no exception to catch:

```go
health, err := client.Health(nil).Load(nil, nil)
if err != nil {
    // handle err
    return
}
_ = health
```

`Direct` follows the same `(value, error)` convention:

```go
result, err := client.Direct(map[string]any{
    "path":   "/api/resource/{id}",
    "method": "GET",
    "params": map[string]any{"id": "example_id"},
})
if err != nil {
    // handle err
}
_ = result
```


## How-to guides

### Make a direct HTTP request

For endpoints not covered by entity methods:

```go
result, err := client.Direct(map[string]any{
    "path":   "/api/resource/{id}",
    "method": "GET",
    "params": map[string]any{"id": "example"},
})
if err != nil {
    panic(err)
}

if result["ok"] == true {
    fmt.Println(result["status"]) // 200
    fmt.Println(result["data"])   // response body
}
```

### Prepare a request without sending it

```go
fetchdef, err := client.Prepare(map[string]any{
    "path":   "/api/resource/{id}",
    "method": "DELETE",
    "params": map[string]any{"id": "example"},
})
if err != nil {
    panic(err)
}

fmt.Println(fetchdef["url"])
fmt.Println(fetchdef["method"])
fmt.Println(fetchdef["headers"])
```

### Use test mode

Create a mock client for unit testing — no server required:

```go
client := sdk.Test()

health, err := client.Health(nil).Load(
    nil, nil,
)
if err != nil {
    panic(err)
}
fmt.Println(health.(sdk.Entity).Data()) // the entity's mock record
```

### Use a custom fetch function

Replace the HTTP transport with your own function:

```go
mockFetch := func(url string, init map[string]any) (map[string]any, error) {
    return map[string]any{
        "status":     200,
        "statusText": "OK",
        "headers":    map[string]any{},
        "json": (func() any)(func() any {
            return map[string]any{"id": "mock01"}
        }),
    }, nil
}

client := sdk.NewAutopay24hrSDK(map[string]any{
    "base": "http://localhost:8080",
    "system": map[string]any{
        "fetch": (func(string, map[string]any) (map[string]any, error))(mockFetch),
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
cd go && go test ./test/...
```


## Reference

### NewAutopay24hrSDK

```go
func NewAutopay24hrSDK(options map[string]any) *Autopay24hrSDK
```

Creates a new SDK client.

| Option | Type | Description |
| --- | --- | --- |
| `"base"` | `string` | Base URL of the API server. |
| `"prefix"` | `string` | URL path prefix prepended to all requests. |
| `"suffix"` | `string` | URL path suffix appended to all requests. |
| `"feature"` | `map[string]any` | Feature activation flags. |
| `"extend"` | `[]any` | Additional Feature instances to load. |
| `"system"` | `map[string]any` | System overrides (e.g. custom `"fetch"` function). |

### TestSDK

```go
func TestSDK(testopts map[string]any, sdkopts map[string]any) *Autopay24hrSDK
```

Creates a test-mode client with mock transport. Both arguments may be `nil`.

### Autopay24hrSDK methods

| Method | Signature | Description |
| --- | --- | --- |
| `OptionsMap` | `() map[string]any` | Deep copy of current SDK options. |
| `GetUtility` | `() *Utility` | Copy of the SDK utility object. |
| `Prepare` | `(fetchargs map[string]any) (map[string]any, error)` | Build an HTTP request definition without sending. |
| `Direct` | `(fetchargs map[string]any) (map[string]any, error)` | Build and send an HTTP request. |
| `ChatStatus` | `(data map[string]any) Autopay24hrEntity` | Create a ChatStatus entity instance. |
| `Coin` | `(data map[string]any) Autopay24hrEntity` | Create a Coin entity instance. |
| `Health` | `(data map[string]any) Autopay24hrEntity` | Create a Health entity instance. |
| `PairLimit` | `(data map[string]any) Autopay24hrEntity` | Create a PairLimit entity instance. |
| `Quote` | `(data map[string]any) Autopay24hrEntity` | Create a Quote entity instance. |

### Entity interface (Autopay24hrEntity)

All entities implement the `Autopay24hrEntity` interface.

| Method | Signature | Description |
| --- | --- | --- |
| `Load` | `(reqmatch, ctrl map[string]any) (any, error)` | Load a single entity by match criteria, and return it. |
| `List` | `(reqmatch, ctrl map[string]any) (any, error)` | List entities matching the criteria, one per record. |
| `Data` | `(args ...any) any` | Get or set entity data. |
| `Match` | `(args ...any) any` | Get or set entity match criteria. |
| `Make` | `() Entity` | Create a new instance with the same options. |
| `GetName` | `() string` | Return the entity name. |

### Result shape

Entity operations return `(value, error)`. The `value` is the entity
itself — there is no wrapper:

| Operation | `value` |
| --- | --- |
| `Load` | the entity, whose `Data()` reads its record (`map[string]any`) |
| `List` | a `[]any` of entities, one per record |

Check `err` first, then use the value directly (or the typed
`...Typed` variants, which return the entity's model struct and a typed
slice):

    chatStatus, err := client.ChatStatus(nil).Load(nil, nil)
    if err != nil { /* handle */ }
    // chatStatus is the entity; chatStatus.(sdk.Entity).Data() reads its record

Only `Direct()` returns a response envelope — a `map[string]any` with
`"ok"`, `"status"`, `"headers"`, and `"data"` keys.

### Entities

#### ChatStatus

| Field | Description |
| --- | --- |
| `"aiConfigured"` | Whether an AI model answers chat questions. |
| `"fallbackAvailable"` | Whether curated fallback answers are available. |
| `"model"` | AI model in use, e.g. |

Operations: Load.

API path: `/api/v1/chat/status`

#### Coin

| Field | Description |
| --- | --- |
| `"decimals"` | Decimal places of the asset on this network. |
| `"network"` | Network slug, e.g. |
| `"providers"` | Providers that route this asset; only "autopay" was observed. |
| `"symbol"` | Ticker symbol, e.g. |

Operations: List.

API path: `/api/v1/coins`

#### Health

| Field | Description |
| --- | --- |
| `"checks"` | Per-dependency checks. |
| `"ok"` | Overall health. |
| `"service"` | Service name; observed "autopay". |
| `"status"` | Overall status; observed "ok". |
| `"ts"` | Server time of the check, epoch milliseconds. |

Operations: Load.

API path: `/api/health`

#### PairLimit

| Field | Description |
| --- | --- |
| `"fromNetwork"` | Source coin network. |
| `"fromSymbol"` | Source coin symbol. |
| `"maxAmount"` | Maximum send amount. |
| `"maxUsdApprox"` | Approximate USD value of maxAmount. |
| `"minAmount"` | Minimum send amount. |
| `"minNetReceive"` | Net amount of the destination coin received at the minimum send amount (undocumented). |
| `"minUsdApprox"` | Approximate USD value of minAmount. |

Operations: Load.

API path: `/api/v1/pair-limits`

#### Quote

| Field | Description |
| --- | --- |
| `"estimatedTime"` | Human-readable completion estimate, e.g. |
| `"estimatedTimeTier"` | Speed tier; observed "fast" and "slow". |
| `"fromAmount"` | Amount sent, in units of the source coin. |
| `"grossToAmount"` | Amount of the destination coin before the spread. |
| `"isBest"` | True for the route chosen as best. |
| `"maxAmount"` | Route maximum send amount, in units of the source coin. |
| `"minAmount"` | Route minimum send amount, in units of the source coin. |
| `"netToAmount"` | Amount of the destination coin the user receives. |
| `"networkFee"` | Network fee charged by the route (observed 0). |
| `"providerFeePercent"` | Provider fee in percent (observed 0). |
| `"providerName"` | Route (provider) name; only "AutoPay Instant" was observed. |
| `"spreadPercent"` | Spread applied by the route, in percent (observed 0 and 0.5). |

Operations: List.

API path: `/api/v1/quote`



## Entities


### ChatStatus

Create an instance: `chatStatus := client.ChatStatus(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `Load(match, ctrl)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `aiConfigured` | `bool` | Whether an AI model answers chat questions. |
| `fallbackAvailable` | `bool` | Whether curated fallback answers are available. |
| `model` | `string` | AI model in use, e.g. |

#### Example: Load

```go
chatStatus, err := client.ChatStatus(nil).Load(nil, nil)
if err != nil {
    panic(err)
}
fmt.Println(chatStatus.(sdk.Entity).Data()) // the loaded entity's record
```


### Coin

Create an instance: `coin := client.Coin(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `List(match, ctrl)` | List entities matching the criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `decimals` | `int` | Decimal places of the asset on this network. |
| `network` | `string` | Network slug, e.g. |
| `providers` | `[]any` | Providers that route this asset; only "autopay" was observed. |
| `symbol` | `string` | Ticker symbol, e.g. |

#### Example: List

```go
coins, err := client.Coin(nil).List(nil, nil)
if err != nil {
    panic(err)
}
// A []any of entities, one per record.
for _, item := range coins.([]any) {
    fmt.Println(item.(sdk.Entity).Data())
}
```


### Health

Create an instance: `health := client.Health(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `Load(match, ctrl)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `checks` | `map[string]any` | Per-dependency checks. |
| `ok` | `bool` | Overall health. |
| `service` | `string` | Service name; observed "autopay". |
| `status` | `string` | Overall status; observed "ok". |
| `ts` | `int` | Server time of the check, epoch milliseconds. |

#### Example: Load

```go
health, err := client.Health(nil).Load(nil, nil)
if err != nil {
    panic(err)
}
fmt.Println(health.(sdk.Entity).Data()) // the loaded entity's record
```


### PairLimit

Create an instance: `pairLimit := client.PairLimit(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `Load(match, ctrl)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `fromNetwork` | `string` | Source coin network. |
| `fromSymbol` | `string` | Source coin symbol. |
| `maxAmount` | `float64` | Maximum send amount. |
| `maxUsdApprox` | `float64` | Approximate USD value of maxAmount. |
| `minAmount` | `float64` | Minimum send amount. |
| `minNetReceive` | `float64` | Net amount of the destination coin received at the minimum send amount (undocumented). |
| `minUsdApprox` | `float64` | Approximate USD value of minAmount. |

#### Example: Load

```go
pairLimit, err := client.PairLimit(nil).Load(map[string]any{"from_network": "from_network", "from_symbol": "from_symbol", "to_network": "to_network", "to_symbol": "to_symbol"}, nil)
if err != nil {
    panic(err)
}
fmt.Println(pairLimit.(sdk.Entity).Data()) // the loaded entity's record
```


### Quote

Create an instance: `quote := client.Quote(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `List(match, ctrl)` | List entities matching the criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `estimatedTime` | `string` | Human-readable completion estimate, e.g. |
| `estimatedTimeTier` | `string` | Speed tier; observed "fast" and "slow". |
| `fromAmount` | `float64` | Amount sent, in units of the source coin. |
| `grossToAmount` | `float64` | Amount of the destination coin before the spread. |
| `isBest` | `bool` | True for the route chosen as best. |
| `maxAmount` | `float64` | Route maximum send amount, in units of the source coin. |
| `minAmount` | `float64` | Route minimum send amount, in units of the source coin. |
| `netToAmount` | `float64` | Amount of the destination coin the user receives. |
| `networkFee` | `float64` | Network fee charged by the route (observed 0). |
| `providerFeePercent` | `float64` | Provider fee in percent (observed 0). |
| `providerName` | `string` | Route (provider) name; only "AutoPay Instant" was observed. |
| `spreadPercent` | `float64` | Spread applied by the route, in percent (observed 0 and 0.5). |

#### Example: List

```go
quotes, err := client.Quote(nil).List(map[string]any{"from_amount": 1, "from_network": "example", "from_symbol": "example", "to_network": "example", "to_symbol": "example"}, nil)
if err != nil {
    panic(err)
}
// A []any of entities, one per record.
for _, item := range quotes.([]any) {
    fmt.Println(item.(sdk.Entity).Data())
}
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

Features are the extension mechanism. A feature implements the
`Feature` interface and provides hooks — functions keyed by pipeline
stage names.

The SDK ships with built-in features:

- **RatelimitFeature**: Rate limiting
- **RetryFeature**: Retry
- **TestFeature**: Test transport
- **TimeoutFeature**: Timeout

Features are initialized in order. Hooks fire in the order features
were added, so later features can override earlier ones.

### Data as maps

The Go SDK uses `map[string]any` throughout rather than typed structs.
This mirrors the dynamic nature of the API and keeps the SDK
flexible — no code generation is needed when the API schema changes.

An operation returns the entity, and its `Data()` returns the record. Use
`core.ToMapAny()` to safely cast that record, or data nested in it, to
`map[string]any`: it returns `nil` for anything else, an entity included.

### Package structure

```
github.com/voxgig-sdk/autopay24hr-sdk/go/
├── autopay24hr.go        # Root package — type aliases and constructors
├── core/               # SDK core — client, types, pipeline
├── entity/             # Entity implementations
├── feature/            # Built-in features (Base, Test, Log)
├── utility/            # Utility functions and struct library
└── test/               # Test suites
```

The root package (`github.com/voxgig-sdk/autopay24hr-sdk/go`) re-exports everything needed
for normal use. Import sub-packages only when you need specific types
like `core.ToMapAny`.

### Entity state

Entity instances are stateful. After a successful `Load`, the entity
stores the returned data and match criteria internally.

```go
health := client.Health(nil)
health.Load(nil, nil)

// health.Data() now returns the health data from the last load
// health.Match() returns the last match criteria
```

Call `Make()` to create a fresh instance with the same configuration
but no stored state.

### Direct vs entity access

The entity interface handles URL construction, parameter placement,
and response parsing automatically. Use it for standard CRUD operations.

`Direct()` gives full control over the HTTP request. Use it for
non-standard endpoints, bulk operations, or any path not modelled as
an entity. `Prepare()` builds the request without sending it — useful
for debugging or custom transport.


## Full Reference

See [REFERENCE.md](REFERENCE.md) for complete API reference
documentation including all method signatures, entity field schemas,
and detailed usage examples.
