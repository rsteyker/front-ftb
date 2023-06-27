import { useEffect, useState } from "react";
import axios from "axios";
import { Table, Form, Button } from 'react-bootstrap';

function App() {
  const [movimientos, setMovimientos] = useState([]);
  const [archivo, setArchivo] = useState(null);

  useEffect(() => {
    cargarMovimientos();
  }, [])

  const cargarMovimientos = async () => {
    try {
      const response = await axios.get('http://localhost:8000/movimientos');
      setMovimientos(response.data);
    } catch (error) {
      console.log('Error al obtener los movimientos bancarios:', error);
    }
  };

  const importarMovimientos = async () => {
    try {
      const formData = new FormData();
      formData.append('archivo', archivo);

      await axios.post('http://localhost:8000/importar', formData);

      alert('Archivo importado exitosamente');
      cargarMovimientos();
    } catch (error) {
      console.log('Error al importar el archivo:', error);
    }
  };

  const editarMovimiento = async (id, descripcion) => {
    try {
      const nuevaDescripcion = prompt('Ingrese la nueva descripción', descripcion);
      if (nuevaDescripcion) {
        await axios.put(`http://localhost:8000/movimientos/${id}`, { descripcion: nuevaDescripcion });
        alert('Movimiento bancario actualizado exitosamente');
        cargarMovimientos();
      }
    } catch (error) {
      console.log('Error al actualizar el movimiento bancario:', error);
    }
  };

  const eliminarMovimiento = async (id) => {
    if (window.confirm('¿Está seguro de eliminar el movimiento bancario?')) {
      try {
        await axios.delete(`http://localhost:8000/movimientos/${id}`);
        alert('Movimiento bancario eliminado exitosamente');
        cargarMovimientos();
      } catch (error) {
        console.log('Error al eliminar el movimiento bancario:', error);
      }
    }
  };



  return (
    <div className="container">
      <h1>Importar Movimientos Bancarios</h1>
      <Form>
        <Form.Group controlId="formArchivo">
          <Form.Label>Archivo CSV</Form.Label>
          <Form.Control name="archivo" type="file" onChange={(e) => setArchivo(e.target.files[0])} />
        </Form.Group>
        <Button className="mt-3 mb-5" variant="primary" onClick={importarMovimientos}>
          Importar
        </Button>
      </Form>

      <h1>Movimientos Bancarios</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Descripción</th>
            <th>Moneda</th>
            <th>Monto</th>
            <th>Código Único</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {movimientos.map((movimiento) => (
            <tr key={movimiento.id}>
              <td>{movimiento.fecha}</td>
              <td>{movimiento.descripcion}</td>
              <td>{movimiento.moneda}</td>
              <td>{movimiento.monto}</td>
              <td>{movimiento.codigo_unico}</td>
              <td>
                <Button variant="info" onClick={() => editarMovimiento(movimiento.id, movimiento.descripcion)}>
                  Editar
                </Button>{' '}
                <Button variant="danger" onClick={() => eliminarMovimiento(movimiento.id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default App;
