import { useEffect, useState } from "react";
import {
  Container,
  Card,
  Form,
  Row,
  Col,
  Button,
  Alert,
} from "react-bootstrap";

function RegisterEmployees() {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [parkings, setParkings] = useState([]);
  const [selectedParking, setSelectedParking] = useState("");
  const [parkingData, setParkingData] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [notification, setNotification] = useState("");
  const [notificationType, setNotificationType] = useState("primary");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [identityCard, setIdentityCard] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    getCities();
  }, []);

  const handleSubmit = async (e) => {
    console.log(parkingData);
    e.preventDefault();

    if (selectedParking && selectedCity) {
      try {
        const response = await fetch(
          "http://localhost:3000/employees/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              firstName,
              lastName,
              identityCard,
              email,
              parkingId: selectedParking,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log(data);

          setShowAlert(true);
          setNotificationType("success");
          setNotification("Empleado creado.");
        } else {
          throw new Error("Error al crear la reserva");
        }
      } catch (error) {
        setShowAlert(true);
        setNotificationType("danger");
        setNotification("Error al crear empleado.");
        console.error(error);
      }
    } else {
      setShowAlert(true);
      setNotificationType("danger");
      setNotification(
        "Seleccione una ciudad y un parqueadero antes de continuar."
      );
    }
  };

  const getCities = async () => {
    try {
      const response = await fetch("http://localhost:3000/get-cities"); // Ruta en el backend para obtener la lista de ciudades
      const data = await response.json();
      setCities(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCityChange = async (event) => {
    const city = event.target.value;
    setSelectedCity(city);
    setSelectedParking(null);

    try {
      const response = await fetch(
        `http://localhost:3000/parkings?city=${city}`
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

    try {
      const response = await fetch(
        `http://localhost:3000/parking/${parkingId}`
      ); // Ruta en el backend para obtener los datos completos del parqueadero
      const data = await response.json();
      setParkingData(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container className="rounded">
      <div className="d-lg-block">
        <Card className="rounded shadow" bg="white" text="dark">
          <Card.Header className="card-big-text border-dark text-black font-weight-bold">
            Registrar empleado
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group
                    className="font-weight-bold mb-4"
                    controlId="formFirstName"
                    required
                    onChange={(e) => setFirstName(e.target.value)}
                  >
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control requiredtype="text" />
                  </Form.Group>

                  <Form.Group
                    className="font-weight-bold mb-4"
                    controlId="formLastName"
                    required
                    onChange={(e) => setLastName(e.target.value)}
                  >
                    <Form.Label>Apellido</Form.Label>
                    <Form.Control required type="text" />
                  </Form.Group>

                  <Col md={6}></Col>

                  <Form.Group
                    className="font-weight-bold mb-4"
                    controlId="formIdentityCard"
                    onChange={(e) => setIdentityCard(e.target.value)}
                  >
                    <Form.Label>Cedula de Ciudadanía</Form.Label>
                    <Form.Control required type="text" />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group
                    className="font-weight-bold mb-4"
                    controlId="formEmail"
                    onChange={(e) => setEmail(e.target.value)}
                  >
                    <Form.Label>Correo Electrónico</Form.Label>
                    <Form.Control required type="email" />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="font-weight-bold">
                      Seleccione una Ciudad
                    </Form.Label>
                    <Form.Control as="select" onChange={handleCityChange}>
                      <option value="">Seleccione una Ciudad</option>
                      {cities.map((city, index) => (
                        <option key={index} value={city}>
                          {city}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="font-weight-bold">
                      Seleccione un Parqueadero
                    </Form.Label>
                    <Form.Control as="select" onChange={handleParkingChange}>
                      <option value="">Seleccione un Parqueadero</option>
                      {parkings.map((parking) => (
                        <option
                          key={parking.parkingId}
                          value={parking.parkingId}
                        >
                          {parking.name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              {showAlert && (
                <Alert
                  variant={notificationType}
                  onClose={() => setShowAlert(false)}
                  dismissible
                >
                  {notification}
                </Alert>
              )}
              <Button
                variant="primary"
                type="submit"
                className="font-weight-bold btn-lg btn w-100"
              >
                Registrar
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}

export default RegisterEmployees;
