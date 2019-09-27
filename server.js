const app = require('./moviedex-api')

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server listening at PORT ${PORT}`)
})