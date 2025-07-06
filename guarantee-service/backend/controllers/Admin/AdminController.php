<?php

class AdminController{
    protected static function adminAuth($uApi){
        $admin = R::find('users', 'user_api = ? AND admin = ?' , [$uApi, 1]);
        if($admin){
            return true;
        }
        else {
            ResponseController::accessDenied();
        }
        return false;
    }
    protected static function getMessages($dealId):array{
        $messages = R::findAll('messages', 'deal_id = ?', [$dealId]);

        $sortedMessages = [];
        foreach ($messages as $message){
            $sortedMessages[] = $message;
        }

        return $sortedMessages;
    }
}