<?php

namespace App\Policies;

use App\Client;
use App\Organization;
use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ClientPolicy
{
    use HandlesAuthorization;

    /**
     * Create a new policy instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    public function update(User $user, Client $client)
    {
        return $user->organizations()->whereHas('clients', function ($query) use($client) {
           $query->where('id', $client->id);
        })
        ->withPivot('status')
        ->first()
        ->pivot->status === 1;
    }
}
