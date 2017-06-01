window.addEventListener('load', function() {
 Analyzer();
});

function Analyzer() {

	// Getting all the textareas
	var textareas = document.getElementsByClassName('analyze');
	addCSS()
	for (var i = 0; i < textareas.length; i++) {
		let textarea = textareas[i];	
		let checkerButton = document.createElement('div');
		
		checkerButton.setAttribute('class', 'analze-button');

		var wrapper = wrapTextarea(textarea);
		wrapper.appendChild(checkerButton);

		setUpCheckerButton(checkerButton);

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

	button.setAttribute('title', 'Analyze The Tone of The Text');
	button.setAttribute('class', 'watson-check');
	
	button.addEventListener('click', function() {

		var analysis = displayAnalysis()
		var popup = createPopup(analysis);

		button.appendChild(popup);
	});

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
	popup.style.bottom = "20px";
	popup.style.borderRadius = "5px";
	popup.style.padding = "10px";
	popup.style.boxShadow = "0 0 4px rgba(0,0,0,0.4)";
	popup.style.overflow = "scroll";

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

var response = {
  "document_tone": {
    "tone_categories": [
      {
        "tones": [
          {
            "score": 0.134622,
            "tone_id": "anger",
            "tone_name": "Anger"
          },
          {
            "score": 0.013182,
            "tone_id": "disgust",
            "tone_name": "Disgust"
          },
          {
            "score": 0.092403,
            "tone_id": "fear",
            "tone_name": "Fear"
          },
          {
            "score": 0.013411,
            "tone_id": "joy",
            "tone_name": "Joy"
          },
          {
            "score": 0.635069,
            "tone_id": "sadness",
            "tone_name": "Sadness"
          }
        ],
        "category_id": "emotion_tone",
        "category_name": "Emotion Tone"
      }
    ]
  }
}

function displayAnalysis(text) {
	let tones = response.document_tone.tone_categories[0].tones;
	
	let container = document.createElement("div");
	container.setAttribute('class', 'result-container');

	let topBar = document.createElement("div");
	topBar.setAttribute('class', 'top-bar');
	container.appendChild(topBar);

	let detailButton = document.createElement("div");
	detailButton.setAttribute('id', 'watson-details-button');
	detailButton.setAttribute('class', 'details enabled');
	detailButton.innerHTML = 'details';
	topBar.appendChild(detailButton);
	
	var backButton = document.createElement('div');
	backButton.setAttribute('id','watson-back-button');
	backButton.setAttribute('class','back-button disabled');
	backButton.innerHTML = '<';
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
		return "yay";
		
	}

	function getSecondaryContent() {
		let list = document.createElement("ul");
		for (var i = 0; i < tones.length; i++) {
			var tone = tones[i];
			
			var tone_name = tone.tone_name
			var tone_score = Math.round(tone.score/1 * 100);
			list.innerHTML += "<li><span class='tone-title'>" + tone_name + ":</span> <span class='tone-score'>" + tone_score + "%</span></li>";
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
		transition: background-color 0.2s;\
	}\
	.watson-check:hover {\
		background-color: rgba(0,0,0,0.1);\
	}\
	.watson-check .popup ul {\
		list-style: none;\
		padding-left: 0;\
	}\
	.watson-check .popup .top-bar {\
		overflow: auto;\
	}\
	.watson-check .popup .top-bar .back-button {\
		float: left;\
		position: relative;\
		left: 0;\
		transition: color 0.1s, left 0.1s;\
	}\
	.watson-check .popup .top-bar .back-button.enable {\
		color: initial;\
		left: 0;\
	}\
	.watson-check .popup .top-bar .back-button.disabled {\
		color: transparent;\
		left: -20px;\
	}\
	.watson-check .popup .top-bar .details {\
		float: right;\
		position: relative;\
		right: 0;\
		transition: opacity 0.1s;\
	}\
	.watson-check .popup .top-bar .details.enabled {\
		opacity: 1;\
	}\
	.watson-check .popup .top-bar .details.disabled {\
		opacity: 0;\
	}\
	.watson-check .popup .tone-title {\
		font-size: 13px;\
		font-weight: bold;\
	}\
	.show {\
		opacity: 1; \
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
			bottom: 0;	\
		}\
		100% {\
			opacity: 1;\
			bottom: 20px;	\
		}\
	}\
	@keyframes hide {\
		0% {\
			opacity: 1;	\
			bottom: 20px;	\
		}\
		100% {\
			opacity: 0;\
			bottom: 0;	\
		}\
	}\
	";

	document.body.appendChild(css);
} 
