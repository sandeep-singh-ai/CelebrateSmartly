export const sampleTemplates = [
  {
    id: 'wedding-elegant',
    name: 'Elegant Wedding',
    description: 'A sophisticated wedding template with elegant typography and beautiful layouts',
    category: 'wedding',
    thumbnail: 'https://placehold.co/400x300/f8f9fa/6c757d?text=Elegant+Wedding&font=roboto',
    html_content: `
      <div class="container-fluid p-0">
        <section class="hero-section" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 120px 0; text-align: center;">
          <div class="container">
            <h1 style="font-family: 'Playfair Display', serif; font-size: 4rem; font-weight: 300; margin-bottom: 20px;">Sarah & John</h1>
            <p style="font-size: 1.5rem; margin-bottom: 10px; font-weight: 300;">Are Getting Married</p>
            <p style="font-size: 1.2rem; margin-bottom: 40px; opacity: 0.9;">June 15th, 2024 • Garden Villa Resort</p>
            <button class="btn btn-outline-light btn-lg" style="padding: 15px 40px; border: 2px solid white; background: transparent;">RSVP</button>
          </div>
        </section>
        
        <section style="padding: 100px 0; background: #fafafa;">
          <div class="container">
            <div class="row align-items-center">
              <div class="col-md-6">
                <img src="https://placehold.co/400x300/f8f9fa/6c757d?text=Elegant+Wedding&font=roboto" class="img-fluid rounded shadow-lg" alt="Our Story">
              </div>
              <div class="col-md-6 pl-5">
                <h2 style="font-family: 'Playfair Display', serif; font-size: 2.5rem; margin-bottom: 30px; color: #f5576c;">Our Story</h2>
                <p style="font-size: 1.1rem; line-height: 1.8; color: #666;">We met five years ago at a coffee shop in downtown. What started as a chance encounter over spilled coffee has blossomed into the most beautiful love story.</p>
                <p style="font-size: 1.1rem; line-height: 1.8; color: #666;">Now we're ready to take the next step in our journey together, and we want you to be part of this special day.</p>
              </div>
            </div>
          </div>
        </section>
        
        <section style="padding: 100px 0; background: white;">
          <div class="container text-center">
            <h2 style="font-family: 'Playfair Display', serif; font-size: 2.5rem; margin-bottom: 50px; color: #f5576c;">Wedding Details</h2>
            <div class="row">
              <div class="col-md-4">
                <div class="card border-0" style="padding: 30px;">
                  <i class="fas fa-calendar-alt fa-2x mb-3" style="color: #f5576c;"></i>
                  <h4>Ceremony</h4>
                  <p>June 15th, 2024<br>4:00 PM</p>
                </div>
              </div>
              <div class="col-md-4">
                <div class="card border-0" style="padding: 30px;">
                  <i class="fas fa-map-marker-alt fa-2x mb-3" style="color: #f5576c;"></i>
                  <h4>Venue</h4>
                  <p>Garden Villa Resort<br>123 Wedding Lane</p>
                </div>
              </div>
              <div class="col-md-4">
                <div class="card border-0" style="padding: 30px;">
                  <i class="fas fa-glass-cheers fa-2x mb-3" style="color: #f5576c;"></i>
                  <h4>Reception</h4>
                  <p>Following Ceremony<br>Same Location</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 80px 0; color: white; text-align: center;">
          <div class="container">
            <h2 style="font-family: 'Playfair Display', serif; font-size: 2.5rem; margin-bottom: 30px;">Save the Date</h2>
            <p style="font-size: 1.2rem; margin-bottom: 40px;">We can't wait to celebrate with you!</p>
            <button class="btn btn-light btn-lg" style="padding: 15px 40px; color: #f5576c;">RSVP Now</button>
          </div>
        </section>
      </div>
    `,
    css_content: `
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@300;400;700&display=swap');
      
      .hero-section {
        min-height: 100vh;
        display: flex;
        align-items: center;
      }
      
      .card {
        transition: transform 0.3s ease;
      }
      
      .card:hover {
        transform: translateY(-5px);
      }
      
      .btn {
        transition: all 0.3s ease;
      }
      
      .btn:hover {
        transform: translateY(-2px);
      }
    `
  },
  {
    id: 'birthday-fun',
    name: 'Fun Birthday Party',
    description: 'A colorful and playful birthday party template',
    category: 'birthday',
    thumbnail: 'https://placehold.co/400x300/f8f9fa/6c757d?text=Birthday+Fun&font=roboto',
    html_content: `
      <div class="container-fluid p-0">
        <section class="hero-section" style="background: linear-gradient(45deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3); color: white; padding: 100px 0; text-align: center;">
          <div class="container">
            <h1 style="font-size: 4rem; font-weight: bold; margin-bottom: 20px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">🎉 It's My Birthday! 🎉</h1>
            <p style="font-size: 1.5rem; margin-bottom: 10px;">Join me for an amazing celebration</p>
            <p style="font-size: 1.2rem; margin-bottom: 40px;">Saturday, July 20th • 3:00 PM</p>
            <button class="btn btn-light btn-lg" style="padding: 15px 30px; color: #ff6b6b; font-weight: bold;">I'll Be There!</button>
          </div>
        </section>
        
        <section style="padding: 80px 0; background: #fff;">
          <div class="container">
            <div class="row text-center">
              <div class="col-md-4 mb-4">
                <div class="card h-100 border-0 shadow-sm" style="background: linear-gradient(135deg, #ff6b6b, #feca57);">
                  <div class="card-body text-white">
                    <i class="fas fa-birthday-cake fa-3x mb-3"></i>
                    <h4>Delicious Food</h4>
                    <p>Pizza, cake, and all your favorites!</p>
                  </div>
                </div>
              </div>
              <div class="col-md-4 mb-4">
                <div class="card h-100 border-0 shadow-sm" style="background: linear-gradient(135deg, #48dbfb, #0abde3);">
                  <div class="card-body text-white">
                    <i class="fas fa-music fa-3x mb-3"></i>
                    <h4>Great Music</h4>
                    <p>DJ spinning all the latest hits!</p>
                  </div>
                </div>
              </div>
              <div class="col-md-4 mb-4">
                <div class="card h-100 border-0 shadow-sm" style="background: linear-gradient(135deg, #ff9ff3, #f368e0);">
                  <div class="card-body text-white">
                    <i class="fas fa-gamepad fa-3x mb-3"></i>
                    <h4>Fun Games</h4>
                    <p>Activities and games for everyone!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section style="background: #f8f9fa; padding: 80px 0;">
          <div class="container text-center">
            <h2 style="color: #ff6b6b; font-size: 2.5rem; margin-bottom: 30px;">Party Details</h2>
            <div class="row">
              <div class="col-md-6 mb-4">
                <h4>📅 When</h4>
                <p>Saturday, July 20th, 2024<br>3:00 PM - 8:00 PM</p>
              </div>
              <div class="col-md-6 mb-4">
                <h4>📍 Where</h4>
                <p>Community Center<br>456 Party Street</p>
              </div>
            </div>
            <div class="mt-4">
              <h4>🎁 Gift Ideas</h4>
              <p>Books, games, or just bring yourself!</p>
            </div>
          </div>
        </section>
        
        <section style="background: linear-gradient(45deg, #ff6b6b, #feca57); padding: 60px 0; color: white; text-align: center;">
          <div class="container">
            <h2 style="font-size: 2.5rem; margin-bottom: 20px;">Can't Wait to See You!</h2>
            <button class="btn btn-light btn-lg" style="color: #ff6b6b; font-weight: bold;">RSVP Today</button>
          </div>
        </section>
      </div>
    `,
    css_content: `
      .hero-section {
        animation: gradient 15s ease infinite;
        background-size: 400% 400%;
      }
      
      @keyframes gradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      
      .card {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      
      .card:hover {
        transform: translateY(-10px);
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      }
    `
  },
  {
    id: 'baby-shower-gentle',
    name: 'Gentle Baby Shower',
    description: 'A soft and sweet baby shower template',
    category: 'baby-shower',
    thumbnail: 'https://placehold.co/400x300/f8f9fa/6c757d?text=Baby+Shower&font=roboto',
    html_content: `
      <div class="container-fluid p-0">
        <section class="hero-section" style="background: linear-gradient(135deg, #ffb3d9 0%, #c8e6c9 100%); color: #333; padding: 100px 0; text-align: center;">
          <div class="container">
            <h1 style="font-family: 'Dancing Script', cursive; font-size: 4rem; margin-bottom: 20px; color: #8e44ad;">Baby Shower</h1>
            <p style="font-size: 1.5rem; margin-bottom: 10px;">Celebrating Little One</p>
            <p style="font-size: 1.2rem; margin-bottom: 40px;">Sunday, August 15th • 2:00 PM</p>
            <button class="btn btn-primary btn-lg" style="padding: 15px 30px; background: #8e44ad; border: none;">Join the Celebration</button>
          </div>
        </section>
        
        <section style="padding: 80px 0; background: #fff;">
          <div class="container">
            <div class="row align-items-center">
              <div class="col-md-6">
                <h2 style="font-family: 'Dancing Script', cursive; font-size: 3rem; color: #8e44ad; margin-bottom: 30px;">Welcome Baby</h2>
                <p style="font-size: 1.1rem; line-height: 1.8; color: #666;">Join us as we celebrate the upcoming arrival of our little bundle of joy. It's going to be a day filled with love, laughter, and sweet memories.</p>
                <p style="font-size: 1.1rem; line-height: 1.8; color: #666;">We can't wait to share this special moment with our family and friends.</p>
              </div>
              <div class="col-md-6">
                <img src="https://via.placeholder.com/500x400/ffb3d9/white?text=Baby+Items" class="img-fluid rounded shadow" alt="Baby Items">
              </div>
            </div>
          </div>
        </section>
        
        <section style="background: #f8f9fa; padding: 80px 0;">
          <div class="container text-center">
            <h2 style="font-family: 'Dancing Script', cursive; font-size: 3rem; color: #8e44ad; margin-bottom: 50px;">Shower Details</h2>
            <div class="row">
              <div class="col-md-6 mb-4">
                <div class="card border-0 shadow-sm" style="padding: 30px; background: linear-gradient(135deg, #ffb3d9, #ffc0cb);">
                  <i class="fas fa-calendar-heart fa-2x mb-3" style="color: #8e44ad;"></i>
                  <h4>Date & Time</h4>
                  <p>Sunday, August 15th<br>2:00 PM - 5:00 PM</p>
                </div>
              </div>
              <div class="col-md-6 mb-4">
                <div class="card border-0 shadow-sm" style="padding: 30px; background: linear-gradient(135deg, #c8e6c9, #a8e6cf);">
                  <i class="fas fa-home fa-2x mb-3" style="color: #8e44ad;"></i>
                  <h4>Location</h4>
                  <p>Sarah's Home<br>789 Nursery Lane</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section style="padding: 80px 0; background: #fff;">
          <div class="container text-center">
            <h2 style="font-family: 'Dancing Script', cursive; font-size: 3rem; color: #8e44ad; margin-bottom: 30px;">Gift Registry</h2>
            <p style="font-size: 1.1rem; margin-bottom: 40px; color: #666;">We're registered at Baby Store and Online Registry</p>
            <div class="row">
              <div class="col-md-4 mb-3">
                <div class="card border-0 p-3">
                  <i class="fas fa-baby fa-2x mb-2" style="color: #ffb3d9;"></i>
                  <h5>Baby Clothes</h5>
                </div>
              </div>
              <div class="col-md-4 mb-3">
                <div class="card border-0 p-3">
                  <i class="fas fa-toys fa-2x mb-2" style="color: #c8e6c9;"></i>
                  <h5>Toys & Books</h5>
                </div>
              </div>
              <div class="col-md-4 mb-3">
                <div class="card border-0 p-3">
                  <i class="fas fa-baby-carriage fa-2x mb-2" style="color: #8e44ad;"></i>
                  <h5>Baby Gear</h5>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section style="background: linear-gradient(135deg, #ffb3d9 0%, #c8e6c9 100%); padding: 60px 0; color: #333; text-align: center;">
          <div class="container">
            <h2 style="font-family: 'Dancing Script', cursive; font-size: 2.5rem; margin-bottom: 20px;">See You Soon!</h2>
            <button class="btn btn-primary btn-lg" style="background: #8e44ad; border: none;">RSVP Now</button>
          </div>
        </section>
      </div>
    `,
    css_content: `
      @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap');
      
      .card {
        transition: transform 0.3s ease;
      }
      
      .card:hover {
        transform: translateY(-5px);
      }
      
      .hero-section {
        position: relative;
      }
      
      .hero-section::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="20">👶</text></svg>') repeat;
        opacity: 0.1;
        pointer-events: none;
      }
    `
  }
];
