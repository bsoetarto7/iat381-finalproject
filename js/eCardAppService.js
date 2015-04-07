// This is the service to pass variables and open database for the different controllers
eCardApp.service('eCardAppService', function() {
	var imgDatabase = [];
	var dataLength;
	var curentData;
	var currentIndex;
	var getLength = function(){
		dataLength = imgDatabase.length;
		return dataLength;
	}
	var selectIndex = function(index){
		currentIndex = index;
	}
	var getIndex = function(){
		return currentIndex;
	}
	var getCurentData = function(){
		return curentData;
	}
	var setUserImage = function(newObj){
		curentData = [newObj];
		sklad.open('eCard_store', {
			version: 1,
			migration: {
				'1': function (database) {
					var objStore = database.createObjectStore('photosURL', {
						autoIncrement: true,
						keyPath: 'timestamp'
					});
					objStore.createIndex('imgdata_search', 'imgdata', {unique: true});
				},
				'2': function (database) {
				}
			}
		}, 
		function (err, conn) {
			if (err) { throw err; }
			$(function () {
				conn.insert({
					photosURL: [
					{ 
						timestamp: Date.now(),
						imgdata: newObj
					}
					]
				}, function (err, insertedKeys) {
					if (err) { return console.error(err); }
				})
			});
		});
	}

	return {
		getCurentData: getCurentData,
		getLength : getLength,
		setUserImage: setUserImage,
		getIndex: getIndex,
		selectIndex: selectIndex
	};
})