import { useState, useEffect, useContext } from "react";
import { Table, Pagination, Button } from "react-bootstrap";
import { UserContext } from "../../../../context/UserContext";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/es";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("America/Bogota");

function UserReservationsList() {
  const { user } = useContext(UserContext);
  const [reservations, setReservations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [reservationsPerPage] = useState(10);

  useEffect(() => {
    getReservations();
  }, []);

  const getReservations = async () => {
    try {
      const response = await fetch(
        `par-kudserver-production.up.railway.app/user/reservations/${user.identityCard}`
      );
      const data = await response.json();
      setReservations(data.reservations);
    } catch (error) {
      console.error(error);
    }
  };

  const indexOfLastReservation = currentPage * reservationsPerPage;
  const indexOfFirstReservation = indexOfLastReservation - reservationsPerPage;
  const currentReservations = reservations.slice(
    indexOfFirstReservation,
    indexOfLastReservation
  );

  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const cancelReservation = async (reservationId) => {
    try {
      const response = await fetch(
        `par-kudserver-production.up.railway.app/reservations/updateStatus/${reservationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "Cancelada",
            startTime: null,
            endTime: null,
          }),
        }
      );
      const data = await response.json();
      alert("Reserva cancelada:", data.reservationId);
      getReservations();
    } catch (error) {
      console.error(error);
    }
  };

  const formatDateTime = (dateTime) => {
    if (dateTime === null) {
      return "";
    }
    return dayjs(dateTime).format("YYYY-MM-DD HH:mm");
  };

  return (
    <>
      <Table striped bordered>
        <thead>
          <tr>
            <th>Cancelar</th>
            <th>ID</th>
            <th>Estado</th>
            <th>Hora inicio</th>
            <th>Hora fin</th>
          </tr>
        </thead>
        <tbody>
          {currentReservations.map((reservation) => (
            <tr key={reservation.reservationId}>
              <td>
                {reservation.status === "Pendiente" && (
                  <Button
                    variant="danger"
                    onClick={() => cancelReservation(reservation.reservationId)}
                  >
                    Cancelar
                  </Button>
                )}
              </td>
              <td>{reservation.reservationId}</td>
              <td>{reservation.status}</td>
              <td>{formatDateTime(reservation.startTime)}</td>
              <td>{formatDateTime(reservation.endTime)}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination>
        {Array.from({
          length: Math.ceil(reservations.length / reservationsPerPage),
        }).map((_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage}
            onClick={() => paginate(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </>
  );
}

export default UserReservationsList;
