
const express = require("express")
// import express from "express"
// const path = require("path")

const app = express()

app.use(express.static("public"))

app.listen(8080, () => {
  console.log(`app deployed on http://localhost:${8080}/index.html`)
})


