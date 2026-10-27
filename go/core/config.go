package core

import (
	"sync"
)

// MakeConfig builds a fresh, fully materialised config map. Every call
// rebuilds the whole structure, so prefer SharedConfig unless you need a
// private copy you intend to mutate.
func MakeConfig() map[string]any {
	return map[string]any{
		"main": map[string]any{
			"name": "Autopay24hr",
			"slug": "autopay24hr",
			"version": "0.0.1",
			"target": "go",
		},
		"feature": map[string]any{
			"ratelimit": map[string]any{
				"options": map[string]any{
					"active": false,
					"burst": 5,
					"rate": 5,
				},
				"optspec": map[string]any{
					"now": "`$FUNCTION`",
					"sleep": "`$FUNCTION`",
				},
				"strict": false,
				"transport": "wrap",
			},
			"retry": map[string]any{
				"options": map[string]any{
					"active": false,
					"factor": 2,
					"maxDelay": 2000,
					"minDelay": 50,
					"retries": 2,
					"statuses": []any{
						408,
						425,
						429,
						500,
						502,
						503,
						504,
					},
				},
				"optspec": map[string]any{
					"jitter": "`$BOOLEAN`",
					"sleep": "`$FUNCTION`",
				},
				"strict": false,
				"transport": "wrap",
			},
			"test": map[string]any{
				"options": map[string]any{
					"active": false,
				},
				"optspec": map[string]any{
					"entity": "`$MAP`",
					"net": "`$MAP`",
				},
				"strict": false,
				"transport": "base",
			},
			"timeout": map[string]any{
				"options": map[string]any{
					"active": false,
					"ms": 30000,
				},
				"optspec": map[string]any{
					"clearTimer": "`$FUNCTION`",
					"now": "`$FUNCTION`",
					"setTimer": "`$FUNCTION`",
				},
				"strict": false,
				"transport": "wrap",
			},
		},
		"options": map[string]any{
			"base": "https://autopay24hr.com",
			"headers": map[string]any{
				"content-type": "application/json",
			},
			"entity": map[string]any{
				"chat_status": map[string]any{},
				"coin": map[string]any{},
				"health": map[string]any{},
				"pair_limit": map[string]any{},
				"quote": map[string]any{},
			},
		},
		"entity": map[string]any{
			"chat_status": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "aiConfigured",
						"title": "Ai Configured",
						"type": "`$BOOLEAN`",
						"req": true,
						"short": "Whether an AI model answers chat questions.",
					},
					map[string]any{
						"name": "fallbackAvailable",
						"title": "Fallback Available",
						"type": "`$BOOLEAN`",
						"req": true,
						"short": "Whether curated fallback answers are available.",
					},
					map[string]any{
						"name": "model",
						"title": "Model",
						"type": "`$STRING`",
						"short": "AI model in use, e.g.",
					},
				},
				"name": "chat_status",
				"op": map[string]any{
					"load": map[string]any{
						"input": "data",
						"name": "load",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/api/v1/chat/status",
								"segments": []any{
									map[string]any{
										"lit": "api",
									},
									map[string]any{
										"lit": "v1",
									},
									map[string]any{
										"lit": "chat",
									},
									map[string]any{
										"lit": "status",
									},
								},
								"parts": []any{
									"api",
									"v1",
									"chat",
									"status",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"args": map[string]any{},
								"select": map[string]any{},
								"response": map[string]any{
									"kind": "json",
									"media": "application/json",
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{},
				},
			},
			"coin": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "decimals",
						"title": "Decimals",
						"type": "`$INTEGER`",
						"req": true,
						"short": "Decimal places of the asset on this network.",
					},
					map[string]any{
						"name": "network",
						"title": "Network",
						"type": "`$STRING`",
						"req": true,
						"short": "Network slug, e.g.",
					},
					map[string]any{
						"name": "providers",
						"title": "Providers",
						"type": "`$ARRAY`",
						"req": true,
						"short": "Providers that route this asset; only \"autopay\" was observed.",
					},
					map[string]any{
						"name": "symbol",
						"title": "Symbol",
						"type": "`$STRING`",
						"req": true,
						"short": "Ticker symbol, e.g.",
					},
				},
				"name": "coin",
				"op": map[string]any{
					"list": map[string]any{
						"input": "data",
						"name": "list",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/api/v1/coins",
								"segments": []any{
									map[string]any{
										"lit": "api",
									},
									map[string]any{
										"lit": "v1",
									},
									map[string]any{
										"lit": "coins",
									},
								},
								"parts": []any{
									"api",
									"v1",
									"coins",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.coins`",
								},
								"args": map[string]any{},
								"select": map[string]any{},
								"response": map[string]any{
									"kind": "json",
									"media": "application/json",
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{},
				},
			},
			"health": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "checks",
						"title": "Checks",
						"type": "`$OBJECT`",
						"short": "Per-dependency checks.",
					},
					map[string]any{
						"name": "ok",
						"title": "Ok",
						"type": "`$BOOLEAN`",
						"req": true,
						"short": "Overall health.",
					},
					map[string]any{
						"name": "service",
						"title": "Service",
						"type": "`$STRING`",
						"short": "Service name; observed \"autopay\".",
					},
					map[string]any{
						"name": "status",
						"title": "Status",
						"type": "`$STRING`",
						"req": true,
						"short": "Overall status; observed \"ok\".",
					},
					map[string]any{
						"name": "ts",
						"title": "Ts",
						"type": "`$INTEGER`",
						"short": "Server time of the check, epoch milliseconds.",
						"format": "int64",
					},
				},
				"name": "health",
				"op": map[string]any{
					"load": map[string]any{
						"input": "data",
						"name": "load",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/api/health",
								"segments": []any{
									map[string]any{
										"lit": "api",
									},
									map[string]any{
										"lit": "health",
									},
								},
								"parts": []any{
									"api",
									"health",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"args": map[string]any{},
								"select": map[string]any{},
								"response": map[string]any{
									"kind": "json",
									"media": "application/json",
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{},
				},
			},
			"pair_limit": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "fromNetwork",
						"title": "From Network",
						"type": "`$STRING`",
						"req": true,
						"short": "Source coin network.",
					},
					map[string]any{
						"name": "fromSymbol",
						"title": "From Symbol",
						"type": "`$STRING`",
						"req": true,
						"short": "Source coin symbol.",
					},
					map[string]any{
						"name": "maxAmount",
						"title": "Max Amount",
						"type": "`$NUMBER`",
						"req": true,
						"short": "Maximum send amount.",
					},
					map[string]any{
						"name": "maxUsdApprox",
						"title": "Max Usd Approx",
						"type": "`$NUMBER`",
						"req": true,
						"short": "Approximate USD value of maxAmount.",
					},
					map[string]any{
						"name": "minAmount",
						"title": "Min Amount",
						"type": "`$NUMBER`",
						"req": true,
						"short": "Minimum send amount.",
					},
					map[string]any{
						"name": "minNetReceive",
						"title": "Min Net Receive",
						"type": "`$NUMBER`",
						"short": "Net amount of the destination coin received at the minimum send amount (undocumented).",
					},
					map[string]any{
						"name": "minUsdApprox",
						"title": "Min Usd Approx",
						"type": "`$NUMBER`",
						"req": true,
						"short": "Approximate USD value of minAmount.",
					},
				},
				"name": "pair_limit",
				"op": map[string]any{
					"load": map[string]any{
						"input": "data",
						"name": "load",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/api/v1/pair-limits",
								"segments": []any{
									map[string]any{
										"lit": "api",
									},
									map[string]any{
										"lit": "v1",
									},
									map[string]any{
										"lit": "pair-limits",
									},
								},
								"parts": []any{
									"api",
									"v1",
									"pair-limits",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"args": map[string]any{
									"query": []any{
										map[string]any{
											"name": "from_network",
											"orig": "fromNetwork",
											"type": "`$STRING`",
											"kind": "query",
											"reqd": true,
											"example": "bitcoin",
										},
										map[string]any{
											"name": "from_symbol",
											"orig": "fromSymbol",
											"type": "`$STRING`",
											"kind": "query",
											"reqd": true,
											"example": "BTC",
										},
										map[string]any{
											"name": "to_network",
											"orig": "toNetwork",
											"type": "`$STRING`",
											"kind": "query",
											"reqd": true,
											"example": "ethereum",
										},
										map[string]any{
											"name": "to_symbol",
											"orig": "toSymbol",
											"type": "`$STRING`",
											"kind": "query",
											"reqd": true,
											"example": "ETH",
										},
									},
								},
								"select": map[string]any{
									"exist": []any{
										"from_network",
										"from_symbol",
										"to_network",
										"to_symbol",
									},
								},
								"response": map[string]any{
									"kind": "json",
									"media": "application/json",
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{},
				},
			},
			"quote": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "estimatedTime",
						"title": "Estimated Time",
						"type": "`$STRING`",
						"short": "Human-readable completion estimate, e.g.",
					},
					map[string]any{
						"name": "estimatedTimeTier",
						"title": "Estimated Time Tier",
						"type": "`$STRING`",
						"short": "Speed tier; observed \"fast\" and \"slow\".",
					},
					map[string]any{
						"name": "fromAmount",
						"title": "From Amount",
						"type": "`$NUMBER`",
						"req": true,
						"short": "Amount sent, in units of the source coin.",
					},
					map[string]any{
						"name": "grossToAmount",
						"title": "Gross To Amount",
						"type": "`$NUMBER`",
						"short": "Amount of the destination coin before the spread.",
					},
					map[string]any{
						"name": "isBest",
						"title": "Is Best",
						"type": "`$BOOLEAN`",
						"req": true,
						"short": "True for the route chosen as best.",
					},
					map[string]any{
						"name": "maxAmount",
						"title": "Max Amount",
						"type": "`$NUMBER`",
						"short": "Route maximum send amount, in units of the source coin.",
					},
					map[string]any{
						"name": "minAmount",
						"title": "Min Amount",
						"type": "`$NUMBER`",
						"short": "Route minimum send amount, in units of the source coin.",
					},
					map[string]any{
						"name": "netToAmount",
						"title": "Net To Amount",
						"type": "`$NUMBER`",
						"req": true,
						"short": "Amount of the destination coin the user receives.",
					},
					map[string]any{
						"name": "networkFee",
						"title": "Network Fee",
						"type": "`$NUMBER`",
						"short": "Network fee charged by the route (observed 0).",
					},
					map[string]any{
						"name": "providerFeePercent",
						"title": "Provider Fee Percent",
						"type": "`$NUMBER`",
						"short": "Provider fee in percent (observed 0).",
					},
					map[string]any{
						"name": "providerName",
						"title": "Provider Name",
						"type": "`$STRING`",
						"req": true,
						"short": "Route (provider) name; only \"AutoPay Instant\" was observed.",
					},
					map[string]any{
						"name": "spreadPercent",
						"title": "Spread Percent",
						"type": "`$NUMBER`",
						"short": "Spread applied by the route, in percent (observed 0 and 0.5).",
					},
				},
				"name": "quote",
				"op": map[string]any{
					"list": map[string]any{
						"input": "data",
						"name": "list",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/api/v1/quote",
								"segments": []any{
									map[string]any{
										"lit": "api",
									},
									map[string]any{
										"lit": "v1",
									},
									map[string]any{
										"lit": "quote",
									},
								},
								"parts": []any{
									"api",
									"v1",
									"quote",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"args": map[string]any{
									"query": []any{
										map[string]any{
											"name": "amount_mode",
											"orig": "amountMode",
											"type": "`$STRING`",
											"kind": "query",
											"example": "send",
										},
										map[string]any{
											"name": "from_amount",
											"orig": "fromAmount",
											"type": "`$NUMBER`",
											"kind": "query",
											"reqd": true,
											"example": 0.1,
										},
										map[string]any{
											"name": "from_network",
											"orig": "fromNetwork",
											"type": "`$STRING`",
											"kind": "query",
											"reqd": true,
											"example": "bitcoin",
										},
										map[string]any{
											"name": "from_symbol",
											"orig": "fromSymbol",
											"type": "`$STRING`",
											"kind": "query",
											"reqd": true,
											"example": "BTC",
										},
										map[string]any{
											"name": "to_amount",
											"orig": "toAmount",
											"type": "`$NUMBER`",
											"kind": "query",
											"example": 1,
										},
										map[string]any{
											"name": "to_network",
											"orig": "toNetwork",
											"type": "`$STRING`",
											"kind": "query",
											"reqd": true,
											"example": "ethereum",
										},
										map[string]any{
											"name": "to_symbol",
											"orig": "toSymbol",
											"type": "`$STRING`",
											"kind": "query",
											"reqd": true,
											"example": "ETH",
										},
									},
								},
								"select": map[string]any{
									"exist": []any{
										"from_amount",
										"from_network",
										"from_symbol",
										"to_network",
										"to_symbol",
									},
								},
								"response": map[string]any{
									"kind": "json",
									"media": "application/json",
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{},
				},
			},
		},
	}
}

// The plugin definitions the model selected per feature, as []any so a
// feature package can consume them without core naming its types. Empty
// when no active feature declares active plugin groups for this target.
var featurePlugins = map[string][]any{
}

// FeaturePlugins is the definitions list for one feature's chain.
func FeaturePlugins(name string) []any {
	return featurePlugins[name]
}

var (
	sharedConfigOnce sync.Once
	sharedConfigVal  map[string]any
)

// SharedConfig returns the process-wide config, built once on first use.
// The SDK reads the config on every request and never writes to it, so one
// instance is shared by every client rather than rebuilt per client.
//
// The returned map is shared: treat it as read-only. Callers that need to
// mutate should use MakeConfig, which always returns a fresh copy.
func SharedConfig() map[string]any {
	sharedConfigOnce.Do(func() {
		sharedConfigVal = MakeConfig()
	})
	return sharedConfigVal
}

func makeFeature(name string) Feature {
	switch name {
	case "ratelimit":
		if NewRatelimitFeatureFunc != nil {
			return NewRatelimitFeatureFunc()
		}
	case "retry":
		if NewRetryFeatureFunc != nil {
			return NewRetryFeatureFunc()
		}
	case "test":
		if NewTestFeatureFunc != nil {
			return NewTestFeatureFunc()
		}
	case "timeout":
		if NewTimeoutFeatureFunc != nil {
			return NewTimeoutFeatureFunc()
		}
	default:
		if NewBaseFeatureFunc != nil {
			return NewBaseFeatureFunc()
		}
	}
	return nil
}
