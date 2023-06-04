import { Form, Row, Col, Button, Alert } from "react-bootstrap";
import { useState, useEffect } from "react";

function ReservationsUsers() {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [parkings, setParkings] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [reservations, setReservations] = useState([]);
  const [selectedParking, setSelectedParking] = useState("");
  const [parkingData, setParkingData] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [notification, setNotification] = useState("");
  const [notificationType, setNotificationType] = useState("primary");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const statusOptions = ["Confirmada", "Cancelada"];

  useEffect(() => {
    getCities();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedParking && selectedCity) {
      try {
        const currentTime = new Date(); // Obtener la fecha y hora actual

        // Convertir la hora de llegada y la hora de salida en un objeto Date con la fecha actual
        const startTimeDate = new Date(currentTime);
        startTimeDate.setHours(parseInt(startTime.split(":")[0]));
        startTimeDate.setMinutes(parseInt(startTime.split(":")[1]));

        console.log(endTime.split(":")[0]);

        const endTimeDate = new Date(currentTime);
        endTimeDate.setHours(parseInt(endTime.split(":")[0]));
        endTimeDate.setMinutes(parseInt(endTime.split(":")[1]));

        const response = await fetch(
          `https://par-kudserver-production.up.railway.app/reservations/updateStatus/${selectedReservation.reservationId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              status: selectedStatus,
              startTime: startTimeDate,
              endTime: endTimeDate,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setShowAlert(true);
          setNotificationType("success");
          setNotification("Reserva actualizada.");
        } else {
          //throw new Error("Error al actualizar la reserva");
        }
      } catch (error) {
        setShowAlert(true);
        setNotificationType("danger");
        setNotification("Error al actualizar la reserva.");
        console.error(error);
      }
    } else {
      setNotification(
        "Seleccione una ciudad y un parqueadero antes de continuar"
      );
    }
  };

  const getCities = async () => {
    try {
      const response = await fetch("https://par-kudserver-production.up.railway.app/parking/cities"); // Ruta en el backend para obtener la lista de ciudades
      const data = await response.json();
      setCities(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCityChange = async (event) => {
    const city = event.target.value;
    setSelectedCity(city);
    setSelectedParking("");
    setSelectedReservation("");
    setParkings([]);
    setUsers([]);
    setReservations([]);
    setParkingData({});
    setShowAlert(false);

    try {
      const response = await fetch(
        `https://par-kudserver-production.up.railway.app/parking/parkings?city=${city}`
      ); // Ruta en el backend para obtener los parqueaderos por ciudad
      const data = await response.json();
      setParkings(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleParkingChange = async (event) => {
    const parkingId = event.target.value;
    setSelectedParking(parkingId);
    setSelectedReservation("");
    setUsers([]);
    setReservations([]);
    setParkingData({});
    setShowAlert(false);

    try {
      const response = await fetch(
        `https://par-kudserver-production.up.railway.app/parking/${parkingId}`
      ); // Ruta en el backend para obtener los datos completos del parqueadero
      const data = await response.json();
      setParkingData(data);
    } catch (error) {
      console.error(error);
    }

    try {
      const response = await fetch(
        `https://par-kudserver-production.up.railway.app/user/users-by-parking/${parkingId}`
      );
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusChange = (event) => {
    const status = event.target.value;
    setSelectedStatus(status);
  };

  const handleUserChange = async (event) => {
    const userIdentityCard = event.target.value;
    setSelectedUser(userIdentityCard);

    try {
      const response = await fetch(
        `https://par-kudserver-production.up.railway.app/reservations/user-pending-reservations/${userIdentityCard}`
      );
      const data = await response.json();
      setReservations(data.reservations);
    } catch (error) {
      console.error(error);
    }
  };

  const handleReservationChange = (event) => {
    const reservationId = event.target.value;
    const selectedReservation = reservations.find(
      (reservation) => reservation.reservationId === reservationId
    );
    setSelectedReservation(selectedReservation);
    console.log(selectedReservation);
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-4">
          <Form.Label className="font-weight-bold">
            Seleccione una ciudad:
          </Form.Label>
          <Form.Control as="select" onChange={handleCityChange}>
            <option value="">Seleccione una ciudad</option>
            {cities.map((city, index) => (
              <option key={index} value={city}>
                {city}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label className="font-weight-bold">
            Seleccione un parqueadero:
          </Form.Label>
          <Form.Control as="select" onChange={handleParkingChange}>
            <option value="">Seleccione un parqueadero</option>
            {parkings.map((parking) => (
              <option key={parking.parkingId} value={parking.parkingId}>
                {parking.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label className="font-weight-bold">
            Seleccione un usuario:
          </Form.Label>
          <Form.Control as="select" onChange={handleUserChange}>
            <option value="">Seleccione un usuario</option>
            {users.map((user) => (
              <option key={user.parkingId} value={user.identityCard}>
                {user.userName}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        {selectedUser && (
          <Form.Group className="mb-4">
            <Form.Label className="font-weight-bold">
              Seleccione una reserva:
            </Form.Label>
            <Form.Control as="select" onChange={handleReservationChange}>
              <option value="">Seleccione una reserva</option>
              {reservations.map((reservation) => (
                <option
                  key={reservation.reservationId}
                  value={reservation.reservationId}
                >
                  {reservation.reservationId}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        )}
        {showAlert && (
          <Alert
            variant={notificationType}
            onClose={() => setShowAlert(false)}
            dismissible
          >
            {notification}
          </Alert>
        )}
        {selectedParking && selectedCity && selectedReservation && (
          <Form.Group>
            <Row>
              <Col>
                <h3 className="font-weight-bold">Información de Parqueadero</h3>
                <p>Parqueadero: {parkingData.name}</p>
                <p>Ciudad: {parkingData.city}</p>
                <p>Dirección: {parkingData.address}</p>

                <h3 className="mt-2 font-weight-bold">Reserva</h3>
                <p>
                  Creada: {selectedReservation?.createdAt?.substring(0, 10)}
                </p>
                <p>Estado: {selectedReservation?.status}</p>
              </Col>
              <Col>
                <Form.Group className="mb-4">
                  <Form.Label className="font-weight-bold">
                    Seleccione un estado:
                  </Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedStatus}
                    onChange={handleStatusChange}
                  >
                    <option value="">Seleccione un estado</option>
                    {statusOptions.map((status, index) => (
                      <option key={index} value={status}>
                        {status}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group
                  className="font-weight-bold mb-4"
                  controlId="formStartTime"
                >
                  <Form.Label>Hora de llegada</Form.Label>
                  <Form.Control
                    onChange={(e) => setStartTime(e.target.value)}
                    type="time"
                  />
                </Form.Group>
                <Form.Group
                  className="font-weight-bold mb-4"
                  controlId="formEndTime"
                >
                  <Form.Label>Hora de salida</Form.Label>
                  <Form.Control
                    onChange={(e) => setEndTime(e.target.value)}
                    type="time"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button
              variant="danger"
              type="submit"
              className="font-weight-bold btn-lg btn w-100"
            >
              Actualizar estado
            </Button>
          </Form.Group>
        )}
      </Form>
    </>
  );
}

export default ReservationsUsers;
