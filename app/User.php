<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Mpociot\Teamwork\Traits\UserHasTeams;
use Jrean\UserVerification\Traits\VerifiesUsers;
use Jrean\UserVerification\Traits\UserVerification;

class User extends Authenticatable
{
    use HasApiTokens,Notifiable,UserHasTeams,UserVerification;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password', 'cost_rate', 'billable_rate', 'cost_currency', 'billable_currency'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    public function projects() {
        return $this->belongsToMany('App\Project', 'project_user', 'user_id', 'project_id')
            ->withPivot('billable_rate', 'cost_rate')
            ->withTimestamps();
    }

    public function organizations()
    {
        return $this->belongsToMany('App\Organization')
            ->withPivot('status');
    }

    public function attachOrganization($organization_id, $pivot = [])
    {
        return $this->organizations()->attach($organization_id, $pivot);
    }
}
