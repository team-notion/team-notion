<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class PaymentMethodController extends Controller
{
    public function addPaymentMethod(Request $request)
    {
        $request->validate([
            'payment_method' => 'required|string',
            'default' => 'sometimes|boolean',
        ]);

        $user = $request->user();

        if (!$user->hasStripeId()) {
            $user->createAsStripeCustomer();
        }

        $user->addPaymentMethod($request->payment_method);

        if ($request->boolean('default', false)) {
            $user->updateDefaultPaymentMethod($request->payment_method);
        }

        return response()->json([
            'message' => 'Payment method added successfully',
            'default' => $request->boolean('default', false)
        ], 201);
    }

    public function listPaymentMethods(Request $request)
    {
        $user = $request->user();
        $methods = $user->paymentMethods();

        return response()->json([
            'payment_methods' => $methods
        ]);
    }
}
