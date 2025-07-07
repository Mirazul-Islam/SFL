import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  Eye, 
  X, 
  CheckCircle, 
  AlertCircle,
  LogOut,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  Clock,
  MapPin,
  BarChart3,
  TrendingUp,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  RefreshCw,
  Calendar as CalendarIcon,
  Activity,
  Layers,
  PieChart,
  Plus,
  ChevronLeft,
  ChevronRight,
  Check,
  Info
} from 'lucide-react';
import { supabase, Zone, Booking, convertTo12Hour, convertTo24Hour, calculateEndTime } from '../lib/supabase';
import { format, addDays, subDays, parseISO, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isToday, isBefore } from 'date-fns';

interface AdminStats {
  totalBookings: number;
  todayBookings: number;
  totalRevenue: number;
  activeZones: number;
}

interface AnalyticsData {
  total_visitors: number;
  total_page_views: number;
  unique_visitors: number;
  bounce_rate: number;
  avg_session_duration: number;
  top_pages: Array<{ page_url: string; views: number }>;
  device_breakdown: Array<{ device_type: string; count: number }>;
  browser_breakdown: Array<{ browser: string; count: number }>;
  daily_visitors: Array<{ date: string; visitors: number; page_views: number }>;
}

interface RealtimeVisitor {
  session_id: string;
  ip_address: string;
  country: string;
  city: string;
  device_type: string;
  browser: string;
  landing_page: string;
  created_at: string;
  page_views: Array<{
    page_url: string;
    created_at: string;
  }>;
}

interface NewBookingData {
  zone_id: string;
  date: string;
  start_time: string;
  end_time: string;
  duration: number;
  customer_info: {
    name: string;
    email: string;
    phone: string;
    groupSize: string;
    specialRequests?: string;
  };
  total_cost: number;
  status: string;
}

const AdminPage = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalBookings: 0,
    todayBookings: 0,
    totalRevenue: 0,
    activeZones: 0
  });
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [activeTab, setActiveTab] = useState('bookings');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState('30days');
  const [realtimeVisitors, setRealtimeVisitors] = useState<RealtimeVisitor[]>([]);
  const [realtimeLoading, setRealtimeLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState('');
  
  // Calendar view state
  const [calendarView, setCalendarView] = useState<'week' | 'day'>('week');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showNewBookingModal, setShowNewBookingModal] = useState(false);
  const [newBookingData, setNewBookingData] = useState<Partial<NewBookingData>>({
    zone_id: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    start_time: '10:00:00',
    duration: 1,
    customer_info: {
      name: '',
      email: '',
      phone: '',
      groupSize: '1-2',
      specialRequests: ''
    },
    total_cost: 0,
    status: 'confirmed'
  });
  const [calendarActiveTab, setCalendarActiveTab] = useState<'bookings' | 'new'>('bookings');
  const [calendarError, setCalendarError] = useState('');

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
      fetchZones();
      if (activeTab === 'analytics') {
        fetchAnalytics();
        fetchRealtimeVisitors();
      }
    }
  }, [isAuthenticated, activeTab, analyticsTimeframe]);

  // Update end time when start time or duration changes
  useEffect(() => {
    if (newBookingData.start_time && newBookingData.duration) {
      const startTime12h = convertTo12Hour(newBookingData.start_time);
      const endTime12h = calculateEndTime(startTime12h, newBookingData.duration);
      const endTime24h = convertTo24Hour(endTime12h);
      
      setNewBookingData(prev => ({
        ...prev,
        end_time: endTime24h
      }));
    }
  }, [newBookingData.start_time, newBookingData.duration]);

  // Calculate cost when zone or duration changes
  useEffect(() => {
    if (newBookingData.zone_id && newBookingData.duration) {
      const selectedZone = zones.find(z => z.id === newBookingData.zone_id);
      if (selectedZone) {
        const cost = selectedZone.hourly_rate * newBookingData.duration;
        setNewBookingData(prev => ({
          ...prev,
          total_cost: cost
        }));
      }
    }
  }, [newBookingData.zone_id, newBookingData.duration, zones]);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/.netlify/functions/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'check' })
      });

      if (response.ok) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      const response = await fetch('/.netlify/functions/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'login',
          username,
          password 
        })
      });

      const result = await response.json();

      if (response.ok) {
        setIsAuthenticated(true);
        setUsername('');
        setPassword('');
      } else {
        setLoginError(result.error || 'Login failed');
      }
    } catch (error) {
      setLoginError('Connection error. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/.netlify/functions/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' })
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    setIsAuthenticated(false);
    navigate('/');
  };

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setBookings(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const fetchZones = async () => {
    try {
      const { data, error } = await supabase
        .from('zones')
        .select('*')
        .order('name');

      if (error) throw error;
      setZones(data || []);
    } catch (error) {
      console.error('Error fetching zones:', error);
    }
  };

  const fetchAnalytics = async () => {
    setAnalyticsLoading(true);
    setAnalyticsError('');
    
    try {
      // Calculate date range based on selected timeframe
      const endDate = new Date().toISOString().split('T')[0];
      let startDate;
      
      switch (analyticsTimeframe) {
        case '7days':
          startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          break;
        case '30days':
          startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          break;
        case '90days':
          startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          break;
        default:
          startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      }
      
      const response = await fetch(`/.netlify/functions/get-analytics?type=overview&start_date=${startDate}&end_date=${endDate}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      } else {
        const errorData = await response.text();
        console.error('Failed to fetch analytics:', errorData);
        setAnalyticsError('Failed to fetch analytics data. Please try again later.');
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setAnalyticsError('An error occurred while fetching analytics data.');
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const fetchRealtimeVisitors = async () => {
    setRealtimeLoading(true);
    try {
      const response = await fetch('/.netlify/functions/get-analytics?type=realtime', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setRealtimeVisitors(data.recent_visitors || []);
      } else {
        console.error('Failed to fetch realtime visitors');
      }
    } catch (error) {
      console.error('Error fetching realtime visitors:', error);
    } finally {
      setRealtimeLoading(false);
    }
  };

  const calculateStats = (bookingData: Booking[]) => {
    const today = new Date().toISOString().split('T')[0];
    const confirmedBookings = bookingData.filter(b => b.status === 'confirmed');
    
    const stats: AdminStats = {
      totalBookings: confirmedBookings.length,
      todayBookings: confirmedBookings.filter(b => b.date === today).length,
      totalRevenue: confirmedBookings.reduce((sum, b) => sum + b.total_cost, 0),
      activeZones: zones.filter(z => z.active).length
    };
    
    setStats(stats);
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const response = await fetch('/.netlify/functions/admin-bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'cancel',
          bookingId
        })
      });

      if (response.ok) {
        await fetchBookings();
        setSelectedBooking(null);
        alert('Booking cancelled successfully');
      } else {
        const error = await response.json();
        alert(`Failed to cancel booking: ${error.error}`);
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking');
    }
  };

  const handleCreateFreeBooking = async () => {
    // Validate form
    if (!newBookingData.zone_id || !newBookingData.date || !newBookingData.start_time || 
        !newBookingData.customer_info?.name || !newBookingData.customer_info?.email || 
        !newBookingData.customer_info?.phone) {
      setCalendarError('Please fill in all required fields');
      return;
    }

    try {
      // Create a unique payment ID for the free booking
      const freePaymentId = `free_admin_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      
      // Prepare booking data
      const bookingData = {
        zone_id: newBookingData.zone_id,
        date: newBookingData.date,
        start_time: newBookingData.start_time,
        end_time: newBookingData.end_time,
        duration: newBookingData.duration,
        customer_info: {
          name: newBookingData.customer_info?.name,
          email: newBookingData.customer_info?.email,
          phone: newBookingData.customer_info?.phone,
          groupSize: newBookingData.customer_info?.groupSize,
          specialRequests: newBookingData.customer_info?.specialRequests || '',
          allergySoap: false,
          couponCode: 'ADMIN_FREE'
        },
        total_cost: 0, // Free booking
        status: 'confirmed',
        payment_id: freePaymentId
      };

      // Insert booking into database
      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select();

      if (error) throw error;
      
      // Reset form and close modal
      setNewBookingData({
        zone_id: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        start_time: '10:00:00',
        duration: 1,
        customer_info: {
          name: '',
          email: '',
          phone: '',
          groupSize: '1-2',
          specialRequests: ''
        },
        total_cost: 0,
        status: 'confirmed'
      });
      
      setShowNewBookingModal(false);
      setCalendarError('');
      
      // Refresh bookings
      await fetchBookings();
      
      // Show success message
      alert('Free booking created successfully!');
      
    } catch (error) {
      console.error('Error creating booking:', error);
      setCalendarError('Failed to create booking. Please try again.');
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.customer_info.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customer_info.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesDate = !dateFilter || booking.date === dateFilter;
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const exportBookings = () => {
    const csvContent = [
      ['ID', 'Customer Name', 'Email', 'Phone', 'Zone', 'Date', 'Time', 'Duration', 'Cost', 'Status', 'Created'],
      ...filteredBookings.map(booking => [
        booking.id,
        booking.customer_info.name,
        booking.customer_info.email,
        booking.customer_info.phone,
        zones.find(z => z.id === booking.zone_id)?.name || booking.zone_id,
        booking.date,
        `${booking.start_time} - ${booking.end_time}`,
        `${booking.duration}h`,
        `$${booking.total_cost}`,
        booking.status,
        new Date(booking.created_at).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType?.toLowerCase()) {
      case 'mobile': return <Smartphone className="w-4 h-4" />;
      case 'tablet': return <Tablet className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  const refreshAnalytics = () => {
    fetchAnalytics();
    fetchRealtimeVisitors();
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin} min ago`;
    if (diffHour < 24) return `${diffHour} hr ago`;
    return `${Math.floor(diffHour / 24)} days ago`;
  };

  // Calendar helper functions
  const getWeekDays = () => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 0 });
    const end = endOfWeek(selectedDate, { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  };

  const goToPreviousWeek = () => {
    setSelectedDate(prevDate => subDays(prevDate, 7));
  };

  const goToNextWeek = () => {
    setSelectedDate(prevDate => addDays(prevDate, 7));
  };

  const goToPreviousDay = () => {
    setSelectedDate(prevDate => subDays(prevDate, 1));
  };

  const goToNextDay = () => {
    setSelectedDate(prevDate => addDays(prevDate, 1));
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const getBookingsForDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return bookings.filter(booking => booking.date === dateString);
  };

  const getBookingColor = (booking: Booking) => {
    if (booking.status === 'cancelled') return 'bg-red-100 border-red-300 text-red-800';
    if (booking.total_cost === 0) return 'bg-green-100 border-green-300 text-green-800';
    
    // Different colors for different zones
    const zoneColors: Record<string, string> = {
      'beach-soccer': 'bg-blue-100 border-blue-300 text-blue-800',
      'volleyball': 'bg-yellow-100 border-yellow-300 text-yellow-800',
      'water-soccer-1': 'bg-cyan-100 border-cyan-300 text-cyan-800',
      'water-soccer-2': 'bg-teal-100 border-teal-300 text-teal-800',
      'turf-soccer': 'bg-green-100 border-green-300 text-green-800',
      'bubble-soccer': 'bg-purple-100 border-purple-300 text-purple-800',
      'sandbox': 'bg-orange-100 border-orange-300 text-orange-800'
    };
    
    return zoneColors[booking.zone_id] || 'bg-gray-100 border-gray-300 text-gray-800';
  };

  const handleNewBookingInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('customer_info.')) {
      const field = name.split('.')[1];
      setNewBookingData(prev => ({
        ...prev,
        customer_info: {
          ...prev.customer_info,
          [field]: value
        }
      }));
    } else {
      setNewBookingData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
            <p className="text-gray-600">Access the Splash Fun Land admin panel</p>
          </div>

          {loginError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-700 font-medium">{loginError}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Splash Fun Land Management</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('bookings')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'bookings'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Calendar className="w-4 h-4 inline mr-2" />
                Bookings
              </button>
              <button
                onClick={() => setActiveTab('calendar')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'calendar'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <CalendarIcon className="w-4 h-4 inline mr-2" />
                Calendar View
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'analytics'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BarChart3 className="w-4 h-4 inline mr-2" />
                Analytics
              </button>
            </nav>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {activeTab === 'bookings' || activeTab === 'calendar' ? (
            <>
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Bookings</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-primary-500" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Today's Bookings</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.todayBookings}</p>
                  </div>
                  <Clock className="w-8 h-8 text-green-500" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-yellow-500" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Active Zones</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeZones}</p>
                  </div>
                  <MapPin className="w-8 h-8 text-purple-500" />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Visitors</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analyticsData?.total_visitors || 0}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-primary-500" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Page Views</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analyticsData?.total_page_views || 0}
                    </p>
                  </div>
                  <Eye className="w-8 h-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Bounce Rate</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analyticsData?.bounce_rate || 0}%
                    </p>
                  </div>
                  <Activity className="w-8 h-8 text-orange-500" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Avg. Session</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analyticsData?.avg_session_duration ? Math.round(analyticsData.avg_session_duration) : 0}s
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-green-500" />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Tab Content */}
        {activeTab === 'bookings' && (
          <>
            {/* Filters and Search */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search bookings..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full sm:w-64"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="all">All Status</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="pending">Pending</option>
                  </select>

                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <button
                  onClick={exportBookings}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Bookings ({filteredBookings.length})
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{booking.customer_info.name}</div>
                            <div className="text-sm text-gray-500">{booking.customer_info.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {zones.find(z => z.id === booking.zone_id)?.name || booking.zone_id}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{booking.date}</div>
                          <div className="text-sm text-gray-500">{booking.start_time} - {booking.end_time}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">${booking.total_cost}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            booking.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800'
                              : booking.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setSelectedBooking(booking)}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {booking.status === 'confirmed' && (
                              <button
                                onClick={() => handleCancelBooking(booking.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'calendar' && (
          <div className="space-y-6">
            {/* Calendar Controls */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={calendarView === 'week' ? goToPreviousWeek : goToPreviousDay}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    
                    <button
                      onClick={goToToday}
                      className="px-3 py-1 bg-primary-100 text-primary-700 rounded-md text-sm font-medium hover:bg-primary-200 transition-colors"
                    >
                      Today
                    </button>
                    
                    <button
                      onClick={calendarView === 'week' ? goToNextWeek : goToNextDay}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900">
                    {calendarView === 'week' 
                      ? `Week of ${format(getWeekDays()[0], 'MMM d')} - ${format(getWeekDays()[6], 'MMM d, yyyy')}`
                      : format(selectedDate, 'MMMM d, yyyy')}
                  </h3>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex rounded-lg overflow-hidden border border-gray-300">
                    <button
                      onClick={() => setCalendarView('day')}
                      className={`px-4 py-2 text-sm font-medium ${
                        calendarView === 'day'
                          ? 'bg-primary-500 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Day
                    </button>
                    <button
                      onClick={() => setCalendarView('week')}
                      className={`px-4 py-2 text-sm font-medium ${
                        calendarView === 'week'
                          ? 'bg-primary-500 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Week
                    </button>
                  </div>
                  
                  <button
                    onClick={() => setShowNewBookingModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Free Booking</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Calendar View */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {calendarView === 'week' ? (
                // Week View
                <div className="overflow-x-auto">
                  <div className="min-w-[800px]">
                    {/* Day Headers */}
                    <div className="grid grid-cols-7 border-b border-gray-200">
                      {getWeekDays().map((day, index) => (
                        <div 
                          key={index} 
                          className={`px-4 py-3 text-center ${
                            isToday(day) ? 'bg-primary-50' : ''
                          }`}
                        >
                          <p className="text-sm font-medium text-gray-500">{format(day, 'EEE')}</p>
                          <p className={`text-lg font-semibold ${
                            isToday(day) ? 'text-primary-700' : 'text-gray-900'
                          }`}>
                            {format(day, 'd')}
                          </p>
                        </div>
                      ))}
                    </div>
                    
                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 min-h-[600px]">
                      {getWeekDays().map((day, dayIndex) => {
                        const dayBookings = getBookingsForDate(day);
                        const isPastDay = isBefore(day, new Date()) && !isToday(day);
                        
                        return (
                          <div 
                            key={dayIndex} 
                            className={`border-r border-b border-gray-200 p-2 ${
                              isToday(day) ? 'bg-primary-50' : isPastDay ? 'bg-gray-50' : ''
                            }`}
                          >
                            {dayBookings.length > 0 ? (
                              <div className="space-y-2">
                                {dayBookings.map((booking, bookingIndex) => (
                                  <div 
                                    key={bookingIndex}
                                    className={`p-2 rounded-lg border text-sm cursor-pointer ${getBookingColor(booking)}`}
                                    onClick={() => setSelectedBooking(booking)}
                                  >
                                    <div className="font-medium truncate">
                                      {zones.find(z => z.id === booking.zone_id)?.name}
                                    </div>
                                    <div className="text-xs">
                                      {convertTo12Hour(booking.start_time)} - {convertTo12Hour(booking.end_time)}
                                    </div>
                                    <div className="text-xs truncate">
                                      {booking.customer_info.name}
                                    </div>
                                    {booking.total_cost === 0 && (
                                      <div className="text-xs font-medium text-green-700 mt-1">
                                        FREE BOOKING
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                                {isPastDay ? 'Past date' : 'No bookings'}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                // Day View
                <div>
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                      {isToday(selectedDate) && (
                        <span className="ml-2 px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                          Today
                        </span>
                      )}
                    </h3>
                  </div>
                  
                  <div className="p-6">
                    {getBookingsForDate(selectedDate).length > 0 ? (
                      <div className="space-y-4">
                        {getBookingsForDate(selectedDate)
                          .sort((a, b) => a.start_time.localeCompare(b.start_time))
                          .map((booking, index) => (
                            <div 
                              key={index}
                              className={`p-4 rounded-lg border ${getBookingColor(booking)} hover:shadow-md transition-shadow cursor-pointer`}
                              onClick={() => setSelectedBooking(booking)}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="font-semibold text-lg">
                                    {zones.find(z => z.id === booking.zone_id)?.name}
                                  </div>
                                  <div className="text-sm mt-1">
                                    {convertTo12Hour(booking.start_time)} - {convertTo12Hour(booking.end_time)} ({booking.duration} hours)
                                  </div>
                                </div>
                                <div>
                                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                    booking.status === 'confirmed' 
                                      ? 'bg-green-100 text-green-800'
                                      : booking.status === 'cancelled'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {booking.status}
                                  </span>
                                  {booking.total_cost === 0 && (
                                    <span className="ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                      FREE
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              <div className="mt-3 pt-3 border-t border-gray-200">
                                <div className="flex items-start space-x-3">
                                  <Users className="w-4 h-4 text-gray-500 mt-0.5" />
                                  <div>
                                    <div className="font-medium">{booking.customer_info.name}</div>
                                    <div className="text-sm text-gray-600">{booking.customer_info.email}</div>
                                    <div className="text-sm text-gray-600">{booking.customer_info.phone}</div>
                                  </div>
                                </div>
                              </div>
                              
                              {booking.customer_info.specialRequests && (
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                  <div className="text-sm font-medium mb-1">Special Requests:</div>
                                  <div className="text-sm text-gray-600 bg-white/50 p-2 rounded">
                                    {booking.customer_info.specialRequests}
                                  </div>
                                </div>
                              )}
                              
                              <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                                <div className="font-medium">
                                  ${booking.total_cost.toFixed(2)}
                                </div>
                                {booking.status === 'confirmed' && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCancelBooking(booking.id);
                                    }}
                                    className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                                  >
                                    Cancel Booking
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Bookings</h3>
                        <p className="text-gray-500 mb-6">There are no bookings scheduled for this day.</p>
                        <button
                          onClick={() => setShowNewBookingModal(true)}
                          className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Free Booking
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* Analytics Controls */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700 font-medium">Time Period:</span>
                  <select
                    value={analyticsTimeframe}
                    onChange={(e) => setAnalyticsTimeframe(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="7days">Last 7 Days</option>
                    <option value="30days">Last 30 Days</option>
                    <option value="90days">Last 90 Days</option>
                  </select>
                </div>
                
                <button
                  onClick={refreshAnalytics}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh Data</span>
                </button>
              </div>
            </div>

            {analyticsError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <span className="text-red-700">{analyticsError}</span>
                </div>
              </div>
            )}

            {analyticsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
              </div>
            ) : analyticsData ? (
              <>
                {/* Analytics Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Total Page Views</p>
                        <p className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData.total_page_views)}</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Eye className="w-6 h-6 text-blue-500" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Bounce Rate</p>
                        <p className="text-2xl font-bold text-gray-900">{analyticsData.bounce_rate}%</p>
                      </div>
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-orange-500" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Avg Session</p>
                        <p className="text-2xl font-bold text-gray-900">{Math.round(analyticsData.avg_session_duration || 0)}s</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <Clock className="w-6 h-6 text-green-500" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Unique Visitors</p>
                        <p className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData.unique_visitors)}</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-purple-500" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visitor Trends Chart */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Visitor Trends</h3>
                    <div className="text-sm text-gray-500">
                      {analyticsTimeframe === '7days' ? 'Last 7 Days' : 
                       analyticsTimeframe === '30days' ? 'Last 30 Days' : 'Last 90 Days'}
                    </div>
                  </div>
                  <div className="p-6">
                    {analyticsData.daily_visitors && analyticsData.daily_visitors.length > 0 ? (
                      <div className="h-64 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <PieChart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">Interactive charts will be available in the next update</p>
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0">
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>{analyticsData.daily_visitors[0]?.date}</span>
                            <span>{analyticsData.daily_visitors[analyticsData.daily_visitors.length - 1]?.date}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-64 flex items-center justify-center">
                        <div className="text-center">
                          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">No visitor data available for this period</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Top Pages */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900">Top Pages</h3>
                    </div>
                    <div className="p-6">
                      {analyticsData.top_pages && analyticsData.top_pages.length > 0 ? (
                        <div className="space-y-4">
                          {analyticsData.top_pages.slice(0, 10).map((page, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex items-center space-x-2 max-w-[70%]">
                                <span className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center text-xs font-medium text-primary-700">
                                  {index + 1}
                                </span>
                                <span className="text-sm text-gray-700 truncate">{page.page_url}</span>
                              </div>
                              <span className="text-sm font-medium text-gray-900 ml-4">{formatNumber(page.views)}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Layers className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">No page view data available</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Device & Browser Breakdown */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900">Device Breakdown</h3>
                    </div>
                    <div className="p-6">
                      {analyticsData.device_breakdown && analyticsData.device_breakdown.length > 0 ? (
                        <div className="space-y-4">
                          {analyticsData.device_breakdown.map((device, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                {getDeviceIcon(device.device_type)}
                                <span className="text-sm text-gray-700">{device.device_type || 'Unknown'}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-24 bg-gray-200 rounded-full h-2.5">
                                  <div 
                                    className="bg-primary-500 h-2.5 rounded-full" 
                                    style={{ 
                                      width: `${(device.count / analyticsData.total_visitors * 100).toFixed(0)}%` 
                                    }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium text-gray-900">{device.count}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Smartphone className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">No device data available</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Realtime Visitors */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Visitors</h3>
                    <button
                      onClick={fetchRealtimeVisitors}
                      className="flex items-center space-x-1 text-primary-600 hover:text-primary-800 text-sm"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Refresh</span>
                    </button>
                  </div>
                  <div className="p-6">
                    {realtimeLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                      </div>
                    ) : realtimeVisitors && realtimeVisitors.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visitor</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Landing Page</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {realtimeVisitors.slice(0, 10).map((visitor, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="text-sm text-gray-900 font-medium">Visitor #{index + 1}</div>
                                  <div className="text-xs text-gray-500">{visitor.ip_address}</div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">
                                    {visitor.country || 'Unknown'}{visitor.city ? `, ${visitor.city}` : ''}
                                  </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="flex items-center">
                                    {getDeviceIcon(visitor.device_type)}
                                    <span className="ml-2 text-sm text-gray-900">{visitor.browser || 'Unknown'}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="text-sm text-gray-900 truncate max-w-[200px]">
                                    {visitor.landing_page || '/'}
                                  </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{getTimeAgo(visitor.created_at)}</div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Globe className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No recent visitors</p>
                        <p className="text-sm text-gray-400 mt-2">Visitor data will appear here once people start using the site</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Analytics Data</h3>
                <p className="text-gray-600 mb-6">Analytics data will appear here once visitors start using the site.</p>
                <div className="max-w-md mx-auto bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-blue-800 text-sm">
                    <strong>How to get started:</strong> The visitor tracking system is already set up. 
                    As users visit your website, data will automatically be collected and displayed here.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Booking Details</h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Customer Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">{selectedBooking.customer_info.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">{selectedBooking.customer_info.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">{selectedBooking.customer_info.phone}</span>
                      </div>
                      {selectedBooking.customer_info.groupSize && (
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700">Group: {selectedBooking.customer_info.groupSize}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Booking Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">
                          {zones.find(z => z.id === selectedBooking.zone_id)?.name || selectedBooking.zone_id}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">{selectedBooking.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">
                          {convertTo12Hour(selectedBooking.start_time)} - {convertTo12Hour(selectedBooking.end_time)} ({selectedBooking.duration}h)
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700 font-semibold">
                          ${selectedBooking.total_cost}
                          {selectedBooking.total_cost === 0 && (
                            <span className="ml-2 text-green-600 text-xs font-bold">FREE BOOKING</span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {selectedBooking.customer_info.specialRequests && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Special Requests</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {selectedBooking.customer_info.specialRequests}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Booking ID</h4>
                  <p className="text-gray-700 font-mono text-sm">{selectedBooking.id}</p>
                </div>
                {selectedBooking.payment_id && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Payment ID</h4>
                    <p className="text-gray-700 font-mono text-sm">{selectedBooking.payment_id}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Created</h4>
                  <p className="text-gray-700">{new Date(selectedBooking.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Status</h4>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    selectedBooking.status === 'confirmed' 
                      ? 'bg-green-100 text-green-800'
                      : selectedBooking.status === 'cancelled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedBooking.status}
                  </span>
                </div>
              </div>

              {selectedBooking.status === 'confirmed' && (
                <div className="flex justify-end pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleCancelBooking(selectedBooking.id)}
                    className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Cancel Booking
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* New Booking Modal */}
      {showNewBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Create Free Booking</h3>
              <button
                onClick={() => {
                  setShowNewBookingModal(false);
                  setCalendarError('');
                }}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {calendarError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <span className="text-red-700 font-medium">{calendarError}</span>
                </div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800 mb-1">Admin Free Booking</h4>
                  <p className="text-blue-700 text-sm">
                    This form allows you to create free bookings directly from the admin panel. 
                    These bookings will be marked as confirmed with $0 cost.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Zone and Date/Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Activity/Zone *</label>
                  <select
                    name="zone_id"
                    value={newBookingData.zone_id}
                    onChange={handleNewBookingInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  >
                    <option value="">Select a zone</option>
                    {zones.filter(z => !z.is_walk_in).map(zone => (
                      <option key={zone.id} value={zone.id}>
                        {zone.name} (${zone.hourly_rate}/hr)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={newBookingData.date}
                    onChange={handleNewBookingInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Time *</label>
                  <select
                    name="start_time"
                    value={newBookingData.start_time}
                    onChange={handleNewBookingInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  >
                    {Array.from({ length: 29 }).map((_, i) => {
                      const hour = Math.floor(i / 2) + 7; // Start at 7:00 AM
                      const minute = (i % 2) * 30;
                      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`;
                      return (
                        <option key={time} value={time}>
                          {convertTo12Hour(time)}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (hours) *</label>
                  <select
                    name="duration"
                    value={newBookingData.duration}
                    onChange={handleNewBookingInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  >
                    {[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8].map(duration => (
                      <option key={duration} value={duration}>
                        {duration} {duration === 1 ? 'hour' : 'hours'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Customer Information */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Customer Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="customer_info.name"
                      value={newBookingData.customer_info?.name || ''}
                      onChange={handleNewBookingInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      name="customer_info.email"
                      value={newBookingData.customer_info?.email || ''}
                      onChange={handleNewBookingInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                    <input
                      type="tel"
                      name="customer_info.phone"
                      value={newBookingData.customer_info?.phone || ''}
                      onChange={handleNewBookingInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Group Size *</label>
                    <select
                      name="customer_info.groupSize"
                      value={newBookingData.customer_info?.groupSize || ''}
                      onChange={handleNewBookingInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    >
                      <option value="">Select group size</option>
                      <option value="1-2">1-2 people</option>
                      <option value="3-5">3-5 people</option>
                      <option value="6-10">6-10 people</option>
                      <option value="11-15">11-15 people</option>
                      <option value="16+">16+ people</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests</label>
                <textarea
                  name="customer_info.specialRequests"
                  value={newBookingData.customer_info?.specialRequests || ''}
                  onChange={handleNewBookingInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                ></textarea>
              </div>

              {/* Booking Summary */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Booking Summary</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-600">Zone:</div>
                  <div className="font-medium text-gray-900">
                    {zones.find(z => z.id === newBookingData.zone_id)?.name || 'Not selected'}
                  </div>
                  
                  <div className="text-gray-600">Date:</div>
                  <div className="font-medium text-gray-900">{newBookingData.date || 'Not selected'}</div>
                  
                  <div className="text-gray-600">Time:</div>
                  <div className="font-medium text-gray-900">
                    {newBookingData.start_time ? (
                      <>
                        {convertTo12Hour(newBookingData.start_time)} - {
                          newBookingData.end_time ? convertTo12Hour(newBookingData.end_time) : 'Not calculated'
                        }
                      </>
                    ) : (
                      'Not selected'
                    )}
                  </div>
                  
                  <div className="text-gray-600">Duration:</div>
                  <div className="font-medium text-gray-900">
                    {newBookingData.duration} {newBookingData.duration === 1 ? 'hour' : 'hours'}
                  </div>
                  
                  <div className="text-gray-600">Regular Cost:</div>
                  <div className="font-medium text-gray-900">
                    ${newBookingData.total_cost?.toFixed(2) || '0.00'}
                  </div>
                  
                  <div className="text-gray-600">Admin Discount:</div>
                  <div className="font-medium text-green-600">
                    -${newBookingData.total_cost?.toFixed(2) || '0.00'}
                  </div>
                  
                  <div className="text-gray-600 font-bold">Final Cost:</div>
                  <div className="font-bold text-green-600">$0.00 (FREE)</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowNewBookingModal(false);
                    setCalendarError('');
                  }}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateFreeBooking}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Create Free Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;