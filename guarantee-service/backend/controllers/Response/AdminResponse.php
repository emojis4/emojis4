<?php

class AdminResponse{
    public static function repostsOutput($count, $page, $reports): void
    {
        $res = [
            'status' => true,
            'reportsCount' => $count,
            'page' => $page,
            'reports' => $reports
        ];
        print_r(json_encode($res));
    }
    public static function usersOutput($usersCount, $users, $page): void
    {
        $res = [
            'status' => true,
            'usersCount' => $usersCount,
            'page' => $page,
            'users' => $users
        ];
        print_r(json_encode($res));
    }
    public static function reportDetails($data): void
    {
        $res = [
            'status' => true,
            'details' => $data
        ];
        print_r(json_encode($res));
    }
    public static function statusNotNull(): void
    {
        $res = [
            'status' => false,
            'message' => [
                'en' => 'Deal status already changed',
                'ru' => 'Статус сделки уже изменен'
            ]
        ];
        print_r(json_encode($res));
    }
    public static function reportNotFound(): void
    {
        $res = [
            'status' => false,
            'message' => [
                'en' => 'Report not found',
                'ru' => 'Репорт не найден'
            ]
        ];
        print_r(json_encode($res));
    }
}