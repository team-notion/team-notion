<?php

use App\Http\Controllers\CustomerReservationController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CarController;
use App\Http\Controllers\AnalyticsController;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register/customer', [AuthController::class, 'registerCustomer'])->name('api.register.customer');
Route::post('/register/business', [AuthController::class, 'registerBusinessOwner']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/cars', [CarController::class, 'publicIndex']);
Route::get('/cars/{car}', [CarController::class, 'show']);
Route::post('/customer/reservations/guest', [CustomerReservationController::class, 'softReserve']);

Route::get('/ping', fn() => response()->json(['message' => 'API is working']));

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/email/verify', function (Request $request) {
        $user = $request->user();
        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified.'], 200);
        }
        return response()->json([
            'message' => 'Email not verified. You can request a verification link using POST /email/verification-notification'
        ], 200);
    })->name('verification.notice');

    Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
        $user = User::findOrFail($request->route('id'));
        if (!hash_equals((string) $request->route('hash'), sha1($user->getEmailForVerification()))) {
            return response()->json(['message' => 'Invalid or expired verification link.'], 400);
        }
        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified.'], 200);
        }
        $user->markEmailAsVerified();
        return response()->json(['message' => 'Email verified successfully! You can now log in.'], 200);
    })->middleware(['signed'])->name('verification.verify');

    Route::post('/email/verification-notification', function (Request $request) {
        $request->validate(['email' => 'required|email|exists:users,email']);
        $user = User::where('email', $request->email)->first();
        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified.'], 200);
        }
        $user->sendEmailVerificationNotification();
        event(new Registered($user));
        return response()->json(['message' => 'Verification link sent successfully!'], 200);
    })->middleware('throttle:6,1')->name('verification.send');

    Route::prefix('owner')->middleware('verified')->group(function () {
        Route::get('/my-cars', [CarController::class, 'index']);
        Route::post('/cars', [CarController::class, 'store']);
        Route::put('/cars/{car}', [CarController::class, 'update']);
        Route::delete('/cars/{car}', [CarController::class, 'destroy']);
        Route::delete('/cars/{car}/photo', [CarController::class, 'removePhoto']);

        Route::get('/reservations', [ReservationController::class, 'index']);
        Route::post('/reservations', [ReservationController::class, 'createReservation']);
        Route::put('/reservations/{reservation}/dates', [ReservationController::class, 'updateReservationDates']);
        Route::put('/reservations/{reservation}/reassign', [ReservationController::class, 'reassignReservation']);
        Route::put('/reservations/{reservation}/cancel', [ReservationController::class, 'cancelReservation']);
    });

    Route::prefix('customer')->middleware('verified')->group(function () {
        Route::post('/reservations', [CustomerReservationController::class, 'firmReserve']);
        Route::put('/reservations/{reservation}', [CustomerReservationController::class, 'modifyReservation']);
        Route::put('/reservations/{reservation}/cancel', [CustomerReservationController::class, 'cancelReservation']);
    });

    Route::prefix('analytics')->group(function () {
        Route::get('/overview', [AnalyticsController::class, 'overview']);
    });
});
