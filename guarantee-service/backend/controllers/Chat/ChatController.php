<?php

class ChatController{
    public static function chatHistory($data){
        $deal = R::findOne('deals', 'id = ?', [$data['dealId']]);// Находим chat_id
        $user = R::findOne('users', 'user_api = ?', [$data['uApi']]);
        if($user){
            if($user->login == $deal->user_customer || $user->login == $deal->user_seller){
                $chat = R::findAll('messages', 'deal_id = ? ORDER BY id DESC', [$deal->id]);
                ResponseController::responseChatHistory($chat);
            }
            else{
                ResponseController::profileNotFound();
            }
        }
        else{
            ResponseController::dealUsersNotMatch();
        }
    }
    public static function sendMessage($data){
        $deal = R::findOne('deals', 'id = ?', [$data['dealId']]);// Находим chat_id
        $user = R::findOne('users', 'user_api = ?', [$data['uApi']]);
        if($user){
            if($user->login == $deal->user_customer || $user->login == $deal->user_seller){
                if($data['message'] != null){
                    $message = R::dispense('messages');
                    $message->deal_id = $deal->id;
                    $message->message = $data['message'];
                    $message->sender = $user->login;
                    R::store($message);
                    ResponseController::messageSended();
                }
                else{
                    ResponseController::emptyMessage();
                }
            }
            else{
                ResponseController::profileNotFound();
            }
        }
        else{
            ResponseController::dealUsersNotMatch();
        }
    }
    public static function chatListen($data){
        $deal = R::findOne('deals', 'id = ?', [$data['dealId']]);// Находим chat_id
        $messagesCount = R::count('messages', 'deal_id = ?', [$deal->id]); // Подсчет всех сообщений сделки
        if($data['messages-count'] < $messagesCount) { // Если отправленных сообщений с клиента меньше чем сообщейний в базе
            $user = R::findOne('users', 'user_api = ?', [$data['uApi']]);
            if($user){
                if($user->login == $deal->user_customer || $user->login == $deal->user_seller){
                    $countNewMessages = $messagesCount - $data['messages-count'];
                    $messages = R::findAll('messages', 'deal_id = ? ORDER BY id DESC', [$deal->id]);

                    $newMessagesArray = []; // Создаем массив с сообщениями
                    foreach ($messages as $message){
                        $newMessagesArray[] = $message;
                    }

                    $newMessages = []; // Создаем массив сообщений, которых нет на клиента
                    for($i = 0; $i < $countNewMessages; $i++){
                        $newMessages[] = $newMessagesArray[$i];
                    }
                    ResponseController::newMessages($newMessages);
                } else {
                    ResponseController::profileNotFound();
                }
            } else {
                ResponseController::dealUsersNotMatch();
            }
        }
        else{
            ResponseController::noNewMessages();
        }
    }
}