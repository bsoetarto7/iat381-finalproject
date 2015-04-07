// This is where the users input such as the pictures and for the picture's slicing, scaling, to square
eCardApp.controller('eCardUserInput', function ($scope, eCardAppService,$window){
    
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

    var goodButton = document.getElementById('good');
    var retakeButton = document.getElementById('retake');
    var cameraButton = document.getElementById('Camerabutton');

    // Stiching the 4 images
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

    // Scaling the image to a certain size
    function scaleSquareImage(image, newDimensions) {
        if (image.width !== image.height) { throw new Error('Must be square!'); }
        var canvas = document.createElement('canvas');
        canvas.width = newDimensions;
        canvas.height = newDimensions;
        var context = canvas.getContext('2d');
        context.drawImage(image, 0, 0);
        var retImage = document.createElement('img');
        retImage.src = canvas.toDataURL();
        console.log(retImage.width+" width " + retImage.height+" height ");
        
        return retImage.src;
    }

    // Slicing the image to 3 for viewing
    function sliceImage(image) {
        var canvas = document.createElement('canvas');
        if (image.width > image.height) {
            canvas.width = image.height;
            canvas.height = image.height;
        } else {
            canvas.width = image.width;
            canvas.height = image.width;
        }
        var context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, image.width, image.height);
        var image1 = document.createElement('img');
        image1.src = canvas.toDataURL('image/png');
        context.drawImage(image, -image.height, 0, image.width, image.height);
        var image2 = document.createElement('img');
        image2.src = canvas.toDataURL('image/png');
        context.drawImage(image, -image.height*2, 0, image.width, image.height);
        var image3 = document.createElement('img');
        image3.src = canvas.toDataURL('image/png');

        return [image1, image2, image3];
    }

    // Change the image to square
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

        return retImage.src;
    }

    // Getting the image and creating them to dom for manipulation
    function getImage(name) {
        return new Promise(function (resolve, reject) {
            var image = document.createElement('img');
            image.setAttribute('crossOrigin', 'anonymous');
            image.onload = function () {
                resolve(image);
            }
            image.src = name;
        });
    }

    // Camera API to work
    navigator.getUserMedia({
      video: true
    }, function (localMediaStream) {
 
        var video = document.querySelector('video');
        video.src = window.URL.createObjectURL(localMediaStream);
        video.play();
       
        // Once users click the picture button
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

            // Getting the images and sticthing them
            if(editArray.length == 4){
                getImage(editArray[0]).then(function (image1) {
                    return getImage(editArray[1]).then(function (image2) {
                        return getImage(editArray[2]).then(function (image3){
                            return getImage(editArray[3]).then(function (image4){
                                return [image1, image2,image3,image4];
                            })
                        })
                    })
                }).then(function (images) {
                    
                    stitched = stitchImagesGradient(images[0], images[1], 0.7, 10, 0.7);
                    stitched = stitchImagesGradient(stitched, images[2], 1.4, 10, 0.7);
                    stitched = stitchImagesGradient(stitched, images[3], 2.1, 10, 0.7);
   
                   
                    document.getElementById('displayPanorama').setAttribute( 'src', displayImage);
                });
            }            
            
        }

        // This is where we calculate the beta acceleration and allow it to take pictures automaticall when they slow down to a 
        // angle view that they want to take.
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

    // To retake the pictures if they do not like it
    retakeButton.onclick = function(){
        imageAvalible = false;
        takingImage = false;
        imageMax=0;
        editArray = [];
        displayImage = "";
        document.getElementById('displayPanorama').setAttribute( 'src', displayImage);
    }

    // To proceed to view the image after they have taken it.
    goodButton.onclick = function(){
        if(imageMax == 4){
            var resultArray = sliceImage(stitched);
                     
            resultArray[0] = scaleSquareImage(resultArray[0], 450);
            resultArray[1] = scaleSquareImage(resultArray[1], 450);
            resultArray[2] = scaleSquareImage(resultArray[2], 450);
            resultArray[3] = displayImage;
            eCardAppService.setUserImage(resultArray);
            eCardAppService.selectIndex(-1);
            document.getElementById('good').setAttribute( 'href', "#/page3");
        }else{
            alert("Error please take 4 images");
        }
    }

    // FLickr api to grab images
    $scope.flickrKey = "Flickr Search";
    $scope.flickrSearch = function () {
        var flickr = new Flickr({
          api_key: "228b253a143eb134bf3edebbdfa16a8a"
        });
        flickr.photos.search({
          text: $scope.flickrKey +" panorama"
        }, function(err, result) {
          if(err) { throw new Error(err); }

          // Append pictures to gallery dom by adding img tags into it
            var gallery = document.getElementById('gallery-flickr');
                gallery.innerHTML = '';
            for (i = 0; i < 5; i++) {
                var imglink = "https://farm"+result.photos.photo[i].farm+".staticflickr.com/"+result.photos.photo[i].server+"/"+result.photos.photo[i].id+"_"+result.photos.photo[i].secret+"_b.jpg" 
                var ele = document.createElement('img');
                ele.setAttribute('src', imglink);
                ele.classList.add("imgBar");
                ele.addEventListener("click", function($event){
                    
                    var targetString = event.target.getAttribute('src');
                   
                
                });
                
                gallery.appendChild(ele);
            }
            
            
        });
    }
});