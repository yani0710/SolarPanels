<?php

use Illuminate\Support\Facades\Route;

Route::get('/', fn () => response()->json([
    'name' => 'SolarWise BG',
    'message' => 'Use the /api routes for the application backend.',
]));
