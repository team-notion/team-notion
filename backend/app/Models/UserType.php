<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserType extends Model
{
    protected $fillable = ['type'];

    public const CUSTOMER = 1;
    public const BUSINESS_OWNER = 2;

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
