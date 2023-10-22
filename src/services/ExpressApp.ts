import express, { Application } from 'express';
import morgan from "morgan"
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from "cors";
import path from "path";
import { AdminRoute, VendorRoute, ShoppingRoute, CustomerRoute } from "../routes"


export default async (app: Application) => {

    app.use(express.json({
        limit: '10mb'
    }));
    app.use(cookieParser());
    app.use(express.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use('/images', express.static(path.join(__dirname, 'images')));
    app.use(morgan("dev"));
    app.use(cors({ origin: '*' }));

    app.use("/admin", AdminRoute);
    app.use("/vendor", VendorRoute);
    app.use("/customer", CustomerRoute);
    app.use(ShoppingRoute);

    return app;
}






