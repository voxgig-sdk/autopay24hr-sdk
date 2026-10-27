"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FEATURE_PLUGINS = exports.config = void 0;
const RatelimitFeature_1 = require("./feature/ratelimit/RatelimitFeature");
const RetryFeature_1 = require("./feature/retry/RetryFeature");
const TestFeature_1 = require("./feature/test/TestFeature");
const TimeoutFeature_1 = require("./feature/timeout/TimeoutFeature");
const FEATURE_CLASS = {
    ratelimit: RatelimitFeature_1.RatelimitFeature,
    retry: RetryFeature_1.RetryFeature,
    test: TestFeature_1.TestFeature,
    timeout: TimeoutFeature_1.TimeoutFeature,
};
const FEATURE_PLUGINS = {};
exports.FEATURE_PLUGINS = FEATURE_PLUGINS;
class Config {
    makeFeature(fn) {
        const fc = FEATURE_CLASS[fn];
        const fi = new fc();
        return fi;
    }
    // False for a feature added at runtime via options.extend (station's
    // adopt path) - the constructor uses this to skip makeFeature for names
    // no generated class backs.
    hasFeature(fn) {
        return null != FEATURE_CLASS[fn];
    }
    main = {
        name: 'Autopay24hr',
        slug: "autopay24hr",
        version: "0.0.1",
        target: "ts",
    };
    feature = {
        ratelimit: {
            "options": {
                "active": false,
                "burst": 5,
                "rate": 5
            },
            "optspec": {
                "now": "`$FUNCTION`",
                "sleep": "`$FUNCTION`"
            },
            "strict": false,
            "transport": "wrap"
        },
        retry: {
            "options": {
                "active": false,
                "factor": 2,
                "maxDelay": 2000,
                "minDelay": 50,
                "retries": 2,
                "statuses": [
                    408,
                    425,
                    429,
                    500,
                    502,
                    503,
                    504
                ]
            },
            "optspec": {
                "jitter": "`$BOOLEAN`",
                "sleep": "`$FUNCTION`"
            },
            "strict": false,
            "transport": "wrap"
        },
        test: {
            "options": {
                "active": false
            },
            "optspec": {
                "entity": "`$MAP`",
                "net": "`$MAP`"
            },
            "strict": false,
            "transport": "base"
        },
        timeout: {
            "options": {
                "active": false,
                "ms": 30000
            },
            "optspec": {
                "clearTimer": "`$FUNCTION`",
                "now": "`$FUNCTION`",
                "setTimer": "`$FUNCTION`"
            },
            "strict": false,
            "transport": "wrap"
        },
    };
    options = {
        base: "https://autopay24hr.com",
        headers: {
            "content-type": "application/json"
        },
        entity: {
            chat_status: {},
            coin: {},
            health: {},
            pair_limit: {},
            quote: {},
        }
    };
    entity = {
        "chat_status": {
            "fields": [
                {
                    "name": "aiConfigured",
                    "title": "Ai Configured",
                    "type": "`$BOOLEAN`",
                    "req": true,
                    "short": "Whether an AI model answers chat questions."
                },
                {
                    "name": "fallbackAvailable",
                    "title": "Fallback Available",
                    "type": "`$BOOLEAN`",
                    "req": true,
                    "short": "Whether curated fallback answers are available."
                },
                {
                    "name": "model",
                    "title": "Model",
                    "type": "`$STRING`",
                    "short": "AI model in use, e.g."
                }
            ],
            "name": "chat_status",
            "op": {
                "load": {
                    "input": "data",
                    "name": "load",
                    "points": [
                        {
                            "kind": "http",
                            "method": "GET",
                            "orig": "/api/v1/chat/status",
                            "segments": [
                                {
                                    "lit": "api"
                                },
                                {
                                    "lit": "v1"
                                },
                                {
                                    "lit": "chat"
                                },
                                {
                                    "lit": "status"
                                }
                            ],
                            "parts": [
                                "api",
                                "v1",
                                "chat",
                                "status"
                            ],
                            "rename": {},
                            "transform": {
                                "req": "`reqdata`",
                                "res": "`body`"
                            },
                            "args": {},
                            "select": {},
                            "response": {
                                "kind": "json",
                                "media": "application/json"
                            }
                        }
                    ]
                }
            },
            "relations": {
                "ancestors": []
            }
        },
        "coin": {
            "fields": [
                {
                    "name": "decimals",
                    "title": "Decimals",
                    "type": "`$INTEGER`",
                    "req": true,
                    "short": "Decimal places of the asset on this network."
                },
                {
                    "name": "network",
                    "title": "Network",
                    "type": "`$STRING`",
                    "req": true,
                    "short": "Network slug, e.g."
                },
                {
                    "name": "providers",
                    "title": "Providers",
                    "type": "`$ARRAY`",
                    "req": true,
                    "short": "Providers that route this asset; only \"autopay\" was observed."
                },
                {
                    "name": "symbol",
                    "title": "Symbol",
                    "type": "`$STRING`",
                    "req": true,
                    "short": "Ticker symbol, e.g."
                }
            ],
            "name": "coin",
            "op": {
                "list": {
                    "input": "data",
                    "name": "list",
                    "points": [
                        {
                            "kind": "http",
                            "method": "GET",
                            "orig": "/api/v1/coins",
                            "segments": [
                                {
                                    "lit": "api"
                                },
                                {
                                    "lit": "v1"
                                },
                                {
                                    "lit": "coins"
                                }
                            ],
                            "parts": [
                                "api",
                                "v1",
                                "coins"
                            ],
                            "rename": {},
                            "transform": {
                                "req": "`reqdata`",
                                "res": "`body.coins`"
                            },
                            "args": {},
                            "select": {},
                            "response": {
                                "kind": "json",
                                "media": "application/json"
                            }
                        }
                    ]
                }
            },
            "relations": {
                "ancestors": []
            }
        },
        "health": {
            "fields": [
                {
                    "name": "checks",
                    "title": "Checks",
                    "type": "`$OBJECT`",
                    "short": "Per-dependency checks."
                },
                {
                    "name": "ok",
                    "title": "Ok",
                    "type": "`$BOOLEAN`",
                    "req": true,
                    "short": "Overall health."
                },
                {
                    "name": "service",
                    "title": "Service",
                    "type": "`$STRING`",
                    "short": "Service name; observed \"autopay\"."
                },
                {
                    "name": "status",
                    "title": "Status",
                    "type": "`$STRING`",
                    "req": true,
                    "short": "Overall status; observed \"ok\"."
                },
                {
                    "name": "ts",
                    "title": "Ts",
                    "type": "`$INTEGER`",
                    "short": "Server time of the check, epoch milliseconds.",
                    "format": "int64"
                }
            ],
            "name": "health",
            "op": {
                "load": {
                    "input": "data",
                    "name": "load",
                    "points": [
                        {
                            "kind": "http",
                            "method": "GET",
                            "orig": "/api/health",
                            "segments": [
                                {
                                    "lit": "api"
                                },
                                {
                                    "lit": "health"
                                }
                            ],
                            "parts": [
                                "api",
                                "health"
                            ],
                            "rename": {},
                            "transform": {
                                "req": "`reqdata`",
                                "res": "`body`"
                            },
                            "args": {},
                            "select": {},
                            "response": {
                                "kind": "json",
                                "media": "application/json"
                            }
                        }
                    ]
                }
            },
            "relations": {
                "ancestors": []
            }
        },
        "pair_limit": {
            "fields": [
                {
                    "name": "fromNetwork",
                    "title": "From Network",
                    "type": "`$STRING`",
                    "req": true,
                    "short": "Source coin network."
                },
                {
                    "name": "fromSymbol",
                    "title": "From Symbol",
                    "type": "`$STRING`",
                    "req": true,
                    "short": "Source coin symbol."
                },
                {
                    "name": "maxAmount",
                    "title": "Max Amount",
                    "type": "`$NUMBER`",
                    "req": true,
                    "short": "Maximum send amount."
                },
                {
                    "name": "maxUsdApprox",
                    "title": "Max Usd Approx",
                    "type": "`$NUMBER`",
                    "req": true,
                    "short": "Approximate USD value of maxAmount."
                },
                {
                    "name": "minAmount",
                    "title": "Min Amount",
                    "type": "`$NUMBER`",
                    "req": true,
                    "short": "Minimum send amount."
                },
                {
                    "name": "minNetReceive",
                    "title": "Min Net Receive",
                    "type": "`$NUMBER`",
                    "short": "Net amount of the destination coin received at the minimum send amount (undocumented)."
                },
                {
                    "name": "minUsdApprox",
                    "title": "Min Usd Approx",
                    "type": "`$NUMBER`",
                    "req": true,
                    "short": "Approximate USD value of minAmount."
                }
            ],
            "name": "pair_limit",
            "op": {
                "load": {
                    "input": "data",
                    "name": "load",
                    "points": [
                        {
                            "kind": "http",
                            "method": "GET",
                            "orig": "/api/v1/pair-limits",
                            "segments": [
                                {
                                    "lit": "api"
                                },
                                {
                                    "lit": "v1"
                                },
                                {
                                    "lit": "pair-limits"
                                }
                            ],
                            "parts": [
                                "api",
                                "v1",
                                "pair-limits"
                            ],
                            "rename": {},
                            "transform": {
                                "req": "`reqdata`",
                                "res": "`body`"
                            },
                            "args": {
                                "query": [
                                    {
                                        "name": "from_network",
                                        "orig": "fromNetwork",
                                        "type": "`$STRING`",
                                        "kind": "query",
                                        "reqd": true,
                                        "example": "bitcoin"
                                    },
                                    {
                                        "name": "from_symbol",
                                        "orig": "fromSymbol",
                                        "type": "`$STRING`",
                                        "kind": "query",
                                        "reqd": true,
                                        "example": "BTC"
                                    },
                                    {
                                        "name": "to_network",
                                        "orig": "toNetwork",
                                        "type": "`$STRING`",
                                        "kind": "query",
                                        "reqd": true,
                                        "example": "ethereum"
                                    },
                                    {
                                        "name": "to_symbol",
                                        "orig": "toSymbol",
                                        "type": "`$STRING`",
                                        "kind": "query",
                                        "reqd": true,
                                        "example": "ETH"
                                    }
                                ]
                            },
                            "select": {
                                "exist": [
                                    "from_network",
                                    "from_symbol",
                                    "to_network",
                                    "to_symbol"
                                ]
                            },
                            "response": {
                                "kind": "json",
                                "media": "application/json"
                            }
                        }
                    ]
                }
            },
            "relations": {
                "ancestors": []
            }
        },
        "quote": {
            "fields": [
                {
                    "name": "estimatedTime",
                    "title": "Estimated Time",
                    "type": "`$STRING`",
                    "short": "Human-readable completion estimate, e.g."
                },
                {
                    "name": "estimatedTimeTier",
                    "title": "Estimated Time Tier",
                    "type": "`$STRING`",
                    "short": "Speed tier; observed \"fast\" and \"slow\"."
                },
                {
                    "name": "fromAmount",
                    "title": "From Amount",
                    "type": "`$NUMBER`",
                    "req": true,
                    "short": "Amount sent, in units of the source coin."
                },
                {
                    "name": "grossToAmount",
                    "title": "Gross To Amount",
                    "type": "`$NUMBER`",
                    "short": "Amount of the destination coin before the spread."
                },
                {
                    "name": "isBest",
                    "title": "Is Best",
                    "type": "`$BOOLEAN`",
                    "req": true,
                    "short": "True for the route chosen as best."
                },
                {
                    "name": "maxAmount",
                    "title": "Max Amount",
                    "type": "`$NUMBER`",
                    "short": "Route maximum send amount, in units of the source coin."
                },
                {
                    "name": "minAmount",
                    "title": "Min Amount",
                    "type": "`$NUMBER`",
                    "short": "Route minimum send amount, in units of the source coin."
                },
                {
                    "name": "netToAmount",
                    "title": "Net To Amount",
                    "type": "`$NUMBER`",
                    "req": true,
                    "short": "Amount of the destination coin the user receives."
                },
                {
                    "name": "networkFee",
                    "title": "Network Fee",
                    "type": "`$NUMBER`",
                    "short": "Network fee charged by the route (observed 0)."
                },
                {
                    "name": "providerFeePercent",
                    "title": "Provider Fee Percent",
                    "type": "`$NUMBER`",
                    "short": "Provider fee in percent (observed 0)."
                },
                {
                    "name": "providerName",
                    "title": "Provider Name",
                    "type": "`$STRING`",
                    "req": true,
                    "short": "Route (provider) name; only \"AutoPay Instant\" was observed."
                },
                {
                    "name": "spreadPercent",
                    "title": "Spread Percent",
                    "type": "`$NUMBER`",
                    "short": "Spread applied by the route, in percent (observed 0 and 0.5)."
                }
            ],
            "name": "quote",
            "op": {
                "list": {
                    "input": "data",
                    "name": "list",
                    "points": [
                        {
                            "kind": "http",
                            "method": "GET",
                            "orig": "/api/v1/quote",
                            "segments": [
                                {
                                    "lit": "api"
                                },
                                {
                                    "lit": "v1"
                                },
                                {
                                    "lit": "quote"
                                }
                            ],
                            "parts": [
                                "api",
                                "v1",
                                "quote"
                            ],
                            "rename": {},
                            "transform": {
                                "req": "`reqdata`",
                                "res": "`body`"
                            },
                            "args": {
                                "query": [
                                    {
                                        "name": "amount_mode",
                                        "orig": "amountMode",
                                        "type": "`$STRING`",
                                        "kind": "query",
                                        "example": "send"
                                    },
                                    {
                                        "name": "from_amount",
                                        "orig": "fromAmount",
                                        "type": "`$NUMBER`",
                                        "kind": "query",
                                        "reqd": true,
                                        "example": 0.1
                                    },
                                    {
                                        "name": "from_network",
                                        "orig": "fromNetwork",
                                        "type": "`$STRING`",
                                        "kind": "query",
                                        "reqd": true,
                                        "example": "bitcoin"
                                    },
                                    {
                                        "name": "from_symbol",
                                        "orig": "fromSymbol",
                                        "type": "`$STRING`",
                                        "kind": "query",
                                        "reqd": true,
                                        "example": "BTC"
                                    },
                                    {
                                        "name": "to_amount",
                                        "orig": "toAmount",
                                        "type": "`$NUMBER`",
                                        "kind": "query",
                                        "example": 1
                                    },
                                    {
                                        "name": "to_network",
                                        "orig": "toNetwork",
                                        "type": "`$STRING`",
                                        "kind": "query",
                                        "reqd": true,
                                        "example": "ethereum"
                                    },
                                    {
                                        "name": "to_symbol",
                                        "orig": "toSymbol",
                                        "type": "`$STRING`",
                                        "kind": "query",
                                        "reqd": true,
                                        "example": "ETH"
                                    }
                                ]
                            },
                            "select": {
                                "exist": [
                                    "from_amount",
                                    "from_network",
                                    "from_symbol",
                                    "to_network",
                                    "to_symbol"
                                ]
                            },
                            "response": {
                                "kind": "json",
                                "media": "application/json"
                            }
                        }
                    ]
                }
            },
            "relations": {
                "ancestors": []
            }
        }
    };
}
const config = new Config();
exports.config = config;
//# sourceMappingURL=Config.js.map