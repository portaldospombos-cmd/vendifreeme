import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Validate environment
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!STRIPE_SECRET_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing required environment variables');
}

const stripe = new Stripe(STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-03-25.dahlia',
});

const supabaseAdmin = createClient(
  SUPABASE_URL || '',
  SUPABASE_SERVICE_ROLE_KEY || ''
);

const app = express();
app.use(express.json());

// Auth Middleware
async function authenticate(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No auth header' });
  const token = authHeader.split(' ')[1];
  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !user) return res.status(401).json({ error: 'Invalid token' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Auth failed' });
  }
}

// 1. GET /api/conversations
app.get('/api/conversations', authenticate, async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const { data: conversations, error } = await supabaseAdmin
      .from('conversations')
      .select(`
        *,
        listing:listings(id, title, price, image_url),
        seller:profiles!conversations_seller_id_fkey(id, full_name, avatar_url),
        buyer:profiles!conversations_buyer_id_fkey(id, full_name, avatar_url)
      `)
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const conversationsWithLastMsg = await Promise.all((conversations || []).map(async (conv) => {
      const { data: lastMsg } = await supabaseAdmin
        .from('messages')
        .select('*')
        .eq('conversation_id', conv.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      return { ...conv, lastMessage: lastMsg };
    }));

    res.json(conversationsWithLastMsg);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET /api/conversations/:id
app.get('/api/conversations/:id', authenticate, async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const { data: conversation, error } = await supabaseAdmin
      .from('conversations')
      .select(`
        *,
        listing:listings(*),
        seller:profiles!conversations_seller_id_fkey(*),
        buyer:profiles!conversations_buyer_id_fkey(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!conversation) return res.status(404).json({ error: 'Conversation not found' });
    
    if (conversation.buyer_id !== userId && conversation.seller_id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// TEST ROUTE: Create test conversation if empty
app.post('/api/conversations/test-create', authenticate, async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    
    // Check if user has any conversations
    const { count } = await supabaseAdmin
      .from('conversations')
      .select('*', { count: 'exact', head: true })
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`);

    if (count && count > 0) {
      return res.json({ message: 'User already has conversations', created: false });
    }

    // Find a listing that doesn't belong to the user
    const { data: listing } = await supabaseAdmin
      .from('listings')
      .select('id, user_id')
      .neq('user_id', userId)
      .limit(1)
      .maybeSingle();

    if (!listing) {
      return res.status(404).json({ error: 'No potential listings found to start a test conversation.' });
    }

    // Create conversation
    const { data: conv, error: convError } = await supabaseAdmin
      .from('conversations')
      .insert({
        listing_id: listing.id,
        buyer_id: userId,
        seller_id: listing.user_id
      })
      .select()
      .single();

    if (convError) throw convError;

    // Create a greeting message
    await supabaseAdmin
      .from('messages')
      .insert({
        conversation_id: conv.id,
        sender_id: listing.user_id, // Seller sends the message
        message: 'Olá! Vimos que estás interessado nos nossos anúncios. Como podemos ajudar?',
        is_read: false
      });

    res.json({ message: 'Test conversation created', created: true, conversation_id: conv.id });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// 2. GET /api/messages/:conversationId
app.get('/api/messages/:conversationId', authenticate, async (req: any, res: any) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    const { data: conversation } = await supabaseAdmin
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .single();

    if (!conversation) return res.status(404).json({ error: 'Conversation not found' });
    if (conversation.buyer_id !== userId && conversation.seller_id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { data: messages, error } = await supabaseAdmin
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    await supabaseAdmin
      .from('messages')
      .update({ is_read: true })
      .eq('conversation_id', conversationId)
      .neq('sender_id', userId);

    res.json(messages || []);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// 3. POST /api/messages
app.post('/api/messages', authenticate, async (req: any, res: any) => {
  try {
    const { listing_id, receiver_id, message, conversation_id: existing_conv_id } = req.body;
    const sender_id = req.user.id;

    let conversation_id = existing_conv_id;

    if (!conversation_id) {
      const { data: existing } = await supabaseAdmin
        .from('conversations')
        .select('id')
        .eq('listing_id', listing_id)
        .or(`and(buyer_id.eq.${sender_id},seller_id.eq.${receiver_id}),and(buyer_id.eq.${receiver_id},seller_id.eq.${sender_id})`)
        .maybeSingle();

      if (existing) {
        conversation_id = existing.id;
      } else {
        let seller_id = receiver_id;
        if (!seller_id) {
          const { data: listing } = await supabaseAdmin.from('listings').select('seller_id').eq('id', listing_id).single();
          seller_id = listing?.seller_id;
        }

        const { data: newConv, error: convError } = await supabaseAdmin
          .from('conversations')
          .insert({
            listing_id,
            buyer_id: sender_id,
            seller_id: seller_id
          })
          .select()
          .single();
        
        if (convError) throw convError;
        conversation_id = newConv.id;
      }
    }

    const { data: newMessage, error } = await supabaseAdmin
      .from('messages')
      .insert({
        conversation_id,
        sender_id,
        message,
        is_read: false
      })
      .select()
      .single();

    if (error) throw error;
    res.json({ ...newMessage, conversation_id });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// 2. Stripe Payment Intent
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, userId, listingId, type } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'eur',
      metadata: { userId, listingId, type }
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// 3. Post-Payment Processing (Simulation of Webhook)
app.post('/api/confirm-payment', async (req, res) => {
  const { paymentIntentId, userId: forceUserId, amount: forceAmount, listingId: forceListingId } = req.body;
  
  try {
    let userId, listingId, type, amount;

    if (paymentIntentId.startsWith('sim_')) {
      // Simulation mode
      userId = forceUserId;
      listingId = forceListingId;
      type = 'promotion';
      amount = forceAmount;
    } else {
      const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (intent.status !== 'succeeded') throw new Error('Payment not succeeded');
  
      userId = intent.metadata.userId;
      listingId = intent.metadata.listingId;
      type = intent.metadata.type;
      amount = intent.amount / 100;
    }

    // A. Record Transaction
    const { data: transaction } = await supabaseAdmin.from('transactions').insert({
      user_id: userId,
      listing_id: listingId,
      amount,
      type,
      status: 'completed',
      stripe_payment_intent_id: paymentIntentId
    }).select().single();

    if (!transaction) throw new Error('Failed to record transaction');

    // B. Activate/Promote Listing
    if (listingId && listingId !== 'null') {
      await supabaseAdmin.from('listings').update({
        promotion_type: type === 'promotion' ? 'premium' : 'normal',
        status: 'active'
      }).eq('id', listingId);
    }

    // C. Ambassador Commissions Logic
    if (type === 'promotion' || type === 'premium' || type === 'plan') {
      const { data: userProfile } = await supabaseAdmin.from('profiles').select('referred_by').eq('id', userId).single();
      
      if (userProfile?.referred_by) {
        // Level 1 (10%)
        await processCommission(userProfile.referred_by, transaction.id, userId, amount * 0.1, 1);
        
        const { data: l1Ambassador } = await supabaseAdmin.from('profiles').select('referred_by').eq('id', userProfile.referred_by).single();
        if (l1Ambassador?.referred_by) {
          // Level 2 (5%)
          await processCommission(l1Ambassador.referred_by, transaction.id, userId, amount * 0.05, 2);
        }
      }
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// 4. Debug / Testing: Force Validate Commissions
app.post('/api/debug/validate-commissions', async (req, res) => {
  try {
    const { error } = await supabaseAdmin.rpc('validate_pending_commissions');
    if (error) throw error;
    res.json({ success: true, message: 'Commissions validated successfully' });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// 5. Delete Account (Right to be Forgotten - GDPR)
app.post('/api/delete-account', async (req, res) => {
  const { userId } = req.body;
  try {
    // 1. Delete listings
    await supabaseAdmin.from('listings').delete().eq('user_id', userId);
    // 2. Delete profile
    await supabaseAdmin.from('profiles').delete().eq('id', userId);
    // 3. Delete auth user (Service Role can do this)
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) throw error;

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// 6. Background Jobs (Simulated via regular interval)
setInterval(async () => {
  try {
    console.log('Running background jobs: Syncing commissions and activity status...');
    await supabaseAdmin.rpc('validate_pending_commissions');
    await supabaseAdmin.rpc('update_inactive_users');
  } catch (err) {
    console.error('Background Job Error:', err);
  }
}, 10 * 60 * 1000); // Every 10 minutes

async function processCommission(ambassadorId: string, transactionId: string, buyerId: string, amount: number, level: number) {
  const { data: amb } = await supabaseAdmin.from('profiles').select('status').eq('id', ambassadorId).single();
  
  // Rule: Only active users receive commission. 
  // If inactive, it's forfeited immediately (per user spec "comissões de utilizadores inativos revertem para a plataforma")
  const isActive = amb?.status === 'active'; 
  
  if (!isActive) return; // Reverts to platform (not created)

  await supabaseAdmin.from('commissions').insert({
    user_id: ambassadorId, // who receives
    source_user_id: buyerId, // who generated
    level,
    amount,
    status: 'pending',
    created_at: new Date().toISOString()
  });
}

// Vite middleware for development
if (process.env.NODE_ENV !== 'production') {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
