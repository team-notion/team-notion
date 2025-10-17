<?php

use App\Models\Car;
use App\Policies\CarPolicy;

class AuthServiceProvider
{
    protected $policies = [
        Car::class => CarPolicy::class,
    ];
}
