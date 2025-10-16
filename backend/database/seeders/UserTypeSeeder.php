<?php

namespace Database\Seeders;

use App\Models\UserType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        UserType::updateOrCreate(['id' => 1], ['type' => 'customer']);
        UserType::updateOrCreate(['id' => 1], ['type' => 'business_owner']);
    }
}
