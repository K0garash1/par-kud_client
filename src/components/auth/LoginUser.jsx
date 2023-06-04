import "./Login.css";
import { useRef, useState, useContext } from "react";
import { Container, Row, Card, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import ReCAPTCHA from "react-google-recaptcha";

function LoginUser() {
  const navigate = useNavigate();
  const { setRole, setUser } = useContext(UserContext);
  const [isValidCaptcha, setIsValidCaptcha] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const captcha = useRef(null);

  async function onChange() {
    const value = await captcha.current.getValue();
    if (value) {
      setIsValidCaptcha(true);
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault();

    if (isValidCaptcha) {
      try {
        // Realizar solicitud al backend para registrar al usuario
        const response = await fetch("par-kudserver-production.up.railway.app/user/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userName,
            password,
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
          if (data.user.passwordChanged) {
            navigate("/user/reservations");
          } else {
            navigate("/user/new-password");
          }
        } else {
          throw new Error("Error al iniciar sesión.");
        }
      } catch (error) {
        setRole(null);
        setUser(null);
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
        <Container className="mt-3 d-flex align-items-center justify-content-center">
          <Row className="align-items-stretch">
            <Card bg="white" text="dark">
              <Card.Header className="card-big-text border-dark text-black font-weight-bold">
                Iniciar sesión
              </Card.Header>
              <Card.Body>
                <Form className="needs-validation" onSubmit={submitHandler}>
                  <Form.Group className="was-validated mb-4">
                    <Form.Label className="font-weight-bold" htmlFor="userName">
                      Nombre de Usuario
                    </Form.Label>
                    <Form.Control
                      className="form-control"
                      type="text"
                      id="userName"
                      required
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="was-validated mb-4">
                    <Form.Label className="font-weight-bold" htmlFor="password">
                      Contraseña
                    </Form.Label>
                    <Form.Control
                      className="form-control"
                      type="password"
                      id="password"
                      required
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group
                    className="was-validated mb-4"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <ReCAPTCHA
                      ref={captcha}
                      sitekey={import.meta.env.VITE_RECAPTCHA_SITEKEY}
                      onChange={onChange}
                    />
                  </Form.Group>

                  <Button
                    className="font-weight-bold btn btn-lg btn-warning w-100"
                    type="submit"
                  >
                    Iniciar sesión
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default LoginUser;
