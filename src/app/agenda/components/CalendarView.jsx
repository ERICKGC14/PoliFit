import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";

function CalendarView({ events, handleEventClick, handleDateClick }) {
  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      locale={esLocale}
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      }}
      buttonText={{
        today: "Hoy",
        month: "Mes",
        week: "Semana",
        day: "Día",
      }}
      height="700px"
      events={events}
      eventClick={handleEventClick}
      dateClick={handleDateClick}
      editable
      selectable
      dayMaxEvents={3}
    />
  );
}

export default CalendarView;
