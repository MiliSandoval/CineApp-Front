document.getElementById("ticketForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    // Obtener el número de ticket ingresado
    const ticketNumber = document.getElementById("ticketNumber").value;
    const resultContainer = document.getElementById("result");
    resultContainer.innerHTML = ""; // Limpiar contenido previo

    try {
        // Realizar la petición a la API para obtener las butacas
        const response = await fetch(`https://localhost:7254/api/Cine/butacas/disponibles?ticket=${ticketNumber}`);
        
        if (!response.ok) {
            throw new Error("No se pudieron obtener las butacas. Verifique el número de ticket.");
        }

        const butacas = await response.json();

        // Crear la tabla con clases de estilo
        const table = document.createElement("table");
        table.classList.add("styled-table");
        
        // Crear encabezado de la tabla
        const thead = document.createElement("thead");
        thead.innerHTML = `
            <tr>
                <th>ID Butaca</th>
                <th>ID Sala</th>
                <th>Número</th>
                <th>Fila</th>
                <th>Estado</th>
            </tr>
        `;
        table.appendChild(thead);

        // Crear cuerpo de la tabla y llenarlo con las butacas disponibles
        const tbody = document.createElement("tbody");
        butacas.forEach(butaca => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${butaca.id_butaca}</td>
                <td>${butaca.id_sala}</td>
                <td>${butaca.numero}</td>
                <td>${butaca.fila}</td>
                <td>${butaca.estado}</td>
            `;
            tbody.appendChild(row);
        });
        table.appendChild(tbody);

        // Mostrar la tabla de resultados en el contenedor
        resultContainer.appendChild(table);
        resultContainer.style.display = "block";

    } catch (error) {
        resultContainer.innerHTML = `<p class="error">${error.message}</p>`;
    }
});
