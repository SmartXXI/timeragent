<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    protected $fillable = [
        'organization_id',
        'contact_id',
        'name',
        'invoice_prefix',
        'address',
    ];

    public function contact() {
        return $this->belongsTo('App\Contact');
    }
}
