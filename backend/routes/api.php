<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;

Route::post('/register/customer', [AuthController::class, 'registerCustomer']);
Route::post('/register/business', [AuthController::class, 'registerBusinessOwner']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::post('/logout', [AuthController::class, 'logout']);
});
