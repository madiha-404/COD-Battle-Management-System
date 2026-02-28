import { NextRequest } from 'next/server'
import dbConnect from '@/lib/db'
import User from '@/models/User'
import Weapon from '@/models/Weapon'
import Character from '@/models/Character'
import { requireAdmin } from '@/lib/auth'
import { successResponse, serverErrorResponse } from '@/lib/api-helpers'

export async function GET(req: NextRequest) {
  try {
    requireAdmin(req)
    await dbConnect()

    const [totalUsers, totalWeapons, totalCharacters, recentUsers] = await Promise.all([
      User.countDocuments(),
      Weapon.countDocuments({ isActive: true }),
      Character.countDocuments({ isActive: true }),
      User.find().sort({ createdAt: -1 }).limit(5).select('username email role createdAt'),
    ])

    return successResponse({
      stats: {
        totalUsers,
        totalWeapons,
        totalCharacters,
        activeAdmins: await User.countDocuments({ role: 'admin' }),
      },
      recentUsers,
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error'
    if (msg === 'UNAUTHORIZED') return successResponse({ error: 'Unauthorized' }, 401)
    if (msg === 'FORBIDDEN') return successResponse({ error: 'Forbidden' }, 403)
    console.error('[ADMIN STATS]', error)
    return serverErrorResponse()
  }
}
