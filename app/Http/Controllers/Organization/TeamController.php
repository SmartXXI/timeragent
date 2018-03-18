<?php

namespace App\Http\Controllers\Organization;

use App\Http\Controllers\Controller;
use App\Organization;
use App\Team;
use App\User;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    public function get(Request $request, Organization $organization)
    {
        return $organization->teams->load('users');
    }

    public function getTeam(Request $request, Organization $organization, Team $team)
    {
        return $team->load('users');
    }

    public function create(Request $request, Organization $organization)
    {
        $team = Team::create([
            'name'            => $request->team['name'],
            'organization_id' => $organization->id,
        ]);

        $team->users()->sync($request->teamUsers);
    }

    public function update(Request $request, Organization $organization, Team $team)
    {
        $team_users = [];
        foreach ($request->teamUsers as $user_id) {
            $user = User::find($user_id);
            $team_users[$user_id] = [
                'team_id' => $team->id,
                'billable_rate' => $user->billable_rate,
                'cost_rate' => $user->cost_rate,
            ];
        }

        $team->projects()->sync($request->team_users);

        $team->users()->sync($request->teamUsers);

        $team->update([
            'name' => $request->team['name'],
        ]);
        return $team;
    }
}
