// Typed models for the Autopay24hr SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
// params (op.<name>.points[].g.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.
package entity

import (
	"encoding/json"

	"github.com/voxgig-sdk/autopay24hr-sdk/go/core"
)

// ChatStatus is the typed data model for the chat_status entity.
type ChatStatus struct {
}

// ChatStatusLoadMatch is the typed request payload for ChatStatus.LoadTyped.
type ChatStatusLoadMatch struct {
	AiConfigured *bool `json:"aiConfigured,omitempty"`
	FallbackAvailable *bool `json:"fallbackAvailable,omitempty"`
	Model *string `json:"model,omitempty"`
}

// Coin is the typed data model for the coin entity.
type Coin struct {
}

// CoinListMatch is the typed request payload for Coin.ListTyped.
type CoinListMatch struct {
	Decimals *int `json:"decimals,omitempty"`
	Network *string `json:"network,omitempty"`
	Providers *[]any `json:"providers,omitempty"`
	Symbol *string `json:"symbol,omitempty"`
}

// Health is the typed data model for the health entity.
type Health struct {
}

// HealthLoadMatch is the typed request payload for Health.LoadTyped.
type HealthLoadMatch struct {
	Checks *map[string]any `json:"checks,omitempty"`
	Ok *bool `json:"ok,omitempty"`
	Service *string `json:"service,omitempty"`
	Status *string `json:"status,omitempty"`
	Ts *int `json:"ts,omitempty"`
}

// PairLimit is the typed data model for the pair_limit entity.
type PairLimit struct {
}

// PairLimitLoadMatch is the typed request payload for PairLimit.LoadTyped.
type PairLimitLoadMatch struct {
	FromNetwork string `json:"from_network"`
	FromSymbol string `json:"from_symbol"`
	ToNetwork string `json:"to_network"`
	ToSymbol string `json:"to_symbol"`
}

// Quote is the typed data model for the quote entity.
type Quote struct {
}

// QuoteListMatch is the typed request payload for Quote.ListTyped.
type QuoteListMatch struct {
	AmountMode *string `json:"amount_mode,omitempty"`
	FromAmount float64 `json:"from_amount"`
	FromNetwork string `json:"from_network"`
	FromSymbol string `json:"from_symbol"`
	ToAmount *float64 `json:"to_amount,omitempty"`
	ToNetwork string `json:"to_network"`
	ToSymbol string `json:"to_symbol"`
}

// asMap turns a typed request/data struct into the map[string]any the
// runtime op pipeline consumes, honouring the json tags above.
func asMap(v any) map[string]any {
	out := map[string]any{}
	b, err := json.Marshal(v)
	if err != nil {
		return out
	}
	_ = json.Unmarshal(b, &out)
	return out
}

// entityData unwraps an entity to its data map.
//
// Operations resolve to the ENTITY, not the raw data (see AGENTS.md), and an
// entity's fields are UNEXPORTED — marshalling one directly yields `{}`, so
// every typed accessor would silently hand back a zero-valued struct. The
// typed boundary therefore takes the data hop first.
func entityData(v any) any {
	if ent, ok := v.(core.Entity); ok {
		return ent.Data()
	}
	return v
}

// typedFrom decodes a runtime value (an entity, or the map[string]any the op
// pipeline produced) into a typed model T via a JSON round-trip. On any error
// it returns the zero value of T; the op's own (value, error) tuple carries
// the real error.
func typedFrom[T any](v any) T {
	var out T
	v = entityData(v)
	if v == nil {
		return out
	}
	b, err := json.Marshal(v)
	if err != nil {
		return out
	}
	_ = json.Unmarshal(b, &out)
	return out
}

// typedSliceFrom decodes a runtime list value into a typed slice []T via a
// JSON round-trip, for list ops. `list` resolves to a slice of ENTITY
// instances, so each element takes the data hop.
func typedSliceFrom[T any](v any) []T {
	var out []T
	if v == nil {
		return out
	}
	if list, ok := v.([]any); ok {
		unwrapped := make([]any, 0, len(list))
		for _, item := range list {
			unwrapped = append(unwrapped, entityData(item))
		}
		v = unwrapped
	}
	b, err := json.Marshal(v)
	if err != nil {
		return out
	}
	_ = json.Unmarshal(b, &out)
	return out
}
