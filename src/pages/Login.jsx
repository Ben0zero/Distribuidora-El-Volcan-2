import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'

const CLAVE_USUARIOS = 'usuarios'
const CLAVE_SESION = 'sesion'
const ADMIN_DEFAULT = [{ nombre: 'Administrador', email: 'admin@duoc.cl', password: 'Admin123', rol: 'Administrador' }]

function Login() {
  const [error, setError] = useState('')
  const [sesion, setSesion] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CLAVE_SESION)) || null
    } catch {
      return null
    }
  })
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues: { email: '', password: '' } })

  const onSubmit = (data) => {
    const email = data.email.trim()
    const password = data.password

    const usuariosGuardados = JSON.parse(localStorage.getItem(CLAVE_USUARIOS)) || []
    const usuarios = [...ADMIN_DEFAULT, ...usuariosGuardados]

    const usuario = usuarios.find((u) => {
      const correoUsuario = u.correo || u.email
      const contrasenaUsuario = u.contrasena || u.password
      return correoUsuario === email && contrasenaUsuario === password
    })

    if (!usuario) {
      setError('Credenciales incorrectas')
      return
    }

    setError('')
    const sesionGuardada = { nombre: usuario.nombre, email, rol: usuario.rol }
    localStorage.setItem(CLAVE_SESION, JSON.stringify(sesionGuardada))
    setSesion(sesionGuardada)
    navigate('/')
  }

  function cerrarSesion() {
    localStorage.removeItem(CLAVE_SESION)
    setSesion(null)
  }

  if (sesion) {
    return (
      <Container className="mt-4">
        <Alert variant="success">
          Sesión iniciada: {sesion.nombre} ({sesion.rol})
        </Alert>
        <Button as={Link} to="/productos" variant="primary" className="me-2">
          Ver productos
        </Button>
        <Button variant="outline-danger" onClick={cerrarSesion}>
          Cerrar sesión
        </Button>
      </Container>
    )
  }

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card>
            <Card.Body>
              <Card.Title>Iniciar Sesión</Card.Title>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Correo electrónico</Form.Label>
                  <Form.Control
                    type="text"
                    {...register('email', {
                      required: 'El correo electrónico es obligatorio',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'El correo electrónico no es válido'
                      }
                    })}
                    isInvalid={!!errors.email}
                  />
                  {errors.email && <Form.Text className="text-danger">{errors.email.message}</Form.Text>}
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    {...register('password', {
                      required: 'La contraseña es obligatoria',
                      minLength: {
                        value: 4,
                        message: 'La contraseña debe tener al menos 4 caracteres'
                      }
                    })}
                    isInvalid={!!errors.password}
                  />
                  {errors.password && <Form.Text className="text-danger">{errors.password.message}</Form.Text>}
                </Form.Group>

                {error && <Alert variant="danger">{error}</Alert>}
                <Button type="submit" variant="primary">
                  Ingresar
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Login
