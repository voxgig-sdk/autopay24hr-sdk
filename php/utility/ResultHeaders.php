<?php
declare(strict_types=1);

// Autopay24hr SDK utility: result_headers

class Autopay24hrResultHeaders
{
    public static function call(Autopay24hrContext $ctx): ?Autopay24hrResult
    {
        $response = $ctx->response;
        $result = $ctx->result;
        if ($result) {
            if ($response && is_array($response->headers)) {
                $result->headers = $response->headers;
            } else {
                $result->headers = [];
            }
        }
        return $result;
    }
}
