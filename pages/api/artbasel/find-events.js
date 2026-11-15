import { getLoginSession } from '../../../lib/cookie-auth'
import { table } from '../utils/userTable'

const PRODUCT_ID = 'artbasel-2026'

const EVENT_DATA = {
  parties: [
    { date: 'Tue Dec 1, 4:30–6pm', what: 'The Ocean Odyssey by Subodh Kerkar with REEFLINE: beach performance with Miami City Ballet dancers and 50+ community performers', where: 'Andaz beachfront, 4041 Collins Ave', access: 'Free, public' },
    { date: 'Tue–Fri Dec 1–4, 10pm–midnight', what: 'Capital One Venture X Sound Sessions: intimate sets from emerging and established artists', where: 'Pauline Bar, The Shelborne By Proper', access: 'Hotel guests' },
    { date: 'Thu Dec 3, 11:30pm–2:30am', what: 'Capital One x BÉIS after-hours: theatrical performances, Shay Mitchell, live music and the Midnight Blue luggage reveal', where: 'The Shelborne By Proper', access: 'Capital One cardholders; tickets on Capital One Entertainment' },
  ],
  artHappenings: [
    { dates: 'Opens Nov 19', what: 'Sheroanawe Hakihiiwe, ICA Miami x Fondation Cartier: first U.S. museum solo, 100+ works', where: 'ICA Miami, 61 NE 41st St', entry: 'Check ICA admission' },
    { dates: 'Nov 29 – Feb 15', what: 'Basquiat: Hidden World: three never-before-seen paintings with hidden layers revealed under UV light', where: 'ICA Miami Expansion Space, 23 NE 41st St', entry: 'Check' },
    { dates: 'Nov 30 – Dec 6', what: 'Yanira Collado, Converging Timelines (No Vacancy)', where: 'Lobby Gallery, The Shelborne By Proper', entry: 'Free' },
    { dates: 'Dec 1–6', what: 'SCOPE Miami Beach', where: 'SCOPE Art Deco Center, 1001 Ocean Dr', entry: 'Ticketed; 2026 hours and prices TBA' },
    { dates: 'Dec 1–6', what: 'Andrés Reisinger, Do You Dream In Color?: draped install and digital works', where: 'Andaz Miami Beach, 4041 Collins Ave', entry: 'Free, public' },
    { dates: 'Dec 1–3', what: 'Hårklinikken pop-up: one-on-one hair and scalp consults with a custom Hair Gain Extract', where: 'Rodrigo Ivory Salon, 1749 NE Miami Ct', entry: 'Private consultation; book ahead' },
    { dates: 'Dec 2–5, 12–7pm', what: 'The Open Invitational: nonprofit fair for progressive art studios', where: '3930 NE 2nd Ave, 2nd fl', entry: 'Check' },
    { dates: 'Dec 2–6, 11am–4pm', what: 'LVMH The Studio Miami: 9-artist gallery, craft demos, panels, free legal and finance clinics for artists and founders', where: 'Palm Court Event Space, 140 NE 39th St, 3rd fl', entry: 'Public' },
    { dates: 'Dec 4–6 (VIP Dec 2–3)', what: 'Art Basel Miami Beach, incl. the Zero 10 digital-art sector: The Forest Remembers: Winds of Yawanawa with Refik Anadol, booth Z6', where: 'Miami Beach Convention Center', entry: 'Ticketed' },
    { dates: 'From Art Week, into 2027', what: 'MDD Design Commission by Objects of Common Interest: totems that react to touch, release vapor and make sound', where: 'Throughout the Miami Design District', entry: 'Free' },
    { dates: 'Wed–Fri, 12–4pm', what: 'Craig Robins Collection rehang: Baldessari, Dumas, Charles Ray', where: 'Dacra HQ, 3841 NE 2nd Ave', entry: 'Free, by appointment (collection@dacra.com)' },
  ],
  eatPhotos: [
    { for: 'Photo', spot: 'PASTEL Miami, CJ Hendry + Salon 94 Design', where: '3925 N Miami Ave', dates: 'Nov 30 – Dec 20, 10am–6pm', hook: 'Pool-sized pit of giant pills; scoop your own, $1 per pill' },
    { for: 'Photo', spot: 'Shelly Floyd, MELT Lounger', where: 'The Standard Spa, 40 Island Ave', dates: 'Nov 24 – Dec 8', hook: 'Melting pink figure on a poolside lounger; the empty one is for you' },
    { for: 'Photo', spot: 'Andrés Reisinger draped install', where: 'Andaz porte cochère, 4041 Collins Ave', dates: 'Dec 1–6', hook: 'All-pink drape over the entrance, free from the street' },
    { for: 'Photo', spot: 'JJ Hammond, Look Around Once and a While', where: 'Bal Harbour, 102nd St Beach Access Path', dates: 'Nov 29 – Dec 27', hook: 'Seven-foot sculptures and glow-in-the-dark stars; go at dusk' },
    { for: 'Photo', spot: 'MDD Design Commission (OOCI)', where: 'Throughout the Design District', dates: 'From Art Week', hook: 'Totems that steam and hum; good for video' },
    { for: 'Eat + photo', spot: 'Grotto Baths', where: '325 NW 28th St, Wynwood', dates: 'Art Week preview', hook: "BLOCK PARTY nonalcoholic drink and a Florida conch tartine, beside Emmett Moore's breeze-block wall" },
    { for: 'Eat', spot: 'The Joyce', where: '448 Espanola Way, Miami Beach', dates: 'Hang on view from end of Nov', hook: '45-seat steakhouse with Picasso, de Kooning, Basquiat, Condo and KAWS on the walls' },
    { for: 'Eat (splurge)', spot: 'Le Dîner des Grands Crus at The Joyce', where: '448 Espanola Way', dates: 'Tue Dec 1', hook: '12 seats at $12,000 each, about $150,000 of rare wine incl. 1964 Pétrus' },
    { for: 'Eat (new)', spot: 'Pizza Studio Tamaki', where: 'North Beach', dates: 'Opens December', hook: 'Tokyo-Neapolitan pizza from Spicy Hospitality Group' },
    { for: 'Eat (new)', spot: 'Wilder Miami', where: 'Miami', dates: 'Coming soon', hook: 'Neighborhood market backed by Major Food Group' },
  ],
}

async function hasPurchased(session) {
  const records = await table
    .select({ filterByFormula: `{userId} = "${session.issuer}"` })
    .firstPage()
  const purchased = records[0]?.fields?.purchasedContent || ''
  return purchased.split(',').map((s) => s.trim()).includes(PRODUCT_ID)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const session = await getLoginSession(req)
  if (!session?.issuer) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  const purchased = await hasPurchased(session)
  if (!purchased) {
    return res.status(403).json({ error: 'Purchase required' })
  }

  const { query } = req.body
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query required' })
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Event search not configured' })
  }

  const systemPrompt = `You are an Art Basel Miami Beach 2026 event concierge. You have access to the following curated guide data:

PARTIES & PERFORMANCES:
${JSON.stringify(EVENT_DATA.parties, null, 2)}

ART HAPPENINGS:
${JSON.stringify(EVENT_DATA.artHappenings, null, 2)}

EAT + PHOTO SPOTS:
${JSON.stringify(EVENT_DATA.eatPhotos, null, 2)}

The user will describe what they're looking for. Return the most relevant events from this data as a JSON array. Each item must have:
- name: string (the event/spot name)
- date: string
- time: string (or empty string if not specified)
- location: string
- price: string (use "Free" or "Check website" if unknown)
- url: string (use "#" if no URL available)
- platform: string (e.g. "Art Week", "Gallery", "Restaurant", "Party", "Photo Spot")
- description: string (1 sentence from the guide data)

Return ONLY a valid JSON array, no markdown, no other text. Return 3–8 of the most relevant results. If nothing matches well, return the 3 most interesting events overall.`

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 2048,
        temperature: 0.3,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Find Art Basel 2026 events matching: "${query}"` },
        ],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('OpenAI error:', err)
      return res.status(500).json({ error: 'Event search failed' })
    }

    const data = await response.json()
    const text = data.choices?.[0]?.message?.content || ''

    let events
    try {
      const cleaned = text.replace(/^```[a-z]*\n?/i, '').replace(/```\s*$/i, '').trim()
      events = JSON.parse(cleaned)
    } catch {
      return res.status(200).json({ events: [], raw: text })
    }

    return res.status(200).json({ events })
  } catch (err) {
    console.error('find-events error:', err)
    return res.status(500).json({ error: 'Event search failed' })
  }
}
