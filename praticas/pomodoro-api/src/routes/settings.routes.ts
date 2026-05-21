import { Router } from 'express'
import { prisma } from '../lib/prisma'

export const settingsRouter = Router()

settingsRouter.get('/', async (_req, res) => {
  let settings = await prisma.settings.findFirst()
  if (!settings) {
    settings = await prisma.settings.create({ data: {} })
  }
  res.json(settings)
})

settingsRouter.put('/', async (req, res) => {
  const { workTime, shortBreakTime, longBreakTime } = req.body

  if (
    !Number.isInteger(workTime) ||
    !Number.isInteger(shortBreakTime) ||
    !Number.isInteger(longBreakTime)
  ) {
    return res.status(400).json({ error: 'Valores devem ser inteiros.' })
  }

  let settings = await prisma.settings.findFirst()
  if (!settings) {
    settings = await prisma.settings.create({ data: { workTime, shortBreakTime, longBreakTime } })
  } else {
    settings = await prisma.settings.update({
      where: { id: settings.id },
      data: { workTime, shortBreakTime, longBreakTime },
    })
  }
  res.json(settings)
})