document.getElementById("actorForm").addEventListener("submit", async function (event) {
    event.preventDefault(); 

    const movieID = document.getElementById("movieID").value;
    const resultDiv = document.getElementById("result");

    try {
        const response = await fetch(`https://localhost:7254/api/Cine/peliculas/actores?pelicula=${movieID}`);
        if (!response.ok) throw new Error("Error al consultar los actores de la película.");

        const data = await response.json();
        
        resultDiv.innerHTML = "";

        const table = document.createElement("table");
        table.className = "actor-table";
        table.innerHTML = `
            <thead>
                <tr>
                    <th>ID Película Actor</th>
                    <th>ID Actor</th>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Fecha de Nacimiento</th>
                    <th>Nacionalidad</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        `;

        const tbody = table.querySelector("tbody");
        data.forEach(actor => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${actor.id_peliculas_actores}</td>
                <td>${actor.id_actor}</td>
                <td>${actor.id_actorNavigation.nombre}</td>
                <td>${actor.id_actorNavigation.apellido}</td>
                <td>${actor.id_actorNavigation.fecha_nac}</td>
                <td>${actor.id_actorNavigation.nacionalidad}</td>
            `;
            tbody.appendChild(row);
        });

        resultDiv.appendChild(table);
        resultDiv.style.display = "block";

    } catch (error) {
        resultDiv.innerHTML = `<p class="error">Ocurrió un error: ${error.message}</p>`;
    }
});
