<?php

class UserController{
    public static function createUser($data) : void{
        $chars = "1234567890qwertyopasdfghjkzxcvbnm";
        $hasRegister = R::findOne("users" , "login = ? or email = ?" , [mb_strtolower($data['login']), mb_strtolower($data['email'])]);
        if(!$hasRegister)
        {
            if(strlen($data['login']) > 4 && strlen($data['password']) > 7)
            {
                $create = R::dispense("users");
                $create->login = mb_strtolower($data['login']); // Переводим строку в нижний регистр
                $create->email = mb_strtolower($data['email']); // Переводим строку в нижний регистр
                $create->password = password_hash($data['password'], PASSWORD_DEFAULT);
                $create->balance = "0";
                $create->level = 1;
                $create->admin = 0;
                $create->user_api = substr(str_shuffle($chars), 0, 35 );
                $created = R::store($create);
                if($created){
                    ResponseController::created();
                }
                else{
                    ResponseController::notCreated();
                }
            }
            else {
                ResponseController::notSuitable();
            }
        }
        else {
            ResponseController::accountBusy();
        }
    }

    public static function authUser($data) : void{
        if(!empty($data['login'] && $data['password']))
        {
            $found = R::findOne("users" , "login = ? or email = ?" , [$data['login'], $data['login']]);
            if($found)
            {
                if(password_verify($data['password'], $found->password))
                {
                    ResponseController::authSuccessfully($found);
                }
                else{
                    ResponseController::notFound();
                }
            }
            else{
                ResponseController::notFound();
            }
        }
        else{
            ResponseController::notFound();
        }
    }
    public static function profile($uApi, $username) :void{
        isset($username) ?  $user = R::findOne('users', 'login = ?', [$username]) : $user = R::findOne('users', 'user_api = ?', [$uApi]);

        $itemCount = 8; // Выводим 8 последних записей

        if($user) {
            $dealsCount = R::count('deals', 'user_seller = ? OR user_customer = ?', [$user->login, $user->login]); //Подсчет количества сделок
            $deals = R::findAll('deals', 'user_seller = ? OR user_customer = ? ORDER BY id DESC', [$user->login, $user->login]); // Получение успешных сделок
            $reviews = R::findAll('reviews', 'user = ? ORDER BY id DESC', [$user->login]);
            $hold_balance = R::findAll('holds', 'username = ? AND active = ?', [$user->login, 1]);

            $successDeals = 0;
            $cancelDeals = 0;
            $dealsArray = [];
            $dealsWait = [];

            $deal = []; // Сортируем записи с базы для удобного обращения
            foreach ($deals as $checkedDeal) {
                $deal[] = $checkedDeal;
            }

            for ($i = 0; $i < $itemCount; $i++) { // отображение последних 8 записей сделок
                if($deal[$i] == null){ // Если запись не существует
                    continue;
                }
                if ($deal[$i]->status != 'wait') {
                    if ($deal[$i]->status == "complete") {
                        $successDeals++;
                    }
                    $dealsArray[] = $deal[$i]; // Записываем в массив с сделками
                }
                else{
                    $itemCount++;
                }
            }


            foreach ($deals as $waitDeal){ // Поиск всех записей с статусом wait
                if (!isset($username)) { // Если запрос без параметров username
                    if ($waitDeal->recipient == $user->login) { // Если в сделке никнейм принимающего равен никнейму юзера
                        if ($waitDeal->status == 'wait') { // Если статус wait
                            $dealsWait[] = $waitDeal; // Записываем в массив с ожиданиями
                        }
                    }
                }
            }

            $sortReviews = []; // Сортируем записи с базы для удобного обращения
            foreach ($reviews as $review){
                $sortReviews[] = $review;
            }
             // отсортированный массив отзывов
            for($i = 0; $i < $itemCount; $i++){ // отображение последних 8 записей отзывов
                if($sortReviews[$i] == null){ // Если запись не существует
                    continue;
                }
                $reviewsArray[] = $sortReviews[$i];
            }

            $reviewMark     = 0;
            $reviewCount    = 0;
            foreach($reviews as $review){
                $reviewCount++;
                $reviewMark += $review->grade;
            }

            $reviewAverage = 0;

            if($reviewMark != 0 && $reviewCount != 0) {
                $reviewAverage = round($reviewMark / $reviewCount, 1);
            }

            $all_hold = 0;
            foreach ($hold_balance as $hold){
                $curr_time = time();
                $unlock_time = $hold->hold_date + $hold->hold_time; // Время разбана

                if($curr_time >= $unlock_time){ // Если текущее время больше или равно времени разбана
                    $user->balance += $hold->balance; // Прибавляем баланс вышедший из холда
                    $hold->active = 0; // Обнуляем счетчик холда в базе
                    R::store($user);
                    R::store($hold);
                }
                else {
                    $all_hold += $hold->balance;
                }
            }

            ResponseController::profileInfo($user, $username, $dealsCount, $successDeals, $cancelDeals, $reviewCount, $reviewAverage, $reviewsArray, $dealsArray, $dealsWait, $all_hold);
        }
        else{
            ResponseController::profileNotFound();
        }
    }
    public static function search($user):void{
        $db_profiles = R::findAll('users', 'login LIKE ?', ["$user%"]); //Получаем данные юзера
        $profiles = [];
        foreach ($db_profiles as $db_profile){
            $profiles[] = $db_profile;
        }

        $userLetters = str_split($user); // Разбиваем юзера на буквы
        $total_arr = [];

        for($i = 0; $i < count($profiles); $i++){ // Цикл идет до количества выведенных профилей
            $missLetter = 0;
            for($k = 0; $k < strlen($profiles[$i]['login']); $k++){ // Проходимся по каждой букве логина
                //если буквы не сходятся - добавляем ошибочную букву
                if($profiles[$i]['login'][$k] != $userLetters[$k]) {
                    $missLetter++;
                }
            }
            $missArray = [
                $profiles[$i]['login'] => $missLetter ,
            ];
            $total_arr = array_merge($total_arr, $missArray);
            natsort($total_arr);
        }
        print_r(json_encode($total_arr));
    }
    public static function lastReviews():void{
        $allReviews = R::findAll('reviews', 'ORDER BY id DESC LIMIT 10');
        if($allReviews){ // Если есть отзывы
            ResponseController::reviewsResponse($allReviews);
        }
        else{
            ResponseController::reviewsNotFound();
        }
    }
    public static function profileData($data){
        $uApi = R::findOne('users', 'user_api = ?', [$data['uApi']]);
        if($uApi) {
            $user = R::findOne('users', 'login = ?', [$data['username']]);
            $deals = R::findAll('deals', 'user_seller = ? OR user_customer = ? ORDER BY id DESC', [$user->login, $user->login]);
            $reviews = R::findAll('reviews', 'user = ? ORDER BY id DESC', [$user->login]);

            !isset($data['page']) ? $page = 1 : $page = $data['page'];


            $paginate = $page * 10;

            switch($data['action']){
                case 'reviews':
                    $items = $reviews;
                    break;
                case 'deals':
                    $items = $deals;
                    break;
            }

            $sortedItems = [];
            foreach ($items as $item) {
                $sortedItems[] = $item;
            }

            $paginatedItems = [];
            $itemCounter = 0; // подсчет данных
            for ($i = ($paginate - 10); $i < $paginate; $i++) {
                if ($sortedItems[$i] != null) {
                    $paginatedItems[] = $sortedItems[$i];
                    $itemCounter++;
                }
            }
            if($itemCounter != 0){ // Если выведенных данных не 0
                print_r(json_encode($paginatedItems)); // выводим их
            } else {
                ResponseController::emptyResponse();
            }
        } else {
            ResponseController::accessDenied();
        }
    }




    public static function deal() :void{

        $deal = R::dispense('deals');
        $deal->title            =   "Купил негра";
        $deal->user_seller      =   'lovkachdev';
        $deal->user_customer    =   'admin';
        $deal->price            =   300;
        $deal->date             =   time();
        $deal->status           =   'success';
        R::store($deal);
    }
    public static function review() :void{

        $review = R::dispense('reviews');
        $review->deal_id          =   14;
        $review->title            =   "Куплю негра";
        $review->user             =   'lovkachdev';
        $review->sender           =   'admin';
        $review->price            =   300;
        $review->grade            =   1;
        $review->content          =   'Не Купил танцуещегося негра, покупкой не доволен, как и продавцом';
        $review->date             =   time();
        R::store($review);
    }
}