# PairLimit entity test

require "minitest/autorun"
require "json"
require_relative "../Autopay24hr_sdk"
require_relative "runner"

class PairLimitEntityTest < Minitest::Test
  # main.kit.test.live.strict is true (the default is true): a live
  # request that fails, or a live test missing an input it needs,
  # fails the test.
  # An account with no record for a test to read skips it either way.
  LIVE_STRICT = true

  def test_create_instance
    testsdk = Autopay24hrSDK.test(nil, nil)
    ent = testsdk.PairLimit(nil)
    assert !ent.nil?
  end

  def test_validate
    cfg = Autopay24hrConfig.shared_config
    unless cfg["feature"].is_a?(Hash) && cfg["feature"].key?("validate")
      skip("feature not present in this SDK: validate")
    end
    client = Autopay24hrSDK.test(nil, { "feature" => { "validate" => { "active" => true } } })
    err = assert_raises(StandardError) do
      client.PairLimit(nil).load({ "from_network" => 1, "from_symbol" => "x", "to_network" => "x", "to_symbol" => "x" }, nil)
    end
    assert_equal "validate_failed", err.code
  end

  def test_basic_flow
    setup = pair_limit_basic_setup(nil)
    # Per-op sdk-test-control.json skip.
    _live = setup[:live] || false
    ["load"].each do |_op|
      _should_skip, _reason = Runner.is_control_skipped("entityOp", "pair_limit." + _op, _live ? "live" : "unit")
      if _should_skip
        skip(_reason || "skipped via sdk-test-control.json")
        return
      end
    end
    client = setup[:client]

    # Bootstrap entity data from existing test data.
    pair_limit_ref01_data_raw = Vs.items(Helpers.to_map(
      Vs.getpath(setup[:data], "existing.pair_limit")))
    pair_limit_ref01_data = nil
    if pair_limit_ref01_data_raw.length > 0
      pair_limit_ref01_data = Helpers.to_map(pair_limit_ref01_data_raw[0][1])
    end

    # LOAD
    pair_limit_ref01_ent = client.PairLimit(nil)
    pair_limit_ref01_match_dt0 = {}
    if setup[:live]
      pair_limit_ref01_match_dt0["from_network"] = "bitcoin"
      pair_limit_ref01_match_dt0["from_symbol"] = "BTC"
      pair_limit_ref01_match_dt0["to_network"] = "ethereum"
      pair_limit_ref01_match_dt0["to_symbol"] = "ETH"
    end
    pair_limit_ref01_data_dt0_loaded = pair_limit_ref01_ent.load(pair_limit_ref01_match_dt0, nil)
    assert !pair_limit_ref01_data_dt0_loaded.nil?

  end
end

def pair_limit_basic_setup(extra)
  Runner.load_env_local

  entity_data_file = File.join(__dir__, "..", "..", ".sdk", "test", "entity", "pair_limit", "PairLimitTestData.json")
  entity_data_source = File.read(entity_data_file, encoding: "UTF-8")
  entity_data = JSON.parse(entity_data_source)

  options = {}
  options["entity"] = entity_data["existing"]

  client = Autopay24hrSDK.test(options, extra)

  # Generate idmap via transform.
  idmap = Vs.transform(
    ["pair_limit01", "pair_limit02", "pair_limit03"],
    {
      "`$PACK`" => ["", {
        "`$KEY`" => "`$COPY`",
        "`$VAL`" => ["`$FORMAT`", "upper", "`$COPY`"],
      }],
    }
  )

  # Whether *_ENTID supplied the idmap, read before env_override consumes
  # it: without it, the ids a live flow binds are the fixture's synthetic ones.
  entid_env_raw = ENV["AUTOPAY24HR_TEST_PAIR_LIMIT_ENTID"]
  idmap_overridden = !entid_env_raw.nil? && entid_env_raw.strip.start_with?("{")

  env = Runner.env_override({
    "AUTOPAY24HR_TEST_PAIR_LIMIT_ENTID" => idmap,
    "AUTOPAY24HR_TEST_LIVE" => "FALSE",
    "AUTOPAY24HR_TEST_EXPLAIN" => "FALSE",
  })

  idmap_resolved = Helpers.to_map(
    env["AUTOPAY24HR_TEST_PAIR_LIMIT_ENTID"])
  if idmap_resolved.nil?
    idmap_resolved = Helpers.to_map(idmap)
  end

  if env["AUTOPAY24HR_TEST_LIVE"] == "TRUE"
    merged_opts = Vs.merge([
      # FIRST, so the generated fields below win: sdk-test-control.json's
      # test.client.options adds to the live client, it does not redirect it.
      Runner.live_client_options,
      {
      },
      extra || {},
    ])
    client = Autopay24hrSDK.new(Helpers.to_map(merged_opts))
  end

  live = env["AUTOPAY24HR_TEST_LIVE"] == "TRUE"
  {
    client: client,
    data: entity_data,
    idmap: idmap_resolved,
    env: env,
    explain: env["AUTOPAY24HR_TEST_EXPLAIN"] == "TRUE",
    live: live,
    synthetic_only: live && !idmap_overridden,
    now: (Time.now.to_f * 1000).to_i,
  }
end
