// // Verificación de autenticación al cargar la página principal
// document.addEventListener('DOMContentLoaded', () => {
//     const token = localStorage.getItem('token');
    
//     // // Verifica si el usuario tiene un token de autenticación
//     // if (!token) {
//     //     // Si no hay token, redirige al usuario a la página de login
//     //     alert("Debes iniciar sesión para acceder a esta página.");
//     //     window.location.href = 'login.html';
//     // }
// });

// // Función de cierre de sesión
// function logout() {
//     // Elimina el token de autenticación almacenado
//     localStorage.removeItem('token');
//     // Redirige al usuario a la página de login
//     window.location.href = 'login.html';
// }

// // Agrega el evento de logout al botón de cierre de sesión (si existe en la página)
// const logoutButton = document.getElementById('logoutButton');
// if (logoutButton) {
//     logoutButton.addEventListener('click', logout);
// }

document.addEventListener('DOMContentLoaded', function() {
    // URL de la API (ajústala según la ubicación de tu backend)
    const apiUrl = 'https://localhost:7254/api/Cine/peliculas';

    // Función para obtener las películas desde la API
    async function obtenerPeliculas() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Error al obtener las películas');
            }
            const peliculas = await response.json();
            mostrarPeliculas(peliculas);
        } catch (error) {
            console.error(error);
            document.getElementById('peliculas-container').innerHTML = '<p class="text-danger">Error al cargar las películas.</p>';
        }
    }

    // Función para mostrar las películas en formato de "card" de Bootstrap
    function mostrarPeliculas(peliculas) {
        const container = document.getElementById('peliculas-container');
        container.innerHTML = ''; // Limpia el contenedor

        if (peliculas.length === 0) {
            container.innerHTML = '<p>No hay películas disponibles.</p>';
            return;
        }

        peliculas.forEach(pelicula => {
            // Crear una card de Bootstrap para cada película
            const card = document.createElement('div');
            card.className = 'col-md-4 mb-4'; // Estilo de columna de Bootstrap

            card.innerHTML = `
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${pelicula.titulo}</h5>
                        <p class="card-text"><strong>Año:</strong> ${pelicula.anio_lanzamiento}</p>
                        <p class="card-text"><strong>Duración:</strong> ${pelicula.duracion} horas</p>
                        <p class="card-text"><strong>Clasificación:</strong> ${pelicula.clasificacion}</p>
                        <p class="card-text"><strong>Fecha de estreno:</strong> ${pelicula.fecha_estreno}</p>
                    </div>
                </div>
            `;

            container.appendChild(card); // Agrega la tarjeta al contenedor
        });
    }

    // Llama a la función para obtener y mostrar las películas
    obtenerPeliculas();
});
