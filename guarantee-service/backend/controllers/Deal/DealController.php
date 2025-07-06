<?php

    class DealController{

        public static function setDealStatus($data){
            $deal = R::findOne('deals', 'id = ?', [$data['dealId']]); // получение сделки по id
            $deal_status = R::findOne('statuses', 'deal_id = ?', [$data['dealId']]); // получение статусов по id

            $role = self::dealRole($data['uApi'], $data['dealId']); // Определение ролей в сделке
            $myRole = $role['myRole'];

            if($deal->status != 'wait' && $deal->status != 'decline'){
                if(!empty($role)) { // Если роль не возвращеается пустой
                    if ($data['status'] == 'accept' || $data['status'] == 'decline' || $data['status'] == 'report') { // Если отправленный статус принять или отклонить
                        if ($deal_status->$myRole == null) { // Если статус пустой
                            $deal_status->$myRole = $data['status'];
                            ResponseController::successfully();
                        } else {
                            ResponseController::fieldIsFilled();
                        }

                        R::store($deal_status);
                        self::getStatuses($data['dealId']);
                    } else {
                        ResponseController::argumentError();
                    }
                }
                // если запрос кинул пользовалеть не связанный с данной сделкой будет выведен DealNotFound с метода dealRole
            }
            else{
                ResponseController::partnerNotAccept();
            }
        }

        public static function getStatuses($deal_id){
            $deal_status = R::findOne('statuses', 'deal_id = ?', [$deal_id]);
            $deals = R::findOne('deals', 'id = ?', [$deal_id]);

            $customer = $deal_status->user_customer;
            $seller = $deal_status->user_seller;

            if($deals){ // Если сделка существует
                if($seller != null && $customer != null ){ // проверка сделки на заполнение полей статуса сделки
                    switch (true){
                        case $seller == 'accept' && $customer == 'accept':
                            $deals->status = 'complete'; // Ставим завершенный статус
                            self::addHoldsMoney($deal_id, 'seller'); // Поставить деньги в холд продавцу
                            break;
                        case $seller == 'decline' && $customer == 'decline':
                            $deals->status = 'decline';
                            self::addHoldsMoney($deal_id, 'customer'); // Поставить деньги в холд покупателю
                            break;
                        case $seller != $customer || $seller == 'report' || $customer == 'report' :
                            $deals->status = 'review';
                            $deal_status->report = 1;
                            R::store($deal_status);
                            self::reportAdmin($deal_id);
                            break;
                    }
                }
            }
            else{
                ResponseController::actionNotFound();
            }
            R::store($deals);
        }
        public static function addHoldsMoney($deal_id, $type){
            $deals = R::findOne('deals', 'id = ?', [$deal_id]);
            $hold = R::dispense('holds');
            if($type == 'seller'){
                $hold->username = $deals->user_seller; // Ставим в холд деньги продавцу
                $hold->hold_time = 43200;
                $hold->hold_date = time();
                $hold->balance = $deals->price;
                $hold->active = 1; // Ставим активный статус
                $hold->deal_id = $deal_id;
                R::store($hold);
            }
            else if($type == 'customer'){ // Если статус покупатель
                $hold->username = $deals->user_customer; // Ставим в холд деньги покупателю
                $hold->hold_time = 43200;
                $hold->hold_date = time();
                $hold->balance = $deals->price;
                $hold->active = 1; // Ставим активный статус
                $hold->deal_id = $deal_id; // Ставим активный статус
                R::store($hold);
            }
        }
        public static function reportAdmin($deal_id){
            $deal = R::findOne('deals', 'id = ?', [$deal_id]);

            if($deal){
                $report = R::dispense('reports');
                $report->deal_id = $deal_id;
                $report->status = 0;
                R::store($report);
            }
            else{
                ResponseController::dealNotFound();
            }
        }
        public static function setDealReview($data){
            $user = R::findOne('users', 'user_api = ?', [$data['uApi']]);
            $deal = R::findOne('deals', 'id = ?', [$data['dealId']]);
            $reviews = R::findAll('reviews', 'sender = ? AND dealId = ?', [$user->login, $data['dealId']]);
            $status = $deal->status;

            $role = self::dealRole($data['uApi'], $data['dealId']); // Определение ролей в сделке
            $partnerRole = $role['partnerRole'];

            if(!empty($role)){
                if($deal){ // Если сделка существует
                    if($status != 'wait' && $status != 'process' && $status != 'review'){ // Проверка на завершенность сделки
                        if(!$reviews){
                            $review = R::dispense('reviews');
                            $review->title = $deal->title;
                            $review->user = $deal->$partnerRole;
                            $review->sender = $user->login;
                            $review->price = $deal->price;
                            $review->grade = $data['grade'];
                            $review->content = $data['content'];
                            $review->date = time();
                            $review->deal_id = $data['dealId'];

                            R::store($review);
                            ResponseController::successfully();
                        }
                        else{
                            ResponseController::reviewIsFilled(); // Отзыв уже был оставлен
                        }
                    }
                    else{
                        ResponseController::dealWasNotEnded();
                    }
                }
                else{
                    ResponseController::dealNotFound();
                }
            }
            // если запрос кинул пользовалеть не связанный с данной сделкой будет выведен DealNotFound с метода dealRole
        }


        public static function dealRole($apiKey, $deal_id):array{
            $user = R::findOne('users', 'user_api = ?', [$apiKey]);
            $deal = R::findOne('deals', 'id = ?', [$deal_id]);

            $roleArray = [];

            if($user->login == $deal->user_customer){ // если никнейм совпадает с ролью покупатель
                $roleArray = ['myRole' => 'user_customer', // Записываем собственную роль
                    'partnerRole' => 'user_seller'];// Записываем собственную роль
            }
            else if($user->login == $deal->user_seller) { // если никнейм совпадает с ролью продавец
                $roleArray = ['myRole' => 'user_seller', // Записываем собственную роль
                    'partnerRole' => 'user_customer'];// Записываем собственную роль
            }
            else{
                ResponseController::dealNotFound();
            }

            return $roleArray;
        }
        public static function createDeal($data):void{
            $receiver = R::findOne('users', 'user_api = ?', [$data['uApi']]); //Получение отправителя сделки по api
            $recipientName = R::findOne('users', 'login = ?', [$data['recipient']]); // Получение никнейма получателя

            if($recipientName){
                $newDeal = R::dispense('deals');

                $newDeal->title = $data['title'];

                // Определение ролей
                if($data['role'] == 'customer'){
                    // Записываем никнейм отправителя в ячейку user_customer
                    $newDeal->user_customer = $receiver->login;
                    $newDeal->user_seller = $recipientName->login;
                }
                else if($data['role'] == 'seller'){
                    // Записываем никнейм отправителя в ячейку user_seller
                    $newDeal->user_customer = $recipientName->login;
                    $newDeal->user_seller = $receiver->login;
                }

                $customer = R::findOne('users', 'login = ?', [$newDeal->user_customer]);
                $total = $data['amount'] + ($data['amount'] * 0.05);
                if($customer->balance >= $total){
                    if($receiver->login != $data['recipient']){
                        $newDeal->recipient = $recipientName->login; // пользователь, который принимает сделку
                        $newDeal->price = $data['amount'];
                        $newDeal->date = time();
                        $newDeal->status = 'wait';
                        R::store($newDeal);

                        $deal_status = R::dispense('statuses');
                        $deal_status->deal_id = $newDeal->id;
                        $deal_status->user_seller = null;
                        $deal_status->user_customer = null;
                        $deal_status->report = 0;
                        $deal_status->report_status = 0;
                        R::store($deal_status);

                        ResponseController::dealCreated();
                    }
                    else{
                        ResponseController::sameUser();
                    }
                }
                else{
                    ResponseController::noEnoughMoney();
                }
            }
            else{
                ResponseController::recipientNotFound();
            }
        }
        public static function acceptDeal($data):void
        {
            $user = R::findOne('users', 'user_api = ?', [$data['uApi']]);
            $deal = R::findOne('deals', 'id = ?', [$data['dealId']]); // Сделка пользователя
            $customer = R::findOne('users', 'login = ?', [$deal->user_customer]);
            $total = $deal->price + ($deal->price * 0.05);

            if($user){
                if($deal->status == 'wait') {
                    if ($deal->recipient == $user->login) {
                        if($customer->balance >= $total){
                            $deal->status = 'process';
                            $customer->balance -= $total;

                            R::store($customer);
                            R::store($deal);

                            ResponseController::dealAction($deal->status);
                        }
                        else{
                            ResponseController::noEnoughMoney();
                        }
                    }
                    else {
                        ResponseController::dealUsersNotMatch();
                    }
                }
                else{
                    ResponseController::dealInProcess();
                }
            }
            else{
                ResponseController::profileNotFound();
            }
        }
        public static function declineDeal($data):void
        {
            $user = R::findOne('users', 'user_api = ?', [$data['uApi']]);
            if ($user) {
                $deal = R::findOne('deals', 'id = ?', [$data['dealId']]); // Сделка пользователя
                if ($deal->status == 'wait') {
                    if ($deal->recipient == $user->login) {
                        R::trash($deal);
                        ResponseController::dealAction($deal->status);
                    }
                    else {
                        ResponseController::dealUsersNotMatch();
                    }
                }
                else{
                    ResponseController::dealInProcess();
                }
            }
            else{
                ResponseController::profileNotFound();
            }
        }
        public static function infoDeal($data):void
        {
            $user = R::findOne('users', 'user_api = ?', [$data['uApi']]);
            if ($user) {
                $deal = R::findOne('deals', 'id = ?', [$data['dealId']]); // Сделка пользователя
                $statuses = R::findOne('statuses', 'deal_id = ?', [$data['dealId']]); // статусы сделки

                $reviewCustomer = R::findOne('reviews', 'deal_id = ? AND sender = ?', [$data['dealId'], $deal->user_customer]); // Отзыв покупателя
                $reviewSeller = R::findOne('reviews', 'deal_id = ? AND sender = ?', [$data['dealId'], $deal->user_seller]); // отзывы продавца


                $deal['seller_status'] = $statuses['user_seller'];
                $deal['customer_status'] = $statuses['user_customer'];

                $reviewStatuses = [
                    'customer' => $reviewCustomer->id,
                    'seller' => $reviewSeller->id
                ];

                $deal['seller_review'] = $reviewStatuses['seller'];
                $deal['customer_review'] = $reviewStatuses['customer'];

                ResponseController::responseDealInfo($deal);
            }
            else{
                ResponseController::profileNotFound();
            }
        }
    }


