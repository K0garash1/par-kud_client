import { useState, useContext } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/UserContext";

function UserChangePassword() {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { setUser, user } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(newPassword);
    console.log(currentPassword);
    // Validar el formulario antes de enviar los datos
    if (newPassword !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    try {
      const response = await fetch(
        `par-kudserver-production.up.railway.app/user/updatePassword/${user.identityCard}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setUser(data);
        alert("Contraseña actualizada.");
        navigate("/user/reservations");
      } else {
        throw new Error("Error al actualizar la contraseña");
      }
    } catch (error) {
      console.error(error);
      alert("Error al actualizar contraseña. Revisar los datos.");
    }
  };

  return (
    <div className="user-panel">
      <Card>
        <Card.Header className="card-big-text border-dark text-black font-weight-bold">
          Actualizar contraseña
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group
              className="font-weight-bold"
              controlId="formCurrentPassword"
            >
              <Form.Label>Contraseña Actual</Form.Label>
              <Form.Control
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group
              className="font-weight-bold mt-2"
              controlId="formNewPassword"
            >
              <Form.Label>Nueva Contraseña</Form.Label>
              <Form.Control
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group
              className="font-weight-bold mt-2"
              controlId="formConfirmPassword"
            >
              <Form.Label>Confirmar Contraseña</Form.Label>
              <Form.Control
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>

            <Button
              size="lg"
              className="font-weight-bold mt-3 w-100"
              variant="success"
              type="submit"
            >
              Actualizar
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default UserChangePassword;
