# Autopay24hr SDK utility: prepare_body
require_relative 'media'
module Autopay24hrUtilities
  PrepareBody = ->(ctx) {
    return nil unless ctx.op.input == "data"
    return Autopay24hrUtilities.raw_body(ctx.reqdata) if Autopay24hrUtilities.raw_request?(ctx.point)
    ctx.utility.transform_request.call(ctx)
  }
end
