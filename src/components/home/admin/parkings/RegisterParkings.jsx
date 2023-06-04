import { Container, Card, Form, Row, Col, Button } from "react-bootstrap";

function RegisterParkings() {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    formData.append("name", form.elements["formName"].value);
    formData.append("city", form.elements["formCity"].value);
    formData.append("address", form.elements["formAddress"].value);
    formData.append("slots", form.elements["formSlots"].value);
    formData.append(
      "sedanHourlyRate",
      form.elements["formSedanHourlyRate"].value
    );
    formData.append("suvHourlyRate", form.elements["formSuvHourlyRate"].value);
    formData.append(
      "motorcycleHourlyRate",
      form.elements["formMotorcycleHourlyRate"].value
    );
    formData.append("openingTime", form.elements["formOpeningTime"].value);
    formData.append("closingTime", form.elements["formClosingTime"].value);
    formData.append("isCovered", form.elements["formIsCovered"].checked);

    const fileInput = form.elements["formImg"];
    if (fileInput.files.length > 0) {
      formData.append("image", fileInput.files[0]);
    }

    try {
      // Realizar la solicitud POST al backend
      const response = await fetch("https://par-kudserver-production.up.railway.app/parking/create", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        // Realizar acciones adicionales después de registrar el parqueadero
      } else {
        console.error("Error al registrar el parqueadero");
      }

      form.reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container className="rounded">
      <div className="d-lg-block">
        <Card className="rounded shadow" bg="white" text="dark">
          <Card.Header className="card-big-text border-dark text-black font-weight-bold">
            Registrar parqueadero
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group
                    className="font-weight-bold mb-4"
                    controlId="formName"
                  >
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control required type="text" />
                  </Form.Group>
                  <Form.Group
                    className="font-weight-bold mb-4"
                    controlId="formCity"
                  >
                    <Form.Label>Ciudad</Form.Label>
                    <Form.Control required type="text" />
                  </Form.Group>
                  <Form.Group
                    className="font-weight-bold mb-4"
                    controlId="formAddress"
                  >
                    <Form.Label>Dirección</Form.Label>
                    <Form.Control required type="text" />
                  </Form.Group>
                  <Form.Group
                    className="font-weight-bold mb-4"
                    controlId="formSlots"
                  >
                    <Form.Label>Espacios del parqueadero</Form.Label>
                    <Form.Control required type="number" />
                  </Form.Group>
                  <Form.Group
                    className="font-weight-bold mb-4"
                    controlId="formSedanHourlyRate"
                  >
                    <Form.Label>Tarifa para vehículos Sedan</Form.Label>
                    <Form.Control required type="text" />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group
                    className="font-weight-bold mb-4"
                    controlId="formSuvHourlyRate"
                  >
                    <Form.Label>Tarifa para vehículos SUV</Form.Label>
                    <Form.Control required type="text" />
                  </Form.Group>
                  <Form.Group
                    className="font-weight-bold mb-4"
                    controlId="formMotorcycleHourlyRate"
                  >
                    <Form.Label>Tarifa para motocicletas</Form.Label>
                    <Form.Control required type="text" />
                  </Form.Group>
                  <Form.Group
                    className="font-weight-bold mb-4"
                    controlId="formOpeningTime"
                  >
                    <Form.Label>Hora de apertura</Form.Label>
                    <Form.Control required type="time" />
                  </Form.Group>
                  <Form.Group
                    className="font-weight-bold mb-4"
                    controlId="formClosingTime"
                  >
                    <Form.Label>Hora de cierre</Form.Label>
                    <Form.Control required type="time" />
                  </Form.Group>
                  <Form.Group
                    className="font-weight-bold mb-4"
                    controlId="formImg"
                  >
                    <Form.Label>Cargar imagen del parqueadero</Form.Label>
                    <Form.Control required type="file" />
                  </Form.Group>
                  <Form.Check
                    className="mb-4"
                    type="switch"
                    id="formIsCovered"
                    label="¿Parqueadero cubierto?"
                  />
                </Col>
              </Row>

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

export default RegisterParkings;
