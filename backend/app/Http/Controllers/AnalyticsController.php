<?php

namespace App\Http\Controllers;

use App\Models\Car;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    public function overview(Request $request)
    {
        // Optional date filters
        $from = $request->query('from') ? Carbon::parse($request->query('from')) : null;
        $till = $request->query('till') ? Carbon::parse($request->query('till')) : null;

        // Total Fleets
        $totalFleets = Car::count();

        // Total Bookings (firm_reserve only)
        $totalBookingsQuery = Reservation::where('status', 'firm_reserve');
        if ($from) $totalBookingsQuery->where('reserved_from', '>=', $from);
        if ($till) $totalBookingsQuery->where('reserved_till', '<=', $till);
        $totalBookings = $totalBookingsQuery->count();

        // Active bookings (today)
        $today = Carbon::today();
        $activeBookings = Reservation::where('status', 'firm_reserve')
            ->where('reserved_from', '<=', $today)
            ->where('reserved_till', '>=', $today)
            ->count();

        // Revenue in time range (sum of payments)
        $revenueQuery = Reservation::where('status', 'firm_reserve')->with('payment');
        if ($from) $revenueQuery->where('reserved_from', '>=', $from);
        if ($till) $revenueQuery->where('reserved_till', '<=', $till);

        $revenue = $revenueQuery->get()->sum(fn($r) => $r->payment?->amount ?? 0);

        // Utilization rate (cars booked ÷ total cars)
        $utilizationRate = $totalFleets > 0 ? ($activeBookings / $totalFleets) * 100 : 0;

        // Most rented car
        $mostRentedCar = Reservation::select('car_id', DB::raw('COUNT(*) as bookings_count'))
            ->where('status', 'firm_reserve')
            ->groupBy('car_id')
            ->orderByDesc('bookings_count')
            ->with('car')
            ->first();

        return response()->json([
            'total_fleets' => $totalFleets,
            'total_bookings' => $totalBookings,
            'active_bookings' => $activeBookings,
            'revenue' => $revenue,
            'utilization_rate' => round($utilizationRate, 2) . '%',
            'most_rented_car' => $mostRentedCar ? [
                'car_id' => $mostRentedCar->car_id,
                'bookings_count' => $mostRentedCar->bookings_count,
                'details' => $mostRentedCar->car,
            ] : null,
        ]);
    }
}
