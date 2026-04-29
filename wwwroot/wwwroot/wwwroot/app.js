async function calculate(){

    let data = {
        shape: document.getElementById("shape").value,
        a: parseFloat(a.value),
        b: parseFloat(b.value),
        h1: parseFloat(h1.value),
        h2: parseFloat(h2.value)
    };

    let res = await fetch("/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    let json = await res.json();

    document.getElementById("result").innerHTML =
        "🧊 Volume: " + json.volume.toFixed(2);
}
