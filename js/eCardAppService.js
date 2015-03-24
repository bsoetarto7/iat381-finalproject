eCardApp.service('eCardAppService', function() {
	var imgDatabase = [];
	var setUserImage = function(newObj){
		imgDatabase.push(newObj);
		console.log(imgDatabase);
	}
	var getUserImage = function(){
		return imgDatabase;
	}


	return {
		setUserImage: setUserImage,
		getUserImage: getUserImage


	};


})