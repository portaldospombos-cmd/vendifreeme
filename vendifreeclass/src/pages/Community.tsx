import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Heart, Share2, Plus, ArrowLeft, Search, X, Camera, Send, Trash2, ShieldAlert } from 'lucide-react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { useTranslation } from 'react-i18next';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../lib/supabase';
import { Post } from '../types';
import { useBackNavigation } from '../hooks/useBackNavigation';

export default function Community() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const goBack = useBackNavigation();
  const { user, profile } = useAuth();
  const { formatPrice } = useCurrency();
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('general');

  // Automatic category suggestion
  useEffect(() => {
    const title = newPostTitle.toLowerCase();
    if (title.includes('carro') || title.includes('mota') || title.includes('pneu') || title.includes('peças')) {
      setNewPostCategory('automotive');
    } else if (title.includes('casa') || title.includes('quarto') || title.includes('apartamento') || title.includes('alug')) {
      setNewPostCategory('property');
    } else if (title.includes('ajuda') || title.includes('dica') || title.includes('venda')) {
      setNewPostCategory('general');
    }
  }, [newPostTitle]);

  const [isFetching, setIsFetching] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [reportedPosts, setReportedPosts] = useState<string[]>([]);

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm(t('common.deleteConfirm'))) return;
    
    try {
      if (import.meta.env.VITE_SUPABASE_URL) {
        const { error } = await supabase.from('community_posts').delete().eq('id', postId);
        if (error) throw error;
      }
      setPosts(prev => prev.filter(p => p.id !== postId));
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  const handleReportPost = async (postId: string) => {
    try {
      if (import.meta.env.VITE_SUPABASE_URL && user) {
        await supabase.from('post_reports').insert({
          post_id: postId,
          reporter_id: user.id,
          reason: 'Other'
        });
      }
      setReportedPosts(prev => [...prev, postId]);
      showToast(t('common.reportThanks'));
    } catch (err) {
      console.error('Error reporting post:', err);
      // Fallback
      setReportedPosts(prev => [...prev, postId]);
      showToast(t('common.reportThanks'));
    }
  };

  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      setIsFetching(true);
      try {
        let query = supabase
          .from('community_posts')
          .select(`
            *,
            profiles (
              full_name,
              avatar_url
            )
          `);
        
        if (sortBy === 'recent') {
          query = query.order('created_at', { ascending: false });
        } else {
          query = query.order('likes_count', { ascending: false });
        }

        const { data, error } = await query;

        if (error) throw error;
        
        let likedPostIds: string[] = [];
        if (user && import.meta.env.VITE_SUPABASE_URL) {
          const { data: likesData } = await supabase
            .from('post_likes')
            .select('post_id')
            .eq('user_id', user.id);
          if (likesData) {
            likedPostIds = likesData.map(l => l.post_id);
          }
        }

        if (data && data.length > 0) {
          const formatted: Post[] = data.map(item => {
            const authorData = Array.isArray(item.profiles) ? item.profiles[0] : item.profiles;
            return {
              id: item.id,
              author: authorData?.full_name || "Utilizador",
              authorId: item.user_id,
              avatar: authorData?.avatar_url || "https://picsum.photos/seed/user/100/100",
              title: item.title || "Sem título",
              content: item.content,
              category: item.category || "Geral",
              image: item.image_url,
              likes: item.likes_count || 0,
              comments: item.comments_count || 0,
              time: new Date(item.created_at).toLocaleDateString(), 
              isLiked: likedPostIds.includes(item.id)
            };
          });
          setPosts(formatted);
        }
      } catch (err) {
        console.error('Error fetching posts:', err);
      } finally {
        setIsFetching(false);
      }
    }

    if (import.meta.env.VITE_SUPABASE_URL) {
      fetchPosts();
    }
  }, [user, sortBy]);

  const [expandedComments, setExpandedComments] = useState<string[]>([]);
  const [postComments, setPostComments] = useState<Record<string, { author: string; text: string; avatar: string }[]>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const handleAddComment = async (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim() || !user) return;

    try {
      if (import.meta.env.VITE_SUPABASE_URL) {
        const { error } = await supabase.from('post_comments').insert({
          post_id: postId,
          user_id: user.id,
          content: text.trim()
        });
        if (error) throw error;
      }

      setPostComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), {
          author: user.user_metadata?.full_name || 'Você',
          text: text.trim(),
          avatar: user.user_metadata?.avatar_url || 'https://picsum.photos/seed/user/100/100'
        }]
      }));

      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: p.comments + 1 } : p));
    } catch (err) {
      console.error('Error adding comment:', err);
      // Fallback
      setPostComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), {
          author: user.user_metadata?.full_name || 'Você',
          text: text.trim(),
          avatar: user.user_metadata?.avatar_url || 'https://picsum.photos/seed/user/100/100'
        }]
      }));
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: p.comments + 1 } : p));
    }
  };

  const handleLike = async (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post || !user) return;

    const wasLiked = post.isLiked;

    // Optimistic update
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          likes: wasLiked ? p.likes - 1 : p.likes + 1,
          isLiked: !wasLiked
        };
      }
      return p;
    }));

    try {
      if (import.meta.env.VITE_SUPABASE_URL) {
        if (wasLiked) {
          await supabase.from('post_likes').delete().match({ post_id: postId, user_id: user.id });
        } else {
          await supabase.from('post_likes').insert({ post_id: postId, user_id: user.id });
        }
      }
    } catch (err) {
      console.error('Error toggling like:', err);
      // Rollback on error
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            likes: wasLiked ? p.likes + 1 : p.likes - 1,
            isLiked: wasLiked
          };
        }
        return p;
      }));
    }
  };

  const handleShare = async (post: Post) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Vendifree Community',
          text: post.content,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      showToast('Link copiado para a área de transferência!');
    }
  };

  const toggleComments = async (postId: string) => {
    const isExpanding = !expandedComments.includes(postId);
    
    setExpandedComments(prev => 
      isExpanding ? [...prev, postId] : prev.filter(id => id !== postId)
    );

    if (isExpanding && import.meta.env.VITE_SUPABASE_URL) {
      try {
        const { data, error } = await supabase
          .from('post_comments')
          .select(`
            id,
            content,
            created_at,
            profiles (
              full_name,
              avatar_url
            )
          `)
          .eq('post_id', postId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        if (data) {
          setPostComments(prev => ({
            ...prev,
            [postId]: data.map(c => {
              const p = Array.isArray(c.profiles) ? c.profiles[0] : c.profiles;
              return {
                author: p?.full_name || 'Utilizador',
                text: c.content,
                avatar: p?.avatar_url || 'https://picsum.photos/seed/user/100/100'
              };
            })
          }));
        }
      } catch (err) {
        console.error('Error fetching comments:', err);
      }
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() || !newPostTitle.trim() || !user) return;

    setIsCreating(true);
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .insert({
          title: newPostTitle,
          content: newPostContent,
          category: newPostCategory,
          user_id: user.id
        })
        .select(`
          *,
          profiles (
            full_name,
            avatar_url
          )
        `);

      if (error) throw error;

      if (data && data[0]) {
        const item = data[0];
        const newPost: Post = {
          id: item.id,
          author: item.profiles?.full_name || "Utilizador",
          authorId: item.user_id,
          avatar: item.profiles?.avatar_url || "https://picsum.photos/seed/user/100/100",
          title: item.title,
          content: item.content,
          category: item.category,
          image: item.image_url,
          likes: item.likes_count || 0,
          comments: item.comments_count || 0,
          time: "Agora",
          isLiked: false
        };
        setPosts([newPost, ...posts]);
      }
      
      setNewPostTitle('');
      setNewPostContent('');
      setNewPostCategory('Geral');
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error creating post:', err);
      // Fallback for local update if no Supabase table
      const newPost: Post = {
        id: Date.now().toString(),
        author: user?.user_metadata?.full_name || user?.displayName || "Você",
        authorId: user?.id,
        avatar: user?.user_metadata?.avatar_url || user?.photoURL || "https://picsum.photos/seed/user/100/100",
        title: newPostTitle,
        content: newPostContent,
        category: newPostCategory,
        likes: 0,
        comments: 0,
        time: "Agora",
        isLiked: false
      };
      setPosts([newPost, ...posts]);
      setNewPostTitle('');
      setNewPostContent('');
      setNewPostCategory('Geral');
      setIsModalOpen(false);
    } finally {
      setIsCreating(false);
    }
  };

  const categories = [
    { id: 'all', label: t('common.all') },
    { id: 'general', label: t('common.general') },
    { id: 'automotive', label: t('common.automotive') },
    { id: 'property', label: t('common.property') },
    { id: 'others', label: t('common.others') },
  ];

  const filteredPosts = useMemo(() => {
    let result = posts.filter(post => 
      post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (activeTab !== 'all') {
      result = result.filter(post => {
        // Handle migration from old Portuguese names if they exist in DB
        const catMap: Record<string, string> = {
          'Geral': 'general',
          'Automóveis': 'automotive',
          'Imóveis': 'property',
          'Outros': 'others'
        };
        const postCat = catMap[post.category] || post.category;
        return postCat === activeTab;
      });
    }

    return result;
  }, [posts, searchQuery, activeTab]);

  return (
    <div className="bg-background min-h-screen pb-32">
      <header className="fixed top-0 left-0 lg:left-64 right-0 z-50 glass-header flex items-center justify-between px-6 h-16 border-b border-outline-variant/10">
        <div className="flex items-center gap-4">
          <button onClick={goBack} className="p-2 text-primary hover:bg-surface-container-high/50 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          {!isSearchOpen ? (
            <h1 className="text-xl font-black font-headline text-primary tracking-tight">{t('common.community')}</h1>
          ) : (
            <motion.input
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              className="bg-surface-container-low border-none rounded-full px-4 py-1 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder={t('common.search')}
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          )}
        </div>
        <button 
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className="p-2 text-primary hover:bg-surface-container-high/50 rounded-full transition-colors"
        >
          {isSearchOpen ? <X size={24} /> : <Search size={24} />}
        </button>
      </header>

      <main className="pt-24 px-6 max-w-6xl mx-auto flex gap-8">
        {/* Main Feed */}
        <div className="flex-1 max-w-2xl">
          {/* Tabs */}
          <div className="flex items-center justify-between mb-8 border-b border-outline-variant/10">
            <div className="flex overflow-x-auto no-scrollbar gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`pb-4 px-2 font-bold text-sm whitespace-nowrap transition-all relative ${
                    activeTab === cat.id ? 'text-primary' : 'text-on-surface-variant'
                  }`}
                >
                  {cat.label}
                  {activeTab === cat.id && (
                    <motion.div layoutId="activeTabComm" className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full" />
                  )}
                </button>
              ))}
            </div>
            
            <div className="flex gap-2 pb-4 px-2">
              <button 
                onClick={() => setSortBy('recent')}
                className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full transition-all ${
                  sortBy === 'recent' ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {t('common.recent')}
              </button>
              <button 
                onClick={() => setSortBy('popular')}
                className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full transition-all ${
                  sortBy === 'popular' ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {t('common.popular')}
              </button>
            </div>
          </div>

          {/* Posts Feed */}
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {isFetching ? (
                <div className="text-center py-20 text-on-surface-variant/50">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="font-bold">{t('common.loading')}</p>
                </div>
              ) : filteredPosts.map((post) => (
                <motion.div 
                  key={post.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-surface-container-lowest rounded-3xl p-5 border border-outline-variant/10 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div 
                      className="flex items-center gap-3 cursor-pointer group"
                      onClick={() => {
                        if (post.authorId === user?.id) {
                          navigate('/profile');
                        } else if (post.authorId) {
                          navigate(`/seller/${post.authorId}`);
                        }
                      }}
                    >
                      <div className="relative">
                        <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full object-cover transition-transform group-hover:scale-105" />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center border-2 border-surface shadow-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold font-headline text-on-surface text-sm group-hover:text-primary transition-colors">{post.author}</h3>
                        <p className="text-[10px] text-on-surface-variant font-medium">
                          {post.time} • {
                            ['Automóveis', 'Imóveis', 'Geral', 'Outros'].includes(post.category) 
                              ? t(`common.${post.category === 'Automóveis' ? 'automotive' : post.category === 'Imóveis' ? 'property' : post.category === 'Geral' ? 'general' : 'others'}`)
                              : t(`common.${post.category}`) || post.category
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {reportedPosts.includes(post.id) ? (
                        <span className="text-error text-xs font-bold flex items-center gap-1">
                          <ShieldAlert size={14} /> {t('common.reported') || 'Reportado'}
                        </span>
                      ) : (
                        <button 
                          onClick={() => handleReportPost(post.id)} 
                          className="text-on-surface-variant/50 hover:text-error text-xs font-bold transition-colors"
                        >
                          {t('common.report')}
                        </button>
                      )}
                      {(user?.id === post.authorId || profile?.role === 'admin') && (
                        <button 
                          onClick={() => handleDeletePost(post.id)}
                          className="text-on-surface-variant/50 hover:text-error p-1 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {post.title && <h4 className="font-bold text-lg mb-2 text-on-surface">{post.title}</h4>}
                  <p className="text-on-surface text-sm leading-relaxed mb-4">{post.content}</p>
                  
                  {post.image && (
                    <div 
                      className="rounded-2xl overflow-hidden mb-4 max-h-[400px] cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setSelectedImage(post.image || null)}
                    >
                      <img src={post.image} alt="Post content" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
                    <div className="flex gap-6">
                      <button 
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-2 transition-colors ${
                          post.isLiked ? 'text-error' : 'text-on-surface-variant hover:text-error'
                        }`}
                      >
                        <Heart size={18} fill={post.isLiked ? 'currentColor' : 'none'} />
                        <span className="text-xs font-bold">{post.likes}</span>
                      </button>
                      <button 
                        onClick={() => toggleComments(post.id)}
                        className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors"
                      >
                        <MessageCircle size={18} />
                        <span className="text-xs font-bold">{post.comments}</span>
                      </button>
                    </div>
                    <button 
                      onClick={() => handleShare(post)}
                      className="text-on-surface-variant hover:text-primary transition-colors"
                    >
                      <Share2 size={18} />
                    </button>
                  </div>

                  {/* Comments Section */}
                  <AnimatePresence>
                    {expandedComments.includes(post.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 mt-4 border-t border-outline-variant/10 space-y-4">
                          {/* Static Example Comment if not from state yet */}
                          <div className="flex gap-3">
                            <img src="https://picsum.photos/seed/user3/100/100" className="w-8 h-8 rounded-full" />
                            <div className="flex-1 bg-surface-container-low p-3 rounded-2xl">
                              <p className="text-xs font-bold text-on-surface">Ricardo M.</p>
                              <p className="text-xs text-on-surface-variant">Concordo plenamente! O suporte é fantástico.</p>
                            </div>
                          </div>
                          {/* Render Dynamic Comments */}
                          {(postComments[post.id] || []).map((comment, i) => (
                            <div key={i} className="flex gap-3">
                              <img src={comment.avatar} className="w-8 h-8 rounded-full object-cover" />
                              <div className="flex-1 bg-surface-container-low p-3 rounded-2xl">
                                <p className="text-xs font-bold text-on-surface">{comment.author}</p>
                                <p className="text-xs text-on-surface-variant">{comment.text}</p>
                              </div>
                            </div>
                          ))}
                          <div className="flex gap-2">
                            <input 
                              placeholder="Escreve um comentário..." 
                              value={commentInputs[post.id] || ''}
                              onChange={e => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                              onKeyDown={e => e.key === 'Enter' && handleAddComment(post.id)}
                              className="flex-1 bg-surface-container-low border-none rounded-full px-4 py-2 text-xs focus:ring-1 focus:ring-primary/20 outline-none"
                            />
                            <button 
                              onClick={() => handleAddComment(post.id)}
                              className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
                            >
                              <Send size={16} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>

            {!isFetching && filteredPosts.length === 0 && (
              <div className="text-center py-20 opacity-40">
                <Search size={48} className="mx-auto mb-4" />
                <p className="font-headline font-bold">{t('common.noPosts') || 'Nenhum post encontrado'}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Desktop Only */}
        <div className="hidden lg:block w-80 space-y-8 h-fit sticky top-24">
          <div className="bg-surface-container-lowest rounded-[2rem] p-6 border border-outline-variant/10 shadow-sm">
            <h4 className="font-black font-headline text-primary mb-6 flex items-center gap-2">
              <Plus size={18} className="text-tertiary" />
              Tópicos Quentes
            </h4>
            <div className="space-y-4">
              {[
                { tag: '#VendifreeGains', posts: '2.4k' },
                { tag: '#VintageFinds', posts: '1.8k' },
                { tag: '#GreenLiving', posts: '1.2k' },
                { tag: '#TechDeals', posts: '950' },
              ].map((topic) => (
                <div key={topic.tag} className="flex justify-between items-center group cursor-pointer">
                  <span className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">{topic.tag}</span>
                  <span className="text-[10px] bg-surface-container-low px-2 py-1 rounded-full text-on-surface-variant font-bold">{topic.posts}</span>
                </div>
              ))}
            </div>
            <button 
              className="w-full mt-6 py-3 rounded-2xl border-2 border-primary/10 text-primary font-bold text-sm hover:bg-primary/5 transition-colors"
              onClick={() => showToast('Esta funcionalidade será disponibilizada em breve!', 'info')}
            >
              Ver todos os tópicos
            </button>
          </div>

          <div className="bg-tertiary/5 rounded-[2rem] p-6 border border-tertiary/10">
            <h4 className="font-black font-headline text-tertiary mb-2">Novo na Comunidade?</h4>
            <p className="text-xs text-on-surface-variant leading-relaxed mb-4 font-medium">As melhores trocas começam com uma boa conversa. Respeita as regras e diverte-te!</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-tertiary text-white py-3 rounded-2xl font-bold text-sm shadow-lg shadow-tertiary/20 active:scale-95 transition-all"
            >
              Criar Primeira Publicação
            </button>
          </div>
        </div>
      </main>

      {/* FAB for New Post */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-24 right-6 md:bottom-10 md:right-10 w-14 h-14 rounded-2xl bg-primary text-white shadow-lg flex items-center justify-center active:scale-90 transition-transform z-40"
      >
        <Plus size={28} />
      </button>

      {/* New Post Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="relative w-full max-w-lg bg-surface rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center">
                <h3 className="text-xl font-black font-headline text-primary">{t('common.createPost')}</h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleCreatePost} className="p-6 space-y-4">
                <div className="flex gap-4 mb-4">
                  <img src={user?.photoURL || "https://picsum.photos/seed/user/100/100"} className="w-12 h-12 rounded-full object-cover shrink-0" />
                  <div className="flex-1 space-y-3">
                    <input
                      autoFocus
                      required
                      placeholder={t('common.postTitle')}
                      className="w-full bg-transparent border-none focus:ring-0 text-on-surface font-bold text-lg placeholder:text-on-surface-variant/60"
                      value={newPostTitle}
                      onChange={(e) => setNewPostTitle(e.target.value)}
                    />
                    <select
                      value={newPostCategory}
                      onChange={(e) => setNewPostCategory(e.target.value)}
                      className="w-full bg-surface-container-low border-none rounded-xl px-4 py-2 text-sm text-on-surface placeholder:text-on-surface-variant focus:ring-2 focus:ring-primary/20 outline-none"
                    >
                      {[
                        { id: 'general', key: 'common.general' },
                        { id: 'automotive', key: 'common.automotive' },
                        { id: 'property', key: 'common.property' },
                        { id: 'others', key: 'common.others' }
                      ].map(cat => (
                        <option key={cat.id} value={cat.id}>{t(cat.key)}</option>
                      ))}
                    </select>
                    <textarea
                      required
                      placeholder={t('common.postContent')}
                      className="w-full bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant/60 resize-none h-24"
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
                  <div className="flex gap-2">
                    <button type="button" className="p-2 text-primary hover:bg-primary/10 rounded-xl transition-colors">
                      <Camera size={24} />
                    </button>
                  </div>
                  <button 
                    type="submit"
                    disabled={!newPostContent.trim() || !newPostTitle.trim() || isCreating}
                    className="bg-primary text-white px-6 py-2 rounded-full font-bold shadow-lg disabled:opacity-50 flex items-center gap-2"
                  >
                    <Send size={18} />
                    {isCreating ? t('common.publishing') : t('common.createPost')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedImage(null)}
          >
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={selectedImage} 
              alt="Expanded post content"
              className="max-w-full max-h-[90vh] rounded-3xl shadow-2xl"
            />
            <button 
              className="absolute top-6 right-6 p-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
