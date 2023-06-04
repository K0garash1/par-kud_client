import "./Login.css";
import { lazy, Suspense, useRef, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
const ReCAPTCHA = lazy(() => import("react-google-recaptcha"));
import { UserContext } from "../../context/UserContext";
import { Container, Row, Card, Form, Button } from "react-bootstrap";

function LoginEmployee() {
  const navigate = useNavigate();
  const { setRole, setUser } = useContext(UserContext);
  const [isValidCaptcha, setIsValidCaptcha] = useState(false);
  const [identityCard, setIdentityCard] = useState("");
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
        const response = await fetch("par-kudserver-production.up.railway.app/employee/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            identityCard,
            password,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const token = data.token;

          localStorage.setItem("token", token);

          if (data.employee.email === "parkud.udcode@outlook.com") {
            setRole("admin");
            setUser(data.employee);
            navigate("/admin/statistics");
          } else {
            setRole("employee");
            setUser(data.employee);
            navigate("/admin/users");
            console.log("hola");
          }
        } else {
          throw new Error("Error al iniciar sesión.");
        }
      } catch (error) {
        setRole(null);
        setUser(null);
        alert(error.message);
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
                Empleados
              </Card.Header>
              <Card.Body>
                <Form className="needs-validation" onSubmit={submitHandler}>
                  <Form.Group className="was-validated mb-4">
                    <Form.Label className="font-weight-bold" htmlFor="cedula">
                      Cédula de Ciudadanía
                    </Form.Label>
                    <Form.Control
                      className="form-control"
                      type="number"
                      id="cedula"
                      required
                      onChange={(e) => setIdentityCard(e.target.value)}
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
                    <Suspense fallback={<div>Cargando ReCAPTCHA...</div>}>
                      <ReCAPTCHA
                        ref={captcha}
                        sitekey={import.meta.env.VITE_RECAPTCHA_SITEKEY}
                        onChange={onChange}
                      />
                    </Suspense>
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

export default LoginEmployee;
