import fastify from "fastify"
import { login } from "./routes/login"
import { register } from "./routes/register"
import fastifyJWT from "@fastify/jwt"
import fastifyCookie from "@fastify/cookie"

const app = fastify()

app.register(fastifyJWT, {
  secret: process.env.SECRET || "secret",
})
app.register(fastifyCookie, {
  secret: process.env.SECRET || "secret",
  hook: "onRequest",
})

app.get("/", (request, reply) => {
  reply.send({ message: "Servidor rodando!" })
})

app.register(login)
app.register(register)

app.listen({ port: 3333 }).then(() => {
  console.log("HTTP Server is running!")
})
