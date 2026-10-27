<?php
declare(strict_types=1);

// Autopay24hr SDK utility: feature_hook

class Autopay24hrFeatureHook
{
    public static function call(Autopay24hrContext $ctx, string $name): void
    {
        if (!$ctx->client) {
            return;
        }
        $features = $ctx->client->features ?? null;
        if (!$features) {
            return;
        }
        foreach ($features as $f) {
            if (method_exists($f, $name)) {
                $f->$name($ctx);
            }
        }
    }
}
