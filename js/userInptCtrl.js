eCardApp.controller('eCardUserInput', function ($scope, eCardAppService){
	
	navigator.getUserMedia = (
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia
    );
 
    navigator.getUserMedia({
      video: true
    }, function (localMediaStream) {
 
        var video = document.querySelector('video');
        video.src = window.URL.createObjectURL(localMediaStream);
        video.play();
 
        var button = document.getElementById('Camerabutton');
        button.onclick = function () {
            var canvas = document.createElement('canvas');
            var w = 45;
            var h = 45;
            canvas.width  = w;
            canvas.height = h;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, w, h);


            var imgData = canvas.toDataURL("img/png");
            // console.log(imgData);
            
            eCardAppService.setUserImage(imgData);
            document.getElementById('cameraIMG').setAttribute( 'src', imgData);
    
        }
 
    }, function (err) {
    	alert(err);
    });

    $scope.errorMSG = false;



    $scope.submit = function(){

        if($scope.diff>0){
            $scope.errorMSG = false;
            $window.location.href = '#/page2';
            TimerService.storeInputs();
        }else{
            $scope.errorMSG = true;
        }

        
    }

})