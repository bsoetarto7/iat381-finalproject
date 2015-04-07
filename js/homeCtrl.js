// This is where the home controller, where the data from the database is pulled for displayed

eCardApp.controller('homeControl', function ($scope, eCardAppService, $window){
	$scope.message='';

	$scope.dataBase=[];
	
	$scope.imgShow = [];
	var msg = document.getElementById('MSG');
	if($scope.dataBase.length == 0){
		msg.innerHTML = "There is no picture yet or it is loading please wait...";
	}

	// Open Database
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
			var $list = $('#list')
			function updateRows(conn) {
				conn
				.get({
					photosURL: {imgdata: sklad.DESC, index: 'imgdata_search'}
				}, function (err, data) {
					if (err) { return console.error(err); }

						$scope.dataBase = data.photosURL;
		
						// Hide the err message
						if($scope.dataBase.length>0){
							msg.innerHTML='';
						}
						var gallery = document.getElementById('show');
						gallery.innerHTML = '';

						// Print out the panorama image by creating img dom elements and append to gallery dom
						for (i = 0; i < $scope.dataBase.length; i++) {
							
							var ele = document.createElement('img');
							ele.setAttribute('src', $scope.dataBase[i].key[3]);
							ele.setAttribute('id', i);
							ele.classList.add("homeDisplay");
							ele.addEventListener("click", function($event){
								eCardAppService.selectIndex(this.id);
						        $window.location.href = '#/page3';
							});
                
  
						    gallery.appendChild(ele);
						 }					
				});
			}
			updateRows(conn);
		});
	});

});