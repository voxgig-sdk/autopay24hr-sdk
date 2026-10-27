<?php
declare(strict_types=1);

// Typed models for the Autopay24hr SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
// params (op.<name>.points[].g.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.
//
// These are documentation-grade value objects (PHP 8 typed properties),
// registered on the composer classmap autoload. The SDK boundary exchanges
// assoc-arrays; these classes name the shapes for tooling and typed callers.

/** ChatStatus entity data model. */
class ChatStatus
{
    public bool $aiConfigured;
    public bool $fallbackAvailable;
    public ?string $model = null;
}

/** Request payload for ChatStatus#load. */
class ChatStatusLoadMatch
{
    public ?bool $aiConfigured = null;
    public ?bool $fallbackAvailable = null;
    public ?string $model = null;
}

/** Coin entity data model. */
class Coin
{
    public int $decimals;
    public string $network;
    public array $providers;
    public string $symbol;
}

/** Request payload for Coin#list. */
class CoinListMatch
{
    public ?int $decimals = null;
    public ?string $network = null;
    public ?array $providers = null;
    public ?string $symbol = null;
}

/** Health entity data model. */
class Health
{
    public ?array $checks = null;
    public bool $ok;
    public ?string $service = null;
    public string $status;
    public ?int $ts = null;
}

/** Request payload for Health#load. */
class HealthLoadMatch
{
    public ?array $checks = null;
    public ?bool $ok = null;
    public ?string $service = null;
    public ?string $status = null;
    public ?int $ts = null;
}

/** PairLimit entity data model. */
class PairLimit
{
    public string $fromNetwork;
    public string $fromSymbol;
    public float $maxAmount;
    public float $maxUsdApprox;
    public float $minAmount;
    public ?float $minNetReceive = null;
    public float $minUsdApprox;
}

/** Request payload for PairLimit#load. */
class PairLimitLoadMatch
{
    public string $from_network;
    public string $from_symbol;
    public string $to_network;
    public string $to_symbol;
}

/** Quote entity data model. */
class Quote
{
    public ?string $estimatedTime = null;
    public ?string $estimatedTimeTier = null;
    public float $fromAmount;
    public ?float $grossToAmount = null;
    public bool $isBest;
    public ?float $maxAmount = null;
    public ?float $minAmount = null;
    public float $netToAmount;
    public ?float $networkFee = null;
    public ?float $providerFeePercent = null;
    public string $providerName;
    public ?float $spreadPercent = null;
}

/** Request payload for Quote#list. */
class QuoteListMatch
{
    public ?string $amount_mode = null;
    public float $from_amount;
    public string $from_network;
    public string $from_symbol;
    public ?float $to_amount = null;
    public string $to_network;
    public string $to_symbol;
}

