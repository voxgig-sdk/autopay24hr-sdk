<?php
declare(strict_types=1);

// PairLimit entity test

require_once __DIR__ . '/../autopay24hr_sdk.php';
require_once __DIR__ . '/Runner.php';

use PHPUnit\Framework\TestCase;
use Voxgig\Struct\Struct as Vs;

class PairLimitEntityTest extends TestCase
{
    // main.kit.test.live.strict is true (the default is true): a live
    // request that fails, or a live test missing an input it needs,
    // fails the test.
    // An account with no record for a test to read skips it either way.
    private const LIVE_STRICT = true;

    public function test_create_instance(): void
    {
        $testsdk = Autopay24hrSDK::test(null, null);
        $ent = $testsdk->PairLimit(null);
        $this->assertNotNull($ent);
    }

    public function test_validate(): void
    {
        $cfg = Autopay24hrConfig::shared_config();
        if (!isset($cfg["feature"]["validate"])) {
            $this->markTestSkipped('feature not present in this SDK: validate');
        }
        $client = Autopay24hrSDK::test(null, ["feature" => ["validate" => ["active" => true]]]);
        $err = null;
        try {
            $client->PairLimit(null)->load(["from_network" => 1, "from_symbol" => 'x', "to_network" => 'x', "to_symbol" => 'x'], null);
        } catch (\Throwable $e) {
            $err = $e;
        }
        $this->assertSame('validate_failed', $err->sdk_code ?? null);
    }

    public function test_basic_flow(): void
    {
        $setup = pair_limit_basic_setup(null);
        // Per-op sdk-test-control.json skip.
        $_live = !empty($setup["live"]);
        foreach (["load"] as $_op) {
            [$_shouldSkip, $_reason] = Runner::is_control_skipped("entityOp", "pair_limit." . $_op, $_live ? "live" : "unit");
            if ($_shouldSkip) {
                $this->markTestSkipped($_reason ?? "skipped via sdk-test-control.json");
                return;
            }
        }
        $client = $setup["client"];

        // Bootstrap entity data from existing test data.
        $pair_limit_ref01_data_raw = Vs::items(Helpers::to_map(
            Vs::getpath($setup["data"], "existing.pair_limit")));
        $pair_limit_ref01_data = null;
        if (count($pair_limit_ref01_data_raw) > 0) {
            $pair_limit_ref01_data = Helpers::to_map($pair_limit_ref01_data_raw[0][1]);
        }

        // LOAD
        $pair_limit_ref01_ent = $client->PairLimit(null);
        $pair_limit_ref01_match_dt0 = [];
        if (!empty($setup["live"])) {
            $pair_limit_ref01_match_dt0["from_network"] = 'bitcoin';
            $pair_limit_ref01_match_dt0["from_symbol"] = 'BTC';
            $pair_limit_ref01_match_dt0["to_network"] = 'ethereum';
            $pair_limit_ref01_match_dt0["to_symbol"] = 'ETH';
        }
        $pair_limit_ref01_data_dt0_loaded = $pair_limit_ref01_ent->load($pair_limit_ref01_match_dt0, null);
        $this->assertNotNull($pair_limit_ref01_data_dt0_loaded);

    }
}

function pair_limit_basic_setup($extra)
{
    Runner::load_env_local();

    $entity_data_file = __DIR__ . '/../../.sdk/test/entity/pair_limit/PairLimitTestData.json';
    $entity_data_source = file_get_contents($entity_data_file);
    $entity_data = json_decode($entity_data_source, true);

    $options = [];
    $options["entity"] = $entity_data["existing"];

    $client = Autopay24hrSDK::test($options, $extra);

    // Generate idmap.
    $idmap = [];
    foreach (["pair_limit01", "pair_limit02", "pair_limit03"] as $k) {
        $idmap[$k] = strtoupper($k);
    }

    // Whether *_ENTID supplied the idmap, read before env_override consumes
    // it: without it, the ids a live flow binds are the fixture's synthetic ones.
    $entid_env_raw = getenv("AUTOPAY24HR_TEST_PAIR_LIMIT_ENTID");
    $idmap_overridden = $entid_env_raw !== false && str_starts_with(trim($entid_env_raw), "{");

    $env = Runner::env_override([
        "AUTOPAY24HR_TEST_PAIR_LIMIT_ENTID" => $idmap,
        "AUTOPAY24HR_TEST_LIVE" => "FALSE",
        "AUTOPAY24HR_TEST_EXPLAIN" => "FALSE",
    ]);

    $idmap_resolved = Helpers::to_map(
        $env["AUTOPAY24HR_TEST_PAIR_LIMIT_ENTID"]);
    if ($idmap_resolved === null) {
        $idmap_resolved = Helpers::to_map($idmap);
    }

    if ($env["AUTOPAY24HR_TEST_LIVE"] === "TRUE") {
        $merged_opts = Vs::merge([
            // FIRST, so the generated fields below win: sdk-test-control.json's
            // test.client.options adds to the live client, it does not redirect it.
            Runner::live_client_options(),
            [
            ],
            // ismap, not a plain "?? []" default: an empty PHP array is a
            // LIST, and a non-map later entry REPLACES the accumulated map in
            // merge - so the no-extras call discarded live_client_options()
            // and the apikey/server map above it.
            Vs::ismap($extra) ? $extra : new \stdClass(),
        ]);
        // "?? []" because merge legitimately answers with a stdClass when every
        // contributing entry is an EMPTY map - an SDK with no apikey and no
        // server variables generates an empty middle entry, so that is the
        // common case, not the edge one. to_map returns null for a non-array by
        // design, and the constructor takes a non-nullable array, so without the
        // fallback every such SDK died on "must be of type array, null given"
        // the moment live mode was switched on. Offline mode never reaches this
        // branch, which is why the offline suite stayed green.
        $client = new Autopay24hrSDK(Helpers::to_map($merged_opts) ?? []);
    }

    $live = $env["AUTOPAY24HR_TEST_LIVE"] === "TRUE";
    return [
        "client" => $client,
        "data" => $entity_data,
        "idmap" => $idmap_resolved,
        "env" => $env,
        "explain" => $env["AUTOPAY24HR_TEST_EXPLAIN"] === "TRUE",
        "live" => $live,
        "synthetic_only" => $live && !$idmap_overridden,
        "now" => (int)(microtime(true) * 1000),
    ];
}
