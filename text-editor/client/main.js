import { Text } from '/api/Text';
import { Template } from 'meteor/templating';

import './main.html';

var setStyle = function(instance, newStyle) {
	var temp = JSON.parse(localStorage.getItem("style"));
	
	// Remove style (bold, italic, underline) if clicked previously, else add
	var index = temp.indexOf(newStyle);
	if(index === -1) {
		temp.push(newStyle);
	}
	else temp.splice(index, 1);
	
	// Update style and reload page
	localStorage.setItem("style", JSON.stringify(temp));
	location.reload();
};

var setColor = function(instance, newColor) {
	var temp = JSON.parse(localStorage.getItem("style"));
	var oldColor = localStorage.getItem("color");
	
	// Remove previously chosen color
	var index = temp.indexOf(oldColor);
	if(index !== -1) {
		temp.splice(index, 1);
	}

	// If user clicked a different color, add new color, else set color to empty
	if(newColor !== oldColor) {
		temp.push(newColor);
		localStorage.setItem("color", newColor);
	}
	else localStorage.setItem("color", "");

	// Update style and reload page
	localStorage.setItem("style", JSON.stringify(temp));
	location.reload();
};

Template.editor.helpers({
	helper: setStyle,
	helper: setColor,
	'getStyle': function() {
		var styles = JSON.parse(localStorage.getItem("style"));

		// Initialize style and color to empty
		if(styles === null) {
			localStorage.setItem("style", JSON.stringify([]));
			localStorage.setItem("color", "");
		}

		// Display message for empty style
		if(styles.length === 0) {
			return "no font effects active";
		}

		// Comma-separated
		return styles;
	},
	'getText': function() {
		// Return all words with their styles
		return Text.find().fetch();
	},
});

Template.editor.events({
	'click .bold, click .italic, click .underline': function(event, instance) {
		setStyle(instance, $(event.target).attr('class'));
	},
	'click .black, click .red, click .green, click .blue': function(event, instance) {
		// Class of color buttons is "select-color color"
		var newColor = $(event.target).attr('class').split(' ')[1];
		setColor(instance, newColor);
	},
	'keypress .add-text': function(event, instance) {
		// Submit text on enter or spacebar keypress
		if(event.which === 13 || event.which === 32) {
			// Prevent default browser event
			event.preventDefault();

			// Insert word with current selected style as space-separated string
			Text.insert({
				word: $(event.target).val(),
				style: JSON.parse(localStorage.getItem("style")).join(' ')
			});

			// Reset textbox to empty
			document.getElementsByName("input")[0].value = "";
		}
	},
	'click .clear': function() {
		// Popup confirmation message before clearing text
		var clear = confirm("Are you sure?");
		if(clear === true) {
			Meteor.call('clearText');
		}
	},
});
