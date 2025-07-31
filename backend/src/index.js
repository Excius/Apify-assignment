import express from "express";
import cors from "cors";
import actorRoutes from "./routes/actorRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import {
  apiVerify,
  globalErrorHandler,
  requestLogger,
} from "./middleware/index.js";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cors());
app.use(requestLogger);

app.use("/api/auth", authRoutes);
app.use("/api", apiVerify, actorRoutes);

app.use(globalErrorHandler);

app.all("/{*splat}", (req, res) => {
  res.status(404).json({ error: "Not Found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
