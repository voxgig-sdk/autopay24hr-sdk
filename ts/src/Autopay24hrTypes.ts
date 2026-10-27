// Typed models for the Autopay24hr SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
// params (op.<name>.points[].g.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.

export interface ChatStatus {
  aiConfigured: boolean
  fallbackAvailable: boolean
  model?: string
}

export interface ChatStatusLoadMatch {
  aiConfigured?: boolean
  fallbackAvailable?: boolean
  model?: string
}

export interface Coin {
  decimals: number
  network: string
  providers: any[]
  symbol: string
}

export interface CoinListMatch {
  decimals?: number
  network?: string
  providers?: any[]
  symbol?: string
}

export interface Health {
  checks?: Record<string, any>
  ok: boolean
  service?: string
  status: string
  ts?: number
}

export interface HealthLoadMatch {
  checks?: Record<string, any>
  ok?: boolean
  service?: string
  status?: string
  ts?: number
}

export interface PairLimit {
  fromNetwork: string
  fromSymbol: string
  maxAmount: number
  maxUsdApprox: number
  minAmount: number
  minNetReceive?: number
  minUsdApprox: number
}

export interface PairLimitLoadMatch {
  from_network: string
  from_symbol: string
  to_network: string
  to_symbol: string
}

export interface Quote {
  estimatedTime?: string
  estimatedTimeTier?: string
  fromAmount: number
  grossToAmount?: number
  isBest: boolean
  maxAmount?: number
  minAmount?: number
  netToAmount: number
  networkFee?: number
  providerFeePercent?: number
  providerName: string
  spreadPercent?: number
}

export interface QuoteListMatch {
  amount_mode?: string
  from_amount: number
  from_network: string
  from_symbol: string
  to_amount?: number
  to_network: string
  to_symbol: string
}

