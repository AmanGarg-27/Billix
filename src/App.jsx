import { useState, useEffect, useRef, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import {
  ShoppingBag,
  Scan,
  Home as HomeIcon,
  Plus,
  Minus,
  X,
  ChevronRight,
  Sparkles,
  Zap,
  CreditCard,
  ShieldCheck,
  FileText,
  HelpCircle,
  Barcode,
  Flashlight,
  FlashlightOff,
  Keyboard,
  Search as SearchIcon,
  BarChart2,
  Star,
  User as UserIcon,
  MapPin,
  Settings,
  LogOut,
  Bell,
  Shield,
  Smartphone,
  Info,
  Moon,
  Sun,
  Check,
  Volume2,
  Share2,
  QrCode,
  AlertTriangle,
  Mail,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Low-level hardware kill switch to prevent background camera leaks
const activeCameraStreams = new Set();
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  const originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
  navigator.mediaDevices.getUserMedia = async (constraints) => {
    const stream = await originalGetUserMedia(constraints);
    activeCameraStreams.add(stream);
    return stream;
  };
}

const forceKillHardwareCamera = () => {
  activeCameraStreams.forEach(stream => {
    stream.getTracks().forEach(track => {
      track.stop(); // Force stop the track
      track.enabled = false; // Disable hardware access
    });
  });
  activeCameraStreams.clear();
};

// Mock Product Database removed - Now using MongoDB API

const SplashScreen = ({ onComplete }) => {
  return (
    <motion.div
      className="splash-container"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
    >
      <div className="splash-logo-container">
        <div className="splash-glow"></div>
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 1,
            ease: [0.16, 1, 0.3, 1], // Custom cubic-bezier for premium feel
            delay: 0.2
          }}
        >
          <Zap size={80} color="var(--primary)" fill="var(--primary)" />
        </motion.div>
      </div>

      <motion.h1
        className="splash-title"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        Billix
      </motion.h1>

      <div className="splash-progress-track">
        <motion.div
          className="splash-progress-bar"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 2, ease: "easeInOut", delay: 0.3 }}
          onAnimationComplete={onComplete}
        />
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        style={{ marginTop: '24px', fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '2px', textTransform: 'uppercase' }}
      >
        Smart Billing System
      </motion.p>
    </motion.div>
  );
};

const Footer = () => (
  <footer style={{
    marginTop: '60px',
    padding: '32px 16px',
    textAlign: 'center',
    borderTop: '1px solid var(--glass-border)',
    color: 'var(--text-muted)',
    fontSize: '12px'
  }}>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
      <Zap size={16} color="var(--primary)" fill="var(--primary)" />
      <span style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-main)' }}>Billix</span>
    </div>
    <p style={{ marginBottom: '16px' }}>Elevating your everyday grocery shopping experience.</p>
    <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '24px' }}>
      <a href="#" style={{ color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}><ShieldCheck size={14} /> Privacy Policy</a>
      <a href="#" style={{ color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}><FileText size={14} /> Terms of Service</a>
      <a href="#" style={{ color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}><HelpCircle size={14} /> Support</a>
    </div>
    <p>© 2026 Billix Inc. All rights reserved.</p>
  </footer>
);

const getProductDescription = (product) => {
  if (!product) return "";
  const category = product.category || "";
  if (category === "Produce") {
    return "Freshly harvested, handpicked premium organic farm produce. Loaded with natural vitamins, minerals, and healthy fiber. Sourced from local fields in Rajasthan under optimal temperature conditions. Wash thoroughly before consumption.";
  } else if (category === "Dairy & Bakery") {
    return "High-quality, nutrient-rich fresh dairy and bakery essential. Sourced directly from local cooperative dairies and prepared under strict international quality guidelines to ensure premium freshness and maximum hygiene. Keep refrigerated.";
  } else if (category === "Snacks & Munchies") {
    return "Perfect crunchy and delightful snack to satisfy your sudden hunger cravings. Seasoned with a premium signature blend of spices to deliver a burst of flavor in every single bite. Great for sharing, quick parties, or tea-time munching!";
  } else if (category === "Instant Foods") {
    return "Ultra-convenient, delicious, and extremely quick to prepare! Made with top-tier durum wheat and rich seasoning spices. The ultimate fast-cooking meal for busy days, midnight cravings, or quick workplace lunches.";
  } else if (category === "Beverages") {
    return "Wonderfully refreshing and revitalizing drink designed to quench your thirst and lift your energy levels instantly. Best served ice-cold to experience its premium carbonation/flavour profile at its absolute peak.";
  } else if (category === "Staples") {
    return "Premium-grade pantry essential ensuring absolute purity and superior taste. Ground/processed from premium farm harvests and packed in multi-layered protective packs to lock in complete nutritional values for your family meals.";
  } else if (category === "Household & Care") {
    return "Highly effective, lab-tested household clean and care solution. Formulated with state-of-the-art germ protection and stain removal technology to ensure absolute safety, sanitation, and sparkling freshness for your lovely home.";
  } else if (category === "Meat & Seafood") {
    return "Freshly sourced, tender, and hygienically processed high-protein meat/seafood. Cleaned thoroughly and vacuum-packed under certified sub-zero cold chains to lock in natural nutrition, taste, and premium tenderness. Store frozen.";
  }
  return "Premium quality supermarket product sourced directly from elite vendors to guarantee outstanding value, optimal fresh taste, and strict quality control compliance.";
};

const ProductCard = ({ product, onDetail, onAdd, isHorizontal = false }) => (
  <div className="glass" style={{
    width: isHorizontal ? '120px' : '100%',
    minWidth: isHorizontal ? '120px' : 'auto',
    padding: '8px',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    transition: 'transform 0.2s ease',
    cursor: 'pointer',
    background: 'var(--bg-card)'
  }}
    onClick={() => {
      if (onDetail) onDetail(product);
    }}
  >
    <div style={{
      width: '100%',
      height: '110px',
      background: 'white',
      borderRadius: 'var(--radius-sm)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    }}>
      <img
        src={product.image}
        alt={product.name}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&q=80'; // Reliable grocery fallback
        }}
      />
    </div>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <h4 style={{
        fontSize: '11px',
        fontWeight: '600',
        lineHeight: '1.2',
        color: 'var(--text-main)',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        height: '26px'
      }}>
        {product.name}
      </h4>
      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontWeight: '700', fontSize: '13px', color: 'var(--text-main)' }}>₹{product.price}</span>
            <span style={{ fontSize: '9px', textDecoration: 'line-through', color: 'var(--text-muted)' }}>₹{product.mrp || product.price}</span>
          </div>
          {product.mrp > product.price && (
            <div style={{ fontSize: '8px', color: 'var(--primary)', fontWeight: 'bold' }}>
              SAVE ₹{product.mrp - product.price}
            </div>
          )}
        </div>
        <div 
          onClick={(e) => {
            e.stopPropagation(); // Stop trigger of parent onClick description drawer!
            if (onAdd) onAdd(product);
          }}
          style={{
            background: 'var(--primary)',
            color: 'white',
            borderRadius: '6px',
            padding: '4px 10px',
            fontSize: '9px',
            fontWeight: 'bold',
            boxShadow: '0 2px 8px rgba(0, 200, 83, 0.2)',
            cursor: 'pointer'
          }}
        >ADD</div>
      </div>
    </div>
  </div>
);

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('billix_auth') === 'true');
  const [view, setView] = useState(() => localStorage.getItem('billix_auth') === 'true' ? 'home' : 'auth'); // 'home', 'scan', 'cart', 'search', 'profile', 'store-select', 'auth'
  const [stores, setStores] = useState([]);
  const [showStoreScanner, setShowStoreScanner] = useState(false);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('billix_cart_v2');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse cart:", e);
      return [];
    }
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastScanned, setLastScanned] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', location: '', avatar: '' });
  const [allProducts, setAllProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [itemsToShow, setItemsToShow] = useState(30);
  const [checkedOutOrder, setCheckedOutOrder] = useState(null);
  const [sharedSessionId, setSharedSessionId] = useState(null);
  const [isSharedHost, setIsSharedHost] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [scannedOrderForAudit, setScannedOrderForAudit] = useState(null);
  const [verifiedItems, setVerifiedItems] = useState({});
  const [auditStatus, setAuditStatus] = useState('idle'); // 'idle', 'success'
  const [scannedOrderForCashier, setScannedOrderForCashier] = useState(null);
  const [cashierPortalStatus, setCashierPortalStatus] = useState('idle'); // 'idle', 'success'
  const [selectedPaymentOption, setSelectedPaymentOption] = useState(null); // 'UPI' | 'Card' | 'NetBanking'
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [showCheckoutItems, setShowCheckoutItems] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState(null);
  const [prevCategory, setPrevCategory] = useState(activeCategory);
  if (activeCategory !== prevCategory) {
    setPrevCategory(activeCategory);
    setItemsToShow(30);
  }
  
  const [appSettings, setAppSettings] = useState(() => {
    const saved = localStorage.getItem('billix_settings_v2');
    return saved ? JSON.parse(saved) : {
      sound: true,
      haptic: true,
      orderUpdates: true,
      promotions: false,
      biometric: true,
      theme: 'light'
    };
  });
  const scrollPosRef = useRef(0);

  // Store the active state in a ref to allow standard single-mount back button interceptor
  const navigationStateRef = useRef();
  navigationStateRef.current = { selectedProductDetail, showStoreScanner, showShareModal, view };

  // Advanced iOS & Android Swipe-Back edge touch gesture block
  useEffect(() => {
    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      if (touch) {
        const edgeThreshold = 25; // Block swipe gestures starting close to either edge
        if (touch.clientX < edgeThreshold || touch.clientX > window.innerWidth - edgeThreshold) {
          e.preventDefault();
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  // History PopState Trap & First-Touch activator to lock physical back buttons/gestures
  useEffect(() => {
    const pushTrapState = () => {
      if (window.history.state !== 'billix_trap') {
        window.history.pushState('billix_trap', null, window.location.href);
      }
    };

    // Push initial trap state
    pushTrapState();

    // Push state on first tap to satisfy browser "User Gesture History Manipulation" sandbox rules
    window.addEventListener('click', pushTrapState, { once: true });
    window.addEventListener('touchstart', pushTrapState, { once: true });

    const handlePopState = (e) => {
      // Keep state trap active
      pushTrapState();

      // Access latest states safely using the ref
      const currentStates = navigationStateRef.current;
      if (currentStates.selectedProductDetail) {
        setSelectedProductDetail(null);
      } else if (currentStates.showStoreScanner) {
        setShowStoreScanner(false);
      } else if (currentStates.showShareModal) {
        setShowShareModal(false);
      } else if (currentStates.view !== 'home' && currentStates.view !== 'auth' && currentStates.view !== 'store-select') {
        setView('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('click', pushTrapState);
      window.removeEventListener('touchstart', pushTrapState);
    };
  }, []);

  // BeforeUnload block to prevent the browser window/tab from closing or navigating away instantly
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = 'Are you sure you want to exit Billix?';
      return 'Are you sure you want to exit Billix?';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Block native long-press text selection context menu globally
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    window.addEventListener('contextmenu', handleContextMenu);
    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  // Sync local cart to shared backend session
  const syncCartToBackend = async (newCart) => {
    if (!sharedSessionId) return;
    try {
      await fetch(`/api/cart/share/${sharedSessionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: newCart })
      });
    } catch (err) {
      console.error("[Collaborative] Sync failed:", err);
    }
  };

  // Create Shared Cart Session (Host)
  const handleShareCart = async () => {
    try {
      const res = await fetch('/api/cart/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart })
      });
      if (res.ok) {
        const data = await res.json();
        setSharedSessionId(data.sessionId);
        setIsSharedHost(true);
        setShowShareModal(true);
        if (appSettings.sound) {
          const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2019/2019-84.wav"); // success chime
          audio.play().catch(() => {});
        }
      }
    } catch (err) {
      console.error("Shared cart init failed:", err);
      alert("Failed to start collaborative cart sharing.");
    }
  };

  // Order Checkout Submission
  const handleCheckout = async (paymentMethod = 'Online') => {
    if (cart.length === 0) return;
    try {
      setLoading(true);
      const res = await fetch('/api/user/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          total: total,
          paymentMethod: paymentMethod
        })
      });
      if (res.ok) {
        const orderData = await res.json();
        setCheckedOutOrder(orderData);
        setCart([]); // Clear local cart
        
        // Clear shared cart if active
        if (sharedSessionId) {
          await fetch(`/api/cart/share/${sharedSessionId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: [] })
          });
          setSharedSessionId(null);
        }
        
        // Refresh User profile for points
        const uRes = await fetch('/api/user');
        if (uRes.ok) {
          setUserData(await uRes.json());
        }
        
        if (paymentMethod === 'Cash') {
          setView('temporary-cash-qr');
        } else {
          setView('exit-pass');
        }
        
        if (appSettings.sound) {
          const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2018/2018-84.wav"); // Sweep chime
          audio.play().catch(() => {});
        }
      } else {
        alert("Checkout failed. Please try again.");
      }
    } catch (err) {
      console.error("Checkout failed:", err);
      alert("Server communication error during checkout.");
    } finally {
      setLoading(false);
    }
  };

  // Polling Effect for Cash Payment Collection
  useEffect(() => {
    if (view !== 'temporary-cash-qr' || !checkedOutOrder) return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/orders/${checkedOutOrder._id}`);
        if (response.ok) {
          const updatedOrder = await response.json();
          if (updatedOrder.status === 'Verified') {
            clearInterval(pollInterval);
            setCheckedOutOrder(updatedOrder);
            setView('exit-pass');
            
            // Satisfying success sound!
            if (appSettings.sound) {
              const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2018/2018-84.wav");
              audio.play().catch(() => {});
            }
          }
        }
      } catch (err) {
        console.error("Error polling cash order status:", err);
      }
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [view, checkedOutOrder, appSettings.sound]);

  // Polling Effect for Shared Cart Synchronization
  useEffect(() => {
    if (!sharedSessionId) return;

    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/cart/share/${sharedSessionId}`);
        if (res.ok) {
          const data = await res.json();
          // Deep compare JSON to prevent circular update triggers
          if (JSON.stringify(data.items) !== JSON.stringify(cart)) {
            console.log("[Collaborative] Synced items from shared session:", data.items);
            setCart(data.items);
          }
        } else if (res.status === 404) {
          setSharedSessionId(null);
          alert("Shared cart session has ended.");
        }
      } catch (err) {
        console.error("Shared cart sync error:", err);
      }
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [sharedSessionId, cart]);

  // Disable body scroll when product details drawer is open
  useEffect(() => {
    if (selectedProductDetail) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProductDetail]);

  useEffect(() => {
    localStorage.setItem('billix_settings_v2', JSON.stringify(appSettings));
    if (appSettings.theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, [appSettings]);

  useEffect(() => {
    localStorage.setItem('billix_cart_v2', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (scannedOrderForAudit) {
      setVerifiedItems({});
    }
  }, [scannedOrderForAudit]);

  const toggleSetting = (key) => {
    if (key === 'theme') {
      setAppSettings(prev => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }));
    } else {
      setAppSettings(prev => ({ ...prev, [key]: !prev[key] }));
    }

    if (appSettings.haptic && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const categories = ['All', ...new Set(allProducts.map(p => p.category).filter(Boolean))];
  const filteredProducts = activeCategory === 'All' ? allProducts : allProducts.filter(p => p.category === activeCategory);

  // Intersection observer for infinite scroll
  const observer = useRef();
  const lastProductElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && itemsToShow < filteredProducts.length) {
        setItemsToShow(prev => prev + 30);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, itemsToShow, filteredProducts.length]);

  useEffect(() => {
    // Fetch all stores
    fetch('/api/stores')
      .then(res => res.json())
      .then(data => setStores(data))
      .catch(err => console.error("Error fetching stores:", err));

    // Fetch User Profile, Orders & active catalog
    const fetchUser = async () => {
      try {
        const [uRes, oRes] = await Promise.all([
          fetch('/api/user'),
          fetch('/api/user/orders')
        ]);
        if (uRes.ok) {
          const data = await uRes.json();
          console.log("[Frontend] User data received:", data);
          setUserData(data);
          
          if (data.currentStore) {
            // Load products specifically for their active store!
            const storeId = data.currentStore._id || data.currentStore;
            const prodRes = await fetch(`/api/products?storeId=${storeId}`);
            if (prodRes.ok) {
              const prodData = await prodRes.json();
              setAllProducts(prodData);
            }
            if (isAuthenticated) setView('home');
          } else {
            // Force store check-in
            if (isAuthenticated) setView('store-select');
          }
        } else {
          // If profile fetch fails, load all products as default fallback
          const prodRes = await fetch('/api/products');
          if (prodRes.ok) {
            setAllProducts(await prodRes.json());
          }
          if (isAuthenticated) setView('store-select');
        }
        if (oRes.ok) setUserOrders(await oRes.json());
      } catch (err) {
        console.error("Profile fetch failed", err);
        try {
          const prodRes = await fetch('/api/products');
          if (prodRes.ok) setAllProducts(await prodRes.json());
        } catch (err) {
          console.error("Fallback load failed:", err);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUser();

    // Request camera permission upfront for a seamless ZeroQueue experience
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          stream.getTracks().forEach(track => track.stop());
        })
        .catch(() => {
          // Suppress error in console to avoid confusing users during local dev
        });
    }
  }, []);

  // Lock scrolling when on the scanner screen to prevent bouncy UI
  useEffect(() => {
    if (view === 'scan') {
      document.body.style.overflow = 'hidden';
      // Prevent mobile Safari bounce
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
  }, [view]);

  // Context-aware scroll handling
  useEffect(() => {
    if (view === 'scan') {
      scrollPosRef.current = window.scrollY;
    } else if (view === 'home') {
      // Defer state update to next tick to avoid synchronous setState warnings
      const loadTimer = setTimeout(() => {
        setLoading(true);
      }, 0);
      
      const scrollTimer = setTimeout(() => {
        window.scrollTo({ top: scrollPosRef.current, behavior: 'instant' });
        setLoading(false);
      }, 300);
      
      return () => {
        clearTimeout(loadTimer);
        clearTimeout(scrollTimer);
      };
    }
  }, [view]);





  // Auto-hide splash after progress bar completes
  const handleSplashComplete = () => {
    setTimeout(() => {
      setShowSplash(false);
      if (!isAuthenticated) {
        setView('auth');
      }
    }, 500);
  };

  const handleStoreSelect = async (storeId) => {
    try {
      setLoading(true);
      const res = await fetch('/api/user/store', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeId })
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setUserData(updatedUser);
        
        // Fetch products matching this storeId!
        const prodRes = await fetch(`/api/products?storeId=${storeId}`);
        if (prodRes.ok) {
          const prodData = await prodRes.json();
          setAllProducts(prodData);
        }
        
        setView('home');
        if (appSettings.sound) {
          const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2019/2019-84.wav"); // check-in chime
          audio.play().catch(() => {});
        }
        if (appSettings.haptic && navigator.vibrate) {
          navigator.vibrate([50, 30, 50]); // pleasant triple tick
        }
      } else {
        alert("Failed to check into store. Please try again.");
      }
    } catch (err) {
      console.error("Failed to select store:", err);
      alert("Failed to connect to store check-in service.");
    } finally {
      setLoading(false);
    }
  };

  const handleStoreScanResult = async (result) => {
    let storeId = result;
    if (result.startsWith("STORE-")) {
      storeId = result.split("-")[1];
    }
    
    // Find if the store exists in our stores list
    const matchedStore = stores.find(s => s._id === storeId || s.name.toLowerCase() === storeId.toLowerCase());
    if (matchedStore) {
      setShowStoreScanner(false);
      await handleStoreSelect(matchedStore._id);
    } else {
      alert(`Invalid Store QR: "${result}". Please scan a valid Billix Store QR or select from the list.`);
    }
  };

  const addToCart = (product) => {
    const targetId = product.id || product._id || product.barcode;
    const normalizedProduct = { ...product, id: targetId };

    setCart(prev => {
      const existing = prev.find(item => item.id === targetId);
      let updated;
      if (existing) {
        updated = prev.map(item => item.id === targetId ? { ...item, quantity: item.quantity + 1 } : item);
      } else {
        updated = [...prev, { ...normalizedProduct, quantity: 1 }];
      }
      if (sharedSessionId) syncCartToBackend(updated);
      return updated;
    });
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => {
      const updated = prev.map(item => {
        if (item.id === id) {
          const newQty = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(item => item.quantity > 0);
      if (sharedSessionId) syncCartToBackend(updated);
      return updated;
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => {
      const updated = prev.filter(item => item.id !== id);
      if (sharedSessionId) syncCartToBackend(updated);
      return updated;
    });
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="app-container">
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      </AnimatePresence>

      {view === 'home' && (
        <header style={{
          position: 'sticky',
          top: 0,
          zIndex: 1200,
          background: appSettings.theme === 'light' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(10, 10, 10, 0.2)',
          backdropFilter: 'blur(40px) saturate(220%)',
          WebkitBackdropFilter: 'blur(40px) saturate(220%)',
          padding: '10px 16px',
          borderBottom: 'none',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          boxShadow: 'none'
        }}>
          {/* Left: Store Branding */}
          <div 
            style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
              <div style={{
                padding: '4px 10px',
                background: appSettings.theme === 'light' ? 'rgba(0, 200, 83, 0.1)' : 'rgba(0, 200, 83, 0.15)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                border: 'none'
              }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 8px var(--primary)' }}></div>
                <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--primary)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>In-Store Mode</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <h1 style={{
                fontSize: '16px',
                fontWeight: '800',
                color: 'var(--text-main)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '180px'
              }}>
                {!userData ? 'Detecting Store...' : (userData.currentStore?.name || 'Select Store')}
              </h1>
            </div>
          </div>

          {/* Right: Actions */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button className="glass" style={{ width: '40px', height: '40px', borderRadius: '12px', border: '1px solid var(--glass-border)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bell size={20} />
            </button>
            <div
              onClick={() => setView('profile')}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, var(--primary) 0%, #2196F3 100%)',
                border: '1px solid var(--glass-border)',
                color: 'white',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '18px',
                boxShadow: 'none'
              }}
            >
              {userData?.avatar || 'A'}
            </div>
          </div>
        </header>
      )}

      <main style={{ paddingBottom: '100px' }}>
        <AnimatePresence mode="wait">
          {view === 'auth' && (
            <motion.div
              key="auth"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <AuthScreen 
                onLoginSuccess={(user) => {
                  setUserData(prev => {
                    const merged = prev ? { ...prev, ...user } : user;
                    return merged;
                  });
                  setIsAuthenticated(true);
                  localStorage.setItem('billix_auth', 'true');
                  
                  // Re-evaluate redirect based on fetched currentStore
                  if (userData?.currentStore || user.currentStore) {
                    setView('home');
                  } else {
                    setView('store-select');
                  }
                }}
                appSettings={appSettings}
              />
            </motion.div>
          )}

          {view === 'store-select' && (
            <motion.div
              key="store-select"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <StoreSelectScreen 
                stores={stores}
                onSelect={handleStoreSelect}
                onScanClick={() => setShowStoreScanner(true)}
                appSettings={appSettings}
              />
            </motion.div>
          )}

          {view === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{ paddingTop: '20px' }}
            >

              <section style={{ minHeight: '80vh', position: 'relative' }}>
                {loading ? (
                  <div style={{
                    padding: '40px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '400px'
                  }}>
                    <motion.div
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid var(--glass-border)', borderTopColor: 'var(--primary)' }}
                    />
                  </div>
                ) : (
                  <>
                    {/* New Dashboard Sections */}
                    {activeCategory === 'All' && !loading && (
                      <>
                        {/* Offers Section */}
                        <div style={{ marginBottom: '28px' }}>
                          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Zap size={20} color="#FFD700" fill="#FFD700" /> Exclusive Offers
                          </h3>
                          <div className="hide-scrollbar" style={{ display: 'flex', overflowX: 'auto', gap: '12px', paddingBottom: '8px', WebkitOverflowScrolling: 'touch' }}>
                            {[
                              { title: "Flat 20% Off", sub: "Fresh Fruits", code: "FRESH20", color: "#FF5722" },
                              { title: "Buy 1 Get 1", sub: "Beverages", code: "BOGO", color: "#2196F3" },
                              { title: "₹100 Instant", sub: "Billix Select", code: "SAVE100", color: "#9C27B0" }
                            ].map((offer, i) => (
                              <div key={i} style={{
                                minWidth: '220px',
                                height: '90px',
                                background: offer.color,
                                borderRadius: 'var(--radius-md)',
                                padding: '16px',
                                position: 'relative',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                              }}>
                                <div style={{ position: 'absolute', right: '-15px', bottom: '-15px', opacity: 0.15 }}>
                                  <Zap size={80} color="white" />
                                </div>
                                <h4 style={{ color: 'white', fontSize: '18px', fontWeight: '800', lineHeight: '1' }}>{offer.title}</h4>
                                <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '11px', marginBottom: '8px' }}>{offer.sub}</p>
                                <div style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '4px', alignSelf: 'flex-start', fontSize: '9px', color: 'white', fontWeight: 'bold' }}>
                                  {offer.code}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Recent Activity */}
                        {recentActivity.length > 0 && (
                          <div style={{ marginBottom: '28px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Sparkles size={20} color="var(--primary)" /> Recent Activity
                            </h3>
                            <div className="hide-scrollbar" style={{ display: 'flex', overflowX: 'auto', gap: '12px', paddingBottom: '8px', WebkitOverflowScrolling: 'touch' }}>
                              {recentActivity.map(product => (
                                <ProductCard 
                                  key={product._id || product.barcode} 
                                  product={product} 
                                  onDetail={setSelectedProductDetail} 
                                  onAdd={addToCart} 
                                  isHorizontal={true} 
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Featured Products */}
                        <div style={{ marginBottom: '28px' }}>
                          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Star size={20} color="#FFD700" fill="#FFD700" /> Featured Products
                          </h3>
                          <div className="hide-scrollbar" style={{ display: 'flex', overflowX: 'auto', gap: '12px', paddingBottom: '8px', WebkitOverflowScrolling: 'touch' }}>
                            {allProducts.slice(0, 10).map(product => (
                              <ProductCard 
                                key={product._id || product.barcode} 
                                product={product} 
                                onDetail={setSelectedProductDetail} 
                                onAdd={addToCart} 
                                isHorizontal={true} 
                              />
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    <div className="hide-scrollbar" style={{ display: 'flex', overflowX: 'auto', gap: '10px', paddingBottom: '10px', marginBottom: '16px', WebkitOverflowScrolling: 'touch' }}>
                      {categories.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setActiveCategory(cat)}
                          style={{
                            padding: '8px 16px',
                            borderRadius: '20px',
                            border: '1px solid var(--primary)',
                            background: activeCategory === cat ? 'var(--primary)' : 'transparent',
                            color: activeCategory === cat ? 'white' : 'var(--primary)',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            fontWeight: '600'
                          }}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    {filteredProducts.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                        No products found in this category.
                      </div>
                    ) : activeCategory === 'All' ? (
                      <div>
                        {categories.filter(c => c !== 'All').map(cat => {
                          const categoryProducts = allProducts.filter(p => p.category === cat);
                          if (categoryProducts.length === 0) return null;
                          return (
                            <div key={cat} style={{ marginBottom: '28px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>{cat}</h3>
                                <button onClick={() => setActiveCategory(cat)} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer', fontSize: '12px' }}>View All</button>
                              </div>
                              <div className="hide-scrollbar" style={{ display: 'flex', overflowX: 'auto', gap: '16px', paddingBottom: '8px', WebkitOverflowScrolling: 'touch' }}>
                                {categoryProducts.slice(0, 10).map(product => (
                                  <ProductCard 
                                    key={product._id || product.barcode} 
                                    product={product} 
                                    onDetail={setSelectedProductDetail} 
                                    onAdd={addToCart} 
                                    isHorizontal={true} 
                                  />
                                ))}
                                {categoryProducts.length > 10 && (
                                  <div
                                    onClick={() => setActiveCategory(cat)}
                                    style={{
                                      minWidth: '120px',
                                      height: '180px',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      background: 'var(--glass)',
                                      borderRadius: 'var(--radius-md)',
                                      cursor: 'pointer',
                                      gap: '8px',
                                      border: '1px dashed var(--glass-border)'
                                    }}
                                  >
                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                      <ChevronRight color="white" size={18} />
                                    </div>
                                    <span style={{ fontWeight: '600', color: 'var(--primary)', fontSize: '12px' }}>View All</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                          <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>{activeCategory}</h3>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '10px' }}>
                          {filteredProducts.slice(0, itemsToShow).map((product, index) => {
                            if (filteredProducts.slice(0, itemsToShow).length === index + 1) {
                              return (
                                <div ref={lastProductElementRef} key={product._id || product.barcode}>
                                  <ProductCard 
                                    product={product} 
                                    onDetail={setSelectedProductDetail} 
                                    onAdd={addToCart} 
                                  />
                                </div>
                              );
                            } else {
                              return (
                                <ProductCard 
                                  key={product._id || product.barcode} 
                                  product={product} 
                                  onDetail={setSelectedProductDetail} 
                                  onAdd={addToCart} 
                                />
                              );
                            }
                          })}
                        </div>
                      </>
                    )}
                  </>
                )}
              </section>
              {!loading && <Footer />}
            </motion.div>
          )}

          {view === 'scan' && (
            <motion.div
              key="scan"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Scanner
                lastScanned={lastScanned}
                onClose={() => setView('home')}
                onResult={async (result) => {
                  // Intercept Collaborative Cart Scanning
                  if (result.startsWith("CART-")) {
                    const sessionId = result.split("-")[1];
                    try {
                      const response = await fetch(`/api/cart/share/${sessionId}`);
                      if (response.ok) {
                        const data = await response.json();
                        setSharedSessionId(sessionId);
                        setIsSharedHost(false);
                        setCart(data.items);
                        setView('cart');
                        if (appSettings.sound) {
                          const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2019/2019-84.wav");
                          audio.play().catch(() => {});
                        }
                        alert(`Successfully joined Collaborative Cart Session: ${sessionId}!`);
                        return;
                      } else {
                        alert("This collaborative cart session has expired or does not exist.");
                      }
                    } catch (err) {
                      console.error("Failed to join shared cart:", err);
                      alert("Failed to join collaborative cart.");
                    }
                    return;
                  }

                  // Intercept Cash Counter Scan
                  if (result.startsWith("CASH-ORDER-")) {
                    const orderId = result.split("-")[2];
                    try {
                      const response = await fetch(`/api/orders/${orderId}`);
                      if (response.ok) {
                        const order = await response.json();
                        setScannedOrderForCashier(order);
                        setCashierPortalStatus('fetched');
                        setView('cashier-portal');
                        if (appSettings.sound) {
                          const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2019/2019-84.wav");
                          audio.play().catch(() => {});
                        }
                        return;
                      } else {
                        alert("Invalid Cash order.");
                      }
                    } catch (err) {
                      console.error("Failed to fetch cash order:", err);
                      alert("Error loading order for cashier verification.");
                    }
                    return;
                  }

                  // Intercept Guard Exit Pass Scanning
                  if (result.startsWith("ORDER-")) {
                    const orderId = result.split("-")[1];
                    try {
                      const response = await fetch(`/api/orders/${orderId}`);
                      if (response.ok) {
                        const order = await response.json();
                        setScannedOrderForAudit(order);
                        setAuditStatus('fetched');
                        setView('guard-portal');
                        if (appSettings.sound) {
                          const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2019/2019-84.wav");
                          audio.play().catch(() => {});
                        }
                        return;
                      } else {
                        alert("Invalid order or expired exit pass.");
                      }
                    } catch (err) {
                      console.error("Failed to fetch audited order:", err);
                      alert("Error loading order for verification.");
                    }
                    return;
                  }

                  // Standard Barcode Scanning
                  // Trim whitespace/invisible chars that some scanners append
                  const cleanResult = result.trim();
                  try {
                    const response = await fetch(`/api/products/${encodeURIComponent(cleanResult)}`);
                    if (response.ok) {
                      const product = await response.json();
                      addToCart(product);
                      setRecentActivity(prev => {
                        const filtered = prev.filter(item => (item._id || item.barcode) !== (product._id || product.barcode));
                        return [product, ...filtered].slice(0, 10);
                      });
                      setLastScanned(product);
                      setTimeout(() => setLastScanned(null), 3000);

                      // Satisfying physical retail scanning sound and haptic feedback
                      if (appSettings.sound) {
                        const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2019/2019-84.wav");
                        audio.play().catch(() => {});
                      }
                      if (appSettings.haptic && navigator.vibrate) {
                        navigator.vibrate(20);
                      }
                    } else {
                      // Show the exact scanned value so you can compare with what's in the DB
                      alert(`Product not found!\n\nScanned barcode: "${cleanResult}"\n\nMake sure this exact value is saved in the 'barcode' field in MongoDB.`);
                    }
                  } catch (err) {
                    console.error("Fetch error:", err);
                    alert("Server error. Make sure the backend is running.");
                  }
                }}
              />

               <AnimatePresence>
                {lastScanned && (
                  <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -50, opacity: 0 }}
                    className="glass"
                    style={{
                      position: 'fixed',
                      top: '80px',
                      left: '20px',
                      right: '20px',
                      padding: '16px',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      backgroundColor: 'rgba(0, 200, 83, 0.25)',
                      border: '1px solid #00c853',
                      zIndex: 2100
                    }}
                  >
                    <div style={{ background: '#00c853', borderRadius: '50%', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ShoppingBag size={20} color="white" />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#00c853', margin: '0 0 2px 0' }}>Added to Cart</h4>
                      <p style={{ color: 'white', fontWeight: 'bold', margin: 0, fontSize: '13px' }}>{lastScanned.name}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {view === 'search' && (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{ paddingTop: '20px', paddingBottom: '100px' }}
            >
              <div className="glass" style={{ position: 'relative', display: 'flex', alignItems: 'center', padding: '12px 16px', borderRadius: 'var(--radius-lg)', marginBottom: '16px' }}>
                <SearchIcon size={20} color="var(--primary)" style={{ marginRight: '12px' }} />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for items..."
                  style={{ background: 'none', border: 'none', color: 'var(--text-main)', fontSize: '16px', width: '100%', outline: 'none' }}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <X size={18} />
                  </button>
                )}
              </div>

              {searchQuery && (
                <div style={{ marginBottom: '24px' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '12px' }}>
                    Found {allProducts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).length} matches
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '10px' }}>
                    {allProducts
                      .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                      .slice(0, 20)
                      .map(product => (
                        <ProductCard 
                          key={product._id || product.barcode} 
                          product={product} 
                          onDetail={setSelectedProductDetail} 
                          onAdd={addToCart} 
                        />
                      ))}
                  </div>
                </div>
              )}

              {!searchQuery && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={18} color="var(--primary)" /> Trending Now
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '10px' }}>
                    {allProducts.slice(20, 32).map(product => (
                      <ProductCard 
                        key={product._id || product.barcode} 
                        product={product} 
                        onDetail={setSelectedProductDetail} 
                        onAdd={addToCart} 
                      />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {view === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              style={{ paddingTop: '20px', paddingBottom: '100px' }}
            >
              {!isEditingProfile ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px', background: 'var(--glass)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary) 0%, #2196F3 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 'bold', color: 'white', border: '4px solid rgba(255,255,255,0.1)' }}>
                      {userData?.avatar || 'A'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>{userData?.name}</h2>
                      <p style={{ color: 'var(--text-muted)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={14} /> {userData?.location}
                      </p>
                    </div>
                    <button 
                      onClick={() => setView('settings')}
                      className="glass" 
                      style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'none', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Settings size={20} />
                    </button>
                  </div>

                  {/* Stats Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '32px' }}>
                    {[
                      { label: "Orders", val: userOrders.length, icon: <ShoppingBag size={16} /> },
                      { label: "Spent", val: `₹${userOrders.reduce((sum, o) => sum + o.total, 0)}`, icon: <BarChart2 size={16} /> },
                      { label: "Points", val: userData?.points || 0, icon: <Star size={16} /> }
                    ].map((stat, i) => (
                      <div key={i} style={{ background: 'var(--glass)', padding: '16px 8px', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--glass-border)' }}>
                        <div style={{ color: 'var(--primary)', marginBottom: '4px', display: 'flex', justifyContent: 'center' }}>{stat.icon}</div>
                        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{stat.val}</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Order History Timeline */}
                  <div style={{ marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>Recent Orders</h3>
                    <div style={{ display: 'grid', gap: '12px' }}>
                      {userOrders.map(order => (
                        <div key={order._id} style={{ padding: '16px', background: 'var(--glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>Order #{order._id.slice(-6).toUpperCase()}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{new Date(order.createdAt).toLocaleDateString()} • {order.items.length} items</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 'bold', color: 'var(--primary)' }}>₹{order.total}</div>
                            <div style={{ fontSize: '10px', color: '#00C853', background: 'rgba(0,200,83,0.1)', padding: '2px 6px', borderRadius: '4px', display: 'inline-block' }}>{order.status}</div>
                          </div>
                        </div>
                      ))}
                      {userOrders.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', border: '1px dashed var(--glass-border)', borderRadius: 'var(--radius-md)' }}>
                          No orders yet.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Profile Menu */}
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {[
                      { title: "Address Book", sub: `${userData?.addresses?.length || 0} saved locations`, icon: <MapPin size={20} /> },
                      { title: "Payments", sub: `${userData?.paymentMethods?.length || 0} saved methods`, icon: <CreditCard size={20} /> },
                      { title: "Help & Support", sub: "FAQs & Chat", icon: <HelpCircle size={20} /> }
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'var(--glass)', borderRadius: 'var(--radius-md)', cursor: 'pointer', border: '1px solid var(--glass-border)' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                          {item.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: '16px', fontWeight: 'bold' }}>{item.title}</h4>
                          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.sub}</p>
                        </div>
                        <ChevronRight size={18} color="var(--text-muted)" />
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => {
                      localStorage.removeItem('billix_auth');
                      setIsAuthenticated(false);
                      setUserData(null);
                      setView('auth');
                      if (appSettings.sound) {
                        const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2562/2562-84.wav");
                        audio.play().catch(() => {});
                      }
                    }}
                    style={{ width: '100%', marginTop: '32px', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid #ff4b2b', background: 'rgba(255,75,43,0.1)', color: '#ff4b2b', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
                  >
                    <LogOut size={20} /> Logout
                  </button>
                </>
              ) : (
                <div style={{ padding: '24px', background: 'var(--glass)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
                  <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Settings size={24} color="var(--primary)" /> Edit Your Profile
                  </h3>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Full Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="glass"
                      style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)', color: 'white', outline: 'none' }}
                    />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Current Location</label>
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      className="glass"
                      style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)', color: 'white', outline: 'none' }}
                    />
                  </div>

                  <div style={{ marginBottom: '32px' }}>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Avatar Initial</label>
                    <input
                      type="text"
                      maxLength={1}
                      value={editForm.avatar}
                      onChange={(e) => setEditForm({ ...editForm, avatar: e.target.value.toUpperCase() })}
                      className="glass"
                      style={{ width: '60px', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)', color: 'white', textAlign: 'center', fontSize: '20px', fontWeight: 'bold', outline: 'none' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => setIsEditingProfile(false)}
                      style={{ flex: 1, padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)', background: 'transparent', color: 'white', fontWeight: 'bold' }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          const res = await fetch('/api/user', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(editForm)
                          });
                          if (res.ok) {
                            setUserData(await res.json());
                            setIsEditingProfile(false);
                          }
                        } catch (err) {
                          console.error("Update failed", err);
                        }
                      }}
                      style={{ flex: 2, padding: '14px', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: 'bold' }}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {view === 'cart' && (
            <motion.div
              key="cart"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              style={{ paddingTop: '20px', paddingBottom: '100px' }}
            >
              {/* Collaborative Cart Status Banner */}
              {sharedSessionId ? (
                <div className="glass" style={{ 
                  padding: '16px 20px', 
                  borderRadius: 'var(--radius-md)', 
                  border: '1px solid var(--primary)', 
                  marginBottom: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  background: 'rgba(0, 200, 83, 0.05)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      width: '10px', 
                      height: '10px', 
                      borderRadius: '50%', 
                      background: 'var(--primary)',
                      boxShadow: '0 0 10px var(--primary)'
                    }}></div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 'bold' }}>
                        {isSharedHost ? "Hosting Collaborative Cart" : "Joined Collaborative Cart"}
                      </span>
                      <h4 style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--text-main)' }}>Session ID: {sharedSessionId}</h4>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => setShowShareModal(true)} 
                      className="glass" 
                      style={{ 
                        flex: 1, 
                        padding: '10px', 
                        borderRadius: 'var(--radius-sm)', 
                        border: '1px solid var(--glass-border)', 
                        color: 'white', 
                        fontSize: '12px', 
                        fontWeight: 'bold', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        gap: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <Share2 size={14} /> Invite Code
                    </button>
                    <button 
                      onClick={() => {
                        setSharedSessionId(null);
                        alert("Disconnected from Collaborative Cart Session. Your items are saved in your local cart.");
                      }} 
                      style={{ 
                        flex: 1, 
                        padding: '10px', 
                        borderRadius: 'var(--radius-sm)', 
                        border: '1px solid #ff4b2b', 
                        background: 'rgba(255, 75, 43, 0.1)', 
                        color: '#ff4b2b', 
                        fontSize: '12px', 
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      Leave Cart
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                  {/* HOST: Start a shared cart session */}
                  <button 
                    onClick={handleShareCart}
                    className="glass"
                    style={{ 
                      flex: 1,
                      padding: '14px', 
                      borderRadius: 'var(--radius-md)', 
                      border: '1px dashed var(--primary)', 
                      color: 'var(--primary)', 
                      fontWeight: '800', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      gap: '8px', 
                      cursor: 'pointer',
                      fontSize: '13px',
                      background: 'rgba(0, 200, 83, 0.03)'
                    }}
                  >
                    <Share2 size={15} /> Share Cart
                  </button>

                  {/* GUEST: Scan a shared cart QR to join */}
                  <button 
                    onClick={() => setView('scan')}
                    className="glass"
                    style={{ 
                      flex: 1,
                      padding: '14px', 
                      borderRadius: 'var(--radius-md)', 
                      border: '1px dashed rgba(255,255,255,0.25)', 
                      color: 'var(--text-main)', 
                      fontWeight: '800', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      gap: '8px', 
                      cursor: 'pointer',
                      fontSize: '13px',
                      background: 'rgba(255,255,255,0.03)'
                    }}
                  >
                    <QrCode size={15} /> Scan to Join
                  </button>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>My Cart ({cart.length})</h2>
                <span style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '20px' }}>₹{total.toFixed(2)}</span>
              </div>

              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <ShoppingBag size={64} color="var(--glass-border)" style={{ marginBottom: '16px' }} />
                  <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Your cart is empty. Start scanning items to see them here!</p>
                  <button className="btn-primary" style={{ marginTop: '24px', cursor: 'pointer' }} onClick={() => setView('scan')}>Go to Scanner</button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Unified Cart Items Card Container */}
                  <div className="glass" style={{
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--glass-border)',
                    background: 'var(--glass)',
                    overflow: 'hidden'
                  }}>
                    <div style={{ padding: '0 16px' }}>
                      {cart.map((item, idx) => {
                        const parts = item.name.split(' - ');
                        const displayName = parts[0];
                        const displaySize = parts[1] ? `1 pack (${parts[1]})` : '1 pack';
                        return (
                          <div key={item.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '14px',
                            padding: '16px 0',
                            borderBottom: idx === cart.length - 1 ? 'none' : '1px solid var(--glass-border)'
                          }}>
                            {/* Left: Square Image */}
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: 'var(--radius-sm)',
                                objectFit: 'cover',
                                flexShrink: 0,
                                border: '1px solid var(--glass-border)'
                              }}
                            />

                            {/* Middle: Name & Pack size */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <h4 style={{
                                fontSize: '13px',
                                fontWeight: '700',
                                color: 'var(--text-main)',
                                margin: '0 0 4px 0',
                                lineHeight: '1.4',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}>
                                {displayName}
                              </h4>
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{displaySize}</span>
                            </div>

                            {/* Right: Quantity Selector & Pricing */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 }}>
                              {/* Pink Quantity selector pill */}
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                width: '80px',
                                height: '28px',
                                borderRadius: '6px',
                                border: '1px solid rgba(236, 64, 122, 0.3)',
                                background: 'rgba(236, 64, 122, 0.08)'
                              }}>
                                <button 
                                  onClick={() => updateQuantity(item.id, -1)} 
                                  style={{ background: 'none', border: 'none', color: '#ec407a', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '100%', fontWeight: 'bold' }}
                                >
                                  <Minus size={10} />
                                </button>
                                <span style={{ fontWeight: '800', fontSize: '12px', color: '#ec407a' }}>{item.quantity}</span>
                                <button 
                                  onClick={() => updateQuantity(item.id, 1)} 
                                  style={{ background: 'none', border: 'none', color: '#ec407a', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '100%', fontWeight: 'bold' }}
                                >
                                  <Plus size={10} />
                                </button>
                              </div>

                              {/* MRP & Selling Price */}
                              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                <span style={{ fontSize: '10px', textDecoration: 'line-through', color: 'var(--text-muted)' }}>₹{item.mrp || item.price}</span>
                                <span style={{ fontSize: '13px', fontWeight: '800', color: '#00c853' }}>₹{item.price}</span>
                              </div>
                            </div>

                            {/* Far Right: Cross close button */}
                            <button 
                              onClick={() => removeFromCart(item.id)} 
                              style={{ 
                                background: 'none', 
                                border: 'none', 
                                color: 'var(--text-muted)', 
                                cursor: 'pointer',
                                padding: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                marginLeft: '4px',
                                opacity: 0.6,
                                transition: 'opacity 0.2s'
                              }}
                            >
                              <X size={15} />
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {/* Forgot Something row */}
                    <div 
                      onClick={() => setView('home')}
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '14px',
                        fontSize: '12px',
                        fontWeight: '700',
                        color: 'var(--text-main)',
                        borderTop: '1px solid var(--glass-border)',
                        background: 'rgba(255, 255, 255, 0.01)',
                        cursor: 'pointer'
                      }}
                    >
                      Forgot something? <span style={{ color: '#ec407a', marginLeft: '4px' }}>Add More Items</span>
                    </div>
                  </div>

                  {/* Billing Summary Box */}
                  <div className="glass" style={{ padding: '24px', borderRadius: 'var(--radius-md)', marginTop: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                      <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>₹{total.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Tax (0%)</span>
                      <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>₹0.00</span>
                    </div>
                    <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '16px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '18px' }}>
                      <span>Total Amount</span>
                      <span style={{ color: 'var(--primary)' }}>₹{total.toFixed(2)}</span>
                    </div>
                    <button 
                      onClick={() => setView('payment')}
                      className="btn-primary" 
                      style={{ width: '100%', marginTop: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                    >
                      <CreditCard size={20} /> Checkout Now
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {view === 'exit-pass' && checkedOutOrder && (
            <motion.div
              key="exit-pass"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ paddingBottom: '100px' }}
            >
              <div className="glass" style={{ 
                borderRadius: 'var(--radius-lg)', 
                border: '1px solid var(--glass-border)',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                background: 'linear-gradient(180deg, var(--glass) 0%, rgba(20,20,20,0.8) 100%)',
                position: 'relative'
              }}>
                <div style={{ 
                  background: 'linear-gradient(90deg, var(--primary) 0%, #00e676 100%)', 
                  padding: '16px', 
                  textAlign: 'center', 
                  color: 'white',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}>
                  <ShieldCheck size={22} /> VERIFIED EXIT PASS
                </div>

                <div style={{ padding: '28px 24px', textAlign: 'center' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                    Show QR Code to Exit Guard
                  </p>
                  
                  <div style={{
                    background: 'white',
                    padding: '16px',
                    borderRadius: '16px',
                    width: '210px',
                    height: '210px',
                    margin: '0 auto 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                  }}>
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=ORDER-${checkedOutOrder._id}`} 
                      alt="Exit Receipt QR" 
                      style={{ width: '180px', height: '180px' }}
                    />
                  </div>

                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px' }}>
                    Order #{checkedOutOrder._id.slice(-6).toUpperCase()}
                  </h3>
                  <p style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '22px', marginBottom: '24px' }}>
                    ₹{checkedOutOrder.total.toFixed(2)}
                  </p>

                  <div style={{ 
                    borderTop: '2px dashed var(--glass-border)', 
                    margin: '0 -24px 24px', 
                    position: 'relative' 
                  }}>
                    <div style={{ position: 'absolute', left: '-12px', top: '-12px', width: '24px', height: '24px', borderRadius: '50%', background: 'var(--bg-dark)' }}></div>
                    <div style={{ position: 'absolute', right: '-12px', top: '-12px', width: '24px', height: '24px', borderRadius: '50%', background: 'var(--bg-dark)' }}></div>
                  </div>

                  <div style={{ textAlign: 'left', marginBottom: '24px' }}>
                    <h4 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '12px' }}>Items Summary ({checkedOutOrder.items.length})</h4>
                    <div style={{ display: 'grid', gap: '8px', maxHeight: '160px', overflowY: 'auto', paddingRight: '4px' }}>
                      {checkedOutOrder.items.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                          <span style={{ color: 'white' }}>
                            {item.name} <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>x{item.quantity}</span>
                          </span>
                          <span style={{ fontWeight: 'bold' }}>₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ 
                    background: 'rgba(0, 200, 83, 0.05)', 
                    border: '1px solid rgba(0, 200, 83, 0.2)',
                    borderRadius: '8px', 
                    padding: '12px', 
                    marginBottom: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    color: 'var(--primary)',
                    fontWeight: 'bold',
                    fontSize: '13px'
                  }}>
                    <Star size={16} fill="var(--primary)" /> Saved ₹{Math.round(checkedOutOrder.total * 0.1)} & earned {Math.round(checkedOutOrder.total * 0.1)} reward points!
                  </div>

                  <button 
                    onClick={() => { setCheckedOutOrder(null); setView('home'); }} 
                    className="btn-primary" 
                    style={{ width: '100%', cursor: 'pointer' }}
                  >
                    Done & Back to Home
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'payment' && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              style={{ paddingTop: '20px', paddingBottom: '100px' }}
            >
              <div className="glass" style={{ padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <button 
                    onClick={() => setView('cart')}
                    style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  >
                    <X size={18} />
                  </button>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>
                      Secure Checkout
                    </span>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>Select Payment Method</h3>
                  </div>
                </div>

                <div className="glass" style={{ padding: '20px', borderRadius: 'var(--radius-md)', marginBottom: '16px', background: 'rgba(0, 200, 83, 0.05)', border: '1px solid rgba(0, 200, 83, 0.15)', textAlign: 'center' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Amount Payable</span>
                  <h2 style={{ fontSize: '32px', fontWeight: '900', color: 'var(--primary)', marginTop: '4px' }}>₹{total.toFixed(2)}</h2>
                </div>

                {/* Collapsible Order Summary Breakdown */}
                <div 
                  onClick={() => setShowCheckoutItems(!showCheckoutItems)}
                  className="glass hover-card" 
                  style={{ 
                    padding: '12px 18px', 
                    borderRadius: 'var(--radius-md)', 
                    marginBottom: '16px', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    cursor: 'pointer',
                    background: appSettings.theme === 'light' ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--glass-border)',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ShoppingBag size={18} style={{ color: 'var(--primary)' }} />
                    <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-main)' }}>
                      Review Order Summary ({cart.length} items)
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '12px' }}>
                    {showCheckoutItems ? 'Hide details' : 'View details'}
                    <motion.div animate={{ rotate: showCheckoutItems ? 90 : 0 }}>
                      <ChevronRight size={16} />
                    </motion.div>
                  </div>
                </div>

                <AnimatePresence>
                  {showCheckoutItems && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ 
                        display: 'grid', 
                        gap: '10px', 
                        maxHeight: '180px', 
                        overflowY: 'auto', 
                        paddingRight: '6px',
                        background: appSettings.theme === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(0,0,0,0.2)',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid var(--glass-border)'
                      }}>
                        {cart.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'cover', background: 'rgba(255,255,255,0.05)' }} 
                              />
                              <div style={{ textAlign: 'left' }}>
                                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {item.name}
                                </div>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                  ₹{item.price} x {item.quantity}
                                </div>
                              </div>
                            </div>
                            <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-main)' }}>
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '11px', marginBottom: '24px' }}>
                  <ShieldCheck size={14} style={{ color: 'var(--primary)' }} />
                  <span>SSL Encrypted • PCI-DSS Secure Checkout</span>
                </div>

                {paymentProcessing ? (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <div className="spinner-loader" style={{
                      width: '50px',
                      height: '50px',
                      border: '4px solid rgba(255,255,255,0.1)',
                      borderTop: '4px solid var(--primary)',
                      borderRadius: '50%',
                      margin: '0 auto 24px',
                      animation: 'spin 1s linear infinite',
                      willChange: 'transform'
                    }}></div>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-main)' }}>Processing Online Payment</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Connecting to secure payment gateway. Please do not close or reload the app...</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: '16px' }}>
                    {/* Cash Counter payment option */}
                    <div 
                      onClick={() => setSelectedPaymentOption('Cash')}
                      className="glass hover-card" 
                      style={{ 
                        padding: '20px', 
                        borderRadius: 'var(--radius-md)', 
                        border: selectedPaymentOption === 'Cash' ? '2px solid var(--primary)' : '1px solid var(--glass-border)',
                        background: selectedPaymentOption === 'Cash' ? 'rgba(0, 200, 83, 0.05)' : (appSettings.theme === 'light' ? 'rgba(0,0,0,0.01)' : 'rgba(255,255,255,0.02)'),
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '10px',
                          background: selectedPaymentOption === 'Cash' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                          color: selectedPaymentOption === 'Cash' ? (appSettings.theme === 'light' ? 'white' : 'var(--bg-dark)') : 'var(--text-main)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease'
                        }}>
                          <Smartphone size={22} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontWeight: 'bold', fontSize: '16px', color: 'var(--text-main)' }}>Pay Cash/Card at Counter</h4>
                          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Generate temporary QR to pay at billing desk</p>
                        </div>
                        <div style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          border: selectedPaymentOption === 'Cash' ? '6px solid var(--primary)' : '2px solid var(--glass-border)',
                          background: 'transparent',
                          transition: 'all 0.2s ease'
                        }}></div>
                      </div>

                      <AnimatePresence>
                        {selectedPaymentOption === 'Cash' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            style={{ overflow: 'hidden' }}
                          >
                            <p style={{ fontSize: '13px', color: 'var(--text-main)', lineHeight: '1.5', background: appSettings.theme === 'light' ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid var(--primary)' }}>
                              ℹ️ A temporary barcode QR will be generated. Go to any open cash counter, show the QR to the cashier to pay, and your receipt will instantly unlock on your phone!
                            </p>
                            <button
                              onClick={() => handleCheckout('Cash')}
                              className="btn-primary"
                              style={{ width: '100%', marginTop: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                            >
                              <QrCode size={18} /> Generate Counter QR
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Online payment option */}
                    <div 
                      onClick={() => { if (selectedPaymentOption === 'Cash' || !selectedPaymentOption) setSelectedPaymentOption('UPI'); }}
                      className="glass hover-card" 
                      style={{ 
                        padding: '20px', 
                        borderRadius: 'var(--radius-md)', 
                        border: selectedPaymentOption && selectedPaymentOption !== 'Cash' ? '2px solid var(--primary)' : '1px solid var(--glass-border)',
                        background: selectedPaymentOption && selectedPaymentOption !== 'Cash' ? 'rgba(0, 200, 83, 0.05)' : (appSettings.theme === 'light' ? 'rgba(0,0,0,0.01)' : 'rgba(255,255,255,0.02)'),
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '10px',
                          background: selectedPaymentOption && selectedPaymentOption !== 'Cash' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                          color: selectedPaymentOption && selectedPaymentOption !== 'Cash' ? (appSettings.theme === 'light' ? 'white' : 'var(--bg-dark)') : 'var(--text-main)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease'
                        }}>
                          <CreditCard size={22} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontWeight: 'bold', fontSize: '16px', color: 'var(--text-main)' }}>Pay Online (Instant Exit Pass)</h4>
                          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Simulate instant UPI, Cards, or Net Banking payment</p>
                        </div>
                        <div style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          border: selectedPaymentOption && selectedPaymentOption !== 'Cash' ? '6px solid var(--primary)' : '2px solid var(--glass-border)',
                          background: 'transparent',
                          transition: 'all 0.2s ease'
                        }}></div>
                      </div>

                      <AnimatePresence>
                        {selectedPaymentOption && selectedPaymentOption !== 'Cash' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginTop: 20 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            style={{ overflow: 'hidden' }}
                          >
                            {/* Payment Sub-tabs */}
                            <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px', marginBottom: '16px' }}>
                              {['UPI', 'Card', 'NetBanking'].map(opt => (
                                <button
                                  key={opt}
                                  onClick={(e) => { e.stopPropagation(); setSelectedPaymentOption(opt); }}
                                  style={{
                                    flex: 1,
                                    padding: '8px',
                                    borderRadius: '6px',
                                    background: selectedPaymentOption === opt ? (appSettings.theme === 'light' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.1)') : 'transparent',
                                    border: 'none',
                                    color: selectedPaymentOption === opt ? 'var(--primary)' : 'var(--text-muted)',
                                    fontWeight: 'bold',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                  }}
                                >
                                  {opt === 'NetBanking' ? 'Net Banking' : opt}
                                </button>
                              ))}
                            </div>

                            {selectedPaymentOption === 'UPI' && (
                              <div style={{ display: 'grid', gap: '8px', marginBottom: '16px' }}>
                                {['Google Pay', 'PhonePe', 'Paytm', 'BHIM UPI'].map((upi, idx) => (
                                  <div key={idx} className="glass" style={{ padding: '12px 16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                                    <span style={{ fontWeight: '500', color: 'var(--text-main)' }}>{upi}</span>
                                    <span style={{ color: 'var(--primary)', fontSize: '11px', fontWeight: 'bold', background: 'rgba(0,200,83,0.1)', padding: '2px 8px', borderRadius: '4px' }}>CONNECTED</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {selectedPaymentOption === 'Card' && (
                              <div style={{ display: 'grid', gap: '10px', marginBottom: '16px' }}>
                                <input
                                  type="text"
                                  placeholder="Card Number (E.g., 4111 2222 3333 4444)"
                                  disabled
                                  value="•••• •••• •••• 4242"
                                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: appSettings.theme === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.05)', color: 'var(--text-main)', fontSize: '13px', outline: 'none' }}
                                />
                                <div style={{ display: 'flex', gap: '10px' }}>
                                  <input
                                    type="text"
                                    placeholder="MM/YY"
                                    disabled
                                    value="12/29"
                                    style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: appSettings.theme === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.05)', color: 'var(--text-main)', fontSize: '13px', outline: 'none', textAlign: 'center' }}
                                  />
                                  <input
                                    type="password"
                                    placeholder="CVV"
                                    disabled
                                    value="•••"
                                    style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: appSettings.theme === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.05)', color: 'var(--text-main)', fontSize: '13px', outline: 'none', textAlign: 'center' }}
                                  />
                                </div>
                              </div>
                            )}

                            {selectedPaymentOption === 'NetBanking' && (
                              <div style={{ display: 'grid', gap: '8px', marginBottom: '16px' }}>
                                {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank'].map((bank, idx) => (
                                  <div key={idx} className="glass" style={{ padding: '12px 16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                                    <span style={{ fontWeight: '500', color: 'var(--text-main)' }}>{bank}</span>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Popular Bank</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            <button
                              onClick={() => {
                                setPaymentProcessing(true);
                                setTimeout(async () => {
                                  setPaymentProcessing(false);
                                  await handleCheckout('Online');
                                }, 2000);
                              }}
                              className="btn-primary"
                              style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                            >
                              <ShieldCheck size={18} /> Simulate Online Payment
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {view === 'temporary-cash-qr' && checkedOutOrder && (
            <motion.div
              key="temporary-cash-qr"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ paddingBottom: '100px' }}
            >
              <div className="glass" style={{ 
                borderRadius: 'var(--radius-lg)', 
                border: '1px solid var(--glass-border)',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                background: 'linear-gradient(180deg, var(--glass) 0%, rgba(20,20,20,0.8) 100%)'
              }}>
                <div style={{ 
                  background: 'linear-gradient(90deg, #ffaa00 0%, #ff8800 100%)', 
                  padding: '16px', 
                  textAlign: 'center', 
                  color: 'var(--bg-dark)',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}>
                  <Smartphone size={22} /> PENDING COUNTER PAYMENT
                </div>

                <div style={{ padding: '28px 24px', textAlign: 'center' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                    Show QR to Cash Counter Staff
                  </p>
                  
                  <div style={{
                    background: 'white',
                    padding: '16px',
                    borderRadius: '16px',
                    width: '210px',
                    height: '210px',
                    margin: '0 auto 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                  }}>
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=CASH-ORDER-${checkedOutOrder._id}`} 
                      alt="Counter Payment QR" 
                      style={{ width: '180px', height: '180px' }}
                    />
                  </div>

                  <div className="glass" style={{ 
                    padding: '12px', 
                    borderRadius: '8px', 
                    marginBottom: '24px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '10px',
                    background: 'rgba(255, 170, 0, 0.05)',
                    border: '1px solid rgba(255, 170, 0, 0.2)',
                    color: '#ffaa00',
                    fontSize: '13px',
                    fontWeight: 'bold'
                  }}>
                    <span className="pulse-indicator" style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#ffaa00',
                      boxShadow: '0 0 10px #ffaa00',
                      animation: 'pulse 1.5s infinite'
                    }}></span>
                    Waiting for cashier payment collection...
                  </div>

                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px' }}>
                    Cash Ticket #{checkedOutOrder._id.slice(-6).toUpperCase()}
                  </h3>
                  <p style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '22px', marginBottom: '24px' }}>
                    ₹{checkedOutOrder.total.toFixed(2)}
                  </p>

                  <div style={{ 
                    borderTop: '2px dashed var(--glass-border)', 
                    margin: '0 -24px 24px', 
                    position: 'relative' 
                  }}>
                    <div style={{ position: 'absolute', left: '-12px', top: '-12px', width: '24px', height: '24px', borderRadius: '50%', background: 'var(--bg-dark)' }}></div>
                    <div style={{ position: 'absolute', right: '-12px', top: '-12px', width: '24px', height: '24px', borderRadius: '50%', background: 'var(--bg-dark)' }}></div>
                  </div>

                  <div style={{ textAlign: 'left', marginBottom: '32px' }}>
                    <h4 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '12px' }}>Items Summary ({checkedOutOrder.items.length})</h4>
                    <div style={{ display: 'grid', gap: '8px', maxHeight: '160px', overflowY: 'auto', paddingRight: '4px' }}>
                      {checkedOutOrder.items.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                          <span style={{ color: 'white' }}>
                            {item.name} <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>x{item.quantity}</span>
                          </span>
                          <span style={{ fontWeight: 'bold' }}>₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => { 
                      setCart(checkedOutOrder.items); 
                      setCheckedOutOrder(null); 
                      setView('cart'); 
                    }} 
                    style={{ width: '100%', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)', background: 'transparent', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    Cancel & Back to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'cashier-portal' && scannedOrderForCashier && (
            <motion.div
              key="cashier-portal"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              style={{ paddingBottom: '100px' }}
            >
              <div className="glass" style={{ padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255, 170, 0, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffaa00' }}>
                    <Smartphone size={28} />
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>
                      Counter Billing Desk
                    </span>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>Cash Payment Portal</h3>
                  </div>
                  <button 
                    onClick={() => { setScannedOrderForCashier(null); setView('profile'); }}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginLeft: 'auto' }}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div style={{ 
                  background: 'rgba(255,255,255,0.03)', 
                  border: '1px solid var(--glass-border)',
                  padding: '16px', 
                  borderRadius: 'var(--radius-md)', 
                  marginBottom: '24px' 
                }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>Customer Details</div>
                  <h4 style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '2px', color: 'white' }}>{scannedOrderForCashier.userId?.name || "Aman Gupta"}</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px' }}>Email: {scannedOrderForCashier.userId?.email || "aman@billix.com"}</p>
                  
                  <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '12px 0' }} />
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span>Order: <span style={{ fontWeight: 'bold' }}>#{scannedOrderForCashier._id.slice(-6).toUpperCase()}</span></span>
                    <span>Status: <span style={{ 
                      color: '#ffaa00', 
                      fontWeight: 'bold',
                      background: 'rgba(255,170,0,0.1)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '10px'
                    }}>{scannedOrderForCashier.status}</span></span>
                  </div>
                </div>

                <h4 style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Billing Item List ({scannedOrderForCashier.items.reduce((sum, item) => sum + item.quantity, 0)} Items)
                </h4>

                <div style={{ display: 'grid', gap: '10px', marginBottom: '32px' }}>
                  {scannedOrderForCashier.items.map((item, idx) => (
                    <div 
                      key={idx} 
                      className="glass"
                      style={{ 
                        padding: '12px 16px', 
                        borderRadius: 'var(--radius-md)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        border: '1px solid var(--glass-border)'
                      }}
                    >
                      <span style={{ fontWeight: '600', fontSize: '15px' }}>{item.name}</span>
                      <span style={{ fontSize: '13px', fontWeight: '800', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '12px' }}>
                        Qty: {item.quantity} x ₹{item.price}
                      </span>
                    </div>
                  ))}
                </div>

                {cashierPortalStatus === 'success' ? (
                  <div style={{ textAlign: 'center', padding: '24px 0' }}>
                    <div style={{ 
                      width: '64px', 
                      height: '64px', 
                      borderRadius: '50%', 
                      background: 'var(--primary)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      color: 'white',
                      margin: '0 auto 16px',
                      boxShadow: '0 0 20px var(--primary)'
                    }}>
                      <Check size={36} />
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '8px' }}>PAYMENT COLLECTED</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>Cash order approved. The customer's mobile receipt has unlocked successfully.</p>
                    <button 
                      onClick={() => { setScannedOrderForCashier(null); setView('profile'); }}
                      className="btn-primary"
                      style={{ width: '100%', cursor: 'pointer' }}
                    >
                      Done & Close
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
                    <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(0, 200, 83, 0.2)', background: 'rgba(0, 200, 83, 0.05)', textAlign: 'center', marginBottom: '16px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Amount to Collect from Customer</span>
                      <h2 style={{ fontSize: '32px', fontWeight: '900', color: 'var(--primary)', marginTop: '4px' }}>₹{scannedOrderForCashier.total.toFixed(2)}</h2>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button 
                        onClick={() => { setScannedOrderForCashier(null); setView('profile'); }}
                        style={{ flex: 1, padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)', background: 'transparent', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={async () => {
                          try {
                            const res = await fetch(`/api/orders/${scannedOrderForCashier._id}/verify-cash`, {
                              method: 'PUT'
                            });
                            if (res.ok) {
                              setCashierPortalStatus('success');
                              if (appSettings.sound) {
                                const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2018/2018-84.wav");
                                audio.play().catch(() => {});
                              }
                            }
                          } catch (err) {
                            console.error("Cash verification failed", err);
                            alert("Failed to record cash payment in database.");
                          }
                        }}
                        className="btn-primary"
                        style={{ flex: 2, padding: '16px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
                      >
                        <ShieldCheck size={20} /> Approve & Paid
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {view === 'guard-portal' && scannedOrderForAudit && (
            <motion.div
              key="guard-portal"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              style={{ paddingBottom: '100px' }}
            >
              <div className="glass" style={{ padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0, 200, 83, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                    <ShieldCheck size={28} />
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>
                      Security Gate Portal
                    </span>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>Verification Checklist</h3>
                  </div>
                  <button 
                    onClick={() => { setScannedOrderForAudit(null); setView('profile'); }}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginLeft: 'auto' }}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div style={{ 
                  background: 'rgba(255,255,255,0.03)', 
                  border: '1px solid var(--glass-border)',
                  padding: '16px', 
                  borderRadius: 'var(--radius-md)', 
                  marginBottom: '24px' 
                }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>Customer Details</div>
                  <h4 style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '2px', color: 'var(--text-main)' }}>{scannedOrderForAudit.userId?.name || "Aman Gupta"}</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px' }}>Email: {scannedOrderForAudit.userId?.email || "aman@billix.com"}</p>
                  
                  <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '12px 0' }} />
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span>Order: <span style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>#{scannedOrderForAudit._id.slice(-6).toUpperCase()}</span></span>
                    <span>Status: <span style={{ 
                      color: scannedOrderForAudit.status === 'Audited' ? '#ffaa00' : 'var(--primary)', 
                      fontWeight: 'bold',
                      background: scannedOrderForAudit.status === 'Audited' ? 'rgba(255,170,0,0.1)' : 'rgba(0,200,83,0.1)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '10px'
                    }}>{scannedOrderForAudit.status}</span></span>
                  </div>
                </div>

                {/* Progress Indicators & Checklist */}
                {(() => {
                  const totalItems = scannedOrderForAudit.items.length;
                  const verifiedCount = scannedOrderForAudit.items.filter((item, idx) => verifiedItems[idx]).length;
                  const allVerified = verifiedCount === totalItems;
                  const progressPercentage = (verifiedCount / totalItems) * 100;

                  return (
                    <>
                      {auditStatus !== 'success' && (
                        <div style={{ marginBottom: '24px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '12px', fontWeight: 'bold' }}>
                            <span style={{ color: 'var(--text-muted)' }}>VERIFICATION PROGRESS</span>
                            <span style={{ color: 'var(--primary)' }}>{verifiedCount} of {totalItems} Verified</span>
                          </div>
                          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--glass-border)', padding: '1px' }}>
                            <div style={{ 
                              width: `${progressPercentage}%`, 
                              height: '100%', 
                              background: 'var(--primary)', 
                              boxShadow: '0 0 10px var(--primary)',
                              borderRadius: '10px', 
                              transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)' 
                            }} />
                          </div>
                        </div>
                      )}

                      <h4 style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Verify Bag Contents ({scannedOrderForAudit.items.reduce((sum, item) => sum + item.quantity, 0)} Items)
                      </h4>

                      <div style={{ display: 'grid', gap: '10px', marginBottom: '32px' }}>
                        {scannedOrderForAudit.items.map((item, idx) => {
                          const isVerified = !!verifiedItems[idx];
                          return (
                            <div 
                              key={idx} 
                              onClick={() => {
                                if (auditStatus === 'success') return;
                                setVerifiedItems(prev => {
                                  const next = { ...prev, [idx]: !prev[idx] };
                                  if (appSettings.sound) {
                                    const audio = new Audio(next[idx] 
                                      ? "https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav" 
                                      : "https://assets.mixkit.co/active_storage/sfx/2562/2562-84.wav"
                                    );
                                    audio.play().catch(() => {});
                                  }
                                  if (appSettings.haptic && navigator.vibrate) {
                                    navigator.vibrate(10);
                                  }
                                  return next;
                                });
                              }}
                              className="glass hover-card"
                              style={{ 
                                padding: '14px 18px', 
                                borderRadius: 'var(--radius-md)', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'space-between',
                                border: isVerified ? '1.5px solid var(--primary)' : '1px solid var(--glass-border)',
                                background: isVerified ? 'rgba(0, 200, 83, 0.05)' : 'rgba(255,255,255,0.01)',
                                boxShadow: isVerified ? '0 0 12px rgba(0, 200, 83, 0.08)' : 'none',
                                cursor: auditStatus === 'success' ? 'default' : 'pointer',
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                  width: '22px',
                                  height: '22px',
                                  borderRadius: '6px',
                                  border: isVerified ? '2px solid var(--primary)' : '2px solid var(--glass-border)',
                                  background: isVerified ? 'var(--primary)' : 'transparent',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: isVerified ? (appSettings.theme === 'light' ? 'white' : 'var(--bg-dark)') : 'transparent',
                                  transition: 'all 0.15s ease'
                                }}>
                                  <Check size={14} strokeWidth={3} />
                                </div>
                                <span style={{ 
                                  fontWeight: '600', 
                                  fontSize: '15px',
                                  color: 'var(--text-main)',
                                  textDecoration: isVerified ? 'line-through' : 'none',
                                  opacity: isVerified ? 0.6 : 1,
                                  transition: 'all 0.2s ease'
                                }}>
                                  {item.name}
                                </span>
                              </div>
                              <span style={{ 
                                fontSize: '13px', 
                                fontWeight: '800', 
                                background: isVerified ? 'rgba(0, 200, 83, 0.15)' : 'rgba(255,255,255,0.05)', 
                                color: isVerified ? 'var(--primary)' : 'var(--text-main)',
                                padding: '4px 10px', 
                                borderRadius: '12px',
                                transition: 'all 0.2s ease'
                              }}>
                                Qty: {item.quantity}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {auditStatus === 'success' ? (
                        <div style={{ textAlign: 'center', padding: '20px 0' }}>
                          <motion.div 
                            initial={{ scale: 0.5, rotate: -15, opacity: 0 }}
                            animate={{ scale: 1, rotate: 0, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                            style={{ 
                              width: '80px', 
                              height: '80px', 
                              borderRadius: '50%', 
                              background: 'rgba(0, 200, 83, 0.1)', 
                              border: '4px solid var(--primary)',
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center', 
                              color: 'var(--primary)',
                              margin: '0 auto 20px',
                              boxShadow: '0 0 30px rgba(0, 200, 83, 0.2)'
                            }}
                          >
                            <ShieldCheck size={48} />
                          </motion.div>
                          
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            <div style={{
                              border: '3px solid var(--primary)',
                              color: 'var(--primary)',
                              borderRadius: '8px',
                              padding: '6px 20px',
                              display: 'inline-block',
                              fontWeight: '900',
                              fontSize: '18px',
                              letterSpacing: '3px',
                              textTransform: 'uppercase',
                              transform: 'rotate(-4deg)',
                              marginBottom: '24px',
                              boxShadow: '0 0 15px rgba(0,200,83,0.1)',
                              background: 'rgba(0, 200, 83, 0.05)'
                            }}>
                              EXIT APPROVED
                            </div>
                            
                            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '8px' }}>Security Gate Cleared</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '24px', maxWidth: '280px', margin: '0 auto 24px' }}>
                              This customer has been successfully verified. Bag contents matched receipt items perfectly.
                            </p>

                            <div className="glass" style={{ textAlign: 'left', padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.01)', marginBottom: '28px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                                <span>Auditor Gate ID</span>
                                <span style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>GATE-04_MAIN</span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                                <span>Receipt ID</span>
                                <span style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>#{scannedOrderForAudit._id.slice(-8).toUpperCase()}</span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                                <span>Total Checked</span>
                                <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{scannedOrderForAudit.items.reduce((sum, i) => sum + i.quantity, 0)} Items</span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                                <span>Cleared At</span>
                                <span style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>{new Date().toLocaleTimeString()}</span>
                              </div>
                            </div>

                            <button 
                              onClick={() => { setScannedOrderForAudit(null); setView('profile'); }}
                              className="btn-primary"
                              style={{ width: '100%', cursor: 'pointer' }}
                            >
                              Close Gate View
                            </button>
                          </motion.div>
                        </div>
                      ) : (
                        <>
                          {!allVerified && (
                            <div style={{
                              fontSize: '12px',
                              color: '#ffaa00',
                              textAlign: 'center',
                              marginBottom: '16px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '8px',
                              background: 'rgba(255, 170, 0, 0.05)',
                              border: '1px solid rgba(255, 170, 0, 0.2)',
                              borderRadius: '8px',
                              padding: '10px 14px'
                            }}>
                              <AlertTriangle size={14} /> Please verify & check off all items in the bag to unlock exit approval.
                            </div>
                          )}

                          <div style={{ display: 'flex', gap: '12px' }}>
                            <button 
                              onClick={() => { setScannedOrderForAudit(null); setView('profile'); }}
                              style={{ flex: 1, padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-main)', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                              Cancel Audit
                            </button>
                            <button 
                              disabled={!allVerified}
                              onClick={async () => {
                                if (!allVerified) return;
                                try {
                                  const res = await fetch(`/api/orders/${scannedOrderForAudit._id}/verify`, {
                                    method: 'PUT'
                                  });
                                  if (res.ok) {
                                    setAuditStatus('success');
                                    if (appSettings.sound) {
                                      const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2018/2018-84.wav");
                                      audio.play().catch(() => {});
                                    }
                                  }
                                } catch (err) {
                                  console.error("Verification failed", err);
                                  alert("Failed to update verification status in database.");
                                }
                              }}
                              className="btn-primary"
                              style={{ 
                                flex: 2, 
                                padding: '16px', 
                                borderRadius: 'var(--radius-md)', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                gap: '8px', 
                                cursor: allVerified ? 'pointer' : 'not-allowed',
                                opacity: allVerified ? 1 : 0.4,
                                boxShadow: allVerified ? '0 0 15px rgba(0, 200, 83, 0.4)' : 'none',
                                background: allVerified ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                color: allVerified ? (appSettings.theme === 'light' ? 'white' : 'var(--bg-dark)') : 'var(--text-muted)',
                                transition: 'all 0.3s ease'
                              }}
                            >
                              <ShieldCheck size={20} /> Approve Exit
                            </button>
                          </div>
                        </>
                      )}
                    </>
                  );
                })()}
              </div>
            </motion.div>
          )}

          {view === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              style={{ paddingTop: '20px', paddingBottom: '100px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <button
                  onClick={() => setView('profile')}
                  className="glass"
                  style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'none', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <ChevronRight size={24} style={{ transform: 'rotate(180deg)' }} />
                </button>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Settings</h2>
              </div>

              {/* Setting Sections */}
              {[
                {
                  title: "App Preferences",
                  items: [
                    {
                      icon: appSettings.theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />, 
                      label: "Theme", 
                      type: "custom", 
                      render: () => (
                        <div style={{ display: 'flex', background: 'var(--bg-dark)', padding: '4px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                          {['light', 'dark'].map(t => (
                            <button 
                              key={t}
                              onClick={(e) => { e.stopPropagation(); if(appSettings.theme !== t) toggleSetting('theme'); }}
                              style={{
                                padding: '6px 12px',
                                borderRadius: '8px',
                                border: 'none',
                                background: appSettings.theme === t ? 'var(--primary)' : 'transparent',
                                color: appSettings.theme === t ? 'white' : 'var(--text-muted)',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                textTransform: 'capitalize',
                                transition: 'all 0.2s ease',
                                cursor: 'pointer'
                              }}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      )
                    },
                    { icon: <Volume2 size={20} />, label: "Sound Effects", type: "toggle", active: appSettings.sound, key: 'sound' },
                    { icon: <Smartphone size={20} />, label: "Haptic Feedback", type: "toggle", active: appSettings.haptic, key: 'haptic' }
                  ]
                },
                {
                  title: "Store Settings",
                  items: [
                    {
                      icon: <MapPin size={20} />,
                      label: "Active Location",
                      type: "custom",
                      render: () => (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setView('store-select');
                          }}
                          style={{
                            background: 'rgba(0,200,83,0.1)',
                            border: '1px solid var(--primary)',
                            color: 'var(--primary)',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          Switch Store
                        </button>
                      )
                    }
                  ]
                },
                {
                  title: "Notifications",
                  items: [
                    { icon: <Bell size={20} />, label: "Order Updates", type: "toggle", active: appSettings.orderUpdates, key: 'orderUpdates' },
                    { icon: <Bell size={20} />, label: "Promotions", type: "toggle", active: appSettings.promotions, key: 'promotions' }
                  ]
                },
                {
                  title: "Security & Privacy",
                  items: [
                    { icon: <Shield size={20} />, label: "Checkout PIN", value: "Enabled", type: "text" },
                    { icon: <Shield size={20} />, label: "Biometric Login", type: "toggle", active: appSettings.biometric, key: 'biometric' }
                  ]
                },
                {
                  title: "Security Gate Portal",
                  items: [
                    { 
                      icon: <ShieldCheck size={20} />, 
                      label: "Demo Gate Portal", 
                      type: "custom",
                      render: () => (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setScannedOrderForAudit({
                              _id: "6647bc7a2f1ab0c67f89d311",
                              createdAt: new Date().toISOString(),
                              total: 108.00,
                              status: "Verified",
                              items: [
                                { name: "Tomato Premium Local", quantity: 2, price: 29.00 },
                                { name: "Oreo Cookie Milk Pack", quantity: 1, price: 50.00 }
                              ],
                              userId: {
                                name: "Aman Gupta",
                                email: "aman@billix.com"
                              }
                            });
                            setAuditStatus('fetched');
                            setView('guard-portal');
                          }}
                          style={{
                            background: 'var(--primary)',
                            border: 'none',
                            color: 'white',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          Launch Portal
                        </button>
                      )
                    }
                  ]
                },
                {
                  title: "About",
                  items: [
                    { icon: <Info size={20} />, label: "App Version", value: "v2.4.1", type: "text" },
                    { icon: <Info size={20} />, label: "Terms of Service", type: "link" }
                  ]
                }
              ].map((section, idx) => (
                <div key={idx} style={{ marginBottom: '28px' }}>
                  <h3 style={{ 
                    fontSize: '13px', 
                    color: 'var(--primary)', 
                    fontWeight: '800', 
                    textTransform: 'uppercase', 
                    letterSpacing: '1.5px', 
                    marginBottom: '14px', 
                    paddingLeft: '8px' 
                  }}>
                    {section.title}
                  </h3>
                  <div style={{ 
                    background: 'var(--glass)', 
                    borderRadius: 'var(--radius-lg)', 
                    border: '1px solid var(--glass-border)', 
                    overflow: 'hidden',
                    boxShadow: 'none'
                  }}>
                    {section.items.map((item, i) => (
                      <div
                        key={i}
                        onClick={() => item.type === 'toggle' && toggleSetting(item.key)}
                        style={{
                          padding: '18px 20px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                          borderBottom: i === section.items.length - 1 ? 'none' : '1px solid var(--glass-border)',
                          cursor: 'pointer',
                          background: 'transparent'
                        }}
                      >
                        <div style={{ color: 'var(--primary)' }}>{item.icon}</div>
                        <div style={{ flex: 1, fontWeight: '600', fontSize: '15px' }}>{item.label}</div>

                        {item.type === 'custom' && item.render()}
                        
                        {item.type === 'toggle' && (
                          <div style={{
                            width: '40px',
                            height: '22px',
                            borderRadius: '11px',
                            background: item.active ? 'var(--primary)' : (appSettings.theme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'),
                            position: 'relative',
                            transition: 'all 0.3s ease',
                            border: item.active ? 'none' : `1px solid ${appSettings.theme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'}`
                          }}>
                            <div style={{
                              position: 'absolute',
                              top: '2px',
                              left: item.active ? '20px' : '2px',
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              background: 'white',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}></div>
                          </div>
                        )}

                        {item.type === 'text' && (
                          <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{item.value}</span>
                        )}

                        {item.type === 'link' && (
                          <ChevronRight size={18} color="var(--text-muted)" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '12px' }}>
                © 2026 Billix Experience. <br /> All rights reserved.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {view !== 'scan' && view !== 'store-select' && view !== 'auth' && (
        <>
          {/* Gradient fade to mask content scrolling under the bottom nav */}
          <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: '120px',
            background: 'linear-gradient(to top, var(--bg-dark) 0%, var(--bg-dark) 30%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 999
          }} />
          <nav className="bottom-nav">
          <div className={`nav-item ${view === 'home' ? 'active' : ''}`} onClick={() => { window.scrollTo(0, 0); setView('home'); }}>
            <HomeIcon size={22} />
            <span>Home</span>
          </div>
          <div className={`nav-item ${view === 'search' ? 'active' : ''}`} onClick={() => { window.scrollTo(0, 0); setView('search'); }}>
            <SearchIcon size={22} />
            <span>Search</span>
          </div>
          <div className="scan-fab-container">
            <div className="scan-fab" onClick={() => setView('scan')}>
              <Scan size={28} />
            </div>
          </div>
          <div className={`nav-item ${view === 'profile' ? 'active' : ''}`} onClick={() => { window.scrollTo(0, 0); setView('profile'); }}>
            <UserIcon size={22} />
            <span>Profile</span>
          </div>
          <div className={`nav-item ${view === 'cart' ? 'active' : ''}`} onClick={() => { window.scrollTo(0, 0); setView('cart'); }}>
            <div style={{ position: 'relative' }}>
              <ShoppingBag size={22} />
              <motion.span
                key={cart.reduce((sum, item) => sum + item.quantity, 0)}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-10px',
                  background: '#ff4b2b',
                  color: 'white',
                  fontSize: '10px',
                  minWidth: '16px',
                  height: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '10px',
                  fontWeight: '800',
                  border: '2px solid var(--bg-dark)',
                  transition: 'background 0.3s ease'
                }}
              >
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </motion.span>
            </div>
            <span>Cart</span>
          </div>
        </nav>
        </>
      )}

      {/* Collaborative Cart Invitation Overlay Modal */}
      <AnimatePresence>
        {showShareModal && sharedSessionId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 3000,
              background: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="glass"
              style={{
                width: '100%',
                maxWidth: '340px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--glass-border)',
                padding: '28px 24px',
                textAlign: 'center',
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                background: 'linear-gradient(135deg, rgba(30,30,30,0.9) 0%, rgba(10,10,10,0.95) 100%)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}>
                  <Share2 size={20} color="var(--primary)" /> Invite Shopper
                </h3>
                <button 
                  onClick={() => setShowShareModal(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '24px' }}>
                Scan this QR code using another phone's barcode scanner to instantly link carts!
              </p>

              {/* Dynamic Invitation QR Code */}
              <div style={{
                background: 'white',
                padding: '12px',
                borderRadius: '16px',
                width: '180px',
                height: '180px',
                margin: '0 auto 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
              }}>
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=CART-${sharedSessionId}`} 
                  alt="Invite QR Code" 
                  style={{ width: '156px', height: '156px' }}
                />
              </div>

              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '4px' }}>
                MANUAL CODE ENTRY
              </span>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                letterSpacing: '4px', 
                color: 'var(--primary)',
                background: 'rgba(255,255,255,0.03)',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid var(--glass-border)',
                marginBottom: '24px',
                display: 'inline-block'
              }}>
                {sharedSessionId}
              </div>

              <button 
                onClick={() => setShowShareModal(false)} 
                className="btn-primary" 
                style={{ width: '100%', cursor: 'pointer' }}
              >
                Close Invitation
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Description Drawer */}
      <AnimatePresence>
        {selectedProductDetail && (
          <>
            {/* Backdrop blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setSelectedProductDetail(null)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 3500,
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)'
              }}
            />
            {/* Slide-up Bottom Drawer */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'tween', duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="glass"
              style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                maxHeight: '85vh',
                borderTopLeftRadius: '24px',
                borderTopRightRadius: '24px',
                border: '1px solid var(--glass-border)',
                borderBottom: 'none',
                zIndex: 3600,
                padding: '20px',
                paddingTop: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                overflowY: 'auto',
                boxShadow: '0 -10px 40px rgba(0,0,0,0.4)',
                background: appSettings.theme === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(20, 20, 20, 0.95)'
              }}
            >
              {/* Drag Handle Indicator */}
              <div 
                style={{
                  width: '40px',
                  height: '4px',
                  borderRadius: '2px',
                  background: appSettings.theme === 'light' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)',
                  margin: '0 auto 8px',
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedProductDetail(null)}
              />

              {/* Header: Title and Close button */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <span style={{
                    display: 'inline-block',
                    background: 'var(--primary)',
                    color: 'white',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    padding: '3px 8px',
                    borderRadius: '12px',
                    textTransform: 'uppercase',
                    marginBottom: '8px'
                  }}>
                    {selectedProductDetail.category}
                  </span>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', lineHeight: '1.3' }}>
                    {selectedProductDetail.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedProductDetail(null)}
                  style={{
                    background: appSettings.theme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-main)',
                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Product Visual Container */}
              <div style={{
                width: '100%',
                height: '200px',
                background: 'white',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                border: '1px solid var(--glass-border)',
                padding: '16px'
              }}>
                <img
                  src={selectedProductDetail.image}
                  alt={selectedProductDetail.name}
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80';
                  }}
                />
              </div>

              {/* Pricing, Barcode and Stock Section */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--glass)', padding: '14px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>SPECIAL PRICE</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-main)' }}>₹{selectedProductDetail.price}</span>
                    <span style={{ fontSize: '14px', textDecoration: 'line-through', color: 'var(--text-muted)' }}>₹{selectedProductDetail.mrp || selectedProductDetail.price}</span>
                  </div>
                  {selectedProductDetail.mrp > selectedProductDetail.price && (
                    <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: '800' }}>
                      YOU SAVE ₹{selectedProductDetail.mrp - selectedProductDetail.price} ({Math.round(((selectedProductDetail.mrp - selectedProductDetail.price) / selectedProductDetail.mrp) * 100)}% OFF)
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-muted)' }}>
                    <Barcode size={14} color="var(--primary)" />
                    <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{selectedProductDetail.barcode}</span>
                  </div>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 'bold',
                    padding: '2px 6px',
                    borderRadius: '6px',
                    background: selectedProductDetail.stock > 10 ? 'rgba(0, 200, 83, 0.1)' : 'rgba(255, 75, 43, 0.1)',
                    color: selectedProductDetail.stock > 10 ? 'var(--primary)' : '#ff4b2b'
                  }}>
                    {selectedProductDetail.stock > 10 ? `${selectedProductDetail.stock} In Stock` : `Only ${selectedProductDetail.stock} left!`}
                  </span>
                </div>
              </div>

              {/* Description Section */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-main)', letterSpacing: '0.5px' }}>PRODUCT DETAILS</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  {getProductDescription(selectedProductDetail)}
                </p>
              </div>

              {/* Quality & Return Assurances */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                  <ShieldCheck size={18} color="var(--primary)" />
                  <span style={{ fontSize: '10px', color: 'var(--text-main)', fontWeight: '600' }}>100% Original Brands</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                  <Zap size={18} color="var(--primary)" />
                  <span style={{ fontSize: '10px', color: 'var(--text-main)', fontWeight: '600' }}>Instant Store Scan Checkout</span>
                </div>
              </div>

              {/* Sticky bottom CTA - Opens Barcode Scanner */}
              <button
                onClick={() => {
                  setSelectedProductDetail(null); // Close sheet
                  setTimeout(() => {
                    setView('scan'); // Open scanner
                  }, 250); // Small delay to wait for sheet to finish sliding down
                }}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: '14px',
                  fontWeight: 'bold',
                  fontSize: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 4px 15px rgba(0, 200, 83, 0.3)',
                  cursor: 'pointer',
                  marginTop: 'auto'
                }}
              >
                <Scan size={20} /> Scan Barcode to Add (₹{selectedProductDetail.price})
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Overlay Scanner for Store check-in */}
      <AnimatePresence>
        {showStoreScanner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              width: '100vw', 
              height: '100vh', 
              zIndex: 3000, 
              background: 'black' 
            }}
          >
            <Scanner 
              onClose={() => setShowStoreScanner(false)}
              onResult={handleStoreScanResult}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AuthScreen = ({ onLoginSuccess, appSettings }) => {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const triggerSound = (type = 'click') => {
    if (appSettings.sound) {
      const url = type === 'success' 
        ? "https://assets.mixkit.co/active_storage/sfx/2019/2019-84.wav" 
        : "https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav";
      const audio = new Audio(url);
      audio.play().catch(() => {});
    }
  };

  const handleEmailAuth = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    
    if (activeTab === 'signup') {
      if (!fullName) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }
    }
    
    setIsSubmitting(true);
    triggerSound('click');
    
    setTimeout(() => {
      setIsSubmitting(false);
      triggerSound('success');
      setSuccessMsg(activeTab === 'signup' ? 'Account created successfully!' : 'Login successful!');
      
      setTimeout(() => {
        onLoginSuccess({
          name: activeTab === 'signup' ? fullName : (email.split('@')[0].toUpperCase()),
          email: email,
          avatar: (fullName ? fullName[0] : email[0]).toUpperCase(),
          points: 150
        });
      }, 800);
    }, 1500);
  };

  const handleGoogleAuth = () => {
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);
    triggerSound('click');
    
    setTimeout(() => {
      setIsSubmitting(false);
      triggerSound('success');
      setSuccessMsg('Google Authentication successful!');
      
      setTimeout(() => {
        onLoginSuccess({
          name: "Aman Gupta",
          email: "aman@billix.com",
          avatar: "A",
          points: 250
        });
      }, 800);
    }, 1500);
  };

  const handleAppleAuth = () => {
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);
    triggerSound('click');
    
    setTimeout(() => {
      setIsSubmitting(false);
      triggerSound('success');
      setSuccessMsg('Apple Authentication successful!');
      
      setTimeout(() => {
        onLoginSuccess({
          name: "Aman Gupta",
          email: "aman@apple.com",
          avatar: "A",
          points: 300
        });
      }, 800);
    }, 1500);
  };

  const handleGuestAccess = () => {
    triggerSound('click');
    onLoginSuccess({
      name: "Guest Shopper",
      email: "guest@billix.com",
      avatar: "G",
      points: 0
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '70px 16px 80px 16px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Blur Spheres */}
      <div style={{
        position: 'absolute',
        width: '250px',
        height: '250px',
        borderRadius: '50%',
        background: 'rgba(0, 200, 83, 0.15)',
        filter: 'blur(60px)',
        top: '10%',
        left: '-10%',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        width: '250px',
        height: '250px',
        borderRadius: '50%',
        background: 'rgba(33, 150, 243, 0.15)',
        filter: 'blur(60px)',
        bottom: '20%',
        right: '-10%',
        zIndex: 0
      }} />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          width: '100%',
          maxWidth: '420px',
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '32px 24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
          zIndex: 1,
          textAlign: 'center',
          position: 'relative'
        }}
      >
        {/* Glowing Brand Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary) 0%, #00e676 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 24px rgba(0, 200, 83, 0.4)',
            marginBottom: '16px',
            position: 'relative'
          }}>
            <ShoppingBag size={30} color="white" strokeWidth={2.5} />
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                top: '-4px', right: '-4px', bottom: '-4px', left: '-4px',
                borderRadius: '50%',
                border: '2px dashed var(--primary)',
                pointerEvents: 'none'
              }}
            />
          </div>
          
          <h2 style={{ fontSize: '28px', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '1px', marginBottom: '4px' }}>
            BILLIX
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Smart Billing System
          </p>
        </div>

        {/* Sliding Tabs */}
        <div style={{ 
          display: 'flex', 
          background: 'rgba(0, 0, 0, 0.2)', 
          borderRadius: '12px', 
          padding: '4px', 
          position: 'relative', 
          marginBottom: '24px',
          border: '1px solid var(--glass-border)'
        }}>
          <div 
            style={{
              position: 'absolute',
              top: '4px',
              bottom: '4px',
              left: activeTab === 'login' ? '4px' : '50%',
              width: 'calc(50% - 4px)',
              background: 'linear-gradient(135deg, var(--primary) 0%, #00e676 100%)',
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0, 200, 83, 0.3)',
              transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)'
            }}
          />
          <button 
            type="button"
            onClick={() => { setActiveTab('login'); triggerSound('click'); }}
            style={{ 
              flex: 1, 
              zIndex: 1, 
              border: 'none', 
              background: 'none', 
              color: activeTab === 'login' ? 'white' : 'var(--text-muted)', 
              fontWeight: '700', 
              fontSize: '14px',
              padding: '10px', 
              borderRadius: '8px', 
              cursor: 'pointer', 
              transition: 'color 0.2s' 
            }}
          >
            Login
          </button>
          <button 
            type="button"
            onClick={() => { setActiveTab('signup'); triggerSound('click'); }}
            style={{ 
              flex: 1, 
              zIndex: 1, 
              border: 'none', 
              background: 'none', 
              color: activeTab === 'signup' ? 'white' : 'var(--text-muted)', 
              fontWeight: '700', 
              fontSize: '14px',
              padding: '10px', 
              borderRadius: '8px', 
              cursor: 'pointer', 
              transition: 'color 0.2s' 
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Feedback Messages */}
        <AnimatePresence mode="wait">
          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                background: 'rgba(255, 75, 43, 0.1)',
                border: '1px solid rgba(255, 75, 43, 0.3)',
                borderRadius: '8px',
                padding: '8px 12px',
                color: '#ff4b2b',
                fontSize: '12px',
                fontWeight: '600',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                justifyContent: 'center'
              }}
            >
              <AlertTriangle size={14} />
              {errorMsg}
            </motion.div>
          )}

          {successMsg && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                background: 'rgba(0, 200, 83, 0.1)',
                border: '1px solid rgba(0, 200, 83, 0.3)',
                borderRadius: '8px',
                padding: '8px 12px',
                color: 'var(--primary)',
                fontSize: '12px',
                fontWeight: '600',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                justifyContent: 'center'
              }}
            >
              <Check size={14} />
              {successMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Auth Forms */}
        <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          {activeTab === 'signup' && (
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                <UserIcon size={18} />
              </div>
              <input 
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  background: 'rgba(0, 0, 0, 0.15)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '10px',
                  color: 'var(--text-main)',
                  fontSize: '14px',
                  fontWeight: '500',
                  outline: 'none',
                  transition: 'all 0.2s',
                  textAlign: 'left'
                }}
              />
            </div>
          )}

          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
              <Mail size={18} />
            </div>
            <input 
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 14px 12px 42px',
                background: 'rgba(0, 0, 0, 0.15)',
                border: '1px solid var(--glass-border)',
                borderRadius: '10px',
                color: 'var(--text-main)',
                fontSize: '14px',
                fontWeight: '500',
                outline: 'none',
                transition: 'all 0.2s',
                textAlign: 'left'
              }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
              <Lock size={18} />
            </div>
            <input 
              type="text"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 42px 12px 42px',
                background: 'rgba(0, 0, 0, 0.15)',
                border: '1px solid var(--glass-border)',
                borderRadius: '10px',
                color: 'var(--text-main)',
                fontSize: '14px',
                fontWeight: '500',
                outline: 'none',
                transition: 'all 0.2s',
                textAlign: 'left',
                WebkitTextSecurity: showPassword ? 'none' : 'disc',
                textSecurity: showPassword ? 'none' : 'disc'
              }}
            />
            <button 
              type="button"
              onClick={() => { setShowPassword(!showPassword); triggerSound('click'); }}
              style={{
                position: 'absolute',
                right: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {activeTab === 'signup' && (
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                <Lock size={18} />
              </div>
              <input 
                type="text"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  background: 'rgba(0, 0, 0, 0.15)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '10px',
                  color: 'var(--text-main)',
                  fontSize: '14px',
                  fontWeight: '500',
                  outline: 'none',
                  transition: 'all 0.2s',
                  textAlign: 'left',
                  WebkitTextSecurity: showPassword ? 'none' : 'disc',
                  textSecurity: showPassword ? 'none' : 'disc'
                }}
              />
            </div>
          )}

          {activeTab === 'login' && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <input 
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => { setRememberMe(!rememberMe); triggerSound('click'); }}
                  style={{
                    accentColor: 'var(--primary)',
                    width: '14px',
                    height: '14px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                />
                Remember me
              </label>
              <span 
                onClick={() => { 
                  triggerSound('click');
                  alert("Reset password link has been simulated to your email!");
                }}
                style={{ color: 'var(--primary)', fontWeight: '600', cursor: 'pointer' }}
              >
                Forgot Password?
              </span>
            </div>
          )}

          {/* Submit Button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, var(--primary) 0%, #00e676 100%)',
              color: 'white',
              fontSize: '14px',
              fontWeight: '700',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 15px rgba(0, 200, 83, 0.3)',
              marginTop: '8px'
            }}
          >
            {isSubmitting ? (
              <div style={{
                width: '18px',
                height: '18px',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: 'white',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
              }} />
            ) : (
              activeTab === 'login' ? 'Login' : 'Create Free Account'
            )}
          </motion.button>
        </form>

        {/* Separator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }} />
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
            or continue with
          </span>
          <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }} />
        </div>

        {/* Social Authentication Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Google Auth Button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleGoogleAuth}
            disabled={isSubmitting}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              border: '1px solid var(--glass-border)',
              background: 'rgba(255, 255, 255, 0.05)',
              color: 'var(--text-main)',
              fontWeight: '700',
              fontSize: '14px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.47h4.84c-.21 1.12-.84 2.07-1.8 2.7l2.8 2.18c1.63-1.5 2.57-3.72 2.57-6.51z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.2l-2.8-2.18c-.78.52-1.78.83-2.96.83-2.28 0-4.22-1.54-4.91-3.61L1.4 13.02C2.88 15.96 5.93 18 9 18z"/>
              <path fill="#FBBC05" d="M4.09 10.84c-.17-.52-.27-1.07-.27-1.64s.1-1.12.27-1.64L1.4 5.38C.5 7.17 0 9.19 0 11.2s.5 4.03 1.4 5.82l2.69-2.18z"/>
              <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0 5.93 0 2.88 2.04 1.4 4.98l2.69 2.18C4.78 5.12 6.72 3.58 9 3.58z"/>
            </svg>
            Sign in with Google
          </motion.button>
        </div>
      </motion.div>

      {/* Embedded Spin Animation CSS */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

const StoreSelectScreen = ({ stores, onSelect, onScanClick }) => {
  const [gpsLoading, setGpsLoading] = useState(true);
  const [userCoords, setUserCoords] = useState(null);

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setTimeout(() => setGpsLoading(false), 0);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserCoords(coords);
        setGpsLoading(false);
      },
      () => {
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  useEffect(() => {
    detectLocation();
  }, [detectLocation]);

  const getDistanceStr = (store) => {
    if (!userCoords || !store.coordinates) {
      return store.distance || "1.2 km";
    }
    const dist = calculateHaversineDistance(
      userCoords.lat,
      userCoords.lng,
      store.coordinates.lat,
      store.coordinates.lng
    );
    if (dist > 100) {
      return `${dist.toFixed(1)} km`;
    }
    return `${dist.toFixed(2)} km`;
  };

  const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getNearestStoreId = () => {
    if (!userCoords) return null;
    let minDistance = Infinity;
    let nearestId = null;
    stores.forEach(s => {
      if (s.coordinates) {
        const dist = calculateHaversineDistance(
          userCoords.lat,
          userCoords.lng,
          s.coordinates.lat,
          s.coordinates.lng
        );
        if (dist < minDistance) {
          minDistance = dist;
          nearestId = s._id;
        }
      }
    });
    return nearestId;
  };

  const nearestStoreId = getNearestStoreId() || (stores.length > 0 ? stores[0]._id : null);

  return (
    <div style={{
      padding: '24px 20px 100px',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      color: 'var(--text-main)',
      maxWidth: '480px',
      margin: '0 auto'
    }}>
      <div style={{ textAlign: 'center', margin: '24px 0 28px' }}>
        <motion.div 
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ 
            width: '64px', 
            height: '64px', 
            borderRadius: '16px', 
            background: 'var(--primary)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 12px',
            boxShadow: '0 8px 24px rgba(0, 200, 83, 0.4)'
          }}
        >
          <ShoppingBag size={32} color="white" />
        </motion.div>
        <h2 style={{ fontSize: '28px', fontWeight: '900', letterSpacing: '-0.5px', color: 'var(--text-main)' }}>
          Billix
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
          Scan, Pay & Walk out in seconds. Select a store to begin.
        </p>
      </div>

      <div className="glass" style={{ 
        padding: '16px 20px', 
        borderRadius: 'var(--radius-md)', 
        border: '1px solid var(--glass-border)',
        marginBottom: '24px',
        background: 'rgba(255,255,255,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '10px', 
              height: '10px', 
              borderRadius: '50%', 
              background: gpsLoading ? '#ffaa00' : 'var(--primary)',
              boxShadow: gpsLoading ? '0 0 10px #ffaa00' : '0 0 10px var(--primary)'
            }} />
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 'bold' }}>
                {gpsLoading ? "Detecting GPS Proximity..." : (userCoords ? "Location Services Active" : "Detecting Closest Store")}
              </h4>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {gpsLoading ? "Querying coordinates..." : (userCoords ? "Nearest stores updated in real-time" : "Auto-selection falling back to database proximity")}
              </p>
            </div>
          </div>
          {!userCoords && !gpsLoading && (
            <button 
              onClick={() => {
                setGpsLoading(true);
                detectLocation();
              }}
              style={{
                background: 'rgba(0,200,83,0.1)',
                border: '1px solid var(--primary)',
                color: 'var(--primary)',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Retry GPS
            </button>
          )}
        </div>
      </div>

      <button 
        onClick={onScanClick}
        className="glass"
        style={{
          width: '100%',
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          border: '1px dashed var(--primary)',
          color: 'var(--primary)',
          fontWeight: '800',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          marginBottom: '28px',
          cursor: 'pointer',
          fontSize: '15px',
          background: 'rgba(0, 200, 83, 0.05)',
          boxShadow: '0 4px 15px rgba(0, 200, 83, 0.05)',
          transition: 'transform 0.2s ease'
        }}
      >
        <QrCode size={20} /> Scan Store QR to Check-in
      </button>

      <h3 style={{ 
        fontSize: '13px', 
        color: 'var(--primary)', 
        fontWeight: '800', 
        textTransform: 'uppercase', 
        letterSpacing: '1.5px', 
        marginBottom: '16px'
      }}>
        Available Stores ({stores.length})
      </h3>

      <div style={{ display: 'grid', gap: '16px' }}>
        {stores.map(store => {
          const isNearest = store._id === nearestStoreId;
          return (
            <motion.div
              key={store._id}
              onClick={() => onSelect(store._id)}
              whileTap={{ scale: 0.98 }}
              className="glass"
              style={{
                position: 'relative',
                padding: '16px',
                borderRadius: 'var(--radius-lg)',
                border: isNearest ? '2px solid var(--primary)' : '1px solid var(--glass-border)',
                display: 'flex',
                gap: '16px',
                cursor: 'pointer',
                background: isNearest ? 'linear-gradient(135deg, rgba(0,200,83,0.06) 0%, rgba(30,30,30,0.85) 100%)' : 'var(--glass)',
                boxShadow: isNearest ? '0 8px 24px rgba(0, 200, 83, 0.15)' : 'none',
                overflow: 'hidden'
              }}
            >
              {isNearest && (
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'var(--primary)',
                  color: 'white',
                  fontSize: '9px',
                  fontWeight: '800',
                  padding: '3px 8px',
                  borderRadius: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: '0 0 10px var(--primary)',
                  zIndex: 2
                }}>
                  <motion.div 
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'white' }}
                  />
                  Nearest
                </div>
              )}

              <div style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0 }}>
                <img 
                  src={store.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200'} 
                  alt={store.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: isNearest ? 'white' : 'var(--text-main)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {store.name}
                  <span style={{ 
                    width: '6px', 
                    height: '6px', 
                    borderRadius: '50%', 
                    background: store.status === 'Open' ? 'var(--primary)' : '#ff4b2b',
                    display: 'inline-block'
                  }} />
                </h4>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                  <MapPin size={12} color="var(--primary)" /> {store.address || "Sitapura Industrial Area, Jaipur"}
                </p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '10px', background: isNearest ? 'rgba(255,255,255,0.08)' : 'var(--glass-border)', color: 'var(--text-muted)', padding: '2px 8px', borderRadius: '4px' }}>
                    {getDistanceStr(store)} away
                  </span>
                  <span style={{ fontSize: '10px', background: 'rgba(0, 200, 83, 0.08)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>
                    {store.rewards || "Cashback Deals"}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

const Scanner = ({ onResult, onClose, lastScanned = null }) => {
  const html5QrCodeRef = useRef(null);
  const alignTimeoutRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  const isMounted = useRef(true);
  const [torchOn, setTorchOn] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const showManualRef = useRef(showManual);
  useEffect(() => {
    showManualRef.current = showManual;
  }, [showManual]);

  const onResultRef = useRef(onResult);
  const onCloseRef = useRef(onClose);
  
  useEffect(() => {
    onResultRef.current = onResult;
    onCloseRef.current = onClose;
  }, [onResult, onClose]);

  const [manualCode, setManualCode] = useState("");
  const [hintText, setHintText] = useState("Align the barcode within the frame");

  const displayHintText = showManual ? "Enter the barcode manually below" : hintText;

  const resetTimeouts = useCallback(() => {
    if (alignTimeoutRef.current) clearTimeout(alignTimeoutRef.current);
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);

    setHintText("Align the barcode within the frame");

    alignTimeoutRef.current = setTimeout(() => {
      if (navigator.vibrate) navigator.vibrate(50); // Subtle haptic pulse
      setHintText("Align the QR properly with the scanner");
    }, 8000); // 8 seconds of inactivity

    closeTimeoutRef.current = setTimeout(() => {
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]); // Noticeable closing haptic
      onCloseRef.current(); // Automatically close the scanner
    }, 20000); // 20 seconds total
  }, []);

  const resetTimeoutsRef = useRef(resetTimeouts);
  useEffect(() => {
    resetTimeoutsRef.current = resetTimeouts;
  }, [resetTimeouts]);

  useEffect(() => {
    isMounted.current = true;

    // Clear any existing timeouts when setting up
    if (alignTimeoutRef.current) clearTimeout(alignTimeoutRef.current);
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);

    // Always create a fresh instance bound to the current DOM
    let html5QrCode;
    try {
      html5QrCode = new Html5Qrcode("reader");
      html5QrCodeRef.current = html5QrCode;
    } catch (e) {
      console.error("Reader DOM not ready", e);
      return;
    }

    html5QrCode.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      (decodedText) => {
        if (showManualRef.current) return; // Ignore auto-scans when manual entry mode is active!
        if (navigator.vibrate) navigator.vibrate(30); // Success haptic tick
        resetTimeouts();
        onResult(decodedText);
      },
      () => { }
    ).then(() => {
      if (!isMounted.current) {
        // Component unmounted while warming up
        html5QrCode.stop().then(() => {
          html5QrCode.clear();
          forceKillHardwareCamera(); // Hardware level kill
        }).catch(() => { forceKillHardwareCamera(); });
      } else {
        resetTimeouts();
      }
    }).catch((error) => {
      console.error(error);
      forceKillHardwareCamera();
    });

    return () => {
      isMounted.current = false;
      if (alignTimeoutRef.current) clearTimeout(alignTimeoutRef.current);
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);

      try {
        if (html5QrCode && html5QrCode.isScanning) {
          html5QrCode.stop().then(() => {
            html5QrCode.clear();
            forceKillHardwareCamera(); // Hardware level kill
          }).catch(() => { forceKillHardwareCamera(); });
        } else {
          forceKillHardwareCamera(); // Hardware level kill just in case
        }
      } catch {
        forceKillHardwareCamera();
      }
    };
  }, [onResult, resetTimeouts]);

  const toggleTorch = async () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      try {
        await html5QrCodeRef.current.applyVideoConstraints({
          advanced: [{ torch: !torchOn }]
        });
        setTorchOn(!torchOn);
      } catch {
        alert("Flashlight not supported or permission denied on this device.");
      }
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 2000,
      background: '#0a0a0a', // Forced dark for scanner contrast
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <button
        onClick={onClose}
        style={{ position: 'absolute', top: '24px', right: '24px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '44px', height: '44px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}
      >
        <X size={24} />
      </button>

      <h2 style={{ color: 'white', marginBottom: '8px', fontSize: '24px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        <Barcode size={28} color="var(--primary)" /> Scan Barcode
      </h2>
      <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '32px', transition: 'color 0.3s' }}>{displayHintText}</p>

      <div className="scanner-overlay" style={{ margin: '0 auto', position: 'relative' }}>
        {!showManual && <div className="scanner-laser"></div>}
        <div className="scanner-corners"></div>
        <div className="scanner-corners-bottom"></div>
        <div id="reader" style={{ width: '100%', height: '100%', borderRadius: 'var(--radius-lg)' }}></div>

        {/* High-performance GPU dim overlay */}
        <AnimatePresence>
          {showManual && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(10, 10, 10, 0.75)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                zIndex: 5,
                borderRadius: 'var(--radius-lg)',
                pointerEvents: 'none'
              }}
            />
          )}
        </AnimatePresence>
      </div>

      <div style={{ display: 'flex', gap: '24px', marginTop: '32px' }}>
        <button
          className="glass"
          onClick={toggleTorch}
          style={{ width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', color: torchOn ? 'var(--bg-dark)' : 'white', background: torchOn ? 'white' : 'rgba(255,255,255,0.1)', transition: 'all 0.2s' }}
        >
          {torchOn ? <FlashlightOff size={24} /> : <Flashlight size={24} />}
        </button>
        <button
          className="glass"
          onClick={() => setShowManual(!showManual)}
          style={{ width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', color: showManual ? 'var(--primary)' : 'white', background: 'rgba(255,255,255,0.1)', transition: 'all 0.2s' }}
        >
          <Keyboard size={24} />
        </button>
      </div>

      <AnimatePresence>
        {showManual && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            style={{ marginTop: '24px', width: '100%', maxWidth: '280px' }}
          >
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={manualCode}
                onChange={e => setManualCode(e.target.value)}
                placeholder="E.g., 8901000000014"
                style={{ flex: 1, padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none' }}
              />
              <button
                className="btn-primary"
                onClick={() => { if (manualCode) { onResult(manualCode); setManualCode(""); } }}
                style={{ padding: '0 20px', borderRadius: 'var(--radius-md)' }}
              >
                Add
              </button>
            </div>

            {/* Success Feedback banner inside manual entry card */}
            {lastScanned && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                style={{
                  marginTop: '12px',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  background: 'rgba(0, 200, 83, 0.15)',
                  border: '1px solid #00c853',
                  color: '#00e676',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  justifyContent: 'center'
                }}
              >
                <Check size={14} /> Added: {lastScanned.name.split(' - ')[0]}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
