import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { authMiddleware } from '../middlewares/auth.middleware'

export const settingsRouter = Router()

settingsRouter.use(authMiddleware)

settingsRouter.get('/', async (req, res) => {
  let settings = await prisma.settings.findFirst({
    where: {
      userId: req.userId,
    },
  })

  if (!settings) {
    settings = await prisma.settings.create({
      data: {
        user: {
          connect: {
            id: req.userId,
          },
        },
      },
    })
  }

  res.json(settings)
})

settingsRouter.put('/', async (req, res) => {
  const {
    workTime,
    shortBreakTime,
    longBreakTime,
  } = req.body

  if (
    !Number.isInteger(workTime) ||
    !Number.isInteger(shortBreakTime) ||
    !Number.isInteger(longBreakTime)
  ) {
    return res.status(400).json({
      error: 'Valores devem ser inteiros.',
    })
  }

  let settings = await prisma.settings.findFirst({
    where: {
      userId: req.userId,
    },
  })

  if (!settings) {
    settings = await prisma.settings.create({
      data: {
        workTime,
        shortBreakTime,
        longBreakTime,

        user: {
          connect: {
            id: req.userId,
          },
        },
      },
    })
  } else {
    settings = await prisma.settings.update({
      where: {
        id: settings.id,
      },
      data: {
        workTime,
        shortBreakTime,
        longBreakTime,
      },
    })
  }

  res.json(settings)
})