
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const port = Number(Deno.env.get("PORT") ?? "3000");
console.log(`Listening on http://0.0.0.0:${port}`);


const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { eventName, location, numberOfPeople, eventCategory } = await req.json()

    console.log('Generating themes for:', { eventName, location, numberOfPeople, eventCategory })

    // Initialize Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Call OpenAI API to generate themes
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    
    if (!openaiApiKey) {
      console.error('OpenAI API key not configured')
      throw new Error('OpenAI API key not configured')
    }

    const prompt = `Generate 3 creative and unique event themes for a ${eventCategory} called "${eventName}" in ${location} for ${numberOfPeople} people. 

    For each theme, provide:
    1.Theme Name
    1.1 A catchy, creative title that captures the vibe of the event.

    2. Color Palette
    2.1 Provide 3–5 complementary colors with hex codes.
    2.2 Include a short explanation of how these colors set the mood.

    3. Party Supplier Recommendations
    3.1 Suggest decorations, tableware, balloons, lighting, signage, flowers, or props that align with the theme.
    3.2 Mention whether items can be DIY, rented, or purchased.

    4. Food & Beverage Recommendations
    4.1 Menu ideas (appetizers, main dishes, desserts).
    4.2 Themed beverages (cocktails, mocktails, or drink station ideas).
    4.3 Suggestions for presentation or serving style (buffet, grazing board, plated, food trucks, etc.).

    5. Additional Recommendations
    5.1 Suggested activities, games, entertainment, or performances to fit the mood.
    5.2 Music/playlist or dress code recommendations.
    5.3 Any extra touches (photo booth ideas, guest favors, keepsakes).

    6. Ideal Guest Experience
    6.1 Provide a short description (2–3 sentences) of what the overall vibe will feel like for attendees—e.g., relaxed, glamorous, playful, intimate.

    7. Budget-Friendly Alternatives (optional but useful)
    7.1 Quick tips for hosts who want a DIY or low-cost version of the theme.

    Return as JSON array with this structure:
    [{
      "theme_name": "Theme Name",
      "colors": ["#hex1", "#hex2", "#hex3"],
      "party_suppliers": ["decoration item 1", "decoration item 2", "supply item 1"],
      "food_recommendations": ["food item 1", "beverage 1", "dessert 1"],
      "additional_recommendations": ["activity 1", "entertainment suggestion", "special touch"]
    }]

    Only return the JSON array, no additional text.`

    console.log('Making OpenAI API call...')

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a creative event planning assistant. Generate unique, creative, and practical event themes with specific recommendations. Always return valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.8
      }),
    })

    console.log('OpenAI response status:', openaiResponse.status)

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text()
      console.error('OpenAI API error:', errorText)
      throw new Error(`OpenAI API error: ${openaiResponse.status} ${errorText}`)
    }

    const openaiData = await openaiResponse.json()
    console.log('OpenAI response received')
    
    const themesText = openaiData.choices[0].message.content

    // Parse the JSON response
    let themes
    try {
      // Clean the response text to ensure it's valid JSON
      const cleanedText = themesText.trim()
      themes = JSON.parse(cleanedText)
      console.log('Successfully parsed themes:', themes.length)
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', themesText)
      console.error('Parse error:', parseError)
      
      // Fallback: create default themes if parsing fails
      themes = [
        {
          theme_name: "Classic Elegance",
          colors: ["#000000", "#FFFFFF", "#C0C0C0", "#FFD700"],
          party_suppliers: ["Black and white decorations", "Gold accents", "Elegant centerpieces"],
          food_recommendations: ["Champagne", "Hors d'oeuvres", "Elegant desserts"],
          additional_recommendations: ["Live music", "Professional photography", "Elegant lighting"]
        },
        {
          theme_name: "Garden Party",
          colors: ["#228B22", "#FFFFFF", "#FFB6C1", "#DDA0DD"],
          party_suppliers: ["Floral arrangements", "Garden decorations", "Natural elements"],
          food_recommendations: ["Fresh salads", "Garden cocktails", "Fruit platters"],
          additional_recommendations: ["Outdoor setting", "Nature-themed activities", "Fresh flowers"]
        },
        {
          theme_name: "Modern Chic",
          colors: ["#2F4F4F", "#FFFFFF", "#FF6347", "#20B2AA"],
          party_suppliers: ["Modern decorations", "Geometric patterns", "Contemporary lighting"],
          food_recommendations: ["Trendy appetizers", "Craft cocktails", "Modern desserts"],
          additional_recommendations: ["Contemporary music", "Stylish seating", "Modern art displays"]
        }
      ]
    }

    return new Response(JSON.stringify({ themes }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error in generate-event-themes:', error)
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Please check the edge function logs for more details'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
