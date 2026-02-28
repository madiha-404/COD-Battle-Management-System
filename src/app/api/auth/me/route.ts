import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { getAuthUser } from '@/lib/auth'
import { apiResponse, apiError, handleApiError } from '@/lib/utils'

export async function GET(req: NextRequest) {
  try {
    const payload = getAuthUser(req)
    if (!payload) return apiError('Unauthorized', 401)

    await connectDB()
    const user = await User.findById(payload.userId).populate('loadouts.weapons')
    if (!user) return apiError('User not found', 404)

    return apiResponse(user)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const payload = getAuthUser(req)
    if (!payload) return apiError('Unauthorized', 401)

    await connectDB()
    const body = await req.json()
    const { selectedCharacter } = body

    const user = await User.findByIdAndUpdate(
      payload.userId,
      { selectedCharacter },
      { new: true }
    )
    if (!user) return apiError('User not found', 404)

    return apiResponse(user)
  } catch (error) {
    return handleApiError(error)
  }
}
