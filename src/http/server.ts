import fastify from "fastify"
import { login } from "./routes/login"
import { register } from "./routes/register"
import fastifyJWT from "@fastify/jwt"
import fastifyCookie from "@fastify/cookie"
import fastifyCors from "@fastify/cors"
import { deleteUser } from "./routes/delete-user"

const app = fastify()

app.register(fastifyCors, {
  origin: true,
  credentials: true,
})
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
app.register(deleteUser)

app.listen({ port: 3333 }).then(() => {
  console.log("HTTP Server is running!")
})
