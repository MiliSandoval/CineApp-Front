document.addEventListener('DOMContentLoaded', function () {
    const branchForm = document.getElementById('branchForm');
    branchForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        
        // Obtener el barrio seleccionado
        const functionType = document.getElementById('functionType').value;
        if (!functionType) {
            alert("Seleccione un barrio.");
            return;
        }

        try {
            // Realizar la solicitud a la API
            const response = await fetch(`https://localhost:7254/api/Cine/sucursales?barrio=${functionType}`);
            if (!response.ok) {
                throw new Error("Error al consultar sucursales");
            }
            
            // Obtener y procesar los datos de las sucursales
            const sucursales = await response.json();
            const resultDiv = document.getElementById('result');
            
            // Generar el contenido de la tabla
            if (sucursales.length > 0) {
                let tableHTML = `
                    <table class="table">
                        <thead>
                            <tr>
                                <th>ID Sucursal</th>
                                <th>Nombre Sucursal</th>
                                <th>Dirección</th>
                                <th>ID Barrio</th>
                                <th>Teléfono</th>
                            </tr>
                        </thead>
                        <tbody>
                `;

                sucursales.forEach(sucursal => {
                    tableHTML += `
                        <tr>
                            <td>${sucursal.id_sucursal}</td>
                            <td>${sucursal.nombre_sucursal}</td>
                            <td>${sucursal.direccion}</td>
                            <td>${sucursal.id_barrio}</td>
                            <td>${sucursal.telefono}</td>
                        </tr>
                    `;
                });

                tableHTML += `
                        </tbody>
                    </table>
                `;

                // Mostrar la tabla en el contenedor de resultados
                resultDiv.innerHTML = tableHTML;
                resultDiv.style.display = 'block';
            } else {
                resultDiv.innerHTML = '<p>No se encontraron sucursales cercanas para el barrio seleccionado.</p>';
                resultDiv.style.display = 'block';
            }
        } catch (error) {
            console.error("Error al cargar sucursales:", error);
            resultDiv.innerHTML = '<p class="error">Error al cargar las sucursales</p>';
            resultDiv.style.display = 'block';
        }
    });
});
