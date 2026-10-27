# Autopay24hr SDK utility: make_context

from projectname_sdk.core.context import Autopay24hrContext


def make_context_util(ctxmap, basectx):
    return Autopay24hrContext(ctxmap, basectx)
