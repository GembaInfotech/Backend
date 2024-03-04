import  express  from 'express';
import {connect} from './db.js'
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { vendorRoute } from './routes/vendorRoute.js';
import { vehicleRoute } from './routes/vehicleRoute.js';
import { parkingRoute } from './routes/parkingRoute.js';
import { guardRoute } from './routes/guardRoute.js';
import { bookingRoute } from './routes/bookingRoute.js';
import { userRoute } from './routes/userRoute.js';
import { queriesRoute } from './routes/queryRoute.js';
const app = express();
const port = process.env.PORT 
// const corsOptions = {
//   origin: 'https://parkeme.netlify.app',
// };
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser());
app.use(morgan("dev"));

connect();
app.use("/v1/api/vehicle", vehicleRoute);
app.use("/v1/api/vendor",vendorRoute);
app.use('/v1/api/parking', parkingRoute);
app.use('/v1/api/guard', guardRoute);
app.use('/v1/api/booking', bookingRoute);
app.use('/v1/api/user', userRoute );
app.use('/v1/api/queries', queriesRoute);
// app.use(notFound);
// app.use(errorHandler);
app.listen( port , () => {
  console.log(`Server is running on http://localhost:${port}`);
});
