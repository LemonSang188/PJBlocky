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

Blockly.Blocks['MethaneGasSensor'] = {
	init: function() {
		this.appendDummyInput()
			.setAlign(Blockly.ALIGN_LEFT)
			.appendField("MethaneGasSensor");
		this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
	}
};

Blockly.Blocks['MethaneGasSensorInput'] = {
	init: function() {
		this.appendDummyInput()
			.setAlign(Blockly.ALIGN_LEFT)
			.appendField("MethaneGasSensorInput Form PIN A1");
		this.setOutput(true, 'Number'); 
		this.setTooltip('อ่านค่าระยะทางจาก Ultrasonic Sensor');
	}
};

Blockly.Blocks['DistanceSensor'] = {
	init: function() {
		this.appendDummyInput()
			.setAlign(Blockly.ALIGN_LEFT)
			.appendField("DistanceSensor")
		this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
	}
}

Blockly.Blocks['DistanceSensorInput'] = {
	init: function() {
		this.appendDummyInput()
			.setAlign(Blockly.ALIGN_LEFT)
			.appendField("DistanceSensorInput Input Form PIN 1")
		this.setOutput(true, 'Number');
	}
}

Blockly.Blocks['TemperatureSensor'] = {
	init: function() {
		this.appendDummyInput()
			.setAlign(Blockly.ALIGN_LEFT)
			.appendField("TemperatureSensor")
		this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
	}
}

Blockly.Blocks['TemperatureSensorInput'] = {
	init: function() {
		this.appendDummyInput()
			.setAlign(Blockly.ALIGN_LEFT)
			.appendField("TemperatureSensorInput")
		this.setOutput(true, 'Number');
	}
}


Blockly.Blocks['Servo'] = {
	init: function() {
		this.appendDummyInput()
			.appendField('Servo degree is(0-180)')
			.appendField(new Blockly.FieldTextInput('90'), 'MgDegree');
		this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
	}
}

Blockly.Blocks['Motordrive'] = {
	init: function() {
		var dropdownOptions = [
      ['หน้า', 'A'],
      ['หลัง', 'B'],
      ['ซ้าย', 'C'],
      ['ขวา', 'D'],
	  ['หยุด', 'E']
    ];

	this.myDropdown_ = new Blockly.FieldDropdown(dropdownOptions);

		this.appendDummyInput()
			.setAlign(Blockly.ALIGN_LEFT)
			.appendField("Motordrive")
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