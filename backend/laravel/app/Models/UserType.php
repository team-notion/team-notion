<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserType extends Model
{
    protected $fillable = ['type'];

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
