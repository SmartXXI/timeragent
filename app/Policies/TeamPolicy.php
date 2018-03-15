<?php

namespace App\Policies;

use App\User;
use App\Team;
use Illuminate\Auth\Access\HandlesAuthorization;

class TeamPolicy
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

    public function update(User $user, Team $team)
    {
        if ($team->owner_id) {
            return $user->id === $team->owner_id;
        }
        if ($team->organization_id) {
            return $user
                ->organizations()
                ->where('id', $team->organization_id)
                ->withPivot('status')
                ->first()
                ->pivot
                ->status === 1;
        }
    }
}
