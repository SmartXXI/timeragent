You have been invited to join team <b>{{$team->name}}</b>.<br>
Click <a href="{{route('teams.accept_invite', ['team' => $team->id, 'user' => $user->id, 'invite' => $invite->accept_token])}}">here</a> to join.
