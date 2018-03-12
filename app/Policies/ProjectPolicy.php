<?php

namespace App\Policies;

use App\User;
use App\Project;
use Illuminate\Auth\Access\HandlesAuthorization;

class ProjectPolicy
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

    public function update(User $user, Project $project)
    {
        if ($project->owner_id) {
            return $user->id === $project->owner_id;
        }
        if ($project->client_id) {
            return $user->organizations()
                ->whereHas('projects', function($query) use($project) {
                    $query->where('projects.id', $project->id);
                })
                ->withPivot('status')
                ->first()
                ->pivot
                ->status === 1;
        }
    }
}
