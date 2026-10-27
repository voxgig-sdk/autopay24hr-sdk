package core

var UtilityRegistrar func(u *Utility)

var NewBaseFeatureFunc func() Feature

var NewRatelimitFeatureFunc func() Feature

var NewRetryFeatureFunc func() Feature

var NewTestFeatureFunc func() Feature

var NewTimeoutFeatureFunc func() Feature

var NewChatStatusEntityFunc func(client *Autopay24hrSDK, entopts map[string]any) Autopay24hrEntity

var NewCoinEntityFunc func(client *Autopay24hrSDK, entopts map[string]any) Autopay24hrEntity

var NewHealthEntityFunc func(client *Autopay24hrSDK, entopts map[string]any) Autopay24hrEntity

var NewPairLimitEntityFunc func(client *Autopay24hrSDK, entopts map[string]any) Autopay24hrEntity

var NewQuoteEntityFunc func(client *Autopay24hrSDK, entopts map[string]any) Autopay24hrEntity

