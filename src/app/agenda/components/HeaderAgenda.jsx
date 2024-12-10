import { Button } from "@nextui-org/react";
import { Calendar, List } from "lucide-react";

function HeaderAgenda({ viewType, setViewType, handleOpenModal }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Mis Citas</h1>
      <div className="flex gap-2">
        <Button
          startContent={viewType === "calendar" ? <List size={20} /> : <Calendar size={20} />}
          variant="light"
          className="font-medium"
          onClick={() => setViewType(viewType === "calendar" ? "list" : "calendar")}
        >
          Vista {viewType === "calendar" ? "Lista" : "Calendario"}
        </Button>
        <Button
          color="primary"
          className="bg-[#11404E] font-medium"
          startContent={<Calendar size={20} />}
          onClick={() => handleOpenModal()}
        >
          Nueva Cita
        </Button>
      </div>
    </div>
  );
}

export default HeaderAgenda;
