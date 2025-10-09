<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;


class AuthController extends Controller
{
    // Customer Signup
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
            'password' => $request->password,
            'username' => $request->username,
            'user_type' => 'customer',
        ]);

        return response()->json([
            'message' => 'Customer registered successfully',
            'user' => $user,
        ], 201);
    }

    // Business Owner Signup
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
            'password' => $request->password,
            'business_name' => $request->business_name,
            'user_type' => 'business_owner',
        ]);

        return response()->json([
            'message' => 'Business owner registered successfully',
            'user' => $user,
        ], 201);
    }

    // public function login(Request $request)
    // {
    //     $request->validate([
    //         'login' => 'required',
    //         'password' => 'required',
    //     ]);

    //     $loginType = filter_var($request->login, FILTER_VALIDATE_EMAIL) ? 'email' : 'phone';

    //     if (!Auth::attempt([$loginType => $request->login, 'password' => $request->password])) {
    //         throw ValidationException::withMessages([
    //             'login' => ['Invalid credentials'],
    //         ]);
    //     }

    //     $user = Auth::user();
    //     $token = $user->createToken('auth_token')->plainTextToken;

    //     return response()->json([
    //         'message' => 'Login successful',
    //         'user' => $user,
    //         'token' => $token,
    //     ]);
    // }

    public function login(Request $request)
    {
        $request->validate([
            'login' => 'required', // can be phone or email
            'password' => 'required',
        ]);

        // Determine whether login is by email or phone
        $loginType = filter_var($request->login, FILTER_VALIDATE_EMAIL) ? 'email' : 'phone';

        // Find the user by email or phone
        $user = User::where($loginType, $request->login)->first();

        if (!$user) {
            throw ValidationException::withMessages([
                'login' => ['No account found with that ' . $loginType],
            ]);
        }

        // Check the password
        if (!Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'login' => ['Invalid credentials.'],
            ]);
        }

        // Create an access token for the user
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token,
        ], 200);
    }

    // Logout
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }
}
