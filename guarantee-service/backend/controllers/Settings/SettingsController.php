<?php

class SettingsController {
    public static function changeMail($data){
        $user = R::findOne('users', 'user_api = ?', [$data['uApi']]);
        if($user){
            if($data['old_mail'] == $user->email){
                if(password_verify($data['password'], $user->password)){
                    $user->email = $data['new_mail'];
                    R::store($user);
                    ResponseController::successfully();
                }
                else{
                    ResponseController::invalidPassword();
                }
            }
            else{
                ResponseController::emailNotFound();
            }
        }
        else{
            ResponseController::notFound();
        }
    }

    public static function changePasswordMail($data){
        $user = R::findOne('users', 'email = ?', [$data['mail']]);
        if($user){
            if($data['mail'] == $user->email){
                $mail = $user->email;
                self::sendMail($mail);
                ResponseController::successfully();
            }
            else{
                ResponseController::emailNotFound();
            }
        }
        else{
            ResponseController::notFound();
        }
    }

    public static function setNewPassword($data){
        $token = R::findOne('tokens',  'token = ?', [$data['token']]);
        $user = R::findOne('users', 'email = ?', [$token->account]);
        if($token){
            if($token->expire >= time()){ // если час от создания токена не прошел
                if(strlen($data['password']) > 8){
                    $user->password = password_hash($data['password'], PASSWORD_DEFAULT);
                    R::trash($token);
                    R::store($user);
                    ResponseController::successfully();
                }
                else{
                    ResponseController::notSuitable();
                }
            }
            else{
                ResponseController::tokenExpire();
            }
        }
        else
        {
            ResponseController::tokenNotFound();
        }
    }


    public static function sendMail($mail){

        $token = self::createChangeToken($mail);

        $to  = "<".$mail.">";

        $subject = "Смена пароля на сервисе guarantee-service";

        $message = "Для смены пароля необходимо перейти по восстановительной ссылке и указать новый пароль для аккаунта: "."<a>http://localhost:8888/reset?t=".$token."</a>";

        $headers  = "Content-type: text/html; charset=utf-8 \r\n";
        $headers .= "From: guarantee-service <guarantee-service@mail.com>\r\n";

        mail($to, $subject, $message, $headers);
    }

    public static function createChangeToken($mail){
        $chars = "1234567890qwertyopasdfghjkzxcvbnm";
        $last_tokens = R::find('tokens',  'account = ?', [$mail]);
        if($last_tokens){ // Если существуют токены с заданым мейлом
            foreach ($last_tokens as $last_token){
                R::trash($last_token); // проходимся по всем токенам и ужаляем их
            }
        }

        $token = R::dispense('tokens');
        $token->token = substr(str_shuffle($chars), 0, 15 );
        $token->account = $mail;
        $token->expire = time() + 3600;

        R::store($token);

        return $token->token;
    }

    public static function uploadPhoto($data){
        $user = R::findOne('users', 'user_api = ?', [$data['uApi']]);
        if($user){
            $url = 'https://api.imgbb.com/1/upload';
            $key = 'fa504816eae88b9dc3f44dbe23aa4849';
            $data = array('key' => $key, 'image' => $data['image']);

            $options = array(
                'http' => array(
                    'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
                    'method'  => 'POST',
                    'content' => http_build_query($data)
                )
            );
            $result = file_get_contents($url, false, stream_context_create($options));
            $response = json_decode($result, true);
    
            if($response['success']){
                $user->image = $response['data']['url'];
                R::store($user);
                ResponseController::successfully();
            }
            else{
                ResponseController::uploadProblems();
            }
        }
        else{
            ResponseController::notFound();
        }
    }
}
