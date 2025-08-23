/**
 * @license
 * Copyright 2020 Sébastien CANET
 * SPDX-License-Identifier: BSD-3-Clause
 */

/**
 * @fileoverview Helper functions for selecting and changing boards.
 * @author scanet@libreduc.cc (Sébastien CANET)
 */

'use strict';

goog.provide('Blockly.Boards');

//set default profile
profile.default = profile["none"][0];

/**
 * Set board when click in board modal
 */
// Code.setBoard = function () {
//     var boardId = Code.getStringParamFromUrl('board', '');
//     if (!boardId) {
//         boardId = "none";
//     }
//     document.getElementById('boardMenu').value = boardId;
//     profile.default = profile[boardId][0];
// 	// change tooltip & info when a board is selected
// 	if (boardId != "none") {
// 		document.getElementById('boardButton').classList.add('active');
// 		document.getElementById('boardButton').title = profile["default"].description;
// 		document.getElementById('boardButton').onmouseover = function () {
// 			document.getElementById("content_hoverButton").textContent = profile["default"].description;
// 		};
// 		document.getElementById('boardButton').onmouseout = function () {
// 			document.getElementById("content_hoverButton").textContent = "";
// 		};
// 	}
// 		else {
// 			document.getElementById('boardButton').classList.remove('active');
// 			document.getElementById('boardButton').title = MSG['boardButtonSpan'];
// 			document.getElementById('boardButton').onmouseover = function () {
// 				document.getElementById("content_hoverButton").textContent = MSG['boardButtonSpan'];
// 			};
// 			document.getElementById('boardButton').onmouseout = function () {
// 				document.getElementById("content_hoverButton").textContent = "";
// 			};
// 		}
// };

/**
 * Set board throught URL
 */
Code.changeBoard = function ()  {
    var boardMenu = document.getElementById('boardDescriptionSelector');
    var newBoard = encodeURIComponent(boardMenu.options[boardMenu.selectedIndex].value);
    var search = window.location.search;
    if (search.length <= 1) {
        search = '?board=' + newBoard;
    } else if (search.match(/[?&]board=[^&]*/)) {
        search = search.replace(/([?&]board=)[^&]*/, '$1' + newBoard);
    } else {
        search = search.replace(/\?/, '?board=' + newBoard + '&');
    }
    profile["default"] = profile[newBoard][0];
	document.getElementById("boardDescriptionSelector").selectedIndex = newBoard;
	document.getElementById("boardDescriptionSelector").value = newBoard;
	document.getElementById("boardSelected_span").textContent = profile["default"].description;
	document.getElementById("portSelected_span").textContent = ' : ' + document.getElementById('serialMenu').options[document.getElementById('serialMenu').selectedIndex].value;
	window.history.pushState({}, "blocklyduino", window.location.host + window.location.pathname + search);
	// "reboot" elements
	document.getElementById('overlayForModals').style.display = "none";
	document.getElementById('boardListModal').classList.remove('show');
	Code.setBoard();
	Code.buildToolbox();
	var xml = Blockly.Xml.workspaceToDom(Code.workspace);
	Blockly.Xml.domToWorkspace(xml, Code.workspace);
}
;

Code.initializeSerial = async function () {
    const serialButton = document.getElementById('serialButton');
    const serialButtonSpan = document.getElementById('serialButton_span');
    const authorizeButton = document.getElementById('authorizeButton');
    const authorizeButtonSpan = document.getElementById('authorizeButton_span');
	const connectedPortSpan = document.getElementById('connectedPort');
	const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');

    const arduinoDevices = {
        0x0043: "Arduino Uno",
        0x0010: "Arduino Mega",
        0x0243: "Arduino Leonardo",
        0x1002: "Arduino UNO R4 WiFi"
    };

    authorizeButtonSpan.title = "คลิกเพื่อค้นหา Port การเชื่อมต่อ";

    // ฟังก์ชันตรวจสอบและอัปเดตสถานะปุ่ม
    async function updateSerialButton() {
		let boardName = "";
        const ports = await navigator.serial.getPorts();
        
        const arduinoPort = ports.find(port => {
            const info = port.getInfo();
            return arduinoDevices[info.usbProductId];
        });

        if (ports.length === 0 && !arduinoPort) {
            serialButton.disabled = true;
            connectedPortSpan.textContent = `กรุณาเชื่อมต่อบอร์ด Arduino และกดลงทะเบียนบอร์ดกับระบบ`;
            statusDot.classList.remove('connected');
            statusDot.classList.remove('waiting');
            statusDot.classList.add('disconnected');
            return;
        } else {
            const authorizeButton = document.getElementById('authorizeButton');
            authorizeButton.disabled = true;
        }

        if (arduinoPort) {
            boardName = arduinoDevices[arduinoPort.getInfo().usbProductId];
            serialButton.disabled = false;
            serialButtonSpan.title = `คลิกเพื่อเชื่อมต่อ ${boardName}`;
			connectedPortSpan.textContent = `มีบอร์ด ${boardName} กำลังรอการเชื่อมต่อ`;
			statusDot.classList.remove('connected');
            statusDot.classList.remove('disconnected');
            statusDot.classList.add('waiting');
        } else {
            serialButton.disabled = true;
            serialButtonSpan.title = "กรุณาเชื่อมต่อ Arduino ก่อน";
            connectedPortSpan.textContent = `ไม่ได้เชื่อมต่อบอร์ด`;
            statusDot.classList.remove('connected');
            statusDot.classList.remove('waiting');
            statusDot.classList.add('disconnected');
        }

        // ตั้งค่าเหตุการณ์เมื่อคลิกปุ่ม
        serialButton.onclick = async function () {
            if (!arduinoPort) {
				connectedPortSpan.textContent = `ไม่ได้เชื่อมต่อบอร์ด`;
                statusDot.classList.remove('connected');
                statusDot.classList.add('disconnected');
                return;
            }
            try {
                await arduinoPort.open({ baudRate: 9600 });
                Swal.fire({
					icon: 'success',
					title: `เชื่อมต่อกับ ${arduinoDevices[arduinoPort.getInfo().usbProductId]} สำเร็จ`,
					text: 'การเชื่อมต่อกับ Arduino สำเร็จแล้ว!',
					confirmButtonText: 'ตกลง',
                    allowOutsideClick: false
				})
				connectedPortSpan.textContent = `เชื่อมต่อบอร์ด ${boardName} แล้ว`;
				statusDot.classList.remove('disconnected');
                statusDot.classList.remove('waiting');
                statusDot.classList.add('connected');
                serialButton.disabled = true;
            } catch (error) {
                console.error("การเชื่อมต่อล้มเหลว:", error);
                statusDot.classList.remove('connected');
                statusDot.classList.remove('waiting');
                statusDot.classList.add('disconnected');
            }
        };
    }

    // เรียกอัปเดตพอร์ตเมื่อเริ่มต้น
    await updateSerialButton();

    // ตรวจจับการเชื่อมต่อใหม่
    navigator.serial.onconnect = async () => {
        console.log("อุปกรณ์เชื่อมต่อใหม่");
        await updateSerialButton();
    };

    // ตรวจจับการถอดอุปกรณ์
    navigator.serial.ondisconnect = async () => {
        console.log("อุปกรณ์ถูกถอดออก");
        await updateSerialButton();
    };
};

document.getElementById('authorizeButton').onclick = async function () {
    try {
        const isFirstTime = !localStorage.getItem('registeredPorts');

        const port = await navigator.serial.requestPort();    
        Swal.fire({
            icon: 'success',
            title: 'อนุญาตเชื่อมต่อสำเร็จ',
            text: 'พร้อมใช้งานแล้ว กรุณาทำการกด Connect กับ Board อีกรอบ',
            confirmButtonText: 'ตกลง',
            allowOutsideClick: false
        }).then((result) => {
            if (result.isConfirmed) {
                const registeredPorts = JSON.parse(localStorage.getItem('registeredPorts') || '[]');
                const portInfo = port.getInfo();
                registeredPorts.push(portInfo);
                localStorage.setItem('registeredPorts', JSON.stringify(registeredPorts));
                Code.initializeSerial();
            }
        });
    } catch (error) {
        console.error('Authorization failed:', error);
    }
}

// เรียกฟังก์ชันเมื่อโหลดหน้าเพจ
document.addEventListener('DOMContentLoaded', Code.initializeSerial);
