eCardApp.controller('photoStiching', function ($scope, eCardAppService){
  var imgArray= eCardAppService.getUserImage();
  var pixcelArray= [];



  pixcelArray = new Uint32Array(imgArray[0].data.buffer);

  // for(var i=1; i<imgArray; i++){
  //   var currentImage = imgArray[i];

  //   var currentImage2 = 
  // }

});