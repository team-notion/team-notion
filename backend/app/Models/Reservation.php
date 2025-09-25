<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    protected $fillable = [
        'car_id',
        'user_id',
        'guest_email',
        'status',
        'reservation_from',
        'reservation_till'
    ];

    public function car()
    {
        return $this->belongsTo(Car::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }
}
