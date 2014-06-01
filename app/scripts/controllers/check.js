app.controller('CheckCtrl', function($rootScope, $scope, $q, $routeParams, $location, authService, $modal, $http, ApiService, $log, notificationFactory, groupService, destiSelectedService) {

    if (!authService.data.userInfo.groups.contains($routeParams.groupId)) $location.path('/');

    $scope.groupId = $routeParams.groupId;
    $scope.infoUser = authService.data.userInfo;

    $scope.checkPlan = false;
    $scope.destinationMoreVotated = 0;
    $scope.transportMoreVoted = 0;
    $scope.sleepMoreVoted = 0;
    $scope.bestPackTrue = false;
    $scope.aceptanPlan = 0;
    $scope.rechazanPlan = 0;
    $scope.infoGroup;
    $scope.userNotVoted = [];

    var getGroup = function() {

        var deferred = $q.defer();

        return ApiService.getGroup($scope.groupId).success(function(response) {
            $scope.infoGroup = angular.copy(response);
            groupService.setGroup(response);
        });

        deferred.resolve();
        return deferred.promise;
    };

    getGroup().then(function() {
        bestPackShare();
        aceptanRechazanPlan();
        noVoted();
        getUser();

    });

    var bestPackShare = function() {
        $scope.bestPackTrue;
        $scope.destinationMoreVotated;
        $scope.transportMoreVoted;
        $scope.sleepMoreVoted;
        $scope.checkPlan;

        return ApiService.getGroup($scope.groupId).success(function(response) {

            var infoGroup = angular.copy(response);
            var infoGroupDesti = infoGroup.destinations;

            for (var i = infoGroup.transportCards.length - 1; i >= 0; i--) {

                if (infoGroup.transportCards[i].bestPack == true) {
                    $scope.destinationMoreVotated = infoGroup.transportCards[i].destination;
                    $scope.bestPackTrue = true;
                }

            }

            for (var i = infoGroup.transportCards.length - 1; i >= 0; i--) {

                if (infoGroup.transportCards[i].destination == $scope.destinationMoreVotated) {

                    if (infoGroup.transportCards[i].bestPack == true) {
                        $scope.transportMoreVoted = infoGroup.transportCards[i];
                        $scope.checkPlan = true;
                    }
                }
            }

            for (var i = infoGroup.placeToSleepCards.length - 1; i >= 0; i--) {

                if (infoGroup.placeToSleepCards[i].destination == $scope.destinationMoreVotated) {

                    if (infoGroup.placeToSleepCards[i].bestPack == true) {
                        $scope.sleepMoreVoted = infoGroup.placeToSleepCards[i];

                    }
                }
            }

        });

    }

    var aceptanRechazanPlan = function() {
        $scope.aceptanPlan = $scope.infoGroup.positiveVotes;
        console.log("Users aceptan");
        console.log($scope.aceptanPlan);
        $scope.rechazanPlan = $scope.infoGroup.negativeVotes;
        console.log("Users no aceptan");
        console.log($scope.rechazanPlan);



    }

    var noVoted = function() {
        $scope.userNotVoted = [];
        var aux = false;
        var usersVoter = $scope.aceptanPlan.concat($scope.rechazanPlan);
        console.log(usersVoter);

        for (var i = $scope.infoGroup.users.length - 1; i >= 0; i--) {

            for (var e = usersVoter.length - 1; e >= 0; e--) {
                //var aux2 = aux;
                if ($scope.infoGroup.users[i] == usersVoter[e]) {
                    aux = true;
                }


            }

            if (aux == false) {
                $scope.userNotVoted.push($scope.infoGroup.users[i]);

            }

        }


    }

    var getUser = function() {
        $scope.infoUserVoteSi = [];
        $scope.infoUserVoteNo = [];
        $scope.infoUserNotVote = [];

        for (var i = $scope.aceptanPlan.length - 1; i >= 0; i--) {
            ApiService.getUser($scope.aceptanPlan[i]).success(function(response) {
                $scope.infoUserVoteSi.push({
                    'name': response.name,
                    'lastName': response.lastName
                });
            })
        };
        


        for (var i = $scope.rechazanPlan.length - 1; i >= 0; i--) {
            ApiService.getUser($scope.rechazanPlan[i]).success(function(response) {
                $scope.infoUserVoteNo.push({
                    'name': response.name,
                    'lastName': response.lastName
                });
            })
        };
        


        for (var i = $scope.userNotVoted.length - 1; i >= 0; i--) {
            ApiService.getUser($scope.userNotVoted[i]).success(function(response) {
                $scope.infoUserNotVote.push({
                    'name': response.name,
                    'lastName': response.lastName
                });
            })
        };
        


    }

});