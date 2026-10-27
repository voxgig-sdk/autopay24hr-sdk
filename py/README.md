# Autopay24hr Python SDK



The Python SDK for the Autopay24hr API — an entity-oriented client following Pythonic conventions.

The SDK exposes the API as capitalised, semantic **Entities** — for example `client.ChatStatus()` — each
carrying a small, uniform set of operations (`list`, `load`) instead of raw URL
paths and query strings. You work with named resources and verbs, which
keeps the cognitive load low.

> Other languages, the CLI, and MCP server live alongside this one — see
> the [top-level README](../README.md).


## Install
This package is not yet published to PyPI. Install it from the GitHub
release tag (`py/vX.Y.Z`, see [Tags](https://github.com/voxgig-sdk/autopay24hr-sdk/tags)) or
from a source checkout:

```bash
pip install -e .
```


## Tutorial: your first API call

This tutorial walks through creating a client, listing entities, and
loading a specific record.

### 1. Create a client

```python
from autopay24hr_sdk import Autopay24hrSDK

client = Autopay24hrSDK()
```

### 3. Load a chatstatus

`load()` returns the ENTITY — call data_get() for the record — and raises on error.

```python
try:
    chatstatus = client.ChatStatus().load()
    print(chatstatus.data_get())
except Exception as err:
    print(f"load failed: {err}")
```


## Error handling

Entity operations raise on failure, so wrap them in `try` / `except`:

```python
try:
    health = client.Health().load()
    print(health.data_get())
except Exception as err:
    print(f"load failed: {err}")
```

`direct()` does **not** raise — it returns the result envelope. Branch
on `ok`; on failure `status` holds the HTTP status (for error responses)
and `err` holds a transport error, so read both defensively:

```python
result = client.direct({
    "path": "/api/resource/{id}",
    "method": "GET",
    "params": {"id": "example_id"},
})

if not result["ok"]:
    print("request failed:", result.get("status"), result.get("err"))
```


## How-to guides

### Make a direct HTTP request

For endpoints not covered by entity methods:

```python
result = client.direct({
    "path": "/api/resource/{id}",
    "method": "GET",
    "params": {"id": "example"},
})

if result["ok"]:
    print(result["status"])  # 200
    print(result["data"])    # response body
else:
    # A non-2xx response carries status + data (the error body); a
    # transport-level failure carries err instead. Only one is present, so
    # read both with .get() rather than indexing a key that may be absent.
    print(result.get("status"), result.get("err"))
```

### Prepare a request without sending it

```python
# prepare() returns the fetch definition and raises on error.
fetchdef = client.prepare({
    "path": "/api/resource/{id}",
    "method": "DELETE",
    "params": {"id": "example"},
})

print(fetchdef["url"])
print(fetchdef["method"])
print(fetchdef["headers"])
```

### Use test mode

Create a mock client for unit testing — no server required:

```python
client = Autopay24hrSDK.test()

# Entity ops return the entity, and list one per record; they raise on error.
health = client.Health().load()
# data_get() on an entity reads its mock response record
```

### Use a custom fetch function

Replace the HTTP transport with your own function:

```python
def mock_fetch(url, init):
    return {
        "status": 200,
        "statusText": "OK",
        "headers": {},
        "json": lambda: {"id": "mock01"},
    }, None

client = Autopay24hrSDK({
    "base": "http://localhost:8080",
    "system": {
        "fetch": mock_fetch,
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
cd py && pytest test/
```


## Reference

### Autopay24hrSDK

```python
from autopay24hr_sdk import Autopay24hrSDK

client = Autopay24hrSDK(options)
```

Creates a new SDK client.

| Option | Type | Description |
| --- | --- | --- |
| `base` | `str` | Base URL of the API server. |
| `prefix` | `str` | URL path prefix prepended to all requests. |
| `suffix` | `str` | URL path suffix appended to all requests. |
| `feature` | `dict` | Feature activation flags. |
| `extend` | `list` | Additional Feature instances to load. |
| `system` | `dict` | System overrides (e.g. custom `fetch` function). |

### test

```python
client = Autopay24hrSDK.test(testopts, sdkopts)
```

Creates a test-mode client with mock transport. Both arguments may be `None`.

### Autopay24hrSDK methods

| Method | Signature | Description |
| --- | --- | --- |
| `options_map` | `() -> dict` | Deep copy of current SDK options. |
| `get_utility` | `() -> Utility` | Copy of the SDK utility object. |
| `prepare` | `(fetchargs) -> dict` | Build an HTTP request definition without sending. Raises on error. |
| `direct` | `(fetchargs) -> dict` | Build and send an HTTP request. Returns a result dict (branch on `ok`). |
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
| `list` | `(reqmatch, ctrl) -> list` | List entities matching the criteria, one per record. Raises on error. |
| `data_get` | `() -> dict` | Get entity data. |
| `data_set` | `(data)` | Set entity data. |
| `match_get` | `() -> dict` | Get entity match criteria. |
| `match_set` | `(match)` | Set entity match criteria. |
| `make` | `() -> Entity` | Create a new instance with the same options. |
| `get_name` | `() -> str` | Return the entity name. |

### Result shape

Entity operations return the entity, and `list` a `list` of entities, one
per record; an entity's `data_get()` reads its record (a `dict`). They raise
on error, so wrap calls in `try`/`except` to handle failures.

The `direct()` escape hatch never raises — it returns a result `dict`
you branch on via `result["ok"]`:

| Key | Type | Description |
| --- | --- | --- |
| `ok` | `bool` | `True` if the HTTP status is 2xx. |
| `status` | `int` | HTTP status code. |
| `headers` | `dict` | Response headers. |
| `data` | `any` | Parsed JSON response body. |

On error, `ok` is `False` and `err` contains the error value.

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

Create an instance: `chat_status = client.ChatStatus()`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `aiConfigured` | `bool` | Whether an AI model answers chat questions. |
| `fallbackAvailable` | `bool` | Whether curated fallback answers are available. |
| `model` | `str` | AI model in use, e.g. |

#### Example: Load

```python
chat_status = client.ChatStatus().load()
```


### Coin

Create an instance: `coin = client.Coin()`

#### Operations

| Method | Description |
| --- | --- |
| `list()` | List entities, optionally matching the given criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `decimals` | `int` | Decimal places of the asset on this network. |
| `network` | `str` | Network slug, e.g. |
| `providers` | `list` | Providers that route this asset; only "autopay" was observed. |
| `symbol` | `str` | Ticker symbol, e.g. |

#### Example: List

```python
coins = client.Coin().list()
```


### Health

Create an instance: `health = client.Health()`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `checks` | `dict` | Per-dependency checks. |
| `ok` | `bool` | Overall health. |
| `service` | `str` | Service name; observed "autopay". |
| `status` | `str` | Overall status; observed "ok". |
| `ts` | `int` | Server time of the check, epoch milliseconds. |

#### Example: Load

```python
health = client.Health().load()
```


### PairLimit

Create an instance: `pair_limit = client.PairLimit()`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `fromNetwork` | `str` | Source coin network. |
| `fromSymbol` | `str` | Source coin symbol. |
| `maxAmount` | `float` | Maximum send amount. |
| `maxUsdApprox` | `float` | Approximate USD value of maxAmount. |
| `minAmount` | `float` | Minimum send amount. |
| `minNetReceive` | `float` | Net amount of the destination coin received at the minimum send amount (undocumented). |
| `minUsdApprox` | `float` | Approximate USD value of minAmount. |

#### Example: Load

```python
pair_limit = client.PairLimit().load({"from_network": "from_network", "from_symbol": "from_symbol", "to_network": "to_network", "to_symbol": "to_symbol"})
```


### Quote

Create an instance: `quote = client.Quote()`

#### Operations

| Method | Description |
| --- | --- |
| `list()` | List entities, optionally matching the given criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `estimatedTime` | `str` | Human-readable completion estimate, e.g. |
| `estimatedTimeTier` | `str` | Speed tier; observed "fast" and "slow". |
| `fromAmount` | `float` | Amount sent, in units of the source coin. |
| `grossToAmount` | `float` | Amount of the destination coin before the spread. |
| `isBest` | `bool` | True for the route chosen as best. |
| `maxAmount` | `float` | Route maximum send amount, in units of the source coin. |
| `minAmount` | `float` | Route minimum send amount, in units of the source coin. |
| `netToAmount` | `float` | Amount of the destination coin the user receives. |
| `networkFee` | `float` | Network fee charged by the route (observed 0). |
| `providerFeePercent` | `float` | Provider fee in percent (observed 0). |
| `providerName` | `str` | Route (provider) name; only "AutoPay Instant" was observed. |
| `spreadPercent` | `float` | Spread applied by the route, in percent (observed 0 and 0.5). |

#### Example: List

```python
quotes = client.Quote().list({"from_amount": 1, "from_network": "example", "from_symbol": "example", "to_network": "example", "to_symbol": "example"})
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

Features are the extension mechanism. A feature is a Python class
with hook methods named after pipeline stages (e.g. `PrePoint`,
`PreSpec`). Each method receives the context.

The SDK ships with built-in features:

- **RatelimitFeature**: Rate limiting
- **RetryFeature**: Retry
- **TestFeature**: Test transport
- **TimeoutFeature**: Timeout

Features are initialized in order. Hooks fire in the order features
were added, so later features can override earlier ones.

### Data as dicts

The Python SDK uses plain dicts throughout rather than typed
objects. This mirrors the dynamic nature of the API and keeps the
SDK flexible — no code generation is needed when the API schema
changes.

Use `helpers.to_map()` to safely validate that a value is a dict.

### Module structure

```
py/
├── autopay24hr_sdk.py         -- Main SDK module
├── config.py                    -- Configuration
├── schema.py                    -- Generated option + entity specs
├── features.py                  -- Feature factory
├── core/                        -- Core types and context
├── entity/                      -- Entity implementations
├── feature/                     -- Built-in features (Base, Test, Log)
├── utility/                     -- Utility functions and struct library
└── test/                        -- Test suites
```

The main module (`autopay24hr_sdk`) exports the SDK class.
Import entity or utility modules directly only when needed.

### Entity state

Entity instances are stateful. After a successful `load`, the entity
stores the returned data and match criteria internally.

```python
health = client.Health()
health.load()

# health.data_get() now returns the health data from the last load
# health.match_get() returns the last match criteria
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
