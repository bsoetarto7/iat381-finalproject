eCardApp.controller('eCardUserInput', function ($scope, eCardAppService){
	
	navigator.getUserMedia = (
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia
    );

    var imageAvalible = false;
    var takingImage = false;
    var imageMax=0;
 
    navigator.getUserMedia({
      video: true
    }, function (localMediaStream) {
 
        var video = document.querySelector('video');
        video.src = window.URL.createObjectURL(localMediaStream);
        video.play();
 
        var button = document.getElementById('Camerabutton');
        var takePicture = function () {
            var canvas = document.createElement('canvas');
            var w = 450;
            var h = 450;
            canvas.width  = w;
            canvas.height = h;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, w, h);


            var imgData = canvas.toDataURL("img/png");
          
            
            eCardAppService.setUserImage(imgData);
            document.getElementById('cameraIMG').setAttribute( 'src', imgData);

            document.getElementById('print').innerHTML= "working";
    
        }

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
            // document.getElementById('tes1').innerHTML= "x without gravity: "+event.acceleration.x;
            // document.getElementById('tes2').innerHTML= "y without gravity:: "+event.acceleration.y;
            // document.getElementById('tes3').innerHTML= "z without gravity:: "+event.acceleration.z;


            // document.getElementById('test').innerHTML= "x: "+event.accelerationIncludingGravity.x;
            // document.getElementById('test1').innerHTML= "y: "+event.accelerationIncludingGravity.y;
            // document.getElementById('test2').innerHTML= "z: "+event.accelerationIncludingGravity.z;

            // document.getElementById('test3').innerHTML= "alpha: "+event.rotationRate.alpha;
            // document.getElementById('test4').innerHTML= "beta: "+event.rotationRate.beta;
            // document.getElementById('test5').innerHTML= "gamma: "+event.rotationRate.gamma;
            button.onclick = function(){
                takingImage = true;
                imageAvalible = true;

            }

            if(takingImage){
                if(Math.abs(event.accelerationIncludingGravity.x) >=0.75){
                    imageAvalible = true;
                }else{
                    if(imageAvalible && Math.abs(event.accelerationIncludingGravity.x) < 0.05 && imageMax<=4){
                        takePicture();
                        document.getElementById('test4').innerHTML= "beta: "+event.accelerationIncludingGravity.x;
                        imageAvalible = false;
                        imageMax++;
                    }
                }

            }
            
            
        }


 
    }, function (err) {
    	alert(err);
    });

    $scope.errorMSG = false;

})