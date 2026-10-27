# Typed models for the Autopay24hr SDK.
#
# GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
# params (op.<name>.points[].g.params[]). Field/param types come from the
# canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
# @voxgig/apidef VALID_CANON). Do not edit by hand.
#
# These are TypedDicts, not dataclasses: the SDK ops return/accept plain dicts
# at runtime, and a TypedDict IS a dict shape, so the types match the runtime.
# Optional (req:false) keys are modelled as TypedDict key-optionality
# (total=False), split into a required base + total=False subclass when a type
# has both required and optional keys.

from __future__ import annotations

from typing import TypedDict, Any


class ChatStatusRequired(TypedDict):
    aiConfigured: bool
    fallbackAvailable: bool


class ChatStatus(ChatStatusRequired, total=False):
    model: str


class ChatStatusLoadMatch(TypedDict, total=False):
    aiConfigured: bool
    fallbackAvailable: bool
    model: str


class Coin(TypedDict):
    decimals: int
    network: str
    providers: list
    symbol: str


class CoinListMatch(TypedDict, total=False):
    decimals: int
    network: str
    providers: list
    symbol: str


class HealthRequired(TypedDict):
    ok: bool
    status: str


class Health(HealthRequired, total=False):
    checks: dict
    service: str
    ts: int


class HealthLoadMatch(TypedDict, total=False):
    checks: dict
    ok: bool
    service: str
    status: str
    ts: int


class PairLimitRequired(TypedDict):
    fromNetwork: str
    fromSymbol: str
    maxAmount: float
    maxUsdApprox: float
    minAmount: float
    minUsdApprox: float


class PairLimit(PairLimitRequired, total=False):
    minNetReceive: float


class PairLimitLoadMatch(TypedDict):
    from_network: str
    from_symbol: str
    to_network: str
    to_symbol: str


class QuoteRequired(TypedDict):
    fromAmount: float
    isBest: bool
    netToAmount: float
    providerName: str


class Quote(QuoteRequired, total=False):
    estimatedTime: str
    estimatedTimeTier: str
    grossToAmount: float
    maxAmount: float
    minAmount: float
    networkFee: float
    providerFeePercent: float
    spreadPercent: float


class QuoteListMatchRequired(TypedDict):
    from_amount: float
    from_network: str
    from_symbol: str
    to_network: str
    to_symbol: str


class QuoteListMatch(QuoteListMatchRequired, total=False):
    amount_mode: str
    to_amount: float
