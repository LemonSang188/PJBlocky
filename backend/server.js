const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // นำเข้า cors package
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

// สร้าง app ด้วย express
const app = express();
const port = 8080;

// ใช้ cors middleware เพื่ออนุญาตการเข้าถึงจาก origin อื่น
app.use(cors()); // เปิดใช้งาน CORS

// ใช้ body-parser เพื่อแปลง JSON request body
app.use(bodyParser.json());

async function openSerialPort(portName, code, res) {
  console.log('Port Name:', portName);

  try {
    // ตรวจสอบว่าพอร์ตที่ต้องการใช้งานมีอยู่จริง
    const ports = await SerialPort.list();
    const targetPort = ports.find(p => p.path === portName);

    if (!targetPort) {
      res.status(404).send(`Port ${portName} not found`);
      return;
    }

    // ตั้งค่า Serial Port
    const serialPort = new SerialPort({
      path: portName,
      baudRate: 9600,
      autoOpen: false, // เปิดพอร์ตด้วย manual
    });

    // เปิดพอร์ต
    serialPort.open(err => {
      if (err) {
        if (err.message.includes('Access denied')) {
          res.status(403).send('Access denied: Another program may be using this port');
        } else {
          res.status(500).send(`Failed to open serial port: ${err.message}`);
        }
        return;
      }

      console.log(`Serial port ${portName} opened`);

      // ส่งโค้ดไปยังบอร์ด Arduino
      serialPort.write("Hi Mom!", error => {
        if (error) {
          res.status(500).send('Failed to send data to the device');
        } else {
          console.log('Code sent successfully');
          res.status(200).send('Code uploaded successfully');
        }
      });

      // รับข้อมูลจากอุปกรณ์ (Arduino)
      const parser = serialPort.pipe(new ReadlineParser({ delimiter: '\n' }));
      parser.on('data', data => {
        console.log('Received from Arduino:', data);
      });

      // ตรวจสอบให้แน่ใจว่าโปรแกรมไม่ได้ปิดพอร์ตเร็วเกินไป
      serialPort.on('close', () => {
        console.log('Serial port closed');
      });
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).send('Unexpected error occurred');
  }
}

// เมื่อได้รับคำขอ POST ที่ endpoint /upload-code
app.post('/upload-code', async (req, res) => {
  const { code, productId, vendorId, boardName } = req.body;
  const ports = await SerialPort.list();
  const mapPort = ports.filter(p => {
    const portVendorId = p.vendorId ? parseInt(p.vendorId, 16) : null;
    const portProductId = p.productId ? parseInt(p.productId, 16) : null;
  
    return portVendorId === vendorId && portProductId === productId;
  });  
  
  openSerialPort(mapPort[0].path, code, res)
});

app.get('/list-ports', async (req, res) => {
  try {
      const ports = await SerialPort.list();

      // แปลงค่า vendorId และ productId เป็นฐาน 10
      const portsFormatted = ports.map(port => ({
          ...port,
          vendorIdDecimal: port.vendorId ? parseInt(port.vendorId, 16) : null,
          productIdDecimal: port.productId ? parseInt(port.productId, 16) : null,
      }));

      res.status(200).json(portsFormatted);
  } catch (error) {
      console.error('Error listing serial ports:', error);
      res.status(500).send('Failed to list serial ports');
  }
});

// เริ่มฟังการเชื่อมต่อที่พอร์ต 8080
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});