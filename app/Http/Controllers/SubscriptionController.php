<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Inertia\Inertia;

class SubscriptionController extends Controller
{
    public function __construct()
    {
        $this->middleware('can:admin.subscription.index')->only('index');
        $this->middleware('can:admin.subscription.create')->only('create', 'store');
        $this->middleware('can:admin.subscription.edit')->only('edit', 'update');
        $this->middleware('can:admin.subscription.delete')->only('destroy');
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $subscriptions = Subscription::all();
        return Inertia::render('Subscriptions/Index', compact('subscriptions'));
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Subscriptions/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        Subscription::create($request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
            'consultations_allowed' => 'required|integer',
            'price' => 'required|numeric',
        ]));

        return redirect()->route('subscriptions.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Subscription $subscription)
    {
        return Inertia::render('Subscriptions/Show', compact('subscription'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Subscription $subscription)
    {
        return Inertia::render('Subscriptions/Edit', compact('subscription'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Subscription $subscription)
    {
        $subscription->update($request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'consultations_allowed' => 'required|integer',
            'price' => 'required|numeric',
        ]));

        return redirect()->route('subscriptions.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Subscription $subscription)
    {
        $subscription->delete();

        return redirect()->route('subscriptions.index');
    }
}
