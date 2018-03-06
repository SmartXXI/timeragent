<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateOrganizationRequest;
use App\Organization;
use App\Project;
use Dotenv\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrganizationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(CreateOrganizationRequest $request)
    {

        $organization = Organization::create($request->organization);
        Auth::user()->attachOrganization($organization->id, ['status' => 1]);

        return $organization;
    }

    public function getOrganization(Organization $organization)
    {
        return $organization
            ->load(['users' => function($query) {
                $query->where('id', Auth::id());
            }]);
    }

    public function getOrganizationProjects(Organization $organization) {

        $projects = Project::whereIn('client_id', $organization->clients)
            ->get()
            ->map(function(Project $project) use ($organization) {
                $project->owner_name = $organization->name;
                $project->teams->map(function (Team $team) {
                    $team->owner_name = User::find($team->owner_id)->name;
                });
                $project->load('usersWithoutTeam');
                return $project;
            });

        return $projects;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Organization  $organization
     * @return \Illuminate\Http\Response
     */
    public function show(Organization $organization)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Organization  $organization
     * @return \Illuminate\Http\Response
     */
    public function edit(Organization $organization)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Organization  $organization
     * @return \Illuminate\Http\Response
     */
    public function update(CreateOrganizationRequest $request, Organization $organization)
    {
        $organization->update($request->organization);

        return $organization;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Organization  $organization
     * @return \Illuminate\Http\Response
     */
    public function destroy(Organization $organization)
    {
        //
    }
}
