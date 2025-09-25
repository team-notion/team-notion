<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Car extends Model
{
    protected $fillable = [
        'owner_id',
        'make',
        'model',
        'type',
        'price_per_day',
        'availability_start',
        'availability_end',
        'rules'
    ];

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function photos()
    {
        return $this->hasMany(CarPhoto::class);
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }
}
