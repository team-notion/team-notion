<?php

use App\Http\Controllers\CustomerReservationController;
use App\Http\Controllers\ReservationController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use App\Http\Controllers\CarController;
// use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

Route::post('/register/customer', [AuthController::class, 'registerCustomer'])->name('api.register.customer');
Route::post('/register/business', [AuthController::class, 'registerBusinessOwner']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/cars', [CarController::class, 'index']);
Route::get('/cars/{car}', [CarController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/my-cars', [CarController::class, 'index']);
    Route::post('/cars', [CarController::class, 'store']);
    Route::put('/cars/{car}', [CarController::class, 'update']);
    Route::delete('/cars/{car}', [CarController::class, 'destroy']);
    Route::delete('/cars/{car}/photo', [CarController::class, 'removePhoto']);

    Route::prefix('owner')->group(function () {
        Route::get('/reservations', [ReservationController::class, 'index']);
        Route::post('/reservations', [ReservationController::class, 'createReservation']);
        Route::put('/reservations/{reservation}/dates', [ReservationController::class, 'updateReservationDates']);
        Route::put('/reservations/{reservation}/reassign', [ReservationController::class, 'reassignReservation']);
        Route::put('/reservations/{reservation}/cancel', [ReservationController::class, 'cancelReservation']);
    });
});

Route::get('/ping', function () {
    return response()->json(['message' => 'API is working']);
});

Route::get('/email/verify', function () {
    return view('auth.verify-email');
})->middleware('auth')->name('verification.notice');

Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill();

    return redirect('/home');
})->middleware(['auth', 'signed'])->name('verification.verify');

Route::post('/email/verification-notification', function (Request $request) {
    $request->user()->sendEmailVerificationNotification();

    return back()->with('message', 'Verification link sent!');
})->middleware(['auth', 'throttle:6,1'])->name('verification.send');

Route::prefix('customer')->group(function () {
    Route::middleware('auth:sanctum')->post('/reservations', [CustomerReservationController::class, 'firmReserve']);
    Route::post('/reservations/guest', [CustomerReservationController::class, 'softReserve']);
    Route::middleware('auth:sanctum')->put('/reservations/{reservation}', [CustomerReservationController::class, 'modifyReservation']);
    Route::middleware('auth:sanctum')->put('/reservations/{reservation}/cancel', [CustomerReservationController::class, 'cancelReservation']);
});
