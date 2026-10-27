<?php
declare(strict_types=1);

// Autopay24hr SDK feature factory

require_once __DIR__ . '/feature/BaseFeature.php';
require_once __DIR__ . '/feature/RatelimitFeature.php';
require_once __DIR__ . '/feature/RetryFeature.php';
require_once __DIR__ . '/feature/TestFeature.php';
require_once __DIR__ . '/feature/TimeoutFeature.php';


class Autopay24hrFeatures
{
    public static function make_feature(string $name)
    {
        switch ($name) {
            case "base":
                return new Autopay24hrBaseFeature();
            case "ratelimit":
                return new Autopay24hrRatelimitFeature();
            case "retry":
                return new Autopay24hrRetryFeature();
            case "test":
                return new Autopay24hrTestFeature();
            case "timeout":
                return new Autopay24hrTimeoutFeature();
            default:
                return new Autopay24hrBaseFeature();
        }
    }

    /**
     * Does a generated feature class back this name? False for a name only
     * an options extend instance can supply (the station adopt path) - the
     * constructor uses this to skip make_feature for such names instead of
     * adding a stray BaseFeature.
     */
    public static function has_feature(string $name): bool
    {
        switch ($name) {
            case "base":
            case "ratelimit":
            case "retry":
            case "test":
            case "timeout":
                return true;
            default:
                return false;
        }
    }
}
