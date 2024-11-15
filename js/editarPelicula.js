
async function cargarGeneros() {
    const $generos = document.getElementById('generos');
    const url = 'https://localhost:7254/api/Generos';
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const generos = await response.json();
        

        $generos.innerHTML = '';


        const defaultOption = document.createElement('option');
        defaultOption.value = '0';
        defaultOption.textContent = 'Seleccione un género';
        $generos.appendChild(defaultOption);


        generos.forEach(genero => {
            const $option = document.createElement('option');
            $option.value = genero.id_genero;
            $option.textContent = genero.descripcion;
            $generos.appendChild($option);
        });

    } catch (error) {
        console.error("Error al cargar los géneros:", error);
        $generos.innerHTML = '<option value="">Error al cargar géneros</option>';
        alert('Error al cargar los géneros. Por favor, recargue la página.');
    }
}


async function crearPelicula(event) {

    event.preventDefault();
    
    try {

        const duracion = parseInt(document.getElementById('durationmovie').value.trim());
        const anio = parseInt(document.getElementById('yearmovie').value.trim());
        const idGenero = parseInt(document.getElementById('generos').value);

        // Crear el objeto película
        const pelicula = {
            titulo: document.getElementById('namemovie').value.trim(),
            duracion: duracion,
            id_genero: idGenero,
            anio_lanzamiento: anio,
            fecha_estreno: document.getElementById('moviepremiere').value,
            clasificacion: document.getElementById('clasmovie').value.trim()
        };


        if (!pelicula.titulo) {
            alert("El título es obligatorio");
            return;
        }
        if (duracion <= 30) {
            alert("La duración debe ser mayor a 30 minutos");
            return;
        }
        if (anio <= 0) {
            alert("El año debe ser válido");
            return;
        }
        if (idGenero <= 0) {
            alert("Debe seleccionar un género");
            return;
        }


        const response = await fetch('https://localhost:7254/api/Cine/crear/pelicula', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pelicula)
        });

        const responseText = await response.text();
        
        if (response.ok) {
            alert("Película creada exitosamente");

            document.getElementById('movieForm').reset();
            window.location.href = 'main.html';
        } else {
            try {
                const errorData = JSON.parse(responseText);
                alert(errorData.message || 'Error al crear la película');
            } catch {
                alert(responseText || 'Error al crear la película');
            }
        }
    } catch (error) {
        console.error("Error al crear la película:", error);
        alert("Error al conectar con el servidor. Por favor, intente nuevamente.");
    }
}


document.addEventListener('DOMContentLoaded', () => {

    cargarGeneros();
    

    const form = document.getElementById('movieForm');
    if (form) {
        form.addEventListener('submit', crearPelicula);
    }
});