var form = document.getElementById('contact-form'); 
var geoAddress = document.getElementById('address-confirmation');
var geolocateAuthorizeButton = document.getElementById('authorize-geolocate');
var geolocationAuthorization = document.getElementById('geolocation-authorization');
var geolocationForm = document.getElementById('geolocation-form');
var geolocateButton = document.getElementById('reverse-geolocate');
var logOutButton = document.getElementById('button-logout');
var mainContent = document.getElementById('photoregister');
var nextButton = document.getElementById('save-user');
var newUser = document.getElementById('new-user');
var noButton = document.getElementById('discard-address');
var regButton = document.getElementById('button--register');
var inputCode = document.getElementById('input-code');
var unconfirmedAddress;

var userContact = document.getElementById('user-contact');
var userNameButton = document.getElementById('username-doublecheck');
var yesButton = document.getElementById('confirm-address');

form.addEventListener('submit', saveUser);
geolocateAuthorizeButton.addEventListener('click', authorizeGeolocation);
geolocateButton.addEventListener('click', reverseGeocode);
logOutButton.addEventListener("click", logOut);
noButton.addEventListener('click', no);
yesButton.addEventListener('click', yes);
regButton.addEventListener('click', register);


function localToSession() {
	sessionStorage.setItem("address", localStorage.getItem("address"));
	sessionStorage.setItem("user", localStorage.getItem("user"));
}


function register() {
	console.log("register");
	localToSession();
	var regCode = inputCode.value;
	regCode = regCode.toLowerCase();
	if (regCode === "liftme") {
		console.log("lift");
		window.open("http://liftmaster.registria.com/");
	}
	else if (regCode === "simmons") {
		console.log("simmons");
		window.open("https://simmons.registria.com/login");
	}
	else {
		console.log("<blank>")
	}

	// console.log(regCode);
}

if (localStorage.getItem('user')) {
	mainContent.classList.add('content--active');
	newUser.classList.remove('content--active');
}

function stopDefAction(evt) {
    evt.preventDefault();
}

userContact.addEventListener('click', stopDefAction);
yesButton.addEventListener('click', stopDefAction);
noButton.addEventListener('click', stopDefAction);
form.addEventListener('submit', stopDefAction);

function authorizeGeolocation() {
	console.log('authorize');
	geolocationAuthorization.classList.add('hidden');
	geolocationForm.classList.remove('hidden');
}	

function displayUserName() {
	var username = localStorage.getItem('user');
	console.log(username);
	document.getElementById('username-doublecheck').innerHTML = 'Not ' + localStorage.getItem('user') + '?';
}

function logOut() {
	localStorage.removeItem('user');
	localStorage.removeItem('address');
	newUser.classList.add('content--active');
	mainContent.classList.remove('content--active');
}

function reverseGeocode(location, type) {
	var url = '';
	var xhr = new XMLHttpRequest();
	
	if (type === 'latlng') {
		url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + location.coords.latitude + ',' + location.coords.longitude;
	} else {
		var postalCode = document.getElementById('postal-code').value;
		url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + postalCode;
	}
	
	xhr.open('GET', url);
	xhr.responseType = 'json';

	document.body.setAttribute('data-loading', url);

	xhr.onload = function() {
		document.body.removeAttribute('data-loading');

		if (xhr.status === 0
		 || xhr.status >= 200 && xhr.status < 300
		 || xhr.status === 304) {
			var json = xhr.response.results;	
			
			unconfirmedAddress = json[0].formatted_address;
			showAddressConfirmation(unconfirmedAddress);

		} else {
			console.log('Geolocation failed.');
		}

	};
	xhr.onerror = function() {
		console.log('Geolocation failed.');;
	};
	xhr.send(null);
}

function showAddressConfirmation(address) {
	var addressElement = document.getElementById('address');
	var addressConfirmation = document.getElementById('address-confirmation');
	addressElement.innerHTML = address;
	
	geolocationForm.classList.add('hidden');
	addressConfirmation.classList.remove('hidden');
}

function saveUser() {
	console.log("saving");
	var contactData = document.getElementById('user-contact').value;
	localStorage.setItem('user', contactData);
	var addressData = document.getElementById('postal-code').value;
	localStorage.setItem('address', addressData);
	displayUserName();	
	newUser.classList.remove('content--active');
	mainContent.classList.add('content--active');
}

function no(){
	console.log('no');
	localStorage.removeItem('address');
	yesButton.classList.remove('pressed');
	geoAddress.classList.add('hidden');
	geolocationForm.classList.remove('hidden');
}

function yes(){
	console.log('yes');
	localStorage.setItem('address', unconfirmedAddress);
	yesButton.classList.add('pressed');
}

displayUserName();