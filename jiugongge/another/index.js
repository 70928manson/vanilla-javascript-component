let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function renderContainer() {
    const container = document.getElementById("container");

    container.innerHTML = "";

    numbers.forEach((num) => {
        const item = document.createElement('div');
        item.className="item";
        item.textContent = num;
        container.appendChild(item)
    })
}

function handelShift() {
    const last = numbers.pop();
    numbers.unshift(last);

    // numbers 變動後更新畫面
    renderContainer();
}

// 初次渲染
renderContainer();

document.getElementById("shiftButton").addEventListener('click', handelShift);