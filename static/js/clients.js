var app = angular.module('hotelApp', []);
			
app.controller('clientsController', function($scope, $http) {
	
	$scope.getClients = function() {
		$http.get("getClients").then(function (response) {
			$scope.clients = response.data;
		});
	}
	
	$scope.deleteClient = function(client) {
		let answer = confirm('Are you sure you want to delete this client permenantly?');
		if(answer){
			// default post header
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
			$http({
				url: 'deleteClient',
				method: 'post', 
				data: $.param({id: client._id}),
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}).success(function(res) {
				console.log('Client has been deleted successfully');
				location.reload();
			}, function(error) {
				console.log(error);
			});
		}
	}
	
	$scope.editClient = function(client) {
		$("#firstName").val(client.firstName);
		$("#lastName").val(client.lastName);
		$("#country").val(client.country);
		$("#dob").val(client.dob);
		$("#id").val(client._id);
	}
	
});

function logout(){
	window.location = 'login';
}