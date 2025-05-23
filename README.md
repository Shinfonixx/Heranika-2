# 🌿 Heranika - Plataforma de Reservas para Alojamiento Rural

Bienvenido al repositorio del proyecto **Heranika**, una página web desarrollada para gestionar de forma eficiente el alquiler vacacional de una finca rural. Esta plataforma permite a los usuarios consultar la disponibilidad, realizar reservas online, efectuar pagos seguros mediante PayPal, dejar opiniones y gestionar sus reservas desde un área privada.

---

## 📌 Índice

- [Descripción del Proyecto](#descripción-del-proyecto)
- [Objetivos](#objetivos)
- [Características Principales](#características-principales)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Requisitos del Sistema](#requisitos-del-sistema)
- [Instalación](#instalación)
- [Configuración del Entorno](#configuración-del-entorno)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Pruebas](#pruebas)
- [Despliegue](#despliegue)
- [Autor](#autor)
- [Licencia](#licencia)

---

## 📝 Descripción del Proyecto

Este proyecto surge de una necesidad real en mi entorno familiar. Un familiar cercano gestiona la finca rural **Heranika**, destinada al turismo vacacional, y hasta ahora no disponía de una web que permitiera gestionar reservas de forma digital.

El objetivo principal ha sido crear una plataforma intuitiva, funcional y segura, donde los usuarios puedan:
- Informarse sobre la finca.
- Ver disponibilidad y precios.
- Reservar y pagar de forma online mediante PayPal.
- Dejar opiniones y contactar directamente con el alojamiento.
- Acceder a un área privada para gestionar sus reservas.

Además de resolver una necesidad concreta, este proyecto busca fomentar la digitalización del turismo rural y facilitar al propietario la gestión eficiente de su negocio.

---

## 🎯 Objetivos

### Objetivo general
Desarrollar una página web funcional para la finca rural Heranika que permita gestionar reservas, pagos online, opiniones de clientes y contacto con los usuarios.

### Objetivos específicos
1. Implementar un sistema de reservas con calendario interactivo y verificación de disponibilidad.
2. Integrar una pasarela de pago segura mediante PayPal.
3. Desarrollar un área de usuario con funcionalidades de registro, inicio de sesión y gestión de reservas.
4. Permitir que los usuarios dejen opiniones sobre su estancia y que estas se muestren en la web.
5. Crear una sección de contacto con preguntas frecuentes para mejorar la atención al cliente.

---

## ✅ Características Principales

- Visualización de información e imágenes de la finca.
- Calendario interactivo para comprobar disponibilidad.
- Sistema de reservas con gestión de fechas, usuarios y pagos.
- Integración con PayPal para realizar transacciones seguras.
- Opiniones de clientes visibles públicamente.
- Área privada para gestión de reservas.

---

## 🛠 Tecnologías Utilizadas

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js

### Base de Datos
- MongoDB (MongoDB Atlas)

### Otros
- PayPal API
- Git & GitHub (control de versiones)

---

## 💻 Requisitos del Sistema

- Node.js v16+ instalado
- MongoDB Atlas o una base de datos MongoDB local
- Cuenta de desarrollador PayPal para usar la API
- Entorno de desarrollo (VS Code recomendado)

---

## 🚀 Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/tuusuario/heranika.git
cd heranika

2. Instalar las dependencias:

  npm install

3. Crear un archivo .env en la raíz con el siguiente contenido:

  PORT=3004
  MONGO_URI=TU_URI_DE_MONGODB
  PAYPAL_CLIENT_ID=TU_CLIENT_ID
  PAYPAL_CLIENT_SECRET=TU_CLIENT_SECRET
  SESSION_SECRET=una_clave_secreta_segura

4. Iniciar el servidor:

  npm start

⚙️ Configuración del Entorno

El servidor se ejecuta por defecto en http://localhost:3004.
Asegúrate de configurar las variables de entorno correctamente para conectar con MongoDB y PayPal.

📁 Estructura del Proyecto

heranika/
├── public/             # Archivos estáticos
├── routes/             # Rutas de Express
├── controllers/        # Lógica de negocio
├── models/             # Modelos de MongoDB
├── views/              # Plantillas HTML o EJS
├── .env                # Variables de entorno
├── app.js              # Archivo principal de la aplicación
└── package.json        # Dependencias y scripts

🧪 Pruebas

Se han realizado los siguientes tipos de pruebas:
	•	Pruebas funcionales: para comprobar que las rutas, formularios y procesos funcionan como se espera.
	•	Pruebas de integración: para verificar la correcta interacción entre módulos (por ejemplo, reservas y pagos).
	•	Pruebas de usabilidad: navegación simple y entendible para cualquier usuario.
	•	Pruebas de rendimiento: testeo con múltiples usuarios simultáneos simulados.
	•	Pruebas de seguridad: validación de formularios, uso de sesiones seguras y protección frente a ataques comunes (XSS, CSRF).

📦 Despliegue

	1.	El proyecto puede desplegarse en plataformas como:
	•	Render
	2.	Documentación de despliegue:
	•	Instalar dependencias
	•	Configurar variables de entorno en el dashboard de la plataforma
	•	Subir mediante Git o conectar repositorio directamente

👤 Autor

Desarrollado por: Daniel Herrera Romera
Estudiante de segundo año del ciclo Desarrollo de Aplicaciones Web (DAW).
Correo de contacto: Dani05cartagena@gmail.com
