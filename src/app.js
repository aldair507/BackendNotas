import express from "express";
import morgan from "morgan";
import authRoutes from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import taskRoutes from './routes/task.routes.js';
import cors from 'cors';

const App = express();

// Configuración de CORS
const corsOptions = {
  origin: ['http://localhost:5173', 'https://tu-frontend-url.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
};

App.use(cors(corsOptions));

// Middleware para manejar preflight requests
App.options('*', cors(corsOptions));

App.use(morgan('dev'));
App.use(express.json());
App.use(cookieParser());

// Middleware para logging de solicitudes
App.use((req, res, next) => {
  console.log(`Recibida solicitud ${req.method} en ${req.url}`);
  next();
});

App.use("/api", authRoutes);
App.use("/api", taskRoutes);

// Ruta de prueba
App.get('/api/test', (req, res) => {
  res.json({ message: 'API funcionando correctamente' });
});

// Middleware para manejar errores
App.use((err, req, res, next) => {
  console.error('Error en el servidor:', err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

export default App;