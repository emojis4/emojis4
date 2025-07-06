<?php

class AdminUsers extends AdminController{
    public function viewUsers($data){
        if(AdminController::adminAuth($data['uApi'])){
            $users = R::findAll('users');
            $usersCount = R::count('users');

            isset($data['page']) ? $page = $data['page'] : $page = 1 ;
            $pageItems = 20;
            $paginate = $page * $pageItems;

            $sortedUsers = [];
            foreach ($users as $user) {
                $sortedUsers[] = $user;
            }

            $paginatedUsers = [];

            for($i = $paginate - $pageItems; $i <= $paginate; $i++){
                if($sortedUsers[$i] == null){
                    continue;
                }
                $paginatedUsers[] = $sortedUsers[$i];
            }

            AdminResponse::usersOutput($usersCount, $paginatedUsers, $page);
        }
    }
}