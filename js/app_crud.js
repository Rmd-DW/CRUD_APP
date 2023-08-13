// Arreglo para almacenar los empleados
let listaEmpleados = [];

// Objeto empleado para capturar los datos
const objEmpleado = {
    id: '',
    nombre: '',
    puesto: ''
};

// Variable para rastrear si se está editando un empleado
let editando = false;

// Intentar cargar datos del localStorage al arranque
const storedData = localStorage.getItem('empleados');
if (storedData) {
    // Dividir la cadena almacenada y crear objetos de empleado
    listaEmpleados = storedData.split(';').map(item => {
        const [id, nombre, puesto] = item.split(',');
        return { id, nombre, puesto };
    });
}

// Obtener referencias a elementos HTML
const formulario = document.querySelector('#formulario');
const nombreInput = document.querySelector('#nombre');
const puestoInput = document.querySelector('#puesto');
const btnAgregarInput = document.querySelector('#btnAgregar');

// Escuchar el evento submit del formulario
formulario.addEventListener('submit', validarFormulario);

function validarFormulario(e) {
    e.preventDefault();

    // Verificar si los campos están llenos
    if (nombreInput.value === '' || puestoInput.value === '') {
        alert('Todos los campos se deben llenar');
        return;
    }

    if (editando) {
        editarEmpleado();
        editando = false;
    } else {
        objEmpleado.id = Date.now();
        objEmpleado.nombre = nombreInput.value;
        objEmpleado.puesto = puestoInput.value;

        agregarEmpleado();
    }
}

function agregarEmpleado() {
    // Agregar el objeto empleado al arreglo y actualizar el almacenamiento
    listaEmpleados.push({...objEmpleado});
    actualizarLocalStorage();
    mostrarEmpleados();
    formulario.reset();
    limpiarObjeto();
}

function limpiarObjeto() {
    objEmpleado.id = '';
    objEmpleado.nombre = '';
    objEmpleado.puesto = '';
}

function mostrarEmpleados() {
    limpiarHTML();

    const divEmpleados = document.querySelector('.div-empleados');
    
    listaEmpleados.forEach(empleado => {
        const {id, nombre, puesto} = empleado;

        const parrafo = document.createElement('p');
        parrafo.textContent = `| ${nombre} | ${puesto} | `;
        parrafo.dataset.id = id;

        const editarBoton = document.createElement('button');
        editarBoton.onclick = () => cargarEmpleado(empleado);
        editarBoton.textContent = 'Editar';
        editarBoton.classList.add('btn', 'btn-editar');
        parrafo.append(editarBoton);

        const eliminarBoton = document.createElement('button');
        eliminarBoton.onclick = () => eliminarEmpleado(id);
        eliminarBoton.textContent = 'Eliminar';
        eliminarBoton.classList.add('btn', 'btn-eliminar');
        parrafo.append(eliminarBoton);

        const hr = document.createElement('hr');

        divEmpleados.appendChild(parrafo);
        divEmpleados.appendChild(hr);
    });
}

function cargarEmpleado(empleado) {
    const {id, nombre, puesto} = empleado;

    nombreInput.value = nombre;
    puestoInput.value = puesto;

    objEmpleado.id = id;

    formulario.querySelector('button[type="submit"]').textContent = 'Actualizar';
    
    editando = true;
}

function editarEmpleado() {
    objEmpleado.nombre = nombreInput.value;
    objEmpleado.puesto = puestoInput.value;

    listaEmpleados.forEach(empleado => {
        if(empleado.id === objEmpleado.id) {
            empleado.id = objEmpleado.id;
            empleado.nombre = objEmpleado.nombre;
            empleado.puesto = objEmpleado.puesto;
        }
    });

    actualizarLocalStorage();
    limpiarHTML();
    mostrarEmpleados();
    formulario.reset();
    formulario.querySelector('button[type="submit"]').textContent = 'Agregar';
    editando = false;
}

function eliminarEmpleado(id) {
    listaEmpleados = listaEmpleados.filter(empleado => empleado.id !== id);
    actualizarLocalStorage();
    limpiarHTML();
    mostrarEmpleados();
}

function limpiarHTML() {
    const divEmpleados = document.querySelector('.div-empleados');
    while(divEmpleados.firstChild) {
        divEmpleados.removeChild(divEmpleados.firstChild);
    }
}

function actualizarLocalStorage() {
    // Crear una cadena formateada y almacenar en localStorage
    const serializedData = listaEmpleados.map(empleado => `${empleado.id},${empleado.nombre},${empleado.puesto}`).join(';');
    localStorage.setItem('empleados', serializedData);
}
