eCardApp.service('eCardAppService', function() {
	var imgDatabase = [];
	var setUserImage = function(newObj){
		imgDatabase.push(newObj);
		console.log(imgDatabase);
	}


	return {
		setUserImage: setUserImage,



	};
})