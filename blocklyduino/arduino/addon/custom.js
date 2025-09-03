'use strict';

goog.provide('Blockly.Arduino.custom');

goog.require('Blockly.Arduino');


Blockly.Arduino['LedRGB'] = function(block) {
  Blockly.Arduino.definitions_['defieRGBR'] = 'const int RGB_R = 9;';
  Blockly.Arduino.definitions_['defieRGBG'] = 'const int RGB_G = 10;';
  Blockly.Arduino.definitions_['defieRGBB'] = 'const int RGB_B = 11;';
  Blockly.Arduino.setups_['RGBR'] = 'pinMode(RGB_R, OUTPUT);';
  Blockly.Arduino.setups_['RGBG'] = 'pinMode(RGB_G, OUTPUT);';
  Blockly.Arduino.setups_['RGBB'] = 'pinMode(RGB_B, OUTPUT);';

  var ledRGB  = block.getFieldValue('ledRGB');
  var ledState = block.getFieldValue('ledState');
  var code = ``;

  if (ledState == "O"){
    code = `
      //ปิดไฟ
      analogWrite(RGB_R, 0);
      analogWrite(RGB_G, 0);
      analogWrite(RGB_B, 0);
      `;
  };
  if (ledState == "I" && ledRGB == "R"){
    code = `
      //แสดงไฟสีแดง
      analogWrite(RGB_R, 255);
      analogWrite(RGB_G, 0);
      analogWrite(RGB_B, 0);
      `;
  };
  if (ledState == "I" && ledRGB == "G"){
    code = `
      //แสดงไฟสีเขียว
      analogWrite(RGB_R, 0);
      analogWrite(RGB_G, 255);
      analogWrite(RGB_B, 0);
      `;
  };
  if (ledState == "I" && ledRGB == "B"){
    code = `
      //แสดงไฟสีน้ำเงิน
      analogWrite(RGB_R, 0);
      analogWrite(RGB_G, 0);
      analogWrite(RGB_B, 255);
      `;
  };

  return code;
};

Blockly.Arduino['MhMqSensor'] = function() {
  Blockly.Arduino.definitions_['MQdefie1'] = '#define MQ2_ANALOG A1';
  Blockly.Arduino.definitions_['MQdefie2'] = '#define MQ2_DIGITAL 2';
  Blockly.Arduino.definitions_['MQdefie3'] = 'int gasValue = 0;';
  Blockly.Arduino.definitions_['MQdefie4'] = 'bool gasDetected = false;';
  Blockly.Arduino.setups_['MQPin'] = 'pinMode(MQ2_DIGITAL, INPUT);';
  var code = `
  gasValue = analogRead(MQ2_ANALOG);
  gasDetected = digitalRead(MQ2_DIGITAL);

  Serial.print("Gas Value (analog): ");
  Serial.print(gasValue);

  if (gasDetected == LOW) {
      Serial.println(" - ⚠️ Gas Detected!");
  } else {
      Serial.println(" - ✅ Normal");
  }`;
  return code;
};

Blockly.Arduino['MhMqSensorInput'] = function() {
  Blockly.Arduino.definitions_['MQdefie1'] = '#define MQ2_ANALOG A1';
  Blockly.Arduino.setups_['MQPin'] = 'pinMode(MQ2_DIGITAL, INPUT);';
  var code = `analogRead(MQ2_ANALOG)`;
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['HcSr04'] = function() {
  Blockly.Arduino.definitions_['HCdefie1'] = '#define ECHO_PIN 1';
  Blockly.Arduino.definitions_['HCdefie2'] = '#define TRIG_PIN 3'
  Blockly.Arduino.definitions_['HCdefie3'] = 'long duration;'
  Blockly.Arduino.definitions_['HCdefie3'] = 'float distance;'
  Blockly.Arduino.setups_['HCPin1'] = 'pinMode(ECHO_PIN, INPUT);';
  Blockly.Arduino.setups_['HCPin2'] = 'pinMode(TRIG_PIN, OUTPUT);';
  var code = `
    digitalWrite(TRIG_PIN, LOW);
    delayMicroseconds(2);
    digitalWrite(TRIG_PIN, HIGH);
    delayMicroseconds(10);
    digitalWrite(TRIG_PIN, LOW);

    duration = pulseIn(ECHO_PIN, HIGH);
    distance = duration * 0.034 / 2;

    Serial.print("Distance: ");
    Serial.print(distance);
    Serial.println(" cm");
    `;
  return code;
};

Blockly.Arduino['HcSr04Input'] = function() {
  Blockly.Arduino.definitions_['HCdefie1'] = '#define ECHO_PIN 1';
  Blockly.Arduino.definitions_['HCdefie2'] = '#define TRIG_PIN 3'
  Blockly.Arduino.setups_['HCPin1'] = 'pinMode(ECHO_PIN, INPUT);';
  Blockly.Arduino.setups_['HCPin2'] = 'pinMode(TRIG_PIN, OUTPUT);';
  Blockly.Arduino.definitions_['ultrasonic_func'] = `
  long ultrasonicRead(int TRIG_PIN, int ECHO_PIN) {
  pinMode(TRIG_PIN, OUTPUT);
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  pinMode(ECHO_PIN, INPUT);
  return pulseIn(ECHO_PIN, HIGH) * 0.034 / 2;
  }`;

  var code = 'ultrasonicRead(TRIG_PIN,ECHO_PIN )';

  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['52abLm35Dz'] = function() {
  Blockly.Arduino.definitions_['52abdefie1'] = '#define LM35_PIN A0';
  Blockly.Arduino.definitions_['52abdefie2'] = 'int tempValue = 0;';
  Blockly.Arduino.definitions_['52abdefie3'] = 'float temperatureC = 0.0;';
  Blockly.Arduino.setups_['52abdefiePin'] = "// LM35 doesn't need pinMode because analogRead handles it";
  var code = `
    tempValue = analogRead(LM35_PIN);
    float mv = tempValue * (5.0 / 1023.0);
    float cel = mv * 100.0;

    Serial.print("Temperature: ");
    Serial.print(cel);
    Serial.println(" °C");
    `;
  return code;
};

Blockly.Arduino['52abLm35DzInput'] = function() {
  Blockly.Arduino.definitions_['52abdefie1'] = '#define LM35_PIN A0';
  Blockly.Arduino.setups_['52abdefiePin'] = "// LM35 doesn't need pinMode because analogRead handles it";
  var code = `analogRead(ECHO_PIN) * 0.48828125`;
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['Mg996r'] = function(block) {
  Blockly.Arduino.definitions_['MGdefie'] = '#define Servo_PIN 6';
  Blockly.Arduino.setups_['MGPin'] = 'Myservo.attach(Servo_PIN);';
  Blockly.Arduino.includes_['includes_servo'] = '#include <Servo.h>';

  var valuedegree = block.getFieldValue('MgDegree')
  var code = 'Myservo.write' +'('+ valuedegree + ');'
  return code;
};

Blockly.Arduino['delay'] = function(block) {
  var DelayValue = block.getFieldValue('DelayValue');
  var code = `delay(${DelayValue});`;
  return code;
};

Blockly.Arduino['L9110'] = function(block) {
  Blockly.Arduino.definitions_['L9defie1'] = '#define L9110A1A 7';
  Blockly.Arduino.definitions_['L9defie2'] = '#define L9110A1B 8';
  Blockly.Arduino.definitions_['L9defie3'] = '#define L9110B1A 12';
  Blockly.Arduino.definitions_['L9defie4'] = '#define L9110B1B 13';

  Blockly.Arduino.setups_['L9Setup1'] = 'pinMode(L9110A1A, OUTPUT);';
  Blockly.Arduino.setups_['L9Setup2'] = 'pinMode(L9110A1B, OUTPUT);';
  Blockly.Arduino.setups_['L9Setup3'] = 'pinMode(L9110B1A, OUTPUT);';
  Blockly.Arduino.setups_['L9Setup4'] = 'pinMode(L9110B1B, OUTPUT);';

  var L9Value = block.getFieldValue('L9Value');
  var code = '';

  switch (L9Value) {
    case 'A' :
      code = `
  digitalWrite(L9110A1A,HIGH);
  digitalWrite(L9110A1B,LOW);
  digitalWrite(L9110B1A,HIGH);
  digitalWrite(L9110B1B,LOW);
  `;
  break;
    case 'B' :
      code = `
  digitalWrite(L9110A1A,LOW);
  digitalWrite(L9110A1B,HIGH);
  digitalWrite(L9110B1A,LOW);
  digitalWrite(L9110B1B,HIGH);
  `;
  break;
  case 'C' :
      code = `
  digitalWrite(L9110A1A,LOW);
  digitalWrite(L9110A1B,LOW);
  digitalWrite(L9110B1A,HIGH);
  digitalWrite(L9110B1B,LOW);
  `;
  break;
  case 'D' :
      code = `
  digitalWrite(L9110A1A,HIGH);
  digitalWrite(L9110A1B,LOW);
  digitalWrite(L9110B1A,LOW);
  digitalWrite(L9110B1B,LOW);
  `;
  break;
  default:
      // หากไม่มี case ใดตรงกัน ให้สร้างโค้ดเริ่มต้นนี้
      code = '// No selected\n';
  };


  return code;
};