import { useState, useEffect, useContext } from "react";
import { Form, Row, Col, Button, Alert } from "react-bootstrap";
import { UserContext } from "../../../../context/UserContext";

function UserReservation() {
  const { user } = useContext(UserContext);

  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [parkings, setParkings] = useState([]);
  const [selectedParking, setSelectedParking] = useState("");
  const [parkingData, setParkingData] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [notification, setNotification] = useState("");
  const [notificationType, setNotificationType] = useState("primary");

  useEffect(() => {
    getCities();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedParking && selectedCity) {
      try {
        const response = await fetch(
          "par-kudserver-production.up.railway.app/reservations/create",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              identityCard: user.identityCard,
              parkingId: selectedParking,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log(data);

          setShowAlert(true);
          setNotificationType("success");
          setNotification(
            `Tu ID de reserva es: ${data.reservationId} [Anotalo en un lugar que recuerdes, lo necesitarás más adelante]`
          );
        } else {
          throw new Error("Error al crear la reserva");
        }
      } catch (error) {
        setShowAlert(true);
        setNotificationType("danger");
        setNotification("Error al hacer la reserva.");
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
      const response = await fetch("par-kudserver-production.up.railway.app/parking/cities"); // Ruta en el backend para obtener la lista de ciudades
      const data = await response.json();
      setCities(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCityChange = async (event) => {
    const city = event.target.value;
    setSelectedCity(city);
    setShowAlert(false);
    setSelectedParking(null);

    try {
      const response = await fetch(
        `par-kudserver-production.up.railway.app/parking/parkings?city=${city}`
      ); // Ruta en el backend para obtener los parqueaderos por ciudad
      const data = await response.json();
      setParkings(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleParkingChange = async (event) => {
    const parkingId = event.target.value;
    setShowAlert(false);
    setSelectedParking(parkingId);

    try {
      const response = await fetch(
        `par-kudserver-production.up.railway.app/parking/${parkingId}`
      ); // Ruta en el backend para obtener los datos completos del parqueadero
      const data = await response.json();
      setParkingData(data);
    } catch (error) {
      console.error(error);
    }
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

        {selectedParking && selectedCity && showAlert && (
          <Alert
            variant={notificationType}
            onClose={() => setShowAlert(false)}
            dismissible
          >
            {notification}
          </Alert>
        )}
        {selectedParking && selectedCity && (
          <Form.Group>
            <Row>
              <Col>
                {parkingData.imgUrl && (
                  <img
                    className="rounded shadow img-user-reservation mb-4"
                    src={`par-kudserver-production.up.railway.app/uploads/${parkingData.imgUrl}`}
                    alt="Imagen del parqueadero"
                  />
                )}
              </Col>
              <Col>
                <h3 className="font-weight-bold">Información</h3>
                <p>Parqueadero: {parkingData.name}</p>
                <p>Ciudad: {parkingData.city}</p>
                <p>Dirección: {parkingData.address}</p>
                <p>Campos totales: {parkingData.slots}</p>
                <p>
                  Parqueadero cubierto: {parkingData.isCovered ? "Sí" : "No"}
                </p>

                <h3 className="mt-5 font-weight-bold">Horarios</h3>
                <p>Abre: {parkingData?.openingTime?.substring(0, 5)}</p>
                <p>Cierra: {parkingData?.closingTime?.substring(0, 5)}</p>
              </Col>
              <Col>
                <h3 className="font-weight-bold">Tarifas x hora</h3>
                <p>Sedan: ${parkingData.sedanHourlyRate}</p>
                <p>SUV: ${parkingData.suvHourlyRate}</p>
                <p>Motocicletas: ${parkingData.motorcycleHourlyRate}</p>
              </Col>
            </Row>

            <Button
              variant="danger"
              type="submit"
              className="font-weight-bold btn-lg btn w-100"
            >
              Reservar ahora
            </Button>
          </Form.Group>
        )}
      </Form>
    </>
  );
}

export default UserReservation;
