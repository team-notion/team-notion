<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    protected $fillable = [
        'owner_id',
        'report_type',
        'generated_at',
        'data'
    ];

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }
}
