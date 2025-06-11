import express from "express";
import sequelize from "./config/database.ts";
import "./cart/models/Cart.ts";
import "./cart/models/Product.ts"
import router from "./cart/router.ts";

const app = express();

app.use(express.json({ limit: '100kb' }));

app.use('/order', router);
app.get('/', (req, res) => {
    res.send('Hello World from Order Service');
});

sequelize.sync({ alter: true })
    .then(() => {
        app.listen(3033, () => {
            console.log('Server is running on port 3033');
        });
    })
    .catch((error) => {
        console.error("Failed to initialize Sequelize:", error);
    });