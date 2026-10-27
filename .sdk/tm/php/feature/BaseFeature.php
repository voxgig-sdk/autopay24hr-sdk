<?php
declare(strict_types=1);

// Autopay24hr SDK base feature

class Autopay24hrBaseFeature
{
    public string $version;
    public string $name;
    public bool $active;

    // Positions this feature when added via the client `extend` option:
    // "__before__" / "__after__" / "__replace__" name an already-added
    // feature (mirrors the ts feature `_options`). Declared so setting it
    // on an extension instance avoids the dynamic-property deprecation.
    public ?array $_options = null;

    public function __construct()
    {
        $this->version = '0.0.1';
        $this->name = 'base';
        $this->active = true;
    }

    public function get_version(): string { return $this->version; }
    public function get_name(): string { return $this->name; }
    public function get_active(): bool { return $this->active; }

    public function init(Autopay24hrContext $ctx, array $options): void {}
    public function PostConstruct(Autopay24hrContext $ctx): void {}
    public function PostConstructEntity(Autopay24hrContext $ctx): void {}
    public function SetData(Autopay24hrContext $ctx): void {}
    public function GetData(Autopay24hrContext $ctx): void {}
    public function GetMatch(Autopay24hrContext $ctx): void {}
    public function SetMatch(Autopay24hrContext $ctx): void {}
    public function PrePoint(Autopay24hrContext $ctx): void {}
    public function PreSpec(Autopay24hrContext $ctx): void {}
    public function PreRequest(Autopay24hrContext $ctx): void {}
    public function PreResponse(Autopay24hrContext $ctx): void {}
    public function PreResult(Autopay24hrContext $ctx): void {}
    public function PreDone(Autopay24hrContext $ctx): void {}
    public function PreUnexpected(Autopay24hrContext $ctx): void {}
}
