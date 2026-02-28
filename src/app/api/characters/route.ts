import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import Character from '@/models/Character'
import { apiResponse, handleApiError } from '@/lib/utils'

export async function GET(_req: NextRequest) {
  try {
    await connectDB()
    const characters = await Character.find({ isActive: true }).sort({ createdAt: 1 }).lean()
    return apiResponse(characters)
  } catch (error) {
    return handleApiError(error)
  }
}
