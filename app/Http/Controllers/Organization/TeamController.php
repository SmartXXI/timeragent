<?php

namespace App\Http\Controllers\Organization;

use App\Http\Controllers\Controller;
use App\Organization;
use App\Team;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    public function get(Request $request, Organization $organization)
    {
        return $organization->teams->load('users');
    }

    public function getTeam(Request $request, Organization $organization, Team $team)
    {
        return $team;
    }

    public function update(Request $request, Organization $organization, Team $team)
    {
        $team_users = [];

    }
}
