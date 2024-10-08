import express from "express";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import taskRoutes from "./routes/task.routes.js";
import cors from "cors";

const App = express();

// Configuración de CORS
const corsOptions = {
  origin: "http://localhost:5173", // Permite todas las origenes para pruebas
  credentials: true,
};

App.use(cors(corsOptions));
console.log("CORS configurado");

App.use(morgan("dev"));
App.use(express.json());
App.use(cookieParser());

App.use("/api", authRoutes);
App.use("/api", taskRoutes);

export default App;
