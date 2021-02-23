import express from 'express';

const app = express();

app.get("/users", (req, res) => {
    return res.json({
        message: "Hello world"
    });
});

app.post("/", (req, res) => {
    return res.json({
        message: "Teste ok!"
    });
});

app.listen( 3333, () => console.log("Server is runnig on port 3333"));