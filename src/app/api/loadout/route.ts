import { NextRequest } from 'next/server'
import { z } from 'zod'
import dbConnect from '@/lib/db'
import User from '@/models/User'
import Weapon from '@/models/Weapon'
import Character from '@/models/Character'
import { getAuthUser } from '@/lib/auth'
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  notFoundResponse,
  serverErrorResponse,
} from '@/lib/api-helpers'

const loadoutSchema = z.object({
  action: z.enum(['add-weapon', 'remove-weapon', 'set-character']),
  weaponId: z.string().optional(),
  characterId: z.string().optional(),
})

export async function GET(req: NextRequest) {
  try {
    const payload = getAuthUser(req)
    if (!payload) return unauthorizedResponse()
    await dbConnect()
    const user = await User.findById(payload.userId).populate('loadout').populate('selectedCharacter')
    if (!user) return notFoundResponse('User not found')
    return successResponse({ loadout: user.loadout || [], selectedCharacter: user.selectedCharacter || null })
  } catch (error) {
    console.error('[LOADOUT GET]', error)
    return serverErrorResponse()
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = getAuthUser(req)
    if (!payload) return unauthorizedResponse()
    await dbConnect()
    const body = await req.json()
    const parsed = loadoutSchema.safeParse(body)
    if (!parsed.success) return errorResponse(parsed.error.errors[0].message, 422)

    const { action, weaponId, characterId } = parsed.data
    const user = await User.findById(payload.userId)
    if (!user) return notFoundResponse('User not found')

    if (action === 'add-weapon') {
      if (!weaponId) return errorResponse('weaponId required', 400)
      const weapon = await Weapon.findById(weaponId)
      if (!weapon) return notFoundResponse('Weapon not found')
      if (!user.loadout) user.loadout = []
      if (user.loadout.length >= 5) return errorResponse('Max 5 weapons in loadout', 400)
      if (!user.loadout.includes(weaponId)) user.loadout.push(weaponId)
      await user.save()
      return successResponse({ loadout: user.loadout })
    }

    if (action === 'remove-weapon') {
      if (!weaponId) return errorResponse('weaponId required', 400)
      user.loadout = (user.loadout || []).filter((id: string) => id.toString() !== weaponId)
      await user.save()
      return successResponse({ loadout: user.loadout })
    }

    if (action === 'set-character') {
      if (!characterId) return errorResponse('characterId required', 400)
      const character = await Character.findById(characterId)
      if (!character) return notFoundResponse('Character not found')
      user.selectedCharacter = characterId
      await user.save()
      const updated = await User.findById(payload.userId).populate('selectedCharacter')
      return successResponse({ selectedCharacter: updated?.selectedCharacter })
    }

    return errorResponse('Invalid action', 400)
  } catch (error) {
    console.error('[LOADOUT POST]', error)
    return serverErrorResponse()
  }
}
