"use client";

import Link from "next/link";
import { FaTicket, FaRightFromBracket } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from 'react-hot-toast';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalTicketsSold: 0,
    totalRevenue: 0,
    upcomingEvents: 0,
  });

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      
      // Redirect attendees to their dashboard
      if (parsedUser.accountType === "attendee") {
        router.push("/dashboard/attendee");
        return;
      }
      
      setUser(parsedUser);
      fetchEvents(parsedUser.id);
    } else {
      router.push("/login");
    }
  }, [router]);

  const fetchEvents = async (organizerId: number) => {
    try {
      const response = await fetch(`/api/events?organizerId=${organizerId}`);
      const data = await response.json();
      
      if (response.ok) {
        setEvents(data.events);
        calculateStats(data.events);
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  const calculateStats = (eventsData: any[]) => {
    const now = new Date();
    const totalTicketsSold = eventsData.reduce((sum, event) => sum + (event.ticketsSold || 0), 0);
    const totalRevenue = eventsData.reduce((sum, event) => {
      if (event.ticketType === 'paid' && event.ticketPrice) {
        return sum + (event.ticketsSold * parseFloat(event.ticketPrice));
      }
      return sum;
    }, 0);
    const upcomingEvents = eventsData.filter(event => new Date(event.eventDate) >= now).length;

    setStats({
      totalEvents: eventsData.length,
      totalTicketsSold,
      totalRevenue,
      upcomingEvents,
    });
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("user");
    toast.success("Logged out successfully!");
    setTimeout(() => {
      router.push("/");
    }, 1000);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="min-h-screen bg-white text-[#353595]">
      {/* Dashboard Header */}
      <div className="bg-white text-[#353595] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">
                {user ? `Welcome back, ${user.firstName}!` : 'My Dashboard'}
              </h1>
              <p className="text-gray-600 mt-1">Manage your events and track performance</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <FaRightFromBracket />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-gray-600 text-sm font-medium mb-1">Total Events</div>
            <div className="text-3xl font-bold text-[#353595]">{stats.totalEvents}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-gray-600 text-sm font-medium mb-1">Total Tickets Sold</div>
            <div className="text-3xl font-bold text-[#353595]">{stats.totalTicketsSold}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-gray-600 text-sm font-medium mb-1">Total Revenue</div>
            <div className="text-3xl font-bold text-[#353595]">₦{stats.totalRevenue.toLocaleString()}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-gray-600 text-sm font-medium mb-1">Upcoming Events</div>
            <div className="text-3xl font-bold text-[#353595]">{stats.upcomingEvents}</div>
          </div>
        </div>

        {/* Create Event CTA */}
        {events.length === 0 && (
          <div className="bg-[#353595] text-white rounded-lg p-8 mb-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Create Your First Event</h2>
            <p className="mb-6 text-lg opacity-90">
              Start selling tickets in less than 10 minutes
            </p>
            <Link
              href="/dashboard/create-event"
              className="inline-block bg-white text-[#353595] px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Create Event
            </Link>
          </div>
        )}

        {/* Events List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-bold">My Events</h2>
            {events.length > 0 && (
              <Link
                href="/dashboard/create-event"
                className="bg-[#353595] text-white px-4 py-2 rounded-lg hover:bg-[#2a276f] transition-colors text-sm font-medium"
              >
                + Create Event
              </Link>
            )}
          </div>
          <div className="p-6">
            {events.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FaTicket className="text-5xl mb-4 mx-auto text-gray-400" />
                <p className="text-lg mb-2">No events yet</p>
                <p className="text-sm">Create your first event to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 mb-1">{event.title}</h3>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{event.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <span>📅 {new Date(event.eventDate).toLocaleDateString()}</span>
                          <span>🎟️ {event.ticketsSold}/{event.totalTickets} sold</span>
                          <span className="capitalize">
                            {event.ticketType === 'paid' ? `💳 ₦${parseFloat(event.ticketPrice).toLocaleString()}` : '🎁 Free'}
                          </span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        new Date(event.eventDate) >= new Date() 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {new Date(event.eventDate) >= new Date() ? 'Upcoming' : 'Past'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Logout</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>
            <div className="flex space-x-4">
              <button
                onClick={cancelLogout}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
