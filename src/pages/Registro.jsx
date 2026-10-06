import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap'

const CLAVE_USUARIOS = 'usuarios'

const REGIONES = [
  {
    nombre: 'Región de Ñuble',
    comunas: [
      'Chillán',
      'Chillán Viejo',
      'El Carmen',
      'Pinto',
      'San Ignacio',
      'Bulnes',
      'Quillón'
    ]
  }
]

function Registro() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      nombre: '',
      run: '',
      correo: '',
      telefono: '',
      tipoCliente: 'Residencial',
      direccion: '',
      region: '',
      comuna: '',
      password: '',
      confirmar: '',
      terminos: false
    }
  })

  const regionSeleccionada = watch('region')
  const comunasRegion = REGIONES.find((r) => r.nombre === regionSeleccionada)

  function validarRun(valor) {
    return /^\d{7,9}$/.test(String(valor).replace(/\s/g, ''))
  }

  function validarTelefono(valor) {
    const limpio = String(valor).replace(/[\s()-]/g, '')
    return /^\+?\d{9,12}$/.test(limpio)
  }

  function correoDominioPermitido(valor) {
    return /^[^\s@]+@(profesor\.duoc\.cl|duoc\.cl|gmail\.com)$/i.test(valor)
  }

  const onSubmit = (data) => {
    const usuarios = JSON.parse(localStorage.getItem(CLAVE_USUARIOS)) || []

    if (usuarios.some((u) => u.correo.toLowerCase() === data.correo.toLowerCase())) {
      alert('Ese correo ya está registrado')
      return
    }

    usuarios.push({
      fecha: new Date().toISOString().slice(0, 10),
      run: data.run.trim(),
      nombre: data.nombre.trim(),
      correo: data.correo.trim(),
      telefono: data.telefono.trim(),
      tipoCliente: data.tipoCliente,
      direccion: data.direccion.trim(),
      region: data.region,
      comuna: data.comuna,
      contrasena: data.password,
      rol: 'Cliente',
      estado: 'Pendiente'
    })

    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios))
    alert('Cuenta creada correctamente. Ya puedes iniciar sesión.')
    navigate('/login')
  }

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card>
            <Card.Body>
              <Card.Title>Crear cuenta</Card.Title>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3" controlId="nombre">
                  <Form.Label>Nombre completo</Form.Label>
                  <Form.Control
                    type="text"
                    {...register('nombre', {
                      required: 'Ingresa tu nombre completo',
                      maxLength: { value: 100, message: 'El nombre no puede superar los 100 caracteres' }
                    })}
                    isInvalid={!!errors.nombre}
                  />
                  {errors.nombre && <Form.Text className="text-danger">{errors.nombre.message}</Form.Text>}
                </Form.Group>

                <Form.Group className="mb-3" controlId="run">
                  <Form.Label>RUN</Form.Label>
                  <Form.Control
                    type="text"
                    {...register('run', {
                      required: 'Ingresa tu RUN',
                      validate: (v) => validarRun(v) || 'El RUN debe tener entre 7 y 9 dígitos, sin puntos y sin guion'
                    })}
                    isInvalid={!!errors.run}
                  />
                  {errors.run && <Form.Text className="text-danger">{errors.run.message}</Form.Text>}
                </Form.Group>

                <Form.Group className="mb-3" controlId="correo">
                  <Form.Label>Correo electrónico</Form.Label>
                  <Form.Control
                    type="text"
                    {...register('correo', {
                      required: 'Ingresa tu correo electrónico',
                      validate: (v) => correoDominioPermitido(v) || 'Debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com'
                    })}
                    isInvalid={!!errors.correo}
                  />
                  {errors.correo && <Form.Text className="text-danger">{errors.correo.message}</Form.Text>}
                </Form.Group>

                <Form.Group className="mb-3" controlId="telefono">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    type="text"
                    {...register('telefono', {
                      required: 'Ingresa tu teléfono',
                      validate: (v) => validarTelefono(v) || 'Teléfono inválido (ej: +56 9 1234 5678)'
                    })}
                    isInvalid={!!errors.telefono}
                  />
                  {errors.telefono && <Form.Text className="text-danger">{errors.telefono.message}</Form.Text>}
                </Form.Group>

                <Form.Group className="mb-3" controlId="tipo-cliente">
                  <Form.Label>Tipo de cliente</Form.Label>
                  <Form.Select {...register('tipoCliente', { required: true })}>
                    <option value="Residencial">Residencial</option>
                    <option value="Comercial">Comercial</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="direccion">
                  <Form.Label>Dirección de despacho</Form.Label>
                  <Form.Control
                    type="text"
                    {...register('direccion', { required: 'Ingresa tu dirección de despacho' })}
                    isInvalid={!!errors.direccion}
                  />
                  {errors.direccion && <Form.Text className="text-danger">{errors.direccion.message}</Form.Text>}
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="region">
                      <Form.Label>Región</Form.Label>
                      <Form.Select
                        {...register('region', { required: 'Selecciona tu región' })}
                        isInvalid={!!errors.region}
                        onChange={(e) => {
                          setValue('region', e.target.value)
                          setValue('comuna', '')
                        }}
                      >
                        <option value="">Elige una región...</option>
                        {REGIONES.map((r) => (
                          <option key={r.nombre} value={r.nombre}>
                            {r.nombre}
                          </option>
                        ))}
                      </Form.Select>
                      {errors.region && <Form.Text className="text-danger">{errors.region.message}</Form.Text>}
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="comuna">
                      <Form.Label>Comuna</Form.Label>
                      <Form.Select
                        {...register('comuna', { required: 'Selecciona tu comuna de despacho' })}
                        isInvalid={!!errors.comuna}
                        disabled={!regionSeleccionada}
                      >
                        <option value="">Elige una comuna...</option>
                        {comunasRegion &&
                          comunasRegion.comunas.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                      </Form.Select>
                      {errors.comuna && <Form.Text className="text-danger">{errors.comuna.message}</Form.Text>}
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    {...register('password', {
                      required: 'La contraseña es obligatoria',
                      minLength: { value: 4, message: 'Mínimo 4 caracteres' },
                      maxLength: { value: 10, message: 'Máximo 10 caracteres' }
                    })}
                    isInvalid={!!errors.password}
                  />
                  {errors.password && <Form.Text className="text-danger">{errors.password.message}</Form.Text>}
                </Form.Group>

                <Form.Group className="mb-3" controlId="confirmar">
                  <Form.Label>Confirmar contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    {...register('confirmar', {
                      required: 'Confirma tu contraseña',
                      validate: (v) => v === getValues('password') || 'Las contraseñas no coinciden'
                    })}
                    isInvalid={!!errors.confirmar}
                  />
                  {errors.confirmar && <Form.Text className="text-danger">{errors.confirmar.message}</Form.Text>}
                </Form.Group>

                <Form.Check
                  type="checkbox"
                  id="terminos"
                  label="Acepto los términos y condiciones"
                  {...register('terminos', { required: 'Debes aceptar los términos y condiciones' })}
                  isInvalid={!!errors.terminos}
                  className="mb-2"
                />
                {errors.terminos && <Form.Text className="text-danger d-block mb-3">{errors.terminos.message}</Form.Text>}

                <Button type="submit" variant="success">
                  Registrarse
                </Button>
              </Form>

              <p className="mt-3 mb-0">
                ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Registro
