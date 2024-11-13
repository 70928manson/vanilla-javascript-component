function fib(n) {
    const arr = [0, 1];

    for (let i = 2; i <= n; i++) {
        arr[i] = arr[i-1] + arr[i-2]
    }

    console.log("arr", arr);
    // return arr
}

fib(10);