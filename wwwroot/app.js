let chart;

function calculate() {

    let initial = parseFloat(document.getElementById("initial").value);
    let finalV = parseFloat(document.getElementById("final").value);
    let mass = parseFloat(document.getElementById("mass").value);
    let distance = parseFloat(document.getElementById("distance").value);
    let angle = parseFloat(document.getElementById("angle").value);

    if (isNaN(initial) || isNaN(finalV) || isNaN(mass) || isNaN(distance) || isNaN(angle)) {
        alert("Please fill in all fields correctly.");
        return;
    }

    // 🌊 Volume (irregular solid)
    let volume = finalV - initial;

    // ⚖️ Density
    let density = mass / volume;

    // 📐 Trigonometry (height estimation)
    let radians = angle * Math.PI / 180;
    let height = distance * Math.tan(radians);

    document.getElementById("results").innerHTML = `
        <h2>Results</h2>
        <p>Volume: ${volume.toFixed(2)} mL</p>
        <p>Density: ${density.toFixed(2)} g/mL</p>
        <p>Estimated Height: ${height.toFixed(2)} cm</p>
    `;

    // 📊 GRAPH
    let ctx = document.getElementById("chart").getContext("2d");

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Volume", "Density", "Height"],
            datasets: [{
                label: "Crystal Analysis",
                data: [volume, density, height],
                backgroundColor: ["#38bdf8", "#22c55e", "#f59e0b"]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: { color: "white" }
                }
            },
            scales: {
                x: { ticks: { color: "white" } },
                y: { ticks: { color: "white" } }
            }
        }
    });
}