<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Google\Client;
use Google\Service\Gmail;
use App\Models\Email;

class EmailController extends Controller
{

    public function syncEmails(Request $request)
    {
        set_time_limit(300);

        $tokenPath = storage_path('gmail_token.json');

        if (!file_exists($tokenPath)) {
            return response()->json(["error" => "Please connect Gmail first"], 400);
        }

        $token = json_decode(file_get_contents($tokenPath), true);

        $client = new Client();
        $client->setClientId(env('GOOGLE_CLIENT_ID'));
        $client->setClientSecret(env('GOOGLE_CLIENT_SECRET'));
        $client->setRedirectUri(env('GOOGLE_REDIRECT_URI'));
        $client->setAccessToken($token);

        $service = new Gmail($client);

        $days = max(1, (int) $request->input('days', 7));
        $afterDate = date('Y/m/d', strtotime("-{$days} days"));

        $messages = $service->users_messages->listUsersMessages('me', [
            'maxResults' => 200,
            'labelIds'   => ['INBOX'],
            'q'          => "after:{$afterDate}"
        ]);

        $messageList = $messages->getMessages();
        if (empty($messageList)) {
            return response()->json(["status" => "No emails found for this period", "count" => 0]);
        }

        $synced = 0;
        foreach ($messageList as $message) {
            $msg = $service->users_messages->get('me', $message->getId(), [
                'format' => 'full'
            ]);
            $payload = $msg->getPayload();
            $headers = $payload->getHeaders();

            $subject = "";
            $from = "";
            $to = "";

            foreach ($headers as $header) {
                if ($header->getName() == "Subject") $subject = $header->getValue();
                if ($header->getName() == "From")    $from    = $header->getValue();
                if ($header->getName() == "To")      $to      = $header->getValue();
            }

            $emailContent = $this->parseMessageParts($payload);

            Email::updateOrCreate(
                ["gmail_id" => $msg->getId()],
                [
                    "thread_id"       => $msg->getThreadId(),
                    "sender"          => $from,
                    "receiver"        => $to,
                    "subject"         => $subject,
                    "body"            => $emailContent['body'] ?: "No content",
                    "has_attachments" => !empty($emailContent['attachments'])
                ]
            );
            $synced++;
        }

        return response()->json([
            "status" => "Emails synced successfully",
            "count"  => $synced
        ]);
    }

    private function parseMessageParts($part)
    {
        $content = ['body' => '', 'attachments' => []];

        if ($part->getParts()) {
            foreach ($part->getParts() as $subPart) {
                $subContent = $this->parseMessageParts($subPart);
                $content['body'] .= $subContent['body'];
                $content['attachments'] = array_merge($content['attachments'], $subContent['attachments']);
            }
        } else {
            $mimeType = $part->getMimeType();
            $data = $part->getBody()->getData();
            
            if ($data) {
                $decodedData = base64_decode(str_replace(['-', '_'], ['+', '/'], $data));
                if ($mimeType == 'text/html') {
                    $content['body'] = $decodedData;
                } elseif ($mimeType == 'text/plain' && empty($content['body'])) {
                    $content['body'] = nl2br(e($decodedData));
                }
            }

            if ($part->getFilename()) {
                $content['attachments'][] = [
                    'filename' => $part->getFilename(),
                    'mimeType' => $mimeType,
                    'size' => $part->getBody()->getSize()
                ];
            }
        }

        return $content;
    }

    public function index()
    {

        return Email::latest()->get();

    }


    public function reply(Request $request)
    {

        $tokenPath = storage_path('gmail_token.json');
        if (!file_exists($tokenPath)) {
            return response()->json(["error" => "Please connect Gmail first"], 400);
        }

        $token = json_decode(
            file_get_contents($tokenPath),
            true
        );

        $client = new Client();

        $client->setClientId(env('GOOGLE_CLIENT_ID'));
        $client->setClientSecret(env('GOOGLE_CLIENT_SECRET'));
        $client->setRedirectUri(env('GOOGLE_REDIRECT_URI'));

        $client->setAccessToken($token);

        $service = new Gmail($client);

        $rawMessage = "To: ".$request->to."\r\n";
        $rawMessage .= "Subject: Re: ".$request->subject."\r\n\r\n";
        $rawMessage .= $request->message;

        $encodedMessage = rtrim(
            strtr(base64_encode($rawMessage),'+/','-_'),'='
        );

        $message = new Gmail\Message();

        $message->setRaw($encodedMessage);

        $service->users_messages->send("me",$message);

        return response()->json([
            "status"=>"Reply sent successfully"
        ]);

    }

    public function getStatus()
    {
        return response()->json([
            "connected" => file_exists(storage_path('gmail_token.json'))
        ]);
    }

    public function disconnect()
    {
        $tokenPath = storage_path('gmail_token.json');
        if (file_exists($tokenPath)) {
            unlink($tokenPath);
        }
        return response()->json([
            "status" => "Disconnected successfully"
        ]);
    }

}