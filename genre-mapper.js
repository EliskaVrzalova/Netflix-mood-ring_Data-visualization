// Genre color palette
// each genre assigned a color that represents it in the mood ring
const genreColors = {
  action: '#FF4500',
  anime: '#9370DB',
  animated: '#0b3d05ff',
  comedy: '#FFD700',
  crime: '#DC143C',
  documentary: '#32CD32',
  drama: '#2a1cc3ff',
  fantasy: '#e904feff',
  horror: '#8B0000',
  romance: '#FF69B4',
  scifi: '#00CED1',
  thriller: '#B22222',
  western: '#422817ff',
  other: '#808080'
};

// Manual genre assigning - a look up table for specific genres
// specific genres assiged to specific titles
// manual override list in case automatic detection goes wrong
const manualGenres = {
  // Movies
  'Focus': 'crime',
  'Zabiják': 'action',
  'Luther: Pád z nebes': 'crime',
  'My': 'horror',
  'Sněžné bratrstvo': 'documentary',
  'Číslo 24': 'thriller',
  'Rivalové 2': 'drama',
  'Honest Thief': 'action',
  'Sběratel polibků': 'romance',
  'Harry Potter a Relikvie smrti – část 2': 'fantasy',
  'Hunger Games: Vražedná pomsta': 'action',
  'Hunger Games: Síla vzdoru 1. část': 'action',
  'Hunger Games: Síla vzdoru 2. část': 'action',
  'Inglourious Basterds': 'comedy',
  'Hitler - A Career': 'documentary',
  'Jumanji: Welcome to the Jungle': 'action',
  'How It Ends': 'thriller',
  'The Batman': 'action',
  'All Quiet on the Western Front': 'drama',
  'Van Helsing': 'action',
  'Despicable Me 3': 'animated',
  'Sinister 2': 'horror',
  'The Ballad of Buster Scruggs': 'western',
  'Circle': 'thriller',
  'Jujutsu Kaisen 0: The Movie': 'anime',
  
  // series
  'Vikingové': 'action',
  'Vikings': 'action',
  'Monster': 'anime',
  'Zaklínač': 'fantasy',
  'The Witcher': 'fantasy',
  'Black Mirror': 'scifi',
  'Cyberpunk: Edgerunners': 'anime',
  'Sakamoto Days': 'anime',
  'Black Clover': 'anime',
  'Tokyo Ghoul': 'anime',
  'Kovboj Bebop': 'anime',
  'Cowboy Bebop': 'anime',
  'Léto, kdy umřel Hikaru': 'anime',
  'Monstrum': 'documentary',
  'Poslední království': 'action',
  'The Last Kingdom': 'action',
  'Fullmetal Alchemist': 'anime',
  'Dark': 'thriller',
  'Alice in Borderland': 'thriller',
  'Demon Slayer': 'anime',
  'Jujutsu Kaisen': 'anime',
  'The 8 Show': 'thriller',
  'Squid Game': 'thriller',
  'DEATH NOTE': 'anime',
  'Rick and Morty': 'comedy',
  'Arcane': 'anime',
  'Baki Hanma': 'anime',
  'Havoc': 'action',
  'Sex Education': 'comedy',
  'Dhoom Dhaam': 'comedy',
  'A Killer Paradox': 'thriller',
  'Juvenile Justice': 'drama',
  'Kuroko': 'anime',
  'Hra na oliheň': 'thriller',
  'Squid Game': 'thriller',
  'Zápisník smrti': 'anime',
  'Death Note': 'anime',
  'Love, Death & Robots': 'scifi',
  'Sexuální výchova': 'comedy',
  'Sex Education': 'comedy',
  'La Palma': 'thriller',
  'Otřes': 'documentary',
  'Saw': 'horror',
  'Blue Period': 'anime',
  'Modré období': 'anime',
  'The Silent Sea': 'scifi',
  'Ozark': 'crime',
  'Top Boy': 'crime',
  'Brothers': 'action',
  'Whiplash': 'drama',
  'The Alienist': 'crime',
  'Baby Reindeer': 'drama',
  'Monstrum': 'documentary',
  'Monstrum: Příběh Eda Geina': 'documentary',
  'The Conjuring': 'horror',
  'Conjuring': 'horror',
  'V zajetí démonů': 'horror',
  'All the Light We Cannot See': 'drama',
  'Parasyte': 'anime',
  'Black Phone': 'horror',
  'Schindler': 'drama',
  'Fight Club': 'thriller',
  'Klub rváčů': 'thriller',
  'DAHMER': 'crime',
  'Formula 1': 'documentary',
  'Outer Banks': 'action',
  'Bakugan': 'anime',
  'Elite': 'drama',
  'Elita': 'drama',
  'Junji Ito': 'horror',
  'Tokyo Ghoul': 'anime',
  'Crown': 'drama',
  'MINDHUNTER': 'crime',
  'Unsolved Mysteries': 'documentary',
  'Conversations with a Killer': 'documentary',
  'Tekken': 'anime',
  'Piklírna': 'animated',
  'Cloudy with a Chance': 'animated',
  'Zataženo': 'animated',
  'Mimoni': 'animated',
  'Minions': 'animated',
  'Despicable': 'animated',
  'Já, padouch': 'animated',
  'Madagaskar': 'animated',
  'Madagascar': 'animated',
  'Shrek': 'animated',
  'Kung Fu Panda': 'animated',
  'Puss in Boots': 'animated',
  'Kocour v botách': 'animated',
  'Bullet Train': 'action',
  'John Wick': 'action',
  'Inception': 'scifi',
  'Interstellar': 'scifi',
  'Fury': 'action',
  '1917': 'action',
  'Saving Private Ryan': 'action',
  'Hacksaw Ridge': 'action',
  'Revenant': 'drama',
  'Pianist': 'drama',
  'Night Agent': 'thriller',
  'American Psycho': 'thriller',
  'Midsommar': 'horror',
  'Blair Witch': 'horror',
  'Slender Man': 'horror',
  'Jaws': 'horror',
  'Werewolves': 'horror',
  '1408': 'horror',
  'Prestige': 'thriller',
  'Glass Onion': 'thriller',
  'Knives Out': 'thriller',
  'Society of the Snow': 'drama',
  'Snowpiercer': 'scifi',
  'Martian': 'scifi',
  'Apollo': 'documentary',
  'Everest': 'documentary',
  '14 vrcholů': 'documentary',
  'Chernobyl': 'documentary',
  'Terminal': 'drama',
  'Power of the Dog': 'drama',
  'Unbroken': 'drama',
  'Munich': 'documentary',
  'Split': 'thriller',
  'Red Notice': 'action',
  'Centrální inteligence': 'action',
  'Jumanji': 'action',
  'Karate Kid': 'action',
  'Pobřežní hlídka': 'action',
  'Baywatch': 'action',
  'Uncharted': 'action',
  'Mamma Mia': 'comedy',
  'EuroTrip': 'comedy',
  'Zombieland': 'comedy',
  'Jackass': 'comedy',
  'Norbit': 'comedy',
  'Johnny English': 'comedy',
  'Coach Carter': 'drama',
  'Díra': 'thriller',
  'Platform': 'thriller',
  'Polar': 'action',
  'Spiderhead': 'scifi'
};

// Keyword-based genre detection
// This function tries to find out the genre of a title based on keywords
function detectGenreByKeywords(title) {
  const lower = title.toLowerCase(); // Convert to lowercase for matching
  
  // Check for anime-specific indicators FIRST (most specific)
  // These are unique anime terms
  if (lower.includes('anime') || lower.includes('chapter') || 
      lower.includes('kimetsu') || lower.includes('jujutsu') || 
      lower.includes('hashira') || lower.includes('demon slayer') || 
      lower.includes('tokyo ghoul') || lower.includes('alchemist') || 
      lower.includes('black clover') || lower.includes('death note') ||
      lower.includes('cowboy bebop') || lower.includes('fullmetal')) {
    return 'anime';
  }
  
  // Horror (specific horror keywords)
  if (lower.includes('horror') || lower.includes('scary') || 
      lower.includes('sinister') || lower.includes('monstrum') ||
      lower.includes('conjuring') || lower.includes('nightmare') ||
      lower.includes('haunted')) return 'horror';
  
  // Thriller/Crime (murder, killer, etc.)
  if (lower.includes('killer') || lower.includes('murder') || 
      lower.includes('death') || lower.includes('crime') ||
      lower.includes('luther') || lower.includes('mindhunter') ||
      lower.includes('dahmer')) return 'thriller';
  
  // Action (fighting, war, battles)
  if (lower.includes('action') || lower.includes('fight') || 
      lower.includes('war') || lower.includes('battle') ||
      lower.includes('viking') || lower.includes('kingdom') ||
      lower.includes('john wick') || lower.includes('fury')) return 'action';
  
  // Sci-fi (space, technology, future)
  if (lower.includes('sci-fi') || lower.includes('space') || 
      lower.includes('alien') || lower.includes('black mirror') ||
      lower.includes('star') || lower.includes('cyber') ||
      lower.includes('interstellar')) return 'scifi';
  
  // Comedy (clear comedy indicators)
  if (lower.includes('comedy') || lower.includes('funny') || 
      lower.includes('rick and morty') || lower.includes('jackass') ||
      lower.includes('norbit')) return 'comedy';
  
  // Romance (love stories)
  if (lower.includes('love') || lower.includes('romance') || 
      lower.includes('kiss') || lower.includes('mamma mia')) return 'romance';
  
  // Fantasy (magic, wizards)
  if (lower.includes('magic') || lower.includes('witch') || 
      lower.includes('wizard') || lower.includes('potter') ||
      lower.includes('fantasy') || lower.includes('arcane') ||
      lower.includes('witcher')) return 'fantasy';
  
  // Documentary (factual content)
  if (lower.includes('documentary') || lower.includes('history') ||
      lower.includes('career') || lower.includes('apollo') ||
      lower.includes('chernobyl') || lower.includes('formula')) return 'documentary';
  
  // Western (cowboys, frontier)
  if (lower.includes('cowboy') || lower.includes('western') ||
      lower.includes('scruggs')) return 'western';
  
  // Default to drama
  return 'drama';
}

// Main genre assignment function, called for every show or movie
function assignGenre(title) {
  // First check if its in the manual list
  for (const [key, genre] of Object.entries(manualGenres)) {
    if (title.includes(key)) {
      return genre;
    }
  }
  
  // backup if its not on the manual list it assigns genre based on the keywords
  return detectGenreByKeywords(title);
}

// Export for use in main script
// gloobally accessible for other files
window.genreColors = genreColors;
window.assignGenre = assignGenre;
