'use strict';

goog.provide('Blockly.Constants.custom');

goog.require('Blockly.Blocks');
goog.require('Blockly');


Blockly.Blocks['LedRGB'] = {
	init: function() {
		var dropdownOptionsA = [
      ['แดง', 'R'],
      ['เขียว', 'G'],
      ['ฟ้า', 'B']
    ];
		var dropdownOptionsB = [
      ['เปิด', 'I'],
      ['ปิด', 'O']
    ];

		this.myDropdown_A = new Blockly.FieldDropdown(dropdownOptionsA);
		this.myDropdown_B = new Blockly.FieldDropdown(dropdownOptionsB);

		this.appendDummyInput()
			.setAlign(Blockly.ALIGN_LEFT)
			.appendField("LedRGB")
			.appendField(this.myDropdown_A, 'ledRGB')
			.appendField("are")
			.appendField(this.myDropdown_B, 'ledState')
		this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
	}
};

Blockly.Blocks['MhMqSensor'] = {
	init: function() {
		this.appendDummyInput()
			.setAlign(Blockly.ALIGN_LEFT)
			.appendField("Sensor");
		this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
	}
};

Blockly.Blocks['HcSr04'] = {
	init: function() {
		this.appendDummyInput()
			.setAlign(Blockly.ALIGN_LEFT)
			.appendField("HcSr04")
		this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
	}
}

Blockly.Blocks['52abLm35Dz'] = {
	init: function() {
		this.appendDummyInput()
			.setAlign(Blockly.ALIGN_LEFT)
			.appendField("52abLm35Dz")
		this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
	}
}

Blockly.Blocks['Mg996r'] = {
	init: function() {
		this.appendDummyInput()
			.appendField('Servo degree is(0-180)')
			.appendField(new Blockly.FieldTextInput('90'), 'MgDegree');
		this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
	}
}

Blockly.Blocks['DcMorter12v'] = {
	init: function() {
		this.appendDummyInput()
			.setAlign(Blockly.ALIGN_LEFT)
			.appendField("DcMorter12v")
		this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
	}
};

Blockly.Blocks['L9110'] = {
	init: function() {
		var dropdownOptions = [
      ['หน้า', 'A'],
      ['หลัง', 'B'],
      ['ซ้าย', 'C'],
      ['ขวา', 'D']
    ];

	this.myDropdown_ = new Blockly.FieldDropdown(dropdownOptions);

		this.appendDummyInput()
			.setAlign(Blockly.ALIGN_LEFT)
			.appendField("L9110")
			.appendField(this.myDropdown_, 'L9Value');
		this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
	}
};

Blockly.Blocks['delay'] = {
	init: function() {
    this.appendDummyInput()
        .appendField("Delay ")
        .appendField(new Blockly.FieldTextInput('500'), 'DelayValue');
    
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  }
};