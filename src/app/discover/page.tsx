"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaCalendar, FaLaptop, FaTicket } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";

interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  eventType: string;
  venue: string | null;
  location: string | null;
  ticketType: string;
  ticketPrice: number | null;
  totalTickets: number;
  organizerName: string;
}

const categories = [
  { name: "All Events", slug: "all" },
  { name: "Community", slug: "community" },
  { name: "Art & Culture", slug: "art-culture" },
  { name: "Sports & Wellness", slug: "sports-wellness" },
  { name: "Career & Business", slug: "career-business" },
  { name: "Food & Drink", slug: "food-drink" },
  { name: "Entertainment", slug: "entertainment" },
];

export default function DiscoverPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory]);

  useEffect(() => {
    filterEvents();
  }, [events, searchQuery]);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const url = selectedCategory === "all" 
        ? "/api/events/public" 
        : `/api/events/public?category=${selectedCategory}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (response.ok) {
        setEvents(data.events);
        setFilteredEvents(data.events);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterEvents = () => {
    if (!searchQuery.trim()) {
      setFilteredEvents(events);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = events.filter(event => 
      event.title.toLowerCase().includes(query) ||
      event.description.toLowerCase().includes(query) ||
      event.category.toLowerCase().includes(query)
    );
    setFilteredEvents(filtered);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#353595] text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Events</h1>
          <p className="text-xl opacity-90">Find amazing events happening in Victoria Garden City</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#353595]"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.slug}
                onClick={() => setSelectedCategory(category.slug)}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category.slug
                    ? "bg-[#353595] text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:border-[#353595]"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#353595]"></div>
            <p className="mt-4 text-gray-600">Loading events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <FaTicket className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No events found</h3>
            <p className="text-gray-600">
              {searchQuery 
                ? "Try adjusting your search or filters" 
                : "Check back soon for upcoming events!"}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
              >
                {/* Event Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                  <FaTicket className="text-6xl text-white opacity-50" />
                </div>

                {/* Event Details */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-purple-100 text-[#353595] text-xs font-semibold rounded-full">
                      {event.category}
                    </span>
                    {event.ticketType === "free" && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        FREE
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {event.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <FaCalendar className="text-[#353595]" />
                      <span>{formatDate(event.eventDate)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {event.eventType === "physical" ? (
                        <>
                          <FaMapMarkerAlt className="text-[#353595]" />
                          <span className="line-clamp-1">{event.venue}</span>
                        </>
                      ) : (
                        <>
                          <FaLaptop className="text-[#353595]" />
                          <span>Virtual Event</span>
                        </>
                      )}
                    </div>

                    {event.ticketType === "paid" && event.ticketPrice && (
                      <div className="text-lg font-bold text-[#353595] mt-2">
                        ₦{event.ticketPrice.toLocaleString()}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      Organized by {event.organizerName}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
