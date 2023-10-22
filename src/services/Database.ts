
import mongoose, { ConnectOptions } from "mongoose";
import { MONGO_URL } from "../config"

export default async () => {
    try {
        mongoose.connect(MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as ConnectOptions);

        mongoose.connection.on("connected", () => {
            console.log("Connected to MongoDB");
        });

        mongoose.connection.on("error", (err) => {
            console.log("Error connecting to MongoDB", err);
        });
    } catch (err) {
        console.log("Error connecting to MongoDB", err);
    }
}




