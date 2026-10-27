# Autopay24hr SDK exists test

require "minitest/autorun"
require_relative "../Autopay24hr_sdk"

class ExistsTest < Minitest::Test
  def test_create_test_sdk
    testsdk = Autopay24hrSDK.test(nil, nil)
    assert !testsdk.nil?
  end
end
