import * as express from "express";
import * as bodyParser from "body-parser";
import { Routes } from "./movies/moviesRoutes";
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
      mongoose.set('useFindAndModify', false)
      mongoose.connect(this.mongoUrl, { useNewUrlParser: true });
    }

}

export default new App().app;