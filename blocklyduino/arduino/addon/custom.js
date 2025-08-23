'use strict';

goog.provide('Blockly.Arduino.custom');

goog.require('Blockly.Arduino');


Blockly.Arduino['testblock'] = function() {
  Blockly.Arduino.setups_['RGBR'] = 'const int RGB_R = 9';
  Blockly.Arduino.setups_['RGBG'] = 'const int RGB_G = 10';
  Blockly.Arduino.setups_['RGBB'] = 'const int RGB_B = 11';
  const rgbLoopCode = `
    // ปิดไฟทั้งหมด
    analogWrite(RGB_R, 0);
    analogWrite(RGB_G, 0);
    analogWrite(RGB_B, 0);
    delay(500);

    // แสดงสีแดง
    analogWrite(RGB_R, 255);
    analogWrite(RGB_G, 0);
    analogWrite(RGB_B, 0);
    delay(500);

    // แสดงสีเขียว
    analogWrite(RGB_R, 0);
    analogWrite(RGB_G, 255);
    analogWrite(RGB_B, 0);
    delay(500);

    // แสดงสีน้ำเงิน
    analogWrite(RGB_R, 0);
    analogWrite(RGB_G, 0);
    analogWrite(RGB_B, 255);
    delay(500);

    // แสดงสีขาว
    analogWrite(RGB_R, 255);
    analogWrite(RGB_G, 255);
    analogWrite(RGB_B, 255);
    delay(500);
    `;
  var code = rgbLoopCode;
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};
