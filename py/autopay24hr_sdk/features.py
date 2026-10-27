# Autopay24hr SDK feature factory

from autopay24hr_sdk.feature.base_feature import Autopay24hrBaseFeature
from autopay24hr_sdk.feature.ratelimit_feature import Autopay24hrRatelimitFeature
from autopay24hr_sdk.feature.retry_feature import Autopay24hrRetryFeature
from autopay24hr_sdk.feature.test_feature import Autopay24hrTestFeature
from autopay24hr_sdk.feature.timeout_feature import Autopay24hrTimeoutFeature


_FEATURES = {
    "base": lambda: Autopay24hrBaseFeature(),
    "ratelimit": lambda: Autopay24hrRatelimitFeature(),
    "retry": lambda: Autopay24hrRetryFeature(),
    "test": lambda: Autopay24hrTestFeature(),
    "timeout": lambda: Autopay24hrTimeoutFeature(),
}


def _make_feature(name):
    factory = _FEATURES.get(name)
    if factory is not None:
        return factory()
    return _FEATURES["base"]()


# True when this SDK was generated with the named feature class - the
# constructor's tolerance for extend-carried features reads this (an
# active name with no generated class must not become a BaseFeature
# stray when an extend instance carries it).
def _has_feature(name):
    return name in _FEATURES
