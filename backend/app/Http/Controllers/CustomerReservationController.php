<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class CustomerReservationController extends Controller
{
    use AuthorizesRequests;

    public function firmReserve(Request $request)
    {
        $data = $request->validate([
            'car_id' => 'required|exists:cars,id',
            'reserved_from' => 'required|date',
            'reserved_till' => 'required|date|after_or_equal:reserved_from',
            'payment_method' => 'sometimes|string',
        ]);

        $user = $request->user();

        if (!$this->isCarAvailable($data['car_id'], $data['reserved_from'], $data['reserved_till'])) {
            return response()->json(['message' => 'Car is already reserved for these dates'], 422);
        }

        $data['user_id'] = $user->id;
        $data['status'] = 'firm_reserve';

        $reservation = Reservation::create($data);

        $car = $reservation->car;
        $days = Carbon::parse($data['reserved_from'])->diffInDays(Carbon::parse($data['reserved_till'])) + 1;
        $amount = $car->daily_price * $days * 100;

        try {
            if (!$user->hasStripeId()) {
                $user->createAsStripeCustomer();
            }

            $paymentMethod = $data['payment_method'] ?? $user->defaultPaymentMethod()?->id;

            if (!$paymentMethod) {
                return response()->json(['message' => 'No payment method available'], 422);
            }

            $paymentIntent = $user->charge($amount, $paymentMethod);

            $reservation->payment()->create([
                'payment_method_id' => $paymentMethod,
                'amount' => $amount / 100,
                'currency' => 'USD',
                'status' => 'paid',
                'transaction_reference' => $paymentIntent->id,
            ]);
        } catch (\Exception $e) {
            $reservation->update(['status' => 'cancelled']);
            return response()->json(['message' => 'Payment failed: ' . $e->getMessage()], 500);
        }

        $this->sendNotification($user->email, 'Reservation confirmed', $reservation);

        return response()->json([
            'message' => 'Reservation confirmed and payment successful!',
            'reservation' => $reservation
        ], 201);
    }

    public function softReserve(Request $request)
    {
        $data = $request->validate([
            'car_id' => 'required|exists:cars,id',
            'guest_email' => 'required|email',
            'reserved_from' => 'required|date',
            'reserved_till' => 'required|date|after_or_equal:reserved_from',
        ]);

        if (!$this->isCarAvailable($data['car_id'], $data['reserved_from'], $data['reserved_till'])) {
            return response()->json(['message' => 'Car is already reserved for these dates'], 422);
        }

        $data['status'] = 'soft_reserve';
        $data['expires_at'] = now()->addHours(24);

        $reservation = Reservation::create($data);

        $this->sendNotification($data['guest_email'], 'Soft reservation received', $reservation, 'Your reservation will expire in 24 hours if not claimed by a registered account.');

        return response()->json([
            'message' => 'Soft reservation created! It will expire in 24 hours.',
            'reservation' => $reservation
        ], 201);
    }

    public function modifyReservation(Request $request, Reservation $reservation)
    {
        $this->authorize('update', $reservation);

        $car = $reservation->car;
        $cutoff = Carbon::parse($reservation->reserved_from)->subHours($car->cutoff_hours);

        if (now()->greaterThan($cutoff)) {
            return response()->json(['message' => 'Cannot modify after cutoff time'], 422);
        }

        $data = $request->validate([
            'reserved_from' => 'sometimes|date',
            'reserved_till' => 'sometimes|date|after_or_equal:reserved_from',
        ]);

        if (!$this->isCarAvailable($reservation->car_id, $data['reserved_from'], $data['reserved_till'], $reservation->id)) {
            return response()->json(['message' => 'Car is already reserved for these dates'], 422);
        }

        $reservation->update($data);

        $this->sendNotification($reservation->user?->email ?? $reservation->guest_email, 'Reservation modified', $reservation);

        return response()->json([
            'message' => 'Reservation modified successfully',
            'reservation' => $reservation
        ]);
    }

    public function cancelReservation(Reservation $reservation)
    {
        $this->authorize('update', $reservation);

        $car = $reservation->car;
        $cutoff = Carbon::parse($reservation->reserved_from)->subHours($car->cutoff_hours);

        if (now()->greaterThan($cutoff)) {
            return response()->json(['message' => 'Cannot cancel after cutoff time'], 422);
        }

        $reservation->update(['status' => 'cancelled']);

        $this->sendNotification($reservation->user?->email ?? $reservation->guest_email, 'Reservation cancelled', $reservation);

        return response()->json([
            'message' => 'Reservation cancelled successfully',
            'reservation' => $reservation
        ]);
    }

    protected function sendNotification($email, $subject, $reservation, $additionalMessage = '')
    {
        Mail::raw("Reservation details: ID {$reservation->id}, Car ID {$reservation->car_id}. {$additionalMessage}", function ($message) use ($email, $subject) {
            $message->to($email)
                ->subject($subject);
        });
    }

    private function isCarAvailable(int $carId, string $from, string $till, ?int $excludeReservationId = null): bool
    {
        $query = Reservation::where('car_id', $carId)
            ->where('status', '!=', 'cancelled');

        if ($excludeReservationId) {
            $query->where('id', '!=', $excludeReservationId);
        }

        $overlap = $query->where(function ($q) use ($from, $till) {
            $q->whereBetween('reserved_from', [$from, $till])
                ->orWhereBetween('reserved_till', [$from, $till])
                ->orWhere(function ($q2) use ($from, $till) {
                    $q2->where('reserved_from', '<=', $from)
                        ->where('reserved_till', '>=', $till);
                });
        })->exists();

        return !$overlap;
    }

    public function myBookings(Request $request)
    {
        $user = $request->user();

        $reservations = Reservation::with('car')
            ->where('user_id', $user->id)
            ->orderBy('reserved_from', 'desc')
            ->get();

        return response()->json([
            'message' => 'Your bookings fetched successfully',
            'bookings' => $reservations
        ]);
    }
}
