<?php
declare(strict_types=1);

// Autopay24hr SDK utility: prepare_path

class Autopay24hrPreparePath
{
    public static function call(Autopay24hrContext $ctx): string
    {
        $point = $ctx->point;
        $parts = [];
        if ($point) {
            $p = \Voxgig\Struct\Struct::getprop($point, 'parts');
            if (is_array($p)) {
                $parts = $p;
            }
        }
        return \Voxgig\Struct\Struct::join($parts, '/', true);
    }
}
