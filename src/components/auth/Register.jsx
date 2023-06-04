import "./Login.css";
import { lazy, Suspense, useRef, useState, useContext } from "react";
import { Container, Row, Col, Card, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
const ReCAPTCHA = lazy(() => import("react-google-recaptcha"));

function Register() {
  const navigate = useNavigate();
  const { role, setRole, user, setUser } = useContext(UserContext);

  const [isValidCaptcha, setIsValidCaptcha] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [identityCard, setIdentityCard] = useState("");
  const [email, setEmail] = useState("");

  const captcha = useRef(null);

  async function onChange() {
    const value = await captcha.current.getValue();
    if (value) {
      setIsValidCaptcha(true);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isValidCaptcha && !role && !user) {
      try {
        // Realizar solicitud al backend para registrar al usuario
        const response = await fetch("https://par-kudserver-production.up.railway.app/user/register", {
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
          // Obtener el token de la respuesta
          const data = await response.json();
          const token = data.token;

          // Guardar el token en el almacenamiento local (localStorage o sessionStorage)
          localStorage.setItem("token", token);

          // Redirigir al usuario a la página de inicio
          setRole("user");
          setUser(data.user);
          navigate("/user/new-password");
        } else {
          // Manejar el caso de error en la respuesta
          throw new Error("Error al registrar usuario.");
        }
      } catch (error) {
        setRole(null);
        alert(error.message);
        console.error(error);
      }
    } else {
      alert("Complete el reCAPTCHA antes de continuar.");
    }
  };

  return (
    <>
      <div className="bg-container">
        <Container className="col-5 mt-3 d-flex align-items-center justify-content-center">
          <Row className="align-items-stretch">
            <Card bg="white" text="dark">
              <Card.Header className="card-big-text border-dark text-black font-weight-bold">
                Registrarse
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="was-validated mb-4">
                        <Form.Label
                          className="form-label font-weight-bold"
                          htmlFor="firstName"
                        >
                          Nombre
                        </Form.Label>
                        <Form.Control
                          type="text"
                          id="firstName"
                          required
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="was-validated mb-4">
                        <Form.Label
                          className="form-label font-weight-bold"
                          htmlFor="lastName"
                        >
                          Apellido
                        </Form.Label>
                        <Form.Control
                          type="text"
                          id="lastName"
                          required
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="was-validated mb-4">
                        <Form.Label
                          className="form-label font-weight-bold"
                          htmlFor="userName"
                        >
                          Nombre de Usuario
                        </Form.Label>
                        <Form.Control
                          type="text"
                          id="userName"
                          required
                          onChange={(e) => setUserName(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="was-validated mb-4">
                        <Form.Label
                          className="form-label font-weight-bold"
                          htmlFor="email"
                        >
                          Correo Electrónico
                        </Form.Label>
                        <Form.Control
                          type="email"
                          id="email"
                          required
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="was-validated mb-4">
                        <Form.Label
                          className="form-label font-weight-bold"
                          htmlFor="identityCard"
                        >
                          Cedula de Ciudadanía
                        </Form.Label>
                        <Form.Control
                          type="number"
                          id="identityCard"
                          required
                          onChange={(e) => setIdentityCard(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <div
                    className="form-group was-validated mb-4"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Suspense fallback={<div>Cargando ReCAPTCHA...</div>}>
                      <ReCAPTCHA
                        ref={captcha}
                        sitekey={import.meta.env.VITE_RECAPTCHA_SITEKEY}
                        onChange={onChange}
                      />
                    </Suspense>
                  </div>

                  <input
                    className="font-weight-bold btn btn-lg btn-warning w-100"
                    type="submit"
                    value="Registrarse"
                  />
                </Form>
              </Card.Body>
            </Card>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default Register;
