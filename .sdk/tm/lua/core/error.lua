-- Autopay24hr SDK error

local json = require("dkjson")

local Autopay24hrError = {}
Autopay24hrError.__index = Autopay24hrError

-- Reachable for a debugger, absent from the table itself: the context holds
-- the live spec and options, and an error is what gets dumped or encoded.
local CONTEXT = setmetatable({}, { __mode = "k" })


function Autopay24hrError.new(code, msg, ctx)
  local self = setmetatable({}, Autopay24hrError)
  self.is_sdk_error = true
  self.sdk = "Autopay24hr"
  self.code = code or ""
  self.msg = msg or ""
  self.result = nil
  self.spec = nil
  self.status = -1
  CONTEXT[self] = ctx
  return self
end


function Autopay24hrError:context()
  return CONTEXT[self]
end


function Autopay24hrError:error()
  return self.msg
end


function Autopay24hrError:not_found()
  return 404 == self.status
end


-- What make_error attached is already cleaned; the context is not part of
-- the record.
function Autopay24hrError:to_table()
  return {
    sdk = self.sdk,
    code = self.code,
    msg = self.msg,
    status = self.status,
    result = self.result,
    spec = self.spec,
  }
end


function Autopay24hrError:to_json()
  return json.encode(self:to_table())
end


function Autopay24hrError:__tostring()
  return self.msg
end


function Autopay24hrError.__tojson(self)
  return self:to_json()
end


return Autopay24hrError
