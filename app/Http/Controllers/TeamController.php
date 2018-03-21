<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Auth;
use Mpociot\Teamwork\Facades\Teamwork;
use App\Team;
use App\User;
use Illuminate\Support\Facades\Mail;

use Illuminate\Http\Request;

class TeamController extends Controller
{
    public function getTeams(Request $request) {
        $user = Auth::user();
    	$teamsWithUser = $user->teams()->whereNotNull('owner_id')->get();
    	$ownTeams = Team::where('owner_id', $user->id)->get();
    	$teams = $teamsWithUser->merge($ownTeams);
        $teams->map(function(Team $team) {
            $team->owner_name = User::find($team->owner_id)->name;
            $team->load('users');
            return $team;
        });
    	return $teams;
    }

    public function create(Request $request) {

        $team = Team::create([
            'name' => $request->team['name'],
            'owner_id' => Auth::id(),
        ]);

        $team->users()->sync(array_column($request->teamUsers, 'id'));

		return $team;
    }

    public function invite(Request $request) {
    	$team_id = $request['team_id'];

    	$invite_team = Team::find($team_id);

    	foreach ($request->members as $memberEmail) {
            $user = User::where('email', $memberEmail)->first();
//            http_response_code(500);
//            dd($user);
            Teamwork::inviteToTeam($memberEmail, $team_id, function ($invite) use($user) {
                Mail::send('teamwork.emails.invite', ['team' => $invite->team, 'user' => $user, 'invite' => $invite], function ($message) use ($invite) {
                    $message->to($invite->email)->subject('Invitation to join team ' . $invite->team->name);
                });
                // Send email to user
            });
        }
    }
    public function getOwnTeams()
    {
        return Team::iManage()
            ->with('users')
            ->get()
            ->values()
            ->toArray();
    }
    public function getOwnUsers() {
        $user = Auth::user();
        $teams = $user->teams;
        $users = [];
        foreach ($teams as $team) {
            foreach ($team->users as $user) {
                if(array_search($user->id, array_column($users, 'id')) === FALSE) $users[] = $user;
            }
        }
        return $users;
    }
    public function edit(Request $request, Team $team) {
        $team->users;
        return $team;
    }
    public function update(Request $request, Team $team) {
        $project_users = [];

        foreach ($request->teamUsers as $user) {

            $project_users[$user['id']] = [
                'team_id' => $team->id,
                'billable_rate' => $user['billable_rate'],
                'cost_rate' => $user['cost_rate'],
            ];
        }

        $team->users
            ->filter(function ($user) use ($team, $request) {
                if ($team->owner_id == $user->id) {
                    return false;
                } else {
                    return !in_array($user->id, $request->teamUsers);
                }
            })
            ->each(function ($user) use ($team) {
                Mail::send('team.emails.remove', ['team' => $team], function ($message) use($user, $team) {
                    $message->to($user->email)->subject('You have been removed from team "' . $team->name . '"');
                });
            });

        foreach ($team->projects as $project) {
            $project->users()->sync($project_users);
        }

        $team->users()->sync(array_column($request->teamUsers, 'id'));

        $team->update([
            'name' => $request->team['name'],
        ]);
        return $team;
    }

    public function acceptInvite(Team $team, User $user, $token)
    {
        $invite = Teamwork::getInviteFromAcceptToken($token);
        if (!$invite) {
            abort(404);
        }
        $owner_email = User::find($team->owner_id)->email;
        if (auth()->check()) {
            Teamwork::acceptInvite($invite);
            // return redirect()->route('teams.index');
            Mail::send('team.emails.notify', ['team' => $team, 'user' => $user], function ($message) use($team, $owner_email) {
                $message->to($owner_email)->subject('Accepted invitation to "' . $team->name . '"');
            });
            return redirect('/#/teams');
        } else {
            session(['invite_token' => $token]);
            return redirect()->to('login');
        }
    }

    public function getAllUsers(Request $request)
    {
        return User::where('name', 'LIKE', "$request->queryString%")->get();
    }

    public function delete(Team $team)
    {
        $team->delete();
    }
}
