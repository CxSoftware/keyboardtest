// Config
var enterKey = 13;
var deleteKey = 8;
var shiftKey = 16;
var mapedKeys = [
	{ 'code': 186, 'character': 'ñ' }
];
var multipleKeys = [
	{ 'code': 65, 'characters': [ 'a', 'á' ] },
	{ 'code': 69, 'characters': [ 'e', 'é' ] },
	{ 'code': 105, 'characters': [ 'i', 'í' ] },
	{ 'code': 111, 'characters': [ 'o', 'ó' ] },
	{ 'code': 117, 'characters': [ 'u', 'ú' ] },
	{ 'code': 187, 'characters': [ '¡', '!' ] },
	{ 'code': 189, 'characters': [ '¿', '?' ] },
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
	$('#shift').hide ();
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
	$('#shift').hide();

	// Event
	$(document).keydown (function (event)
	{
		console.log (event.keyCode);
		// Enter
		if (event.keyCode == enterKey)
		{
			showPressedSpecial (".specialKey.enter");
			$('#textbox span').empty();
			play ('audio/enter.wav');
			lastChar = event.keyCode;
			return;
		}

		play ('audio/key.wav');
		
		// Delete
		if (event.keyCode == deleteKey)
		{
			showPressedSpecial (".specialKey.backspace");
			deleteChar();
			lastChar = event.keyCode;
			return;
		}

		// Mapped
		var foundMapped = Enumerable.From (mapedKeys)
			.Where (function (x) { return x.code == event.keyCode; })
			.FirstOrDefault ();
		if (foundMapped)
		{
			lastChar = event.keyCode
			addChar (foundMapped.character);
			return;
		}
		
		// Multiple
		var found = Enumerable.From (multipleKeys)
			.Where (function (x) { return x.code == event.keyCode; })
			.FirstOrDefault();
		if (found !== undefined)
		{
			var now = (new Date()).getTime();
			var isFirst = (lastChar != event.keyCode || now - last > timeToMultiple);
			if (isFirst)
				multipleIndex = 0;
			else
				deleteChar();
			var indexToShow = multipleIndex++ % found.characters.length;
			$('#textbox span').append (found.characters [indexToShow]);
			showPressedMultiple (found, indexToShow, isFirst);
			last = now;
			lastChar = event.keyCode;
			return;
		}

		// Shift
		if (event.keyCode == shiftKey)
		{
			$('#shift').toggle ();
			return;
		}

		// Normal key
		var s = String.fromCharCode (event.keyCode);
		lastChar = event.keyCode;
		addChar (s);
	});
});
