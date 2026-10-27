package sdktest

import (
	"encoding/json"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"testing"
	"time"

	sdk "github.com/voxgig-sdk/autopay24hr-sdk/go"
	"github.com/voxgig-sdk/autopay24hr-sdk/go/core"

	vs "github.com/voxgig-sdk/autopay24hr-sdk/go/utility/struct"
)

// main.kit.test.live.strict is true (the default is true): a live
// request that fails, or a live test missing an input it needs,
// fails the test.
// An account with no record for a test to read skips it either way.
const pair_limitEntityLiveStrict = true


func TestPairLimitEntity(t *testing.T) {
	t.Run("instance", func(t *testing.T) {
		testsdk := sdk.TestSDK(nil, nil)
		ent := testsdk.PairLimit(nil)
		if ent == nil {
			t.Fatal("expected non-nil PairLimitEntity")
		}
	})

	t.Run("validate", func(t *testing.T) {
		if !fhHasFeature("validate") {
			t.Skip("feature not present in this SDK: validate")
		}
		client := sdk.TestSDK(nil, map[string]any{
			"feature": map[string]any{"validate": map[string]any{"active": true}},
		})
		_, err := client.PairLimit(nil).Load(map[string]any{"from_network": 1, "from_symbol": "x", "to_network": "x", "to_symbol": "x"}, nil)
		if sdkerr, ok := err.(*core.Autopay24hrError); !ok || "validate_failed" != sdkerr.Code {
			t.Fatalf("expected validate_failed, got %v", err)
		}
	})

	t.Run("basic", func(tt *testing.T) {
		var t testing.TB = tt
		setup := pair_limitBasicSetup(nil)
		// Per-op sdk-test-control.json skip — basic test exercises a flow
		// with multiple ops; skipping any op skips the whole flow.
		_mode := "unit"
		if setup.live {
			_mode = "live"
		}
		for _, _op := range []string{"load"} {
			if _shouldSkip, _reason := isControlSkipped("entityOp", "pair_limit." + _op, _mode); _shouldSkip {
				if _reason == "" {
					_reason = "skipped via sdk-test-control.json"
				}
				t.Skip(_reason)
				return
			}
		}
		client := setup.client
		_ = client

		// Bootstrap entity data from existing test data (no create step in flow).
		pairLimitRef01DataRaw := vs.Items(core.ToMapAny(vs.GetPath(setup.data, "existing.pair_limit")))
		var pairLimitRef01Data map[string]any
		if len(pairLimitRef01DataRaw) > 0 {
			pairLimitRef01Data = core.ToMapAny(pairLimitRef01DataRaw[0][1])
		}
		// Discard guards against Go's unused-var check when the flow's steps
		// happen not to consume the bootstrap data (e.g. list-only flows).
		_ = pairLimitRef01Data

		// LOAD
		pairLimitRef01Ent := client.PairLimit(nil)
		pairLimitRef01MatchDt0 := map[string]any{}
		if setup.live {
			pairLimitRef01MatchDt0["from_network"] = "bitcoin"
			pairLimitRef01MatchDt0["from_symbol"] = "BTC"
			pairLimitRef01MatchDt0["to_network"] = "ethereum"
			pairLimitRef01MatchDt0["to_symbol"] = "ETH"
		}
		pairLimitRef01DataDt0Loaded, err := pairLimitRef01Ent.Load(pairLimitRef01MatchDt0, nil)
		if err != nil {
			t.Fatalf("load failed: %v", err)
		}
		if pairLimitRef01DataDt0Loaded == nil {
			t.Fatal("expected load result to be non-nil")
		}

	})
}

func pair_limitBasicSetup(extra map[string]any) *entityTestSetup {
	loadEnvLocal()

	_, filename, _, _ := runtime.Caller(0)
	dir := filepath.Dir(filename)

	entityDataFile := filepath.Join(dir, "..", "..", ".sdk", "test", "entity", "pair_limit", "PairLimitTestData.json")

	entityDataSource, err := os.ReadFile(entityDataFile)
	if err != nil {
		panic("failed to read pair_limit test data: " + err.Error())
	}

	var entityData map[string]any
	if err := json.Unmarshal(entityDataSource, &entityData); err != nil {
		panic("failed to parse pair_limit test data: " + err.Error())
	}

	options := map[string]any{}
	options["entity"] = entityData["existing"]

	client := sdk.TestSDK(options, extra)

	// Generate idmap via transform, matching TS pattern.
	idmap, _ := vs.Transform(
		[]any{"pair_limit01", "pair_limit02", "pair_limit03"},
		map[string]any{
			"`$PACK`": []any{"", map[string]any{
				"`$KEY`": "`$COPY`",
				"`$VAL`": []any{"`$FORMAT`", "upper", "`$COPY`"},
			}},
		},
	)

	// Whether *_ENTID supplied the idmap, read before envOverride consumes it:
	// without it, the ids a live flow binds are the fixture's synthetic ones.
	entidEnvRaw := os.Getenv("AUTOPAY24HR_TEST_PAIR_LIMIT_ENTID")
	idmapOverridden := entidEnvRaw != "" && strings.HasPrefix(strings.TrimSpace(entidEnvRaw), "{")

	env := envOverride(map[string]any{
		"AUTOPAY24HR_TEST_PAIR_LIMIT_ENTID": idmap,
		"AUTOPAY24HR_TEST_LIVE":      "FALSE",
		"AUTOPAY24HR_TEST_EXPLAIN":   "FALSE",
	})

	idmapResolved := core.ToMapAny(env["AUTOPAY24HR_TEST_PAIR_LIMIT_ENTID"])
	if idmapResolved == nil {
		idmapResolved = core.ToMapAny(idmap)
	}

	if env["AUTOPAY24HR_TEST_LIVE"] == "TRUE" {
		// An empty map, not a nil one: Merge returns nil when its last entry
		// is nil, and BasicSetup is normally called with no extras - so a
		// bare nil silently discarded the apikey and server values below.
		extraOpts := extra
		if extraOpts == nil {
			extraOpts = map[string]any{}
		}

		mergedOpts := vs.Merge([]any{
			// liveClientOptions() FIRST, so the generated fields below win:
			// sdk-test-control.json's test.client.options adds to the live
			// client, it does not redirect it.
			liveClientOptions(),
			map[string]any{
			},
			extraOpts,
		})
		client = sdk.NewAutopay24hrSDK(core.ToMapAny(mergedOpts))
	}

	live := env["AUTOPAY24HR_TEST_LIVE"] == "TRUE"
	return &entityTestSetup{
		client:        client,
		data:          entityData,
		idmap:         idmapResolved,
		env:           env,
		explain:       env["AUTOPAY24HR_TEST_EXPLAIN"] == "TRUE",
		live:          live,
		syntheticOnly: live && !idmapOverridden,
		now:           time.Now().UnixMilli(),
	}
}
