<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CarPhoto extends Model
{
    protected $fillable = [
        'car_id',
        'photo_url'
    ];

    public function car()
    {
        return $this->belongsTo(Car::class);
    }
}
