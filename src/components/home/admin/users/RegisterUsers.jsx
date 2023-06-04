import { useState } from "react";
import {
  Container,
  Card,
  Form,
  Row,
  Col,
  Button,
  Alert,
} from "react-bootstrap";

function RegisterUsers() {
  const [showAlert, setShowAlert] = useState(false);
  const [notification, setNotification] = useState("");
  const [notificationType, setNotificationType] = useState("primary");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [identityCard, setIdentityCard] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("par-kudserver-production.up.railway.app/user/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          userName,
          identityCard,
          email,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);

        setShowAlert(true);
        setNotificationType("success");
        setNotification("Usuario creado.");
        resetForm();
      } else {
        throw new Error("Error al crear usuario.");
      }
    } catch (error) {
      setShowAlert(true);
      setNotificationType("danger");
      setNotification("Error al crear usuario.");
    }
  };

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setUserName("");
    setIdentityCard("");
    setEmail("");
  };

  return (
    <Container className="rounded">
      <div className="d-lg-block">
        <Card className="rounded shadow" bg="white" text="dark">
          <Card.Header className="card-big-text border-dark text-black font-weight-bold">
            Registrar usuario
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
                      value={firstName}
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
                      value={lastName}
                      required
                      type="text"
                    />
                  </Form.Group>

                  <Col md={6}></Col>

                  <Form.Group
                    className="font-weight-bold mb-4"
                    controlId="formUserName"
                  >
                    <Form.Label>Nombre de Usuario</Form.Label>
                    <Form.Control
                      onChange={(e) => setUserName(e.target.value)}
                      value={userName}
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
                      value={email}
                      required
                      type="email"
                    />
                  </Form.Group>

                  <Form.Group
                    className="font-weight-bold mb-4"
                    controlId="formIdentityCard"
                  >
                    <Form.Label>Cedula de Ciudadanía</Form.Label>
                    <Form.Control
                      onChange={(e) => setIdentityCard(e.target.value)}
                      value={identityCard}
                      required
                      type="number"
                    />
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

export default RegisterUsers;
