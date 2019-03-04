	// Login
	var btn = $('#btn1');
	btn.on('click',function(e){
		console.log(e);
		e.preventDefault();
	var email=document.getElementById('email');
	var password=document.getElementById('password');
	
	var data={
		
		"email":email,
		"password":password
	};
	//console.log("success bhai");
	var settings = {
		"async": true,
		"crossDomain": true,
		"url": "http://localhost:7000/users/login",
		"method": "POST",
		"headers": {
		  "content-type": "application/json",
		  "cache-control": "no-cache"
		},
		"processData": false,
		"data": "{   \n\t\"email\": \"2016004771.rishabh@ug.sharda.ac.in\",\n\t\"password\": \"rishabh\"\n}"
	  }
	  
	  $.ajax(settings).done(function (response) {
		console.log(response);
	  });
   
	});


	var myBtn = $('#myBtn');
	myBtn.on('click',function(e){
		console.log(e);
		e.preventDefault();
	var email=document.getElementById("email").value;
	var password=document.getElementById('password');
	console.log(email);
	var data={
		
		"email":email,
		"password":password
	};
	var settings = {
		"async": true,
		"crossDomain": true,
		"url": "http://localhost:7000/users/forget/"+ email,
		"method": "POST",
		"headers": {
		  "content-type": "application/json",
		  "cache-control": "no-cache",
		  "postman-token": "d3ffa119-98d0-c03a-bc63-2070668abc5c"
		}
	  }
	  
	  $.ajax(settings).done(function (response) {
		console.log(response);
	  });
   
	});