import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'
import prisma from '../lib/prisma'
import * as offerService from '../services/offerService'

describe('Offer Service', () => {
  beforeAll(async () => {
    // Setup test database if needed
  })

  afterAll(async () => {
    // Cleanup
    await prisma.$disconnect()
  })

  describe('getAllOffers', () => {
    it('should return an array of offers', async () => {
      const offers = await offerService.getAllOffers()
      expect(Array.isArray(offers)).toBe(true)
    })
  })

  describe('getOfferById', () => {
    it('should throw error for non-existent offer', async () => {
      await expect(
        offerService.getOfferById('non-existent-id')
      ).rejects.toThrow('Offer not found')
    })
  })
})

