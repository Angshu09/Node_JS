const express = require('express')
const fs = require('fs') 
const status = require('express-status-monitor')
const zlib = require('zlib')

const app = express()
app.use(status)
const PORT = 9000

fs.createReadStream("./random_learning_text.txt").pipe(zlib.createGzip().pipe(fs.createWriteStream("./random_learning_text.zip")))

app.get("/", (req, res) => {
    // fs.readFile("./random_learning_text.txt", (err, data) => {
    //     res.end(data)
    // })

    const stream = fs.createReadStream("./random_learning_text.txt", "utf-8")
    stream.on("data", (chunk) => res.write(chunk))
    stream.on("end", () => res.end())
})

app.listen(PORT, () => console.log("SERVER STARTED ON PORT 9000"))