'use strict';

goog.provide('Blockly.Constants.custom');

goog.require('Blockly.Blocks');
goog.require('Blockly');


Blockly.Blocks['testblock'] = {
	init: function() {
		this.appendDummyInput()
			.setAlign(Blockly.ALIGN_LEFT)
			.appendField("test")
		this.setOutput(true, 'Boolean');
	}
};