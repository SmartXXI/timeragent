<?php

namespace App\Providers;

use App\Organization;
use App\Policies\OrganizationPolicy;
use App\Team;
use App\Policies\TeamPolicy;
use App\Project;
use App\Policies\ProjectPolicy;
use Laravel\Passport\Passport;
use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        'App\Model' => 'App\Policies\ModelPolicy',
        Team::class => TeamPolicy::class,
        Project::class=> ProjectPolicy::class,
        Organization::class=> OrganizationPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();


        Passport::routes();
        //
    }
}
