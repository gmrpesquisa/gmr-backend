import { FastifyInstance } from "fastify"
import { z } from "zod"
import { prisma } from "../../lib/prisma"

export async function login(app: FastifyInstance) {
  app.post("/login", async (request, reply) => {
    const loginBody = z.object({
      username: z.string(),
      password: z.string(),
    })

    const { username, password } = loginBody.parse(request.body)

    const user = await prisma.user.findUnique({
      where: {
        username: username,
        password: password,
      },
    })

    if (!user) {
      return reply.status(401).send({ message: "Credenciais inválidas!" })
    }

    const token = app.jwt.sign(
      {
        username: user.username,
        type: user.type,
      },
      {
        sub: user.id,
        expiresIn: "30d",
      }
    )

    if (request.cookies.token) {
      reply.clearCookie("token")
    }

    reply.setCookie("token", token, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
      secure: true,
      sameSite: true,
    })

    return reply.status(200).send({
      message: "Login realizado com sucesso!",
      code: "AUTHORIZED",
      user: {
        id: user.id,
        username: user.username,
        type: user.type,
      },
    })
  })
}
