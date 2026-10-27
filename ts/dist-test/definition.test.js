"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const __1 = require("..");
const definition_runner_1 = require("./definition-runner");
const utility_1 = require("./utility");
// Generated from the API definition, not from the model this SDK was built
// from: the route, the declared query parameters, the credential the security
// scheme names, and the definition's own response example.
const PLAN = [
    {
        "entity": "chat_status",
        "accessor": "ChatStatus",
        "op": "load",
        "method": "GET",
        "path": "/api/v1/chat/status",
        "args": [],
        "select": {},
        "headers": [],
        "cookies": [],
        "responseMedia": [
            "application/json"
        ],
        "query": [],
        "queryArgs": [],
        "auth": null,
        "status": 200,
        "sample": {
            "aiConfigured": true,
            "fallbackAvailable": true,
            "model": "x"
        },
        "idField": "id"
    },
    {
        "entity": "coin",
        "accessor": "Coin",
        "op": "list",
        "method": "GET",
        "path": "/api/v1/coins",
        "args": [],
        "select": {},
        "headers": [],
        "cookies": [],
        "responseMedia": [
            "application/json"
        ],
        "query": [],
        "queryArgs": [],
        "auth": null,
        "status": 200,
        "sample": {
            "count": 1,
            "coins": [
                {
                    "symbol": "x",
                    "network": "x",
                    "decimals": 1,
                    "providers": [
                        "x"
                    ]
                }
            ]
        },
        "idField": "id"
    },
    {
        "entity": "health",
        "accessor": "Health",
        "op": "load",
        "method": "GET",
        "path": "/api/health",
        "args": [],
        "select": {},
        "headers": [],
        "cookies": [],
        "responseMedia": [
            "application/json"
        ],
        "query": [],
        "queryArgs": [],
        "auth": null,
        "status": 200,
        "sample": {
            "ok": true,
            "status": "x",
            "service": "x",
            "checks": {
                "db": {
                    "ok": true,
                    "latencyMs": 1
                },
                "redis": {
                    "ok": true,
                    "latencyMs": 1
                }
            },
            "ts": 1
        },
        "idField": "id"
    },
    {
        "entity": "pair_limit",
        "accessor": "PairLimit",
        "op": "load",
        "method": "GET",
        "path": "/api/v1/pair-limits",
        "args": [],
        "select": {
            "from_network": "v1",
            "from_symbol": "v1",
            "to_network": "v1",
            "to_symbol": "v1"
        },
        "headers": [],
        "cookies": [],
        "responseMedia": [
            "application/json"
        ],
        "query": [
            "fromSymbol",
            "fromNetwork",
            "toSymbol",
            "toNetwork"
        ],
        "queryArgs": [
            {
                "name": "from_network",
                "wire": "fromNetwork"
            },
            {
                "name": "from_symbol",
                "wire": "fromSymbol"
            },
            {
                "name": "to_network",
                "wire": "toNetwork"
            },
            {
                "name": "to_symbol",
                "wire": "toSymbol"
            }
        ],
        "auth": null,
        "status": 200,
        "sample": {
            "fromSymbol": "x",
            "fromNetwork": "x",
            "minAmount": 1,
            "maxAmount": 1,
            "minNetReceive": 1,
            "minUsdApprox": 1,
            "maxUsdApprox": 1
        },
        "idField": "id"
    },
    {
        "entity": "quote",
        "accessor": "Quote",
        "op": "list",
        "method": "GET",
        "path": "/api/v1/quote",
        "args": [],
        "select": {
            "from_amount": "v1",
            "from_network": "v1",
            "from_symbol": "v1",
            "to_network": "v1",
            "to_symbol": "v1",
            "amount_mode": "send",
            "to_amount": 1
        },
        "headers": [],
        "cookies": [],
        "responseMedia": [
            "application/json"
        ],
        "query": [
            "fromSymbol",
            "fromNetwork",
            "toSymbol",
            "toNetwork",
            "fromAmount",
            "toAmount",
            "amountMode"
        ],
        "queryArgs": [
            {
                "name": "amount_mode",
                "wire": "amountMode"
            },
            {
                "name": "from_amount",
                "wire": "fromAmount"
            },
            {
                "name": "from_network",
                "wire": "fromNetwork"
            },
            {
                "name": "from_symbol",
                "wire": "fromSymbol"
            },
            {
                "name": "to_amount",
                "wire": "toAmount"
            },
            {
                "name": "to_network",
                "wire": "toNetwork"
            },
            {
                "name": "to_symbol",
                "wire": "toSymbol"
            }
        ],
        "auth": null,
        "status": 200,
        "sample": {
            "fromSymbol": "x",
            "fromNetwork": "x",
            "toSymbol": "x",
            "toNetwork": "x",
            "fromAmount": 1,
            "savePercentVsWorst": 1,
            "amountMode": "send",
            "targetNetToAmount": 1,
            "minAmount": 1,
            "maxAmount": 1,
            "isEstimate": true,
            "estimatedTimeTier": "x",
            "cachedAt": 1,
            "expiresAt": 1,
            "best": {
                "providerName": "x",
                "fromAmount": 1,
                "grossToAmount": 1,
                "netToAmount": 1,
                "spreadPercent": 1,
                "estimatedTime": "x",
                "estimatedTimeTier": "x",
                "networkFee": 1,
                "providerFeePercent": 1,
                "minAmount": 1,
                "maxAmount": 1,
                "isBest": true
            },
            "routes": [
                {
                    "providerName": "x",
                    "fromAmount": 1,
                    "grossToAmount": 1,
                    "netToAmount": 1,
                    "spreadPercent": 1,
                    "estimatedTime": "x",
                    "estimatedTimeTier": "x",
                    "networkFee": 1,
                    "providerFeePercent": 1,
                    "minAmount": 1,
                    "maxAmount": 1,
                    "isBest": true
                }
            ]
        },
        "idField": "id"
    }
];
(0, node_test_1.describe)('definition', () => {
    for (const point of PLAN) {
        (0, node_test_1.test)(point.entity + '.' + point.op + ' ' + point.method + ' ' + point.path, async (t) => {
            const control = (0, utility_1.isControlSkipped)('entityOp', point.entity + '.' + point.op, 'definition');
            if (control.skip) {
                t.skip(control.reason || 'skipped via sdk-test-control.json');
                return;
            }
            await (0, definition_runner_1.runDefinitionPoint)(__1.SDK, point);
        });
    }
});
//# sourceMappingURL=definition.test.js.map