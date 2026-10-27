

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


describe('PairLimitEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when AUTOPAY24HR_TEST_LIVE=TRUE.
  afterEach(liveDelay('AUTOPAY24HR_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = Autopay24hrSDK.test()
    const ent = testsdk.PairLimit()
    assert(null != ent)
  })


  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = Autopay24hrSDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.PairLimit().load({"from_network":1,"from_symbol":"x","to_network":"x","to_symbol":"x"} as any),
      (err: any) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    const live = 'TRUE' === process.env.AUTOPAY24HR_TEST_LIVE
    for (const op of ['load']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'pair_limit.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"fromNetwork":{"a":true,"h":"From Network","n":"fromNetwork","r":true,"sh":"Source coin network.","t":"`$STRING`","key$":"fromNetwork","index$":0},"fromSymbol":{"a":true,"h":"From Symbol","n":"fromSymbol","r":true,"sh":"Source coin symbol.","t":"`$STRING`","key$":"fromSymbol","index$":1},"maxAmount":{"a":true,"h":"Max Amount","n":"maxAmount","r":true,"sh":"Maximum send amount.","t":"`$NUMBER`","key$":"maxAmount","index$":2},"maxUsdApprox":{"a":true,"h":"Max Usd Approx","n":"maxUsdApprox","r":true,"sh":"Approximate USD value of maxAmount.","t":"`$NUMBER`","key$":"maxUsdApprox","index$":3},"minAmount":{"a":true,"h":"Min Amount","n":"minAmount","r":true,"sh":"Minimum send amount.","t":"`$NUMBER`","key$":"minAmount","index$":4},"minNetReceive":{"a":true,"h":"Min Net Receive","n":"minNetReceive","r":false,"sh":"Net amount of the destination coin received at the minimum send amount (undocumented).","t":"`$NUMBER`","key$":"minNetReceive","index$":5},"minUsdApprox":{"a":true,"h":"Min Usd Approx","n":"minUsdApprox","r":true,"sh":"Approximate USD value of minAmount.","t":"`$NUMBER`","key$":"minUsdApprox","index$":6}},"name":"pair_limit","op":{"load":{"input":"data","name":"load","points":[{"a":true,"co":{"id":"GET /api/v1/pair-limits","source":"openapi3","version":2},"g":{"query":[{"a":true,"ex":"bitcoin","k":"query","n":"from_network","or":"fromNetwork","r":true,"t":"`$STRING`","index$":0},{"a":true,"ex":"BTC","k":"query","n":"from_symbol","or":"fromSymbol","r":true,"t":"`$STRING`","index$":1},{"a":true,"ex":"ethereum","k":"query","n":"to_network","or":"toNetwork","r":true,"t":"`$STRING`","index$":2},{"a":true,"ex":"ETH","k":"query","n":"to_symbol","or":"toSymbol","r":true,"t":"`$STRING`","index$":3}]},"k":"http","m":"GET","o":"/api/v1/pair-limits","q":{"exist":["from_network","from_symbol","to_network","to_symbol"]},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"api"},{"lit":"v1"},{"lit":"pair-limits"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"load"}},"relations":{"ancestors":[]},"key$":"pair_limit","name__orig":"pair_limit","Name":"PairLimit","name_":"pair_limit","name-":"pair-limit","NAME":"PAIR_LIMIT","index$":3}, {"active":true,"entity":"pair_limit","key$":"BasicPairLimitFlow","kind":"basic","name":"BasicPairLimitFlow","param":{},"step":[{"a":true,"d":{},"i":{"ref":"pair_limit_ref01","srcdatavar":"pair_limit_ref01_data","suffix":"_dt0"},"m":{},"o":"load","s":[],"v":[{"apply":"TextFieldMark","def":{"mark":"Mark01-pair_limit_ref01"}}],"index$":0}]}, 'PairLimit', {"GET /api/v1/pair-limits":{"protocol":"http","parameters":[{"name":"fromSymbol","in":"query","required":true,"description":"Symbol of the coin to send, as in Coin.symbol.","schema":{"type":"string"},"example":"BTC","x-ref":"#/components/parameters/FromSymbol","index$":0},{"name":"fromNetwork","in":"query","required":true,"description":"Network of the coin to send, as in Coin.network.","schema":{"type":"string"},"example":"bitcoin","x-ref":"#/components/parameters/FromNetwork","index$":1},{"name":"toSymbol","in":"query","required":true,"description":"Symbol of the coin to receive, as in Coin.symbol.","schema":{"type":"string"},"example":"ETH","x-ref":"#/components/parameters/ToSymbol","index$":2},{"name":"toNetwork","in":"query","required":true,"description":"Network of the coin to receive, as in Coin.network.","schema":{"type":"string"},"example":"ethereum","x-ref":"#/components/parameters/ToNetwork","index$":3}]}}, { strict: LIVE_STRICT, t })
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select

    let pair_limit_ref01_data = Object.values(setup.data.existing.pair_limit)[0] as any

    // LOAD
    const pair_limit_ref01_ent = client.PairLimit()
    const pair_limit_ref01_match_dt0: any = {}
    const pair_limit_ref01_data_dt0 = (await pair_limit_ref01_ent.load(pair_limit_ref01_match_dt0)).data()
    assert(null != pair_limit_ref01_data_dt0)


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
      '../../../../.sdk/test/entity/pair_limit/PairLimitTestData.json')

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
    ['pair_limit01','pair_limit02','pair_limit03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'AUTOPAY24HR_TEST_PAIR_LIMIT_ENTID': idmap,
    'AUTOPAY24HR_TEST_LIVE': 'FALSE',
    'AUTOPAY24HR_TEST_EXPLAIN': 'FALSE',
  })

  idmap = env['AUTOPAY24HR_TEST_PAIR_LIMIT_ENTID']

  const live = 'TRUE' === env.AUTOPAY24HR_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['AUTOPAY24HR_TEST_PAIR_LIMIT_ENTID']
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
  
