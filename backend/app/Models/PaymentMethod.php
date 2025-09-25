<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentMethod extends Model
{
    protected $fillable = [
        'user_id',
        'provider',
        'account_reference',
        'is_default'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
