import { FastifyInstance } from "fastify"
import { z } from "zod"
import { prisma } from "../../lib/prisma"

export async function register(app: FastifyInstance) {
  app.post("/register", async (request, reply) => {
    const registerBody = z.object({
      username: z.string(),
      password: z.string(),
      type: z.enum(["ADMINISTRADOR", "PESQUISADOR", "COORDENADOR"]),
      email: z.optional(z.string()),
    })

    const { username, password, type, email } = registerBody.parse(request.body)

    const user = await prisma.user
      .create({
        data: {
          username,
          password,
          type,
          email,
        },
      })
      .catch((err) => {
        console.log("error", err)
      })

    if (!user) {
      return reply.status(409).send({ message: "O usuário já existe!" })
    }

    return reply.status(201).send({
      message: "Usuário criado com sucesso",
      user: {
        id: user.id,
        username: user.username,
        type: user.type,
        email: user.email,
      },
    })
  })
}
