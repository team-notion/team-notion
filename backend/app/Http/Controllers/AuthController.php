<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserType;
use Illuminate\Auth\Events\Registered;
use Illuminate\Container\Attributes\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function registerCustomer(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|string|unique:users,phone',
            'password' => 'required|string|min:6',
            'username' => 'required|string|max:255|unique:users,username',
        ]);

        $user = User::create([
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'username' => $request->username,
            'user_type_id' => UserType::CUSTOMER,
        ]);

        // try {
        //     event(new Registered($user));
        // } catch (\Exception $e) {
        //     Log::error('Failed to send verification email: ' . $e->getMessage());
        // }

        return response()->json([
            'message' => 'Customer registered successfully.',
            'user' => $user->load('userType'),
        ], 201);
    }

    public function registerBusinessOwner(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|string|unique:users,phone',
            'password' => 'required|string|min:6',
            'business_name' => 'required|string|max:255|unique:users,business_name',
        ]);

        $user = User::create([
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'business_name' => $request->business_name,
            'user_type_id' => UserType::BUSINESS_OWNER,
        ]);

        // try {
        //     event(new Registered($user));
        // } catch (\Exception $e) {
        //     Log::error('Failed to send verification email: ' . $e->getMessage());
        // }

        return response()->json([
            'message' => 'Business owner registered successfully.',
            'user' => $user->load('userType'),
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'login' => 'required',
            'password' => 'required',
        ]);

        $loginType = filter_var($request->login, FILTER_VALIDATE_EMAIL) ? 'email' : 'phone';
        $user = User::where($loginType, $request->login)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'login' => ['Invalid credentials.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'phone' => $user->phone,
                'username' => $user->username,
                'business_name' => $user->business_name,
                'user_type' => $user->user_type,
            ],
            'token' => $token,
        ], 200);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }
}
