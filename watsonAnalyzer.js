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
	
	button.addEventListener('click', function() {
		var popup = document.createElement('div');
		
		popup.style.position = 'absolute';
		popup.style.backgroundColor = "#eee";
		popup.style.width = "200px";
		popup.style.height = "200px";
		popup.style.right = "0%";
		popup.style.bottom = "20px";
		popup.style.borderRadius = "10px";
		popup.style.padding = "10px";
		popup.style.boxShadow = "0 0 4px rgba(0,0,0,0.4)";
		

		popup.innerHTML = "<ul><li>Tone: Blah</li></ul>";

		button.appendChild(popup);
		popup.setAttribute('class', 'show');

		document.body.addEventListener('click', removePopup, true);

		function removePopup(e) {
			popup.setAttribute('class', 'hide show');
			
			setTimeout(function() {
				popup.remove();
			}, 500);

			document.body.removeEventListener('click', removePopup);
		}
	});

	function styleButton(options) {
		let buttonCss = button.style

		buttonCss.height = options.height || '40px';
		buttonCss.width = options.width || '40px';
		buttonCss.backgroundColor = options.backgroundColor || 'rgba(0,0,0,0.2)';
		buttonCss.position = options.position || 'absolute';
		buttonCss.right = options.right || '5px';
		buttonCss.bottom = options.bottom || '5px';
		buttonCss.borderRadius = options.borderRadius || '50%';
		buttonCss.backgroundImage = "url('https://d30y9cdsu7xlg0.cloudfront.net/png/71513-200.png')";
		buttonCss.backgroundSize = "cover";
		buttonCss.cursor = "pointer";		

		var parentStyles = getComputedStyle(button.parentElement,null);
		if (parentStyles.getPropertyValue('position') == 'static') {
			button.parentElement.style.position = 'relative';
		}
	}
	
}

function addCSS() {
	var css = document.createElement('style');
	css.innerHTML = "\
	.show {\
		opacity: 1; \
		animation-name: show;\
		animation-duration: 0.2s;\
	}\
	.hide {\
		opacity: 0;\
		animation-name: hide;\
		animation-duration: 0.2s;\
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

var tone = {
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

function analyze(text) {
	fetch('https://gateway.watsonplatform.net/tone-analyzer/api', { 
	   method: 'post', 
	   headers: {
	     'Authorization': 'Basic '+btoa('6e7e467f-4798-4eb2-ad4f-b47c669718fa:aLTHlyd2agPU'), 
	     'X-Watson-Learning-Opt-Out': 'true'
	 	}, 
	   body: 'A=1&B=2'
	}).then(data => data.json()).then(data => {
		console.log(data);
	});
}