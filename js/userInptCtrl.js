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
            var w = 450;
            var h = 450;
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



    // $scope.submit = function(){

    //     if($scope.diff>0){
    //         $scope.errorMSG = false;
    //         $window.location.href = '#/page2';
    //         TimerService.storeInputs();
    //     }else{
    //         $scope.errorMSG = true;
    //     }

        
    // }

    window.addEventListener("devicemotion", function(event) {
        // Process
        // event.acceleration.x
        // event.acceleration.y
        // event.acceleration.z,
        // event.accelerationIncludingGravity.x,
        // event.accelerationIncludingGravity.y,
        // event.accelerationIncludingGravity.z,
        // event.rotationRate.alpha,
        // event.rotationRate.beta,
        // event.rotationRate.gamma,
        // event.interval

        
    }, true);

    window.ondevicemotion = function(event) {
        // Or you can process the same event values here
        document.getElementById('test').innerHTML= "x: "+event.accelerationIncludingGravity.x;
        document.getElementById('test1').innerHTML= "y: "+event.accelerationIncludingGravity.y;
        document.getElementById('test2').innerHTML= "z: "+event.accelerationIncludingGravity.z;
    }

})