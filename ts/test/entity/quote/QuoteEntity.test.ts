

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


describe('QuoteEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when AUTOPAY24HR_TEST_LIVE=TRUE.
  afterEach(liveDelay('AUTOPAY24HR_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = Autopay24hrSDK.test()
    const ent = testsdk.Quote()
    assert(null != ent)
  })


  class FailHook extends BaseFeature {
    name = 'failhook'
    version = '0.0.1'
    active = true
    unexpected = 0
    init() { }
    PreSpec() { throw new Error('quote hook failed') }
    PreUnexpected() { this.unexpected++ }
  }

  test('stream-error', async () => {
    const offline = { net: { offline: true } }
    await assert.rejects(async () => {
      for await (const _item of Autopay24hrSDK.test(offline).Quote().stream('list')) { }
    }, /offline/)

    for await (const _item of Autopay24hrSDK.test(offline).Quote()
      .stream('list', undefined, { ctrl: { throw: false } })) { }

    if (null != (config as any).feature?.rbac) {
      const denied = Autopay24hrSDK.test(undefined, { feature: { rbac: { active: true, deny: true } } })
      await assert.rejects(async () => {
        for await (const _item of denied.Quote().stream('list')) { }
      }, (err: any) => 'rbac_denied' === err.code)
    }
  })

  test('stream-ctrl', async () => {
    const explain: any = {}
    const ctrl: any = { explain }
    for await (const _item of Autopay24hrSDK.test().Quote().stream('list', undefined, { ctrl })) { }
    assert.deepStrictEqual(Object.keys(ctrl), ['explain'])
    assert(explain === ctrl.explain && 0 < Object.keys(explain).length)
  })

  test('unexpected', async () => {
    const hook = new FailHook()
    const client = new Autopay24hrSDK({ feature: { test: { active: true } }, extend: [hook] })
    await assert.rejects(client.Quote().list(), /hook failed/)
    assert(0 < hook.unexpected)

    const fired = hook.unexpected
    assert.strictEqual(await client.Quote().list(undefined, { throw: false }), undefined)
    assert(fired < hook.unexpected)
  })

  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = Autopay24hrSDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.Quote().list({"amount_mode":1,"from_amount":1,"from_network":"x","from_symbol":"x","to_network":"x","to_symbol":"x"} as any),
      (err: any) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    const live = 'TRUE' === process.env.AUTOPAY24HR_TEST_LIVE
    for (const op of ['list']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'quote.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"estimatedTime":{"a":true,"h":"Estimated Time","n":"estimatedTime","r":false,"sh":"Human-readable completion estimate, e.g.","t":"`$STRING`","key$":"estimatedTime","index$":0},"estimatedTimeTier":{"a":true,"h":"Estimated Time Tier","n":"estimatedTimeTier","r":false,"sh":"Speed tier; observed \"fast\" and \"slow\".","t":"`$STRING`","key$":"estimatedTimeTier","index$":1},"fromAmount":{"a":true,"h":"From Amount","n":"fromAmount","r":true,"sh":"Amount sent, in units of the source coin.","t":"`$NUMBER`","key$":"fromAmount","index$":2},"grossToAmount":{"a":true,"h":"Gross To Amount","n":"grossToAmount","r":false,"sh":"Amount of the destination coin before the spread.","t":"`$NUMBER`","key$":"grossToAmount","index$":3},"isBest":{"a":true,"h":"Is Best","n":"isBest","r":true,"sh":"True for the route chosen as best.","t":"`$BOOLEAN`","key$":"isBest","index$":4},"maxAmount":{"a":true,"h":"Max Amount","n":"maxAmount","r":false,"sh":"Route maximum send amount, in units of the source coin.","t":"`$NUMBER`","key$":"maxAmount","index$":5},"minAmount":{"a":true,"h":"Min Amount","n":"minAmount","r":false,"sh":"Route minimum send amount, in units of the source coin.","t":"`$NUMBER`","key$":"minAmount","index$":6},"netToAmount":{"a":true,"h":"Net To Amount","n":"netToAmount","r":true,"sh":"Amount of the destination coin the user receives.","t":"`$NUMBER`","key$":"netToAmount","index$":7},"networkFee":{"a":true,"h":"Network Fee","n":"networkFee","r":false,"sh":"Network fee charged by the route (observed 0).","t":"`$NUMBER`","key$":"networkFee","index$":8},"providerFeePercent":{"a":true,"h":"Provider Fee Percent","n":"providerFeePercent","r":false,"sh":"Provider fee in percent (observed 0).","t":"`$NUMBER`","key$":"providerFeePercent","index$":9},"providerName":{"a":true,"h":"Provider Name","n":"providerName","r":true,"sh":"Route (provider) name; only \"AutoPay Instant\" was observed.","t":"`$STRING`","key$":"providerName","index$":10},"spreadPercent":{"a":true,"h":"Spread Percent","n":"spreadPercent","r":false,"sh":"Spread applied by the route, in percent (observed 0 and 0.5).","t":"`$NUMBER`","key$":"spreadPercent","index$":11}},"name":"quote","op":{"list":{"input":"data","name":"list","points":[{"a":true,"co":{"id":"GET /api/v1/quote","source":"openapi3","version":2},"g":{"query":[{"a":true,"ex":"send","k":"query","n":"amount_mode","or":"amountMode","r":false,"t":"`$STRING`","index$":0},{"a":true,"ex":0.1,"k":"query","n":"from_amount","or":"fromAmount","r":true,"t":"`$NUMBER`","index$":1},{"a":true,"ex":"bitcoin","k":"query","n":"from_network","or":"fromNetwork","r":true,"t":"`$STRING`","index$":2},{"a":true,"ex":"BTC","k":"query","n":"from_symbol","or":"fromSymbol","r":true,"t":"`$STRING`","index$":3},{"a":true,"ex":1,"k":"query","n":"to_amount","or":"toAmount","r":false,"t":"`$NUMBER`","index$":4},{"a":true,"ex":"ethereum","k":"query","n":"to_network","or":"toNetwork","r":true,"t":"`$STRING`","index$":5},{"a":true,"ex":"ETH","k":"query","n":"to_symbol","or":"toSymbol","r":true,"t":"`$STRING`","index$":6}]},"k":"http","m":"GET","o":"/api/v1/quote","q":{"exist":["from_amount","from_network","from_symbol","to_network","to_symbol"]},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"api"},{"lit":"v1"},{"lit":"quote"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"list"}},"relations":{"ancestors":[]},"key$":"quote","name__orig":"quote","Name":"Quote","name_":"quote","name-":"quote","NAME":"QUOTE","index$":4}, {"active":true,"entity":"quote","key$":"BasicQuoteFlow","kind":"basic","name":"BasicQuoteFlow","param":{},"step":[{"a":true,"d":{},"i":{},"m":{},"o":"list","s":[],"v":[{"apply":"ItemExists","def":{"ref":"quote_ref01"}}],"index$":0}]}, 'Quote', {"GET /api/v1/quote":{"protocol":"http","parameters":[{"name":"fromSymbol","in":"query","required":true,"description":"Symbol of the coin to send, as in Coin.symbol.","schema":{"type":"string"},"example":"BTC","x-ref":"#/components/parameters/FromSymbol","index$":0},{"name":"fromNetwork","in":"query","required":true,"description":"Network of the coin to send, as in Coin.network.","schema":{"type":"string"},"example":"bitcoin","x-ref":"#/components/parameters/FromNetwork","index$":1},{"name":"toSymbol","in":"query","required":true,"description":"Symbol of the coin to receive, as in Coin.symbol.","schema":{"type":"string"},"example":"ETH","x-ref":"#/components/parameters/ToSymbol","index$":2},{"name":"toNetwork","in":"query","required":true,"description":"Network of the coin to receive, as in Coin.network.","schema":{"type":"string"},"example":"ethereum","x-ref":"#/components/parameters/ToNetwork","index$":3},{"name":"fromAmount","in":"query","required":true,"description":"Amount to send, in units of the source coin. Required in send mode (omitting it returns 400 invalid_request); ignored in receive mode. Below the route minimum returns 400 amount_too_low.","schema":{"type":"number"},"example":0.1,"index$":4},{"name":"toAmount","in":"query","required":false,"description":"Net amount of the destination coin wanted. Used only with amountMode=receive; ignored in send mode.","schema":{"type":"number"},"example":1,"index$":5},{"name":"amountMode","in":"query","required":false,"description":"send locks the amount sent (fromAmount); receive locks the amount received (toAmount).","schema":{"type":"string","enum":["send","receive"],"default":"send"},"example":"send","index$":6}]}}, { strict: LIVE_STRICT, t })
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select

    let quote_ref01_data = Object.values(setup.data.existing.quote)[0] as any

    // LIST
    const quote_ref01_ent = client.Quote()
    const quote_ref01_match: any = {}

    const quote_ref01_list = (await quote_ref01_ent.list(quote_ref01_match)).map((e: any) => e.data())


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
      '../../../../.sdk/test/entity/quote/QuoteTestData.json')

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
    ['quote01','quote02','quote03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'AUTOPAY24HR_TEST_QUOTE_ENTID': idmap,
    'AUTOPAY24HR_TEST_LIVE': 'FALSE',
    'AUTOPAY24HR_TEST_EXPLAIN': 'FALSE',
  })

  idmap = env['AUTOPAY24HR_TEST_QUOTE_ENTID']

  const live = 'TRUE' === env.AUTOPAY24HR_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['AUTOPAY24HR_TEST_QUOTE_ENTID']
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
  
