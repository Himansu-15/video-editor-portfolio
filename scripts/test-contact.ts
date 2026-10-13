import mongoose from 'mongoose'
import { Inquiry } from '../src/models/Inquiry'
import fs from 'node:fs'

// Load environment variables from .env
if (fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf-8')
  envContent.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return
    const match = trimmed.match(/^([^=]+)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      const val = match[2].trim().replace(/^['"]|['"]$/g, '')
      if (!process.env[key]) process.env[key] = val
    }
  })
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/abhijeet'
const API_URL = 'http://localhost:3000/api/contact'

async function runTests() {
  console.log('=== STARTING CONTACT BACKEND VERIFICATION TESTS ===\n')

  await mongoose.connect(MONGODB_URI)
  console.log('Connected to MongoDB successfully.\n')

  // --- TEST 1: Valid Form Submission ---
  console.log('----------------------------------------------------')
  console.log('TEST 1: Submitting Valid Form Data')
  const validPayload = {
    name: 'Sarah Chen',
    email: 'sarah.chen@wanderlust.co',
    projectType: 'Commercial / Travel',
    budgetRange: '$3,000 - $5,000',
    message: 'We have 4K raw drone footage from our Iceland expedition needing narrative pacing and atmospheric color grading.',
  }

  const res1 = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '192.168.1.101' },
    body: JSON.stringify(validPayload),
  })

  const json1 = await res1.json()
  console.log(`Status Code: ${res1.status} (Expected: 201)`)
  console.log('Response Payload:', json1)

  // Verify in MongoDB
  const inquiryId = json1.data?.inquiryId
  const dbRecord1 = await Inquiry.findById(inquiryId)
  if (dbRecord1) {
    console.log(`[PASS] MongoDB Verification: Found inquiry "${dbRecord1.name}" (${dbRecord1._id})`)
    console.log(`       Email Status: ${dbRecord1.emailStatus} (Skipped due to dummy RESEND_API_KEY)`)
  } else {
    console.error('[FAIL] MongoDB Verification: Record not found!')
  }

  // --- TEST 2: Invalid Input Validation ---
  console.log('\n----------------------------------------------------')
  console.log('TEST 2: Testing Invalid Input (Invalid email, short message, empty name)')
  const invalidPayload = {
    name: 'A', // min 2
    email: 'not-an-email',
    projectType: '',
    budgetRange: '',
    message: 'Short', // min 10
  }

  const res2 = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '192.168.1.102' },
    body: JSON.stringify(invalidPayload),
  })

  const json2 = await res2.json()
  console.log(`Status Code: ${res2.status} (Expected: 422 Unprocessable Entity)`)
  console.log('Validation Errors:', json2.details)
  if (res2.status === 422 && Array.isArray(json2.details)) {
    console.log(`[PASS] Zod validation caught ${json2.details.length} field errors on server.`)
  }

  // --- TEST 3: Honeypot Anti-Spam Check ---
  console.log('\n----------------------------------------------------')
  console.log('TEST 3: Testing Honeypot Spam Protection (Bot fills honeypot field)')
  const honeypotPayload = {
    name: 'Spam Bot 3000',
    email: 'spammer@botnet.xyz',
    projectType: 'Commercial / Travel',
    budgetRange: '$5,000+',
    message: 'Buy cheap watches and crypto at our website immediately!',
    honeypot: 'https://spam-link-injected-by-bot.com', // Honeypot populated!
  }

  const beforeSpamCount = await Inquiry.countDocuments({ email: 'spammer@botnet.xyz' })

  const res3 = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '192.168.1.103' },
    body: JSON.stringify(honeypotPayload),
  })

  const json3 = await res3.json()
  console.log(`Status Code: ${res3.status} (Expected: 400 Bad Request)`)
  console.log('Response Payload:', json3)

  const afterSpamCount = await Inquiry.countDocuments({ email: 'spammer@botnet.xyz' })
  if (res3.status === 400 && afterSpamCount === beforeSpamCount) {
    console.log('[PASS] Honeypot blocked submission. Zero records saved to MongoDB!')
  }

  // --- TEST 4: Rapid Repeated Submissions (Rate Limiting) ---
  console.log('\n----------------------------------------------------')
  console.log('TEST 4: Testing Rate Limiting (6 rapid requests from IP 192.168.1.104)')
  const rapidIp = '192.168.1.104'
  let rateLimitHit = false
  let rateLimitStatus = 0

  for (let i = 1; i <= 6; i++) {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-forwarded-for': rapidIp },
      body: JSON.stringify({
        name: `Rapid User ${i}`,
        email: `rapid${i}@example.com`,
        projectType: 'Narrative Film',
        budgetRange: '$1,000 - $3,000',
        message: `Rapid testing submission message payload number ${i}`,
      }),
    })

    console.log(`  Request #${i}: HTTP ${res.status}`)
    if (res.status === 429) {
      rateLimitHit = true
      rateLimitStatus = res.status
      const json = await res.json()
      console.log('  Rate Limit Response:', json)
    }
  }

  if (rateLimitHit && rateLimitStatus === 429) {
    console.log('[PASS] Rate limiter triggered HTTP 429 Too Many Requests after threshold reached!')
  }

  // --- TEST 5: Simulated Email Failure ---
  console.log('\n----------------------------------------------------')
  console.log('TEST 5: Testing Simulated Email Failure')
  const emailFailPayload = {
    name: 'Marcus Webb (Simulated Fail)',
    email: 'marcus@directors-guild.example',
    projectType: 'Color Grading',
    budgetRange: '$3,000 - $5,000',
    message: 'Testing simulated email failure handling where inquiry persists but status is failed.',
    simulateEmailFailure: true,
  }

  const res5 = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '192.168.1.105' },
    body: JSON.stringify(emailFailPayload),
  })

  const json5 = await res5.json()
  console.log(`Status Code: ${res5.status} (Expected: 201)`)
  console.log('Response Payload:', json5)

  const dbRecord5 = await Inquiry.findById(json5.data?.inquiryId)
  if (dbRecord5 && dbRecord5.emailStatus === 'failed') {
    console.log(`[PASS] MongoDB Record: ID ${dbRecord5._id}`)
    console.log(`       Email Status: ${dbRecord5.emailStatus}`)
    console.log(`       Email Error: "${dbRecord5.emailError}"`)
    console.log('[PASS] Simulated email failure handled gracefully: Inquiry preserved in DB with failed status.')
  }

  console.log('\n====================================================')
  console.log('ALL 5 BACKEND VERIFICATION TESTS COMPLETED.')
  console.log('====================================================\n')

  await mongoose.disconnect()
}

runTests().catch((err) => {
  console.error('Test execution error:', err)
  process.exit(1)
})
