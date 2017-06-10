window.addEventListener('load', function() {
 	Analyzer();
});

function Analyzer() {

	// Getting all the textareas
	var textareas = document.getElementsByTagName('textarea');
	var assets = 'assets'
	
	addCSS()
	
	for (var i = 0; i < textareas.length; i++) {
		let textarea = textareas[i];	
		let checkerButton = document.createElement('div');
		
		checkerButton.setAttribute('class', 'analze-button');

		var wrapper = wrapTextarea(textarea);
		wrapper.appendChild(checkerButton);

		var button = setUpCheckerButton(checkerButton);

		button.addEventListener('click', function(e) {
			let clickedButton = e.target;
			
			if (textarea.value.trim() != '') {

				var loading = document.createElement('div')
				loading.innerHTML = "<div><img src='"+assets+"/loading.gif?d'></div>Analyzing ...";
				loading.setAttribute('class', 'load message');

				var popup = createPopup();
				
				popup.appendChild(loading);
				analyze(popup, textarea.value.trim());


			} else {
				var errorDiv = document.createElement('div');
				errorDiv.setAttribute('class', 'error message');
				errorDiv.innerHTML = 'Please enter text to analyze';

				var popup = createPopup(errorDiv)
			}

			clickedButton.appendChild(popup);

		});
	}
}

function wrapTextarea(textarea) {

	let wrapper = document.createElement('div');

	wrapper.style.display = textarea.style.display;
	textarea.parentElement.insertBefore(wrapper, textarea);

	wrapper.appendChild(textarea);

	return wrapper;

}

function setUpCheckerButton(button, options) {
	options = options || {};
	
	styleButton(options);

	button.setAttribute('title', 'Analyze Tone');
	button.setAttribute('class', 'watson-check');
	
	return button;

	function styleButton(options) {
		let buttonCss = button.style

		buttonCss.height = options.height || '40px';
		buttonCss.width = options.width || '40px';
		buttonCss.position = options.position || 'absolute';
		buttonCss.right = options.right || '5px';
		buttonCss.bottom = options.bottom || '5px';
		buttonCss.borderRadius = options.borderRadius || '50%';
		buttonCss.backgroundImage = "url('https://upload.wikimedia.org/wikipedia/en/0/00/IBM_Watson_Logo_2017.png')";
		buttonCss.backgroundSize = "90%";
		buttonCss.backgroundRepeat = "no-repeat";
		buttonCss.backgroundPosition = "center center";
		buttonCss.cursor = "pointer";	

		var parentStyles = getComputedStyle(button.parentElement,null);
		if (parentStyles.getPropertyValue('position') == 'static') {
			button.parentElement.style.position = 'relative';
		}
	}
}

function createPopup(childElement) {
	var popup = document.createElement('div');
	
	popup.style.position = 'absolute';
	popup.style.backgroundColor = "#eee";
	popup.style.width = "200px";
	popup.style.height = "200px";
	popup.style.right = "0%";
	popup.style.bottom = "0px";
	popup.style.borderRadius = "5px";
	popup.style.padding = "0";
	popup.style.boxShadow = "0 0 4px rgba(0,0,0,0.4)";
	// popup.style.overflow = "scroll";

	if (childElement) 
		popup.appendChild(childElement);

	popup.setAttribute('class', 'show popup');

	document.body.addEventListener('click', removePopup, true);

	function removePopup(e) {
		if (e.target.getAttribute('id') != 'watson-details-button' 
			&& e.target.getAttribute('id')  != 'watson-back-button') {
			popup.setAttribute('class', 'hide show popup');
		
			setTimeout(function() {
				popup.remove();
			}, 200);

			document.body.removeEventListener('click', removePopup);
		}
	}

	return popup;
}

function analyze(container, text) {

	var data = new FormData();
	data.append("text", text);
	// data.append("test", 'true');
	
	fetch('http://localhost/teamhub/inc/ibm.php', {
		method : 'POST',
		body : data

	}).then(function(data) {
		return data.json();
	}).then(function(json) {

		displayAnalysis(container, json)
		
	}, function(error) {
		console.log(error);

		var errorDiv = document.createElement('div');
		errorDiv.setAttribute('class', 'error message');
		errorDiv.innerHTML = "Something went wrong while processing your text";
		
		container.innerHTML = ''
		container.appendChild(errorDiv);

	});
}

function displayAnalysis(parent, json) {
	let tones = json.document_tone.tone_categories[0].tones;
	
	let container = document.createElement("div");
	container.setAttribute('class', 'result-container');

	let topBar = document.createElement("div");
	topBar.setAttribute('class', 'top-bar');
	container.appendChild(topBar);

	let detailButton = document.createElement("div");
	detailButton.setAttribute('id', 'watson-details-button');
	detailButton.setAttribute('class', 'details enabled');
	detailButton.innerHTML = 'Details';
	topBar.appendChild(detailButton);
	
	var backButton = document.createElement('div');
	backButton.setAttribute('id','watson-back-button');
	backButton.setAttribute('class','back-button disabled');
	backButton.innerHTML = '&#10094;';
	topBar.appendChild(backButton);

	detailButton.addEventListener('click', function(e) {
		e.stopPropagation();
		
		backButton.setAttribute('class', 'back-button enabled');
		detailButton.setAttribute('class', 'details disabled');
		
		displayContent(getSecondaryContent());
	});

	backButton.addEventListener('click', function(e) {
		e.stopPropagation();

		detailButton.setAttribute('class', 'details enabled');
		backButton.setAttribute('class', 'back-button disabled');

		displayContent(getMainContent());
	});

	let content = document.createElement("div");
	content.setAttribute('class', 'watson-content');
	container.appendChild(content);

	displayContent(getMainContent());

	parent.innerHTML = '';
	parent.appendChild(container);

	return container;

	function displayContent(html) {
		if (typeof html == 'string') {
			content.innerHTML = html;
		} else {
			content.innerHTML = '';
			content.appendChild(html);
		}
	}

	function getMainContent() {

		let container = document.createElement("div");
		container.setAttribute('class', 'main-report');
		
		let best_score = 0;
		let emotion = "";

		for (var i = 0; i < tones.length; i++) {
			
			var tone = tones[i];
			
			var tone_name = tone.tone_name
			var tone_score = Math.round(tone.score/1 * 100);
			
			if (tone_score > best_score) {
				best_score = tone_score;
				emotion = tone_name;
			}

		}

		switch (emotion) {
			case "Anger":
				var image = "assets/angry.png";
				var message = "Angry";
				break;

			case "Disgust":
				var image = "assets/sad.png";
				var message = "Disgusted";
				break;

			case "Fear":
				var image = "assets/sad.png";
				var message = "Fearful";
				break;

			case "Sadness":
				var image = "assets/sad.png";
				var message = "Sad";
				break;

			case "Joy": 
				var image = "assets/happy.png";
				var message = "Joyful";
				break;
		}

		container.innerHTML += "<div class='image-container'><img src='" + image + "'></div><div class='tone-message'><span class='tone-title'>" + message + "</span></div>";

		return container;
	}

	function getSecondaryContent() {
		
		let list = document.createElement("ul");
		
		for (var i = 0; i < tones.length; i++) {
			
			var tone = tones[i];
			
			var tone_name = tone.tone_name
			var tone_score = Math.round(tone.score/1 * 100);
			list.innerHTML += "<li><span class='tone-name'>" + tone_name + ":</span> <span class='tone-score'>" + tone_score + "%</span></li>";
		
		}

		return list;
	}
}

function addCSS() {
	
	var css = document.createElement('style');
	css.innerHTML = "\
	.watson-check {\
		/*opacity: 0;\
		animation-name: hide;\
		animation-duration: 0.2s;*/\
		box-shadow: 0 2px 5px rgba(0,0,0,0.3);\
		transition: background-color 0.2s, box-shadow 0.2s;\
	}\
	.watson-check:hover {\
		background-color: rgba(0,0,0,0.03);\
		box-shadow: 0 2px 5px rgba(0,0,0,0.6);\
	}\
	.watson-check .popup ul {\
		list-style: none;\
		padding-left: 0;\
	}\
	.watson-check .popup .message {\
		padding: 30px 10px;\
		text-align: center;\
		font-size: 18px;\
		color: rgba(0,0,0,0.5);\
		font-weight: bold;\
	}\
	.watson-check .popup .top-bar {\
		overflow: auto;\
	}\
	.watson-check .popup .top-bar > * {\
		width: 30%;\
		padding: 5px 20px 5px 5px;\
		text-align: center;\
		transition: opacity 0.2s, color 0.2s;\
	}\
	.watson-check .popup .top-bar .back-button {\
		float: left;\
		font-size: 16px;\
		position: relative;\
		left: 0;\
		transition: color 0.1s, opacity 0.1s, left 0.1s;\
		color: #66f;\
	}\
	.watson-check .popup .top-bar .back-button:hover {\
		color: #6af;\
	}\
	.watson-check .popup .top-bar .back-button.enable {\
		opacity: 1;\
		left: 0;\
	}\
	.watson-check .popup .top-bar .back-button.disabled {\
		opacity: 0;\
		left: -20px;\
	}\
	.watson-check .popup .top-bar .details {\
		float: right;\
		position: relative;\
		right: 0;\
		color: #66f;\
	}\
	.watson-check .popup .top-bar .details:hover {\
		color: #6af;\
	}\
	.watson-check .popup .top-bar .details.enabled {\
		opacity: 1;\
	}\
	.watson-check .popup .top-bar .details.disabled {\
		opacity: 0;\
	}\
	.watson-check .popup .watson-content {\
		padding: 10px 20px;\
	}\
	.watson-check .popup .watson-content .image-container {\
		width: 70%;\
		margin: auto;\
	}\
	.watson-check .popup .watson-content .image-container img {\
		max-width: 100%;\
		max-height: 100%;\
	}\
	.watson-check .popup .main-report { \
		position: relative;\
		animation-name: show;\
		animation-duration: 0.2s;\
	}\
	.watson-check .popup .watson-content .tone-message {\
		text-align: center;\
	}\
	.watson-check .popup .watson-content .tone-title {\
		font-weight: bold;\
	}\
	.watson-check .popup .tone-name {\
		font-size: 13px;\
		font-weight: bold;\
	}\
	.show {\
		opacity: 1;\
		animation-name: show;\
		animation-duration: 0.1s;\
	}\
	.hide {\
		opacity: 0;\
		animation-name: hide;\
		animation-duration: 0.1s;\
	}\
	@keyframes show {\
		0% {\
			opacity: 0;	\
			bottom: -20px;	\
		}\
		100% {\
			opacity: 1;\
			bottom: 0px;	\
		}\
	}\
	@keyframes hide {\
		0% {\
			opacity: 1;	\
			bottom: 0px;	\
		}\
		100% {\
			opacity: 0;\
			bottom: -20px;	\
		}\
	}\
	";

	document.body.appendChild(css);
} 
