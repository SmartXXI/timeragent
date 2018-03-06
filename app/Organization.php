<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Organization extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'address',
        'website',
    ];

    public function users()
    {
        return $this->belongsToMany('App\User');
    }

    public function clients()
    {
        return $this->hasMany('App\Client');
    }
}
