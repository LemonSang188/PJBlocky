const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const tmp = require('tmp');
const { spawn } = require('child_process');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const app = express();
const port = 8080;

app.use(cors());
app.use(bodyParser.json());

let activeSerial = null;   // พอร์ตที่กำลังเปิด
let parser = null;
let clients = [];          // เก็บ client /monitor SSE
let lastLine = null;       // เก็บค่า Serial ล่าสุด

function broadcast(message) {
  clients.forEach(clientRes => {
    clientRes.write(`data: ${message}\n\n`);
    if (clientRes.flush) clientRes.flush(); // บังคับส่งข้อมูลทันที
  });
}

/**
 * Monitor Serial แบบ SSE (broadcast ให้ทุก client)
 */
app.get('/monitor', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  console.log("👀 Client connected to /monitor");
  clients.push(res);

  req.on('close', () => {
    console.log("❌ Client disconnected from /monitor");
    clients = clients.filter(r => r !== res);
  });
});

// ส่งค่าล่าสุดไปทุก client ทุก 1 วิ
setInterval(() => {
  if (lastLine !== null) {
    clients.forEach(clientRes => clientRes.write(`data: ${lastLine}\n\n`));
    lastLine = null; // เคลียร์เพื่อรอค่าถัดไป
  }
}, 0);

/**
 * Verify Code (compile only)
 */
app.post('/verify-code', async (req, res) => {
  const { code, boardName } = req.body;

  if (!code || !boardName) {
    return res.status(400).send('Missing code or boardName');
  }

  tmp.dir({ unsafeCleanup: true }, (err, tempDirPath, cleanupCallback) => {
    if (err) {
      console.error('Failed to create temp dir:', err);
      return res.status(500).send('Failed to create temporary folder');
    }

    const sketchName = 'SketchBlockly';
    const sketchFolder = `${tempDirPath}/${sketchName}`;
    const sketchFilePath = `${sketchFolder}/${sketchName}.ino`;

    fs.mkdirSync(sketchFolder, { recursive: true });
    fs.writeFileSync(sketchFilePath, code);

    console.log('✅ Temporary sketch created at:', sketchFilePath);

    const arduinoCliPath = "D:/Blockmicc1/tools/arduino-cli.exe";

    const compileProcess = spawn(arduinoCliPath, [
      "compile", "--fqbn", boardName, sketchFolder
    ], { shell: true });

    let compileOutput = "";

    compileProcess.stdout.on('data', data => {
      const text = data.toString();
      compileOutput += text;
      console.log(`[stdout] ${text}`);
    });

    compileProcess.stderr.on('data', data => {
      const text = data.toString();
      compileOutput += text;
      console.error(`[stderr] ${text}`);
    });

    compileProcess.on('close', code => {
      cleanupCallback();

      if (code === 0) {
        console.log("✅ Compile succe");
        return res.status(200).json({
          success: true,
          message: `✅ Verify-Code "OK"\n${compileOutput}`
        });
      } else {
        console.error("❌ Compile failed");
        return res.status(400).json({
          success: false,
          message: `❌ verify-code failed\n${compileOutput}`
        });
      }
    });
  });
});

/**
 * Upload Code (compile + upload + open serial for /monitor)
 */
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
    console.error("❌ Target serial port not found. Ports available:", ports);
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

    const arduinoCliPath = "D:/Blockmicc1/tools/arduino-cli.exe";

    let compileOutput = "";
    console.log(`⚡ Compiling for board: ${boardName} at port ${targetPort.path}`);

    // ---------- Compile ----------
    const compileProcess = spawn(arduinoCliPath, [
      "compile", "--fqbn", boardName, sketchFolder
    ], { shell: true });

    compileProcess.stdout.on("data", data => {
      const text = data.toString();
      compileOutput += text;
      console.log(`[stdout][compile] ${text}`);
    });

    compileProcess.stderr.on("data", data => {
      const text = data.toString();
      compileOutput += text;
      console.error(`[stderr][compile] ${text}`);
    });

    compileProcess.on("close", code => {
      if (code !== 0) {
        cleanupCallback();
        return res.status(400).json({
          success: false,
          message: `❌ Compile failed\n${compileOutput}`
        });
      }

  console.log("✅ Compile success, now uploading...");
  broadcast("✅ Compile success, now uploading..."); 

  let uploadOutput = ""; 
  

      // ---------- Upload ----------
      const uploadProcess = spawn(arduinoCliPath, [
        "upload", "-p", targetPort.path, "--fqbn", boardName, sketchFolder
      ], { shell: true });

      uploadProcess.stdout.on("data", data => {
        const text = data.toString();
        uploadOutput += text;
        console.log(`[stdout][upload] ${text}`);
      });

      uploadProcess.stderr.on("data", data => {
        const text = data.toString();
        uploadOutput += text;
        console.error(`[stderr][upload] ${text}`);
      });

      uploadProcess.on("close", code => {
        cleanupCallback();
        if (code === 0) {
          console.log("✅ Upload success");
          broadcast("✅ Upload success"); 

          // ---------- Serial Setup ----------
          if (activeSerial) {
            parser.removeAllListeners("data"); // clear old listeners
          } else {
            activeSerial = new SerialPort({
              path: targetPort.path,
              baudRate: 9600
            });
          }

          parser = activeSerial.pipe(new ReadlineParser({ delimiter: '\r\n' }));

          // เก็บค่าล่าสุดจาก Serial (กรอง 0.00 °C)
          parser.on("data", line => {
            if (line.includes("Temperature: 0.00")) {
              console.log("🚫 Ignore invalid value:", line);
              return; // ไม่เก็บค่า 0.00
            }
            lastLine = line;
            console.log(`📟 Serial: ${line}`);
          });

          return res.status(200).json({
            success: true,
            message: `✅ Upload success\n${uploadOutput}`
          });
        } else {
          console.error("❌ Upload failed");
          return res.status(400).json({
            success: false,
            message: `❌ Upload failed\n${uploadOutput}`
          });
        }
      });
    });
  });
});

/**
 * List Ports
 */
app.get('/list-ports', async (req, res) => {
  try {
    const ports = await SerialPort.list();
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
  console.log(`🚀 Server running at http://localhost:${port}`);
});