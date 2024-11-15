document.getElementById("ticketForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const ticketNumber = document.getElementById("ticketNumber").value;
    const resultContainer = document.getElementById("result");
    resultContainer.innerHTML = ""; 

    try {
        const response = await fetch(`https://localhost:7254/api/Cine/butacas/disponibles?ticket=${ticketNumber}`);
        
        if (!response.ok) {
            throw new Error("No se pudieron obtener las butacas. Verifique el número de ticket.");
        }

        const butacas = await response.json();

        const table = document.createElement("table");
        table.classList.add("styled-table");
        
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

        resultContainer.appendChild(table);
        resultContainer.style.display = "block";

    } catch (error) {
        resultContainer.innerHTML = `<p class="error">${error.message}</p>`;
    }
});
