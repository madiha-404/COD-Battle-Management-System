import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { requireAdmin } from '@/lib/auth'
import { apiResponse, handleApiError } from '@/lib/utils'

export async function GET(req: NextRequest) {
  try {
    requireAdmin(req)
    await connectDB()
    const users = await User.find({}).sort({ createdAt: -1 }).lean()
    return apiResponse(users)
  } catch (error) {
    return handleApiError(error)
  }
}
