import { FastifyInstance } from "fastify"
import { prisma } from "../../lib/prisma"

export async function getUser(app: FastifyInstance) {
  app.get("/user", async (request, reply) => {
    const { token } = request.cookies
    console.log(token)
    console.log(request.cookies)

    if (!token) {
      return reply.status(401).send({ message: "Token inválido" })
    }

    const decryptedToken: any = app.jwt.verify(token)

    if (!decryptedToken) {
      return reply.status(401).send({ message: "Token Inválido" })
    }

    const user = await prisma.user.findUnique({
      where: {
        id: decryptedToken.sub,
      },
    })

    if (!user) {
      return reply.status(401).send({ message: "O usuário não existe" })
    }

    return reply.status(200).send(user)
  })
}
