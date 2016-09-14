var app = angular.module('ContactMgr', []);

app.controller('contactController', ['$scope', '$http', function($scope, $http){
var refresh = function(){
    $http.get('/contactList').success(function(response){
    $scope.contactList = response;
    $scope.contact="";
    });
};
refresh();

$scope.addContact = function(){
console.log($scope.contact);
    $http.post('/contactList', $scope.contact).success(function(response){

    //console.log(response);
    refresh();
    });

};

$scope.removeContact = function(id){
    //console.log("here i am" + id);
    $http.delete('/contactList/' + id).success(function(response){
        refresh();
    });
};

$scope.editContact = function(id){
    $http.get('/contactList/' + id).success(function(response){
        $scope.contact = response;
    });
};

$scope.updateContact = function(){
    $http.put('/contactList/' + $scope.contact._id, $scope.contact).success(function(response){
        refresh();
    });
};
}]);