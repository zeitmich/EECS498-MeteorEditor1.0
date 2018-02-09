import { Text } from '/api/Text';
import { Meteor } from 'meteor/meteor';

Meteor.startup(function() {

	return Meteor.methods({
		'clearText': function() {
			return Text.remove({});
		},
	});
});

