var app = angular.module('hotelApp', []);
			
app.controller('usersController', function($scope, $http) {
	
	$scope.getUsers = function() {
		$http.get("getUsers").then(function (response) {
			$scope.users = response.data;
		});
	}
	
	$scope.deleteUser = function(user) {
		let answer = confirm('Are you sure you want to delete this user permenantly?');
		if(answer){
			// default post header
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
			$http({
				url: 'deleteUser',
				method: 'post', 
				data: $.param({id: user._id}),
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}).success(function(res) {
				console.log('User has been deleted successfully');
				location.reload();
			}, function(error) {
				console.log(error);
			});
		}
	}
	
	$scope.editUser = function(user) {
		$("#id").val(user._id);
		$("#userName").val(user.userName);
		$("#password").val(user.password);
		$("#email").val(user.email);
		if(user.admin){
			document.getElementById("admin").checked = true;
		}else{
			document.getElementById("admin").checked = false;
		}
	}
	
});

function logout(){
	window.location = 'login';
}