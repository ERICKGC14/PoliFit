// /app/nuevopaciente/layout.jsx
import SubMenu from './components/SubMenu';
import {PacienteRegistroProvider} from "../nuevopaciente/context/PacienteRegistroContext"

export default function NuevoPacienteLayout({ children }) {
  return (
    <PacienteRegistroProvider>
    <div>
      <SubMenu />
      <div className="p-4">
      
        {children} {/* Renderiza el contenido de la subpágina seleccionada */}        
      </div>
    </div>
    </PacienteRegistroProvider>
  );
}