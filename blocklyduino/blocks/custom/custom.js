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

		this.myDropdown_A = new Blockly.FieldDropdown(dropdownOptionsA, function(newValue) {
			var block = this.getSourceBlock();
			switch(newValue) {
				case 'R':
					block.setColour("#ff0000"); // แดง
					break;
				case 'G':
					block.setColour("#00ff00"); // เขียว
					break;
				case 'B':
					block.setColour("#0000ff"); // น้ำเงิน
					break;
			}
			return newValue;
		});

		this.myDropdown_B = new Blockly.FieldDropdown(dropdownOptionsB);

		this.appendDummyInput()
			.setAlign(Blockly.ALIGN_LEFT)
			.appendField("LedRGB")
			.appendField(this.myDropdown_A, 'ledRGB')
			.appendField("are")
			.appendField(this.myDropdown_B, 'ledState')

		this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);

		this.setColour("#ff0000"); // 0–360 hue, สี Arduino  230
		
	}
};

Blockly.Blocks['MethaneGasSensor'] = {
	init: function() {
		this.appendDummyInput()
			.setAlign(Blockly.ALIGN_LEFT)
			.appendField("MethaneGasSensor");
		this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);

		this.setColour("#00979D");
	}
};

Blockly.Blocks['MethaneGasSensorInput'] = {
	init: function() {
		this.appendDummyInput()
			.setAlign(Blockly.ALIGN_LEFT)
			.appendField("MethaneGasSensorInput Form PIN A1");
		this.setOutput(true, 'Number'); 
		this.setTooltip('อ่านค่าระยะทางจาก Ultrasonic Sensor');

		this.setColour("#00979D");

	}
};

Blockly.Blocks['DistanceSensor'] = {
	init: function() {
		this.appendDummyInput()
			.setAlign(Blockly.ALIGN_LEFT)
			.appendField("DistanceSensor")
		this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);

		this.setColour("#00979D");
	}
}

Blockly.Blocks['DistanceSensorInput'] = {
	init: function() {
		this.appendDummyInput()
			.setAlign(Blockly.ALIGN_LEFT)
			.appendField("DistanceSensorInput Input Form PIN 1")
		this.setOutput(true, 'Number');

		this.setColour("#00979D");
	}
}

Blockly.Blocks['TemperatureSensor'] = {
	init: function() {
		this.appendDummyInput()
			.setAlign(Blockly.ALIGN_LEFT)
			.appendField("TemperatureSensor")
		this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);

		this.setColour("#00979D");
	}
}

Blockly.Blocks['TemperatureSensorInput'] = {
	init: function() {
		this.appendDummyInput()
			.setAlign(Blockly.ALIGN_LEFT)
			.appendField("TemperatureSensorInput")
		this.setOutput(true, 'Number');

		this.setColour("#00979D");
	}
}


Blockly.Blocks['Servo'] = {
	init: function() {
		this.appendDummyInput()
			.appendField('Servo degree is(0-180)')
			.appendField(new Blockly.FieldTextInput('90'), 'MgDegree');
		this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);

		this.setColour("#00979D");
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

		this.setColour("#00979D");
	}
};

Blockly.Blocks['delay'] = {
	init: function() {
    this.appendDummyInput()
        .appendField("Delay ")
        .appendField(new Blockly.FieldTextInput('1000'), 'DelayValue');
    
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);

	this.setColour("#00979D");
  }
};