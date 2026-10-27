# Autopay24hr SDK utility: make_context
require_relative '../core/context'
module Autopay24hrUtilities
  MakeContext = ->(ctxmap, basectx) {
    Autopay24hrContext.new(ctxmap, basectx)
  }
end
