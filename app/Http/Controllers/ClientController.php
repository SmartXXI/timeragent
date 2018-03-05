<?php

namespace App\Http\Controllers;

use App\Client;
use App\Contact;
use App\Http\Requests\CreateClientRequest;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function getClients(Request $request)
    {
        return Client::where('organization_id', $request->organization_id)
            ->with('contact')
            ->get();
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(CreateClientRequest $request)
    {
        $contact = Contact::create($request->client['contact']);

        $all = [
            'organization_id' => $request->organizationId,
            'name' => $request->client['name'],
            'contact_id' => $contact->id,
            'invoice_prefix' => (isset($request->client['invoice_prefix'])) ? $request->client['invoice_prefix'] : null,
            'address' => (isset($request->client['address'])) ? $request->client['address'] : null,
        ];


        return Client::create($all);
    }

    public function getClient(Client $client) {
        return $client->load('contact');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Client  $client
     * @return \Illuminate\Http\Response
     */
    public function show(Client $client)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Client  $client
     * @return \Illuminate\Http\Response
     */
    public function edit(Client $client)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Client  $client
     * @return \Illuminate\Http\Response
     */
    public function update(CreateClientRequest $request, Client $client)
    {
        $contact = Contact::find($client->contact_id);

        $contact->update($request->client['contact']);

        $all = [
            'name' => $request->client['name'],
            'invoice_prefix' => (isset($request->client['invoice_prefix'])) ? $request->client['invoice_prefix'] : null,
            'address' => (isset($request->client['address'])) ? $request->client['address'] : null,
        ];

        $client->update($all);

        return $client;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Client  $client
     * @return \Illuminate\Http\Response
     */
    public function destroy(Client $client)
    {
        //
    }
}
