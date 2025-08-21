'use client';

import { useState } from 'react';
import Head from 'next/head';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Star, ThumbsUp, MessageCircle, User, Calendar, Heart, Share2, Filter } from 'lucide-react';
import RoyalParallaxScene from '../components/RoyalParallaxScene';

const reviews = [
  {
    id: 1,
    user: {
      name: "Ahmet Yılmaz",
      avatar: "/images/avatars/user1.jpg",
      verified: true
    },
    rating: 5,
    date: "2024-01-15",
    title: "Mükemmel lezzet ve hızlı teslimat!",
    content: "Pizza Krallığı'ndan ilk kez sipariş verdim ve gerçekten çok memnun kaldım. Margherita pizzası çok lezzetliydi, hamuru tam kıvamında, malzemeler taze. 25 dakikada kapımda oldu ve sıcacıktı. Kesinlikle tekrar sipariş vereceğim!",
    likes: 24,
    helpful: true,
    images: ["/images/reviews/review1-1.jpg", "/images/reviews/review1-2.jpg"],
    orderDetails: {
      items: ["Margherita Pizza", "Coca Cola"],
      total: "₺124.99"
    }
  },
  {
    id: 2,
    user: {
      name: "Ayşe Demir",
      avatar: "/images/avatars/user2.jpg",
      verified: true
    },
    rating: 4,
    date: "2024-01-14",
    title: "Kaliteli malzemeler, lezzetli pizza",
    content: "Pepperoni pizzası gerçekten çok iyiydi. Malzemeler kaliteli ve taze. Sadece teslimat biraz geç oldu ama o da yoğun saatte olduğu için normal. Genel olarak çok memnunum.",
    likes: 18,
    helpful: false,
    images: ["/images/reviews/review2-1.jpg"],
    orderDetails: {
      items: ["Pepperoni Pizza", "Garlic Bread"],
      total: "₺144.98"
    }
  },
  {
    id: 3,
    user: {
      name: "Mehmet Kaya",
      avatar: "/images/avatars/user3.jpg",
      verified: false
    },
    rating: 5,
    date: "2024-01-13",
    title: "Ailemle birlikte çok beğendik!",
    content: "4 kişilik ailemle birlikte sipariş verdik. Supreme pizza ve BBQ Chicken pizza aldık. Her ikisi de muhteşemdi! Çocuklarım da çok beğendi. Porsiyonlar da büyüktü, doyurucuydu.",
    likes: 31,
    helpful: true,
    images: ["/images/reviews/review3-1.jpg", "/images/reviews/review3-2.jpg", "/images/reviews/review3-3.jpg"],
    orderDetails: {
      items: ["Supreme Pizza", "BBQ Chicken Pizza", "Caesar Salad"],
      total: "₺274.97"
    }
  },
  {
    id: 4,
    user: {
      name: "Fatma Özkan",
      avatar: "/images/avatars/user4.jpg",
      verified: true
    },
    rating: 3,
    date: "2024-01-12",
    title: "Orta karar bir deneyim",
    content: "Veggie Supreme pizzası aldım. Lezzet iyiydi ama biraz daha fazla sebze olabilirdi. Teslimat zamanında geldi ama pizza biraz soğuktu. Genel olarak fena değil ama daha iyi olabilir.",
    likes: 7,
    helpful: false,
    images: ["/images/reviews/review4-1.jpg"],
    orderDetails: {
      items: ["Veggie Supreme Pizza"],
      total: "₺94.99"
    }
  },
  {
    id: 5,
    user: {
      name: "Can Arslan",
      avatar: "/images/avatars/user5.jpg",
      verified: true
    },
    rating: 5,
    date: "2024-01-11",
    title: "En sevdiğim pizza yerinden!",
    content: "Pizza Krallığı'ndan sürekli sipariş veriyorum. Kalite hiç düşmüyor, her seferinde aynı lezzet. Özellikle Buffalo Wings'leri de çok iyi. Hızlı teslimat ve sıcak yemek. Teşekkürler!",
    likes: 42,
    helpful: true,
    images: ["/images/reviews/review5-1.jpg", "/images/reviews/review5-2.jpg"],
    orderDetails: {
      items: ["Margherita Pizza", "Buffalo Wings", "Chocolate Lava Cake"],
      total: "₺204.97"
    }
  },
  {
    id: 6,
    user: {
      name: "Zeynep Çelik",
      avatar: "/images/avatars/user6.jpg",
      verified: false
    },
    rating: 4,
    date: "2024-01-10",
    title: "Güzel bir deneyim",
    content: "İlk kez denedim ve beğendim. Pizza hamuru çok iyi, malzemeler taze. Sadece biraz daha fazla peynir olabilirdi. Teslimat da hızlıydı. Tekrar sipariş veririm.",
    likes: 15,
    helpful: false,
    images: ["/images/reviews/review6-1.jpg"],
    orderDetails: {
      items: ["Pepperoni Pizza", "Tiramisu"],
      total: "₺139.98"
    }
  }
];

const ratingStats = {
  average: 4.6,
  total: 1247,
  distribution: {
    5: 789,
    4: 312,
    3: 89,
    2: 34,
    1: 23
  }
};

const filters = [
  { id: 'all', name: 'Tümü', count: reviews.length },
  { id: '5', name: '5 Yıldız', count: ratingStats.distribution[5] },
  { id: '4', name: '4 Yıldız', count: ratingStats.distribution[4] },
  { id: '3', name: '3 Yıldız', count: ratingStats.distribution[3] },
  { id: '2', name: '2 Yıldız', count: ratingStats.distribution[2] },
  { id: '1', name: '1 Yıldız', count: ratingStats.distribution[1] }
];

export default function Reviews() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [showReviewForm, setShowReviewForm] = useState(false);

  const filteredReviews = reviews.filter(review => {
    if (selectedFilter === 'all') return true;
    return review.rating === parseInt(selectedFilter);
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.date) - new Date(a.date);
      case 'rating':
        return b.rating - a.rating;
      case 'helpful':
        return b.likes - a.likes;
      default:
        return new Date(b.date) - new Date(a.date);
    }
  });

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getRatingPercentage = (rating) => {
    return (ratingStats.distribution[rating] / ratingStats.total) * 100;
  };

  return (
    <>
      <Head>
        <title>Müşteri Yorumları - Pizza Krallığı</title>
        <meta name="description" content="Pizza Krallığı müşteri yorumları ve değerlendirmeleri. Gerçek müşteri deneyimlerini okuyun!" />
        <meta name="keywords" content="pizza yorumları, müşteri değerlendirmeleri, pizza krallığı yorumları" />
        <meta property="og:title" content="Müşteri Yorumları - Pizza Krallığı" />
        <meta property="og:description" content="Pizza Krallığı müşteri yorumları ve değerlendirmeleri. Gerçek müşteri deneyimlerini okuyun!" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Müşteri Yorumları - Pizza Krallığı" />
        <meta name="twitter:description" content="Pizza Krallığı müşteri yorumları ve değerlendirmeleri. Gerçek müşteri deneyimlerini okuyun!" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <Navigation />
        
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-orange-600 to-red-600 text-white py-20 overflow-hidden">
          <RoyalParallaxScene />
          <div className="container mx-auto px-4 relative z-20">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                ⭐ Müşteri Yorumları
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Gerçek müşteri deneyimlerini okuyun ve kendi yorumunuzu paylaşın
              </p>
              
              {/* Overall Rating */}
              <div className="relative z-10 max-w-2xl mx-auto bg-white/20 backdrop-blur-sm rounded-2xl p-8">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="text-6xl font-bold">{ratingStats.average}</div>
                  <div className="text-left">
                    <div className="flex gap-1 mb-2">
                      {renderStars(Math.round(ratingStats.average))}
                    </div>
                    <div className="text-sm opacity-90">
                      {ratingStats.total} değerlendirme
                    </div>
                  </div>
                </div>
                
                {/* Rating Distribution */}
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center gap-3">
                      <div className="flex gap-1 w-20">
                        <span className="text-sm">{rating}</span>
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      </div>
                      <div className="flex-1 bg-white/30 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{ width: `${getRatingPercentage(rating)}%` }}
                        ></div>
                      </div>
                      <div className="text-sm w-12 text-right">
                        {ratingStats.distribution[rating]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between mb-8">
            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedFilter === filter.id
                      ? 'bg-orange-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-orange-50 border border-gray-200'
                  }`}
                >
                  {filter.name} ({filter.count})
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="recent">En Yeni</option>
                <option value="rating">En Yüksek Puan</option>
                <option value="helpful">En Faydalı</option>
              </select>

              <button
                onClick={() => setShowReviewForm(true)}
                className="bg-orange-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors"
              >
                Yorum Yap
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="container mx-auto px-4 pb-16">
          <div className="space-y-6">
            {sortedReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300"
              >
                {/* Review Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                      {review.user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{review.user.name}</h3>
                        {review.user.verified && (
                          <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-medium">
                            Doğrulanmış
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <div className="flex gap-1">
                          {renderStars(review.rating)}
                        </div>
                        <span>•</span>
                        <span>{new Date(review.date).toLocaleDateString('tr-TR')}</span>
                      </div>
                    </div>
                  </div>
                  {review.helpful && (
                    <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs font-medium">
                      Faydalı
                    </span>
                  )}
                </div>

                {/* Review Content */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{review.content}</p>
                </div>

                {/* Review Images */}
                {review.images && review.images.length > 0 && (
                  <div className="flex gap-2 mb-4 overflow-x-auto">
                    {review.images.map((image, index) => (
                      <div
                        key={index}
                        className="w-20 h-20 bg-gradient-to-br from-orange-200 to-red-200 rounded-lg flex items-center justify-center flex-shrink-0"
                      >
                        <span className="text-orange-600 text-xs">📷</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Order Details */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="text-sm text-gray-600 mb-1">Sipariş:</div>
                  <div className="text-sm font-medium">
                    {review.orderDetails.items.join(', ')} - {review.orderDetails.total}
                  </div>
                </div>

                {/* Review Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 text-gray-500 hover:text-orange-600 transition-colors">
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-sm">{review.likes}</span>
                    </button>
                    <button className="flex items-center gap-1 text-gray-500 hover:text-orange-600 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">Yanıtla</span>
                    </button>
                    <button className="flex items-center gap-1 text-gray-500 hover:text-orange-600 transition-colors">
                      <Share2 className="w-4 h-4" />
                      <span className="text-sm">Paylaş</span>
                    </button>
                  </div>
                  <button className="flex items-center gap-1 text-gray-500 hover:text-red-600 transition-colors">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">Beğen</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {sortedReviews.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">⭐</div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                Yorum bulunamadı
              </h3>
              <p className="text-gray-500">
                Seçilen filtrelere uygun yorum bulunamadı.
              </p>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
}


