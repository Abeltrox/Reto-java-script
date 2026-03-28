const nombres = [];
const notas = []; 

document.getElementById("formulario").addEventListener("submit", function(e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const n1 = parseFloat(document.getElementById("nota1").value);
    const n2 = parseFloat(document.getElementById("nota2").value);
    const n3 = parseFloat(document.getElementById("nota3").value);
    const mensaje = document.getElementById("mensaje");
    
    if (!nombre || isNaN(n1) || isNaN(n2) || isNaN(n3)) {
        mensaje.textContent = "Todos los campos son obligatorios.";
        return;
    }

    if ([n1,n2,n3].some(n => n < 0 || n > 100)) {
        mensaje.textContent = "Las notas deben estar entre 0 y 100.";
        return;
    }

    if (nombres.length >= 10) {
        mensaje.textContent = "Ya se ingresaron los 10 alumnos.";
        return;
    }

    mensaje.textContent = "";

    nombres.push(nombre);
    notas.push([n1, n2, n3]);

    this.reset();

    if (nombres.length === 10) {
        procesarDatos();
    }
});

function promedio(arr) {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function procesarDatos() {
    const promediosAlumnos = notas.map(n => promedio(n));

    const promediosCertamen = [0,0,0];

    notas.forEach(n => {
        n.forEach((nota, i) => {
            promediosCertamen[i] += nota;
        });
    });

    for (let i = 0; i < 3; i++) {
        promediosCertamen[i] /= notas.length;
    }

    const promedioGeneral = promedio(promediosAlumnos);


    const aprobados = promediosAlumnos.filter(p => p >= 55).length;
    const reprobados = promediosAlumnos.length - aprobados;


    const alumnosOrdenados = nombres.map((nombre, i) => ({
        nombre,
        notas: notas[i],
        promedio: promediosAlumnos[i]
    })).sort((a,b) => b.promedio - a.promedio);

    mostrarResultados(alumnosOrdenados, promediosCertamen, promedioGeneral, aprobados, reprobados);
}

function mostrarResultados(alumnos, promediosCertamen, promedioGeneral, aprobados, reprobados) {
    let html = `
        <h2>Resultados</h2>

        <table>
            <tr>
                <th>Nombre</th>
                <th>C1</th>
                <th>C2</th>
                <th>C3</th>
                <th>Promedio</th>
            </tr>
    `;

    alumnos.forEach(a => {
        html += `
            <tr>
                <td>${a.nombre}</td>
                <td>${a.notas[0]}</td>
                <td>${a.notas[1]}</td>
                <td>${a.notas[2]}</td>
                <td>${a.promedio.toFixed(2)}</td>
            </tr>
        `;
    });

    html += `</table>`;

    html += `
        <h3>Estadísticas del Curso</h3>
        <p>Promedio Certamen 1: ${promediosCertamen[0].toFixed(2)}</p>
        <p>Promedio Certamen 2: ${promediosCertamen[1].toFixed(2)}</p>
        <p>Promedio Certamen 3: ${promediosCertamen[2].toFixed(2)}</p>
        <p><strong>Promedio General: ${promedioGeneral.toFixed(2)}</strong></p>
        <p>Aprobados: ${aprobados}</p>
        <p>Reprobados: ${reprobados}</p>
    `;

    document.getElementById("resultados").innerHTML = html;
}