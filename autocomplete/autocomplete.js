let availableOptions = [
    "HTML",
    "CSS",
    "Javascript",
    "React",
    "Redux",
    "Next.js",
    "Typescript",
    "Next.js",
    "LOL",
    "SKT T1 Faker"
];

const resultsBox = document.querySelector(".result-box");
const inputBox = document.getElementById("input-box");

// !!注意!! 這邊用 onkeyup 的話, 若輸入法為中文會觸發不了
inputBox.addEventListener("input", debounce(function() {
    let result = [];
    let input = inputBox.value;
    if (input.length > 0) {
        result = availableOptions.filter((option) => option.toLowerCase().includes(input.toLowerCase()));
    }
    display(result);
}));

function display(result) {
    let content = "";
    for (const list of result) {
        content += `<li onclick=selectInput(this)>${list}</li>`;
    }
    resultsBox.innerHTML = result.length > 0 ? `<ul>${content}</ul>` : "";
};

function selectInput(list) {
    inputBox.value = list.innerHTML;
    resultsBox.innerHTML = "";
}

function debounce(fn, delay = 300) {
    let timer;

    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn(...args);
        }, delay)
    };
};