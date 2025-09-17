import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import router from './routes/server.js';
import dotenv from 'dotenv';
import path from "path";

dotenv.config({ override: true });

const app = express();
const PORT = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = NODE_ENV === 'production';
const isDevelopment = NODE_ENV === 'development';
const isTest = NODE_ENV === 'test';


app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));


const allowedOrigins = [
  "https://minismartai.com",   
  "https://www.minismartai.com" 
];


const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); 

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};


app.use(cors(corsOptions));


if (isProduction) {
  app.use(
    helmet({
      contentSecurityPolicy: false, 
    })
  );
}


if (isDevelopment) {
  app.use(morgan('dev'));
}
if (isTest) {
  app.use(morgan('tiny'));
}


app.use('/api', router);


app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});


app.listen(PORT, () => {
  console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
});
