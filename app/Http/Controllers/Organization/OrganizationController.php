<?php

namespace App\Http\Controllers\Organization;

use App\Http\Requests\CreateOrganizationRequest;
use App\Organization;
use App\OrganizationInvite;
use App\Project;
use App\User;
use Dotenv\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;

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
                $query->where('id', Auth::id())->withPivot('status');
            }]);
    }

    public function getMembers(Organization $organization)
    {
        return $organization->users;
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

    public function invite(Request $request, Organization $organization)
    {

        foreach ($request->emails as $email) {
            $accept_token = Password::getRepository()->createNewToken();
            $deny_token = Password::getRepository()->createNewToken();

            $all = [
                'user_id' => Auth::id(),
                'organization_id' => $organization->id,
                'email' => $email,
                'accept_token' => $accept_token,
                'deny_token' => $deny_token,
            ];
            OrganizationInvite::create($all);

            Mail::send('organization.emails.invite', [
                    'organization' => $organization,
                    'user' => Auth::user(),
                    'accept_token' => $accept_token,
                    'deny_token' => $deny_token,
                ],
                function ($message) use ($email, $organization) {
                    $message
                        ->to($email)
                        ->subject('Invitation to join organization ' . $organization->name);
            });
        }

        return $organization;
    }

    public function acceptInvite(Request $request, Organization $organization)
    {
        $invite = OrganizationInvite::where('accept_token', $request->token)->first();

        $user = User::where('email', $invite->email)->first();

        $user->attachOrganization($organization->id, ['status' => '2']);

        Mail::send('organization.emails.notify', [
            'organization' => $organization,
            'user' => $user,
        ],
        function ($message) use ($organization, $invite) {
            $message->to(User::find($invite->user_id)->email)
                ->subject('Accepted invitation to join organization' . $organization->name);
        });

        return redirect()->route('home');
    }
}
