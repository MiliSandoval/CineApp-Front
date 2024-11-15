document.getElementById("reservationForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const movieId = document.getElementById("movieId").value;
    const ticketNumber = document.getElementById("ticketNumber").value;

    const reservationData = {
        movieId: movieId,
        ticketNumber: ticketNumber
    };

    fetch("https://localhost:7254/api/Cine/butaca/reservada", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(reservationData)
    })
    .then(response => response.json())
    .then(data => {
        const resultDiv = document.getElementById("result");
        resultDiv.style.display = "block";
        if (data.success) {
            resultDiv.innerHTML = `<p style="color: green;">¡Butaca reservada exitosamente!</p>`;
        } else {
            resultDiv.innerHTML = `<p style="color: red;">No se pudo reservar la butaca. ${data.message || ''}</p>`;
        }
    })
    .catch(error => {
        console.error("Error al reservar la butaca:", error);
        const resultDiv = document.getElementById("result");
        resultDiv.style.display = "block";
        resultDiv.innerHTML = `<p style="color: red;">Ocurrió un error al intentar reservar la butaca.</p>`;
    });
});
