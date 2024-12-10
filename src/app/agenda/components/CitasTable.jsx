import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Button } from "@nextui-org/react";
import { Edit, Trash } from "lucide-react";

function CitasTable({ citas, handleOpenModal, handleDelete }) {
  // Función para convertir la fecha de formato YYYY-MM-DD a DD-MM-YYYY
  function formatearFecha(fechaBackend) {
    let partes = fechaBackend.split("-"); // Asumiendo formato YYYY-MM-DD
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  // Función para convertir la fecha a objeto Date para compararla
  function convertirAFecha(fechaBackend) {
    let partes = fechaBackend.split("-"); // Asumiendo formato YYYY-MM-DD
    return new Date(partes[0], partes[1] - 1, partes[2]); // Mes en JavaScript es 0-indexado
  }

  // Obtener la fecha actual
  const fechaActual = new Date();

  // Dividir las citas en futuras y pasadas
  const citasFuturas = citas.filter(cita => convertirAFecha(cita.fecha_consulta) >= fechaActual);
  const citasPasadas = citas.filter(cita => convertirAFecha(cita.fecha_consulta) < fechaActual);

  // Ordenar las citas dentro de cada grupo (de la más vieja a la más nueva)
  const citasFuturasOrdenadas = citasFuturas.sort((a, b) => convertirAFecha(a.fecha_consulta) - convertirAFecha(b.fecha_consulta));
  const citasPasadasOrdenadas = citasPasadas.sort((a, b) => convertirAFecha(a.fecha_consulta) - convertirAFecha(b.fecha_consulta));

  return (
    <>
      {/* Citas futuras */}
      <Table aria-label="Tabla de citas futuras" classNames={{ wrapper: "min-h-[400px]", th: "bg-gray-50 text-gray-600 py-3", td: "py-4" }}>
        <TableHeader>
          <TableColumn>NOMBRE</TableColumn>
          <TableColumn>FECHA</TableColumn>
          <TableColumn>HORA</TableColumn>
          <TableColumn align="center">ACCIONES</TableColumn>
        </TableHeader>
        <TableBody>
          {citasFuturasOrdenadas.map((cita) => (
            <TableRow key={cita.idCita}>
              <TableCell>{cita.nombre}</TableCell>
              <TableCell>{formatearFecha(cita.fecha_consulta)}</TableCell>
              <TableCell>{cita.hora_consulta}</TableCell>
              <TableCell>
                <div className="flex justify-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    startContent={<Edit size={16} />}
                    onClick={() => handleOpenModal(cita)}
                    className="border border-[#11404E] text-[#11404E] rounded-md transition-colors duration-200 hover:bg-[#11404E] hover:text-white"
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    color="danger"
                    startContent={<Trash size={16} />}
                    onClick={() => handleDelete(cita)}
                    className="border border-red-500 text-red-500 rounded-md transition-colors duration-200 hover:bg-red-500 hover:text-white"
                  >
                    Eliminar
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Citas pasadas */}
      {citasPasadasOrdenadas.length > 0 && (
        <div>
          <h3>Citas Pasadas</h3>
          <Table aria-label="Tabla de citas pasadas" classNames={{ wrapper: "min-h-[400px]", th: "bg-gray-50 text-gray-600 py-3", td: "py-4" }}>
            <TableHeader>
              <TableColumn>NOMBRE</TableColumn>
              <TableColumn>FECHA</TableColumn>
              <TableColumn>HORA</TableColumn>
              <TableColumn align="center">ACCIONES</TableColumn>
            </TableHeader>
            <TableBody>
              {citasPasadasOrdenadas.map((cita) => (
                <TableRow key={cita.idCita}>
                  <TableCell>{cita.nombre}</TableCell>
                  <TableCell>{formatearFecha(cita.fecha_consulta)}</TableCell>
                  <TableCell>{cita.hora_consulta}</TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        startContent={<Edit size={16} />}
                        onClick={() => handleOpenModal(cita)}
                        className="border border-[#11404E] text-[#11404E] rounded-md transition-colors duration-200 hover:bg-[#11404E] hover:text-white"
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        color="danger"
                        startContent={<Trash size={16} />}
                        onClick={() => handleDelete(cita)}
                        className="border border-red-500 text-red-500 rounded-md transition-colors duration-200 hover:bg-red-500 hover:text-white"
                      >
                        Eliminar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}

export default CitasTable;
