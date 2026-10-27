-- Typed models for the Autopay24hr SDK (LuaLS annotations).
--
-- GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
-- params (op.<name>.points[].g.params[]). Field/param types come from the
-- canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
-- @voxgig/apidef VALID_CANON). Annotations only — no runtime effect. Do not
-- edit by hand.

---@class ChatStatus
---@field aiConfigured boolean
---@field fallbackAvailable boolean
---@field model? string

---@class ChatStatusLoadMatch
---@field aiConfigured? boolean
---@field fallbackAvailable? boolean
---@field model? string

---@class Coin
---@field decimals number
---@field network string
---@field providers table
---@field symbol string

---@class CoinListMatch
---@field decimals? number
---@field network? string
---@field providers? table
---@field symbol? string

---@class Health
---@field checks? table
---@field ok boolean
---@field service? string
---@field status string
---@field ts? number

---@class HealthLoadMatch
---@field checks? table
---@field ok? boolean
---@field service? string
---@field status? string
---@field ts? number

---@class PairLimit
---@field fromNetwork string
---@field fromSymbol string
---@field maxAmount number
---@field maxUsdApprox number
---@field minAmount number
---@field minNetReceive? number
---@field minUsdApprox number

---@class PairLimitLoadMatch
---@field from_network string
---@field from_symbol string
---@field to_network string
---@field to_symbol string

---@class Quote
---@field estimatedTime? string
---@field estimatedTimeTier? string
---@field fromAmount number
---@field grossToAmount? number
---@field isBest boolean
---@field maxAmount? number
---@field minAmount? number
---@field netToAmount number
---@field networkFee? number
---@field providerFeePercent? number
---@field providerName string
---@field spreadPercent? number

---@class QuoteListMatch
---@field amount_mode? string
---@field from_amount number
---@field from_network string
---@field from_symbol string
---@field to_amount? number
---@field to_network string
---@field to_symbol string

local M = {}

return M
