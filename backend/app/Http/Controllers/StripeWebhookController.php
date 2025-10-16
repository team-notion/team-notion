<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class StripeWebhookController extends Controller
{
    public function handlePaymentIntentSucceeded($payload)
    {
        Log::info('Payment succeeded:', $payload);
        return response('Webhook handled', 200);
    }
}
