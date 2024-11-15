document.getElementById("promotionForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    const branchID = document.getElementById("branchID").value;
    const resultDiv = document.getElementById("result");

    try {
        const response = await fetch(`https://localhost:7254/api/Cine/promociones/sucursales?sucursal=${branchID}`);
        const promociones = await response.json();

        let table = `
            <table class="table">
                <thead>
                    <tr>
                        <th>ID Promoción</th>
                        <th>Nombre Promoción</th>
                        <th>Día</th>
                        <th>Horario de Inicio</th>
                        <th>Horario de Finalización</th>
                        <th>Descuento</th>
                    </tr>
                </thead>
                <tbody>
                    ${promociones.map(promocion => `
                        <tr>
                            <td>${promocion.id_promocion}</td>
                            <td>${promocion.id_promocionNavigation.nombre}</td>
                            <td>${promocion.id_promocionNavigation.dia}</td>
                            <td>${promocion.id_promocionNavigation.horario_inicio}</td>
                            <td>${promocion.id_promocionNavigation.horario_finalizacion}</td>
                            <td>${promocion.id_promocionNavigation.descuento}%</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        resultDiv.innerHTML = table;
        resultDiv.style.display = "block"; 
    } catch (error) {
        console.error("Error al obtener las promociones:", error);
        resultDiv.innerHTML = "<p class='error'>No se pudieron cargar las promociones.</p>";
    }
});
