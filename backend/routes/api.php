<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EmailController;
use App\Http\Controllers\GmailController;

Route::get('/gmail/connect', [GmailController::class, 'connect']);

Route::get('/gmail/callback', [GmailController::class, 'callback']);

Route::post('/sync', [EmailController::class, 'syncEmails']);

Route::get('/emails', [EmailController::class, 'index']);

Route::post('/reply', [EmailController::class, 'reply']);

Route::get('/gmail/status', [EmailController::class, 'getStatus']);

Route::post('/gmail/disconnect', [EmailController::class, 'disconnect']);