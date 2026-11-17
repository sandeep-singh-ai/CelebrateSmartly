import { EventTemplate } from "@/types/website-builder";

export const eventTemplates: EventTemplate[] = [
  {
    id: 'modern-wedding',
    name: 'Modern Wedding',
    description: 'Elegant white and gold theme with sophisticated typography',
    category: 'wedding',
    thumbnail: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop',
    html: `
      <div class="wedding-page">
        <header class="hero-section">
          <div class="hero-content">
            <h1 class="wedding-title">Sarah & Michael</h1>
            <p class="wedding-date">June 15, 2024</p>
            <p class="wedding-venue">Garden Valley Resort</p>
          </div>
          <div class="hero-image">
            <img src="/api/placeholder/800/600" alt="Wedding photo" />
          </div>
        </header>
        
        <section class="details-section">
          <div class="container">
            <h2>Our Special Day</h2>
            <p>Join us as we celebrate our love and begin our journey together as husband and wife.</p>
            
            <div class="event-details">
              <div class="detail-item">
                <h3>Ceremony</h3>
                <p>4:00 PM at Garden Valley Chapel</p>
              </div>
              <div class="detail-item">
                <h3>Reception</h3>
                <p>6:00 PM at Grand Ballroom</p>
              </div>
            </div>
            
            <div class="rsvp-section">
              <h3>RSVP</h3>
              <p>Please confirm your attendance by May 1st</p>
              <button class="rsvp-button">RSVP Now</button>
            </div>
          </div>
        </section>
      </div>
    `,
    css: `
      .wedding-page {
        font-family: 'Georgia', serif;
        color: #333;
        line-height: 1.6;
      }
      
      .hero-section {
        background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
        padding: 80px 20px;
        text-align: center;
        min-height: 80vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
      
      .wedding-title {
        font-size: 3.5rem;
        color: #d4af37;
        margin-bottom: 20px;
        font-weight: 300;
      }
      
      .wedding-date, .wedding-venue {
        font-size: 1.2rem;
        color: #666;
        margin-bottom: 10px;
      }
      
      .hero-image {
        margin-top: 40px;
        border-radius: 15px;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      }
      
      .hero-image img {
        width: 100%;
        max-width: 600px;
        height: auto;
      }
      
      .details-section {
        padding: 80px 20px;
        background: white;
      }
      
      .container {
        max-width: 800px;
        margin: 0 auto;
        text-align: center;
      }
      
      .details-section h2 {
        font-size: 2.5rem;
        color: #d4af37;
        margin-bottom: 30px;
      }
      
      .event-details {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 40px;
        margin: 60px 0;
      }
      
      .detail-item h3 {
        color: #d4af37;
        font-size: 1.5rem;
        margin-bottom: 10px;
      }
      
      .rsvp-section {
        margin-top: 60px;
        padding: 40px;
        background: #f9f9f9;
        border-radius: 10px;
      }
      
      .rsvp-button {
        background: #d4af37;
        color: white;
        border: none;
        padding: 15px 40px;
        font-size: 1.1rem;
        border-radius: 5px;
        cursor: pointer;
        margin-top: 20px;
        transition: background 0.3s;
      }
      
      .rsvp-button:hover {
        background: #b8941f;
      }
      
      @media (max-width: 768px) {
        .wedding-title {
          font-size: 2.5rem;
        }
        
        .event-details {
          grid-template-columns: 1fr;
          gap: 20px;
        }
      }
    `,
    components: []
  },
  {
    id: 'birthday-bash',
    name: 'Birthday Bash',
    description: 'Colorful and fun theme with bold typography and confetti',
    category: 'birthday',
    thumbnail: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=300&fit=crop',
    html: `
      <div class="birthday-page">
        <header class="party-header">
          <div class="confetti"></div>
          <div class="party-content">
            <h1 class="birthday-title">🎉 Alex's 25th Birthday! 🎉</h1>
            <p class="party-date">Saturday, July 20th, 2024</p>
            <p class="party-time">7:00 PM - Late</p>
            <p class="party-location">Downtown Party Hall</p>
          </div>
        </header>
        
        <section class="party-details">
          <div class="container">
            <h2>Join the Celebration!</h2>
            <p>Come party with us as Alex turns 25! There will be music, dancing, great food, and amazing company.</p>
            
            <div class="party-info">
              <div class="info-card">
                <h3>🎵 Music & Dancing</h3>
                <p>DJ spinning the hottest tracks all night long</p>
              </div>
              <div class="info-card">
                <h3>🍕 Food & Drinks</h3>
                <p>Delicious catering and an open bar</p>
              </div>
              <div class="info-card">
                <h3>📸 Photo Booth</h3>
                <p>Capture memories with fun props</p>
              </div>
            </div>
            
            <div class="rsvp-section">
              <h3>Can you make it?</h3>
              <p>Let us know if you'll be joining the fun!</p>
              <button class="party-button">RSVP Here</button>
            </div>
          </div>
        </section>
      </div>
    `,
    css: `
      .birthday-page {
        font-family: 'Arial', sans-serif;
        color: #333;
        background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7);
        background-size: 400% 400%;
        animation: gradient 15s ease infinite;
      }
      
      @keyframes gradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      
      .party-header {
        padding: 100px 20px;
        text-align: center;
        position: relative;
        min-height: 80vh;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .birthday-title {
        font-size: 3rem;
        color: white;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        margin-bottom: 20px;
        font-weight: bold;
        animation: bounce 2s infinite;
      }
      
      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-10px); }
        60% { transform: translateY(-5px); }
      }
      
      .party-date, .party-time, .party-location {
        font-size: 1.3rem;
        color: white;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
        margin-bottom: 10px;
        font-weight: 600;
      }
      
      .party-details {
        background: white;
        padding: 80px 20px;
        margin-top: -50px;
        border-radius: 50px 50px 0 0;
        position: relative;
        z-index: 2;
      }
      
      .container {
        max-width: 900px;
        margin: 0 auto;
        text-align: center;
      }
      
      .party-details h2 {
        font-size: 2.5rem;
        color: #ff6b6b;
        margin-bottom: 30px;
        font-weight: bold;
      }
      
      .party-info {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 30px;
        margin: 60px 0;
      }
      
      .info-card {
        background: #f8f9fa;
        padding: 30px;
        border-radius: 20px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        transition: transform 0.3s;
      }
      
      .info-card:hover {
        transform: translateY(-5px);
      }
      
      .info-card h3 {
        color: #ff6b6b;
        font-size: 1.3rem;
        margin-bottom: 15px;
      }
      
      .rsvp-section {
        margin-top: 60px;
        padding: 40px;
        background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
        border-radius: 20px;
        color: white;
      }
      
      .party-button {
        background: white;
        color: #ff6b6b;
        border: none;
        padding: 15px 40px;
        font-size: 1.2rem;
        font-weight: bold;
        border-radius: 25px;
        cursor: pointer;
        margin-top: 20px;
        transition: all 0.3s;
      }
      
      .party-button:hover {
        transform: scale(1.05);
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
      }
      
      @media (max-width: 768px) {
        .birthday-title {
          font-size: 2rem;
        }
        
        .party-info {
          grid-template-columns: 1fr;
        }
      }
    `,
    components: []
  },
  {
    id: 'baby-shower',
    name: 'Baby Shower',
    description: 'Soft and sweet theme with pastel colors and cute elements',
    category: 'baby-shower',
    thumbnail: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=300&fit=crop',
    html: `
      <div class="baby-shower-page">
        <header class="baby-header">
          <div class="clouds">
            <div class="cloud cloud1"></div>
            <div class="cloud cloud2"></div>
            <div class="cloud cloud3"></div>
          </div>
          <div class="baby-content">
            <h1 class="baby-title">👶 Baby Shower 👶</h1>
            <p class="baby-subtitle">Celebrating Baby Johnson</p>
            <p class="shower-date">Sunday, August 15th, 2024</p>
            <p class="shower-time">2:00 PM - 5:00 PM</p>
            <p class="shower-location">Garden Terrace Cafe</p>
          </div>
        </header>
        
        <section class="shower-details">
          <div class="container">
            <h2>Join Us for a Sweet Celebration</h2>
            <p>Help us welcome the newest addition to our family with love, laughter, and sweet treats!</p>
            
            <div class="shower-activities">
              <div class="activity-item">
                <span class="activity-icon">🍰</span>
                <h3>Sweet Treats</h3>
                <p>Delicious cakes, cupcakes, and baby-themed desserts</p>
              </div>
              <div class="activity-item">
                <span class="activity-icon">🎮</span>
                <h3>Fun Games</h3>
                <p>Baby-themed games and activities for everyone</p>
              </div>
              <div class="activity-item">
                <span class="activity-icon">🎁</span>
                <h3>Gift Opening</h3>
                <p>Watch as we open special gifts for the little one</p>
              </div>
            </div>
            
            <div class="registry-section">
              <h3>Baby Registry</h3>
              <p>Find gift ideas at our registry</p>
              <button class="baby-button">View Registry</button>
            </div>
            
            <div class="rsvp-section">
              <h3>Please RSVP</h3>
              <p>Let us know if you can join us for this special day</p>
              <button class="baby-button">RSVP</button>
            </div>
          </div>
        </section>
      </div>
    `,
    css: `
      .baby-shower-page {
        font-family: 'Comic Sans MS', cursive, sans-serif;
        color: #5a5a5a;
        background: linear-gradient(135deg, #ffeef8 0%, #e8f4fd 100%);
        min-height: 100vh;
      }
      
      .baby-header {
        padding: 100px 20px;
        text-align: center;
        position: relative;
        min-height: 70vh;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .clouds {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
      }
      
      .cloud {
        background: white;
        border-radius: 50px;
        opacity: 0.8;
        position: absolute;
        animation: float 20s infinite linear;
      }
      
      .cloud1 {
        width: 100px;
        height: 40px;
        top: 20%;
        left: 10%;
        animation-delay: 0s;
      }
      
      .cloud2 {
        width: 80px;
        height: 30px;
        top: 30%;
        right: 15%;
        animation-delay: 5s;
      }
      
      .cloud3 {
        width: 120px;
        height: 50px;
        top: 15%;
        right: 40%;
        animation-delay: 10s;
      }
      
      @keyframes float {
        0% { transform: translateX(-50px); }
        100% { transform: translateX(calc(100vw + 50px)); }
      }
      
      .baby-title {
        font-size: 3rem;
        color: #ff9ec7;
        margin-bottom: 10px;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
      }
      
      .baby-subtitle {
        font-size: 1.5rem;
        color: #87ceeb;
        margin-bottom: 30px;
        font-weight: 600;
      }
      
      .shower-date, .shower-time, .shower-location {
        font-size: 1.1rem;
        color: #6a6a6a;
        margin-bottom: 8px;
      }
      
      .shower-details {
        background: white;
        padding: 80px 20px;
        border-radius: 40px 40px 0 0;
        margin-top: -30px;
        position: relative;
        z-index: 2;
      }
      
      .container {
        max-width: 800px;
        margin: 0 auto;
        text-align: center;
      }
      
      .shower-details h2 {
        font-size: 2.3rem;
        color: #ff9ec7;
        margin-bottom: 20px;
      }
      
      .shower-activities {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 30px;
        margin: 50px 0;
      }
      
      .activity-item {
        padding: 30px 20px;
        background: #fafafa;
        border-radius: 20px;
        border: 2px solid #f0f0f0;
      }
      
      .activity-icon {
        font-size: 2rem;
        display: block;
        margin-bottom: 15px;
      }
      
      .activity-item h3 {
        color: #87ceeb;
        font-size: 1.2rem;
        margin-bottom: 10px;
      }
      
      .registry-section, .rsvp-section {
        margin: 40px 0;
        padding: 30px;
        background: #f8fbff;
        border-radius: 15px;
        border-left: 5px solid #87ceeb;
      }
      
      .baby-button {
        background: linear-gradient(135deg, #ff9ec7, #87ceeb);
        color: white;
        border: none;
        padding: 12px 30px;
        font-size: 1rem;
        border-radius: 20px;
        cursor: pointer;
        margin-top: 15px;
        font-weight: 600;
        transition: transform 0.3s;
      }
      
      .baby-button:hover {
        transform: scale(1.05);
      }
      
      @media (max-width: 768px) {
        .baby-title {
          font-size: 2.2rem;
        }
        
        .shower-activities {
          grid-template-columns: 1fr;
        }
      }
    `,
    components: []
  }
];