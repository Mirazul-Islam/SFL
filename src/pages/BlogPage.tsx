import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Calendar, 
  User, 
  ArrowRight, 
  Tag, 
  Clock, 
  Heart,
  Waves,
  Users,
  Trophy,
  Camera,
  MapPin,
  Star
} from 'lucide-react';

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Posts', count: 12 },
    { id: 'activities', name: 'Activities', count: 4 },
    { id: 'community', name: 'Community', count: 3 },
    { id: 'tips', name: 'Tips & Guides', count: 3 },
    { id: 'events', name: 'Events', count: 2 }
  ];

  const blogPosts = [
    {
      id: 1,
      title: "The Ultimate Guide to Water Soccer: Tips for Beginners",
      excerpt: "Discover the exciting world of water soccer! Learn the basics, safety tips, and strategies to make the most of your first water soccer experience at Splash Fun Land.",
      content: "Water soccer combines the thrill of traditional soccer with the unique challenge of playing on water. Our inflatable water fields provide a safe, fun environment for players of all skill levels...",
      author: "Sarah Johnson",
      date: "2025-06-15",
      readTime: "5 min read",
      category: "activities",
      tags: ["water soccer", "beginners", "tips"],
      image: "/WhatsApp Image 2025-06-14 at 23.08.29_527e2ba5.jpg",
      featured: true
    },
    {
      id: 2,
      title: "Community Impact: How Your Visit Supports Local Initiatives",
      excerpt: "Learn how every booking at Splash Fun Land directly contributes to community programs, youth development, and local nonprofit initiatives through our partnership with Wisegroup.",
      content: "At Splash Fun Land, we believe in giving back to our community. Every dollar spent at our facility helps fund important local initiatives...",
      author: "Mike Chen",
      date: "2025-06-10",
      readTime: "4 min read",
      category: "community",
      tags: ["community", "nonprofit", "impact"],
      image: "/WhatsApp Image 2025-06-16 at 17.44.19_e75283ed.jpg",
      featured: false
    },
    {
      id: 3,
      title: "Beach Soccer vs. Regular Soccer: What's the Difference?",
      excerpt: "Explore the unique aspects of beach soccer that make it an exciting alternative to traditional soccer. From sand dynamics to game rules, discover what makes beach soccer special.",
      content: "Beach soccer offers a completely different experience from regular soccer. The sand surface changes everything from ball control to player movement...",
      author: "Alex Rodriguez",
      date: "2025-06-08",
      readTime: "6 min read",
      category: "activities",
      tags: ["beach soccer", "comparison", "sports"],
      image: "/WhatsApp Image 2025-06-14 at 23.08.43_b5754562.jpg",
      featured: false
    },
  ];

  const filteredPosts = selectedCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'activities': return <Waves className="w-4 h-4" />;
      case 'community': return <Heart className="w-4 h-4" />;
      case 'tips': return <Star className="w-4 h-4" />;
      case 'events': return <Trophy className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'activities': return 'bg-blue-100 text-blue-800';
      case 'community': return 'bg-green-100 text-green-800';
      case 'tips': return 'bg-yellow-100 text-yellow-800';
      case 'events': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
              <BookOpen className="w-12 h-12" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Splash Fun Land Blog</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Discover tips, stories, and insights about water sports, community impact, and making the most 
            of your recreational experiences in Halifax, Nova Scotia.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                }`}
              >
                {getCategoryIcon(category.id)}
                <span>{category.name}</span>
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && selectedCategory === 'all' && (
        <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Article</h2>
              <p className="text-xl text-gray-600">Our latest and most popular content</p>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-64 lg:h-full">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-500 text-white">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </span>
                  </div>
                </div>
                
                <div className="p-8 lg:p-12">
                  <div className="flex items-center space-x-4 mb-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(featuredPost.category)}`}>
                      {getCategoryIcon(featuredPost.category)}
                      <span className="ml-1 capitalize">{featuredPost.category}</span>
                    </span>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(featuredPost.date).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                    {featuredPost.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{featuredPost.author}</p>
                        <div className="flex items-center text-gray-500 text-sm">
                          <Clock className="w-3 h-3 mr-1" />
                          {featuredPost.readTime}
                        </div>
                      </div>
                    </div>
                    
                    <Link
                      to={`/blog/${featuredPost.id}`}
                      className="inline-flex items-center px-6 py-3 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors"
                    >
                      Read More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Blog Posts Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {selectedCategory === 'all' ? 'Latest Articles' : `${categories.find(c => c.id === selectedCategory)?.name} Articles`}
            </h2>
            <p className="text-xl text-gray-600">
              {selectedCategory === 'all' 
                ? 'Explore our collection of articles, tips, and community stories'
                : `Discover articles about ${categories.find(c => c.id === selectedCategory)?.name.toLowerCase()}`
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border border-gray-100"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                      {getCategoryIcon(post.category)}
                      <span className="ml-1 capitalize">{post.category}</span>
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center text-gray-500 text-sm">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Clock className="w-4 h-4 mr-1" />
                      {post.readTime}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-primary-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{post.author}</span>
                    </div>

                    <Link
                      to={`/blog/${post.id}`}
                      className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm group-hover:translate-x-1 transition-transform"
                    >
                      Read More
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>

                  {post.tags && post.tags.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                          >
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600">
                No articles match the selected category. Try selecting a different category or check back later for new content.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-gradient-to-br from-primary-500 to-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Stay Updated</h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Subscribe to our newsletter for the latest articles, activity tips, community updates, 
            and special offers delivered straight to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-secondary-500 focus:outline-none"
            />
            <button className="px-6 py-3 bg-secondary-500 hover:bg-secondary-600 text-white font-semibold rounded-lg transition-colors">
              Subscribe
            </button>
          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold rounded-full transition-colors border border-white/30"
            >
              <Camera className="w-5 h-5 mr-2" />
              Share Your Story
            </Link>
            <Link
              to="/book"
              className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold rounded-full transition-colors border border-white/30"
            >
              <MapPin className="w-5 h-5 mr-2" />
              Visit Us Today
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;