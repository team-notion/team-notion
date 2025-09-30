<?php

namespace App\Http\Controllers;

use App\Models\Car;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class CarController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request)
    {
        $cars = $request->user()->cars()->get();
        return response()->json($cars);
    }

    public function store(Request $request)
    {
        $request->validate([
            'model' => 'required|string|max:255',
            'type' => 'required|string|max:100',
            'year_of_manufacture' => 'required|digits:4|integer|min:1900|max:' . date('Y'),
            'daily_price' => 'required|numeric|min:0',
            'photos.*' => 'required|image|max:2048',
            'availability_dates' => 'nullable|array',
            'rental_rules' => 'nullable|string',
            'deposit' => 'nullable|numeric|min:0',
            'deposit_percentage' => 'nullable|boolean',
            'cutoff_hours' => 'nullable|integer|min:0',
        ]);

        $photos = [];
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $photo) {
                $photos[] = $photo->store('cars', 'public');
            }
        }

        $car = Car::create([
            'owner_id' => $request->user()->id,
            'model' => $request->model,
            'type' => $request->type,
            'year_of_manufacture' => $request->year_of_manufacture,
            'daily_price' => $request->daily_price,
            'photos' => $photos,
            'availability_dates' => $request->availability_dates,
            'rental_rules' => $request->rental_rules,
            'deposit' => $request->deposit,
            'deposit_percentage' => $request->deposit_percentage ?? false,
            'cutoff_hours' => $request->cutoff_hours ?? 24,
        ]);

        return response()->json([
            'message' => 'Car added successfully',
            'car' => $car,
        ], 201);
    }

    public function update(Request $request, Car $car)
    {
        $this->authorize('update', $car);

        $request->validate([
            'model' => 'nullable|string|max:255',
            'type' => 'nullable|string|max:100',
            'year_of_manufacture' => 'nullable|digits:4|integer|min:1900|max:' . date('Y'),
            'daily_price' => 'nullable|numeric|min:0',
            'photos.*' => 'nullable|image|max:2048',
            'availability_dates' => 'nullable|array',
            'rental_rules' => 'nullable|string',
            'deposit' => 'nullable|numeric|min:0',
            'deposit_percentage' => 'nullable|boolean',
            'cutoff_hours' => 'nullable|integer|min:0',
        ]);

        $data = $request->only([
            'model',
            'type',
            'year_of_manufacture',
            'daily_price',
            'availability_dates',
            'rental_rules',
            'deposit',
            'deposit_percentage',
            'cutoff_hours',
        ]);

        if ($request->hasFile('photos')) {
            $newPhotos = [];
            foreach ($request->file('photos') as $photo) {
                $newPhotos[] = $photo->store('cars', 'public');
            }
            $existingPhotos = $car->photos ?? [];
            $data['photos'] = array_merge($existingPhotos, $newPhotos);
        }

        $car->update($data);

        return response()->json([
            'message' => 'Car updated successfully',
            'car' => $car,
        ]);
    }


    public function destroy(Car $car)
    {
        $this->authorize('delete', $car);
        $car->delete();

        return response()->json(['message' => 'Car deleted successfully']);
    }
}
