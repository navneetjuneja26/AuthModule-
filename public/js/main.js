 // Get the modal
 var modal = document.getElementById('myModal');

 // Get the button that opens the modal
 var btn = document.getElementById("myBtn");

 // Get the <span> element that closes the modal
 var span = document.getElementsByClassName("close")[0];

 // When the user clicks the button, open the modal 
 btn.onclick = function () {
   modal.style.display = "block";
 }

 // When the user clicks on <span> (x), close the modal
 span.onclick = function () {
   modal.style.display = "none";
 }

 // When the user clicks anywhere outside of the modal, close it
        window.onclick = function (event) {
   if (event.target == modal) {
     modal.style.display = "none";
   }
 }
 

function login()
{
	var email=document.getElementById('email');
	var password=document.getElementById('password');
	
	var data={
		
		"email":email,
		"password":password
	};
	console.log("success bhai");
	 $.ajax({
      url: "http://localhost:7000",
      type: "POST",
	  datatype:'json',
	  data:data,
	  success: function(res){
		  console.log("success bhai");
		  window.location='reset.html';
	  }
	 });
   
}




           