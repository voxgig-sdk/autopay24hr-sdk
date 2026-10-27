package voxgigautopay24hrsdk

import (
	"github.com/voxgig-sdk/autopay24hr-sdk/go/core"
	"github.com/voxgig-sdk/autopay24hr-sdk/go/entity"
	"github.com/voxgig-sdk/autopay24hr-sdk/go/feature"
	_ "github.com/voxgig-sdk/autopay24hr-sdk/go/utility"
)

// Type aliases preserve external API.
type Autopay24hrSDK = core.Autopay24hrSDK
type Context = core.Context
type Utility = core.Utility
type Feature = core.Feature
type Entity = core.Entity
type Autopay24hrEntity = core.Autopay24hrEntity
type StreamItem = core.StreamItem
type FetcherFunc = core.FetcherFunc
type Spec = core.Spec
type Result = core.Result
type Response = core.Response
type Operation = core.Operation
type Control = core.Control
type Autopay24hrError = core.Autopay24hrError

// BaseFeature from feature package.
type BaseFeature = feature.BaseFeature

func init() {
	core.NewBaseFeatureFunc = func() core.Feature {
		return feature.NewBaseFeature()
	}
	core.NewRatelimitFeatureFunc = func() core.Feature {
		return feature.NewRatelimitFeature()
	}
	core.NewRetryFeatureFunc = func() core.Feature {
		return feature.NewRetryFeature()
	}
	core.NewTestFeatureFunc = func() core.Feature {
		return feature.NewTestFeature()
	}
	core.NewTimeoutFeatureFunc = func() core.Feature {
		return feature.NewTimeoutFeature()
	}
	core.NewChatStatusEntityFunc = func(client *core.Autopay24hrSDK, entopts map[string]any) core.Autopay24hrEntity {
		return entity.NewChatStatusEntity(client, entopts)
	}
	core.NewCoinEntityFunc = func(client *core.Autopay24hrSDK, entopts map[string]any) core.Autopay24hrEntity {
		return entity.NewCoinEntity(client, entopts)
	}
	core.NewHealthEntityFunc = func(client *core.Autopay24hrSDK, entopts map[string]any) core.Autopay24hrEntity {
		return entity.NewHealthEntity(client, entopts)
	}
	core.NewPairLimitEntityFunc = func(client *core.Autopay24hrSDK, entopts map[string]any) core.Autopay24hrEntity {
		return entity.NewPairLimitEntity(client, entopts)
	}
	core.NewQuoteEntityFunc = func(client *core.Autopay24hrSDK, entopts map[string]any) core.Autopay24hrEntity {
		return entity.NewQuoteEntity(client, entopts)
	}
}

// Constructor re-exports.
var NewAutopay24hrSDK = core.NewAutopay24hrSDK
var TestSDK = core.TestSDK
var NewContext = core.NewContext
var NewSpec = core.NewSpec
var NewResult = core.NewResult
var NewResponse = core.NewResponse
var NewOperation = core.NewOperation
var MakeConfig = core.MakeConfig
var SharedConfig = core.SharedConfig

// No-arg convenience constructors. Go has no default-argument syntax,
// so these aliases let callers write `sdk.New()` / `sdk.Test()`
// instead of `sdk.NewAutopay24hrSDK(nil)` / `sdk.TestSDK(nil, nil)`
// for the common no-options case.
func New() *Autopay24hrSDK  { return NewAutopay24hrSDK(nil) }
func Test() *Autopay24hrSDK { return TestSDK(nil, nil) }
var NewBaseFeature = feature.NewBaseFeature
var NewRatelimitFeature = feature.NewRatelimitFeature
var NewRetryFeature = feature.NewRetryFeature
var NewTestFeature = feature.NewTestFeature
var NewTimeoutFeature = feature.NewTimeoutFeature
