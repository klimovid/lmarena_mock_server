/**
 * In-memory storage for mock server
 * Data resets on deployment (fine for mocking)
 */

import { v4 as uuidv4 } from 'uuid';
import type { User, Chat, Turn, Message } from './types';

// Storage maps
export const users = new Map<string, User>();
export const chats = new Map<string, Chat>();
export const turns = new Map<string, Turn>();
export const messages = new Map<string, Message[]>();
export const userChats = new Map<string, string[]>(); // userId -> chatIds[]

/**
 * Create a new user
 */
export const createUser = (): User => {
  const user: User = {
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  };
  
  users.set(user.id, user);
  userChats.set(user.id, []);
  
  return user;
};

/**
 * Create a new chat with initial turn
 */
export const createChat = (userId: string): { chat: Chat; turn: Turn } => {
  const chatId = uuidv4();
  const turnId = uuidv4();

  const chat: Chat = {
    id: chatId,
    userId,
    mode: 'battle',
    status: 'active',
    name: 'Untitled Chat',
    currentTurnId: turnId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const turn: Turn = {
    id: turnId,
    chatId,
    turnNumber: 1,
    status: 'waiting',
  };

  chats.set(chatId, chat);
  turns.set(turnId, turn);
  messages.set(turnId, []);
  
  // Add to user's chats
  const chatIds = userChats.get(userId) || [];
  chatIds.push(chatId);
  userChats.set(userId, chatIds);

  return { chat, turn };
};

/**
 * Get chat by ID
 */
export const getChat = (chatId: string): Chat | undefined => {
  return chats.get(chatId);
};

/**
 * Get turn by ID
 */
export const getTurn = (turnId: string): Turn | undefined => {
  return turns.get(turnId);
};

/**
 * Get all turns for a chat
 */
export const getChatTurns = (chatId: string): Turn[] => {
  const chatTurns: Turn[] = [];
  
  turns.forEach((turn) => {
    if (turn.chatId === chatId) {
      chatTurns.push(turn);
    }
  });
  
  return chatTurns.sort((a, b) => a.turnNumber - b.turnNumber);
};

/**
 * Get messages for a turn
 */
export const getTurnMessages = (turnId: string): Message[] => {
  return messages.get(turnId) || [];
};

/**
 * Add message to turn
 */
export const addMessage = (turnId: string, message: Message): void => {
  const turnMessages = messages.get(turnId) || [];
  turnMessages.push(message);
  messages.set(turnId, turnMessages);
};

/**
 * Update turn status
 */
export const updateTurnStatus = (
  turnId: string,
  status: Turn['status']
): void => {
  const turn = turns.get(turnId);
  if (turn) {
    turn.status = status;
    turns.set(turnId, turn);
  }
};

/**
 * Submit vote and reveal models
 */
export const submitVote = (
  turnId: string,
  winner: 'model_a' | 'model_b' | 'tie' | 'both_bad',
  modelA: { id: string; name: string; provider: string },
  modelB: { id: string; name: string; provider: string }
): { newTurnId: string } => {
  const turn = turns.get(turnId);
  if (!turn) {
    throw new Error('Turn not found');
  }

  // Update turn with vote and models
  turn.vote = winner;
  turn.status = 'voted';
  turn.modelA = modelA;
  turn.modelB = modelB;
  turns.set(turnId, turn);

  // Create new turn
  const newTurnId = uuidv4();
  const newTurn: Turn = {
    id: newTurnId,
    chatId: turn.chatId,
    turnNumber: turn.turnNumber + 1,
    status: 'waiting',
  };
  
  turns.set(newTurnId, newTurn);
  messages.set(newTurnId, []);

  // Update chat's current turn
  const chat = chats.get(turn.chatId);
  if (chat) {
    chat.currentTurnId = newTurnId;
    chat.updatedAt = new Date().toISOString();
    chats.set(turn.chatId, chat);
  }

  return { newTurnId };
};

/**
 * Get user's chats
 */
export const getUserChats = (userId: string): Chat[] => {
  const chatIds = userChats.get(userId) || [];
  return chatIds
    .map((id) => chats.get(id))
    .filter((chat): chat is Chat => chat !== undefined)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
};

/**
 * Initialize seed data for testing
 * Creates demo users and chats with sample conversations
 * Call this at the start of each API route to ensure data exists
 */
export const initializeSeedData = () => {
  // Only initialize once per instance
  if (users.size > 0) return;

  // Create multiple demo users
  const user1Id = 'demo-user-123';
  const user2Id = 'demo-user-456';
  const user3Id = 'demo-user-789';
  
  const user1: User = { id: user1Id, createdAt: new Date(Date.now() - 7 * 86400000).toISOString() };
  const user2: User = { id: user2Id, createdAt: new Date(Date.now() - 3 * 86400000).toISOString() };
  const user3: User = { id: user3Id, createdAt: new Date(Date.now() - 86400000).toISOString() };
  
  users.set(user1Id, user1);
  users.set(user2Id, user2);
  users.set(user3Id, user3);
  userChats.set(user1Id, []);
  userChats.set(user2Id, []);
  userChats.set(user3Id, []);

  // Helper to create chat
  const createDemoChat = (
    chatId: string,
    userId: string,
    name: string,
    category: string,
    daysAgo: number,
    userPrompt: string,
    responseA: string,
    responseB: string,
    status: 'voted' | 'completed' | 'waiting',
    vote?: 'model_a' | 'model_b' | 'tie' | 'both_bad'
  ) => {
    const turnId = `${chatId}-turn-1`;
    const msgIdBase = `${chatId}-msg`;
    
    const chat: Chat = {
      id: chatId,
      userId,
      mode: 'battle',
      status: status === 'voted' ? 'active' : 'active',
      name,
      currentTurnId: turnId,
      createdAt: new Date(Date.now() - daysAgo * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - (daysAgo * 86400000 - 3600000)).toISOString(),
    };

    const turn: Turn = {
      id: turnId,
      chatId,
      turnNumber: 1,
      status,
      ...(vote && { vote }),
      ...(status === 'voted' && {
        modelA: { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI' },
        modelB: { id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic' },
      }),
    };

    const turnMessages: Message[] = [
      {
        id: `${msgIdBase}-1`,
        turnId,
        role: 'user',
        content: userPrompt,
        sequenceNumber: 1,
        createdAt: new Date(Date.now() - daysAgo * 86400000).toISOString(),
      },
      {
        id: `${msgIdBase}-2`,
        turnId,
        role: 'assistant',
        content: responseA,
        modelId: 'model_a',
        sequenceNumber: 2,
        responseTimeMs: Math.floor(Math.random() * 2000) + 1000,
        createdAt: new Date(Date.now() - daysAgo * 86400000 + 3000).toISOString(),
      },
      {
        id: `${msgIdBase}-3`,
        turnId,
        role: 'assistant',
        content: responseB,
        modelId: 'model_b',
        sequenceNumber: 3,
        responseTimeMs: Math.floor(Math.random() * 2000) + 1000,
        createdAt: new Date(Date.now() - daysAgo * 86400000 + 5000).toISOString(),
      },
    ];

    chats.set(chatId, chat);
    turns.set(turnId, turn);
    messages.set(turnId, turnMessages);
    
    const userChatsArr = userChats.get(userId) || [];
    userChatsArr.push(chatId);
    userChats.set(userId, userChatsArr);
  };

  // User 1 Chats - Marketing Professional with diverse history
  createDemoChat(
    'chat-seo-blog-titles',
    user1Id,
    'SEO Blog Post Titles',
    'SEO',
    7,
    'Write 5 SEO-optimized blog post titles about sustainable fashion for 2026',
    "Here are 5 SEO-optimized blog post titles:\n\n1. \"10 Sustainable Fashion Brands Changing the Industry in 2026\"\n2. \"How to Build an Eco-Friendly Wardrobe: Complete Guide\"\n3. \"Sustainable Fashion vs Fast Fashion: What's the Real Cost?\"\n4. \"Best Eco-Friendly Fabrics: Materials That Matter\"\n5. \"Sustainable Fashion Trends 2026: What's Next?\"",
    "5 SEO-optimized titles for sustainable fashion:\n\n1. \"Sustainable Fashion 101: Beginner's Guide to Ethical Style\"\n2. \"Why Sustainable Fashion Matters: Environmental Impact Explained\"\n3. \"Top 15 Sustainable Fashion Influencers to Follow in 2026\"\n4. \"Sustainable Fashion on a Budget: 20 Money-Saving Tips\"\n5. \"The Future of Sustainable Fashion: 2026 Trends & Predictions\"",
    'voted',
    'model_a'
  );

  createDemoChat(
    'chat-meta-descriptions',
    user1Id,
    'Meta Descriptions for E-commerce',
    'SEO',
    6,
    'Generate meta descriptions for an online store selling organic skincare products',
    "Here are optimized meta descriptions for organic skincare:\n\n1. Homepage: \"Discover pure organic skincare products that nourish your skin naturally. Shop certified organic face creams, serums & more. Free shipping over $50.\"\n\n2. Product Category: \"Browse our collection of organic face care products. All-natural ingredients, cruelty-free, and eco-friendly packaging. Transform your skincare routine today.\"\n\n3. About Page: \"Learn about our commitment to organic skincare. Family-owned since 2010, we source the finest natural ingredients for radiant, healthy skin.\"",
    "Meta descriptions for organic skincare store:\n\n**Home**: \"Shop premium organic skincare made with natural ingredients. Certified organic, cruelty-free beauty products for all skin types. Get 15% off your first order!\"\n\n**Products**: \"Organic face care, body care & serums made with love. 100% natural ingredients. No parabens, sulfates or toxins. Your skin deserves the best.\"\n\n**About**: \"Our story: Creating organic skincare that works. Ethically sourced, sustainably packaged. Join thousands of happy customers who trust our natural beauty products.\"",
    'voted',
    'tie'
  );

  createDemoChat(
    'chat-linkedin-strategy',
    user1Id,
    'LinkedIn Content Calendar',
    'SMM',
    5,
    'Create a 30-day LinkedIn content calendar for a B2B SaaS company selling project management software',
    "30-Day LinkedIn Content Calendar for PM SaaS:\n\n**Week 1: Brand Awareness**\n- Day 1: Share company origin story\n- Day 2: Customer success spotlight\n- Day 3: Industry insights on remote work\n- Day 4: Team culture highlight\n- Day 5: Product feature demo (Gantt charts)\n\n**Week 2: Thought Leadership**\n- Day 8: Article on PM trends 2026\n- Day 9: How-to: Effective sprint planning\n- Day 10: Interview with PM expert\n- Day 11: Infographic: PM statistics\n- Day 12: Poll: Biggest PM challenges\n\n**Week 3: Value-Add Content**\n- Day 15: Free template: Project roadmap\n- Day 16: Video tutorial: Time tracking\n- Day 17: Case study: 300% efficiency boost\n- Day 18: User-generated content share\n- Day 19: Behind-the-scenes: Product dev\n\n**Week 4: Engagement & Conversion**\n- Day 22: Webinar announcement\n- Day 23: Customer testimonial video\n- Day 24: Product comparison guide\n- Day 25: Limited-time offer\n- Day 26: Q&A session recap",
    "Here's your LinkedIn strategy for project management SaaS:\n\n**Week 1: Foundation Building**\nMon: Company mission & values\nTue: Client transformation story\nWed: Remote work productivity tips\nThu: Meet the team series #1\nFri: Feature spotlight: Real-time collaboration\n\n**Week 2: Educational Content**\nMon: Guide to agile methodology\nTue: Common PM mistakes to avoid\nWed: Industry expert interview\nThu: Visual: PM tools comparison\nFri: Interactive poll on work habits\n\n**Week 3: Social Proof & Value**\nMon: ROI calculator tool (free)\nTue: Tutorial: Automating workflows\nWed: Enterprise client case study\nThu: Repost customer wins\nFri: Office tour & company culture\n\n**Week 4: Call-to-Action**\nMon: Live demo announcement\nTue: Video testimonials compilation\nWed: Feature comparison matrix\nThu: Flash sale for annual plans\nFri: AMA with founders",
    'completed'
  );

  createDemoChat(
    'chat-instagram-captions',
    user1Id,
    'Instagram Captions',
    'SMM',
    4,
    'Write 10 engaging Instagram captions for a coffee shop launching a new seasonal menu',
    "10 Instagram captions for coffee shop seasonal menu:\n\n1. ☕ Fall flavors are HERE! Our new Pumpkin Spice Macchiato is made with real pumpkin & love. Come taste autumn in a cup! #FallMenu #CoffeeLove\n\n2. 🍂 New season, new sips! Introducing our Maple Pecan Latte - sweet, nutty, and oh-so-cozy. Tag who you're bringing! #SeasonalSpecials\n\n3. ✨ What's better than regular coffee? Our NEW Cinnamon Apple Brew! Made fresh daily with organic apples. Limited time only! #CoffeeShop\n\n4. 🎃 The wait is over! Our seasonal menu dropped today. Swipe to see all 6 new drinks. Which one are you trying first? 👀\n\n5. 💛 Cozy vibes + seasonal flavors = the perfect combo. Our new menu was crafted with the coziest season in mind. Stop by today!\n\n6. 🍁 Behind every great day is a great coffee. Our autumn-inspired drinks are here to make your mornings magical. ☕\n\n7. 🎃 PSA: Our seasonal menu is LIVE! Featuring local ingredients & house-made syrups. Support local, sip seasonal!\n\n8. ☕ Plot twist: Our seasonal drinks taste even better than they look (and they look AMAZING). Come prove us wrong! 😏\n\n9. 🧡 Sweater weather calls for seasonal sips! All new drinks are made with organic ingredients. Because you deserve the best!\n\n10. ✨ Your favorite coffee shop just got even better! New menu, same great vibes. See you soon! ☕💕",
    "Instagram captions for your seasonal coffee menu launch:\n\n1. 🍂 IT'S TIME! Our fall menu is officially here and it's everything. First sip of our Pumpkin Cream Cold Brew hits different. Who's coming with? #NewMenu #FallVibes\n\n2. ☕ Seasonal sips are LIVE! We spent months perfecting these recipes and we can't wait for you to try them. Drop a 🎃 if you're excited!\n\n3. 🧡 NEW MENU ALERT! 6 handcrafted seasonal drinks made with locally-sourced ingredients. Swipe to drool over every single one →\n\n4. 🍁 When the leaves start falling, our seasonal menu starts calling. Featuring: Caramel Apple Latte, Brown Sugar Cinnamon Cold Brew, and MORE!\n\n5. ✨ Good things come to those who drink seasonal coffee. Our new menu just dropped and it's giving main character energy ☕💫\n\n6. 🎃 Your fall bucket list:\n□ Try our new Maple Pecan Latte\n□ Post an aesthetic coffee pic\n□ Tag us for a chance to win free drinks!\n\n7. 🍂 Plot twist: We made our seasonal menu even better this year. House-made syrups, organic ingredients, pure magic in every cup.\n\n8. ☕ The moment you've been waiting for... Our FALL MENU is here! Come taste why everyone's talking about our Cinnamon Dolce Macchiato!\n\n9. 💛 Cozy season = coffee season. Our new menu was designed for early mornings, rainy afternoons, and everything in between.\n\n10. 🧡 New menu, who dis? Same great coffee shop, elevated seasonal vibes. Your taste buds will thank you! See you soon! ✨",
    'completed'
  );

  createDemoChat(
    'chat-email-subject-lines',
    user1Id,
    'Email Marketing Subject Lines',
    'Content',
    3,
    'Create 15 email subject lines for a SaaS company announcing a product update',
    "15 Email Subject Lines for Product Update:\n\n1. 🚀 Your dashboard just got a major upgrade\n2. We listened: Here's what's new in [Product]\n3. You asked, we delivered - New features inside!\n4. [First Name], check out what we built for you\n5. This update will save you 10 hours per week\n6. LIVE NOW: The feature you've been requesting\n7. We made [Product] even better (see what's new)\n8. Your workflow is about to get way easier\n9. Big news: We just shipped something amazing\n10. The update everyone's talking about is here\n11. 3 new features that'll change how you work\n12. We upgraded [Product] - and you'll love it\n13. Ready for the best update yet? \n14. [First Name], this changes everything\n15. Your most-requested features are now live! 🎉",
    "Email subject lines for SaaS product update:\n\n1. ✨ LIVE: New features that'll transform your workflow\n2. We just made [Product] 10x better - See how\n3. [First Name], your requests became reality\n4. The upgrade you didn't know you needed (but will love)\n5. 🎯 New features alert: Productivity just got easier\n6. We shipped something special for you today\n7. This update is a game-changer - Here's why\n8. You're going to love what we just released\n9. Major update: [Product] is now more powerful\n10. BREAKING: The feature drop you've been waiting for\n11. [First Name], we listened & delivered 🚀\n12. Your work just got easier (thank us later)\n13. NEW: Features that save you hours every week\n14. This is our biggest update yet - Don't miss it\n15. 🔥 Hot off the press: Game-changing new features",
    'voted',
    'model_b'
  );

  createDemoChat(
    'chat-blog-outline',
    user1Id,
    'Blog Post Outline - AI Tools',
    'Content',
    2,
    'Create a detailed blog post outline about "Top AI Tools for Content Marketers in 2026"',
    "**Blog Post Outline: Top AI Tools for Content Marketers in 2026**\n\n**I. Introduction (200 words)**\n- Hook: How AI is revolutionizing content marketing\n- Brief history of AI in marketing (2020-2026)\n- Why content marketers need AI tools now\n- What this guide covers\n\n**II. Content Creation AI Tools (500 words)**\nA. Writing Assistants\n   - Tool #1: Copy.ai - Features, pricing, use cases\n   - Tool #2: Jasper - Best for long-form content\n   - Tool #3: ChatGPT Plus - Versatility and customization\n\nB. Visual Content Tools\n   - Tool #4: Midjourney - AI image generation\n   - Tool #5: Canva AI - Design automation\n\n**III. Content Optimization Tools (400 words)**\nA. SEO Optimization\n   - Tool #6: Surfer SEO - Content scoring\n   - Tool #7: Clearscope - Keyword research\n\nB. Readability & Engagement\n   - Tool #8: Hemingway AI - Simplifying content\n   - Tool #9: Grammarly Premium - Grammar & tone\n\n**IV. Social Media AI Tools (400 words)**\n- Tool #10: Buffer AI - Scheduling & optimization\n- Tool #11: Lately - Content repurposing\n- Tool #12: Hootsuite Insights - Analytics powered by AI\n\n**V. Analytics & Insights (300 words)**\n- Tool #13: Google Analytics 4 - AI predictions\n- Tool #14: Crayon - Competitive intelligence\n- Tool #15: BuzzSumo - Content research\n\n**VI. Comparison Table (Visual)**\n- Feature comparison of top 5 tools\n- Pricing comparison\n- Best use case for each\n\n**VII. How to Choose the Right AI Tool (300 words)**\n- Assess your needs\n- Budget considerations\n- Integration with existing stack\n- Trial periods and testing\n\n**VIII. Future Trends (200 words)**\n- What's coming in 2027\n- Emerging AI capabilities\n- How to stay ahead\n\n**IX. Conclusion (150 words)**\n- Recap of top tools\n- Final recommendations\n- CTA: Download our free AI tools comparison sheet\n\n**Total Word Count: ~2,450 words**",
    "**Complete Blog Outline: Top AI Tools for Content Marketers in 2026**\n\n**Title:** Top 15 AI Tools Every Content Marketer Needs in 2026\n\n**Meta Description:** Discover the best AI tools for content marketing in 2026. From content creation to analytics, find tools that boost productivity and ROI.\n\n---\n\n**Introduction (250 words)**\n- Opening hook: \"Content marketing just got 10x easier\"\n- The AI revolution in marketing (stats & trends)\n- Why this guide matters for your marketing strategy\n- Overview of categories covered\n\n**Section 1: AI Writing & Content Creation (600 words)**\n\n**1.1 Long-Form Content Generators**\n- Jasper AI: Features, pros/cons, pricing ($49-$125/mo)\n- Use case: Blog posts, articles, whitepapers\n- Real example with screenshots\n\n**1.2 Short-Form Copy Tools**\n- Copy.ai: Best for social media & ads\n- Features: 90+ templates, tone adjustment\n- Pricing: Free tier + $49/mo pro\n\n**1.3 AI Content Research**\n- ChatGPT-4: Research & ideation\n- Claude: Technical content & analysis\n- Tips for effective prompting\n\n**Section 2: Visual Content AI (400 words)**\n\n**2.1 Image Generation**\n- Midjourney v6: Creating brand visuals\n- DALL-E 3: Product mockups & concepts\n- Stable Diffusion: Customization options\n\n**2.2 Video AI Tools**\n- Synthesia: AI avatars & video creation\n- Descript: Video editing with AI\n- Runway ML: Creative video effects\n\n**Section 3: SEO & Optimization AI (500 words)**\n\n**3.1 SEO Content Optimization**\n- Surfer SEO: Content scoring (detailed review)\n- Frase: Outline generation & optimization\n- Clearscope: Topic clustering\n\n**3.2 Keyword Research**\n- SEMrush AI: Keyword magic tool\n- Ahrefs AI: Content gap analysis\n\n**Section 4: Social Media AI (450 words)**\n\n**4.1 Content Scheduling & Management**\n- Buffer AI Assistant: Optimal posting times\n- Hootsuite with AI: Multi-platform management\n\n**4.2 Social Content Creation**\n- Lately: Repurposing long content\n- Predis.ai: Social media posts generation\n\n**Section 5: Analytics & Performance (400 words)**\n- Google Analytics 4: AI insights\n- Sprout Social: Social listening AI\n- Crayon: Competitive intelligence\n\n**Section 6: Comparison & Decision Guide (350 words)**\n\n**6.1 Feature Comparison Matrix** (Table)\n- Price comparison\n- Key features side-by-side\n- Integration capabilities\n\n**6.2 How to Choose**\n- Define your content goals\n- Budget allocation tips\n- Free trial strategy\n- Team size considerations\n\n**Section 7: Implementation Strategy (300 words)**\n- Step 1: Audit current workflow\n- Step 2: Start with one tool category\n- Step 3: Train your team\n- Step 4: Measure ROI\n\n**Section 8: Future of AI in Content Marketing (250 words)**\n- Emerging trends for 2027\n- Predicted new capabilities\n- How to future-proof your strategy\n\n**Conclusion (200 words)**\n- Key takeaways summary\n- Top 3 tools to start with\n- CTA: Download free AI tools cheat sheet\n\n**Additional Elements:**\n- Infographic: AI Tools Ecosystem Map\n- Video: \"5-Minute Tour of Top 3 Tools\"\n- Downloadable: Comparison spreadsheet\n- FAQ Section (10 common questions)\n\n**Total: ~3,200 words**\n**Estimated Read Time: 12-14 minutes**",
    'completed'
  );

  // User 2 Chats - E-commerce Marketer
  createDemoChat(
    'chat-product-descriptions',
    user2Id,
    'Product Descriptions - Tech',
    'Content',
    3,
    'Write compelling product descriptions for wireless noise-cancelling headphones',
    "**Premium Wireless Noise-Cancelling Headphones**\n\n**Experience Sound Like Never Before**\n\nImmerse yourself in crystal-clear audio with our flagship wireless headphones. Advanced active noise cancellation technology blocks out the world, letting you focus on what matters - your music, podcasts, or calls.\n\n**Key Features:**\n• Industry-leading ANC reduces ambient noise by up to 95%\n• 30-hour battery life (with ANC on)\n• Premium memory foam ear cushions for all-day comfort\n• Bluetooth 5.3 for stable, lag-free connection\n• Built-in microphones with AI noise reduction\n• Foldable design with luxury travel case included\n\n**Why Customers Love Them:**\n\"Best headphones I've ever owned. The noise cancellation is incredible!\" - Sarah M.\n\n**Perfect For:**\n- Daily commutes and travel\n- Remote work and video calls\n- Music production and audio editing\n- Gaming and entertainment\n\n**In The Box:**\n- Wireless headphones\n- Premium hard-shell case\n- USB-C charging cable\n- 3.5mm audio cable\n- Airplane adapter\n\n**Specifications:**\n- Driver size: 40mm\n- Frequency response: 20Hz - 40kHz\n- Weight: 250g\n- Available in: Midnight Black, Silver Gray, Rose Gold\n\n**30-Day Money-Back Guarantee | Free Shipping | 2-Year Warranty**",
    "**Ultimate Noise-Cancelling Wireless Headphones - Your Sound Sanctuary**\n\n**Escape the Noise. Embrace the Music.**\n\nTransform your listening experience with headphones engineered for audiophiles and everyday users alike. Our advanced ANC technology doesn't just reduce noise - it eliminates it.\n\n**🎵 What Makes These Special:**\n\n**Unmatched Sound Quality**\nPrecision-tuned 40mm drivers deliver rich bass, clear mids, and sparkling highs. Whether you're listening to classical, hip-hop, or podcasts, every detail comes through perfectly.\n\n**Elite Noise Cancellation**\nDual-microphone system with AI algorithms blocks up to 98% of ambient noise. Airplane engines, traffic, noisy offices - consider them silenced.\n\n**All-Day Comfort**\nUltra-soft protein leather ear cushions and adjustable headband mean you can wear these for hours without fatigue. Designed for marathon listening sessions.\n\n**Impressive Battery Life**\n- 35 hours with ANC on\n- 50 hours with ANC off  \n- Quick charge: 10 mins = 5 hours\n\n**Smart Features:**\n✓ Multipoint Bluetooth (connect 2 devices simultaneously)\n✓ Automatic pause when you remove them\n✓ Voice assistant compatible (Siri, Google Assistant, Alexa)\n✓ Transparency mode to hear your surroundings\n✓ EQ customization via companion app\n\n**Who These Are For:**\n✈️ Frequent travelers who need peace\n🎮 Gamers wanting immersive audio\n💼 Remote workers taking endless calls\n🎵 Music lovers who demand quality\n\n**Premium Accessories Included:**\n- Hard-shell travel case\n- USB-C fast charging cable\n- 3.5mm aux cable (for wired use)\n- Airline adapter\n- Cleaning cloth\n\n**Technical Specs:**\n• Weight: 245g (incredibly light)\n• Bluetooth 5.3 with extended range\n• Frequency: 20Hz-40kHz (Hi-Res certified)\n• Folds flat for easy storage\n\n**Customer Reviews:** ⭐⭐⭐⭐⭐ 4.8/5 (2,847 reviews)\n\n*\"These are worth every penny. The noise cancellation is witchcraft.\" - Mike R.*\n\n**Risk-Free Purchase:**\n✓ 45-day return window\n✓ 2-year manufacturer warranty  \n✓ Free shipping & returns\n✓ Lifetime customer support\n\n**Available Colors:** Jet Black | Pearl White | Navy Blue | Copper Rose\n\n**Order now and get a FREE premium carrying pouch ($29 value)**",
    'voted',
    'model_b'
  );

  createDemoChat(
    'chat-facebook-ads',
    user2Id,
    'Facebook Ad Copy - Spring Sale',
    'Ads',
    2,
    'Write 5 Facebook ad copies for a spring sale at an online clothing store. Target audience: women 25-40, fashion-conscious, budget-aware',
    "**Facebook Ad Copy - Spring Sale Campaign**\n\n**Ad 1: Headline + Body**\n🌸 Spring Collection: Up to 60% OFF\n\nFresh styles, fresh prices! Refresh your wardrobe with trending pieces starting at just $19. Limited time spring sale - because you deserve to look amazing without breaking the bank.\n\n👗 Shop dresses, tops, jeans & more\n💳 Free shipping over $50\n⏰ Sale ends Sunday!\n\n[Shop Now]\n\n---\n\n**Ad 2: Urgency Focus**\n⚡ FLASH: Spring Clearance is LIVE!\n\nYour dream wardrobe is 60% closer to reality. Hundreds of styles marked down - but they're selling FAST. Don't miss out on these once-a-year prices!\n\n✨ New arrivals included\n💰 Prices you'll actually love\n🚚 Fast, free shipping\n\n[Shop Before It's Gone]\n\n---\n\n**Ad 3: Value Proposition**\n💕 Spring Refresh: Look Amazing for Less\n\nHigh style, low prices. Our spring sale means premium quality at everyday prices. Trendy pieces that'll make you feel confident - without the guilt.\n\n🌟 Sizes XS-3XL available\n💳 Easy returns within 30 days\n📦 Order today, wear this weekend\n\n[Get Your Spring Look]\n\n---\n\n**Ad 4: Social Proof**\n⭐ 50,000+ Women Agree: Best Sale of the Season!\n\n\"I got 5 pieces for under $100!\" - Jessica M.\n\nOur customers are raving about this sale. Premium fashion at clearance prices. Spring styles that'll take you from coffee dates to dinner parties.\n\n✅ 4.9★ rating (12k reviews)\n💝 Styled by you, loved by thousands\n\n[Join the Fashion Family]\n\n---\n\n**Ad 5: FOMO + Exclusivity**\n🎯 VIP Access: Spring Sale Early Entry\n\nBefore everyone else finds out... Get first pick of our biggest sale! Spring pieces flying off the shelves. Smart shoppers are already saving big.\n\n⏱️ 48 hours only\n🎁 Extra 10% off your first order\n📱 Shop from your couch\n\n[Claim Your Deal Now]",
    "**5 Facebook Ad Variations - Spring Sale**\n\n**AD #1: The Deal Hunter**\nHeadline: Spring Savings Up to 60% OFF Everything 🌸\n\nBody:\nYour closet called... it needs a spring refresh! Get runway-worthy styles at prices that'll make you smile.\n\n✨ What's Included:\n→ Flowy spring dresses from $24\n→ Designer-inspired tops from $19  \n→ Premium denim under $40\n→ Accessories to complete your look\n\n🎁 BONUS: Free shipping on orders $50+\n⏰ Sale ends in 3 days - Shop before your size sells out!\n\n[Shop Spring Sale] →\n\n---\n\n**AD #2: The Transformation Story**\nHeadline: Transform Your Wardrobe This Spring\n\nBody:\nSpring = New beginning = New you!\n\nReady to feel confident in every outfit? Our spring collection is all about effortless style that transitions from WFH to weekend brunch.\n\n💕 Why Women Love Us:\n✓ Real clothes for real life\n✓ Quality that lasts beyond one season\n✓ Styles that make YOU feel like YOU\n\n🌷 Spring Sale: Save up to 60%\n🚚 Free shipping + free returns\n👗 Every style, every size\n\n[Find Your Perfect Spring Look]\n\n---\n\n**AD #3: The Urgency Play**\nHeadline: 🚨 SPRING CLEARANCE: 60% OFF (Ends Sunday!)\n\nBody:\nTick tock! ⏰\n\nHundreds of spring styles at unbeatable prices. But here's the thing - your favorites are selling out FAST.\n\nWhat customers are saying:\n\"I waited and my size sold out. Don't make my mistake!\" - Sarah K.\n\n🔥 Best sellers going quick:\n→ Linen blend dresses  \n→ Wide-leg trousers\n→ Floral print tops\n\n💳 Afterpay available\n📦 Ships within 24 hours\n\n[Shop Now Before It's Too Late]\n\n---\n\n**AD #4: The Community Vibe**\nHeadline: Join 50K+ Women Loving Their Spring Style ✨\n\nBody:\nYou're not just buying clothes - you're joining a community of women who believe style shouldn't cost a fortune.\n\n📸 Real customers, real reviews:\n⭐⭐⭐⭐⭐ \"Best online shopping experience!\" - Emma\n⭐⭐⭐⭐⭐ \"Quality exceeded expectations\" - Michelle\n⭐⭐⭐⭐⭐ \"Finally, clothes that fit perfectly\" - Jasmine\n\n🌸 Spring Sale Perks:\n• 60% off sitewide\n• Free styling tips with every order\n• Hassle-free 30-day returns\n• Size-inclusive: XS-3XL\n\n[Discover Your New Favorites]\n\n---\n\n**AD #5: The Smart Shopper**\nHeadline: Smart Women Shop Our Spring Sale (Here's Why)\n\nBody:\nBecause looking good shouldn't mean spending more.\n\n🧠 The Math:\n→ Average cart: $150\n→ With 60% off: Just $60\n→ Money saved: $90 (for brunch, vacay, or savings!)\n\nGet the styles you've been eyeing:\n🌿 Sustainable fabrics\n👗 Versatile pieces (mix & match)\n💼 Work-to-weekend essentials\n\n✅ Use code SPRING60 at checkout\n✅ Free shipping (no minimum!)\n✅ Pay in 4 interest-free installments\n\n[Shop Smart, Save Big]",
    'voted',
    'model_a'
  );

  createDemoChat(
    'chat-tiktok-hooks',
    user2Id,
    'TikTok Video Hooks',
    'SMM',
    1,
    'Create 20 engaging TikTok video hooks for a fitness brand targeting beginners',
    "**20 TikTok Video Hooks - Fitness for Beginners**\n\n1. \"POV: You just realized working out doesn't have to be miserable...\"\n2. \"Nobody tells you this about starting your fitness journey...\"\n3. \"I was 200lbs and couldn't do 1 push-up. Here's what changed everything:\"\n4. \"Stop doing cardio. Do THIS instead if you're a beginner:\"\n5. \"The gym can be intimidating. Here's your first-day survival guide:\"\n6. \"3 mistakes I made as a beginner (so you don't have to):\"\n7. \"You don't need a gym membership. You just need these 5 exercises:\"\n8. \"Day 1 vs Day 100 - This transformation is INSANE 🤯\"\n9. \"Personal trainers HATE this one simple workout trick...\"\n10. \"If you're out of breath tying your shoes, this is for you:\"\n11. \"I tried every beginner workout plan. Only ONE actually worked:\"\n12. \"The truth about 'easy' beginner workouts (they're lying to you):\"\n13. \"Start here if you haven't worked out in 5+ years:\"\n14. \"This 10-minute routine replaced my 1-hour gym sessions:\"\n15. \"Why you're not seeing results (even though you're trying hard):\"\n16. \"I learned more in 30 days than most people learn in years:\"\n17. \"Unpopular opinion: You're starting your fitness journey all wrong...\"\n18. \"My doctor said to exercise. I had NO IDEA where to start until...\"\n19. \"The only 3 exercises you need as a complete beginner:\"\n20. \"I wish someone told me THIS before I started working out:\"\n\n**Bonus Tips:**\n- Start with a pain point or relatable moment\n- Use pattern interrupts (\"Stop,\" \"Wait,\" \"Listen\")\n- Create curiosity gaps\n- Make bold claims (but deliver on them!)\n- Use numbers for specificity",
    "**20 Killer TikTok Hooks - Fitness Beginners Edition**\n\n1. \"If you can only do 5 push-ups, watch this...\" 💪\n2. \"Fitness coaches don't want you to know this beginner secret:\"\n3. \"I went from couch potato to running 5K in 30 days. Here's how:\"\n4. \"This is what NO ONE tells beginners about getting fit...\"\n5. \"Plot twist: The gym is NOT the fastest way to get in shape.\"\n6. \"You're doing beginner workouts wrong. Here's the right way:\"\n7. \"Me explaining why 10 minutes > 1 hour at the gym:\"\n8. \"I tried the 'easiest' beginner workout. It was NOT easy:\"\n9. \"Stop! Don't join a gym until you watch this:\"\n10. \"The biggest lie about fitness for beginners...\"\n11. \"Started at 250lbs, couldn't walk up stairs. Now I'm running marathons:\"\n12. \"Why your 'beginner' workout isn't working (3 fixes):\"\n13. \"POV: You're about to learn fitness isn't about torture:\"\n14. \"This changed my entire approach to fitness as a beginner:\"\n15. \"I spent $5K on trainers. Wish I knew this free secret instead:\"\n16. \"If you hate working out, you've been doing it WRONG:\"\n17. \"The only workout routine that actually stuck for me:\"\n18. \"Doctor said 'lose weight or else.' I had to figure this out fast:\"\n19. \"3 exercises that changed everything (no gym needed):\"\n20. \"Real talk: Here's what the first month of fitness REALLY looks like:\"\n\n**Hook Formula Breakdown:**\n✓ Promise transformation (\"I went from X to Y\")\n✓ Challenge beliefs (\"The gym is NOT...\")\n✓ Create curiosity (\"No one tells you...\")\n✓ Share secrets (\"Coaches don't want you to know...\")\n✓ Solve pain points (\"If you hate working out...\")\n✓ Use contrast (\"Before vs After\")\n✓ Break myths (\"The biggest lie...\")\n\n**Pro Tips:**\n- Keep first 3 words punchy\n- Ask a question or make a bold claim\n- Speak directly to viewer's pain\n- Promise quick value\n- Use emojis sparingly but strategically",
    'completed'
  );

  // User 3 Chats - Startup Founder
  createDemoChat(
    'chat-pitch-deck',
    user3Id,
    'Pitch Deck Outline',
    'Business',
    1,
    'Create a pitch deck outline for a B2B SaaS startup in the HR tech space',
    "**Pitch Deck Outline - HR Tech B2B SaaS**\n\n**Slide 1: Cover**\n- Company name + logo\n- Tagline: \"Transforming HR through AI\"\n- Your name, title\n- Date & purpose (Series A funding)\n\n**Slide 2: The Problem**\n- HR teams spend 60% of time on manual tasks\n- Traditional HR software is outdated (built in 2010s)\n- Employee engagement is at all-time low (Gallup: 32%)\n- Cost: $4,000 per bad hire\n- Visual: Pain point illustrations\n\n**Slide 3: The Solution**\n- Introduce your product name\n- AI-powered HR platform that automates:\n  • Recruitment & screening\n  • Onboarding workflows\n  • Performance reviews\n  • Employee engagement analytics\n- Key differentiator: Uses GPT-4 for personalization\n- Screenshot or product demo preview\n\n**Slide 4: How It Works**\n- 3-step process with visuals:\n  1. Connect existing tools (Slack, Gmail, Calendar)\n  2. AI learns your company culture\n  3. Automates 70% of HR tasks\n- Technical architecture (simple diagram)\n\n**Slide 5: Market Opportunity**\n- TAM (Total Addressable Market): $30B\n- SAM (Serviceable Available): $8B\n- SOM (Serviceable Obtainable): $400M\n- Growth rate: 12% CAGR\n- Source: Gartner 2026\n\n**Slide 6: Business Model**\n- Pricing tiers:\n  • Starter: $99/month (up to 50 employees)\n  • Growth: $299/month (51-200)\n  • Enterprise: Custom pricing\n- ARR (Annual Recurring Revenue) model\n- CAC:LTV ratio: 1:4\n- Average contract: $3,600/year\n\n**Slide 7: Traction**\n- 50 paying customers (from 0 in 6 months)\n- $180K ARR\n- 98% customer retention\n- 4.8/5 G2 rating (45 reviews)\n- Customer logos (if notable companies)\n\n**Slide 8: Competition**\n- Quadrant chart: Innovation vs Ease of Use\n- Competitors: BambooHR, Workday, Gusto\n- Your position: High innovation, high ease\n- Key advantages:\n  ✓ AI-first approach\n  ✓ 10x faster setup\n  ✓ 40% lower price point\n\n**Slide 9: Go-to-Market Strategy**\n- Channel 1: Inbound (SEO + Content)\n- Channel 2: Partnerships (HR consultants)\n- Channel 3: Sales team (3 SDRs, 2 AEs)\n- CAC: $1,200\n- Payback period: 8 months\n\n**Slide 10: Team**\n- Founder/CEO: Name, previous exit at $50M\n- CTO: Ex-Google, 15 years engineering\n- Head of Sales: Scaled 3 SaaS companies to $10M+\n- Advisors: Notable names in HR tech\n- Team photos\n\n**Slide 11: Financials**\n- Revenue projection (next 3 years)\n- Path to profitability: Month 24\n- Current burn rate: $50K/month\n- Runway: 18 months\n\n**Slide 12: The Ask**\n- Raising: $2M Series A\n- Use of funds:\n  • 50% - Product development\n  • 30% - Sales & marketing\n  • 20% - Operations\n- Milestones with this funding:\n  • Reach $1M ARR\n  • Expand to 200 customers\n  • Launch mobile app\n\n**Slide 13: Vision**\n- 3-year goal: Lead AI-powered HR transformation\n- 5-year goal: IPO or strategic acquisition\n- Impact: Help 10,000 companies build better workplaces\n\n**Slide 14: Contact**\n- Email, phone, LinkedIn\n- Website & demo link\n- \"Let's build the future of HR together\"\n\n**Appendix (5-10 slides)**\n- Detailed financials\n- Product roadmap\n- Customer case studies\n- Technical deep-dive\n- Market research data",
    "**Complete Pitch Deck Structure - HR Tech SaaS**\n\n**SLIDE 1: TITLE**\n[Company Logo]\n\"The AI-Powered HR Platform for Modern Companies\"\n- Founded: 2025\n- Seeking: $2M Series A\n- Contact: founders@company.com\n\n---\n\n**SLIDE 2: THE PROBLEM (Make it visceral)**\n**\"HR Teams Are Drowning\"**\n\n📊 Key Stats:\n• 60% of HR time = manual data entry\n• 14 different tools used by average HR team\n• $7,500 average cost per bad hire\n• 70% of employees feel disconnected from company\n\nVisual: Overwhelmed HR person surrounded by papers\n\nQuote: \"We spend more time on admin than our people\" - CHRO, TechCorp\n\n---\n\n**SLIDE 3: THE SOLUTION**\n**[Your Product Name]**\n\"One AI-powered platform that replaces 14 tools\"\n\n✨ What We Do:\n→ AI recruitment (cuts time by 80%)\n→ Automated onboarding workflows\n→ Real-time employee sentiment analysis\n→ Predictive retention insights\n\nThe Magic: Our AI learns your culture, not just processes\n\n[Product Screenshot]\n\n---\n\n**SLIDE 4: PRODUCT DEMO**\n(Visual walkthrough)\n\n**3 Steps to Transform Your HR:**\n1️⃣ Connect: Plug into existing tools (15 min setup)\n2️⃣ Train: AI learns from your best hires (automatic)\n3️⃣ Automate: 70% of tasks run on autopilot\n\n**Live Demo:** [QR Code to video]\n\n---\n\n**SLIDE 5: WHY NOW?**\n**Perfect Storm of Timing:**\n\n📈 Macro Trends:\n• Remote work = HR complexity ↑300%\n• Gen Z expects AI-first experiences\n• HR tech spending ↑ 15% YoY\n• GPT-4 makes this possible (launched 2023)\n\n💡 Market Readiness: Legacy tools built for offices, not remote world\n\n---\n\n**SLIDE 6: MARKET SIZE**\n**$30B and Growing Fast**\n\nTAM (Total): $30B (Global HR software)\nSAM (Available): $8B (SMB + Mid-market, US)\nSOM (Target): $400M (AI-first segment)\n\nGrowth: 12% CAGR (2026-2030)\nSource: Gartner, Forrester\n\n[Visual: Concentric circles]\n\n---\n\n**SLIDE 7: BUSINESS MODEL**\n**Predictable SaaS Revenue**\n\n💰 Pricing:\n• Starter: $99/mo (1-50 employees)\n• Professional: $299/mo (51-200)\n• Enterprise: $999/mo (201-1000)\n• Custom: $2K+ (1000+)\n\n📊 Unit Economics:\n• LTV: $18,000\n• CAC: $1,200\n• LTV:CAC = 15:1\n• Payback: 7 months\n• Gross Margin: 85%\n\n---\n\n**SLIDE 8: TRACTION**\n**Growing 40% Month-over-Month**\n\n✅ Metrics (as of Dec 2026):\n• 75 paying customers\n• $270K ARR\n• 150% net revenue retention\n• 97% customer satisfaction\n• 4.9★ G2 rating\n\n📈 Growth Chart: MRR last 12 months (hockey stick)\n\n🎯 Notable Customers:\n[Logos: 5-8 recognizable companies]\n\n---\n\n**SLIDE 9: CUSTOMER SUCCESS**\n**Case Study: TechStart Inc**\n\n*Before [Product]:*\n• 40 hours/week on HR admin\n• 6-month average hiring time\n• 30% turnover rate\n\n*After [Product]:*\n• 8 hours/week on HR admin (80% reduction)\n• 3-week average hiring time (93% faster)\n• 12% turnover rate (60% improvement)\n\n*ROI: 8x in first year*\n\n\"Game-changer for our team\" - Sarah M., Head of People\n\n---\n\n**SLIDE 10: COMPETITION**\n**We're Different (and Better)**\n\n[2x2 Matrix: Innovation vs Ease of Use]\n\n**Legacy Players:**\n• Workday (enterprise, complex, $$$)\n• BambooHR (outdated tech)\n• Gusto (payroll-focused only)\n\n**Our Advantages:**\n✓ AI-first (not AI-added)\n✓ 10x faster onboarding\n✓ 3x lower price\n✓ Built for remote-first\n\n---\n\n**SLIDE 11: GO-TO-MARKET**\n**Multi-Channel Growth Engine**\n\n🎯 Current Channels:\n1. **Inbound** (50% of deals)\n   - SEO + Content (HR blog)\n   - Product-led growth (free trial)\n\n2. **Partnerships** (30%)\n   - HR consultants (15 partners)\n   - Integration marketplace\n\n3. **Outbound** (20%)\n   - Sales team: 2 SDRs, 1 AE\n   - LinkedIn outreach\n\n📊 CAC by Channel:\n- Inbound: $800\n- Partners: $600\n- Outbound: $2,000\n\n---\n\n**SLIDE 12: ROADMAP**\n**Next 18 Months**\n\nQ1 2027:\n✓ Mobile app launch\n✓ Slack/Teams deep integration\n\nQ2-Q3:\n✓ AI interview assistant\n✓ Predictive attrition model\n✓ Compensation benchmarking\n\nQ4:\n✓ Global expansion (EU, UK)\n✓ Enterprise features\n✓ White-label option\n\n---\n\n**SLIDE 13: TEAM**\n**We've Built & Scaled Before**\n\n👨‍💼 **Jane Doe** - CEO\n• Ex-Founder of HRTech Co (acquired $50M)\n• 10 years HR tech experience\n• Stanford MBA\n\n👨‍💻 **John Smith** - CTO\n• Ex-Google Staff Engineer\n• Built AI systems at scale\n• PhD Computer Science (MIT)\n\n👩‍💼 **Sarah Johnson** - Head of Sales\n• Scaled 3 SaaS companies to $10M+\n• 15 years enterprise sales\n• Ex-Salesforce\n\n**Advisors:**\n• [Notable VC Partner]\n• [Fortune 500 CHRO]\n\n---\n\n**SLIDE 14: FINANCIALS**\n**Path to $10M ARR**\n\n[Table: 3-Year Projection]\n| Metric | 2026 | 2027 | 2028 |\n|--------|------|------|------|\n| ARR | $300K | $2M | $8M |\n| Customers | 80 | 400 | 1,500 |\n| Team Size | 8 | 25 | 60 |\n| Burn | $50K/mo | $120K/mo | Break-even |\n\n💰 Current Status:\n• Bank: $900K\n• Burn: $50K/month\n• Runway: 18 months\n\n---\n\n**SLIDE 15: THE ASK**\n**Raising $2M to Scale**\n\n📊 **Use of Funds:**\n• 50% Product & Engineering ($1M)\n  → Mobile app, AI features\n• 35% Sales & Marketing ($700K)\n  → Grow team 5→15 people\n• 15% Operations ($300K)\n  → Infrastructure, legal, admin\n\n🎯 **Milestones with Funding:**\n• $2M ARR by end of 2027\n• 400 customers\n• Launch in 2 new markets\n• Raise Series B ($8M+)\n\n**Valuation: $8M pre-money**\n(Based on 4x ARR at $2M run rate)\n\n---\n\n**SLIDE 16: VISION**\n**Building the Future of Work**\n\n🚀 3-Year Goal:\n\"Become the default HR platform for modern companies\"\n\n🌍 5-Year Goal:\n• 10,000 customers\n• $100M ARR\n• IPO or strategic exit\n\n💫 Impact:\nHelp companies build workplaces where people thrive\n\n---\n\n**SLIDE 17: CLOSING**\n\n\"The future of HR is AI-powered.\nWe're building it.\nJoin us.\"\n\n📧 Contact:\n- Email: jane@company.com\n- Demo: company.com/demo\n- Deck: company.com/investors\n\n[Photo: Team + Product]\n\n---\n\n**APPENDIX (Ready if asked)**\n\nA1: Detailed financial model (5 years)\nA2: Customer testimonials (video links)\nA3: Technical architecture\nA4: Competitive analysis deep-dive\nA5: Market research data\nA6: Product roadmap (detailed)\nA7: Team bios (full)\nA8: Cap table\nA9: Legal & IP\nA10: References",
    'completed'
  );

  createDemoChat(
    'chat-landing-page',
    user3Id,
    'Landing Page Copy',
    'Website',
    0.5,
    'Write conversion-focused landing page copy for an AI-powered email marketing tool for small businesses',
    "**Landing Page Copy - AI Email Marketing Tool**\n\n---\n\n**HERO SECTION**\n\n**Headline:**\nEmail Marketing That Actually Works  \n(Powered by AI, Made for Small Business)\n\n**Subheadline:**\nStop guessing what emails to send. Our AI writes, designs, and optimizes campaigns that get opened, clicked, and convert. Get your first campaign live in 5 minutes.\n\n**CTA Buttons:**\n[Start Free Trial] [Watch Demo Video]\n\n**Trust Badges:**\n✓ No credit card required  \n✓ 14-day free trial  \n✓ Cancel anytime\n\n**Hero Image:**\nDashboard screenshot showing AI writing an email + open rates graph going up\n\n---\n\n**PROBLEM SECTION**\n\n**Headline:**\nEmail Marketing Shouldn't Be This Hard\n\n**Pain Points:**\n❌ Spend hours writing emails (that nobody opens)\n❌ Pay $500/month for tools you don't understand\n❌ Hire expensive agencies that don't deliver\n❌ Watch competitors get better results\n\n**Transition:**\n\"There's a better way. Meet [Product Name].\"\n\n---\n\n**SOLUTION SECTION**\n\n**Headline:**\nYour AI Email Marketing Assistant\n\n**Subheadline:**\nWe handle the hard parts so you can focus on running your business\n\n**Feature Grid (3 columns):**\n\n**1. AI Writing**\n🤖 Just tell our AI about your business. It writes compelling emails in your voice - from subject lines to CTAs.\n\n**2. Smart Automation**\n⚡ Welcome sequences, abandoned carts, win-backs - all set up automatically. No coding required.\n\n**3. Predictive Analytics**\n📊 AI predicts best send times, optimizes subject lines, and tells you exactly what to improve.\n\n---\n\n**HOW IT WORKS SECTION**\n\n**Headline:**\n3 Steps to Better Email Marketing\n\n**Step 1: Connect**\nLink your existing email list (or start fresh). Works with Shopify, WordPress, and 50+ platforms.\n\n**Step 2: Let AI Create**\nDescribe what you want to send. AI writes the email, designs the template, and suggests improvements.\n\n**Step 3: Send & Win**\nSchedule or send immediately. Watch real-time analytics and let AI optimize future campaigns.\n\n[Animated GIF showing these 3 steps]\n\n---\n\n**RESULTS SECTION**\n\n**Headline:**\nReal Businesses, Real Results\n\n**Stats Row:**\n📈 +156% Average Open Rates  \n💰 +$45K Revenue Generated  \n⏱️ 12 Hours Saved Per Week  \n⭐ 4.9/5 Customer Rating\n\n**Testimonials (3 cards):**\n\n\"[Product] transformed our email game. We went from 12% to 34% open rates in just two months. The AI suggestions are spot-on!\"\n- Jessica M., Boutique Owner\n\n\"I was spending $800/month on an agency. Now I pay $49 and get BETTER results. Wish I found this sooner.\"\n- Mike R., E-commerce Store\n\n\"As a solopreneur, I don't have time for email marketing. [Product] literally does it for me. Best investment all year.\"\n- Sarah K., Consultant\n\n---\n\n**FEATURES DEEP DIVE**\n\n**Headline:**\nEverything You Need to Succeed\n\n**Feature List (2 columns):**\n\n✅ AI Email Writer  \n✅ Drag-&-drop Designer  \n✅ 100+ Templates  \n✅ A/B Testing (Automated)  \n✅ Segmentation & Personalization  \n✅ Campaign Analytics  \n✅ Mobile Optimization  \n✅ Spam Score Checker  \n✅ Automation Workflows  \n✅ Contact Management  \n✅ Integrations (Shopify, WooCommerce, etc.)  \n✅ 24/7 Support\n\n---\n\n**PRICING SECTION**\n\n**Headline:**\nSimple, Transparent Pricing\n\n**Pricing Cards (3 tiers):**\n\n**Starter - $29/month**\n→ Up to 1,000 subscribers\n→ Unlimited emails\n→ AI email writer\n→ Basic templates\n→ Email support\n[Start Free Trial]\n\n**Growth - $49/month** ⭐ MOST POPULAR\n→ Up to 5,000 subscribers\n→ Everything in Starter\n→ Advanced automation\n→ A/B testing\n→ Priority support\n[Start Free Trial]\n\n**Pro - $99/month**\n→ Up to 25,000 subscribers\n→ Everything in Growth\n→ Dedicated account manager\n→ Custom integrations\n→ Phone support\n[Start Free Trial]\n\n**Note:** All plans include 14-day free trial. No credit card required.\n\n---\n\n**COMPARISON SECTION**\n\n**Headline:**\nWhy Choose Us Over [Competitors]?\n\n**Comparison Table:**\n\n| Feature | [Product] | Mailchimp | Constant Contact |\n|---------|-----------|-----------|------------------|\n| AI Writing | ✅ | ❌ | ❌ |\n| Easy Setup | ✅ (5 min) | ⚠️ (2 hours) | ⚠️ (1 hour) |\n| Price | $29/mo | $350/mo | $280/mo |\n| Support | 24/7 | Business hours | Email only |\n| Automation | ✅ Smart | ✅ Manual | ⚠️ Limited |\n\n---\n\n**FAQ SECTION**\n\n**Q: Do I need technical skills?**\nA: Nope! If you can send an email, you can use [Product]. Our AI does the technical stuff.\n\n**Q: What if I don't have a list yet?**\nA: Perfect! We'll help you build one. Our signup forms and integrations make list-building easy.\n\n**Q: Can I cancel anytime?**\nA: Yes. No contracts, no penalties. Cancel in one click.\n\n**Q: How is this different from ChatGPT?**\nA: Our AI is specifically trained on high-converting email copy. Plus, you get templates, analytics, and automation - not just text.\n\n**Q: Do you offer support?**\nA: Absolutely! 24/7 chat support, video tutorials, and a knowledge base.\n\n---\n\n**FINAL CTA SECTION**\n\n**Headline:**\nReady to Transform Your Email Marketing?\n\n**Subheadline:**\nJoin 10,000+ small businesses sending emails that actually work\n\n**CTA:**\n[Start Your Free 14-Day Trial] →\n\n**Trust Elements:**\n✓ No credit card required  \n✓ Setup in 5 minutes  \n✓ Cancel anytime  \n✓ 30-day money-back guarantee\n\n**Security Badges:**\n[SOC 2 Certified] [GDPR Compliant] [SSL Secure]\n\n---\n\n**FOOTER**\n\nProduct  \n- Features  \n- Pricing  \n- Integrations  \n- Templates\n\nCompany  \n- About Us  \n- Blog  \n- Careers  \n- Contact\n\nResources  \n- Help Center  \n- Video Tutorials  \n- Case Studies  \n- API Docs\n\nLegal  \n- Privacy Policy  \n- Terms of Service  \n- GDPR\n\n© 2026 [Product Name]. Made with ❤️ for small businesses.",
    "**AI Email Marketing Tool - Landing Page Copy**\n\n---\n\n## HERO SECTION\n\n**Main Headline:**\nEmail Marketing Made Easy  \n(Finally.)\n\n**Subheadline:**\nLet AI write, design, and send emails that your customers actually want to open. More sales, less work, starting at $29/month.\n\n**Primary CTA:**\n[Get Started Free - No Credit Card] →\n\n**Secondary CTA:**\n[See How It Works]\n\n**Visual:**\nAnimated demo showing: \"Promote spring sale\" → AI writes email → Email gets 45% open rate\n\n**Trust Bar:**\n\"Trusted by 10,000+ small businesses\"  \n[Customer logos: 6 recognizable small businesses]\n\n---\n\n## THE PROBLEM (Agitate Pain Points)\n\n**Headline:**\nStop Wasting Time on Email Marketing That Doesn't Work\n\n**Pain Points Grid:**\n\n😰 **Writer's Block**\nStaring at blank screens for hours trying to write one email\n\n💸 **Expensive Tools**\nPaying $500/month for features you'll never use\n\n📉 **Low Open Rates**\nSending emails into the void (average open rate: 12%)\n\n⏰ **Time Vampire**\nSpending 10+ hours/week on campaigns that flop\n\n**Bridge Statement:**\n\"What if email marketing could be simple, affordable, and actually work?\"\n\n---\n\n## THE SOLUTION\n\n**Headline:**\nIntroducing [Product Name]:  \nYour AI Email Marketing Team\n\n**Value Proposition:**\nWe combine GPT-4 AI with email marketing best practices to create campaigns that convert - in minutes, not hours.\n\n**3 Core Benefits:**\n\n**🎯 AI That Actually Gets Your Business**\nNo generic templates. Tell our AI about your business once, and it writes emails that sound like YOU.\n\n**⚡ From Idea to Inbox in 5 Minutes**\nType what you want to say → AI writes it → Pick a design → Send. Seriously, it's that fast.\n\n**📈 Guaranteed Better Results**\nOur customers see 3x higher open rates compared to industry average. Or your money back.\n\n[Product Screenshot: AI interface]\n\n---\n\n## HOW IT WORKS\n\n**Headline:**\nSo Simple, It Feels Like Cheating\n\n**Step-by-Step:**\n\n**STEP 1: Tell AI What You Want**\n\"Promote our 30% off summer sale to customers who haven't bought in 90 days\"\n\n**STEP 2: AI Creates Everything**\n→ Writes subject line: \"We miss you! 30% off just for you\"  \n→ Writes email body  \n→ Suggests best send time  \n→ Picks winning design\n\n**STEP 3: Review & Send**\nTweak anything you want (or don't). Hit send. Watch sales roll in.\n\n[Interactive Demo Embed]\n\n**Bottom Line:**\nWhat used to take 4 hours now takes 5 minutes.\n\n---\n\n## SOCIAL PROOF\n\n**Headline:**\n10,000+ Businesses Trust [Product Name]\n\n**Stats Banner:**\n```\n📊 2.3M+ Emails Sent | 💰 $12M Revenue Generated | ⭐ 4.9/5 Rating (1,200+ reviews)\n```\n\n**Testimonial Carousel:**\n\n**Testimonial 1:**\n\"I went from 8% to 41% open rates in ONE MONTH. This tool pays for itself 50x over. I can't believe how easy it is.\"\n\n*- Amanda R., Online Boutique*  \n*Revenue increase: +$3,200/month*\n\n---\n\n**Testimonial 2:**\n\"Finally, an email tool built for people who aren't email experts. The AI writes better copy than I ever could. My customers love the emails now.\"\n\n*- David L., Coffee Roaster*  \n*Open rate: 12% → 38%*\n\n---\n\n**Testimonial 3:**\n\"Cancelled Mailchimp ($320/mo) and switched to [Product]. Same features, better results, $49/month. It's a no-brainer.\"\n\n*- Sarah T., Fitness Coach*  \n*Savings: $3,252/year*\n\n---\n\n## FEATURES SHOWCASE\n\n**Headline:**\nEverything You Need, Nothing You Don't\n\n**Feature Grid (with icons):**\n\n**✍️ AI Copywriter**\nSubject lines, body copy, CTAs - all optimized for clicks\n\n**🎨 Smart Templates**\n100+ mobile-responsive designs that match your brand\n\n**🤖 Automation**\nWelcome series, cart abandonment, re-engagement - set once, profit forever\n\n**📊 Predictive Analytics**\nAI tells you the best time to send and what to write about\n\n**👥 Smart Segmentation**\nAutomatically group customers by behavior (no spreadsheets!)\n\n**🔗 Easy Integrations**\nShopify, WooCommerce, WordPress, Stripe, and 100+ more\n\n**💬 A/B Testing**\nAI automatically tests variations and picks winners\n\n**📱 Mobile Optimized**\n70% of emails are read on phones. Ours look perfect everywhere.\n\n---\n\n## PRICING (Value-focused)\n\n**Headline:**\nAffordable for Any Business\n\n**Subheadline:**\nAll plans include AI writer, automation, and analytics. Cancel anytime.\n\n---\n\n**💼 STARTER**\n**$29**/month\n\nPerfect for getting started\n\n→ Up to 1,000 contacts  \n→ Unlimited emails  \n→ AI email writer  \n→ 50+ templates  \n→ Basic automation  \n→ Email support\n\n[Start Free Trial]\n\n---\n\n**🚀 GROWTH** ⭐ Most Popular\n**$49**/month\n\nFor growing businesses\n\n→ Up to 5,000 contacts  \n→ Everything in Starter, plus:  \n→ Advanced automation  \n→ A/B testing  \n→ Remove branding  \n→ Priority support\n\n[Start Free Trial]\n\n---\n\n**💎 PRO**\n**$99**/month\n\nFor serious marketers\n\n→ Up to 25,000 contacts  \n→ Everything in Growth, plus:  \n→ Dedicated account manager  \n→ Custom integrations  \n→ Phone support  \n→ Early access to features\n\n[Start Free Trial]\n\n---\n\n**Fine Print:**\n✓ 14-day free trial (no credit card)  \n✓ 30-day money-back guarantee  \n✓ Switch plans anytime\n\n**Compare to Mailchimp:**\n*Mailchimp 5,000 contacts: $350/month*  \n*[Product] 5,000 contacts: $49/month*  \n**You save: $3,612/year** 💰\n\n---\n\n## OBJECTION HANDLING (FAQ)\n\n**Headline:**\nQuestions? We've Got Answers.\n\n**Q: Will the AI emails sound robotic?**\nA: Nope! Our AI learns your brand voice. Customers won't know it's AI (unless you tell them). Try it - you'll be impressed.\n\n**Q: I barely have any email subscribers. Is this worth it?**\nA: YES! We'll help you grow your list with built-in signup forms and popups. Plus, better to start right than fix bad habits later.\n\n**Q: What if I need help?**\nA: We offer 24/7 chat support, video tutorials, and free onboarding calls. You're never alone.\n\n**Q: Can I import my existing list?**\nA: Absolutely. CSV upload takes 2 minutes. We'll even help you clean it.\n\n**Q: Is my data secure?**\nA: 100%. We're SOC 2 certified, GDPR compliant, and never sell your data. Your customers' info is safe.\n\n**Q: What if I hate it?**\nA: You won't (but we offer a 30-day money-back guarantee just in case).\n\n---\n\n## COMPETITIVE EDGE\n\n**Headline:**\n[Product] vs. The Rest\n\n**Comparison Chart:**\n\n|  | [Product] | Mailchimp | Constant Contact | Klaviyo |\n|---|-----------|-----------|------------------|---------|\n| **AI Writer** | ✅ Built-in | ❌ No | ❌ No | ❌ No |\n| **Price (5K contacts)** | $49/mo | $350/mo | $280/mo | $300/mo |\n| **Setup Time** | 5 min | 2 hours | 1 hour | 3 hours |\n| **Automation** | ✅ Smart AI | ⚠️ Manual | ⚠️ Basic | ✅ Yes |\n| **Support** | 24/7 | M-F 9-5 | Email only | Limited |\n| **Ease of Use** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ |\n\n---\n\n## RISK REVERSAL\n\n**Headline:**\nTry It Risk-Free for 14 Days\n\n**Guarantee Box:**\n\n🛡️ **Our Triple Guarantee:**\n\n✅ **14-Day Free Trial**  \nNo credit card required. Full access to everything.\n\n✅ **30-Day Money-Back**  \nNot seeing results? Get a full refund. No questions asked.\n\n✅ **Cancel Anytime**  \nNo contracts. No fees. One-click cancellation.\n\n**Bottom Line:**  \n\"You have literally nothing to lose and $1000s in extra revenue to gain.\"\n\n---\n\n## FINAL CTA\n\n**Headline:**\nReady to 3x Your Email Results?\n\n**Subheadline:**\nJoin 10,000+ businesses sending emails people love to open\n\n**CTA Button (Large):**\n[Start Your Free Trial - No Credit Card Required] →\n\n**Sub-CTA:**\n[Or Book a Free Demo]\n\n**Trust Signals:**\n🔒 Bank-level encryption  \n✅ GDPR compliant  \n⭐ Rated 4.9/5 stars\n\n**Customer Logos:**\n[Row of 10 recognizable customer logos]\n\n---\n\n## FOOTER\n\n**Column 1: Product**\n- Features\n- Pricing  \n- Integrations  \n- Templates  \n- Changelog\n\n**Column 2: Resources**\n- Blog  \n- Help Center  \n- Video Tutorials  \n- Case Studies  \n- Email Course (Free)\n\n**Column 3: Company**\n- About  \n- Careers  \n- Contact  \n- Press Kit  \n- Affiliate Program\n\n**Column 4: Legal**\n- Privacy Policy  \n- Terms of Service  \n- GDPR  \n- Security\n\n**Bottom Footer:**\n© 2026 [Product Name] | Made with ❤️ in [City] | [Social Icons]\n\n---\n\n**TOTAL PAGE LENGTH:** ~3,500 words  \n**ESTIMATED CONVERSION RATE:** 8-12% (industry avg: 2-5%)",
    'waiting'
  );

  console.log('✅ Seed data initialized:', {
    users: users.size,
    chats: chats.size,
    turns: turns.size,
  });
};

