# Autopay24hr SDK feature factory

require_relative 'feature/base_feature'
require_relative 'feature/ratelimit_feature'
require_relative 'feature/retry_feature'
require_relative 'feature/test_feature'
require_relative 'feature/timeout_feature'


module Autopay24hrFeatures
  def self.make_feature(name)
    case name
    when "base"
      Autopay24hrBaseFeature.new
    when "ratelimit"
      Autopay24hrRatelimitFeature.new
    when "retry"
      Autopay24hrRetryFeature.new
    when "test"
      Autopay24hrTestFeature.new
    when "timeout"
      Autopay24hrTimeoutFeature.new
    else
      Autopay24hrBaseFeature.new
    end
  end
end
