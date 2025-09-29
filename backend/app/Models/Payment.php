<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'reservation_id',
        'payment_method_id',
        'amount',
        'currency',
        'status',
        'transaction_reference'
    ];

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }

    public function paymentMethod()
    {
        return $this->belongsTo(PaymentMethod::class);
    }
}
