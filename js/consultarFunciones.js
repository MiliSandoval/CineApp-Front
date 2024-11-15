const API_URL = 'https://localhost:7254';

async function fetchGeneros() {
    try {
        const response = await fetch(`${API_URL}/api/Generos`,{ method: 'GET' });
        const generos = await response.json();
        const generoSelect = document.getElementById('generoSelect');
        generos.forEach(genero => {
            const option = document.createElement('option');
            option.value = genero.id_genero;
            option.textContent = genero.descripcion;
            generoSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar los generos:', error);
    }
}

async function fetchBarrios() {
    try {
        const response = await fetch(`${API_URL}/api/Cine/barrios`,{ method: 'GET' });
        const barrios = await response.json();
        const barrioSelect = document.getElementById('barrioSelect');
        barrios.forEach(barrio => {
            const option = document.createElement('option');
            option.value = barrio.id_barrio;
            option.textContent = barrio.nombre_barrio;
            barrioSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar los barrios:', error);
    }
}

async function fetchSucursales() {
    const barrioId = document.getElementById('barrioSelect').value;
    if (!barrioId) return;

    try {
        const response = await fetch(`${API_URL}/api/Cine/sucursales?barrio=${barrioId}`,{ method: 'GET' });
        const sucursales = await response.json();
        const sucursalSelect = document.getElementById('sucursalSelect');
        sucursalSelect.innerHTML = '<option value="">Seleccione una sucursal</option>';

        sucursales.forEach(sucursal => {
            const option = document.createElement('option');
            option.value = sucursal.id_sucursal;
            option.textContent = sucursal.nombre_sucursal;
            sucursalSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar las sucursales:', error);
    }
}

async function fetchPeliculas() {
    const generoId = document.getElementById('generoSelect').value;
    if (!generoId) return;

    try {
        const response = await fetch(`${API_URL}/api/Cine/pelisss?genero=${generoId}`,{ method: 'GET' });
        const peliculas = await response.json();
        const peliculaSelect = document.getElementById('peliculaSelect');
        peliculaSelect.innerHTML ='<option value="">Seleccione una pelicula</option>';
        peliculas.forEach(pelicula => {
            const option = document.createElement('option');
            option.value = pelicula.id_pelicula;
            option.textContent = pelicula.titulo;
            peliculaSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar las películas:', error);
    }
}

async function fetchSalas() {
    const sucursalId = document.getElementById('sucursalSelect').value;
    if (!sucursalId) return;

    try {
        const response = await fetch(`${API_URL}/api/Cine/Salas?sucursal=${sucursalId}`,{ method: 'GET' });
        const salas = await response.json();
        const roomSelect = document.getElementById('salaSelect');
        roomSelect.innerHTML = '<option value="">Seleccione una sala</option>';

        salas.forEach(sala => {
            const option = document.createElement('option');
            option.value = sala.id_sala;
            option.textContent = sala.nombre;
            roomSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar las salas:', error);
    }
}

async function fetchFunciones(peliculaId, salaId, idioma, tipoFuncion) {
    try {
       
        console.log(`Consultando funciones con: peliculaId=${peliculaId}, salaId=${salaId}, idioma=${idioma}, tipoFuncion=${tipoFuncion}`);

       
        const url = `${API_URL}/api/Cine/funciones2?peliculaId=${peliculaId}&salaId=${salaId}&idioma=${encodeURIComponent(idioma)}&tipoFuncion=${encodeURIComponent(tipoFuncion)}`;

    
        const response = await fetch(url, { method: 'GET' });

        
        if (response.ok) {
            const funciones = await response.json();
            console.log("Funciones obtenidas:", funciones);  

           
            if (funciones.length > 0) {
                displayFunciones(funciones); 
            } else {
                console.log('No se encontraron funciones.');
            }
        } else {
            console.error('Error al obtener las funciones', response.status);
        }
    } catch (error) {
        console.error('Error al consultar las funciones:', error);
    }
}


function displayFunciones(funciones) {
    
    const $tbody = document.getElementById('funciones-body');
    console.log('Funciones recibidas', funciones)
    let tbody = '';
    funciones.forEach(funcion => {
        tbody += `
        <tr>
            <td>${funcion.id_pelicula}</td>
            <td>${funcion.id_sala}</td>
            <td>${funcion.dia}</td>
            <td>${funcion.horario}</td>
            <td>${funcion.idioma}</td>
            <td>${funcion.tipo_funcion}</td>
        </tr>
        `;
        
    });
    $tbody.innerHTML = tbody;
}

function consultarFunciones(event) {
    event.preventDefault();

    const peliculaId = document.getElementById('peliculaSelect').value;
    const salaId = document.getElementById('salaSelect').value;
    const idioma = document.getElementById('idioma').value;
    const tipoFuncion = document.getElementById('functionType').value;

    fetchFunciones(peliculaId, salaId, idioma, tipoFuncion);
}


fetchBarrios();
fetchGeneros();
