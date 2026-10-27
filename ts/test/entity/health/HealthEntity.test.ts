

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


describe('HealthEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when AUTOPAY24HR_TEST_LIVE=TRUE.
  afterEach(liveDelay('AUTOPAY24HR_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = Autopay24hrSDK.test()
    const ent = testsdk.Health()
    assert(null != ent)
  })


  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = Autopay24hrSDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.Health().load({"ok":"x"} as any),
      (err: any) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    const live = 'TRUE' === process.env.AUTOPAY24HR_TEST_LIVE
    for (const op of ['load']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'health.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"checks":{"a":true,"h":"Checks","n":"checks","r":false,"sh":"Per-dependency checks.","t":"`$OBJECT`","key$":"checks","index$":0},"ok":{"a":true,"h":"Ok","n":"ok","r":true,"sh":"Overall health.","t":"`$BOOLEAN`","key$":"ok","index$":1},"service":{"a":true,"h":"Service","n":"service","r":false,"sh":"Service name; observed \"autopay\".","t":"`$STRING`","key$":"service","index$":2},"status":{"a":true,"h":"Status","n":"status","r":true,"sh":"Overall status; observed \"ok\".","t":"`$STRING`","key$":"status","index$":3},"ts":{"a":true,"fo":"int64","h":"Ts","n":"ts","r":false,"sh":"Server time of the check, epoch milliseconds.","t":"`$INTEGER`","key$":"ts","index$":4}},"name":"health","op":{"load":{"input":"data","name":"load","points":[{"a":true,"co":{"id":"GET /api/health","source":"openapi3","version":2},"g":{},"k":"http","m":"GET","o":"/api/health","q":{},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"api"},{"lit":"health"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"load"}},"relations":{"ancestors":[]},"key$":"health","name__orig":"health","Name":"Health","name_":"health","name-":"health","NAME":"HEALTH","index$":2}, {"active":true,"entity":"health","key$":"BasicHealthFlow","kind":"basic","name":"BasicHealthFlow","param":{},"step":[{"a":true,"d":{},"i":{"ref":"health_ref01","srcdatavar":"health_ref01_data","suffix":"_dt0"},"m":{},"o":"load","s":[],"v":[{"apply":"TextFieldMark","def":{"mark":"Mark01-health_ref01"}}],"index$":0}]}, 'Health', {"GET /api/health":{"protocol":"http","parameters":[]}}, { strict: LIVE_STRICT, t })
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select

    let health_ref01_data = Object.values(setup.data.existing.health)[0] as any

    // LOAD
    const health_ref01_ent = client.Health()
    const health_ref01_match_dt0: any = {}
    const health_ref01_data_dt0 = (await health_ref01_ent.load(health_ref01_match_dt0)).data()
    assert(null != health_ref01_data_dt0)


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
      '../../../../.sdk/test/entity/health/HealthTestData.json')

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
    ['health01','health02','health03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'AUTOPAY24HR_TEST_HEALTH_ENTID': idmap,
    'AUTOPAY24HR_TEST_LIVE': 'FALSE',
    'AUTOPAY24HR_TEST_EXPLAIN': 'FALSE',
  })

  idmap = env['AUTOPAY24HR_TEST_HEALTH_ENTID']

  const live = 'TRUE' === env.AUTOPAY24HR_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['AUTOPAY24HR_TEST_HEALTH_ENTID']
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
  
