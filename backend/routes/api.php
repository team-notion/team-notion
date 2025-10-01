<?php

use App\Http\Controllers\CarController;
use Illuminate\Support\Facades\Route;

Route::get('/cars', [CarController::class, 'index']);
Route::get('/cars/{car}', [CarController::class, 'show']);


// Authenticated routes, to be added under the auth group, while merging
Route::get('/my-cars', [CarController::class, 'index']);
Route::post('/cars', [CarController::class, 'store']);
Route::put('/cars/{car}', [CarController::class, 'update']);
Route::delete('/cars/{car}', [CarController::class, 'destroy']);
Route::delete('/cars/{car}/photo', [CarController::class, 'removePhoto']);
