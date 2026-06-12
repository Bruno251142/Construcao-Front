const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:3333'

function getAuthHeaders() {
  const token =
    sessionStorage.getItem('token')

  return {
    'Content-Type': 'application/json',

    Authorization: `Bearer ${token}`,
  }
}

// SETTINGS
export async function getSettings() {
  const res = await fetch(
    `${API_URL}/settings`,
    {
      headers: getAuthHeaders(),
    },
  )

  return res.json()
}

export async function updateSettings(data: {
  workTime: number
  shortBreakTime: number
  longBreakTime: number
}) {
  const res = await fetch(
    `${API_URL}/settings`,
    {
      method: 'PUT',

      headers: getAuthHeaders(),

      body: JSON.stringify(data),
    },
  )

  return res.json()
}

// TASKS
export async function getTasks() {
  const res = await fetch(
    `${API_URL}/tasks`,
    {
      headers: getAuthHeaders(),
    },
  )

  return res.json()
}

export async function createTask(data: {
  id: string
  name: string
  duration: number
  type: string
  startDate: number
}) {
  const res = await fetch(
    `${API_URL}/tasks`,
    {
      method: 'POST',

      headers: getAuthHeaders(),

      body: JSON.stringify(data),
    },
  )

  return res.json()
}

export async function completeTask(
  id: string,
  completeDate: number,
) {
  const res = await fetch(
    `${API_URL}/tasks/${id}/complete`,
    {
      method: 'PATCH',

      headers: getAuthHeaders(),

      body: JSON.stringify({
        completeDate,
      }),
    },
  )

  return res.json()
}

export async function interruptTask(
  id: string,
  interruptDate: number,
) {
  const res = await fetch(
    `${API_URL}/tasks/${id}/interrupt`,
    {
      method: 'PATCH',

      headers: getAuthHeaders(),

      body: JSON.stringify({
        interruptDate,
      }),
    },
  )

  return res.json()
}

export async function clearTasks() {
  await fetch(`${API_URL}/tasks`, {
    method: 'DELETE',

    headers: getAuthHeaders(),
  })
}