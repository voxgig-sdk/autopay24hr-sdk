# Autopay24hr Python SDK Reference

Complete API reference for the Autopay24hr Python SDK.


## Autopay24hrSDK

### Constructor

```python
from autopay24hr_sdk import Autopay24hrSDK

client = Autopay24hrSDK(options)
```

Create a new SDK client instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `options` | `dict` | SDK configuration options. |
| `options["base"]` | `str` | Base URL for API requests. |
| `options["prefix"]` | `str` | URL prefix appended after base. |
| `options["suffix"]` | `str` | URL suffix appended after path. |
| `options["headers"]` | `dict` | Custom headers for all requests. |
| `options["feature"]` | `dict` | Feature configuration. |
| `options["system"]` | `dict` | System overrides (e.g. custom fetch). |


### Static Methods

#### `Autopay24hrSDK.test(testopts=None, sdkopts=None)`

Create a test client with mock features active. Both arguments may be `None`.

```python
client = Autopay24hrSDK.test()
```


### Instance Methods

#### `ChatStatus(data=None)`

Create a new `ChatStatusEntity` instance. Pass `None` for no initial data.

#### `Coin(data=None)`

Create a new `CoinEntity` instance. Pass `None` for no initial data.

#### `Health(data=None)`

Create a new `HealthEntity` instance. Pass `None` for no initial data.

#### `PairLimit(data=None)`

Create a new `PairLimitEntity` instance. Pass `None` for no initial data.

#### `Quote(data=None)`

Create a new `QuoteEntity` instance. Pass `None` for no initial data.

#### `options_map() -> dict`

Return a deep copy of the current SDK options.

#### `get_utility() -> Utility`

Return a copy of the SDK utility object.

#### `direct(fetchargs=None) -> dict`

Make a direct HTTP request to any API endpoint. Returns a result `dict` with `ok`, `status`, `headers`, and `data` (or `err` on failure). This escape hatch never raises — branch on `result["ok"]`.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `fetchargs["path"]` | `str` | URL path with optional `{param}` placeholders. |
| `fetchargs["method"]` | `str` | HTTP method (default: `"GET"`). |
| `fetchargs["params"]` | `dict` | Path parameter values. |
| `fetchargs["query"]` | `dict` | Query string parameters. |
| `fetchargs["headers"]` | `dict` | Request headers (merged with defaults). |
| `fetchargs["body"]` | `any` | Request body (dicts are JSON-serialized). |

**Returns:** `result_dict`

#### `prepare(fetchargs=None) -> dict`

Prepare a fetch definition without sending. Returns the `fetchdef` and raises on error.


---

## ChatStatusEntity

```python
chat_status = client.ChatStatus()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `aiConfigured` | `bool` | Yes | Whether an AI model answers chat questions. |
| `fallbackAvailable` | `bool` | Yes | Whether curated fallback answers are available. |
| `model` | `str` | No | AI model in use, e.g. |

### Operations

#### `load(reqmatch, ctrl=None) -> ChatStatusEntity`

Load a single entity matching the given criteria. Returns the entity, whose record `data_get()` reads, and raises on error.

```python
result = client.ChatStatus().load()
```

### Common Methods

#### `data_get() -> dict`

Get the entity data.

#### `data_set(data)`

Set the entity data.

#### `match_get() -> dict`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make() -> Entity`

Create a new `ChatStatusEntity` instance with the same options.

#### `get_name() -> str`

Return the entity name.


---

## CoinEntity

```python
coin = client.Coin()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `decimals` | `int` | Yes | Decimal places of the asset on this network. |
| `network` | `str` | Yes | Network slug, e.g. |
| `providers` | `list` | Yes | Providers that route this asset; only "autopay" was observed. |
| `symbol` | `str` | Yes | Ticker symbol, e.g. |

### Operations

#### `list(reqmatch=None, ctrl=None) -> list[CoinEntity]`

List entities matching the given criteria. The match is optional — call `list()` with no argument to list all records. Returns a list of entities, one per record, and raises on error.

```python
results = client.Coin().list()
for coin in results:
    print(coin.data_get())
```

### Common Methods

#### `data_get() -> dict`

Get the entity data.

#### `data_set(data)`

Set the entity data.

#### `match_get() -> dict`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make() -> Entity`

Create a new `CoinEntity` instance with the same options.

#### `get_name() -> str`

Return the entity name.


---

## HealthEntity

```python
health = client.Health()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `checks` | `dict` | No | Per-dependency checks. |
| `ok` | `bool` | Yes | Overall health. |
| `service` | `str` | No | Service name; observed "autopay". |
| `status` | `str` | Yes | Overall status; observed "ok". |
| `ts` | `int` | No | Server time of the check, epoch milliseconds. |

### Operations

#### `load(reqmatch, ctrl=None) -> HealthEntity`

Load a single entity matching the given criteria. Returns the entity, whose record `data_get()` reads, and raises on error.

```python
result = client.Health().load()
```

### Common Methods

#### `data_get() -> dict`

Get the entity data.

#### `data_set(data)`

Set the entity data.

#### `match_get() -> dict`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make() -> Entity`

Create a new `HealthEntity` instance with the same options.

#### `get_name() -> str`

Return the entity name.


---

## PairLimitEntity

```python
pair_limit = client.PairLimit()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `fromNetwork` | `str` | Yes | Source coin network. |
| `fromSymbol` | `str` | Yes | Source coin symbol. |
| `maxAmount` | `float` | Yes | Maximum send amount. |
| `maxUsdApprox` | `float` | Yes | Approximate USD value of maxAmount. |
| `minAmount` | `float` | Yes | Minimum send amount. |
| `minNetReceive` | `float` | No | Net amount of the destination coin received at the minimum send amount (undocumented). |
| `minUsdApprox` | `float` | Yes | Approximate USD value of minAmount. |

### Operations

#### `load(reqmatch, ctrl=None) -> PairLimitEntity`

Load a single entity matching the given criteria. Returns the entity, whose record `data_get()` reads, and raises on error.

```python
result = client.PairLimit().load({"from_network": "from_network", "from_symbol": "from_symbol", "to_network": "to_network", "to_symbol": "to_symbol"})
```

### Common Methods

#### `data_get() -> dict`

Get the entity data.

#### `data_set(data)`

Set the entity data.

#### `match_get() -> dict`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make() -> Entity`

Create a new `PairLimitEntity` instance with the same options.

#### `get_name() -> str`

Return the entity name.


---

## QuoteEntity

```python
quote = client.Quote()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `estimatedTime` | `str` | No | Human-readable completion estimate, e.g. |
| `estimatedTimeTier` | `str` | No | Speed tier; observed "fast" and "slow". |
| `fromAmount` | `float` | Yes | Amount sent, in units of the source coin. |
| `grossToAmount` | `float` | No | Amount of the destination coin before the spread. |
| `isBest` | `bool` | Yes | True for the route chosen as best. |
| `maxAmount` | `float` | No | Route maximum send amount, in units of the source coin. |
| `minAmount` | `float` | No | Route minimum send amount, in units of the source coin. |
| `netToAmount` | `float` | Yes | Amount of the destination coin the user receives. |
| `networkFee` | `float` | No | Network fee charged by the route (observed 0). |
| `providerFeePercent` | `float` | No | Provider fee in percent (observed 0). |
| `providerName` | `str` | Yes | Route (provider) name; only "AutoPay Instant" was observed. |
| `spreadPercent` | `float` | No | Spread applied by the route, in percent (observed 0 and 0.5). |

### Operations

#### `list(reqmatch=None, ctrl=None) -> list[QuoteEntity]`

List entities matching the given criteria. The match is optional — call `list()` with no argument to list all records. Returns a list of entities, one per record, and raises on error.

```python
results = client.Quote().list({"from_amount": 1, "from_network": "example", "from_symbol": "example", "to_network": "example", "to_symbol": "example"})
for quote in results:
    print(quote.data_get())
```

### Common Methods

#### `data_get() -> dict`

Get the entity data.

#### `data_set(data)`

Set the entity data.

#### `match_get() -> dict`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make() -> Entity`

Create a new `QuoteEntity` instance with the same options.

#### `get_name() -> str`

Return the entity name.


---

## Features

| Feature | Version | Description |
| --- | --- | --- |
| `ratelimit` | 0.0.1 | Rate limiting |
| `retry` | 0.0.1 | Retry |
| `test` | 0.0.1 | Test transport |
| `timeout` | 0.0.1 | Timeout |


Features are activated via the `feature` option:

```python
client = Autopay24hrSDK({
    "feature": {
        "ratelimit": {"active": True},
        "retry": {"active": True},
        "test": {"active": True},
        "timeout": {"active": True},
    },
})
```


### Configuring features

Each feature is inactive until switched on, and an SDK with no feature
configured does no feature work at all. Every option below keeps its default
unless you name it.

The array form of \`feature\` is significant: several features wrap the
transport, and the order you list them in is the order they nest.

#### Ordering

`ratelimit`, `retry`, `timeout` wrap the transport. Each
wraps whatever is already installed, so **activation order is nesting order**:
a feature activated later sits OUTSIDE one activated earlier, and sees the call
first.

That decides behaviour, not just sequence: a feature that short-circuits the
call, such as a cache serving a hit, stops every feature nested inside it from
ever seeing that call.

`test` attach to pipeline hooks
rather than the transport, so their order does not affect what they observe.

#### `ratelimit`

Rate limiting.

**Configuration**

| Option | Default |
|---|---|
| `active` | `false` |
| `burst` | `5` |
| `rate` | `5` |

| Option | Type |
|---|---|
| `now` | function |
| `sleep` | function |

These take no default: the feature behaves one way when you supply them and
another when you do not.

**Usage**

Set `feature.ratelimit.active` to true in the client options, and override any option above in the same entry. Every option keeps
its default unless you name it.

**Considerations**

- Wraps the transport: its place in the activation order decides what it
  sees. See [Ordering](#ordering) above.
- Inactive by default: leaving it out costs nothing at runtime.

#### `retry`

Retry.

**Configuration**

| Option | Default |
|---|---|
| `active` | `false` |
| `factor` | `2` |
| `maxDelay` | `2000` |
| `minDelay` | `50` |
| `retries` | `2` |
| `statuses` | `[408, 425, 429, 500, 502, 503, 504]` |

| Option | Type |
|---|---|
| `jitter` | boolean |
| `sleep` | function |

These take no default: the feature behaves one way when you supply them and
another when you do not.

**Usage**

Set `feature.retry.active` to true in the client options, and override any option above in the same entry. Every option keeps
its default unless you name it.

**Considerations**

- Wraps the transport: its place in the activation order decides what it
  sees. See [Ordering](#ordering) above.
- Inactive by default: leaving it out costs nothing at runtime.

#### `test`

Test transport.

**Configuration**

| Option | Default |
|---|---|
| `active` | `false` |

| Option | Type |
|---|---|
| `entity` | map |
| `net` | map |

These take no default: the feature behaves one way when you supply them and
another when you do not.

**Usage**

Set `feature.test.active` to true in the client options, and override any option above in the same entry. Every option keeps
its default unless you name it.

**Considerations**

- Attaches to pipeline hooks, not the transport, so activation order does
  not change what it observes.
- Installs the BASE transport that the wrapping features wrap, so it must be
  activated before them.
- Inactive by default: leaving it out costs nothing at runtime.

#### `timeout`

Timeout.

**Configuration**

| Option | Default |
|---|---|
| `active` | `false` |
| `ms` | `30000` |

| Option | Type |
|---|---|
| `clearTimer` | function |
| `now` | function |
| `setTimer` | function |

These take no default: the feature behaves one way when you supply them and
another when you do not.

**Usage**

Set `feature.timeout.active` to true in the client options, and override any option above in the same entry. Every option keeps
its default unless you name it.

**Considerations**

- Wraps the transport: its place in the activation order decides what it
  sees. See [Ordering](#ordering) above.
- Inactive by default: leaving it out costs nothing at runtime.

