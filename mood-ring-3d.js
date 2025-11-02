// Configuration
const canvas = document.getElementById('viz');
const ctx = canvas.getContext('2d');

// Calculate the center point of the canvas (500, 500 since canvas is 1000x1000)
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
//rings
const baseRadius = 60; // The innermost ring starts 60 pixels from center
const ringThickness = 20; // each ring is 20 pixels thick

// Particle system
// creates sparkle effects when I hover over the rings
let particles = []; // array to store all active particles

class Particle {
  constructor(x, y, color) {
    this.x = x; // Starting X position
    this.y = y; // Starting Y position
    this.vx = (Math.random() - 0.5) * 2; // Random horizontal velocity
    this.vy = (Math.random() - 0.5) * 2; // Random vertical velocity
    this.life = 1.0; // Starts fully visible
    this.decay = Math.random() * 0.02 + 0.01; // How fast it fades out
    this.size = Math.random() * 11 + 1; // Random size between 1 and 10 pixels
    this.color = color; // Inherits the color of the ring it came from
  }
  
   // Update particle position and opacity each frame
  update() {
    this.x += this.vx; // Move horizontally
    this.y += this.vy; // Move vertically
    this.life -= this.decay; // Fade out gradually
  }
  
  // draw a partocle as a small circle
  draw(ctx) {
    ctx.globalAlpha = this.life; // Set transparency based on remaining life
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); // draw a circle
    ctx.fill();
  }
}

// Parse date from multiple formats
// Handles dates like "10/13/25" or "10/13/2025"
function parseDate(dateStr) {
  dateStr = dateStr.trim(); // Remove any extra spaces
  const parts = dateStr.split('/'); //split by slash
  
  if (parts.length === 3) {
    const [month, day, year] = parts; // Extract month, day, year
    const fullYear = year.length === 2 ? '20' + year : year; //convert 25 to 2025
    return new Date(`${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
  }
  
  return new Date(dateStr);
}

// Format month for display
// Convert month key like "2025-10" to readable format like "October 2025"
function formatMonth(monthKey) {
  const [year, month] = monthKey.split('-'); // Split "2025-10" into ["2025", "10"]
  const date = new Date(year, parseInt(month) - 1); // Month is 0-indexed, so subtract 1
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }); // "October 2025"
}

// Blend genre colors
//COLOR BLENDING: Mix genre colors based on what I watched that month
// Example: If I watched 70% anime and 30% action, the ring will be 70% purple + 30% orange
function blendGenreColors(genreMap) {
  const total = d3.sum(genreMap.values()); // Total number of titles watched
  let r = 0, g = 0, b = 0; // RGB color components start at 0
  
  //add color proportionally
  genreMap.forEach((count, genre) => {
    const weight = count / total; // Percentage of this genre (e.g., 0.7 for 70%)
    const color = extractRgb(genreColors[genre] || genreColors.other); //get RGB of genre
    r += color.r * weight; // add weighted red component
    g += color.g * weight; // add weighted green component
    b += color.b * weight; // add weighted blue component
  });
  
  // Return the blended color as an RGB string
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

// Extract RGB values from rgb() string or hex
// Convert color strings to RGB numbers so I can do math with them
function extractRgb(colorStr) {
  // Handle rgb(r, g, b) format
  const rgbMatch = colorStr.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1]), //red value
      g: parseInt(rgbMatch[2]), //green value
      b: parseInt(rgbMatch[3]) //blue value
    };
  }
  
  // Handle hex format as fallback
  const hexMatch = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(colorStr);
  if (hexMatch) {
    return {
      r: parseInt(hexMatch[1], 16),
      g: parseInt(hexMatch[2], 16),
      b: parseInt(hexMatch[3], 16)
    };
  }
  
  // Default gray
  // If parsing fails, return gray as a safe default
  return { r: 128, g: 128, b: 128 };
}

// Create legend
function createLegend() {
  const legend = document.getElementById('legend'); // Get the legend container

  // Loop through each genre and create a legend item for it
  Object.entries(genreColors).forEach(([genre, color]) => {
    const item = document.createElement('div');
    item.className = 'legend-item';
    // Create HTML with colored box and genre name (capitalize first letter)
    item.innerHTML = `
      <div class="legend-color" style="background: ${color}"></div>
      <span>${genre.charAt(0).toUpperCase() + genre.slice(1)}</span>
    `;
    legend.appendChild(item); // add it to the legend
  });
}

// Animation state
let rotation = 0;
let pulsePhase = 0; // pulsing effect
let hoveredRing = null; // Tracks which ring is currently hovered over

//tooltip - show details when I hover over a ring
function setupTooltip(months) {
  const tooltip = document.getElementById('tooltip');

  // Listen for mouse movement over the canvas
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect(); // Get canvas position on page
    const mouseX = e.clientX - rect.left; // Mouse X relative to canvas
    const mouseY = e.clientY - rect.top; // Mpuse Y relative to canvas
    

    // Calculate distance from mouse to center of canvas
    const dx = mouseX - centerX; // horizontal distance
    const dy = mouseY - centerY; //vertical distance
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    let newHoveredRing = null; // will store which ring is hovered

    // Check each ring to see if mouse is inside it
    months.forEach(([monthKey, data], i) => {
      const innerRadius = baseRadius + i * ringThickness; //ring inner edge
      const outerRadius = innerRadius + ringThickness; //ring outer edge
      
       // Is the mouse between the inner and outer edges?
      if (distance >= innerRadius && distance <= outerRadius) {
        newHoveredRing = i;
        
        // Spawn particles on hover
        // Spawn particles randomly while hovering (40% chance per frame)
        if (Math.random() < 0.4) {
          const angle = Math.atan2(dy, dx); // Angle from center to mouse
          const spawnDist = (innerRadius + outerRadius) / 2; // middle of the ring
          const px = centerX + Math.cos(angle) * spawnDist; //particle x position
          const py = centerY + Math.sin(angle) * spawnDist; // particle y position
          const color = blendGenreColors(data.genres); // color of the ring
          particles.push(new Particle(px, py, color)); //create a new particle
        }
        


        // Build the genre list text, sorted by count (most watched first)
        const genreList = Array.from(data.genres.entries()) // get genre + its count
          .sort((a, b) => b[1] - a[1]) // Sort by count descending, least watched will be last
          .map(([g, c]) => `${g}: ${c}`) // Format as "anime: 25"
          .join(', '); // join with commas
        
        // Update tooltip content with month info and stats
        tooltip.innerHTML = `
          <div class="month">${formatMonth(monthKey)}</div>
          <div class="count">${data.count} titles watched</div>
          <div class="genres">${genreList}</div>
        `;
        tooltip.style.display = 'block'; //show the tooltip
        tooltip.style.left = (e.clientX + 15) + 'px'; // place it near the mouse
        tooltip.style.top = (e.clientY + 15) + 'px';
      }
    });

    //update which ring is hovered
    hoveredRing = newHoveredRing;
    if (hoveredRing === null) {
      tooltip.style.display = 'none'; //hide the tool tip if no ring is hovered
    }
  });
  
   // Hide tooltip when mouse leaves the canvas entirely
  canvas.addEventListener('mouseleave', () => {
    tooltip.style.display = 'none';
    hoveredRing = null;
  });
}

// Continuous animation loop
//ANIMATION LOOP: Continuously redraws the rings with effects
// This runs 60 times per second to create smooth animations
function animate(months) {
  ctx.clearRect(0, 0, canvas.width, canvas.height); //clear canvas for next frame
  
  rotation += 0.002; //slowly increment rotation
  pulsePhase += 0.03; //increase pulsing effect
  
  // Draw rings with 3D effect
  // Draw each ring (one for each month)
  months.forEach(([monthKey, data], i) => {
    const innerRadius = baseRadius + i * ringThickness; // where the ring starts
    const outerRadius = innerRadius + ringThickness; //where the ring ends
    const midRadius = (innerRadius + outerRadius) / 2; // middle of the ring
    
    const blendedColor = blendGenreColors(data.genres); //mix color based on genres
    const baseOpacity = Math.min(0.4 + (data.count / 50) * 0.6, 1); //the more genres the more opaque
    
    // Pulsing effect using sine wave
    const pulse = Math.sin(pulsePhase + i * 0.2) * 0.1 + 1;
    const opacity = baseOpacity * (hoveredRing === i ? 1.2 : 1); // Brighten if hovered
    
    // Draw multiple layers for 3D depth
    // Draw multiple layers to create 3D depth effect
    // Draws from back to front (layer 3 → 2 → 1 → 0)
    for (let layer = 3; layer >= 0; layer--) {
      const layerRadius = midRadius - layer * 2; //each layer slightly smaller
      const layerOpacity = opacity * (1 - layer * 0.15); //back layer are dimmer
      
      // Outer glow
      ctx.strokeStyle = blendedColor;
      ctx.globalAlpha = layerOpacity * 0.2; //very subtle
      ctx.lineWidth = (ringThickness + 8) * pulse; //thicker than main ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, layerRadius, rotation, rotation + Math.PI * 2);
      ctx.stroke(); //draw the glow
      
      // Main ring with solid color 
      ctx.strokeStyle = blendedColor;
      ctx.globalAlpha = layerOpacity; //normal opacity
      ctx.lineWidth = (ringThickness - 4) * pulse; //sligtly thinner than glow
      ctx.beginPath();
      ctx.arc(centerX, centerY, layerRadius, rotation, rotation + Math.PI * 2);
      ctx.stroke();
      
      // Highlight effect on hovered ring
      // Add white highlight/stroke to the ring you're hovering over
      if (hoveredRing === i && layer === 0) { //only on the front layer so its visible
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, layerRadius, rotation, rotation + Math.PI * 2);
        ctx.stroke();
      }
    }
  });
  
  // Update and draw particles
  ctx.globalAlpha = 1; //reset opacity
  particles = particles.filter(p => p.life > 0); //remove dead particles
  particles.forEach(p => {
    p.update(); //move and fade each particle
    p.draw(ctx); //draw particle
  });
  
  ctx.globalAlpha = 1; // reset opacity for next frame
  requestAnimationFrame(() => animate(months)); //plan next frame
}

// Main visualization function - loads data and starts visualization
async function visualize() {
  try {
    const response = await fetch('moodringdata.txt'); //data file
    const text = await response.text(); //gets the content
    

    // Parse the tab-separated data (each line is "Title\tDate")
    const lines = text.split('\n').filter(line => line.trim() && line.includes('\t'));
    const allData = lines.map(line => {
      const [title, date] = line.split('\t'); //split by tab character
      return { title: title?.trim(), date: date?.trim() }; //clean up spaces
    }).filter(d => d.title && d.date); //remove any invalid entries
    
    console.log(`Loaded ${allData.length} entries`); //console output
    
    // Convert each entry to a structured object with genre and date info
    const parsed = allData
      .map(d => {
        try {
          const date = parseDate(d.date);
          const genre = assignGenre(d.title); //determine genre from title
          
          return {
            title: d.title,
            date,
            genre,
            year: date.getFullYear(),    // Extract year (e.g., 2025)
            month: date.getMonth() + 1    // Extract month (1-12)
          };
        } catch (e) {
          return null; // Skip entries that fail to parse

        }
      })
      .filter(d => d !== null);  //remove failed entries
    
    console.log(`Parsed ${parsed.length} entries`); //console output
    

    // Group all entries by month using D3's rollup function
    const byMonth = d3.rollup(
      parsed,
      v => ({ // For each month, calculate:
        count: v.length, // Total titles watched
        genres: d3.rollup(v, vv => vv.length, d => d.genre) // Count per genre
      }),
      d => `${d.year}-${String(d.month).padStart(2, '0')}` // Group by "YYYY-MM"
    );
    
     // Convert to array and sort chronologically
    const months = Array.from(byMonth.entries())
      .sort((a, b) => a[0].localeCompare(b[0]));  // Sort by month key
    
    console.log(`Showing ${months.length} months from ${months[0][0]} to ${months[months.length - 1][0]}`);
    
    //INITIAL DRAW: Rings appear one by one for a cool loading effect
    let currentRing = 0; // Start with the first ring
    const drawSpeed = 30; // Milliseconds between each ring appearing
    
    function drawInitial() {
      // Are we done drawing all rings?
      if (currentRing >= months.length) {
        document.getElementById('loading').style.display = 'none'; // Hide "Loading..."
        setupTooltip(months); // Enable hover tooltips
        createLegend(); // Show the legend
        animate(months); // Start the continuous animation loop
        return;
      }
      
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
      
      // Redraw all rings from 0 to currentRing (builds up over time)
      for (let i = 0; i <= currentRing; i++) {
        const [monthKey, data] = months[i];
        const innerRadius = baseRadius + i * ringThickness;
        const outerRadius = innerRadius + ringThickness;
        const midRadius = (innerRadius + outerRadius) / 2;
        
        const blendedColor = blendGenreColors(data.genres);
        const opacity = Math.min(0.4 + (data.count / 50) * 0.6, 1);
        
        // Draw glow layer
        ctx.strokeStyle = blendedColor;
        ctx.globalAlpha = opacity * 0.3;
        ctx.lineWidth = ringThickness + 6;
        ctx.beginPath();
        ctx.arc(centerX, centerY, midRadius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Draw main ring layer
        ctx.globalAlpha = opacity;
        ctx.lineWidth = ringThickness - 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, midRadius, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      currentRing++; // Move to next ring
      setTimeout(drawInitial, drawSpeed); // Schedule next ring to appear
    }
    
    drawInitial(); // Start the initial drawing animation
    
  } catch (error) {
    // If anything goes wrong, show an error message
    console.error('Error:', error);
    document.getElementById('loading').textContent = 'Error loading data. Check console.';
  }
}

// Start the visualization when the page loads
visualize();
