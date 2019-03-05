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
	
	// Login
	var btn = $('#btn1');
	btn.on('click',function(e){
		console.log(e);
		e.preventDefault();
	var email=document.getElementById('email').value;
	var password=document.getElementById('password').value;
	var datatosend={
		"email":email,
		"password":password
	};
	$.ajax({
		url:'http://localhost:7000/users/forget',
		datatype: 'Json',
		data: datatosend,
		type: 'Post',
		Success: function(res){
			alert("Login Successful");
		} 
	});
	console.log(datatosend);
})
	
	// sending mail on clicking forget password
	var myBtn = $('#myBtn');
	myBtn.on('click',function(e){
		console.log(e);
		e.preventDefault();
	var email=document.getElementById("email").value;
	var password=document.getElementById('password').value;
	console.log(email);
	var data={
		"email":email
	};
	$.ajax({
		url:'http://localhost:7000/users/login',
		datatype: 'Json',
		data: data,
		type: 'Post',
		Success: function(res){
			alert("Login Successful");
		} 
	});
   
	});


// resetting password

var reset = $('#Reset');
	reset.on('click',function(e){
		console.log(e);
		e.preventDefault();
	var pass=document.getElementById("p1").value;
	var password=document.getElementById('p2').value;
	console.log(email);
	var data={
		"newpassword":pass,
		"confirmpassword":password,
		"email": "2016004771.rishabh@ug.sharda.ac.in"
	};
	var settings = {
		"async": true,
		"crossDomain": true,
		"url": "http://localhost:7000/users/forgetpassword",
		"method": "POST",
		"headers": {
		  "content-type": "application/json",
		  "cache-control": "no-cache"
		},
		"processData": false,
		"data": data
	  }
	  
	  $.ajax(settings).done(function (response) {
		console.log(response);
	  });
	})











