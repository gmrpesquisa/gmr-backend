import fastify from "fastify"
import { login } from "./routes/Auth/login"
import { register } from "./User/register"
import fastifyJWT from "@fastify/jwt"
import fastifyCookie from "@fastify/cookie"
import fastifyCors from "@fastify/cors"
import { deleteUser } from "./User/delete-user"
import env from "../../env"
import { getUser } from "./User/get-user"

const app = fastify()

app.register(fastifyCors, {
  origin: true,
  credentials: true,
})
app.register(fastifyJWT, {
  secret: env.SECRET,
})
app.register(fastifyCookie, {
  secret: env.SECRET,
  hook: "onRequest",
})

app.get("/", (request, reply) => {
  reply.send({ message: "Servidor rodando!" })
})

app.register(login)
app.register(register)
app.register(deleteUser)
app.register(getUser)

app.listen({ port: env.PORT, host: "0.0.0.0" }).then(() => {
  console.log("HTTP Server is running!")
})
