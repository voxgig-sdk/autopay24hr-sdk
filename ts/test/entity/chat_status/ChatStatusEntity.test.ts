

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


describe('ChatStatusEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when AUTOPAY24HR_TEST_LIVE=TRUE.
  afterEach(liveDelay('AUTOPAY24HR_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = Autopay24hrSDK.test()
    const ent = testsdk.ChatStatus()
    assert(null != ent)
  })


  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = Autopay24hrSDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.ChatStatus().load({"aiConfigured":"x"} as any),
      (err: any) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    const live = 'TRUE' === process.env.AUTOPAY24HR_TEST_LIVE
    for (const op of ['load']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'chat_status.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"aiConfigured":{"a":true,"h":"Ai Configured","n":"aiConfigured","r":true,"sh":"Whether an AI model answers chat questions.","t":"`$BOOLEAN`","key$":"aiConfigured","index$":0},"fallbackAvailable":{"a":true,"h":"Fallback Available","n":"fallbackAvailable","r":true,"sh":"Whether curated fallback answers are available.","t":"`$BOOLEAN`","key$":"fallbackAvailable","index$":1},"model":{"a":true,"h":"Model","n":"model","r":false,"sh":"AI model in use, e.g.","t":"`$STRING`","key$":"model","index$":2}},"name":"chat_status","op":{"load":{"input":"data","name":"load","points":[{"a":true,"co":{"id":"GET /api/v1/chat/status","source":"openapi3","version":2},"g":{},"k":"http","m":"GET","o":"/api/v1/chat/status","q":{},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"api"},{"lit":"v1"},{"lit":"chat"},{"lit":"status"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"load"}},"relations":{"ancestors":[]},"key$":"chat_status","name__orig":"chat_status","Name":"ChatStatus","name_":"chat_status","name-":"chat-status","NAME":"CHAT_STATUS","index$":0}, {"active":true,"entity":"chat_status","key$":"BasicChatStatusFlow","kind":"basic","name":"BasicChatStatusFlow","param":{},"step":[{"a":true,"d":{},"i":{"ref":"chat_status_ref01","srcdatavar":"chat_status_ref01_data","suffix":"_dt0"},"m":{},"o":"load","s":[],"v":[{"apply":"TextFieldMark","def":{"mark":"Mark01-chat_status_ref01"}}],"index$":0}]}, 'ChatStatus', {"GET /api/v1/chat/status":{"protocol":"http","parameters":[]}}, { strict: LIVE_STRICT, t })
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select

    let chat_status_ref01_data = Object.values(setup.data.existing.chat_status)[0] as any

    // LOAD
    const chat_status_ref01_ent = client.ChatStatus()
    const chat_status_ref01_match_dt0: any = {}
    const chat_status_ref01_data_dt0 = (await chat_status_ref01_ent.load(chat_status_ref01_match_dt0)).data()
    assert(null != chat_status_ref01_data_dt0)


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
      '../../../../.sdk/test/entity/chat_status/ChatStatusTestData.json')

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
    ['chat_status01','chat_status02','chat_status03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'AUTOPAY24HR_TEST_CHAT_STATUS_ENTID': idmap,
    'AUTOPAY24HR_TEST_LIVE': 'FALSE',
    'AUTOPAY24HR_TEST_EXPLAIN': 'FALSE',
  })

  idmap = env['AUTOPAY24HR_TEST_CHAT_STATUS_ENTID']

  const live = 'TRUE' === env.AUTOPAY24HR_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['AUTOPAY24HR_TEST_CHAT_STATUS_ENTID']
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
  
