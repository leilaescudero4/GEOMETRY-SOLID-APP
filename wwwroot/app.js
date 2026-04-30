let scene, camera, renderer, mesh;
let chart;

// -------- 3D INIT --------
function init3D() {

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);

    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById("scene")
    });

    renderer.setSize(300, 300);
    camera.position.z = 5;

    let light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);

    animate();
}

function animate() {
    requestAnimationFrame(animate);

    if (mesh) {
        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.01;
    }

    renderer.render(scene, camera);
}

// -------- CREATE SHAPE --------
function createShape(type) {

    if (mesh) scene.remove(mesh);

    let geometry;

    if (type === "ellipsoid") {
        geometry = new THREE.SphereGeometry(1, 32, 32);
        geometry.scale(1, 0.7, 1.2);
    }

    else if (type === "cone_dome") {
        geometry = new THREE.ConeGeometry(1, 2, 32);
    }

    else {
        geometry = new THREE.PlaneGeometry(4, 4, 32, 32);

        let pos = geometry.attributes.position;

        for (let i = 0; i < pos.count; i++) {
            pos.setZ(i, Math.random());
        }

        geometry.rotateX(-Math.PI / 2);
    }

    mesh = new THREE.Mesh(
        geometry,
        new THREE.MeshStandardMaterial({ color: 0x00e676 })
    );

    scene.add(mesh);
}

// -------- CALCULATE --------
async function calculate() {

    let shape = document.getElementById("shape").value;

    let data = {
        shape: shape,
        a: Number(document.getElementById("a").value),
        b: Number(document.getElementById("b").value),
        h1: Number(document.getElementById("h1").value),
        h2: Number(document.getElementById("h2").value)
    };

    createShape(shape);

    let res = await fetch("/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    let json = await res.json();

    document.getElementById("result").innerHTML =
        "Volume: " + json.volume.toFixed(2);

    updateGraph(shape, json.volume);
}

// -------- GRAPH --------
function updateGraph(shape, value) {

    let values = [0, 0, 0];

    if (shape === "ellipsoid") values[0] = value;
    if (shape === "cone_dome") values[1] = value;
    if (shape === "terrain") values[2] = value;

    if (chart) chart.destroy();

    chart = new Chart(document.getElementById("volumeChart"), {
        type: "bar",
        data: {
            labels: ["Ellipsoid","Cone+Dome","Terrain"],
            datasets: [{
                label: "Volume",
                data: values
            }]
        }
    });
}

// -------- CLEAR --------
function clearAll() {
    ["a","b","h1","h2"].forEach(id => document.getElementById(id).value = "");
    document.getElementById("result").innerHTML = "Waiting...";
}

// -------- INIT --------
window.onload = function () {
    init3D();
};