const inputBox = document.getElementById("inputBox");
const undoButton = document.getElementById("undoButton");
const redoButton = document.getElementById("redoButton");
const output = document.getElementById("output");

// 建立 undo 和 redo 堆疊
let undoStack = [];  // 過去
let redoStack = [];  // 未來

// 每次 input 變動時，儲存當前值到 undoStack 並清空 redoStack
inputBox.addEventListener("input", (e) => {
    undoStack.push(e.target.value);
    redoStack = []; // 清空 redoStack
    updateButtons();
    updateOutput(e.target.value);
});

// 更新 Undo 和 Redo 按鈕狀態
function updateButtons() {
    undoButton.disabled = undoStack.length <= 1; // 至少有一個以上的狀態才能 Undo
    redoButton.disabled = redoStack.length === 0; // redoStack 有內容才能 Redo
}

// 更新輸出值
function updateOutput(value) {
    output.textContent = value;
}

// 撤銷 (Undo) 功能
undoButton.addEventListener("click", () => {
    if (undoStack.length > 1) { // 保留初始狀態
        redoStack.push(undoStack.pop()); // 將當前狀態移到 redoStack
        const previousValue = undoStack[undoStack.length - 1];
        inputBox.value = previousValue;
        updateOutput(previousValue);
        updateButtons();
    }
});

// 重做 (Redo) 功能
redoButton.addEventListener("click", () => {
    if (redoStack.length > 0) {
        const redoValue = redoStack.pop(); // 取出 redoStack 的狀態
        undoStack.push(redoValue); // 加回到 undoStack
        inputBox.value = redoValue;
        updateOutput(redoValue);
        updateButtons();
    }
});