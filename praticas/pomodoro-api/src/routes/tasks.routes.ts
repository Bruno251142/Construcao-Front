import { Router } from 'express'
import { prisma } from '../lib/prisma'

export const tasksRouter = Router()

const serializeTask = (task: any) => ({
  ...task,
  startDate: task.startDate.toString(),
  completeDate: task.completeDate?.toString() ?? null,
  interruptDate: task.interruptDate?.toString() ?? null,
})

tasksRouter.get('/', async (_req, res) => {
  const tasks = await prisma.task.findMany({ orderBy: { startDate: 'desc' } })
  res.json(tasks.map(serializeTask))
})

tasksRouter.post('/', async (req, res) => {
  const { id, name, duration, type, startDate } = req.body
  const task = await prisma.task.create({
    data: { id: String(id), name, duration, type, startDate: BigInt(startDate) },
  })
  res.status(201).json(serializeTask(task))
})

tasksRouter.patch('/:id/complete', async (req, res) => {
  const { completeDate } = req.body
  const task = await prisma.task.update({
    where: { id: req.params.id },
    data: { completeDate: BigInt(completeDate) },
  })
  res.json(serializeTask(task))
})

tasksRouter.patch('/:id/interrupt', async (req, res) => {
  const { interruptDate } = req.body
  const task = await prisma.task.update({
    where: { id: req.params.id },
    data: { interruptDate: BigInt(interruptDate) },
  })
  res.json(serializeTask(task))
})

tasksRouter.delete('/', async (_req, res) => {
  await prisma.task.deleteMany()
  res.status(204).send()
})