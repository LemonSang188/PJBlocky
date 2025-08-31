const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const tmp = require('tmp');
const { exec } = require('child_process');

const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const app = express();
const port = 8080;

app.use(cors());
app.use(bodyParser.json());

app.post('/verify-code', async (req, res) => {
  const { code, boardName } = req.body;

  if (!code || !boardName) {
    return res.status(400).send('Missing code or boardName');
  }

  // สร้างโฟลเดอร์ชั่วคราว
  tmp.dir({ unsafeCleanup: true }, (err, tempDirPath, cleanupCallback) => {
    if (err) {
      console.error('Failed to create temp dir:', err);
      return res.status(500).send('Failed to create temporary folder');
    }

    const sketchName = 'SketchBlockly';
    const sketchFolder = `${tempDirPath}/${sketchName}`;
    const sketchFilePath = `${sketchFolder}/${sketchName}.ino`;

    // สร้างโฟลเดอร์ย่อย
    fs.mkdirSync(sketchFolder);

    // เขียนไฟล์ลงในโฟลเดอร์ย่อย
    fs.writeFileSync(sketchFilePath, code);

    const arduinoCliPath = 'D:/pjaon/tools/arduino-cli.exe';
    const cmd = `${arduinoCliPath} compile --fqbn ${boardName} "${sketchFolder}"`;

    exec(cmd, (error, stdout, stderr) => {
      cleanupCallback();

      if (error) {
        console.error('❌ Compile error:\n', stderr || stdout);
        return res.status(400).json({
          success: false,
          error: stderr || stdout || error.message
        });
      }

      console.log('✅ Compile success:\n', stdout);
      res.status(200).json({
        success: true,
        message: stdout
      });
    });
  });
});

app.post('/upload-code', async (req, res) => {
  const { code, productId, vendorId, boardName } = req.body;

  if (!code || !boardName || !productId || !vendorId) {
    return res.status(400).send('Missing required parameters');
  }

  const ports = await SerialPort.list();
  const targetPort = ports.find(p => {
    const portVendorId = p.vendorId ? parseInt(p.vendorId, 16) : null;
    const portProductId = p.productId ? parseInt(p.productId, 16) : null;
    return portVendorId === vendorId && portProductId === productId;
  });

  if (!targetPort) {
    return res.status(404).send('Target serial port not found');
  }

  tmp.dir({ unsafeCleanup: true }, (err, tempDirPath, cleanupCallback) => {
    if (err) {
      console.error('Failed to create temp dir:', err);
      return res.status(500).send('Failed to create temporary folder');
    }

    const sketchName = 'SketchBlockly';
    const sketchFolder = `${tempDirPath}/${sketchName}`;
    const sketchFilePath = `${sketchFolder}/${sketchName}.ino`;

    try {
      fs.mkdirSync(sketchFolder);
      fs.writeFileSync(sketchFilePath, code);
    } catch (e) {
      console.error('Failed to write sketch file:', e);
      cleanupCallback();
      return res.status(500).send('Failed to write sketch file');
    }

    const arduinoCliPath = path.resolve(__dirname, '../tools/arduino-cli.exe');
    const compileCmd = `"${arduinoCliPath}" compile --fqbn ${boardName} "${sketchFolder}"`;
    const uploadCmd = `"${arduinoCliPath}" upload -p "${targetPort.path}" --fqbn ${boardName} "${sketchFolder}"`;

    console.log(`Compiling for board: ${boardName} at port ${targetPort.path}`);
    console.log(`arduinoCliPath : ${arduinoCliPath}`);
    console.log(`compileCmd : ${compileCmd}`);

    exec(compileCmd, (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Compile error:\n', stderr || stdout);
        cleanupCallback();
        return res.status(400).json({
          success: false,
          error: stderr || stdout || error.message
        });
      }

      console.log('✅ Compile success, now uploading...');

      exec(uploadCmd, (error, stdout, stderr) => {
        cleanupCallback();

        if (error) {
          console.error('❌ Upload error:\n', stderr || stdout);
          return res.status(400).json({
            success: false,
            error: stderr || stdout || error.message
          });
        }

        console.log('✅ Upload success:\n', stdout);
        res.status(200).json({
          success: true,
          message: stdout
        });
      });
    });
  });
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

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});