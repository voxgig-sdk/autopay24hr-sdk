<?php
declare(strict_types=1);

// Autopay24hr SDK exists test

require_once __DIR__ . '/../autopay24hr_sdk.php';

use PHPUnit\Framework\TestCase;

class ExistsTest extends TestCase
{
    public function test_create_test_sdk(): void
    {
        $testsdk = Autopay24hrSDK::test(null, null);
        $this->assertNotNull($testsdk);
    }
}
