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


    var editArray = [];

    var stitched;

    var displayImage = "";

    $scope.loading = true;

    var goodButton = document.getElementById('good');
    var retakeButton = document.getElementById('retake');
    var cameraButton = document.getElementById('Camerabutton');





    function stitchImagesGradient(image1, image2, offsetRatio, offsetQuotient, offsetFactor) {
        var canvas = document.createElement('canvas');
        var offset = image2.width*offsetRatio;
        canvas.width = image1.width + image2.width*offsetFactor;
        canvas.height = image1.height;

        var context = canvas.getContext('2d');
        context.fillStyle = 'black';
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.drawImage(image1, 0, 0, image1.width, image1.height);

        var linearGradient = context.createLinearGradient(0, 0, offset/offsetQuotient, 0);
        linearGradient.addColorStop(0, "transparent");
        linearGradient.addColorStop(1, "#000");

        context.drawImageGradient(image2, offset, 0, linearGradient);

        displayImage = canvas.toDataURL('image/png');

        var image = document.createElement('img');
        image.src = canvas.toDataURL('image/png');   

        return image;
    }

    function sliceImage(image) {
        var canvas = document.createElement('canvas');
        canvas.width = image.width / 3;
        canvas.height = image.height;

        var context = canvas.getContext('2d');

        context.drawImage(image, 0, 0, image.width, image.height);

        var image1 = document.createElement('img');
        image1.src = canvas.toDataURL();

        context.drawImage(image, -image.width/3, 0, image.width, image.height);

        var image2 = document.createElement('img');
        image2.src = canvas.toDataURL();

        context.drawImage(image, -image.width/3*2, 0, image.width, image.height);
        var image3 = document.createElement('img');
        image3.src = canvas.toDataURL();

        console.log(image1.width+" width " + image1.height+" height ");
        console.log(image2.width+" width " + image2.height+" height ");
        console.log(image3.width+" width " + image3.height+" height ");

        return [image1, image2, image3];
    }

    function toSquare(image) {
        var canvas = document.createElement('canvas');

        var xOffset = 0;
        var yOffset = 0;

        if (image.width > image.height) {
            canvas.width = image.height;
            canvas.height = image.height;

            xOffset = (image.width - canvas.width) / 2;
        } else {
            canvas.width = image.width;
            canvas.height = image.width;

            yOffset = (image.height - canvas.height) / 2;
        }
        
        var context = canvas.getContext('2d');
        context.drawImage(image, 0, yOffset, 450, 450);



        var retImage = document.createElement('img');
        retImage.src = canvas.toDataURL();


        // console.log(retImage.width+" width " + retImage.height+" height ");
        // document.body.appendChild(retImage);
        // document.body.appendChild(document.createElement('br'));


        return retImage.src;
    }

    navigator.getUserMedia({
      video: true
    }, function (localMediaStream) {
 
        var video = document.querySelector('video');
        video.src = window.URL.createObjectURL(localMediaStream);
        video.play();
       
        var takePicture = function () {

            var canvas = document.createElement('canvas');
            var w =450;
            var h = 450;
            canvas.width  = w;
            canvas.height = h;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, w, h);

            var imgData = canvas.toDataURL("img/png");

            editArray.push(imgData);

            if(editArray.length == 4){
                getImage(editArray[0]).then(function (image1) {
                    return getImage(editArray[1]).then(function (image2) {
                        return getImage(editArray[2]).then(function (image3){
                            return getImage(editArray[3]).then(function (image4){
                                return [image1, image2,image3,image4];
                                // return getImage(editArray[4]).then(function (image5){
                                    // return [image1, image2,image3,image4,image5];
                                // })
                            })
                        })
                    })
                }).then(function (images) {
                    
                    stitched = stitchImagesGradient(images[0], images[1], 0.7, 10, 0.7);
                    stitched = stitchImagesGradient(stitched, images[2], 1.4, 10, 0.7);
                    stitched = stitchImagesGradient(stitched, images[3], 2.1, 10, 0.7);
                    // stitched = stitchImagesGradient(stitched, images[4], 2.8, 10, 0.7);
                   
                    document.getElementById('displayPanorama').setAttribute( 'src', displayImage);
                });
            }            

            function getImage(name) {
                return new Promise(function (resolve, reject) {
                    var image = document.createElement('img');
                    image.onload = function () {
                        resolve(image);
                    }
                    image.src = name;
                });
            }
        }

        window.addEventListener("devicemotion", function(event) {
        }, true);

        window.ondevicemotion = function(event) {
            cameraButton.onclick = function(){

                takingImage = true;
                imageAvalible = true;

            }

            if(takingImage){
                if(Math.abs(event.rotationRate.beta) >=0.75){
                    imageAvalible = true;
                }else{
                    if(imageAvalible && Math.abs(event.rotationRate.beta) < 0.05 && imageMax<=3){
                        console.log("working");
                        takePicture();
                        imageAvalible = false;
                        imageMax++;
                    }
                }
            }
        }


 
    }, function (err) {
    	alert(err);
    });

    retakeButton.onclick = function(){

        imageAvalible = false;
        takingImage = false;
        imageMax=0;

        editArray = [];

        displayImage = "";

        document.getElementById('displayPanorama').setAttribute( 'src', displayImage);
    }

    goodButton.onclick = function(){
        if(imageMax == 4){
            var resultArray = sliceImage(stitched);
            resultArray[0] = toSquare(resultArray[0]);
            resultArray[1] = toSquare(resultArray[1]);
            resultArray[2] = toSquare(resultArray[2]);

            resultArray[3] = displayImage;


            eCardAppService.setUserImage(resultArray);
            document.getElementById('good').setAttribute( 'href', "#/page2");

        }else{
            alert("Error please take 3 images");
        }
    }



});