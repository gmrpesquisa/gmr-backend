import { FastifyInstance } from "fastify"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
// import { prisma } from "../../lib/prisma"

export async function deleteUser(app: FastifyInstance) {
  app.delete("/delete/:id", async (request, reply) => {
    const { token } = request.cookies

    if (!token) {
      return reply.status(401).send({ message: "Token inválido" })
    }

    const decryptedToken: any = app.jwt.verify(token)

    if (!decryptedToken) {
      return reply.status(401).send({ message: "Token Inválido" })
    }

    if (decryptedToken?.type !== "ADMINISTRADOR") {
      return reply
        .status(401)
        .send({ message: "Você não tem permissão para deletar usuários." })
    }

    const deleteParams = z.object({
      id: z.string().uuid(),
    })

    const { id } = deleteParams.parse(request.params)

    const user = await prisma.user
      .delete({
        where: {
          id,
        },
      })
      .catch((err: any) => {
        return reply.status(401).send({ message: "Credenciais inválidas!" })
      })

    return reply.status(200).send({ message: "Usuário deleteado com sucesso!" })
  })
}
