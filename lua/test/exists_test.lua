-- Autopay24hr SDK exists test

local sdk = require("autopay24hr_sdk")

describe("Autopay24hrSDK", function()
  it("should create test SDK", function()
    local testsdk = sdk.test(nil, nil)
    assert.is_not_nil(testsdk)
  end)
end)
