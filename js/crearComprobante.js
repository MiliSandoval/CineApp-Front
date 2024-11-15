const form = document.getElementById('consulta-form');
const inputPelicula = document.getElementById('movie-select');
const inputFuncion = document.getElementById('function-select');
const inputCliente = document.getElementById('cliente-select');
const inputFP = document.getElementById('forma-pago-select');
const inputFV = document.getElementById('forma-venta-select');
const inputSucursal = document.getElementById('sucursal-select');
const inputDescuento = document.getElementById('descuento');
const inputPrecio = document.getElementById('total-price');
let selectedSeats = []; // Para almacenar las butacas seleccionadas

async function crearcomp(event) {
    event.preventDefault();
    console.log('Formulario enviado'); 

    // Obtener valores de los campos
    const pelicula = inputPelicula.value;
    const funcion = inputFuncion.value;
    const cliente = inputCliente.value;
    const fp = inputFP.value;
    const fv = inputFV.value;
    const sucursal = inputSucursal.value;
    const descuento = inputDescuento.value || 0;
    const precio = inputPrecio.textContent.replace('$', '').trim();
    const butacas = selectedSeats.join(','); // Unir las butacas seleccionadas en un string

    if (!funcion || !butacas || !cliente || !fp || !fv || !sucursal) {
        alert('Por favor, complete todos los campos obligatorios.');
        return;
    }

    const comprobante = {
        id_det_comprobante: 0,
        id_comprobante: 0,
        id_funcion: funcion,
        descuento: descuento,
        cantidad: selectedSeats.length,
        precio: precio,
        id_butaca: butacas, // Enviar las butacas seleccionadas
        id_comprobanteNavigation: {
            id_comprobante: 0,
            fecha: new Date().toISOString(),
            id_cliente: cliente,
            id_forma_pago: fp,
            id_forma_venta: fv,
            id_sucursal: sucursal,
            estado: "En Curso"
        }
    };

    // Enviar el comprobante al backend
    try {
        const response = await fetch('https://localhost:7254/api/Cine/crear', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(comprobante)
        });

        if (response.ok) {
            alert('Comprobante creado con éxito');
            form.reset();
            selectedSeats = []; // Reiniciar las butacas seleccionadas
            document.getElementById('seat-map').innerHTML = ''; // Limpiar mapa de asientos
        } else {
            alert('Error al crear el comprobante. Por favor, revise los datos.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Ocurrió un error al intentar crear el comprobante.');
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Obtener películas
    fetch("https://localhost:7254/api/Cine/pelis")
        .then(response => response.json())
        .then(data => {
            const movieSelect = document.getElementById("movie-select");
            data.forEach(movie => {
                const option = document.createElement("option");
                option.value = movie.id_pelicula;
                option.textContent = movie.titulo;
                movieSelect.appendChild(option);
            });
        });

    // Obtener datos para cliente, forma de pago, forma de venta, sucursal
    fetch("https://localhost:7254/api/clientes")
        .then(response => response.json())
        .then(data => {
            const clienteSelect = document.getElementById("cliente-select");
            data.forEach(cliente => {
                const option = document.createElement("option");
                option.value = cliente.id_cliente;
                option.textContent = `${cliente.nombre_cliente} ${cliente.apellido_cliente}`;
                clienteSelect.appendChild(option);
            });
        });

    fetch("https://localhost:7254/api/Cine/fp")
        .then(response => response.json())
        .then(data => {
            const formaPagoSelect = document.getElementById("forma-pago-select");
            data.forEach(formaPago => {
                const option = document.createElement("option");
                option.value = formaPago.id_forma_pago;
                option.textContent = formaPago.descripcion;
                formaPagoSelect.appendChild(option);
            });
        });

    fetch("https://localhost:7254/api/fv")
        .then(response => response.json())
        .then(data => {
            const formaVentaSelect = document.getElementById("forma-venta-select");
            data.forEach(formaVenta => {
                const option = document.createElement("option");
                option.value = formaVenta.id_forma_venta;
                option.textContent = formaVenta.descripcion;
                formaVentaSelect.appendChild(option);
            });
        });

    fetch("https://localhost:7254/api/sucurs")
        .then(response => response.json())
        .then(data => {
            const sucursalSelect = document.getElementById("sucursal-select");
            data.forEach(sucursal => {
                const option = document.createElement("option");
                option.value = sucursal.id_sucursal;
                option.textContent = sucursal.nombre_sucursal;
                sucursalSelect.appendChild(option);
            });
        });
});

function fetchFunctions() {
    const selectedMovieId = document.getElementById("movie-select").value;
    if (!selectedMovieId) return;

    fetch(`https://localhost:7254/api/Cine/funciones?idPeli=${selectedMovieId}`)
        .then(response => response.json())
        .then(data => {
            const functionSelect = document.getElementById("function-select");
            functionSelect.innerHTML = '<option value="">Seleccione una función...</option>';
            data.forEach(funcion => {
                const option = document.createElement("option");
                option.value = funcion.id_funcion;
                option.textContent = `${funcion.dia} - ${funcion.horario}`;
                functionSelect.appendChild(option);
            });
        });
}

async function fetchAvailableSeats() {
    const selectedFunctionId = document.getElementById("function-select").value;
    if (!selectedFunctionId) return;

    try {
        const response = await fetch(`https://localhost:7254/api/Cine/butacas/disponibles?ticket=${selectedFunctionId}`);
        const data = await response.json();
        const seatMap = document.getElementById("seat-map");
        seatMap.innerHTML = ""; // Limpiar el mapa de asientos

        data.forEach(seat => {
            const seatButton = document.createElement("button");
            seatButton.value = seat.id_butaca;
            seatButton.textContent = `Fila ${seat.fila}, Butaca ${seat.numero}`;
            seatButton.classList.add("seat");
            seatButton.onclick = () => toggleSeatSelection(seat.id_butaca);
            seatMap.appendChild(seatButton);
        });
    } catch (error) {
        console.error('Error al obtener butacas:', error);
    }
}

function toggleSeatSelection(seatId) {
    const index = selectedSeats.indexOf(seatId);
    if (index > -1) {
        selectedSeats.splice(index, 1);
    } else {
        selectedSeats.push(seatId);
    }
    updateTotalPrice();
}

function updateTotalPrice() {
    const pricePerSeat = 155; // Precio fijo por butaca
    const totalPrice = pricePerSeat * selectedSeats.length;
    inputPrecio.textContent = `$${totalPrice.toFixed(2)}`;
}
