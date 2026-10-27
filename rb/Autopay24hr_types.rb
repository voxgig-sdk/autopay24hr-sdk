# frozen_string_literal: true

# Typed models for the Autopay24hr SDK.
#
# GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
# params (op.<name>.points[].g.params[]). Member types come from the
# canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
# @voxgig/apidef VALID_CANON). Ruby types are unenforced; these YARD
# annotations document the shapes. Do not edit by hand.

# ChatStatus entity data model.
#
# @!attribute [rw] aiConfigured
#   @return [Boolean]
#
# @!attribute [rw] fallbackAvailable
#   @return [Boolean]
#
# @!attribute [rw] model
#   @return [String, nil]
ChatStatus = Struct.new(
  :aiConfigured,
  :fallbackAvailable,
  :model,
  keyword_init: true
)

# Request payload for ChatStatus#load.
#
# @!attribute [rw] aiConfigured
#   @return [Boolean, nil]
#
# @!attribute [rw] fallbackAvailable
#   @return [Boolean, nil]
#
# @!attribute [rw] model
#   @return [String, nil]
ChatStatusLoadMatch = Struct.new(
  :aiConfigured,
  :fallbackAvailable,
  :model,
  keyword_init: true
)

# Coin entity data model.
#
# @!attribute [rw] decimals
#   @return [Integer]
#
# @!attribute [rw] network
#   @return [String]
#
# @!attribute [rw] providers
#   @return [Array]
#
# @!attribute [rw] symbol
#   @return [String]
Coin = Struct.new(
  :decimals,
  :network,
  :providers,
  :symbol,
  keyword_init: true
)

# Request payload for Coin#list.
#
# @!attribute [rw] decimals
#   @return [Integer, nil]
#
# @!attribute [rw] network
#   @return [String, nil]
#
# @!attribute [rw] providers
#   @return [Array, nil]
#
# @!attribute [rw] symbol
#   @return [String, nil]
CoinListMatch = Struct.new(
  :decimals,
  :network,
  :providers,
  :symbol,
  keyword_init: true
)

# Health entity data model.
#
# @!attribute [rw] checks
#   @return [Hash, nil]
#
# @!attribute [rw] ok
#   @return [Boolean]
#
# @!attribute [rw] service
#   @return [String, nil]
#
# @!attribute [rw] status
#   @return [String]
#
# @!attribute [rw] ts
#   @return [Integer, nil]
Health = Struct.new(
  :checks,
  :ok,
  :service,
  :status,
  :ts,
  keyword_init: true
)

# Request payload for Health#load.
#
# @!attribute [rw] checks
#   @return [Hash, nil]
#
# @!attribute [rw] ok
#   @return [Boolean, nil]
#
# @!attribute [rw] service
#   @return [String, nil]
#
# @!attribute [rw] status
#   @return [String, nil]
#
# @!attribute [rw] ts
#   @return [Integer, nil]
HealthLoadMatch = Struct.new(
  :checks,
  :ok,
  :service,
  :status,
  :ts,
  keyword_init: true
)

# PairLimit entity data model.
#
# @!attribute [rw] fromNetwork
#   @return [String]
#
# @!attribute [rw] fromSymbol
#   @return [String]
#
# @!attribute [rw] maxAmount
#   @return [Float]
#
# @!attribute [rw] maxUsdApprox
#   @return [Float]
#
# @!attribute [rw] minAmount
#   @return [Float]
#
# @!attribute [rw] minNetReceive
#   @return [Float, nil]
#
# @!attribute [rw] minUsdApprox
#   @return [Float]
PairLimit = Struct.new(
  :fromNetwork,
  :fromSymbol,
  :maxAmount,
  :maxUsdApprox,
  :minAmount,
  :minNetReceive,
  :minUsdApprox,
  keyword_init: true
)

# Request payload for PairLimit#load.
#
# @!attribute [rw] from_network
#   @return [String]
#
# @!attribute [rw] from_symbol
#   @return [String]
#
# @!attribute [rw] to_network
#   @return [String]
#
# @!attribute [rw] to_symbol
#   @return [String]
PairLimitLoadMatch = Struct.new(
  :from_network,
  :from_symbol,
  :to_network,
  :to_symbol,
  keyword_init: true
)

# Quote entity data model.
#
# @!attribute [rw] estimatedTime
#   @return [String, nil]
#
# @!attribute [rw] estimatedTimeTier
#   @return [String, nil]
#
# @!attribute [rw] fromAmount
#   @return [Float]
#
# @!attribute [rw] grossToAmount
#   @return [Float, nil]
#
# @!attribute [rw] isBest
#   @return [Boolean]
#
# @!attribute [rw] maxAmount
#   @return [Float, nil]
#
# @!attribute [rw] minAmount
#   @return [Float, nil]
#
# @!attribute [rw] netToAmount
#   @return [Float]
#
# @!attribute [rw] networkFee
#   @return [Float, nil]
#
# @!attribute [rw] providerFeePercent
#   @return [Float, nil]
#
# @!attribute [rw] providerName
#   @return [String]
#
# @!attribute [rw] spreadPercent
#   @return [Float, nil]
Quote = Struct.new(
  :estimatedTime,
  :estimatedTimeTier,
  :fromAmount,
  :grossToAmount,
  :isBest,
  :maxAmount,
  :minAmount,
  :netToAmount,
  :networkFee,
  :providerFeePercent,
  :providerName,
  :spreadPercent,
  keyword_init: true
)

# Request payload for Quote#list.
#
# @!attribute [rw] amount_mode
#   @return [String, nil]
#
# @!attribute [rw] from_amount
#   @return [Float]
#
# @!attribute [rw] from_network
#   @return [String]
#
# @!attribute [rw] from_symbol
#   @return [String]
#
# @!attribute [rw] to_amount
#   @return [Float, nil]
#
# @!attribute [rw] to_network
#   @return [String]
#
# @!attribute [rw] to_symbol
#   @return [String]
QuoteListMatch = Struct.new(
  :amount_mode,
  :from_amount,
  :from_network,
  :from_symbol,
  :to_amount,
  :to_network,
  :to_symbol,
  keyword_init: true
)

