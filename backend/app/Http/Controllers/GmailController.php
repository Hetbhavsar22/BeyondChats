<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Google\Client;
use Google\Service\Gmail;

class GmailController extends Controller
{

    public function connect()
    {

        $client = new Client();

        $client->setClientId(env('GOOGLE_CLIENT_ID'));

        $client->setClientSecret(env('GOOGLE_CLIENT_SECRET'));

        $client->setRedirectUri(env('GOOGLE_REDIRECT_URI'));

       $client->addScope(Gmail::GMAIL_READONLY);
$client->addScope(Gmail::GMAIL_SEND);

        return redirect($client->createAuthUrl());

    }

 public function callback(Request $request)
{
    $client = new \Google\Client();

    $client->setClientId(env('GOOGLE_CLIENT_ID'));
    $client->setClientSecret(env('GOOGLE_CLIENT_SECRET'));
    $client->setRedirectUri(env('GOOGLE_REDIRECT_URI'));

    $token = $client->fetchAccessTokenWithAuthCode($request->code);

    if (isset($token['error'])) {
        return response()->json($token);
    }

    // store token in file
    file_put_contents(storage_path('gmail_token.json'), json_encode($token));

    return redirect("http://localhost:3000");
}

}