// Config
var deleteKey = 44;
var multipleKeys = [
	{ 'code': 97, 'characters': [ 'a', 'á' ] },
	{ 'code': 101, 'characters': [ 'e', 'é' ] },
	{ 'code': 105, 'characters': [ 'i', 'í' ] },
	{ 'code': 111, 'characters': [ 'o', 'ó' ] },
	{ 'code': 117, 'characters': [ 'u', 'ú' ] }
];
var timeToMultiple = 1000;

// Audio
var enterAudio;
var keyAudio;

// Functions
function resetAudio ()
{
	try
	{
		enterAudio.pause ();
		keyAudio.pause ();
	}
	catch (v)
	{
		console.log (v);
	}
	enterAudio = new Audio('audio/enter.wav');
	keyAudio = new Audio('audio/key.wav');

}
function showKey (selector, delay)
{
	// Hide all others
	$('.keys').not (selector)
		.finish ()
		.hide ();
	
	if ($(selector).is(':visible'))
		$(selector)
			.finish()
			.show();
	else
		$(selector).show ('fade');
	
	$(selector)
		.delay (delay)
		.hide ('fade');
}
function showPressed (s)
{
	$('#pressed')
		.text (s);
	showKey ('#pressed', 400);
}
function showPressedSpecial (name)
{
	showKey (name, 400);
}
function showPressedMultiple (item, charIndex, first)
{
	// First? 
	if (first)
	{
		// Clear and add keys
		$('#multiple > .container')
			.empty();
		$.each (item.characters, function (i, item)
		{
			$('#multiple > .container').append ($('<div>').text (item));
		});
	}

	// Highlight selected
	$('#multiple > .container > div')
		.removeClass ('selected')
		.eq (charIndex).addClass ('selected');

	// Animate progress
	$('#multiple > .progressContainer > div')
		.finish ()
		.css ('width', '0%')
		.animate ({ 'width': '100%'}, timeToMultiple);
	
	showKey ('#multiple', timeToMultiple);				
}
function addChar (s)
{
	$('#textbox span').append (s);
	showPressed (s);
}
function deleteChar ()
{
	var $span = $('#textbox span');
	var currentText = $span.text();
	var newText = currentText.substr (0, currentText.length - 1);
	$span.text (newText);
}
function getLastChar ()
{
	return $('#textbox span').text ().slice(-1);
}

$(function ()
{
	// Variables
	var last = 0;
	var lastChar = null;
	var multipleIndex = 0;
	var $span = $('#textbox span');
	$('.keys').hide();

	// Event
	$(document).keypress (function (event)
	{
		// Stop sounds
		resetAudio ();

		// Enter
		if (event.charCode == 13)
		{
			showPressedSpecial (".specialKey.enter");
			$span.empty();
			enterAudio.play();
			return;
		}

		keyAudio.play();
		
		// Delete
		if (event.charCode == deleteKey)
		{
			showPressedSpecial (".specialKey.backspace");
			deleteChar();
			return;
		}
		
		// Multiple
		var now = (new Date()).getTime();
		var found = Enumerable.From (multipleKeys)
			.Where (function (x) { return x.code == event.charCode; })
			.FirstOrDefault();
		if (found !== undefined)
		{
			var isFirst = (lastChar != event.charCode || now - last > timeToMultiple);
			if (isFirst)
				multipleIndex = 0;
			else
				deleteChar();
			var indexToShow = multipleIndex++ % found.characters.length;
			console.log (found, indexToShow, isFirst);
			$('#textbox span').append (found.characters [indexToShow]);
			showPressedMultiple (found, indexToShow, isFirst);
			last = now;
			lastChar = event.charCode;
			return;
		}

		// Normal key
		last = now;
		lastChar = event.charCode;
		multipleIndex = 0;
		console.log(event.charCode);
		var s = String.fromCharCode (event.charCode);
		addChar (s);
		event.stopPropagation();
	});
});