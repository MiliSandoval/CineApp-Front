document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    try {
        const response = await fetch('https://localhost:7254/api/Cine/usuario', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                usuario: username,    
                contraseña: password  
            })
        });
        
        if (response.ok) {
            const data = await response.json();
          
            localStorage.setItem('userData', JSON.stringify(data));
            window.location.href = 'main.html';
        } else {
            const errorData = await response.json();
            alert(errorData.message || 'Datos incorrectos');
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Datos incorrectos");
    }
});