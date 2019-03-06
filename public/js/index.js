// // Get the modal

function show() {
	console.log("show called");
	var modal = document.getElementById("myModal");

	// // Get the button that opens the modal
	var btn = document.getElementById("myBtn");

	// // Get the <span> element that closes the modal
	var span = document.getElementsByClassName("close")[0];

	btn.onclick = function () {
		modal.style.display = "block";
	}
	span.onclick = function () {
		modal.style.display = "none";
	}
	window.onclick = function (event) {
		if (event.target == modal) {
			modal.style.display = "none";
		}
	}
}

var token;

function showOnLogin() {
	document.getElementById("id1").style.display = "none";
	document.getElementById("id2").style.display = "none";
	document.getElementById("id3").style.display = "none";
	document.getElementById("id4").style.display = "none";
}



// Login Ajax
var btn = $('#btn1');				// id of button login
btn.on('click', function (e) {
	e.preventDefault();
	var email = document.getElementById('email').value;
	var password = document.getElementById('password').value;
	if (!email || !password) {
		console.log("fill all entries");
		document.getElementById("id1").style.display = "block";
		document.getElementById("id2").style.display = "none";
		document.getElementById("id3").style.display = "none";
		document.getElementById("id4").style.display = "none";
	}
	else {
		var data = {
			"email": email,
			"password": password
		};
		$.ajax({
			url: 'http://localhost:7000/users/login',
			type: 'POST',
			data: data,
			dataType: 'json',
			success: function (res) {
				if (res.message == "no email found") {
					// flash message 
					document.getElementById("id1").style.display = "none";
					document.getElementById("id2").style.display = "block";
					document.getElementById("id3").style.display = "none";
					document.getElementById("id4").style.display = "none";
					console.log("no email");
				}
				if (res.message == "token generated successfully") {
					// flash message 

					localStorage.setItem("token", res.token);
					window.location = "http://localhost:7000/check.html";
				}
				if (res.message == "id pass donot match") {
					document.getElementById("id1").style.display = "none";
					document.getElementById("id2").style.display = "none";
					document.getElementById("id3").style.display = "block";
					document.getElementById("id4").style.display = "none";
					console.log("id pass not match");
				}
			}
		});
	}
})

// sending mail on clicking forget password
var myBtn = $('#myBtn');
myBtn.on('click', function (e) {
	e.preventDefault();
	var email = document.getElementById("email").value;
	if (!email) {
		console.log("fill all entries");
		document.getElementById("id1").style.display = "none";
		document.getElementById("id2").style.display = "none";
		document.getElementById("id3").style.display = "none";
		document.getElementById("id4").style.display = "block";
	}
	else {
		var data = {
			"email": email
		};
		$.ajax({
			url: 'http://localhost:7000/users/forget',
			type: 'POST',
			data: data,
			dataType: 'json',
			success: function (res) {
				if (res.message == "no email exist") {
					document.getElementById("id1").style.display = "none";
					document.getElementById("id2").style.display = "block";
					document.getElementById("id3").style.display = "none";
					document.getElementById("id4").style.display = "none";
				}
				if (res.message == "mail send") {
					console.log("mail send");
					show();

				}
				if (res.message == "mail not send") {
					console.log("not send");
				}
			}
		});
	}
});


// resetting password
var reset = $('#Reset');
reset.on('click', function (e) {
	console.log(e);
	e.preventDefault();
	var pass = document.getElementById("p1").value;
	var password = document.getElementById('p2').value;
	if (!pass || !password) {
		console.log("fill all entries");
		document.getElementById("r1").style.display = "block";
		document.getElementById("r2").style.display = "none";
	}
	else {
		console.log("second part");
		if (pass != password) {
			console.log("password dont match");
			document.getElementById("r1").style.display = "none";
			document.getElementById("r2").style.display = "block";
		}
		else {
			var data = {
				"newpassword": pass,
				"confirmpassword": password,
				"token": token
			};
			console.log(data);
			$.ajax({
				url: 'http://localhost:7000/users/updatepassword',
				type: 'POST',
				data: data,
				dataType: 'json',
				success: function (res) {
					if (res.message == "password has been changed") {
						window.location = "http://localhost:7000/check.html";
					}
					if (res.message == "pasword not match") {
						document.getElementById("r1").style.display = "none";
						document.getElementById("r2").style.display = "block";
					}
					if (res.message == "fill all entries") {
						document.getElementById("r1").style.display = "block";
						document.getElementById("r2").style.display = "none";
					}
				}
			});
		}
	}
})

// function will call when reset page will open to check the session 
function start() {
	var getUrlParameter = function getUrlParameter(sParam) {
		var sPageURL = decodeURIComponent(window.location.search.substring(1)),
			sURLVariables = sPageURL.split('&'),
			sParameterName;

		for (var i = 0; i < sURLVariables.length; i++) {
			sParameterName = sURLVariables[i].split('=');

			if (sParameterName[0] === sParam) {
				return sParameterName[1] === undefined ? true : sParameterName[1];
			}
		}
	};
	console.log(getUrlParameter('token'));
	token = getUrlParameter('token');
	$.ajax({
		url: 'http://localhost:7000/users/forgetpassword/' + token,
		type: 'GET',
		dataType: 'json',
		success: function (res) {
			console.log(res.message);
			if (res.message == "Session Expired") {
				window.location.href = "http://localhost:7000";
			}
		}
	});
	document.getElementById("r1").style.display = "none";
	document.getElementById("r2").style.display = "none";
}
