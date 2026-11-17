
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { eventName, location, numberOfPeople, selectedCategory } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Create a highly creative and unique prompt that generates themes users won't find elsewhere
    const prompt = `As an elite event design consultant with 20+ years of experience creating luxury celebrations, generate 3 extraordinarily unique and innovative themes for a ${selectedCategory} event called "${eventName}" in ${location} for ${numberOfPeople} people.

    IMPORTANT: Create themes that are:
    - Completely original and unprecedented
    - Blend unexpected elements and concepts
    - Include surprising color combinations that work harmoniously
    - Feature innovative party suppliers and unique decoration ideas
    - Suggest creative food pairings and signature experiences
    - Incorporate local ${location} elements in creative ways
    - Consider the scale of ${numberOfPeople} guests for optimal impact

    Think beyond traditional themes. Combine concepts like:
    - Art movements with natural phenomena
    - Historical periods with futuristic elements  
    - Cultural fusion with modern aesthetics
    - Sensory experiences with visual storytelling
    - Seasonal elements with unexpected twists

    For each theme, provide detailed recommendations that no one else would think of:

    Return as JSON array with this exact structure:
    [{
      "theme_name": "Unique Creative Theme Name",
      "colors": ["#hex1", "#hex2", "#hex3", "#hex4"],
      "party_suppliers": ["innovative decoration 1", "unique supply 2", "creative element 3", "signature piece 4"],
      "food_recommendations": ["signature dish 1", "creative beverage 2", "unique dessert 3", "interactive food experience 4"],
      "additional_recommendations": ["immersive activity 1", "sensory experience 2", "interactive element 3", "memorable finale 4"]
    }]

    Only return valid JSON, no additional text.`;

    console.log('Generating unique themes with OpenAI...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an elite luxury event designer known for creating completely unique, never-before-seen celebration themes. Your creativity knows no bounds and you always surprise clients with innovative concepts they never imagined. Generate only valid JSON responses with extraordinarily creative and original themes.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2500,
        temperature: 0.9,
        presence_penalty: 0.8,
        frequency_penalty: 0.7
      }),
    });

    console.log('OpenAI response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const themesText = data.choices[0].message.content;

    let generatedThemes;
    try {
      const cleanedText = themesText.trim();
      generatedThemes = JSON.parse(cleanedText);
      console.log('Successfully generated unique themes:', generatedThemes.length);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', themesText);
      
      // Fallback with more creative default themes
      generatedThemes = [
        {
          theme_name: "Celestial Garden Noir",
          colors: ["#0B1426", "#C9A96E", "#2D5016", "#E8E2D4"],
          party_suppliers: ["Suspended constellation lighting", "Dark botanical arrangements", "Metallic geometric planters", "Floating candle gardens"],
          food_recommendations: ["Edible flower cocktails with gold leaf", "Herb-crusted delicacies", "Starlight-inspired desserts", "Midnight garden punch"],
          additional_recommendations: ["Astronomy-themed photo booth", "Live herb garden stations", "Constellation mapping activity", "Midnight garden ceremony"]
        },
        {
          theme_name: "Vintage Futurism Fusion",
          colors: ["#D4A574", "#1A3B5C", "#E6C79C", "#7A9CC6"],
          party_suppliers: ["Art deco holographic displays", "Vintage brass with LED accents", "Retro-futuristic furniture", "Time capsule centerpieces"],
          food_recommendations: ["Molecular gastronomy classics", "Vintage-inspired craft cocktails", "Futuristic food presentations", "Time-travel tasting menu"],
          additional_recommendations: ["Virtual reality vintage experiences", "Time period costume stations", "Interactive timeline displays", "Future predictions activity"]
        },
        {
          theme_name: "Oceanic Dreamscape",
          colors: ["#2E8B7C", "#F4E4BC", "#1B4B5A", "#A8D8EA"],
          party_suppliers: ["Flowing fabric installations", "Bioluminescent decorations", "Coral-inspired sculptures", "Underwater lighting effects"],
          food_recommendations: ["Ocean-to-table seafood", "Tide pool-inspired appetizers", "Flowing blue cocktails", "Sea foam desserts"],
          additional_recommendations: ["Underwater photography booth", "Marine life educational stations", "Ocean sound meditation area", "Tide pool exploration"]
        }
      ];
    }

    return new Response(JSON.stringify({ themes: generatedThemes }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating themes:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
