import * as express from "express";
import * as bodyParser from "body-parser";
import { Routes } from "./routes/movie";
import * as mongoose from "mongoose";

const mongoHost = process.env.MONGO_DB_HOST

class App {

    public app: express.Application;
    public routePrv: Routes = new Routes();
    public mongoUrl: string = `mongodb://${mongoHost}/movie-favs`;
    //public mongoUrl: string = `mongodb://${mongoUser}:${mongoPass}@${mongoHost}:27017/movie-favs`;

    constructor() {
      this.app = express();
      this.config();        
      this.routePrv.routes(this.app);     
      this.mongoSetup();
    }

    private config(): void{
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        // serving static files 
        this.app.use(express.static('src/public'));
    }

    private mongoSetup(): void{
        mongoose.Promise = global.Promise;
        mongoose.connect(this.mongoUrl);        
    }

}

export default new App().app;