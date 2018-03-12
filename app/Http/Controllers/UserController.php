<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Teamwork\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\User;

class UserController extends Controller
{
    public function index() {
        return Auth::user()
            ->load('organizations');
    }

    public function update(Request $request) {
        $user = User::find($request->user['id']);
        $all = [
            'name' => $request->user['name'],
//            'email' => $request->user['email'],
            'billable_rate' => $request->user['billable_rate'],
            'cost_rate' => $request->user['cost_rate'],
            'billable_currency' => $request->user['billable_currency'],
            'cost_currency' => $request->user['cost_currency'],
        ];
        if ($request->user['newPassword'] &&
            $request->user['newPassword'] === $request->user['confirmPassword']) {
            if (\Hash::check($request->user['currentPassword'], $user->password)) {
                $all['password'] = bcrypt($request->user['newPassword']);
            }
            else {
                $response = [
                    'errors' => [
                        'currentPassword' => [
                            'Wrong current password',
                        ]
                    ]
                ];
                return response()->json($response, 422);
            }
        }
        $user->update($all);
        return $user;
    }

    public function validateEmail(Request $request) {
//        http_response_code(500);
//        dd(!User::where('email', $request->email)->first());
        return User::where('email', $request->email)->first();
    }

}
