import  express  from "express";
import morgan from "morgan";
import authRoutes from './routes/auth.routes.js';
import  cookieParser from 'cookie-parser';
import taskRoutes from './routes/task.routes.js';
import cors from 'cors';


const App = express();
App.use(cors({
    origin: ['http://localhost:5173', 'https://backend-notas.vercel.app'], // Acepta peticiones desde localhost y el dominio de Vercel
    credentials: true,
  }));
App.use(morgan('dev'));
App.use(express.json());
App.use(cookieParser());

App.use("/api",authRoutes);
App.use("/api",taskRoutes);

export default App;