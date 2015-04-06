eCardApp.controller('homeControl', function ($scope, eCardAppService){
	$scope.message='';
	$scope.dataBase= eCardAppService.getUserImage();

	$scope.imgShow = [];

	// check the list see if there is nothing in the list,
	// show the user additional steps need to be add 
	if(eCardAppService.getUserImage().length == 0){
		$scope.message = "There is no picture yet, create a new one";
	}

	if(!$scope.message){
		$scope.myValue= true;
	}

	for (var i=0; i<$scope.dataBase.length; i++){

    	var Repeat ={
    		'img':$scope.dataBase[i][3]
    	};

    	$scope.imgShow.push(Repeat);
    }
});