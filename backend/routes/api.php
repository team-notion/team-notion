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

Route::get('/cars', [CarController::class, 'publicIndex']);
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

Route::middleware('auth:sanctum')->get('/email/verify', function (Request $request) {
    $user = $request->user();

    if ($user->hasVerifiedEmail()) {
        return response()->json(['message' => 'Email already verified.'], 200);
    }

    return response()->json([
        'message' => 'Email not verified. You can request a verification link using POST /email/verification-notification'
    ], 200);
})->name('verification.notice');

// Verify email via signed URL
Route::middleware(['auth:sanctum', 'signed'])->get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $user = $request->user();

    if ($user->hasVerifiedEmail()) {
        return response()->json(['message' => 'Email already verified.'], 200);
    }

    $request->fulfill();

    return response()->json(['message' => 'Email verified successfully!'], 200);
})->name('verification.verify');

// Send new verification link
Route::middleware(['auth:sanctum', 'throttle:6,1'])->post('/email/verification-notification', function (Request $request) {
    $user = $request->user();

    if ($user->hasVerifiedEmail()) {
        return response()->json(['message' => 'Email already verified.'], 200);
    }

    $user->sendEmailVerificationNotification();

    return response()->json(['message' => 'Verification link sent successfully!'], 200);
})->name('verification.send');

Route::prefix('customer')->group(function () {
    Route::middleware('auth:sanctum')->post('/reservations', [CustomerReservationController::class, 'firmReserve']);
    Route::post('/reservations/guest', [CustomerReservationController::class, 'softReserve']);
    Route::middleware('auth:sanctum')->put('/reservations/{reservation}', [CustomerReservationController::class, 'modifyReservation']);
    Route::middleware('auth:sanctum')->put('/reservations/{reservation}/cancel', [CustomerReservationController::class, 'cancelReservation']);
});
