<?php
declare(strict_types=1);

// Autopay24hr SDK utility: make_context

require_once __DIR__ . '/../core/Context.php';

class Autopay24hrMakeContext
{
    public static function call(array $ctxmap, ?Autopay24hrContext $basectx): Autopay24hrContext
    {
        return new Autopay24hrContext($ctxmap, $basectx);
    }
}
