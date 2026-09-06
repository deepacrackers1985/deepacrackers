import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Phone, Search, ArrowRight, ShieldCheck, FileText, LayoutGrid, List as ListIcon, X, Plus, Minus, ChevronLeft, ChevronRight, Bot, CheckCircle, MapPin, Tag, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Navbar from '../Component/Navbar';
import Launch from '../Component/Launch';
import BackgroundFireworks from '../Component/BackgroundFireworks';
import PromoBurst from '../Component/PromoBurst';
import Card3D from '../Component/Card3D';
import WhyDeepaCrackersModal from '../Component/WhyDeepaCrackersModal';
import SkyShotBookingSuccessModal from '../Component/SkyShotBookingSuccessModal';
import WhatsAppButton from '../Component/WhatsAppButton';
import { API_BASE_URL } from '../../Config';
import { translateProduct } from '../utils/tamilTranslation';
import defaultImage from '../default.jpeg';

// Media Item Parser Helper
const parseMediaItems = (media) => {
  if (!media) return [];
  if (Array.isArray(media)) return media.filter(Boolean);
  if (typeof media === 'string') {
    try {
      const parsed = JSON.parse(media);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
      return [media.trim()];
    } catch {
      return [media.trim()];
    }
  }
  return [];
};

// Base64 Image Preloader for PDF Generation
const loadBase64Image = (url) => {
  return new Promise((resolve) => {
    const mediaList = parseMediaItems(url);
    const firstUrl = mediaList[0] || defaultImage;
    if (!firstUrl || typeof firstUrl !== 'string') return resolve(null);
    if (firstUrl.includes('/video/') || firstUrl.endsWith('.mp4') || firstUrl.endsWith('.webm')) return resolve(null);

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width || 80;
        canvas.height = img.naturalHeight || img.height || 80;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/jpeg', 0.7);
        resolve(dataURL);
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => {
      if (firstUrl !== defaultImage) {
        const fallbackImg = new Image();
        fallbackImg.crossOrigin = 'Anonymous';
        fallbackImg.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = fallbackImg.naturalWidth || fallbackImg.width || 80;
            canvas.height = fallbackImg.naturalHeight || fallbackImg.height || 80;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(fallbackImg, 0, 0);
            resolve(canvas.toDataURL('image/jpeg', 0.7));
          } catch {
            resolve(null);
          }
        };
        fallbackImg.onerror = () => resolve(null);
        fallbackImg.src = defaultImage;
      } else {
        resolve(null);
      }
    };
    img.src = firstUrl;
  });
};

// Unique Product Key Generator to prevent cross-category ID collisions
const getProductUniqueKey = (p) => {
  if (!p) return "";
  return p.serial_number || `${p.product_type || 'gen'}_${p.id}_${p.productname || ''}`;
};

// Helper to check if product is active ('on')
const isProductOn = (p) => {
  if (!p) return false;
  const s = String(p.status ?? '').trim().toLowerCase();
  return s === 'on' || s === 'true' || p.status === true || p.status === 1 || s === '1';
};

// Small Thumbnail Renderer for Checkout Item Review
const renderProductThumbnail = (media) => {
  const items = parseMediaItems(media);
  if (items.length === 0) {
    return (
      <img
        src={defaultImage}
        alt="Crackers"
        className="w-12 h-12 rounded-xl border border-slate-900 object-contain bg-white p-0.5 shrink-0"
      />
    );
  }
  const first = items[0];
  const isVid = typeof first === 'string' && (first.includes('/video/') || first.endsWith('.mp4') || first.endsWith('.webm'));
  if (isVid) {
    return <video src={first} className="w-12 h-12 rounded-xl border border-slate-900 object-contain bg-white p-0.5 shrink-0" muted />;
  }
  return (
    <img
      src={first}
      alt=""
      className="w-12 h-12 rounded-xl border border-slate-900 object-contain bg-white p-0.5 shrink-0"
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = defaultImage;
      }}
    />
  );
};

// Pencil Sketch Product Image Carousel Component
// Unified Red / Black / White Theme for all product cards
const CARD_THEME = {
  name: "red",
  glow: "#dc2626",
  accent: "#ef4444",
  border: "rgba(255, 255, 255, 0.15)",
  borderHover: "rgba(255, 255, 255, 0.5)",
  bgGradient: "linear-gradient(135deg, #0a0a0a 0%, #111111 50%, #0a0a0a 100%)",
  btnGrad: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
  btnText: "#ffffff",
  badgeBg: "rgba(220, 38, 38, 0.15)",
  badgeBorder: "rgba(220, 38, 38, 0.4)",
  tag: "#f87171",
  shadow: "rgba(220, 38, 38, 0.2)",
};

// Returns the single unified theme
const getProductTheme = () => CARD_THEME;

// Helper to format category names cleanly (e.g., 'one_sound_crackers' -> 'One Sound Crackers')
const formatCategoryName = (name) => {
  if (!name) return "";
  if (name.toLowerCase() === "all") return "All Categories";
  return name
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

// Illuminated Product Image Carousel with Ambient Spotlight
const ProductCarousel = ({ media, onImageClick, theme }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const mediaItems = useMemo(() => parseMediaItems(media), [media]);

  if (mediaItems.length === 0) {
    return (
      <div
        className="relative w-full h-36 sm:h-48 rounded-2xl overflow-hidden select-none flex items-center justify-center p-3 shadow-inner"
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          boxShadow: "inset 0 0 15px rgba(0,0,0,0.06)",
        }}
      >
        <img
          src={defaultImage}
          alt="Default Crackers"
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  const currentItem = mediaItems[currentIndex];
  const isVideo = typeof currentItem === 'string' && (currentItem.includes('/video/') || currentItem.endsWith('.mp4') || currentItem.endsWith('.webm'));

  return (
    <div
      className="relative w-full h-36 sm:h-48 rounded-2xl overflow-hidden group select-none flex items-center justify-center p-3 shadow-inner"
      style={{
        background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        boxShadow: "inset 0 0 15px rgba(0,0,0,0.06)",
      }}
    >
      {isVideo ? (
        <video
          src={currentItem}
          controls
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-contain"
        />
      ) : (
        <img
          src={currentItem}
          alt="Product media"
          onClick={() => onImageClick && onImageClick(mediaItems)}
          className="w-full h-full object-contain cursor-pointer hover:scale-108 transition-transform duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultImage;
          }}
        />
      )}

      {mediaItems.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1));
            }}
            className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-xl bg-black/80 border border-white/20 text-white flex items-center justify-center font-bold text-xs shadow-md hover:scale-110 transition-all z-10 cursor-pointer"
          >
            ‹
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
            }}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-xl bg-black/80 border border-white/20 text-white flex items-center justify-center font-bold text-xs shadow-md hover:scale-110 transition-all z-10 cursor-pointer"
          >
            ›
          </button>
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1 z-10 bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-sm">
            {mediaItems.map((_, idx) => (
              <span
                key={idx}
                className="w-1.5 h-1.5 rounded-full transition-all"
                style={{
                  background: idx === currentIndex ? (theme?.accent || "#dc2626") : "rgba(255,255,255,0.4)",
                  transform: idx === currentIndex ? "scale(1.2)" : "scale(1)",
                  boxShadow: idx === currentIndex ? `0 0 6px ${theme?.glow || "#dc2626"}` : "none",
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categoryOrder, setCategoryOrder] = useState([]);
  const [banners, setBanners] = useState([]);
  const [currentBannerIdx, setCurrentBannerIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "table"
  const [cart, setCart] = useState({});
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [lastCompletedOrderId, setLastCompletedOrderId] = useState("");
  const [previewMedia, setPreviewMedia] = useState(null);
  const [downloadingPDF, setDownloadingPDF] = useState(false);

  // Locations & Promocodes state
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [promoCodes, setPromoCodes] = useState([]);
  const [selectedPromoCode, setSelectedPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);

  // AI assistant state
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiStep, setAiStep] = useState(0);
  const [aiBudget, setAiBudget] = useState("");
  const [aiPreferences, setAiPreferences] = useState({ kids: false, sound: false, night: false, kidsnight: false });
  const [suggestedCart, setSuggestedCart] = useState({});

  // Launcher: shown only once per session (first visit)
  const [showLauncher, setShowLauncher] = useState(() => {
    return !sessionStorage.getItem("deepa_crackers_launched");
  });
  // Why modal: shown only when user clicks the "?" button
  const [showWhyModal, setShowWhyModal] = useState(false);


  const [customer, setCustomer] = useState({
    name: "",
    mobile: "",
    address: "",
    district: "Thiruthuraipoondi",
    state: "Tamil Nadu",
    email: "",
  });

  // Fetch Banners
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/banners`);
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data.filter((b) => b.is_active !== false) : [];
          setBanners(list);
        }
      } catch (err) {
        console.error("Failed to fetch banners:", err);
      }
    };
    fetchBanners();
  }, []);

  // Fetch States & Promocodes
  useEffect(() => {
    const fetchStatesAndPromos = async () => {
      try {
        const [sRes, pRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/locations/states`).catch(() => null),
          fetch(`${API_BASE_URL}/api/promocodes`).catch(() => null),
        ]);
        if (sRes && sRes.ok) {
          const sData = await sRes.json();
          setStates(Array.isArray(sData) ? sData : []);
        }
        if (pRes && pRes.ok) {
          const pData = await pRes.json();
          setPromoCodes(Array.isArray(pData) ? pData : []);
        }
      } catch (err) {
        console.error("Error fetching location & promo data:", err);
      }
    };
    fetchStatesAndPromos();
  }, []);

  // Fetch Districts when State changes
  useEffect(() => {
    if (customer.state) {
      fetch(`${API_BASE_URL}/api/locations/states/${customer.state}/districts`)
        .then((res) => res.json())
        .then((data) => setDistricts(Array.isArray(data) ? data : []))
        .catch((err) => console.error("Error fetching districts:", err));
    }
  }, [customer.state]);

  // Unified Banners with Default Combo Box Banner
  const allBanners = useMemo(() => {
    const defaultCombo = {
      id: "default-combo-box-banner",
      isDefaultCombo: true,
      title: "EXCLUSIVE FESTIVE COMBO BOX",
      subtitle: "Complete Family Celebration Assortment • Up to 80% Direct Factory Savings",
      tag: "BEST VALUE • SAVE UP TO 80%",
      description: "Handcrafted mega packages containing Flower Pots, Sparklers, Chakkars, Sound Bombs & Repeating Sky Shots at direct wholesale prices.",
      cta: "Shop Combo Box Now",
      targetCategory: "Combo Box",
    };

    if (!banners || banners.length === 0) {
      return [defaultCombo];
    }

    const hasCombo = banners.some(
      (b) =>
        b.title?.toLowerCase().includes("combo") ||
        b.target_category?.toLowerCase().includes("combo")
    );

    if (hasCombo) {
      return banners;
    }

    // Always include the default combo box banner first so users can select it
    return [defaultCombo, ...banners];
  }, [banners]);

  // Auto-rotate banners
  useEffect(() => {
    if (allBanners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBannerIdx((prev) => (prev + 1) % allBanners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [allBanners]);

  // Fetch Inventory and Category Order Sequence from Admin Backend
  const fetchData = async () => {
    setLoading(true);
    try {
      let prodRes = await fetch(`${API_BASE_URL}/api/products`).catch(() => null);
      if (!prodRes || !prodRes.ok) prodRes = await fetch(`${API_BASE_URL}/api/inventory/products`).catch(() => null);
      if (!prodRes || !prodRes.ok) prodRes = await fetch(`http://localhost:5000/api/products`).catch(() => null);

      let catRes = await fetch(`${API_BASE_URL}/api/category-order`).catch(() => null);
      if (!catRes || !catRes.ok) catRes = await fetch(`${API_BASE_URL}/api/product-types`).catch(() => null);
      if (!catRes || !catRes.ok) catRes = await fetch(`${API_BASE_URL}/api/inventory/category-order`).catch(() => null);
      if (!catRes || !catRes.ok) catRes = await fetch(`http://localhost:5000/api/category-order`).catch(() => null);
      if (!catRes || !catRes.ok) catRes = await fetch(`http://localhost:5000/api/product-types`).catch(() => null);

      const prodData = prodRes && prodRes.ok ? await prodRes.json() : [];
      const catData = catRes && catRes.ok ? await catRes.json() : [];

      let rawList = [];
      if (prodData && prodData.data) {
        rawList = prodData.data;
      } else if (Array.isArray(prodData)) {
        rawList = prodData;
      }
      setProducts(rawList.filter(isProductOn));

      if (Array.isArray(catData) && catData.length > 0) {
        setCategoryOrder(catData.map((c) => (typeof c === "string" ? c : c.product_type)));
      }
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Compute Available Categories Sorted by Admin Drag & Drop Sequence, with Combo Box ensured
  const categories = useMemo(() => {
    const availableTypes = Array.from(new Set(products.filter(isProductOn).map((p) => p.product_type))).filter(Boolean);
    const hasCombo = availableTypes.some((t) => t.toLowerCase().includes("combo"));
    const typesWithCombo = hasCombo ? availableTypes : ["Combo Box", ...availableTypes];

    const sorted = [...typesWithCombo].sort((a, b) => {
      if (a === "Combo Box" && !hasCombo) return -1;
      if (b === "Combo Box" && !hasCombo) return 1;
      const idxA = categoryOrder.indexOf(a);
      const idxB = categoryOrder.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });
    return ["All", ...sorted];
  }, [products, categoryOrder]);

  // Category Selection from Banner click with Smooth Scroll to Catalog
  const handleSelectComboBoxBanner = (targetCat = "Combo Box") => {
    const comboCat = categories.find(
      (c) =>
        c.toLowerCase() === targetCat.toLowerCase() ||
        c.toLowerCase().includes("combo") ||
        c.toLowerCase().includes("gift box") ||
        c.toLowerCase().includes("gift")
    );

    if (comboCat) {
      setSelectedCategory(comboCat);
      setSearchTerm("");
    } else {
      setSelectedCategory("Combo Box");
      setSearchTerm("");
    }

    setTimeout(() => {
      const el = document.getElementById("product-catalog-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 60);
  };

  // Micro Popper Sparkle Effect on Plus Button (Ultra-Bright & Radiant)
  const [popperSparks, setPopperSparks] = useState([]);

  const triggerPopperSparkle = (e) => {
    if (!e) return;
    const rect = e.currentTarget?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : e.clientX || window.innerWidth / 2;
    const y = rect ? rect.top + rect.height / 2 : e.clientY || window.innerHeight / 2;
    const id = Date.now() + Math.random();

    // 22 Radiant Red and White sparkler particles
    const particleColors = ['#dc2626', '#ffffff', '#ef4444', '#ffffff', '#b91c1c', '#ffffff', '#f87171'];
    const particles = Array.from({ length: 22 }).map((_, i) => {
      const angle = (i * (360 / 22) + Math.random() * 15) * (Math.PI / 180);
      const velocity = 35 + Math.random() * 55;
      const color = particleColors[i % particleColors.length];
      return {
        id: `${id}-${i}`,
        dx: Math.cos(angle) * velocity,
        dy: Math.sin(angle) * velocity,
        color,
        size: i % 3 === 0 ? (6 + Math.random() * 4) : (4 + Math.random() * 3), // Varied prominent sizes (4px - 10px)
        isStar: i % 2 === 0,
      };
    });

    setPopperSparks((prev) => [...prev, { id, x, y, particles }]);
    setTimeout(() => {
      setPopperSparks((prev) => prev.filter((p) => p.id !== id));
    }, 850);
  };

  // Cart operations using Unique Key with Sparkle on Plus
  const updateQuantity = (productOrKey, delta, e = null) => {
    if (delta > 0 && e) {
      triggerPopperSparkle(e);
    }
    const key = typeof productOrKey === 'object' ? getProductUniqueKey(productOrKey) : String(productOrKey);
    setCart((prev) => {
      const current = prev[key] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      }
      return { ...prev, [key]: next };
    });
  };

  const cartItems = useMemo(() => {
    return Object.entries(cart)
      .map(([key, qty]) => {
        const product = products.find((p) => getProductUniqueKey(p) === key || p.serial_number === key || String(p.id) === String(key));
        if (!product) return null;
        const price = parseFloat(product?.price || 0);
        const discount = parseFloat(product?.discount || 0);
        const netPrice = discount > 0 ? Math.round(price * (1 - discount / 100)) : price;
        return {
          ...product,
          uniqueKey: key,
          qty,
          netPrice,
          subtotal: netPrice * qty,
        };
      })
      .filter((item) => item && item.productname);
  }, [cart, products]);

  const totalAmount = useMemo(() => cartItems.reduce((sum, item) => sum + item.subtotal, 0), [cartItems]);

  const promoDiscountAmount = useMemo(() => {
    if (!appliedPromo) return 0;
    const rate = parseFloat(appliedPromo.discount || 0);
    return Math.round((totalAmount * rate) / 100);
  }, [appliedPromo, totalAmount]);

  const finalCheckoutTotal = useMemo(() => {
    return Math.max(0, totalAmount - promoDiscountAmount);
  }, [totalAmount, promoDiscountAmount]);

  const handleApplyPromoCode = (code) => {
    setSelectedPromoCode(code);
    if (!code) {
      setAppliedPromo(null);
      return;
    }
    const found = promoCodes.find((p) => p.code.toLowerCase() === code.toLowerCase());
    if (found) {
      if (found.min_amount && totalAmount < found.min_amount) {
        alert(`Minimum order amount for code ${found.code} is ₹${found.min_amount}. Your current total is ₹${totalAmount}.`);
        setAppliedPromo(null);
        setSelectedPromoCode("");
        return;
      }
      setAppliedPromo(found);
    } else {
      alert("Invalid promocode.");
      setAppliedPromo(null);
    }
  };

  // Group Products by Admin Category Sequence
  const groupedProducts = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    let list = products.filter(isProductOn);

    if (selectedCategory !== "All") {
      if (selectedCategory.toLowerCase().includes("combo")) {
        list = list.filter(
          (p) =>
            (p.product_type && p.product_type.toLowerCase().includes("combo")) ||
            (p.productname && p.productname.toLowerCase().includes("combo"))
        );
      } else {
        list = list.filter((p) => p.product_type === selectedCategory);
      }
    }

    if (term) {
      list = list.filter(
        (p) =>
          p.productname?.toLowerCase().includes(term) ||
          p.serial_number?.toLowerCase().includes(term) ||
          translateProduct(p.productname)?.toLowerCase().includes(term)
      );
    }

    const map = {};
    list.forEach((p) => {
      let cat = p.product_type || "General Crackers";
      if (
        selectedCategory.toLowerCase().includes("combo") &&
        (!p.product_type || !p.product_type.toLowerCase().includes("combo"))
      ) {
        cat = selectedCategory;
      }
      if (!map[cat]) map[cat] = [];
      map[cat].push(p);
    });

    const sortedKeys = Object.keys(map).sort((a, b) => {
      const idxA = categoryOrder.indexOf(a);
      const idxB = categoryOrder.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });

    return sortedKeys.map((cat) => ({
      category: cat,
      items: map[cat],
    }));
  }, [products, selectedCategory, searchTerm, categoryOrder]);

  // Dynamic PDF Pricelist Generator matching Admin Category Sequence with Product Images
  const downloadPDFPricelist = async () => {
    setDownloadingPDF(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const activeProducts = products.filter(isProductOn);

      // Pre-load base64 images for active products with unique product key mapping
      const imagePromises = activeProducts.map(async (p) => {
        const key = getProductUniqueKey(p);
        const base64 = await loadBase64Image(p.image || p.images);
        return { key, base64 };
      });
      const loadedImages = await Promise.all(imagePromises);
      const imageMap = {};
      loadedImages.forEach((item) => {
        if (item.base64) imageMap[item.key] = item.base64;
      });

      doc.setFillColor(250, 246, 238);
      doc.rect(0, 0, pageWidth, 40, 'F');
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(30, 41, 59);
      doc.text("DEEPA CRACKERS", pageWidth / 2, 16, { align: "center" });

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139);
      doc.text("RS Road, Thiruthuraipoondi, Tamil Nadu", pageWidth / 2, 24, { align: "center" });
      doc.text("Contact: 8072 897 834 | deepatraders1985@gmail.com", pageWidth / 2, 31, { align: "center" });
      doc.text(`Official Festive Retail Pricelist — ${new Date().getFullYear()}`, pageWidth / 2, 38, { align: "center" });

      let startY = 45;
      let totalItemsCount = 0;
      const activeTypes = categories.filter((c) => c !== "All");

      activeTypes.forEach((type) => {
        const typeItems = activeProducts.filter((p) => p.product_type === type);
        if (typeItems.length === 0) return;

        const tableData = typeItems.map((p) => {
          totalItemsCount++;
          const key = getProductUniqueKey(p);
          const price = parseFloat(p.price || 0);
          const discount = parseFloat(p.discount || 0);
          const netPrice = discount > 0 ? Math.round(price * (1 - discount / 100)) : price;
          return [
            p.serial_number || String(totalItemsCount),
            { content: "", imgBase64: imageMap[key] },
            p.productname || "",
            `Rs.${price.toFixed(2)}`,
            discount > 0 ? `${discount}%` : "-",
            `Rs.${netPrice.toFixed(2)}`,
            p.per || "pkt",
          ];
        });

        autoTable(doc, {
          startY: startY,
          head: [
            [{ content: type.toUpperCase(), colSpan: 7, styles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: "bold" } }],
            ["Code", "Image", "Product Name", "MRP", "Discount", "Net Price", "Per"]
          ],
          body: tableData,
          theme: "grid",
          headStyles: { fillColor: [245, 235, 217], textColor: [30, 41, 59], fontStyle: "bold" },
          styles: { fontSize: 8, cellPadding: 2, minCellHeight: 12 },
          columnStyles: {
            0: { cellWidth: 15 },
            1: { cellWidth: 14 },
            2: { cellWidth: 65 },
          },
          didDrawCell: (data) => {
            if (data.section === 'body' && data.column.index === 1 && data.cell.raw && data.cell.raw.imgBase64) {
              try {
                doc.addImage(data.cell.raw.imgBase64, 'JPEG', data.cell.x + 2, data.cell.y + 1, 10, 10);
              } catch (e) {
                console.error("PDF img draw error:", e);
              }
            }
          }
        });

        startY = doc.lastAutoTable.finalY + 6;
      });

      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text("Deepa Crackers, RS Road, Thiruthuraipoondi | 8072 897 834 | deepatraders1985@gmail.com", pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: "center" });

      doc.save(`Deepa_Crackers_Pricelist_Thiruthuraipoondi_${new Date().getFullYear()}.pdf`);
    } catch (err) {
      console.error("PDF Export Error:", err);
      alert("Error generating PDF pricelist.");
    } finally {
      setDownloadingPDF(false);
    }
  };

  // 100% Rock-Solid AI Generator Algorithm with Strict Budget Enforcement and Unique Keys
  const generateSuggestions = useCallback(() => {
    const budget = Number(aiBudget);
    if (!budget || budget <= 0) {
      alert("Please enter a valid budget amount in ₹");
      return;
    }

    const categoriesMap = {
      kids: ["new_arrivals", "fancy_pencil_varieties", "twinkling_star", "guns_and_caps", "matches"],
      sound: ["bombs", "one_sound_crackers"],
      night: ["repeating_shots", "comets_sky_shots", "new_arrivals", "rockets"],
      kidsnight: ["fountain_and_fancy_novelties", "flower_pots", "ground_chakkar", "sparklers"],
    };

    const selectedPrefs = ["night", "kids", "sound", "kidsnight"].filter((p) => aiPreferences[p]);
    const prefsToUse = selectedPrefs.length > 0 ? selectedPrefs : ["kids", "sound", "night", "kidsnight"];

    const normType = (t) => t?.toLowerCase()?.replace(/\s+/g, "_") || "";
    const getSparklerSize = (name) => {
      const m = name?.match(/(\d+)\s*cm/i);
      return m ? m[1] : null;
    };

    // Filter available products & calculate net price with UNIQUE KEYS
    const activeProducts = products
      .filter(isProductOn)
      .map((p) => {
        const price = parseFloat(p.price || 0);
        const discount = parseFloat(p.discount || 0);
        const finalPrice = discount > 0 ? Math.round(price * (1 - discount / 100)) : price;
        const key = getProductUniqueKey(p);
        return { ...p, finalPrice, normType: normType(p.product_type), uniqueKey: key };
      })
      .filter((p) => p.finalPrice > 0 && p.finalPrice <= budget);

    if (activeProducts.length === 0) {
      alert("No suitable products found under this budget.");
      return;
    }

    const tempCart = {};
    let totalSpent = 0;
    const sparklerSizeCount = {};

    // Candidate types matching selected preferences
    const allowedTypes = prefsToUse.flatMap((pref) => categoriesMap[pref] || []);

    let candidates = activeProducts
      .filter((p) => allowedTypes.length === 0 || allowedTypes.includes(p.normType) || prefsToUse.length === 4)
      .sort((a, b) => a.finalPrice - b.finalPrice);

    if (candidates.length === 0) {
      candidates = activeProducts.sort((a, b) => a.finalPrice - b.finalPrice);
    }

    // Phase 1: Maximized Variety (pick 1 of as many distinct products as possible without exceeding budget)
    for (const p of candidates) {
      if (totalSpent + p.finalPrice > budget) continue;

      if (p.normType === "sparklers" || p.normType === "premium_sparklers") {
        const size = getSparklerSize(p.productname) || "unknown";
        if ((sparklerSizeCount[size] || 0) >= 3) continue;
        sparklerSizeCount[size] = (sparklerSizeCount[size] || 0) + 1;
      }

      tempCart[p.uniqueKey] = 1;
      totalSpent += p.finalPrice;
    }

    // Phase 2: Budget Filler (Add extra quantities of picked products up to the budget cap)
    let remainingBudget = budget - totalSpent;
    let safetyCounter = 500;

    while (remainingBudget >= 10 && safetyCounter-- > 0) {
      let addedAny = false;
      for (const p of candidates) {
        if (!tempCart[p.uniqueKey]) continue;
        if (p.finalPrice <= remainingBudget) {
          tempCart[p.uniqueKey] = (tempCart[p.uniqueKey] || 0) + 1;
          remainingBudget -= p.finalPrice;
          totalSpent += p.finalPrice;
          addedAny = true;
        }
      }
      if (!addedAny) break;
    }

    // Phase 3: Add leftover cheap items to get as close to budget as possible
    if (remainingBudget >= 10) {
      for (const p of candidates) {
        if (p.finalPrice <= remainingBudget) {
          tempCart[p.uniqueKey] = (tempCart[p.uniqueKey] || 0) + 1;
          remainingBudget -= p.finalPrice;
          totalSpent += p.finalPrice;
        }
      }
    }

    setSuggestedCart(tempCart);
    setAiStep(2);
  }, [aiBudget, aiPreferences, products]);

  const addSuggestedToCart = () => {
    setCart((prev) => {
      const updated = { ...prev };
      Object.entries(suggestedCart).forEach(([key, qty]) => {
        updated[key] = (updated[key] || 0) + qty;
      });
      return updated;
    });
    setShowAiModal(false);
    setAiStep(0);
    setAiBudget("");
    setAiPreferences({ kids: false, sound: false, night: false, kidsnight: false });
    setSuggestedCart({});
  };

  const updateSuggestedQty = (key, delta) => {
    setSuggestedCart((prev) => {
      const current = prev[key] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      }
      return { ...prev, [key]: next };
    });
  };

  const suggestedTotalAmount = useMemo(() => {
    return Object.entries(suggestedCart).reduce((sum, [key, qty]) => {
      const p = products.find((x) => getProductUniqueKey(x) === key || x.serial_number === key || String(x.id) === String(key));
      if (!p) return sum;
      const price = parseFloat(p.price || 0);
      const discount = parseFloat(p.discount || 0);
      const finalPrice = discount > 0 ? Math.round(price * (1 - discount / 100)) : price;
      return sum + finalPrice * qty;
    }, 0);
  }, [suggestedCart, products]);

  // Product Purchase Checkout Form Submission with Auto PDF Download
  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!customer.name || !customer.mobile || customer.mobile.length !== 10) {
      alert("Please enter a valid 10-digit mobile number and name.");
      return;
    }

    setIsSubmitting(true);
    const order_id = `DC-${Date.now()}`;
    const payload = {
      order_id,
      products: cartItems.map((item) => ({
        id: item.id,
        product_type: item.product_type || "General",
        serial_number: item.serial_number || String(item.id),
        productname: item.productname,
        price: parseFloat(item.price || 0),
        discount: parseFloat(item.discount || 0),
        netPrice: item.netPrice,
        quantity: item.qty,
        per: item.per || "pkt",
      })),
      total: finalCheckoutTotal,
      customer_name: customer.name,
      mobile_number: customer.mobile,
      address: customer.address,
      district: customer.district,
      state: customer.state,
      email: customer.email,
      promocode: appliedPromo?.code || null,
      promo_discount: promoDiscountAmount,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/direct/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        const serverOrderId = data.order_id || data.quotation_id || order_id;

        setLastCompletedOrderId(serverOrderId);
        setBookingSuccess(true);
        setCart({});
        setShowCheckoutModal(false);
        setCheckoutStep(0);
        setIsSubmitting(false);

        // Auto Download PDF Invoice Bill asynchronously without blocking the UI
        fetch(`${API_BASE_URL}/api/direct/invoice/${serverOrderId}`)
          .then(async (pdfRes) => {
            if (pdfRes.ok) {
              const blob = await pdfRes.blob();
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `Deepa_Crackers_Invoice_${serverOrderId}.pdf`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);
            } else {
              console.warn("Invoice endpoint status:", pdfRes.status);
            }
          })
          .catch((pdfErr) => {
            console.error("Auto PDF download error:", pdfErr);
          });
      } else {
        alert("Failed to submit order enquiry. Please try again.");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Order submission error:", err);
      alert("Network error. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative overflow-x-hidden">
      {/* Subtle dot grid */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "28px 28px" }}
      />

      {/* Background fireworks (paused during checkout) */}
      <BackgroundFireworks isPaused={showCheckoutModal} />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-grow pt-24 pb-20 px-3 md:px-8 max-w-7xl mx-auto w-full space-y-8">

          {/* Banner Slider — Increased Height with Default Combo Box Banner */}
          <section
            className="relative w-full rounded-2xl overflow-hidden shadow-2xl"
            style={{
              background: "#080808",
              border: "1.5px solid rgba(255,255,255,0.18)",
            }}
          >
            {/* Red top bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-red-600 z-20" />

            <div className="relative w-full hundred:h-96 mobile:h-44">
              <AnimatePresence mode="wait">
                {allBanners[currentBannerIdx]?.isDefaultCombo ? (
                  <motion.div
                    key="combo-box-banner"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.01 }}
                    transition={{ duration: 0.45 }}
                    onClick={() => handleSelectComboBoxBanner(allBanners[currentBannerIdx]?.targetCategory || "Combo Box")}
                    className="w-full h-full px-12 mobile:px-14 hundred:px-16 py-2 hundred:py-8 flex flex-col justify-center relative cursor-pointer group select-none overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg, #050505 0%, #140404 50%, #080808 100%)",
                    }}
                  >
                    {/* Atmospheric background graphic accents */}
                    <div
                      className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none opacity-20 group-hover:opacity-35 transition-opacity duration-500"
                      style={{
                        background: "radial-gradient(circle at right center, rgba(220,38,38,0.55) 0%, transparent 70%)",
                        filter: "blur(60px)",
                      }}
                    />

                    {/* Diagonal texture */}
                    <div
                      className="absolute inset-0 pointer-events-none opacity-[0.03]"
                      style={{
                        backgroundImage: "repeating-linear-gradient(45deg, #ffffff 0, #ffffff 1px, transparent 0, transparent 24px)",
                      }}
                    />

                    <div className="relative z-10 max-w-2xl space-y-1 mobile:space-y-1.5 hundred:space-y-3">
                      {/* Badge */}
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 hundred:px-3.5 hundred:py-1.5 rounded-full text-[9px] hundred:text-[11px] font-black uppercase tracking-widest bg-red-600 text-white border border-red-400 shadow-md">
                        <Tag className="w-3 h-3 hundred:w-3.5 hundred:h-3.5" />
                        <span>BESTSELLER • 2025 FESTIVE SPECIAL</span>
                      </div>

                      {/* Main Title */}
                      <h2 className="text-base mobile:text-lg hundred:text-4xl font-black uppercase tracking-tight text-white leading-tight">
                        FESTIVE <span className="text-red-600">COMBO BOX</span>
                      </h2>

                      {/* Subtitle / Description */}
                      <p className="text-[10px] mobile:text-xs hundred:text-sm text-neutral-300 max-w-xl leading-tight line-clamp-1 hundred:line-clamp-none">
                        Handcrafted mega assortment packages with Sparklers, Ground Chakkars, Flower Pots, Bombs &amp; Repeating Sky Shots. Complete family pack at direct Sivakasi wholesale price!
                      </p>

                      {/* Offer pills */}
                      <div className="flex flex-wrap items-center gap-1.5 hundred:gap-2 pt-0.5 text-[9px] hundred:text-xs font-bold text-neutral-400">
                        <span className="px-2 py-0.5 rounded bg-white/10 text-white border border-white/20 font-mono text-[9px] hundred:text-xs">
                          SAVE UP TO 80%
                        </span>
                        <span className="hidden hundred:inline text-neutral-500">•</span>
                        <span className="hidden hundred:inline">100% Quality Tested</span>
                        <span className="hidden hundred:inline text-neutral-500">•</span>
                        <span className="hidden hundred:inline">Direct Factory Sourcing</span>
                      </div>

                      {/* Action CTA Button */}
                      <div className="pt-0.5 hundred:pt-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectComboBoxBanner("Combo Box");
                          }}
                          className="px-3 py-1.5 hundred:px-6 hundred:py-3 rounded-lg hundred:rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-[10px] mobile:text-xs hundred:text-sm uppercase tracking-wider shadow-[0_4px_25px_rgba(220,38,38,0.5)] flex items-center gap-1.5 hundred:gap-2 border border-red-400 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                        >
                          <span>Shop Combo Box Now</span>
                          <ArrowRight className="w-3.5 h-3.5 hundred:w-4 hundred:h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Right Side Visual Box Accent */}
                    <div className="hidden hundred:flex absolute right-12 top-1/2 -translate-y-1/2 flex-col items-center justify-center p-6 rounded-2xl bg-black/80 border-2 border-white/30 backdrop-blur-md text-center max-w-xs shadow-2xl group-hover:border-red-600 transition-colors">
                      <div className="w-16 h-16 bg-white rounded-xl p-1 mb-3 border border-white/40 shadow-md flex items-center justify-center overflow-hidden">
                        <img
                          src="/logo.png"
                          alt="Deepa Firecracker Shop"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="text-xs font-black uppercase text-red-500 tracking-wider">
                        All-In-One Box
                      </span>
                      <span className="text-base font-black text-white mt-1 leading-tight">
                        Family Mega Hamper
                      </span>
                      <span className="text-[10px] text-neutral-400 mt-1">
                        Limited Festival Allocation
                      </span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={allBanners[currentBannerIdx]?.id || currentBannerIdx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    onClick={() => {
                      if (allBanners[currentBannerIdx]?.target_category) {
                        handleSelectComboBoxBanner(allBanners[currentBannerIdx].target_category);
                      }
                    }}
                    className={`w-full h-full ${allBanners[currentBannerIdx]?.target_category ? "cursor-pointer" : ""}`}
                  >
                    <img
                      src={allBanners[currentBannerIdx]?.image_url}
                      alt={allBanners[currentBannerIdx]?.title || `Banner ${currentBannerIdx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {allBanners.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentBannerIdx((prev) => (prev === 0 ? allBanners.length - 1 : prev - 1));
                    }}
                    className="absolute left-2.5 hundred:left-3 top-1/2 -translate-y-1/2 w-8 h-8 hundred:w-10 hundred:h-10 rounded-xl bg-black/80 border border-white/20 text-white flex items-center justify-center hover:border-white/50 hover:bg-red-600 transition-all z-20 cursor-pointer shadow-lg"
                  >
                    <ChevronLeft className="h-4 w-4 hundred:h-5 hundred:w-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentBannerIdx((prev) => (prev + 1) % allBanners.length);
                    }}
                    className="absolute right-2.5 hundred:right-3 top-1/2 -translate-y-1/2 w-8 h-8 hundred:w-10 hundred:h-10 rounded-xl bg-black/80 border border-white/20 text-white flex items-center justify-center hover:border-white/50 hover:bg-red-600 transition-all z-20 cursor-pointer shadow-lg"
                  >
                    <ChevronRight className="h-4 w-4 hundred:h-5 hundred:w-5" />
                  </button>

                  <div className="absolute bottom-1.5 hundred:bottom-3.5 left-1/2 -translate-x-1/2 flex gap-1.5 hundred:gap-2 z-20">
                    {allBanners.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentBannerIdx(idx);
                        }}
                        className={`h-1.5 hundred:h-2 rounded-full transition-all cursor-pointer ${idx === currentBannerIdx
                          ? "w-6 hundred:w-8 bg-red-600 shadow-[0_0_8px_#dc2626]"
                          : "w-1.5 hundred:w-2 bg-white/40 hover:bg-white/70"
                          }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setShowAiModal(true)}
              className="px-5 py-3 rounded-xl text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2 hover:scale-105 active:scale-95 cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              <Bot className="h-4 w-4" />
              <span>AI Smart Assistant</span>
            </button>
            <button
              onClick={downloadPDFPricelist}
              disabled={downloadingPDF}
              className="px-5 py-3 rounded-xl font-bold text-xs shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 hover:scale-105 active:scale-95 cursor-pointer bg-white text-black hover:bg-neutral-100"
              style={{ border: "1px solid rgba(255,255,255,0.3)" }}
            >
              <FileText className="h-4 w-4 text-red-600" />
              <span>{downloadingPDF ? "Generating..." : "Download PDF Pricelist"}</span>
            </button>
            <button
              onClick={() => navigate("/status")}
              className="px-5 py-3 rounded-xl text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2 hover:scale-105 active:scale-95 cursor-pointer"
              style={{
                background: "#0a0a0a",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <span>Track Order Status</span>
            </button>
          </div>

          {/* Product Catalog */}
          <section id="product-catalog-section" className="space-y-5">
            <div
              className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-2xl"
              style={{
                background: "#0a0a0a",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="text-lg font-bold text-white uppercase tracking-wide">Product Catalog</h2>
                  <p className="text-neutral-500 text-xs mt-0.5">Display order arranged by Admin</p>
                </div>
                {/* Why Deepa Crackers "?" button */}
                <button
                  onClick={() => setShowWhyModal(true)}
                  title="Why Choose Deepa Crackers?"
                  className="w-7 h-7 rounded-full border border-white/30 text-white text-xs font-black flex items-center justify-center hover:bg-red-600 hover:border-red-600 transition-all cursor-pointer shrink-0"
                >
                  ?
                </button>
              </div>

              {/* View Mode Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-2 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${viewMode === "grid"
                    ? "bg-red-600 text-white border-red-600"
                    : "bg-black text-neutral-400 border-white/10 hover:border-white/30"
                    }`}
                >
                  <LayoutGrid className="h-3.5 w-3.5" /> Grid
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-3 py-2 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${viewMode === "table"
                    ? "bg-red-600 text-white border-red-600"
                    : "bg-black text-neutral-400 border-white/10 hover:border-white/30"
                    }`}
                >
                  <ListIcon className="h-3.5 w-3.5" /> Table
                </button>
                <button
                  onClick={downloadPDFPricelist}
                  className="px-3 py-2 rounded-lg bg-white text-black border border-white/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-neutral-100"
                >
                  <FileText className="h-3.5 w-3.5 text-red-600" /> PDF
                </button>
              </div>
            </div>

            {/* Category Chips & Search */}
            <div
              className="space-y-3 p-4 rounded-2xl"
              style={{
                background: "#0a0a0a",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap border transition-all active:scale-95 cursor-pointer ${isSelected
                        ? "bg-red-600 text-white border-red-600"
                        : "bg-black text-neutral-400 border-white/10 hover:border-white/30 hover:text-white"
                        }`}
                    >
                      {formatCategoryName(cat)}
                    </button>
                  );
                })}
              </div>

              {/* Search Bar */}
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg text-white placeholder-neutral-600 text-xs focus:outline-none transition-all"
                  style={{
                    background: "#060606",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                  onFocus={e => e.target.style.borderColor = "rgba(255,255,255,0.4)"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.15)"}
                />
              </div>
            </div>

            {/* Products */}
            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto" />
                <p className="text-neutral-500 text-xs mt-3 uppercase tracking-wider">Loading catalog...</p>
              </div>
            ) : groupedProducts.length === 0 ? (
              <div className="text-center py-10 rounded-2xl border border-white/10 bg-black p-6">
                <p className="text-neutral-400 text-sm">No products found.</p>
              </div>
            ) : (
              <div data-tour="product-grid" className="space-y-10">
                {groupedProducts.map((group) => {
                  return (
                    <div key={group.category} className="space-y-4">
                      {/* Category Header */}
                      <div className="flex items-center gap-3">
                        <span
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white shrink-0"
                          style={{ background: "#dc2626" }}
                        >
                          ★
                        </span>
                        <h3 className="text-lg font-bold uppercase tracking-wide text-white">
                          {formatCategoryName(group.category)}
                        </h3>
                        <div className="h-px flex-1 bg-white/10" />
                      </div>

                      {/* Grid View */}
                      {viewMode === "grid" ? (
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
                          {group.items.map((prod, pIdx) => {
                            const uKey = getProductUniqueKey(prod);
                            const qty = cart[uKey] || 0;
                            const price = parseFloat(prod.price || 0);
                            const discount = parseFloat(prod.discount || 0);
                            const netPrice = discount > 0 ? Math.round(price * (1 - discount / 100)) : price;
                            const tamilName = translateProduct(prod.productname);
                            const theme = getProductTheme();

                            return (
                              <Card3D key={uKey}>
                                <div
                                  className="group relative rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between space-y-3 transition-all duration-300 overflow-hidden h-full"
                                  style={{
                                    background: "#0a0a0a",
                                    border: `1px solid ${qty > 0 ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.12)"}`,
                                    boxShadow: qty > 0 ? "0 4px 20px rgba(220,38,38,0.2)" : "none",
                                  }}
                                >
                                  {/* Red top bar on active */}
                                  {qty > 0 && (
                                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-red-600" />
                                  )}

                                  <div className="space-y-3 relative z-10">
                                    {/* Product Image */}
                                    <div className="rounded-xl overflow-hidden border border-white/10">
                                      <ProductCarousel media={prod.image || prod.images} onImageClick={setPreviewMedia} theme={theme} />
                                    </div>

                                    {/* Serial & Discount badges */}
                                    <div className="flex items-center justify-between gap-1.5 flex-wrap">
                                      <span
                                        className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border"
                                        style={{
                                          background: "#060606",
                                          borderColor: "rgba(255,255,255,0.12)",
                                          color: "#9ca3af",
                                        }}
                                      >
                                        #{prod.serial_number || prod.id}
                                      </span>

                                      <div className="flex items-center gap-1">
                                        {discount > 0 && (
                                          <span
                                            className="text-[10px] font-bold px-2 py-0.5 rounded text-white"
                                            style={{ background: "#dc2626", border: "1px solid rgba(255,255,255,0.2)" }}
                                          >
                                            {discount}% OFF
                                          </span>
                                        )}
                                        {qty > 0 && (
                                          <span
                                            className="text-[10px] font-bold px-2 py-0.5 rounded text-black"
                                            style={{ background: "#ffffff" }}
                                          >
                                            {qty} in List
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    {/* Title */}
                                    <div>
                                      <h4 className="font-bold text-white text-sm line-clamp-2 tracking-tight">
                                        {prod.productname}
                                      </h4>
                                      {tamilName && (
                                        <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5">
                                          {tamilName}
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  {/* Pricing & Action */}
                                  <div className="pt-2.5 border-t border-white/10 space-y-2.5 relative z-10">
                                    <div className="flex items-baseline justify-between">
                                      <span className="text-lg sm:text-xl font-black text-white">
                                        Rs.{netPrice.toFixed(2)}
                                      </span>
                                      {discount > 0 && (
                                        <span className="text-xs text-neutral-600 line-through">
                                          Rs.{price.toFixed(2)}
                                        </span>
                                      )}
                                      <span className="text-[10px] text-neutral-500 uppercase">
                                        /{prod.per || "pkt"}
                                      </span>
                                    </div>

                                    {qty === 0 ? (
                                      <button
                                        onClick={(e) => updateQuantity(prod, 1, e)}
                                        className="w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 hover:scale-[1.02] cursor-pointer text-white"
                                        style={{
                                          background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                                          border: "1px solid rgba(255,255,255,0.15)",
                                        }}
                                      >
                                        <span>Add</span>
                                        <Plus className="h-3.5 w-3.5 stroke-[3]" />
                                      </button>
                                    ) : (
                                      <div
                                        className="w-full flex items-center justify-between p-1 rounded-xl"
                                        style={{
                                          background: "#060606",
                                          border: "1px solid rgba(255,255,255,0.2)",
                                        }}
                                      >
                                        <button
                                          onClick={() => updateQuantity(prod, -1)}
                                          className="flex-1 h-8 rounded-lg flex items-center justify-center font-bold text-sm transition-all active:scale-90 bg-neutral-900 hover:bg-neutral-800 text-white border border-white/10 cursor-pointer"
                                        >
                                          <Minus className="h-3.5 w-3.5" />
                                        </button>
                                        <div className="px-3 text-center">
                                          <span className="font-mono font-black text-sm text-white block">{qty}</span>
                                          <span className="text-[9px] uppercase text-neutral-500 block">IN LIST</span>
                                        </div>
                                        <button
                                          onClick={(e) => updateQuantity(prod, 1, e)}
                                          className="flex-1 h-8 rounded-lg flex items-center justify-center font-bold text-sm active:scale-90 transition-all cursor-pointer text-white"
                                          style={{ background: "linear-gradient(135deg, #dc2626, #b91c1c)" }}
                                        >
                                          <Plus className="h-3.5 w-3.5 stroke-[3]" />
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </Card3D>
                            );
                          })}
                        </div>
                      ) : (
                        /* Table View */
                        <div
                          className="rounded-2xl overflow-x-auto"
                          style={{
                            background: "#0a0a0a",
                            border: "1px solid rgba(255,255,255,0.15)",
                          }}
                        >
                          <table className="w-full text-left text-xs">
                            <thead className="font-bold uppercase border-b border-white/10">
                              <tr className="text-neutral-400">
                                <th className="p-3 border-r border-white/10">Code</th>
                                <th className="p-3 border-r border-white/10">Product Name</th>
                                <th className="p-3 border-r border-white/10">MRP</th>
                                <th className="p-3 border-r border-white/10">Discount</th>
                                <th className="p-3 border-r border-white/10">Net Rate</th>
                                <th className="p-3 border-r border-white/10">Per</th>
                                <th className="p-3 text-center">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.06]">
                              {group.items.map((prod) => {
                                const uKey = getProductUniqueKey(prod);
                                const qty = cart[uKey] || 0;
                                const price = parseFloat(prod.price || 0);
                                const discount = parseFloat(prod.discount || 0);
                                const netPrice = discount > 0 ? Math.round(price * (1 - discount / 100)) : price;
                                const tamilName = translateProduct(prod.productname);

                                return (
                                  <tr key={uKey} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="p-3 font-mono text-neutral-500 border-r border-white/10">
                                      #{prod.serial_number || prod.id}
                                    </td>
                                    <td className="p-3 border-r border-white/10">
                                      <span className="font-bold text-white block">{prod.productname}</span>
                                      {tamilName && <span className="text-[11px] block mt-0.5 text-neutral-500">{tamilName}</span>}
                                    </td>
                                    <td className="p-3 text-neutral-600 line-through border-r border-white/10">
                                      Rs.{price.toFixed(2)}
                                    </td>
                                    <td className="p-3 font-bold text-red-500 border-r border-white/10">
                                      {discount > 0 ? `${discount}%` : "-"}
                                    </td>
                                    <td className="p-3 font-black text-white border-r border-white/10">
                                      Rs.{netPrice.toFixed(2)}
                                    </td>
                                    <td className="p-3 uppercase text-neutral-500 border-r border-white/10">
                                      {prod.per || "pkt"}
                                    </td>
                                    <td className="p-3 text-center">
                                      {qty === 0 ? (
                                        <button
                                          onClick={(e) => updateQuantity(prod, 1, e)}
                                          className="px-3 py-1.5 rounded-lg font-bold text-xs flex items-center justify-center gap-1 mx-auto transition-all active:scale-95 cursor-pointer text-white"
                                          style={{ background: "linear-gradient(135deg, #dc2626, #b91c1c)" }}
                                        >
                                          <Plus className="h-3 w-3 stroke-[3]" /> Add
                                        </button>
                                      ) : (
                                        <div
                                          className="inline-flex items-center gap-1.5 p-0.5 rounded-lg bg-black border border-white/15"
                                        >
                                          <button
                                            onClick={() => updateQuantity(prod, -1)}
                                            className="w-6 h-6 rounded bg-neutral-900 text-white flex items-center justify-center font-bold text-xs hover:bg-neutral-800 active:scale-90"
                                          >
                                            <Minus className="h-3 w-3" />
                                          </button>
                                          <span className="w-6 text-center font-mono font-black text-xs text-white">{qty}</span>
                                          <button
                                            onClick={(e) => updateQuantity(prod, 1, e)}
                                            className="w-6 h-6 rounded text-white flex items-center justify-center font-bold text-xs active:scale-90"
                                            style={{ background: "#dc2626" }}
                                          >
                                            <Plus className="h-3 w-3 stroke-[3]" />
                                          </button>
                                        </div>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>



          {/* Legal Notice */}
          <section
            className="relative p-5 sm:p-6 rounded-2xl"
            style={{
              background: "#0a0a0a",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <div className="flex items-start gap-3">
              <span className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0">
                <ShieldCheck className="h-4 w-4" />
              </span>
              <div>
                <h3 className="font-bold text-sm text-white mb-1">Supreme Court Compliance Notice</h3>
                <p className="text-xs text-neutral-400 leading-relaxed max-w-4xl">
                  As per 2018 Supreme Court regulations, direct online e-commerce transactions of firecrackers are prohibited. <strong className="text-white font-bold">Deepa Crackers operates in 100% legal compliance.</strong> Please add your desired items to the estimate list and submit your enquiry. Our team will contact you within 24 hours to confirm.
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {["100% Legal Compliance", "Supreme Court 2018", "Direct Transport", "Safe Festival Fun"].map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide text-neutral-300 border border-white/15 bg-white/5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* AI Assistant Modal */}
          <AnimatePresence>
            {showAiModal && (
              <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="w-full max-w-lg rounded-3xl bg-neutral-900 border border-white/20 p-6 space-y-6 shadow-2xl relative text-white"
                >
                  <button
                    onClick={() => {
                      setShowAiModal(false);
                      setAiStep(0);
                      setAiBudget("");
                      setAiPreferences({ kids: false, sound: false, night: false, kidsnight: false });
                      setSuggestedCart({});
                    }}
                    className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1"
                  >
                    <X className="h-6 w-6" />
                  </button>

                  <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
                    <Bot className="h-6 w-6 text-red-500" />
                    <h2 className="text-xl font-black text-white">Smart AI Fireworks Assistant</h2>
                  </div>

                  {aiStep === 0 && (
                    <div className="space-y-4">
                      <p className="text-xs font-bold text-neutral-300 uppercase">Step 1: What is your approximate festival budget? (₹)</p>
                      <input
                        type="number"
                        value={aiBudget}
                        onChange={(e) => setAiBudget(e.target.value)}
                        placeholder="e.g. 3000"
                        className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 text-white text-sm focus:outline-none focus:border-red-500 shadow-inner"
                      />
                      <button
                        onClick={() => {
                          if (!aiBudget || Number(aiBudget) <= 0) {
                            alert("Please enter a valid budget amount in ₹");
                            return;
                          }
                          setAiStep(1);
                        }}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-xs shadow-lg shadow-red-600/30 transition-all border border-red-500"
                      >
                        Next: Select Preferences →
                      </button>
                    </div>
                  )}

                  {aiStep === 1 && (
                    <div className="space-y-4">
                      <p className="text-xs font-bold text-neutral-300 uppercase">Step 2: Select Firework Preferences</p>
                      <div className="space-y-2.5">
                        {[
                          { key: "kids", label: "Kids Varieties (Twinkling Star, Pencils, Novelties)" },
                          { key: "sound", label: "Loud Sound Crackers (Bombs, Sound Crackers)" },
                          { key: "night", label: "Night Sky (Rockets, Repeating Shots, Sky Shots)" },
                          { key: "kidsnight", label: "Kids Night (Sparklers, Flower Pots, Chakkars)" },
                        ].map(({ key, label }) => (
                          <label key={key} className="flex items-center gap-3 p-2.5 rounded-xl bg-black border border-white/20 shadow-md cursor-pointer hover:border-white/50">
                            <input
                              type="checkbox"
                              checked={aiPreferences[key]}
                              onChange={(e) => setAiPreferences((prev) => ({ ...prev, [key]: e.target.checked }))}
                              className="w-4 h-4 accent-red-600 rounded border-white/20"
                            />
                            <span className="text-xs font-bold text-neutral-200">{label}</span>
                          </label>
                        ))}
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => setAiStep(0)}
                          className="w-1/3 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-white/20 font-bold text-xs shadow-md"
                        >
                          ← Back
                        </button>
                        <button
                          onClick={generateSuggestions}
                          className="w-2/3 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-lg shadow-red-600/30 border border-red-500"
                        >
                          Generate AI Combination
                        </button>
                      </div>
                    </div>
                  )}

                  {aiStep === 2 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                        <div>
                          <p className="text-xs font-black text-white uppercase">Suggested Combination</p>
                          <p className="text-[11px] text-neutral-400">
                            {Object.keys(suggestedCart).length} product variety(s) • Total: <strong className="text-red-400">₹{suggestedTotalAmount.toFixed(2)}</strong> (Max Budget: ₹{Number(aiBudget).toFixed(2)})
                          </p>
                        </div>
                        <button
                          onClick={() => setAiStep(1)}
                          className="px-2.5 py-1 rounded-lg bg-neutral-800 border border-neutral-700 text-[11px] font-bold text-neutral-300 hover:text-white"
                        >
                          Change Preferences
                        </button>
                      </div>

                      <div className="max-h-60 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                        {Object.entries(suggestedCart).map(([key, qty]) => {
                          const p = products.find((x) => getProductUniqueKey(x) === key || x.serial_number === key || String(x.id) === String(key));
                          if (!p) return null;
                          const price = parseFloat(p.price || 0);
                          const discount = parseFloat(p.discount || 0);
                          const finalPrice = discount > 0 ? Math.round(price * (1 - discount / 100)) : price;

                          return (
                            <div key={key} className="flex items-center justify-between p-2.5 rounded-xl bg-black border border-neutral-800 text-xs">
                              <div className="flex items-center gap-2 flex-1 min-w-0 pr-2">
                                {renderProductThumbnail(p.image || p.images)}
                                <div className="min-w-0 flex-1">
                                  <p className="font-bold text-white truncate">{p.productname}</p>
                                  <p className="text-[10px] text-neutral-400">₹{finalPrice.toFixed(2)} × {qty}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <div className="inline-flex items-center gap-1 p-0.5 rounded-lg bg-neutral-900 border border-neutral-800">
                                  <button
                                    onClick={() => updateSuggestedQty(key, -1)}
                                    className="w-4 h-4 rounded bg-neutral-800 border border-neutral-700 text-neutral-300 flex items-center justify-center font-bold text-[10px]"
                                  >
                                    -
                                  </button>
                                  <span className="w-4 text-center font-black text-[10px] text-white">{qty}</span>
                                  <button
                                    onClick={() => updateSuggestedQty(key, 1)}
                                    className="w-4 h-4 rounded bg-red-600 border border-red-500 text-white flex items-center justify-center font-bold text-[10px]"
                                  >
                                    +
                                  </button>
                                </div>
                                <span className="font-black text-white w-14 text-right">₹{(finalPrice * qty).toFixed(2)}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <button
                        onClick={addSuggestedToCart}
                        className="w-full py-3.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-black text-xs shadow-lg transition-all border border-white cursor-pointer"
                      >
                        Add All Suggested Items to Cart
                      </button>
                    </div>
                  )}
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Media Preview Modal */}
          <AnimatePresence>
            {previewMedia && (
              <div
                className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
                onClick={() => setPreviewMedia(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-neutral-900 rounded-3xl p-4 border border-white/20 shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden relative flex flex-col items-center justify-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setPreviewMedia(null)}
                    className="absolute top-3 right-3 text-white bg-red-600 hover:bg-red-500 border border-red-500 rounded-xl p-1 shadow-md z-10"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  <div className="w-full h-full flex items-center justify-center p-2">
                    <img
                      src={Array.isArray(previewMedia) ? previewMedia[0] : previewMedia}
                      alt="Product Enlarged"
                      className="max-h-[75vh] w-auto object-contain rounded-2xl border border-neutral-800"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = defaultImage;
                      }}
                    />
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Cart Summary Bar */}
          <AnimatePresence>
            {cartItems.length > 0 && (
              <motion.div
                data-tour="cart-summary"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-5 left-4 right-4 z-40 max-w-4xl mx-auto rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 text-white overflow-hidden"
                style={{
                  background: "rgba(8,8,8,0.97)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.8)",
                }}
              >
                {/* Red top bar */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-red-600" />

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm bg-white/10 border border-white/20 text-white font-black shrink-0">
                    {cartItems.length}
                  </div>
                  <div>
                    <div className="text-xs text-neutral-400 font-medium">Items selected</div>
                    <p className="text-xl font-black text-white">Rs.{finalCheckoutTotal.toFixed(2)}</p>
                  </div>
                </div>

                <button
                  data-tour="checkout-btn"
                  onClick={() => {
                    setShowCheckoutModal(true);
                    setCheckoutStep(0);
                  }}
                  className="px-5 sm:px-7 py-3 sm:py-3.5 rounded-xl text-black font-black text-xs sm:text-sm transition-all flex items-center gap-2 hover:scale-105 active:scale-95 cursor-pointer bg-white hover:bg-neutral-100"
                  style={{ border: "1px solid rgba(255,255,255,0.3)" }}
                >
                  <span>Submit Enquiry</span>
                  <ArrowRight className="h-4 w-4 stroke-[3]" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Multi-Step Product Purchase Checkout Modal */}
          <AnimatePresence>
            {showCheckoutModal && (
              <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="w-full max-w-lg rounded-3xl bg-neutral-900 border border-white/20 p-5 md:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto scrollbar-thin text-white"
                >
                  <button
                    onClick={() => {
                      setShowCheckoutModal(false);
                      setCheckoutStep(0);
                    }}
                    className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 z-10"
                  >
                    <X className="h-6 w-6" />
                  </button>

                  {/* Header Step Progress */}
                  <div className="space-y-2">
                    <h2 className="text-xl md:text-2xl font-black text-white">Checkout & Order Enquiry</h2>
                    <div className="flex items-center gap-1.5 text-[11px] md:text-xs font-bold overflow-x-auto pb-1">
                      <span className={`px-2 py-0.5 rounded-lg border whitespace-nowrap ${checkoutStep === 0 ? 'bg-red-600 text-white border-red-500 font-black' : 'bg-neutral-800 text-neutral-300 border-neutral-700'}`}>1. Customer Details</span>
                      <span className="text-neutral-500">→</span>
                      <span className={`px-2 py-0.5 rounded-lg border whitespace-nowrap ${checkoutStep === 1 ? 'bg-red-600 text-white border-red-500 font-black' : 'bg-neutral-800 text-neutral-300 border-neutral-700'}`}>2. Location & Offer</span>
                      <span className="text-neutral-500">→</span>
                      <span className={`px-2 py-0.5 rounded-lg border whitespace-nowrap ${checkoutStep === 2 ? 'bg-red-600 text-white border-red-500 font-black' : 'bg-neutral-800 text-neutral-300 border-neutral-700'}`}>3. Review Products</span>
                    </div>
                  </div>

                  <form onSubmit={handleCheckoutSubmit} className="space-y-4">

                    {/* Step 0: Customer Personal Details */}
                    {checkoutStep === 0 && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-neutral-300 uppercase mb-1">Full Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="Enter customer full name"
                            value={customer.name}
                            onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white text-xs focus:outline-none focus:border-red-500 shadow-inner"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-neutral-300 uppercase mb-1">Mobile Number *</label>
                          <input
                            type="tel"
                            required
                            maxLength={10}
                            placeholder="10-digit mobile number"
                            value={customer.mobile}
                            onChange={(e) => setCustomer({ ...customer, mobile: e.target.value.replace(/\D/g, "") })}
                            className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white text-xs focus:outline-none focus:border-red-500 shadow-inner"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-neutral-300 uppercase mb-1">Email Address (Optional)</label>
                          <input
                            type="email"
                            placeholder="email@example.com"
                            value={customer.email || ""}
                            onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white text-xs focus:outline-none focus:border-red-500 shadow-inner"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-neutral-300 uppercase mb-1">Delivery Address *</label>
                          <textarea
                            rows={2}
                            required
                            placeholder="Full delivery street address..."
                            value={customer.address}
                            onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl bg-black border border-white/20 text-white text-xs focus:outline-none focus:border-red-500 resize-none shadow-inner"
                          ></textarea>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (!customer.name || !customer.mobile || customer.mobile.length !== 10 || !customer.address) {
                              alert("Please fill in Name, 10-digit Mobile Number, and Address.");
                              return;
                            }
                            setCheckoutStep(1);
                          }}
                          className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-xs shadow-lg shadow-red-600/30 transition-all border border-red-500"
                        >
                          Next: Location, Address & Offers →
                        </button>
                      </div>
                    )}

                    {/* Step 1: Location, Address & Offer Summary */}
                    {checkoutStep === 1 && (
                      <div className="space-y-4">
                        {/* Address Review Box */}
                        <div className="p-3.5 rounded-xl bg-black border border-neutral-800 text-xs space-y-1 shadow-inner">
                          <p className="font-bold text-red-500 flex items-center gap-1.5">
                            <MapPin className="h-4 w-4 text-red-500" /> Delivery Target Address:
                          </p>
                          <p className="font-bold text-white">{customer.name} ({customer.mobile})</p>
                          <p className="text-neutral-300 leading-tight">{customer.address}</p>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-neutral-300 uppercase mb-1">State *</label>
                          <select
                            value={customer.state}
                            onChange={(e) => setCustomer({ ...customer, state: e.target.value, district: "" })}
                            className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white text-xs focus:outline-none focus:border-red-500"
                          >
                            <option value="Tamil Nadu">Tamil Nadu</option>
                            {states.map((s) => (
                              <option key={s.id || s.name} value={s.name}>{s.name}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-neutral-300 uppercase mb-1">District *</label>
                          <select
                            value={customer.district}
                            onChange={(e) => setCustomer({ ...customer, district: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white text-xs focus:outline-none focus:border-red-500"
                          >
                            <option value="Thiruthuraipoondi">Thiruthuraipoondi</option>
                            {districts.map((d) => (
                              <option key={d.id || d.name} value={d.name}>{d.name}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-neutral-300 uppercase mb-1">Apply Promocode / Coupon</label>
                          <select
                            value={selectedPromoCode}
                            onChange={(e) => handleApplyPromoCode(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white text-xs focus:outline-none focus:border-red-500"
                          >
                            <option value="">No Promocode Selected</option>
                            {promoCodes.map((promo) => (
                              <option key={promo.id || promo.code} value={promo.code}>
                                {promo.code} ({promo.discount}% OFF)
                              </option>
                            ))}
                          </select>

                          {appliedPromo && (
                            <p className="text-[11px] font-bold text-red-400 mt-1.5 flex items-center gap-1">
                              <Tag className="h-3.5 w-3.5" /> Promocode {appliedPromo.code} applied! ({appliedPromo.discount}% OFF)
                            </p>
                          )}
                        </div>

                        <div className="flex gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setCheckoutStep(0)}
                            className="w-1/3 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 font-bold text-xs shadow-md"
                          >
                            ← Back
                          </button>
                          <button
                            type="button"
                            onClick={() => setCheckoutStep(2)}
                            className="w-2/3 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-xs shadow-lg shadow-red-600/30 border border-red-500"
                          >
                            Review Products & Images →
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Product Review with Images & Mobile Optimised View */}
                    {checkoutStep === 2 && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                          <p className="text-xs font-black text-white uppercase">Review Order Items ({cartItems.length})</p>
                          <p className="text-[11px] font-bold text-red-500">{customer.district}, {customer.state}</p>
                        </div>

                        {/* Product List with Image Thumbnails */}
                        <div className="max-h-64 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                          {cartItems.map((item) => {
                            const tamilName = translateProduct(item.productname);
                            return (
                              <div key={item.uniqueKey} className="flex items-center justify-between p-2.5 rounded-xl bg-black border border-neutral-800 shadow-md gap-2">
                                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                                  {renderProductThumbnail(item.image || item.images)}
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1">
                                      <span className="text-[9px] px-1 rounded bg-white/10 border border-white/20 text-white font-bold">#{item.serial_number || item.id}</span>
                                      <span className="text-xs font-bold text-white truncate">{item.productname}</span>
                                    </div>
                                    {tamilName && <p className="text-[10px] text-neutral-400 truncate">{tamilName}</p>}
                                    <p className="text-[10px] text-neutral-400">₹{item.netPrice.toFixed(2)} per {item.per || 'pkt'}</p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <div className="inline-flex items-center gap-1 p-0.5 rounded-lg bg-neutral-900 border border-neutral-800">
                                    <button
                                      type="button"
                                      onClick={() => updateQuantity(item, -1)}
                                      className="w-5 h-5 rounded bg-neutral-800 border border-neutral-700 text-neutral-300 flex items-center justify-center font-bold text-xs hover:bg-neutral-700"
                                    >
                                      -
                                    </button>
                                    <span className="w-5 text-center font-black text-xs text-white">{item.qty}</span>
                                    <button
                                      type="button"
                                      onClick={(e) => updateQuantity(item, 1, e)}
                                      className="w-5 h-5 rounded bg-red-600 border border-red-500 text-white flex items-center justify-center font-bold text-xs hover:bg-red-500"
                                    >
                                      +
                                    </button>
                                  </div>
                                  <span className="font-black text-xs text-white w-16 text-right">₹{item.subtotal.toFixed(2)}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Cost Breakdown */}
                        <div className="p-3.5 rounded-xl bg-black border border-neutral-800 space-y-1 text-xs shadow-inner">
                          <div className="flex justify-between text-neutral-400">
                            <span>Cart Estimate Subtotal:</span>
                            <span>₹{totalAmount.toFixed(2)}</span>
                          </div>
                          {appliedPromo && (
                            <div className="flex justify-between text-red-400 font-bold">
                              <span>Promocode Discount ({appliedPromo.discount}%):</span>
                              <span>-₹{promoDiscountAmount.toFixed(2)}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-white font-black text-sm pt-1 border-t border-neutral-800">
                            <span>Total Amount Payable:</span>
                            <span className="text-red-500">₹{finalCheckoutTotal.toFixed(2)}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setCheckoutStep(1)}
                            className="w-1/3 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 font-bold text-xs shadow-md"
                          >
                            ← Back
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-2/3 py-3.5 rounded-xl bg-white hover:bg-neutral-200 text-black border border-white font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                          >
                            {isSubmitting ? (
                              <>
                                <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin shrink-0" />
                                Submitting Order…
                              </>
                            ) : "Confirm & Download Invoice Bill"}
                          </button>
                        </div>
                      </div>
                    )}

                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Sky Shot Center Celebration Modal */}
          <SkyShotBookingSuccessModal
            isOpen={bookingSuccess}
            onClose={() => setBookingSuccess(false)}
            orderId={lastCompletedOrderId}
            customerName={customer.name}
            totalAmount={finalCheckoutTotal}
          />

          {/* Footer */}
          <footer
            className="relative mx-1 sm:mx-4 mb-8 mt-10 rounded-2xl overflow-hidden"
            style={{
              background: "#060606",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div className="h-0.5 w-full bg-red-600" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white p-1 border border-white/40 shadow-md shrink-0 flex items-center justify-center overflow-hidden">
                    <img
                      src="/logo.png"
                      alt="Deepa Firecracker Shop"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="text-base font-black text-white block leading-none">
                      DEEPA CRACKERS
                    </span>
                    <span className="text-[10px] font-bold text-red-500 tracking-wider uppercase mt-1 block leading-none">
                      Since 1984 • Sivakasi
                    </span>
                  </div>
                </div>
                <div className="h-px w-16 bg-red-600 mb-3" />
                <p className="text-neutral-400 text-xs leading-relaxed mb-2">Direct Sivakasi wholesale fireworks for every festive occasion.</p>
                <p className="text-neutral-300 text-xs font-semibold">RS Road, Thiruthuraipoondi, Tamil Nadu</p>
              </div>

              <div>
                <h2 className="text-sm font-black text-white mb-1 uppercase tracking-widest">Connect With Us</h2>
                <div className="h-px w-12 bg-white/20 mb-3" />
                <p className="text-xs text-neutral-400 mb-3">Instant WhatsApp chat &amp; Instagram updates:</p>

                <div className="flex flex-wrap gap-2 mb-3">
                  <a
                    href="https://wa.me/918072897834"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all border border-red-500 shadow-sm"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href="https://www.instagram.com/deepa_crackers/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black hover:bg-neutral-900 text-white text-xs font-bold transition-all border border-white/20 hover:border-white/50 shadow-sm"
                  >
                    <span>@deepa_crackers</span>
                  </a>
                </div>

                <a href="tel:+918072897834" className="text-xs font-bold block text-white hover:text-red-500 transition-colors">+91 8072 897 834</a>
                <a href="mailto:deepatraders1985@gmail.com" className="text-xs font-medium block mt-1 text-neutral-400 hover:text-white transition-colors">deepatraders1985@gmail.com</a>
              </div>

              <div>
                <h2 className="text-sm font-black text-white mb-1 uppercase tracking-widest">Quick Links</h2>
                <div className="h-px w-12 bg-white/20 mb-3" />
                <ul className="space-y-1.5 text-xs text-neutral-400">
                  {[
                    { label: "Home", href: "/" },
                    { label: "Track Order", href: "/status" },
                    { label: "Safety Tips", href: "/safety-tips" },
                    { label: "About Us", href: "/about-us" },
                    { label: "Contact Us", href: "/contact-us" },
                  ].map((link) => (
                    <li key={link.href}>
                      <a href={link.href} className="hover:text-white transition flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-red-600" />
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-white/[0.06] py-5 text-center text-xs text-neutral-400 space-y-2">
              <p className="max-w-4xl mx-auto leading-relaxed text-[11px] sm:text-xs text-neutral-400 px-4">
                As per 2018 Supreme Court order, online sale of firecrackers are not permitted! We value our customers and respect jurisdiction. Please add your products to cart and submit enquiries. We will contact you within 24 hrs.
              </p>
              <p className="text-neutral-500 text-[11px]">
                © {new Date().getFullYear()} <span className="font-black text-white">Deepa Firecracker Shop</span> — Thiruthuraipoondi. All rights reserved.
              </p>
            </div>
          </footer>
        </main>
      </div>

      {/* Social Quick Connect (WhatsApp & Instagram floating action buttons) */}
      <WhatsAppButton hasActiveCart={cartItems.length > 0} />

      {/* Promo Burst */}
      {!showCheckoutModal && promoCodes.length > 0 && (
        <PromoBurst promoCodes={promoCodes} onApplyPromo={(code) => handleApplyPromoCode(code)} />
      )}

      {/* Launch Screen — shown once per session */}
      {showLauncher && (
        <Launch
          onComplete={() => {
            sessionStorage.setItem("deepa_crackers_launched", "1");
            setShowLauncher(false);
          }}
        />
      )}

      {/* Why Deepa Crackers modal — auto-dismisses after 10 seconds */}
      {showWhyModal && (
        <WhyDeepaCrackersModal
          onClose={() => setShowWhyModal(false)}
        />
      )}

      {/* Click Micro Popper Sparkles Overlay (Ultra-Bright, Shockwave Ring & Core Flash) */}
      {popperSparks.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-[999999] overflow-hidden">
          {popperSparks.map((spark) => (
            <div
              key={spark.id}
              className="absolute"
              style={{ left: spark.x, top: spark.y }}
            >
              {/* Expanding Red Shockwave Ring */}
              <motion.div
                initial={{ scale: 0.3, opacity: 1 }}
                animate={{ scale: 2.4, opacity: 0 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="absolute -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-2 border-red-600 shadow-[0_0_20px_#dc2626]"
              />

              {/* Central Radiant Flash */}
              <motion.div
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: [0, 2.0, 0], opacity: [0, 0.9, 0] }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full"
                style={{
                  background: "radial-gradient(circle, #ffffff 0%, #dc2626 50%, transparent 70%)",
                  boxShadow: "0 0 25px #dc2626",
                }}
              />

              {/* Radiant Multi-Color Sparkle Particles */}
              {spark.particles.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 0.6 }}
                  animate={{
                    x: [0, p.dx * 0.45, p.dx],
                    y: [0, p.dy * 0.45, p.dy + 8],
                    opacity: [1, 1, 0.8, 0],
                    scale: [0.6, 1.8, 1.2, 0],
                  }}
                  transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute rounded-full -translate-x-1/2 -translate-y-1/2"
                  style={{
                    width: p.size,
                    height: p.size,
                    backgroundColor: p.color,
                    boxShadow: `0 0 16px ${p.color}, 0 0 8px #ffffff, 0 0 26px ${p.color}`,
                    willChange: "transform, opacity",
                  }}
                >
                  {/* Bright Diamond White Core inside larger sparkles */}
                  {p.size > 5 && (
                    <div className="w-1/2 h-1/2 rounded-full bg-white mx-auto my-auto mt-[25%]" />
                  )}
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}