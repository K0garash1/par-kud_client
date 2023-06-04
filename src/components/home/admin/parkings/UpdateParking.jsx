import { useState, useEffect } from "react";
import { Container, Card, Form, Row, Col, Button } from "react-bootstrap";

function UpdateParking() {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [parkings, setParkings] = useState([]);
  const [selectedParking, setSelectedParking] = useState("");
  const [parkingData, setParkingData] = useState({});
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [slots, setSlots] = useState("");
  const [sedanHourlyRate, setSedanHourlyRate] = useState("");
  const [suvHourlyRate, setSuvHourlyRate] = useState("");
  const [motorcycleHourlyRate, setMotorcycleHourlyRate] = useState("");
  const [openingTime, setOpeningTime] = useState("");
  const [closingTime, setClosingTime] = useState("");

  useEffect(() => {
    getCities();
  }, []);

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
      const response = await fetch(
        `par-kudserver-production.up.railway.app/parking/update/${
          parkingData ? parkingData.parkingId : ""
        }`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data);
      } else {
        console.error("Error al registrar el parqueadero");
      }
      form.reset();
      resetForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!selectedParking) {
      return;
    }

    try {
      const response = await fetch(
        `par-kudserver-production.up.railway.app/parking/delete/${selectedParking}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        resetForm();
      } else {
        console.error("Error al eliminar el parqueadero");
      }
    } catch (error) {
      console.error(error);
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
    setSelectedParking(parkingId);

    try {
      if (!parkingId) {
        setParkingData(null);
      } else {
        const response = await fetch(
          `par-kudserver-production.up.railway.app/parking/${parkingId}`
        );
        const data = await response.json();
        setParkingData(data);
        setName(data.name);
        setCity(data.city);
        setAddress(data.address);
        setSlots(data.slots);
        setSedanHourlyRate(data.sedanHourlyRate);
        setSuvHourlyRate(data.suvHourlyRate);
        setMotorcycleHourlyRate(data.motorcycleHourlyRate);
        setOpeningTime(data.openingTime);
        setClosingTime(data.closingTime);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCityNameChange = (event) => {
    const newCity = event.target.value;
    setCity(newCity);
  };

  const handleNameChange = (event) => {
    const newName = event.target.value;
    setName(newName);
  };

  const handleAddressChange = (event) => {
    const newAddress = event.target.value;
    setAddress(newAddress);
  };

  const handleSlotsChange = (event) => {
    const newSlots = event.target.value;
    setSlots(newSlots);
  };

  const handleSedanHourlyRateChange = (event) => {
    const newSedanHourlyRate = event.target.value;
    setSedanHourlyRate(newSedanHourlyRate);
  };

  const handleSuvHourlyRateChange = (event) => {
    const newSuvHourlyRate = event.target.value;
    setSuvHourlyRate(newSuvHourlyRate);
  };

  const handleMotorcycleHourlyRateChange = (event) => {
    const newMotorcycleHourlyRate = event.target.value;
    setMotorcycleHourlyRate(newMotorcycleHourlyRate);
  };

  const handleOpeningTimeChange = (event) => {
    const newOpeningTime = event.target.value;
    setOpeningTime(newOpeningTime);
  };

  const handleClosingTime = (event) => {
    const newClosingTime = event.target.value;
    setClosingTime(newClosingTime);
  };

  const resetForm = () => {
    getCities();
    setSelectedCity("");
    setSelectedParking("");
    setParkings([]);
    setParkingData({});
    setName("");
    setCity("");
    setAddress("");
    setSlots("");
    setSedanHourlyRate("");
    setSuvHourlyRate("");
    setMotorcycleHourlyRate("");
    setOpeningTime("");
    setClosingTime("");
  };

  return (
    <Container className="rounded">
      <div className="d-lg-block">
        <Card className="rounded shadow" bg="white" text="dark">
          <Card.Header className="card-big-text border-dark text-black font-weight-bold">
            Actualizar parqueadero
          </Card.Header>
          <Card.Body>
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
              {selectedCity && selectedParking && (
                <>
                  <hr />
                  {parkingData.imgUrl && (
                  <img
                    className="rounded shadow img-extended mb-4 w-100"
                    src={`par-kudserver-production.up.railway.app/uploads/${parkingData.imgUrl}`}
                    alt="Imagen del parqueadero"
                  />
                )}
                  <Row>
                    <Col md={6}>
                      <Form.Group
                        className="font-weight-bold mb-4"
                        controlId="formName"
                      >
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                          required
                          value={name}
                          onChange={handleNameChange}
                          type="text"
                        />
                      </Form.Group>
                      <Form.Group
                        className="font-weight-bold mb-4"
                        controlId="formCity"
                      >
                        <Form.Label>Ciudad</Form.Label>
                        <Form.Control
                          required
                          value={city}
                          onChange={handleCityNameChange}
                          type="text"
                        />
                      </Form.Group>
                      <Form.Group
                        className="font-weight-bold mb-4"
                        controlId="formAddress"
                      >
                        <Form.Label>Dirección</Form.Label>
                        <Form.Control
                          required
                          value={address}
                          onChange={handleAddressChange}
                          type="text"
                        />
                      </Form.Group>
                      <Form.Group
                        className="font-weight-bold mb-4"
                        controlId="formSlots"
                      >
                        <Form.Label>Espacios del parqueadero</Form.Label>
                        <Form.Control
                          required
                          value={slots}
                          onChange={handleSlotsChange}
                          type="number"
                        />
                      </Form.Group>
                      <Form.Group
                        className="font-weight-bold mb-4"
                        controlId="formSedanHourlyRate"
                      >
                        <Form.Label>Tarifa para vehículos Sedan</Form.Label>
                        <Form.Control
                          required
                          value={sedanHourlyRate}
                          onChange={handleSedanHourlyRateChange}
                          type="text"
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group
                        className="font-weight-bold mb-4"
                        controlId="formSuvHourlyRate"
                      >
                        <Form.Label>Tarifa para vehículos SUV</Form.Label>
                        <Form.Control
                          required
                          value={suvHourlyRate}
                          onChange={handleSuvHourlyRateChange}
                          type="text"
                        />
                      </Form.Group>
                      <Form.Group
                        className="font-weight-bold mb-4"
                        controlId="formMotorcycleHourlyRate"
                      >
                        <Form.Label>Tarifa para motocicletas</Form.Label>
                        <Form.Control
                          required
                          value={motorcycleHourlyRate}
                          onChange={handleMotorcycleHourlyRateChange}
                          type="text"
                        />
                      </Form.Group>
                      <Form.Group
                        className="font-weight-bold mb-4"
                        controlId="formOpeningTime"
                      >
                        <Form.Label>Hora de apertura</Form.Label>
                        <Form.Control
                          required
                          value={openingTime}
                          onChange={handleOpeningTimeChange}
                          type="time"
                        />
                      </Form.Group>
                      <Form.Group
                        className="font-weight-bold mb-4"
                        controlId="formClosingTime"
                      >
                        <Form.Label>Hora de cierre</Form.Label>
                        <Form.Control
                          required
                          value={closingTime}
                          onChange={handleClosingTime}
                          type="time"
                        />
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
                    Actualizar
                  </Button>

                  <Button
                    variant="danger"
                    onClick={handleDelete}
                    className="mt-3 font-weight-bold btn-lg btn w-100"
                  >
                    Eliminar
                  </Button>
                </>
              )}
            </Form>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}

export default UpdateParking;
