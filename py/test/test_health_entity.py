# Health entity test

import json
import os
import time

import pytest

from autopay24hr_sdk.utility.voxgig_struct import voxgig_struct as vs
from autopay24hr_sdk import Autopay24hrSDK
from autopay24hr_sdk.core import helpers
from autopay24hr_sdk.config import shared_config
from autopay24hr_sdk.feature.base_feature import Autopay24hrBaseFeature

_TEST_DIR = os.path.dirname(os.path.abspath(__file__))
from test import runner



# main.kit.test.live.strict is true (the default is true): a live
# request that fails, or a live test missing an input it needs,
# fails the test.
# An account with no record for a test to read skips it either way.
LIVE_STRICT = True


class TestHealthEntity:

    def test_should_create_instance(self):
        testsdk = Autopay24hrSDK.test(None, None)
        ent = testsdk.Health(None)
        assert ent is not None

    def test_should_refuse_an_invalid_request(self):
        if "validate" not in (shared_config().get("feature") or {}):
            pytest.skip("feature not present in this SDK: validate")
        client = Autopay24hrSDK.test(
            None, {"feature": {"validate": {"active": True}}})
        with pytest.raises(Exception) as err:
            client.Health(None).load({"ok": "x"}, None)
        assert "validate_failed" == getattr(err.value, "code", None)

    def test_should_run_basic_flow(self):
        setup = _health_basic_setup(None)
        # Per-op sdk-test-control.json skip — basic test exercises a flow with
        # multiple ops; skipping any one skips the whole flow (steps depend
        # on each other).
        _live = setup.get("live", False)
        for _op in ["load"]:
            _skip, _reason = runner.is_control_skipped("entityOp", "health." + _op, "live" if _live else "unit")
            if _skip:
                pytest.skip(_reason or "skipped via sdk-test-control.json")
                return
        client = setup["client"]

        # Bootstrap entity data from existing test data.
        health_ref01_data_raw = vs.items(helpers.to_map(
            vs.getpath(setup["data"], "existing.health")))
        health_ref01_data = None
        if len(health_ref01_data_raw) > 0:
            health_ref01_data = helpers.to_map(health_ref01_data_raw[0][1])

        # LOAD
        health_ref01_ent = client.Health(None)
        health_ref01_match_dt0 = {}
        health_ref01_data_dt0_loaded = health_ref01_ent.load(health_ref01_match_dt0, None)
        assert health_ref01_data_dt0_loaded is not None



def _health_basic_setup(extra):
    runner.load_env_local()

    entity_data_file = os.path.join(_TEST_DIR, "../../.sdk/test/entity/health/HealthTestData.json")
    with open(entity_data_file, "r", encoding="utf-8") as f:
        entity_data_source = f.read()

    entity_data = json.loads(entity_data_source)

    options = {}
    options["entity"] = entity_data.get("existing")

    client = Autopay24hrSDK.test(options, extra)

    # Generate idmap via transform.
    idmap = vs.transform(
        ["health01", "health02", "health03"],
        {
            "`$PACK`": ["", {
                "`$KEY`": "`$COPY`",
                "`$VAL`": ["`$FORMAT`", "upper", "`$COPY`"],
            }],
        }
    )

    # Whether *_ENTID supplied the idmap, read before env_override consumes
    # it: without it, the ids a live flow binds are the fixture's synthetic ones.
    _entid_env_raw = os.environ.get(
        "AUTOPAY24HR_TEST_HEALTH_ENTID")
    _idmap_overridden = _entid_env_raw is not None and _entid_env_raw.strip().startswith("{")

    env = runner.env_override({
        "AUTOPAY24HR_TEST_HEALTH_ENTID": idmap,
        "AUTOPAY24HR_TEST_LIVE": "FALSE",
        "AUTOPAY24HR_TEST_EXPLAIN": "FALSE",
    })

    idmap_resolved = helpers.to_map(
        env.get("AUTOPAY24HR_TEST_HEALTH_ENTID"))
    if idmap_resolved is None:
        idmap_resolved = helpers.to_map(idmap)

    if env.get("AUTOPAY24HR_TEST_LIVE") == "TRUE":
        merged_opts = vs.merge([
            # FIRST, so the generated fields below win: sdk-test-control.json's
            # test.client.options adds to the live client, it does not
            # redirect it.
            runner.live_client_options(),
            {
            },
            extra or {},
        ])
        client = Autopay24hrSDK(helpers.to_map(merged_opts))

    _live = env.get("AUTOPAY24HR_TEST_LIVE") == "TRUE"
    return {
        "client": client,
        "data": entity_data,
        "idmap": idmap_resolved,
        "env": env,
        "explain": env.get("AUTOPAY24HR_TEST_EXPLAIN") == "TRUE",
        "live": _live,
        "synthetic_only": _live and not _idmap_overridden,
        "now": int(time.time() * 1000),
    }
