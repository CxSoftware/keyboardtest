// Config
var enterKey = 13;
var deleteKey = 44;
var multipleKeys = [
	{ 'code': 97,  'characters': [ 'a', 'á' ] },
	{ 'code': 101, 'characters': [ 'e', 'é' ] },
	{ 'code': 105, 'characters': [ 'i', 'í' ] },
	{ 'code': 111, 'characters': [ 'o', 'ó' ] },
	{ 'code': 117, 'characters': [ 'u', 'ú' ] },
	{ 'code': 161, 'characters': [ '¡', '!' ] },
	{ 'code': 39,  'characters': [ '¿', '?' ] },
	{ 'code': 49,  'characters': [ '1', ':' ] },
	{ 'code': 50,  'characters': [ '2', ',' ] },
	{ 'code': 45,  'characters': [ '-', '_' ] }
];
var timeToMultiple = 1000;

// Functions
function play (url)
{
	new Audio (url).play ();
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

$(function ()
{
	// Variables
	var last = 0;
	var lastChar = null;
	var multipleIndex = 0;
	$('.keys').hide();

	// Event
	$(document).keypress (function (event)
	{
		console.log (event.charCode);
		// Enter
		if (event.charCode == enterKey)
		{
			showPressedSpecial (".specialKey.enter");
			$('#textbox span').empty();
			play ('audio/enter.wav');
			lastChar = event.charCode;
			return;
		}

		play ('audio/key.wav');
		
		// Delete
		if (event.charCode == deleteKey)
		{
			showPressedSpecial (".specialKey.backspace");
			deleteChar();
			lastChar = event.charCode;
			return;
		}
		
		// Multiple
		var found = Enumerable.From (multipleKeys)
			.Where (function (x) { return x.code == event.charCode; })
			.FirstOrDefault();
		if (found !== undefined)
		{
			var now = (new Date()).getTime();
			var isFirst = (lastChar != event.charCode || now - last > timeToMultiple);
			if (isFirst)
				multipleIndex = 0;
			else
				deleteChar();
			var indexToShow = multipleIndex++ % found.characters.length;
			$('#textbox span').append (found.characters [indexToShow]);
			showPressedMultiple (found, indexToShow, isFirst);
			last = now;
			lastChar = event.charCode;
			return;
		}

		// Normal key
		lastChar = event.charCode;
		addChar (String.fromCharCode (event.charCode));
	});
});
