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
          "https://par-kudserver-production.up.railway.app/employee/register",
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
              parkingId: selectedParking.parkingId,
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
          throw new Error("Error al registrar empleado.");
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
    setSelectedParking(null);

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

    try {
      const response = await fetch(
        `https://par-kudserver-production.up.railway.app/parking/${parkingId}`
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
                  >
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      type="text"
                    />
                  </Form.Group>

                  <Form.Group
                    className="font-weight-bold mb-4"
                    controlId="formLastName"
                  >
                    <Form.Label>Apellido</Form.Label>
                    <Form.Control
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      type="text"
                    />
                  </Form.Group>

                  <Col md={6}></Col>

                  <Form.Group
                    className="font-weight-bold mb-4"
                    controlId="formIdentityCard"
                  >
                    <Form.Label>Cedula de Ciudadanía</Form.Label>
                    <Form.Control
                      onChange={(e) => setIdentityCard(e.target.value)}
                      required
                      type="text"
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group
                    className="font-weight-bold mb-4"
                    controlId="formEmail"
                  >
                    <Form.Label>Correo Electrónico</Form.Label>
                    <Form.Control
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      type="email"
                    />
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
                variant="success"
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
