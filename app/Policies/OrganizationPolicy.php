<?php

namespace App\Policies;

use App\Organization;
use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class OrganizationPolicy
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

    public function update(User $user, Organization $organization)
    {
        return $organization
            ->users()
            ->where('id', $user->id)
            ->withPivot('status')
            ->first()
            ->pivot->status === 1;
    }
}
