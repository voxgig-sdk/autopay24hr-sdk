
import { test, describe } from 'node:test'
import { equal } from 'node:assert'


import { Autopay24hrSDK } from '..'


describe('exists', async () => {

  test('test-mode', () => {
    const testsdk = Autopay24hrSDK.test()
    equal(testsdk instanceof Autopay24hrSDK, true,
      'Autopay24hrSDK.test() must return a client synchronously')
  })

})
