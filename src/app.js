import express from "express";
import morgan from "morgan";
import authRoutes from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import taskRoutes from './routes/task.routes.js';
import cors from 'cors';

const App = express();

console.log('Iniciando servidor...');

// Configuración de CORS
const corsOptions = {
  origin: '*', // Permite todas las origenes para pruebas
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

App.use(cors(corsOptions));
console.log('CORS configurado');

// Middleware para logging detallado
App.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

App.use(morgan('dev'));
App.use(express.json());
App.use(cookieParser());

// Ruta de prueba
App.get('/api/test', (req, res) => {
  console.log('Ruta de prueba accedida');
  res.json({ message: 'API funcionando correctamente' });
});

App.use("/api", authRoutes);
App.use("/api", taskRoutes);

// Middleware para manejar errores
App.use((err, req, res, next) => {
  console.error('Error en el servidor:', err);
  res.status(500).json({ error: 'Error interno del servidor', details: err.message, stack: err.stack });
});

console.log('Servidor configurado y listo para escuchar');

export default App;