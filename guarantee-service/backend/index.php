<?php
    require './requires.php';

    header("Content-Type: application/json");
    header('Access-Control-Allow-Methods: GET,POST');
    header('Access-Control-Allow-Headers: Content-Type');

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: X-Requested-With");
    header("Access-Control-Allow-Headers: *");

    mb_internal_encoding("UTF-8");
    mb_http_output('UTF-8');
    mb_regex_encoding('UTF-8');

    define('CONFIG', require './config/config.php');

    $request = $_GET['url'];
    $method = $_SERVER['REQUEST_METHOD'];

    if($method == "GET") {

        $apiKey = $_GET['key'];
        $getApi = R::findOne("users" , "user_api = ?" , [$apiKey]);

        if($getApi){
            switch ($request) {
                case 'profile':
                    $user = $_GET['username'];
                    UserController::profile($apiKey, $user);
                    break;
                case 'deal':
                    UserController::deal();
                    break;
                case 'review':
                    UserController::review();
                    break;
                case 'search':
                    $user = $_GET['username'];
                    UserController::search($user);
                    break;
                case 'last-reviews':
                    UserController::lastReviews();
                    break;
//                case 'rev':
//                    UserController::review();
//                    break;
                default:
                    ResponseController::requestNotFound();
            }
        }
        elseif(!$apiKey){ // Публичные методы, доступные без апи ключа
            switch ($request){
                case 'last-reviews':
                    UserController::lastReviews();
                    break;
                default:
                    ResponseController::requestNotFound();
            }
        }
        else{
            echo "check your api value";
        }
    }
    elseif($method == "POST")
    {
        switch ($request){
            case 'register': // Регистрация
                UserController::createUser($_POST);
                break;
            case 'auth': // Авторизация
                UserController::authUser($_POST);
                break;
            case 'create-deal': // Создание сделки
                DealController::createDeal($_POST);
                break;
            case 'accept-deal': //принятие сделки
                DealController::acceptDeal($_POST);
                break;
            case 'decline-deal': // Отклонение сделки
                DealController::declineDeal($_POST);
                break;
            case 'info-deal': //информация о сделке
                DealController::infoDeal($_POST);
                break;
            case 'chat-history': // Сообщения сделки
                 ChatController::chatHistory($_POST);
                break;
            case 'chat-message': // Отправка сообщения сделки
                ChatController::sendMessage($_POST);
                break;
            case 'chat-listen': // Проверка сообщений
                ChatController::chatListen($_POST);
                break;
            case 'set-deal-review': // отзыв сделки
                DealController::setDealReview($_POST);
                break;
            case 'set-deal-status': // Установить статус сделки
                DealController::setDealStatus($_POST);
                break;
            case 'settings-change-mail': // Поменять почту
                SettingsController::changeMail($_POST);
                break;
            case 'settings-change-password': // Поменять пароль
                SettingsController::changePasswordMail($_POST);
                break;
            case 'set-new-password': // поставить новый пароль
                SettingsController::setNewPassword($_POST);
                break;
            case 'set-photo': // поставить аватарку
                SettingsController::uploadPhoto($_POST);
                break;
            case 'profile-info': // данные профиля
                UserController::profileData($_POST);
                break;


                // ADMIN  ROUTES //


            case 'admin-view-reports': // просмотр репортов
                (new viewReports)->allReports($_POST);
                break;
            case 'admin-report-info': // просмотр определеного репорта
                (new viewReports)->reportDetails($_POST);
                break;
            case 'admin-view-users': // просмотр пользователей
                (new AdminUsers)->viewUsers($_POST);
                break;


                // -------- //


            default:
                ResponseController::requestNotFound();
        }
    }