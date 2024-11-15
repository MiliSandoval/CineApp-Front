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

async function editarpelicula(id){
    try {
            const response = await fetch(`https://localhost:7254/api/Cine/${id}`, {method: 'GET'});
            if(response.ok){
                const peli = await response.json()
                console.log(peli)
                cargar_vista('editarpelicula.html', (peli)=>{
                    console.log(peli)
                    $namemovie = document.getElementById('namemovie')
                    $durationmovie = document.getElementById('durationmovie')
                    $generos = document.getElementById('generos')
                    $yearmovie = document.getElementById('yearmovie')
                    $moviepremiere = document.getElementById('moviepremiere')
                    $clasmovie = document.getElementById('clasmovie')

                    $namemovie.value = peli.namemovie
                    $durationmovie.value  = peli.durationmovie
                    $generos.value  = peli.generos
                    $yearmovie.value  = peli.yearmovie
                    $moviepremiere.value  = peli.moviepremiere
                    $clasmovie.value  = peli.clasmovie
                })    
                
            }else{
                alert('No se pudo editar la pelicula');
            }
    } catch (error) {
        console.error("Error al registrar la baja de película:", error);
    }
}


async function eliminar_pelicula(id) {
    try {
        if (window.confirm("Seguro que desea registrar la baja de la película?")) {
            const response = await fetch(`https://localhost:7254/api/Cine/${id}`, {method: 'DELETE'});
            if(response.ok){
                consultar_peliculas()
            }else{
                alert('No se pudo eliminar la pelicula');
            }
            
        }
    } catch (error) {
        console.error("Error al registrar la baja de película:", error);
    }
}