<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    public function index() {
        $reservations = Reservation::with(['car', 'user'])->get();
        return response()->($reservations);
    }

    public function createReservation(Request $request) {
        $data = $request->validate([
            'car_id' => 'required|exists:cars,id',
            'user_id' => 'nullable|exists:users,id',
            'guest_email' => 'nullable|email',
            'status' => 'required|in:pending,soft_reserve,firm_reserve,cancelled',
            'reserved_from' => 'required|date',
            'reserved_till' => 'required|date|after_or_equal:reserved_from',
        ]);

        //check if car is already booked
        $overlap = Reservation::where('car_id', $data['car_id'])
            ->where('status', '!=', 'cancelled')
            ->where(function($query) use ($data) {
            $query->whereBetween('reserved_from', [$data['reserved_from'], $data['reserved_till']])
                  ->orWhereBetween('reserved_till', [$data['reserved_from'], $data['reserved_till']])
                  ->orWhere(function($q) use ($data) {
                      $q->where('reserved_from', '<=', $data['reserved_from'])
                        ->where('reserved_till', '>=', $data['reserved_till']);
                  });
        })
        ->exists();

        if ($overlap) {
            return response()->json(['message' => 'Car is already reserved for these dates'], 422);
        }

        $reservation = Reservation::create($data);

        return response()->json([
            'message' => 'Reservation created successfully!',
            'reservation' => $reservation
        ], 201);
    }

    public function updateReservationDates(Request $request, Reservation $reservation) {
        $data = $request->validate([
            'reserved_from' => 'required|date',
            'reserved_till' => 'required|date|after_or_equal:reserved_from',
        ]);

        $overlap = Reservation::where('car_id', $reservation->car_id)
            ->where('id', '!=', $reservation->id)
            ->where('status', '!=', 'cancelled')
            ->where(function($query) use ($data) {
                $query->whereBetween('reserved_from', [$data['reserved_from'], $data['reserved_till']])
                    ->orWhereBetween('reserved_till', [$data['reserved_from'], $data['reserved_till']])
                    ->orWhere(function($q) use ($data) {
                        $q->where('reserved_from', '<=', $data['reserved_from'])
                            ->where('reserved_till', '>=', $data['reserved_till']);
                    });
            })
            ->exists();

        if ($overlap) {
            return response()->json(['message' => 'Car is already reserved for these dates'], 422);
        }

        $reservation->update($data);

        return response()->json([
            'message' => 'Reservation dates updated successfully!',
            'reservation' => $reservation
        ]);
    }

    public function reassignReservation(Request $request, Reservation $reservation)
    {
        $data = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'guest_email' => 'nullable|email',
        ]);

        $reservation->update($data);

        return response()->json([
            'message' => 'Reservation reassigned successfully!',
            'reservation' => $reservation
        ]);
    }

    public function cancelReservation(Reservation $reservation)
    {
        $reservation->update(['status' => 'cancelled']);

        return response()->json([
            'message' => 'Reservation cancelled successfully!',
            'reservation' => $reservation
        ]);
    }
}
