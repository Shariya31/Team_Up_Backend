import express from 'express'
const PORT = 2300;
const app = express();

app.get('/', (req, res)=>{
    res.send("hello")
})


app.listen(PORT, ()=>{
    console.log(`App is running on http://localhost:${PORT}`)
})