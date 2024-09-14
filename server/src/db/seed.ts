import { client, db } from '.'
import { goalCompletions, goals } from './schema'
import dayjs from 'dayjs'

async function seed() {
  await db.delete(goalCompletions)
  await db.delete(goals)

  const row = await db
    .insert(goals)
    .values([
      {
        title: 'Acordar cedo!',
        desiredWeeklyFrequency: 5,
      },
      {
        title: 'Fazer musculação',
        desiredWeeklyFrequency: 6,
      },
      {
        title: 'Meditar',
        desiredWeeklyFrequency: 1,
      },
    ])
    .returning()

  const startOfWeek = dayjs().startOf('week')

  await db.insert(goalCompletions).values([
    {
      goalId: row[0].id,
      createdAt: startOfWeek.toDate(),
    },
    {
      goalId: row[1].id,
      createdAt: startOfWeek.add(1, 'day').toDate(),
    },
  ])
}

seed().finally(() => {
  client.end()
})
