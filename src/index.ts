// src/index.ts
import express from 'express'
import cors from 'cors'

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('🛒 API de ventas funcionando!')
})

app.listen(port, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${port}`)
})
