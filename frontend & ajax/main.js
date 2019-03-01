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
 

function Login(){
        $.ajax({
            
            url: 'http://localhost:61666/api/Logins/'+$('#uid').val(),
            type: 'POST',
            dataType: 'json',
            success: function(res){
                if(res.Password==$('#pass').val()) {
                    // if user loggedin then redirect to home page.
                   window.location = "dashboard.html";
                }
                else{
                    alert("Incorrect User-ID or password!!!");
                }
            }
        });   
    }




           