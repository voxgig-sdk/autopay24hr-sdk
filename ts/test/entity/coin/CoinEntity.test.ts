

import Path from 'node:path'
import * as Fs from 'node:fs'

import { test, describe, afterEach } from 'node:test'
import assert from 'node:assert'
import { createLiveTransport } from '../../live-runner'
import { runLiveEntity } from '../../live-entity'


import { Autopay24hrSDK, BaseFeature, config, stdutil } from '../../..'

import {
  envOverride,
  liveClientOptions,
  liveDelay,
  loadEnvLocal,
  makeCtrl,
  makeMatch,
  makeReqdata,
  makeStepData,
  makeValid,
  maybeSkipControl,
} from '../../utility'


loadEnvLocal(__dirname + '/../../../.env.local')


describe('CoinEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when AUTOPAY24HR_TEST_LIVE=TRUE.
  afterEach(liveDelay('AUTOPAY24HR_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = Autopay24hrSDK.test()
    const ent = testsdk.Coin()
    assert(null != ent)
  })


  class FailHook extends BaseFeature {
    name = 'failhook'
    version = '0.0.1'
    active = true
    unexpected = 0
    init() { }
    PreSpec() { throw new Error('coin hook failed') }
    PreUnexpected() { this.unexpected++ }
  }

  test('stream-error', async () => {
    const offline = { net: { offline: true } }
    await assert.rejects(async () => {
      for await (const _item of Autopay24hrSDK.test(offline).Coin().stream('list')) { }
    }, /offline/)

    for await (const _item of Autopay24hrSDK.test(offline).Coin()
      .stream('list', undefined, { ctrl: { throw: false } })) { }

    if (null != (config as any).feature?.rbac) {
      const denied = Autopay24hrSDK.test(undefined, { feature: { rbac: { active: true, deny: true } } })
      await assert.rejects(async () => {
        for await (const _item of denied.Coin().stream('list')) { }
      }, (err: any) => 'rbac_denied' === err.code)
    }
  })

  test('stream-ctrl', async () => {
    const explain: any = {}
    const ctrl: any = { explain }
    for await (const _item of Autopay24hrSDK.test().Coin().stream('list', undefined, { ctrl })) { }
    assert.deepStrictEqual(Object.keys(ctrl), ['explain'])
    assert(explain === ctrl.explain && 0 < Object.keys(explain).length)
  })

  test('unexpected', async () => {
    const hook = new FailHook()
    const client = new Autopay24hrSDK({ feature: { test: { active: true } }, extend: [hook] })
    await assert.rejects(client.Coin().list(), /hook failed/)
    assert(0 < hook.unexpected)

    const fired = hook.unexpected
    assert.strictEqual(await client.Coin().list(undefined, { throw: false }), undefined)
    assert(fired < hook.unexpected)
  })

  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = Autopay24hrSDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.Coin().list({"decimals":"x"} as any),
      (err: any) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    const live = 'TRUE' === process.env.AUTOPAY24HR_TEST_LIVE
    for (const op of ['list']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'coin.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"decimals":{"a":true,"h":"Decimals","n":"decimals","r":true,"sh":"Decimal places of the asset on this network.","t":"`$INTEGER`","key$":"decimals","index$":0},"network":{"a":true,"h":"Network","n":"network","r":true,"sh":"Network slug, e.g.","t":"`$STRING`","key$":"network","index$":1},"providers":{"a":true,"h":"Providers","n":"providers","r":true,"sh":"Providers that route this asset; only \"autopay\" was observed.","t":"`$ARRAY`","key$":"providers","index$":2},"symbol":{"a":true,"h":"Symbol","n":"symbol","r":true,"sh":"Ticker symbol, e.g.","t":"`$STRING`","key$":"symbol","index$":3}},"name":"coin","op":{"list":{"input":"data","name":"list","points":[{"a":true,"co":{"id":"GET /api/v1/coins","source":"openapi3","version":2},"g":{},"k":"http","m":"GET","o":"/api/v1/coins","q":{},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"api"},{"lit":"v1"},{"lit":"coins"}],"t":{"req":"`reqdata`","res":"`body.coins`"},"index$":0}],"key$":"list"}},"relations":{"ancestors":[]},"key$":"coin","name__orig":"coin","Name":"Coin","name_":"coin","name-":"coin","NAME":"COIN","index$":1}, {"active":true,"entity":"coin","key$":"BasicCoinFlow","kind":"basic","name":"BasicCoinFlow","param":{},"step":[{"a":true,"d":{},"i":{},"m":{},"o":"list","s":[],"v":[{"apply":"ItemExists","def":{"ref":"coin_ref01"}}],"index$":0}]}, 'Coin', {"GET /api/v1/coins":{"protocol":"http","parameters":[]}}, { strict: LIVE_STRICT, t })
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select

    let coin_ref01_data = Object.values(setup.data.existing.coin)[0] as any

    // LIST
    const coin_ref01_ent = client.Coin()
    const coin_ref01_match: any = {}

    const coin_ref01_list = (await coin_ref01_ent.list(coin_ref01_match)).map((e: any) => e.data())


  })
})



// main.kit.test.live.strict is true (the default is true): a live
// request that fails, or a live test missing an input it needs,
// fails the test.
// An account with no record for a test to read skips it either way.
const LIVE_STRICT = true

function basicSetup(extra?: any) {
  // TODO: fix test def options
  const options: any = {} // null

  // TODO: needs test utility to resolve path
  const entityDataFile =
    Path.resolve(__dirname, 
      '../../../../.sdk/test/entity/coin/CoinTestData.json')

  // TODO: file ready util needed?
  const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8')

  // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
  const entityData = JSON.parse(entityDataSource)

  options.entity = entityData.existing

  let client = Autopay24hrSDK.test(options, extra)
  const struct = client.utility().struct
  const merge = struct.merge
  const transform = struct.transform

  let idmap = transform(
    ['coin01','coin02','coin03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'AUTOPAY24HR_TEST_COIN_ENTID': idmap,
    'AUTOPAY24HR_TEST_LIVE': 'FALSE',
    'AUTOPAY24HR_TEST_EXPLAIN': 'FALSE',
  })

  idmap = env['AUTOPAY24HR_TEST_COIN_ENTID']

  const live = 'TRUE' === env.AUTOPAY24HR_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['AUTOPAY24HR_TEST_COIN_ENTID']
    idmap = rawIds && rawIds.trim() ? JSON.parse(rawIds) : {}
    if (!idmap || Array.isArray(idmap) || typeof idmap !== 'object') {
      throw new Error('Live ENTID must be a JSON object')
    }
    client = new Autopay24hrSDK(merge([
      // FIRST, so the generated fields below win: sdk-test-control.json's
      // test.client.options adds to the live client, it does not redirect it.
      liveClientOptions(),
      {
      },
      // 'extra || {}', not a bare 'extra': struct.merge returns UNDEFINED when the
      // last entry is undefined, and basicSetup is normally called with no
      // argument at all - so a bare 'extra' silently discarded the apikey
      // and server values above and handed the SDK undefined. Harmless
      // while there was nothing in that object; not harmless now.
      extra || {},
      { system: { fetch: transport.fetch } }
    ]))
  }

  const setup = {
    idmap,
    env,
    options,
    client,
    struct,
    data: entityData,
    explain: 'TRUE' === env.AUTOPAY24HR_TEST_EXPLAIN,
    live,
    transport,
    now: Date.now(),
  }

  return setup
}
  
