async function cargar_generos() {
    try {
        const response = await fetch('https://localhost:7254/api/Generos');
        const generos = await response.json();
        const $generos = document.getElementById('generos');
        

        $generos.innerHTML = '';
        

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
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
        const $generos = document.getElementById('generos');
        $generos.innerHTML = '<option>Error al cargar géneros</option>';
    }
}

async function consultar_peliculas() {
    try {
        const $generos = document.getElementById("generos");
        let seleccionado = $generos.value;
        
        if (seleccionado) {
            const response = await fetch(`https://localhost:7254/api/Cine/genero?genero=${seleccionado}`);
            const peliculas = await response.json();
            const $tbody = document.getElementById('tbody');
            
            console.log('Películas recibidas:', peliculas); 
            
            let tbody = '';
            peliculas.forEach(pelicula => {
                tbody += `
                    <tr>
                        <td>${pelicula.id_pelicula}</td>
                        <td>${pelicula.titulo}</td>
                        <td>${pelicula.duracion}</td>
                        <td>${pelicula.anio_lanzamiento}</td>
                        <td>${formatearFecha(pelicula.fecha_estreno)}</td>
                        <td>${pelicula.clasificacion}</td>
                        <td>
                            <button onClick='editar_pelicula(${pelicula.id_pelicula})' class="btn btn-primary">Editar</button>
                            <button onClick='eliminar_pelicula(${pelicula.id_pelicula})' class="btn btn-danger">Eliminar</button>
                        </td>
                    </tr>
                `;
            });
            $tbody.innerHTML = tbody;
        }
    } catch (error) {
        console.error("Error al consultar películas:", error);
        const $tbody = document.getElementById('tbody');
        $tbody.innerHTML = '<tr><td colspan="8">Error al cargar las películas</td></tr>';
    }
}


function formatearFecha(fecha) {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString();
}


document.addEventListener('DOMContentLoaded', cargar_generos);


async function editar_pelicula(id) {
    try {
        const response = await fetch(`https://localhost:7254/api/Cine/${id}`);
        if (response.ok) {
            const pelicula = await response.json();

            window.location.href = `editarpelicula.html?id=${id}`;
        } else {
            alert('No se pudo obtener la información de la película');
        }
    } catch (error) {
        console.error("Error al obtener datos de la película:", error);
        alert('Error al cargar la información de la película');
    }
}


async function cargarDatosPelicula() {

    if (window.location.pathname.includes('editarpelicula.html')) {

        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        
        if (id) {
            try {
                const response = await fetch(`https://localhost:7254/api/Cine/${id}`);
                if (response.ok) {
                    const pelicula = await response.json();
                    
                    // Cargar los datos en el formulario
                    document.getElementById('namemovie').value = pelicula.titulo;
                    document.getElementById('durationmovie').value = pelicula.duracion;
                    document.getElementById('yearmovie').value = pelicula.anio_lanzamiento;
                    document.getElementById('moviepremiere').value = formatearFechaInput(pelicula.fecha_estreno);
                    document.getElementById('clasmovie').value = pelicula.clasificacion;
                    

                    await cargar_generos();
                    document.getElementById('generos').value = pelicula.id_genero;
                }
            } catch (error) {
                console.error("Error al cargar datos de la película:", error);
                alert('Error al cargar la información de la película');
            }
        }
    }
}


async function guardarCambiosPelicula() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    if (!id) {
        alert('ID de película no encontrado');
        return;
    }


    const duracion = parseInt(document.getElementById('durationmovie').value);
    const anioLanzamiento = parseInt(document.getElementById('yearmovie').value);
    const idGenero = parseInt(document.getElementById('generos').value);

    const peliculaActualizada = {
        id_pelicula: parseInt(id),
        titulo: document.getElementById('namemovie').value,
        duracion: duracion,
        id_genero: idGenero,
        anio_lanzamiento: anioLanzamiento,
        fecha_estreno: document.getElementById('moviepremiere').value,
        clasificacion: document.getElementById('clasmovie').value
    };

    try {
        const response = await fetch(`https://localhost:7254/api/Cine/update/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(peliculaActualizada)
        });


        console.log('Datos enviados:', peliculaActualizada);
        console.log('Respuesta status:', response.status);

        if (response.ok) {
            alert('Película actualizada correctamente');
            window.location.href = 'consultarPeliculas.html';
        } else {
            const errorData = await response.text();
            console.error('Error response:', errorData);
            alert('Error al actualizar la película: ' + errorData);
        }
    } catch (error) {
        console.error("Error al actualizar la película:", error);
        alert('Error al guardar los cambios: ' + error.message);
    }
}


function formatearFechaInput(fecha) {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toISOString().split('T')[0];
}

async function eliminar_pelicula(id) {
    try {
        if (confirm("¿Está seguro que desea eliminar esta película?")) {
            const response = await fetch(`https://localhost:7254/api/Cine/eliminar/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            
            console.log('Delete response status:', response.status);

            if (response.ok) {
                alert('Película eliminada correctamente');
                await consultar_peliculas();
            } else {
                const errorData = await response.text();
                console.error('Error response:', errorData);
                alert('No se pudo eliminar la película: ' + errorData);
            }
        }
    } catch (error) {
        console.error("Error al eliminar la película:", error);
        alert('Error al eliminar la película: ' + error.message);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('editarpelicula.html')) {
        cargarDatosPelicula();
    } else {
        cargar_generos();
    }
});