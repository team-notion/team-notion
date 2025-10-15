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

    public function publicIndex()
    {
        $today = Carbon::today()->toDateString();

        $cars = Car::whereDoesntHave('reservations', function ($query) use ($today) {
            $query->where('status', '!=', 'cancelled')
                ->where(function ($q) use ($today) {
                    $q->where('reserved_from', '<=', $today)
                        ->where('reserved_till', '>=', $today);
                });
        })
            ->with(['owner:id,name,email', 'reservations:id,car_id,status,reserved_from,reserved_till'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json([
            'available_cars' => $cars->items(),
            'total_available' => $cars->total(),
            'current_date' => $today,
        ]);
    }


    public function myCars(Request $request)
    {
        return response()->json($request->user()->cars);
    }

    public function store(Request $request)
    {
        $request->validate([
            'model' => 'required|string|max:255',
            'type' => 'required|string|max:100',
            'license' => 'required|string|max:50|unique:cars,license',
            'year_of_manufacture' => 'required|digits:4|integer|min:1900|max:' . date('Y'),
            'daily_price' => 'required|numeric|min:0',
            'photos.*' => 'nullable|image|max:2048',
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
            'license' => $request->license,
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

    public function show(Car $car)
    {
        // $car->load('owner');

        return response()->json([
            'id' => $car->id,
            'owner_id' => $car->owner_id,
            'model' => $car->model,
            'type' => $car->type,
            'year_of_manufacture' => $car->year_of_manufacture,
            'daily_price' => $car->daily_price,
            'photos' => $car->photos ?? [],
            'availability_dates' => $car->availability_dates ?? [],
            'rental_rules' => $car->rental_rules,
            'deposit' => $car->deposit,
            'deposit_percentage' => $car->deposit_percentage,
            'cutoff_hours' => $car->cutoff_hours,
            'created_at' => $car->created_at,
            'updated_at' => $car->updated_at,
        ]);
    }

    public function filter(Request $request)
    {
        $query = Car::query();

        // Filter by car type
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        // Filter by model (search)
        if ($request->filled('model')) {
            $query->where('model', 'ILIKE', "%{$request->model}%");
        }

        // Filter by price range
        if ($request->filled('min_price')) {
            $query->where('daily_price', '>=', $request->min_price);
        }

        if ($request->filled('max_price')) {
            $query->where('daily_price', '<=', $request->max_price);
        }

        if ($request->filled(['from', 'till'])) {
            $query->whereDoesntHave('reservations', function ($q) use ($request) {
                $q->where('status', '!=', 'cancelled')
                    ->where(function ($q2) use ($request) {
                        $q2->whereBetween('reserved_from', [$request->from, $request->till])
                            ->orWhereBetween('reserved_till', [$request->from, $request->till])
                            ->orWhere(function ($q3) use ($request) {
                                $q3->where('reserved_from', '<=', $request->from)
                                    ->where('reserved_till', '>=', $request->till);
                            });
                    });
            });
        }

        $cars = $query->with('owner')->paginate(10);

        return response()->json([
            'filters_applied' => $request->only(['type', 'model', 'min_price', 'max_price', 'from', 'till']),
            'total_results' => $cars->total(),
            'cars' => $cars,
        ]);
    }

    public function destroy(Car $car)
    {
        $this->authorize('delete', $car);
        $car->delete();

        return response()->json(['message' => 'Car deleted successfully']);
    }

    public function removePhoto(Car $car, Request $request)
    {
        $this->authorize('update', $car);

        $request->validate(['path' => 'required|string']);

        $photos = $car->photos ?? [];
        $photos = array_filter($photos, fn($p) => $p !== $request->path);

        Storage::disk('public')->delete($request->path);

        $car->update(['photos' => array_values($photos)]);

        return response()->json(['message' => 'Photo removed successfully']);
    }
}
