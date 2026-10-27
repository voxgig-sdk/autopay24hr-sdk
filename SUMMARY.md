# AutoPay24hr API

Public, keyless JSON API of AutoPay24hr, a non-KYC crypto swap service. CORS open, HTTPS only. Knowledge source: the documentation page https://autopay24hr.com/api-docs, with every endpoint below probed live on 2026-10-25. This spec deliberately covers only the read-only GET endpoints that work without creating anything: the coin list, pair limits, quotes, chat status and the health check. Left out on purpose: POST /api/v1/order (creates a real swap order with a deposit address), GET /api/v1/order/&#123;id&#125; (needs an order id that only a create returns), POST /api/v1/chat and the WebSocket /ws/order/&#123;id&#125;. Rate limit: anonymous callers get 60 requests per minute per IP (documented, and confirmed by x-ratelimit-limit: 60 / x-ratelimit-reset: 60 response headers). Observed but not documented: pair-limits also returns minNetReceive; quotes also return savePercentVsWorst, minAmount, maxAmount, isEstimate, estimatedTimeTier, cachedAt and expiresAt (epoch milliseconds, quotes are cached for 120 s), a routes array, targetNetToAmount in receive mode, and extra fields on each route; health also returns service, per-check latencyMs and ts. The docs say errors are &#123;&quot;error&quot;: &#123;&quot;code&quot;, &quot;message&quot;&#125;&#125;; the live API instead returns error as a string code, with message, issues (validation details) or minAmount/maxAmount alongside: 400 `invalid_request` for missing parameters, 400 `amount_too_low` below the route minimum, 404 `no_route` for an unsupported pair. Unverified: the 429 `rate_limited` response body, the full value sets of estimatedTimeTier and providerName, whether a quote can return more than one route, and whether chat status model is null when AI is not configured.

## Start here

This guide introduces the API, the client libraries, and the companion tools in this repository. Start with the API capabilities, choose a client for your application, and use the linked reference when you need exact request and response details.

The selected API surface contains 5 entities and 5 HTTP routes. There are 6 SDK targets and 2 companion tools.

An entity groups related API operations. An operation can have several routes with different inputs or authentication requirements. The SDK exposes the entity and its operations using the conventions of the selected language.

## What the API provides

### ChatStatus

Results: The chat status.

SDK operations: `load`.

Key fields to recognise:

- `aiConfigured`: Whether an AI model answers chat questions.
- `fallbackAvailable`: Whether curated fallback answers are available.
- `model`: AI model in use, for example &quot;anthropic/claude-haiku-4.5&quot;. Nullability when AI is off is unverified.

### Coin

Results: The supported coins.

SDK operations: `list`.

Key fields to recognise:

- `decimals`: Decimal places of the asset on this network.
- `network`: Network slug, for example &quot;bitcoin&quot;, &quot;ethereum&quot;, &quot;tron&quot;, &quot;solana&quot;, &quot;bsc&quot;.
- `providers`: Providers that route this asset; only &quot;autopay&quot; was observed.
- `symbol`: Ticker symbol, for example &quot;BTC&quot;. Not always alphanumeric (&quot;10SET.&quot; was observed).

### Health

Results: The service health.

SDK operations: `load`.

Key fields to recognise:

- `checks`: Per-dependency checks.
- `ok`: Overall health.
- `service`: Service name; observed &quot;autopay&quot;.
- `status`: Overall status; observed &quot;ok&quot;.
- `ts`: Server time of the check, epoch milliseconds.

### PairLimit

Results: The limits for the pair.

SDK operations: `load`.

Key fields to recognise:

- `fromNetwork`: Source coin network.
- `fromSymbol`: Source coin symbol.
- `maxAmount`: Maximum send amount.
- `maxUsdApprox`: Approximate USD value of maxAmount.
- `minAmount`: Minimum send amount.

### Quote

Results: The quote.

SDK operations: `list`.

Key fields to recognise:

- `estimatedTime`: Human-readable completion estimate, for example &quot;15–45 min&quot; (uses an en dash).
- `estimatedTimeTier`: Speed tier of the best route; observed &quot;fast&quot; and &quot;slow&quot;.
- `fromAmount`: Amount to send: the request fromAmount in send mode, computed in receive mode.
- `grossToAmount`: Amount of the destination coin before the spread.
- `isBest`: True for the route chosen as best.

### Route map

Use this map to locate a capability. Consult the entity reference before supplying request data; routes for the same operation can require different fields.

| Entity | SDK operation | HTTP route | Authentication |
| --- | --- | --- | --- |
| ChatStatus | `load` | `GET /api/v1/chat/status` | See reference |
| Coin | `list` | `GET /api/v1/coins` | See reference |
| Health | `load` | `GET /api/health` | See reference |
| PairLimit | `load` | `GET /api/v1/pair-limits` | See reference |
| Quote | `list` | `GET /api/v1/quote` | See reference |

## Connect to the API

- Production server: `https://autopay24hr.com`

Check authentication for the route you plan to call. A route that declares no authentication can be used without credentials; this does not change the requirements of other routes. Keep credentials in environment variables or a configured secret provider, and keep them out of source control and logs.

## Make a first request

1. Choose the API server and an operation that matches your task.
2. Check the operation’s required input and authentication. Use values valid for your account and environment.
3. Send one request and inspect the returned data before adding retries, concurrency, or a larger batch.

For an SDK call, install or build the chosen client, create a client instance with its documented configuration, and call the required entity operation. Language references describe the argument shape, asynchronous behaviour, and returned values.

## Choose an SDK

Choose the language already used by your application or service. The clients represent the same API model, while package setup, naming, and return types follow each language. Check the selected client’s reference and tests before integrating it into an existing application.

| Client | Repository directory | Distribution |
| --- | --- | --- |
| Golang | `go/` | Build from source |
| Lua | `lua/` | Build from source |
| PHP | `php/` | Build from source |
| Python | `py/` | Build from source |
| Ruby | `rb/` | Build from source |
| TypeScript | `ts/` | Build from source |

Build-from-source entries are not marked as published in the project model. Follow the build instructions in that target’s README, then consume the resulting package using your language’s local dependency mechanism. Published entries give the installation command recorded for that client.

## Companion tools

These targets provide another way to use the API. Their available commands or tools can cover a smaller set of operations than the client libraries.

### Go CLI

Use the command-line interface for shell-based tasks and scripts.

Repository directory: `go-cli/`. Not published. Build from the go-cli directory.


### Go MCP server

Use the MCP server to expose supported API operations to an MCP client.

Repository directory: `go-mcp/`. Not published. Build from the go-mcp directory.

- `autopay24hr_list`: List records for an entity. Supported entities: `coin`, `quote`.
- `autopay24hr_load`: Load one record for an entity. Supported entities: `chat_status`, `health`, `pair_limit`.

## Operational features

Features supply behaviour around API calls, such as request handling, diagnostics, or local testing. Inclusion in this project does not mean a feature is enabled at runtime. Check the selected SDK’s supported features and configuration defaults, then enable the behaviour your application needs.

- `ratelimit`: Client-side rate limiting via a token bucket
- `retry`: Automatic retry of transient failures with exponential backoff
- `test`: In-memory mock transport for testing without a live server
- `timeout`: Per-request timeout with transport abort

Start with the default client configuration. Add request limits and diagnostics as needed, test error paths, and review retry behaviour before using operations that change data. A retry can repeat an operation unless the API provides a suitable guarantee.

## Continue with the documentation

- Follow the first-call guide for the setup sequence.
- Read the authentication guide before using protected routes.
- Use the API reference for request schemas, response formats, and status codes.
- Check the chosen SDK or companion tool reference for its configuration and supported operations.

