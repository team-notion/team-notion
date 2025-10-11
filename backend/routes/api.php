<?php

use App\Http\Controllers\CustomerReservationController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CarController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register/customer', [AuthController::class, 'registerCustomer'])->name('api.register.customer');
Route::post('/register/business', [AuthController::class, 'registerBusinessOwner']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/cars', [CarController::class, 'publicIndex']);
Route::get('/cars/{car}', [CarController::class, 'show']);

Route::get('/ping', function () {
    return response()->json(['message' => 'API is working']);
});

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {
    // Profile
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Car management (only business owners can add/edit/delete)
    Route::get('/my-cars', [CarController::class, 'index']);
    Route::post('/cars', [CarController::class, 'store']);
    Route::put('/cars/{car}', [CarController::class, 'update']);
    Route::delete('/cars/{car}', [CarController::class, 'destroy']);
    Route::delete('/cars/{car}/photo', [CarController::class, 'removePhoto']);

    // Email verification notice
    Route::get('/email/verify', function (Request $request) {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified.'], 200);
        }

        return response()->json([
            'message' => 'Email not verified. You can request a verification link using POST /email/verification-notification'
        ], 200);
    })->name('verification.notice');

    // Send verification link
    Route::post('/email/verification-notification', function (Request $request) {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified.'], 200);
        }

        $user->sendEmailVerificationNotification();

        return response()->json(['message' => 'Verification link sent successfully!'], 200);
    })->middleware('throttle:6,1')->name('verification.send');

    // Business owner reservation management
    Route::prefix('owner')->group(function () {
        Route::get('/reservations', [ReservationController::class, 'index']);
        Route::post('/reservations', [ReservationController::class, 'createReservation']);
        Route::put('/reservations/{reservation}/dates', [ReservationController::class, 'updateReservationDates']);
        Route::put('/reservations/{reservation}/reassign', [ReservationController::class, 'reassignReservation']);
        Route::put('/reservations/{reservation}/cancel', [ReservationController::class, 'cancelReservation']);
    });

    // Customer reservation routes
    Route::prefix('customer')->group(function () {
        Route::post('/reservations', [CustomerReservationController::class, 'firmReserve']);
        Route::put('/reservations/{reservation}', [CustomerReservationController::class, 'modifyReservation']);
        Route::put('/reservations/{reservation}/cancel', [CustomerReservationController::class, 'cancelReservation']);
    });
});

// Guest routes for soft reservation
Route::post('/customer/reservations/guest', [CustomerReservationController::class, 'softReserve']);

// Verify email via signed URL (requires auth token + signed URL)
Route::middleware(['auth:sanctum', 'signed'])->get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $user = $request->user();

    if ($user->hasVerifiedEmail()) {
        return response()->json(['message' => 'Email already verified.'], 200);
    }

    $request->fulfill();

    return response()->json(['message' => 'Email verified successfully!'], 200);
})->name('verification.verify');
