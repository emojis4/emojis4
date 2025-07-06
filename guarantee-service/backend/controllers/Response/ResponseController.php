<?php

class ResponseController
{
    public static function created(): void
    {
        $res = [
            'status' => true,
            'message' => [
                'en' => 'Account created',
                'ru' => 'Аккаунт создан'
            ]
        ];
        print_r(json_encode($res));
    }

    public static function notCreated(): void
    {
        $res = [
            "status" => false,
            'message' => [
                'en' => "Something went wrong. Please try again later",
                'ru' => "Что-то пошло не так. Попробуйте позже"
            ]
        ];
        print_r(json_encode($res));
    }

    public static function notSuitable(): void
    {
        $res = [
            "status" => false,
            'message' => [
                'en' => "You mush have password length no less than 8 and login 4",
                'ru' => "Вы должны создать пароль с длинной не менее 8 символов и логином не менее 4"
            ]
        ];
        print_r(json_encode($res));
    }

    public static function accountBusy(): void
    {
        $res = [
            'status' => false,
            'message' => [
                'en' => 'login or email already used',
                'ru' => "Логин уже занят"
            ]
        ];
        print_r(json_encode($res));
    }

    public static function noEnoughMoney(): void
    {
        $res = [
            'status' => false,
            'message' => [
                'en' => 'Cant create deal because you dont have enough money',
                'ru' => 'Вы не можете создать сделку, так как у вас не хватает денег'
            ]
        ];
        print_r(json_encode($res));
    }

    public static function authSuccessfully($response): void
    {
        $res = [
            'status' => true,
            'message' => [
                'en' => 'You successfully login',
                'ru' => 'Вы успешно вошли'
            ],
            'login' => $response->login,
            'balance' => $response->balance,
            'apiKey' => $response->user_api,
            'admin' => $response->admin
        ];
        print_r(json_encode($res));
    }

    public static function notFound(): void
    {
        $res = [
            'status' => false,
            'message' => [
                'en' => 'login or password is invalid',
                'ru' => 'Логин или пароль неверный'
            ]
        ];
        print_r(json_encode($res));
    }

    public static function requestNotFound(): void
    {
        $res = [
            'status' => false,
            'message' => [
                'en' => 'Request not found. Check your url',
                'ru' => 'Запрос не найден. Проверьте ваши настройки'
            ]
        ];
        print_r(json_encode($res));
    }

    public static function profileInfo($user, $username, $dealsCount, $successDeals, $cancelDeals, $reviewCount, $reviewAverage, $reviews, $deals, $dealsWait, $holds): void
    {
        $res = [
            'user' => [
                'login' => $user->login,
                'level' => $user->level,
                'avatar' => $user->image,
            ],
            'deal' => [
                'dealsCount' => $dealsCount,
                'successDeals' => $successDeals,
                'cancelDeals' => $cancelDeals,
                'allDeals' => $deals
            ],
            'review' => [
                'reviewCount' => $reviewCount,
                'reviewAverage' => $reviewAverage,
                'allReviews' => $reviews
            ]
        ];
        if (empty($username)) { // Если отсутствует никнейм, указываемый при поиске профиля пользователя, выводим его баланс
            $res['user']['balance'] = $user->balance;
            $res['user']['holds'] = $holds;
            $res['wait'] = $dealsWait;
        }
        print_r(json_encode($res));
    }

    public static function dealUsersNotMatch(): void
    {
        $res = [
            'status' => false,
            'message' => [
                'en' => 'deal users dont match',
                'ru' => 'Пользователи сделки не найдены'
            ]
        ];
        print_r(json_encode($res));
    }

    public static function dealAction($status): void
    {
        $res = [
            'status' => true,
        ];
        if ($status == "process") {
            $res['message']['en'] = 'deal was successfully accepted';
            $res['message']['ru'] = 'Сделка принята';
        } else {
            $res['message']['en'] = 'deal was successfully declined';
            $res['message']['ru'] = 'Сделка отменена';
        }
        print_r(json_encode($res));
    }

    public static function dealInProcess(): void
    {
        $res = [
            'status' => false,
            'message' => [
                'en' => 'deal in process status yet',
                'ru' => 'Сделка уже в процессе'
            ]
        ];
        print_r(json_encode($res));
    }

    public static function profileNotFound(): void
    {
        $res = [
            'status' => false,
            'message' => [
                'en' => 'user not found',
                'ru' => 'Пользователь не найден'
            ]
        ];
        print_r(json_encode($res));
    }

    public static function reviewsResponse($reviews): void
    {
        $res = [
            'status' => true,
            'reviews' => $reviews
        ];
        print_r(json_encode($res));
    }

    public static function reviewsNotFound(): void
    {
        $res = [
            'status' => false,
            'message' => [
                'en' => 'reviews not found',
                'ru' => 'Отзывы не найдены'
            ]
        ];
        print_r(json_encode($res));
    }

    public static function dealCreated(): void
    {
        $res = [
            'status' => true,
            'message' => [
                'en' => 'deal was successfully created',
                'ru' => 'Сделка успешно создана'
            ]
        ];
        print_r(json_encode($res));
    }

    public static function recipientNotFound(): void
    {
        $res = [
            'status' => false,
            'message' => [
                'en' => 'recipient not found',
                'ru' => 'Партнер не найден'
            ]
        ];
        print_r(json_encode($res));
    }

    public static function responseChatHistory($messages): void
    {
        $res = [
            'status' => true,
            'messages' => $messages
        ];
        print_r(json_encode($res));
    }

    public static function messageSended(): void
    {
        $res = [
            'status' => true,
            'message' => [
                'en' => 'message was send',
                'ru' => 'Сообщение отправлено'
            ]
        ];
        print_r(json_encode($res));
    }

    public static function noNewMessages(): void
    {
        $res = [
            'status' => false,
            'message' => [
                'en' => 'no new messages yet',
                'ru' => 'Сообщений еще нет'
            ]
        ];
        print_r(json_encode($res));
    }

    public static function newMessages($newMessages): void
    {
        $res = [
            'status' => true,
            'messages' => $newMessages
        ];
        print_r(json_encode($res));
    }

    public static function responseDealInfo($deal): void
    {
        $res = [
            'status' => true,
            'deal' => $deal
        ];
        print_r(json_encode($res));
    }

    public static function sameUser(): void
    {
        $res = [
            'status' => false,
            'message' => [
                'en' => 'Users are same',
                'ru' => 'Пользователи не могут быть схожи'
            ]
        ];
        print_r(json_encode($res));
    }

    public static function argumentError(): void
    {
        $res = [
            'status' => false,
            'message' => [
                'en' => 'Your request is not accepted. Check your arguments',
                'ru' => 'Проверьте аргументы запроса'
            ]
        ];
        print_r(json_encode($res));
    }

    public static function fieldIsFilled(): void
    {
        $res = [
            'status' => false,
            'message' => [
                'en' => 'Your request is not accepted. You send this request earlier',
                'ru' => 'Вы уже отправляли этот запрос'
            ]
        ];
        print_r(json_encode($res));
    }

    public static function successfully(): void
    {
        $res = [
            'status' => true,
            'message' => [
                'en' => 'Your request is accepted.',
                'ru' => 'Ваш запрос принят'
            ]
        ];
        print_r(json_encode($res));
    }

    public static function accessDenied(): void
    {
        $res = [
            'status' => false,
            'message' => [
                'en' => 'Your request is not accepted. Permission denied',
                'ru' => 'Отказано в доступе'
            ]
        ];
        print_r(json_encode($res));
    }

    public static function actionNotFound(): void
    {
        $res = [
            'status' => false,
            'message' => [
                'en' => 'Your request is not accepted. Your request not found some db notes',
                'ru' => 'Запрос не содержит никаких записей'
            ]
        ];
        print_r(json_encode($res));
    }

    public static function dealNotFound(): void
    {
        $res = [
            'status' => false,
            'message' => [
                'en' => 'Deal not found',
                'ru' => 'Сделка не найдена'
            ]
        ];
        print_r(json_encode($res));
    }

    public static function dealWasNotEnded(): void
    {
        $res = [
            'status' => false,
            'message' => [
                'en' => 'Deal was not ended',
                'ru' => 'Сделка не закончена'
            ]
        ];
        print_r(json_encode($res));
    }

    public static function reviewIsFilled(): void
    {
        $res = [
            'status' => false,
            'message' => [
                'en' => 'You was write review yet',
                'ru' => 'Вы уже написали отзыв'
            ]
        ];
        print_r(json_encode($res));
    }

    public static function partnerNotAccept(): void
    {
        $res = [
            'status' => false,
            'message' => [
                'en' => 'Partner was not accept deal or decline deal',
                'ru' => 'Партнер не принял или отменил сделку'
            ]
        ];
        print_r(json_encode($res));
    }

    public static function emailNotFound(): void
    {
        $res = [
            'status' => false,
            'message' => [
                'en' => 'Email not found',
                'ru' => 'Почтовый адрес не найден'
            ]
        ];
        print_r(json_encode($res));
    }

    public static function invalidPassword(): void
    {
        $res = [
            'status' => false,
            'message' => [
                'en' => 'invalid password',
                'ru' => 'Неверный пароль'
            ]
        ];
        print_r(json_encode($res));
    }

    public static function tokenNotFound(): void
    {
        $res = [
            'status' => false,
            'message' => [
                'en' => 'Token not found',
                'ru' => 'Токен не найден'
            ]
        ];
        print_r(json_encode($res));
    }

    public static function tokenExpire(): void
    {
        $res = [
            'status' => false,
            'message' => [
                'en' => 'Token expire. Create new.',
                'ru' => 'Токен истек. Создайте новый.'
            ]
        ];
        print_r(json_encode($res));
    }

    public static function uploadProblems(): void
    {
        $res = [
            'status' => false,
            'message' => [
                'en' => 'Upload problems. Please try again later',
                'ru' => 'Проблемы с загрузкой. Попробуйте позже.'
            ]
        ];
        print_r(json_encode($res));
    }

    public static function emptyResponse(): void
    {
        $res = [
            'status' => false,
            'message' => [
                'en' => 'Empty response. Nothing found.',
                'ru' => 'Ничего не найдено'
            ]
        ];
        print_r(json_encode($res));
    }
    public static function emptyMessage(): void
    {
        $res = [
            'status' => false,
            'message' => [
                'en' => 'Empty message. You can not send empty message.',
                'ru' => 'Вы не можете отправить пустое сообщение.'
            ]
        ];
        print_r(json_encode($res));
    }

}

