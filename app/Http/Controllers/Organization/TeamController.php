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


        $team->users()->sync(array_column($request->teamUsers, 'id'));
    }

    public function update(Request $request, Organization $organization, Team $team)
    {
        $project_users = [];

        foreach ($request->teamUsers as $user) {

            $project_users[$user['id']] = [
                'team_id' => $team->id,
                'billable_rate' => $user['billable_rate'],
                'cost_rate' => $user['cost_rate'],
            ];
        }

        foreach ($team->projects as $project) {
            $project->users()->sync($project_users);
        }

        $team->users()->sync(array_column($request->teamUsers, 'id'));

        $team->update([
            'name' => $request->team['name'],
        ]);
        return $team;
    }
}
