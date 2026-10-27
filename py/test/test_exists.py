# Autopay24hr SDK exists test

import pytest
from autopay24hr_sdk import Autopay24hrSDK


class TestExists:

    def test_should_create_test_sdk(self):
        testsdk = Autopay24hrSDK.test(None, None)
        assert testsdk is not None
