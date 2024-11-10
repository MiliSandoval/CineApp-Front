// Agregamos un listener al formulario para manejar el envío
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Previene el envío normal del formulario
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Verifica que los valores no estén vacíos
    if (!username || !password) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    try {
        // Realiza la solicitud a la API para autenticar al usuario
        const response = await fetch('Https://localhost:7237/api/index', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        // Comprueba si la respuesta es correcta
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);  // Almacena el token de autenticación
            console.log("Token guardado:", data.token); // Para verificar en la consola
            window.location.href = 'main.html'; // Redirige a la página principal
        } else {
            const errorData = await response.json();
            alert(errorData.message || 'Credenciales incorrectas'); // Muestra el error desde la API
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Ocurrió un error al conectarse con el servidor. Intenta nuevamente.");
    }
});