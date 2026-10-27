# Autopay24hr SDK utility: make_error

from __future__ import annotations
from autopay24hr_sdk.core.operation import Autopay24hrOperation
from autopay24hr_sdk.core.result import Autopay24hrResult
from autopay24hr_sdk.core.control import Autopay24hrControl
from autopay24hr_sdk.core.error import Autopay24hrError


def make_error_util(ctx, err):
    if ctx is None:
        from autopay24hr_sdk.core.context import Autopay24hrContext
        ctx = Autopay24hrContext({}, None)

    op = ctx.op
    if op is None:
        op = Autopay24hrOperation({})
    opname = op.name
    if opname == "" or opname == "_":
        opname = "unknown operation"

    result = ctx.result
    if result is None:
        result = Autopay24hrResult({})
    result.ok = False

    if err is None:
        err = result.err
    if err is None:
        err = ctx.make_error("unknown", "unknown error")

    errmsg = ""
    if isinstance(err, Autopay24hrError):
        errmsg = err.msg
    elif hasattr(err, "msg") and err.msg is not None:
        errmsg = err.msg
    elif isinstance(err, str):
        errmsg = err
    else:
        errmsg = str(err)

    msg = "Autopay24hrSDK: " + opname + ": " + errmsg
    msg = ctx.utility.clean(ctx, msg)

    result.err = None

    spec = ctx.spec

    sdk_err = Autopay24hrError(
        err.code if isinstance(err, Autopay24hrError) else "", msg, ctx)

    # The context stays reachable for a debugger (a slot on the error), and
    # the error itself is cleaned in place; result and spec are cleaned
    # COPIES, so masking them cannot mask the pipeline's own objects.
    ctx.utility.clean(ctx, sdk_err)
    sdk_err.result = ctx.utility.clean(ctx, result)
    sdk_err.spec = ctx.utility.clean(ctx, spec)

    if ctx.ctrl.explain is not None:
        ctx.ctrl.explain["err"] = {"message": msg}

    # Promote the HTTP status to the top level, so a consumer can branch on
    # `err.status` / `err.not_found` instead of reaching into `err.result`.
    sdk_err.status = -1 if result.status is None else result.status

    ctx.ctrl.err = sdk_err

    # Fire PreUnexpected so observability features (metrics, telemetry, audit,
    # debug) close/record error paths that never reach PreDone (e.g. a PrePoint
    # rbac short-circuit). Fires after ctx.ctrl.err is set so hooks can read the
    # error; features guard against double-recording when PreDone already fired.
    if getattr(ctx, "utility", None) is not None and \
            callable(getattr(ctx.utility, "feature_hook", None)):
        ctx.unexpected_fired = True
        ctx.utility.feature_hook(ctx, "PreUnexpected")

    if ctx.ctrl.throw_err is False:
        return result.resdata

    raise sdk_err
