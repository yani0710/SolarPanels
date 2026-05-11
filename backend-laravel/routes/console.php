<?php

use Illuminate\Support\Facades\Artisan;

Artisan::command('solarwise:ping', function (): void {
    $this->comment('SolarWise Laravel scaffold is ready.');
})->purpose('Print a readiness message for the SolarWise app');
