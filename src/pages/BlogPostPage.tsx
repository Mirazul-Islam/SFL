import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { 
  Calendar, 
  User, 
  Clock, 
  Tag, 
  ArrowLeft, 
  Share2, 
  BookOpen,
  Heart,
  MessageCircle,
  Waves,
  Star,
  Trophy,
  Copy,
  Facebook,
  Twitter,
  Linkedin
} from 'lucide-react';

const BlogPostPage = () => {
  const { id } = useParams<{ id: string }>();

  // Blog posts data (in a real app, this would come from an API or CMS)
  const blogPosts = [
    {
      id: 1,
      title: "The Ultimate Guide to Water Soccer: Tips for Beginners",
      excerpt: "Discover the exciting world of water soccer! Learn the basics, safety tips, and strategies to make the most of your first water soccer experience at Splash Fun Land.",
      content: `
        <p>Water soccer combines the thrill of traditional soccer with the unique challenge of playing on water. Our inflatable water fields provide a safe, fun environment for players of all skill levels to experience this exciting sport.</p>

        <h2>What Makes Water Soccer Special?</h2>
        <p>Unlike traditional soccer, water soccer is played on specially designed inflatable fields filled with shallow water. This creates a completely different dynamic that challenges players in new and exciting ways:</p>
        
        <ul>
          <li><strong>Reduced Impact:</strong> The water cushions falls and reduces the risk of injury</li>
          <li><strong>Enhanced Challenge:</strong> Moving through water requires more effort and strategy</li>
          <li><strong>Cooling Effect:</strong> Perfect for hot summer days in Halifax</li>
          <li><strong>Unique Experience:</strong> Unlike anything you've played before</li>
        </ul>

        <h2>Getting Started: Your First Game</h2>
        <p>If you're new to water soccer, here are some essential tips to help you get started:</p>

        <h3>1. Proper Footwear</h3>
        <p>Wear water shoes or cleats with good grip. The inflatable surface can be slippery, so proper footwear is essential for safety and performance.</p>

        <h3>2. Start Slow</h3>
        <p>Don't try to run at full speed immediately. Get a feel for how the water affects your movement and balance before increasing your pace.</p>

        <h3>3. Focus on Ball Control</h3>
        <p>The water will affect how the ball moves. Practice short passes and gentle touches to maintain control.</p>

        <h3>4. Stay Hydrated</h3>
        <p>Even though you're surrounded by water, you'll still sweat during the activity. Bring plenty of water to drink.</p>

        <h2>Safety First</h2>
        <p>At Splash Fun Land, safety is our top priority. Our water soccer fields are designed with safety in mind:</p>
        
        <ul>
          <li>Shallow water depth (typically 6-12 inches)</li>
          <li>Professional supervision at all times</li>
          <li>Safety briefing before each session</li>
          <li>First aid trained staff on site</li>
          <li>Regular equipment inspections</li>
        </ul>

        <h2>Strategies for Success</h2>
        <p>Once you're comfortable with the basics, try these strategies to improve your water soccer game:</p>

        <h3>Team Communication</h3>
        <p>Communication is even more important in water soccer. The water makes movement slower and more deliberate, so clear communication helps coordinate plays.</p>

        <h3>Positioning</h3>
        <p>Stay spread out and use the entire field. The water makes it harder to change direction quickly, so good positioning is crucial.</p>

        <h3>Short Passes</h3>
        <p>Long passes are more difficult in water soccer. Focus on short, accurate passes to maintain possession.</p>

        <h2>What to Expect at Splash Fun Land</h2>
        <p>When you book a water soccer session with us, here's what you can expect:</p>
        
        <ul>
          <li><strong>Equipment Provided:</strong> We supply the soccer ball and goals</li>
          <li><strong>Safety Briefing:</strong> 5-minute orientation before you start</li>
          <li><strong>Professional Supervision:</strong> Trained staff monitor all activities</li>
          <li><strong>Changing Facilities:</strong> Clean facilities to change before and after</li>
          <li><strong>Fresh Water:</strong> Our fields use clean, treated water</li>
        </ul>

        <h2>Booking Your Water Soccer Experience</h2>
        <p>Ready to try water soccer? We offer two field sizes to accommodate different group sizes:</p>
        
        <ul>
          <li><strong>Water Soccer Field 1:</strong> Perfect for 5v5 games (max 12 players) - $125/hour</li>
          <li><strong>Water Soccer Field 2:</strong> Ideal for 3v3 games (max 8 players) - $100/hour</li>
        </ul>

        <p>Both fields can be booked for 1-6 hours, giving you plenty of time to enjoy this unique sport. Remember to book at least 4 hours in advance!</p>

        <h2>Join the Water Soccer Community</h2>
        <p>Water soccer is more than just a sport - it's a community. Many of our regular players have formed teams and friendships that extend beyond the field. Whether you're looking for casual fun or competitive play, you'll find your place in our water soccer community.</p>

        <p>Ready to dive in? Book your water soccer experience today and discover why this unique sport is taking Halifax by storm!</p>
      `,
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
      content: `
        <p>At Splash Fun Land, we believe that recreation and community service go hand in hand. Every dollar you spend at our facility directly supports meaningful community initiatives through our partnership with Wisegroup Nonprofit Association.</p>

        <h2>Our Unique Partnership Model</h2>
        <p>Splash Fun Land is operated by Wise_SFL Corporation in support of Wisegroup Nonprofit Association. This innovative partnership model ensures that your fun day out contributes to important community work:</p>

        <ul>
          <li><strong>Direct Funding:</strong> Revenue from activities funds community programs</li>
          <li><strong>Sustainable Support:</strong> Creates ongoing funding rather than one-time donations</li>
          <li><strong>Community Engagement:</strong> Brings people together while supporting good causes</li>
          <li><strong>Local Impact:</strong> All funds support Halifax and Nova Scotia communities</li>
        </ul>

        <h2>Programs We Support</h2>
        <p>Your visit to Splash Fun Land helps fund a variety of community initiatives:</p>

        <h3>Therapy and Wellness Programs</h3>
        <p>We support mental health and wellness initiatives that provide counseling, support groups, and therapeutic activities for community members in need.</p>

        <h3>Youth Leadership Development</h3>
        <p>Our funding helps develop the next generation of community leaders through mentorship programs, leadership workshops, and skill-building activities.</p>

        <h3>Community Cleanup Initiatives</h3>
        <p>Environmental stewardship is important to us. We support regular community cleanup events that keep Halifax beautiful and environmentally healthy.</p>

        <h3>Public Speaking and Confidence Building</h3>
        <p>We fund programs that help community members develop communication skills, build confidence, and find their voice in public settings.</p>

        <h3>Educational Workshops and Seminars</h3>
        <p>From financial literacy to job skills training, we support educational programs that help community members improve their lives and opportunities.</p>

        <h3>Volunteer Coordination and Support</h3>
        <p>We help organize and support volunteer efforts throughout the Halifax region, connecting people with opportunities to give back.</p>

        <h2>Real Impact Stories</h2>
        <p>Here are some examples of how your visits have made a real difference:</p>

        <blockquote>
          <p>"The youth leadership program helped me develop confidence and communication skills that landed me my first job. I'm now mentoring other young people in the program." - Alex, Program Graduate</p>
        </blockquote>

        <blockquote>
          <p>"Our community cleanup events have removed over 2,000 pounds of litter from Halifax parks and waterways this year alone." - Environmental Coordinator</p>
        </blockquote>

        <blockquote>
          <p>"The therapy programs provided crucial support during a difficult time in my life. Knowing this support exists makes our community stronger." - Community Member</p>
        </blockquote>

        <h2>How Your Booking Makes a Difference</h2>
        <p>Every activity you book contributes to our community fund:</p>

        <ul>
          <li><strong>Beach Soccer Session:</strong> Funds 2 hours of youth mentoring</li>
          <li><strong>Water Soccer Game:</strong> Supports 1 therapy session for someone in need</li>
          <li><strong>Group Event:</strong> Funds a community cleanup event</li>
          <li><strong>Summer Camp Week:</strong> Supports leadership development for 5 youth</li>
        </ul>

        <h2>Transparency and Accountability</h2>
        <p>We believe in complete transparency about how community funds are used:</p>

        <ul>
          <li>Quarterly reports on fund allocation</li>
          <li>Regular updates on program outcomes</li>
          <li>Community meetings to discuss priorities</li>
          <li>Open books policy for community fund usage</li>
        </ul>

        <h2>Get More Involved</h2>
        <p>Want to do more than just visit? Here are ways to get more involved:</p>

        <h3>Volunteer Opportunities</h3>
        <p>Join our volunteer network and participate in community events, cleanup days, and program support.</p>

        <h3>Program Partnerships</h3>
        <p>If you represent an organization that could benefit from our community programs, reach out to discuss partnership opportunities.</p>

        <h3>Spread the Word</h3>
        <p>Share our story with friends and family. The more people who know about our community impact model, the greater difference we can make together.</p>

        <h2>Looking Forward</h2>
        <p>As we continue to grow, so does our ability to support the community. Our goals for the coming year include:</p>

        <ul>
          <li>Expanding youth programs to reach 200 more young people</li>
          <li>Adding mental health support services</li>
          <li>Launching a community garden project</li>
          <li>Creating job training partnerships with local businesses</li>
        </ul>

        <p>Every time you choose Splash Fun Land for your recreational activities, you're not just having fun - you're investing in a stronger, more connected community. Thank you for being part of our mission to make Halifax a better place for everyone.</p>

        <p>Ready to make a difference while having fun? Book your next activity and join our community impact movement!</p>
      `,
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
      content: `
        <p>Beach soccer offers a completely different experience from regular soccer. While both sports share the same basic objective - getting the ball into the opponent's goal - the similarities largely end there. Let's explore what makes beach soccer such a unique and exciting sport.</p>

        <h2>The Playing Surface: Sand vs. Grass</h2>
        <p>The most obvious difference is the playing surface. Beach soccer is played on sand, which fundamentally changes every aspect of the game:</p>

        <h3>Sand Dynamics</h3>
        <ul>
          <li><strong>Slower Movement:</strong> Running in sand requires more energy and is naturally slower</li>
          <li><strong>Softer Landings:</strong> Falls and tackles are less impactful on sand</li>
          <li><strong>Ball Behavior:</strong> The ball moves differently on sand, often stopping more quickly</li>
          <li><strong>Unpredictable Bounces:</strong> Sand creates irregular bounces that add excitement</li>
        </ul>

        <h3>Physical Demands</h3>
        <p>Playing on sand is significantly more demanding physically:</p>
        <ul>
          <li>Burns 1.5-2x more calories than grass soccer</li>
          <li>Strengthens stabilizer muscles</li>
          <li>Improves balance and coordination</li>
          <li>Provides a full-body workout</li>
        </ul>

        <h2>Game Rules and Structure</h2>
        <p>Beach soccer has its own set of rules that differ from traditional soccer:</p>

        <h3>Team Size</h3>
        <ul>
          <li><strong>Beach Soccer:</strong> 5 players per team (including goalkeeper)</li>
          <li><strong>Regular Soccer:</strong> 11 players per team (including goalkeeper)</li>
        </ul>

        <h3>Game Duration</h3>
        <ul>
          <li><strong>Beach Soccer:</strong> Three 12-minute periods</li>
          <li><strong>Regular Soccer:</strong> Two 45-minute halves</li>
        </ul>

        <h3>Substitutions</h3>
        <ul>
          <li><strong>Beach Soccer:</strong> Unlimited substitutions</li>
          <li><strong>Regular Soccer:</strong> Limited substitutions (typically 3-5)</li>
        </ul>

        <h3>Offside Rule</h3>
        <ul>
          <li><strong>Beach Soccer:</strong> No offside rule</li>
          <li><strong>Regular Soccer:</strong> Offside rule applies</li>
        </ul>

        <h2>Playing Style Differences</h2>
        <p>The different environment creates distinct playing styles:</p>

        <h3>Beach Soccer Style</h3>
        <ul>
          <li>More individual skill and creativity</li>
          <li>Emphasis on aerial play and acrobatics</li>
          <li>Quick, short passes</li>
          <li>Spectacular overhead kicks and bicycle kicks</li>
          <li>Fast-paced, high-scoring games</li>
        </ul>

        <h3>Regular Soccer Style</h3>
        <ul>
          <li>More tactical and strategic play</li>
          <li>Emphasis on team formations</li>
          <li>Longer passing combinations</li>
          <li>More running and endurance-based</li>
          <li>Lower-scoring, more defensive games</li>
        </ul>

        <h2>Skills Development</h2>
        <p>Both sports develop different skills:</p>

        <h3>Beach Soccer Skills</h3>
        <ul>
          <li><strong>Ball Control:</strong> Improved first touch and close control</li>
          <li><strong>Creativity:</strong> Encourages improvisation and flair</li>
          <li><strong>Aerial Ability:</strong> Develops heading and acrobatic skills</li>
          <li><strong>Balance:</strong> Improves stability and core strength</li>
          <li><strong>Quick Thinking:</strong> Fast-paced game requires rapid decisions</li>
        </ul>

        <h3>Regular Soccer Skills</h3>
        <ul>
          <li><strong>Tactical Awareness:</strong> Understanding of formations and positioning</li>
          <li><strong>Endurance:</strong> Cardiovascular fitness and stamina</li>
          <li><strong>Passing Range:</strong> Long and short passing accuracy</li>
          <li><strong>Team Play:</strong> Coordination with multiple teammates</li>
          <li><strong>Defensive Skills:</strong> Organized defending and marking</li>
        </ul>

        <h2>Equipment Differences</h2>
        <p>The equipment used in each sport reflects their different demands:</p>

        <h3>Beach Soccer Equipment</h3>
        <ul>
          <li><strong>Footwear:</strong> Barefoot or sand socks (no cleats)</li>
          <li><strong>Clothing:</strong> Lightweight, quick-dry materials</li>
          <li><strong>Ball:</strong> Slightly softer, designed for sand play</li>
          <li><strong>Goals:</strong> Smaller than regular soccer goals</li>
        </ul>

        <h3>Regular Soccer Equipment</h3>
        <ul>
          <li><strong>Footwear:</strong> Cleats or turf shoes</li>
          <li><strong>Clothing:</strong> Traditional soccer kit</li>
          <li><strong>Ball:</strong> Standard FIFA-approved soccer ball</li>
          <li><strong>Goals:</strong> Standard 8x24 foot goals</li>
        </ul>

        <h2>Accessibility and Inclusivity</h2>
        <p>Beach soccer offers unique accessibility advantages:</p>

        <ul>
          <li><strong>Lower Impact:</strong> Easier on joints due to sand surface</li>
          <li><strong>Skill Over Speed:</strong> Technical ability matters more than pure athleticism</li>
          <li><strong>Shorter Games:</strong> Less demanding time commitment</li>
          <li><strong>Smaller Teams:</strong> Easier to organize games</li>
          <li><strong>Fun Factor:</strong> More relaxed, enjoyable atmosphere</li>
        </ul>

        <h2>Which Should You Choose?</h2>
        <p>Both sports offer unique benefits:</p>

        <h3>Choose Beach Soccer If You:</h3>
        <ul>
          <li>Want a fun, relaxed soccer experience</li>
          <li>Enjoy creative, skillful play</li>
          <li>Prefer shorter, more intense games</li>
          <li>Want a great workout with lower impact</li>
          <li>Love spectacular goals and acrobatic moves</li>
        </ul>

        <h3>Choose Regular Soccer If You:</h3>
        <ul>
          <li>Enjoy tactical, strategic gameplay</li>
          <li>Want to develop traditional soccer skills</li>
          <li>Prefer longer, more endurance-based games</li>
          <li>Enjoy team formations and organized play</li>
          <li>Want to play competitively in leagues</li>
        </ul>

        <h2>Experience Beach Soccer at Splash Fun Land</h2>
        <p>Ready to try beach soccer? Our premium sand field offers the perfect introduction to this exciting sport:</p>

        <ul>
          <li><strong>Professional-grade sand surface</strong></li>
          <li><strong>Regulation field markings</strong></li>
          <li><strong>Quality goal posts included</strong></li>
          <li><strong>Equipment provided</strong></li>
          <li><strong>Professional supervision</strong></li>
        </ul>

        <p>Whether you're a soccer veteran looking for a new challenge or a beginner wanting to try something fun and different, beach soccer offers an unforgettable experience. Book your session today and discover why beach soccer is capturing hearts around the world!</p>
      `,
      author: "Alex Rodriguez",
      date: "2025-06-08",
      readTime: "6 min read",
      category: "activities",
      tags: ["beach soccer", "comparison", "sports"],
      image: "/WhatsApp Image 2025-06-14 at 23.08.43_b5754562.jpg",
      featured: false
    }
    // Add more blog posts as needed...
  ];

  const post = blogPosts.find(p => p.id === parseInt(id || '0'));

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

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

  const relatedPosts = blogPosts
    .filter(p => p.id !== post.id && p.category === post.category)
    .slice(0, 3);

  // Share functionality
  const handleShare = async () => {
    const shareData = {
      title: post.title,
      text: post.excerpt,
      url: window.location.href,
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy URL to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Article URL copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Final fallback: copy URL to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Article URL copied to clipboard!');
      } catch (clipboardError) {
        console.error('Clipboard error:', clipboardError);
        alert('Unable to share. Please copy the URL manually.');
      }
    }
  };

  const shareOnSocial = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post.title);
    const text = encodeURIComponent(post.excerpt);

    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-gray-800 to-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/blog"
            className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>

          <div className="flex items-center space-x-4 mb-6">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(post.category)}`}>
              {getCategoryIcon(post.category)}
              <span className="ml-1 capitalize">{post.category}</span>
            </span>
            <div className="flex items-center text-white/70 text-sm">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(post.date).toLocaleDateString()}
            </div>
            <div className="flex items-center text-white/70 text-sm">
              <Clock className="w-4 h-4 mr-1" />
              {post.readTime}
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            {post.title}
          </h1>

          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white">{post.author}</p>
                <p className="text-white/70 text-sm">Author</p>
              </div>
            </div>

            {/* Enhanced Share Button with Dropdown */}
            <div className="relative group">
              <button 
                onClick={handleShare}
                className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-lg transition-colors"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
              
              {/* Social Share Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <div className="p-2">
                  <button
                    onClick={() => shareOnSocial('facebook')}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors"
                  >
                    <Facebook className="w-4 h-4" />
                    <span className="text-sm">Share on Facebook</span>
                  </button>
                  <button
                    onClick={() => shareOnSocial('twitter')}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                    <span className="text-sm">Share on Twitter</span>
                  </button>
                  <button
                    onClick={() => shareOnSocial('linkedin')}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span className="text-sm">Share on LinkedIn</span>
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(window.location.href);
                        alert('Link copied to clipboard!');
                      } catch (error) {
                        console.error('Copy failed:', error);
                      }
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    <span className="text-sm">Copy Link</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="py-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-16 mb-20 sm:mb-24">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-96 object-cover rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-0 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="prose prose-lg max-w-none">
            <div 
              className="article-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-3">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Author Bio - Enhanced spacing */}
          <div className="mt-16 sm:mt-20 pt-8 sm:pt-12 border-t border-gray-200">
            <div className="flex items-start space-x-4 sm:space-x-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-8 h-8 sm:w-10 sm:h-10 text-primary-600" />
              </div>
              <div className="flex-1 pt-2 sm:pt-3">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">{post.author}</h3>
                <p className="text-gray-600 leading-relaxed">
                  Contributing author at Splash Fun Land. Passionate about water sports, community building, 
                  and sharing knowledge to help others make the most of their recreational experiences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Related Articles</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.id}`}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(relatedPost.category)}`}>
                        {getCategoryIcon(relatedPost.category)}
                        <span className="ml-1 capitalize">{relatedPost.category}</span>
                      </span>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Clock className="w-3 h-3 mr-1" />
                        {relatedPost.readTime}
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {relatedPost.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-500 to-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience It Yourself?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Don't just read about it - come and experience the fun at Splash Fun Land! 
            Book your activity today and create your own amazing memories.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/book"
              className="inline-flex items-center px-8 py-4 bg-secondary-500 hover:bg-secondary-600 text-white font-bold rounded-full transition-colors shadow-lg hover:shadow-xl"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Book Now
            </Link>
            <Link
              to="/blog"
              className="inline-flex items-center px-8 py-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold rounded-full transition-colors border border-white/30"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              More Articles
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPostPage;