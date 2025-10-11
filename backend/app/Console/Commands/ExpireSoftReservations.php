<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Reservation;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;

class ExpireSoftReservations extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'reservations:expire-soft';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Automatically cancel soft reservations after 24 hours or after expires_at';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        $now = Carbon::now();

        $expiredReservations = Reservation::where('status', 'soft_reserve')
            ->whereNotNull('expires_at')
            ->where('expires_at', '<=', $now)
            ->get();

        if ($expiredReservations->isEmpty()) {
            $this->info('No soft reservations to expire.');
            return;
        }

        foreach ($expiredReservations as $reservation) {
            $reservation->update(['status' => 'cancelled']);

            // Notify guest
            if ($reservation->guest_email) {
                Mail::raw("Your soft reservation for Car ID {$reservation->car_id} has expired and been cancelled.", function ($message) use ($reservation) {
                    $message->to($reservation->guest_email)
                        ->subject('Soft reservation expired');
                });
            }

            $this->info("Cancelled soft reservation ID {$reservation->id}");
        }

        $this->info('Expired soft reservations processed successfully.');
    }
}
