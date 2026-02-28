import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import Weapon from '@/models/Weapon'
import { apiResponse, apiError, handleApiError } from '@/lib/utils'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const tier = searchParams.get('tier')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    const query: Record<string, unknown> = { isActive: true }
    if (category && category !== 'all') query.category = category
    if (tier && tier !== 'all') query.tier = tier
    if (search) query.$text = { $search: search }

    const total = await Weapon.countDocuments(query)
    const weapons = await Weapon.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()

    return apiResponse({
      weapons,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}
