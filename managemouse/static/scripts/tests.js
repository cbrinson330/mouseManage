// Tests for rest api
(function(){

var urls = new Array();
var urlBase = 'restAPI';
var values = [1,'foo',2134, true, false, 2.34];
var cage[
  'restAPI/cage/post?id=3&isBreeding=true',
  'restAPI/cage/post?id=3&isBreeding=false',
  'restAPI/cage/post?id=40000&isBreeding=true',
  'restAPI/cage/post?id=3&isBreeding=true',
  'restAPI/cage/post?id=3&isBreeding=true',
  'restAPI/cage/post?id=3&isBreeding=true',
  'restAPI/cage/post?id=3&isBreeding=true',
  'restAPI/cage/post?id=3&isBreeding=true',
  'restAPI/cage/post?id=3&isBreeding=true',
  'restAPI/cage/post?id=3&isBreeding=true',
  'restAPI/cage/post?id=3&isBreeding=true',
  'restAPI/cage/post?id=3&isBreeding=true',
  'restAPI/cage/post?id=3&isBreeding=true',
  'restAPI/cage/post?id=3&isBreeding=true',
  'restAPI/cage/post?id=3&isBreeding=true',
  'restAPI/cage/post?id=3&isBreeding=true',
];

function generateCagesUrls(){
  
}// end generateCagesUrls
  
$.ajax({
  url: 'restAPI/cage/post?id=3&isBreeding=foo',
  success: function(data){
    console.log(data);
  }
}); 


})();
