function autoCheckEmptyBlocks(workspace) {
  console.log("🚀 autoCheckEmptyBlocks is running..."); // ✅ log ตอนเริ่มทำงาน

  workspace.addChangeListener(function(event) {
    // log ตอนสร้าง block ใหม่
    if (event.type === Blockly.Events.BLOCK_CREATE) {
      event.ids.forEach(id => {
        const newBlock = workspace.getBlockById(id);
        if (newBlock) {
          console.log("🟢 Add new block is:", newBlock.type);
        }
      });
    }

    // ตรวจทุก block ใน workspace
    workspace.getAllBlocks(false).forEach(block => {
      if (block.isInFlyout || block.isShadow()) return;

      let warnings = [];

      // ตรวจ input connections
      block.inputList.forEach(input => {
        if (input.connection && !input.connection.targetBlock()) {
          warnings.push(`⚠ Input "${input.name}" ว่างอยู่`);
        }
      });

      // ตรวจ field values
      block.inputList.forEach(input => {
        input.fieldRow.forEach(field => {
          if (field.EDITABLE && !field.getValue()) {
            warnings.push(`⚠ Field "${field.name}" ยังไม่มีค่า`);
          }
        });
      });

      block.setWarningText(warnings.length ? warnings.join("\n") : null);
    });
  });
}
