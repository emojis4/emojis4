<?php

class viewReports extends AdminController{
    public function allReports($data){
        if(AdminController::adminAuth($data['uApi'])){
            $reports = R::findAll('reports');
            $reportCount = R::count('reports', 'status = ?', [0]);

            isset($data['page']) ? $page = $data['page'] : $page = 1 ;
            $pageItems = 20;
            $paginate = $page * $pageItems;

            $sortedReports = [];
            foreach ($reports as $report) {
                $sortedReports[] = $report;
            }

            $paginatedReports = [];

            for($i = $paginate - $pageItems; $i < $paginate; $i++){
                if($sortedReports[$i] == null){
                    continue;
                }
                $paginatedUsers[] = $sortedReports[$i];
            }

            AdminResponse::repostsOutput($reportCount, $page, $paginatedUsers);
        }
    }
    public function reportDetails($data){
        if(AdminController::adminAuth($data['uApi'])){
            $report = R::findOne('reports', 'deal_id = ?', [$data['dealId']]);
            $reportDeal = R::findOne('deals', 'id = ?', [$data['dealId']]);
            $statuses = R::findOne('statuses', 'deal_id = ?', [$data['dealId']]);
            if($report){
                if($report['status'] == 0) {
                    $response = [
                        'dealId' => $data['dealId'],
                        'dealTitle' => $reportDeal['title'],
                        'customer' => $reportDeal['user_customer'],
                        'seller' => $reportDeal['user_seller'],
                        'recipient' => $reportDeal['recipient'],
                        'price' => $reportDeal['price'],
                        'date' => $reportDeal['date'],
                        'statuses' => [
                            'customer' => $statuses['user_customer'],
                            'seller' => $statuses['user_seller'],
                        ],
                        'messages' => AdminController::getMessages($data['dealId'])
                    ];
                    AdminResponse::reportDetails($response);
                }
                else {
                    AdminResponse::statusNotNull();
                }
            }
            else {
                AdminResponse::reportNotFound();
            }
        }
    }
}