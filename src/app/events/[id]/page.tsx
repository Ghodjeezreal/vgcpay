"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import {
  FaCalendar,
  FaLaptop,
  FaTicket,
  FaClock,
  FaUser,
  FaEnvelope,
  FaArrowLeft,
  FaTag,
} from "react-icons/fa6";
import { FaMapMarkerAlt } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { initializePaystack, generatePaymentReference } from "@/lib/paystack";

interface Event {
  id: number;
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
  platformFeePercent: number;
  feeBearer: string;
  totalTickets: number;
  ticketsSold: number;
  ticketsAvailable: number;
  imageUrl: string | null;
  bannerUrl: string | null;
  organizer: {
    id: number;
    name: string;
    email: string;
    paystackSplitCode?: string;
  };
  createdAt: string;
}

export default function EventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    fetchEvent();
  }, [params.id]);

  const fetchEvent = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/events/${params.id}`);
      const data = await response.json();

      if (response.ok) {
        setEvent(data.event);
      } else {
        toast.error(data.error || "Failed to load event");
      }
    } catch (error) {
      console.error("Error fetching event:", error);
      toast.error("Failed to load event");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    // timeString format from database: "HH:mm:ss"
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const handlePurchaseTicket = async () => {
    if (!user) {
      toast.error("Please log in to purchase tickets");
      setTimeout(() => router.push("/login"), 1500);
      return;
    }

    if (event?.ticketsAvailable === 0) {
      toast.error("Sorry, this event is sold out");
      return;
    }

    if (!event) return;

    setIsPurchasing(true);

    try {
      // For free events, directly create ticket
      if (event.ticketType === "free") {
        const response = await fetch("/api/tickets/purchase", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            eventId: event.id,
            paymentReference: generatePaymentReference(),
            amount: 0,
            paymentStatus: "success",
          }),
        });

        const data = await response.json();

        if (response.ok) {
          toast.success("Ticket registered successfully!");
          fetchEvent(); // Refresh event data
        } else {
          toast.error(data.error || "Failed to register ticket");
        }
        setIsPurchasing(false);
        return;
      }

      // For paid events, initialize Paystack payment
      const amount = event.ticketPrice || 0;
      const paymentRef = generatePaymentReference();

      // Calculate platform fee (8% of ticket price)
      const platformFeePercent = event.platformFeePercent || 8;
      const platformFee = Math.round(amount * (platformFeePercent / 100) * 100); // in kobo

      // Determine final amount based on who pays the fee
      const totalAmount = event.feeBearer === "buyer" 
        ? amount * (1 + platformFeePercent / 100) // Buyer pays: ticket + fee
        : amount; // Organizer pays: just ticket price

      // Prepare Paystack config
      const paystackConfig: any = {
        publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
        email: user.email,
        amount: Math.round(totalAmount * 100), // Convert to kobo
        metadata: {
          custom_fields: [
            {
              display_name: "Event",
              variable_name: "event_id",
              value: event.id,
            },
            {
              display_name: "User",
              variable_name: "user_id",
              value: user.id,
            },
          ],
        },
      };

      // Add Split Code if available
      if (event.organizer.paystackSplitCode) {
        paystackConfig.split_code = event.organizer.paystackSplitCode;
      }

      paystackConfig.onSuccess = (reference: any) => {
        // Create ticket after successful payment (non-async wrapper)
        fetch("/api/tickets/purchase", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            eventId: event.id,
            paymentReference: reference.reference,
            amount: amount,
            paymentStatus: "success",
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.ticket) {
              toast.success("🎉 Ticket purchased successfully!");
              fetchEvent(); // Refresh event data
            } else {
              toast.error(data.error || "Failed to create ticket");
            }
            setIsPurchasing(false);
          })
          .catch((error) => {
            console.error("Ticket creation error:", error);
            toast.error("Failed to create ticket");
            setIsPurchasing(false);
          });
      };

      paystackConfig.onClose = () => {
        toast.error("Payment cancelled");
        setIsPurchasing(false);
      };

      initializePaystack(paystackConfig);
    } catch (error) {
      console.error("Purchase error:", error);
      toast.error("An error occurred. Please try again.");
      setIsPurchasing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#353595]"></div>
          <p className="mt-4 text-gray-600">Loading event...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaTicket className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Event not found
          </h2>
          <p className="text-gray-600 mb-6">
            The event you're looking for doesn't exist.
          </p>
          <Link
            href="/discover"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#353595] text-white rounded-lg hover:bg-[#2a276f] transition-colors"
          >
            <FaArrowLeft />
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Script src="https://js.paystack.co/v1/inline.js" strategy="lazyOnload" />
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gray-50">
        {/* Header Banner - Hidden on Mobile */}
        <div className="hidden md:block h-64 md:h-96 bg-white from-purple-400 to-pink-400 relative overflow-hidden">
          {event.bannerUrl ? (
            <Image
              src={event.bannerUrl}
              alt={`${event.title} banner`}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          ) : (
            <FaTicket className="text-8xl md:text-9xl text-white opacity-30" />
          )}
          <Link
            href="/discover"
            className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-[#353595] bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg backdrop-blur-sm transition-colors z-10"
          >
            <FaArrowLeft />
            <span className="hidden md:inline">Back to Events</span>
          </Link>
        </div>

        {/* Mobile Back Button */}
        <div className="md:hidden bg-white border-b border-gray-200 px-6 py-4">
          <Link
            href="/discover"
            className="inline-flex items-center gap-2 text-[#353595] hover:text-[#2a276f]"
          >
            <FaArrowLeft />
            <span>Back to Events</span>
          </Link>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Sidebar - Desktop: Left, Mobile: Top */}
            <div className="lg:col-span-1 space-y-6 order-1">
              {/* Event Flyer Image */}
              {event.imageUrl && (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="relative aspect-[3/4] w-full">
                    <Image
                      src={event.imageUrl}
                      alt={event.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                  </div>
                </div>
              )}

              {/* Organizer Info Card - Desktop Only */}
              <div className="hidden lg:block bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Organized By
                </h2>
                <div className="flex items-center gap-4">
                  <div className="bg-purple-100 p-4 rounded-full">
                    <FaUser className="text-2xl text-[#353595]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-lg">
                      {event.organizer.name}
                    </p>
                    <p className="text-gray-600 flex items-center gap-2 mt-1">
                      <FaEnvelope className="text-sm" />
                      {event.organizer.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6 order-2">
              {/* Event Info Card */}
              <div className="bg-white rounded-lg shadow p-6 md:p-8">
                {/* Category Badge */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-purple-100 text-[#353595] text-sm font-semibold rounded-full">
                    {event.category}
                  </span>
                  {event.ticketType === "free" && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                      FREE
                    </span>
                  )}
                  {event.ticketsAvailable === 0 && (
                    <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded-full">
                      SOLD OUT
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {event.title}
                </h1>

                {/* Event Details Grid */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <FaCalendar className="text-xl text-[#353595]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-semibold text-gray-900">
                        {formatDate(event.eventDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <FaClock className="text-xl text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Time</p>
                      <p className="font-semibold text-gray-900">
                        {formatTime(event.startTime)} - {formatTime(event.endTime)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 p-3 rounded-lg">
                      {event.eventType === "physical" ? (
                        <FaMapMarkerAlt className="text-xl text-green-600" />
                      ) : (
                        <FaLaptop className="text-xl text-green-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        {event.eventType === "physical"
                          ? "Venue"
                          : "Event Type"}
                      </p>
                      <p className="font-semibold text-gray-900">
                        {event.eventType === "physical"
                          ? event.venue
                          : "Virtual Event"}
                      </p>
                      {event.eventType === "physical" && event.location && (
                        <p className="text-sm text-gray-600 mt-1">
                          {event.location}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-orange-100 p-3 rounded-lg">
                      <FaTicket className="text-xl text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Available Tickets</p>
                      <p className="font-semibold text-gray-900">
                        {event.ticketsAvailable} / {event.totalTickets}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="border-t border-gray-200 pt-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">
                    About This Event
                  </h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {event.description}
                  </p>
                </div>
              </div>

              {/* Ticket Purchase Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="mb-6">
                  {event.ticketType === "paid" && event.ticketPrice ? (
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Ticket Price</p>
                      <p className="text-4xl font-bold text-[#353595]">
                        ₦{event.ticketPrice.toLocaleString()}
                      </p>
                      {event.feeBearer === "buyer" && (
                        <div className="mt-2 p-2 bg-blue-50 rounded">
                          <p className="text-sm text-gray-600">
                            + Platform fee (8%): ₦{(event.ticketPrice * 0.08).toLocaleString()}
                          </p>
                          <p className="text-base font-semibold text-gray-900 mt-1">
                            Total: ₦{(event.ticketPrice * 1.08).toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p className="text-4xl font-bold text-green-600">FREE</p>
                      <p className="text-gray-600 text-sm mt-1">
                        No ticket required
                      </p>
                    </div>
                  )}
                </div>

                <button
                  onClick={handlePurchaseTicket}
                  disabled={isPurchasing || event.ticketsAvailable === 0}
                  className={`w-full py-4 rounded-lg font-semibold text-lg transition-colors mb-4 ${
                    event.ticketsAvailable === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-[#353595] text-white hover:bg-[#2a276f]"
                  } disabled:opacity-50`}
                >
                  {isPurchasing
                    ? "Processing..."
                    : event.ticketsAvailable === 0
                    ? "Sold Out"
                    : event.ticketType === "free"
                    ? "Register for Free"
                    : "Purchase Ticket"}
                </button>

                {event.ticketsAvailable > 0 &&
                  event.ticketsAvailable <= 10 && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                      <p className="text-orange-800 text-sm font-medium">
                        ⚠️ Only {event.ticketsAvailable} tickets left!
                      </p>
                    </div>
                  )}

                <div className="border-t border-gray-200 pt-4 space-y-3 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Tickets Sold</span>
                    <span className="font-semibold text-gray-900">
                      {event.ticketsSold}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Capacity</span>
                    <span className="font-semibold text-gray-900">
                      {event.totalTickets}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#353595] h-2 rounded-full transition-all"
                      style={{
                        width: `${
                          (event.ticketsSold / event.totalTickets) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Organizer Info Card - Mobile Only */}
              <div className="lg:hidden bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Organized By
                </h2>
                <div className="flex items-center gap-4">
                  <div className="bg-purple-100 p-4 rounded-full">
                    <FaUser className="text-2xl text-[#353595]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-lg">
                      {event.organizer.name}
                    </p>
                    <p className="text-gray-600 flex items-center gap-2 mt-1">
                      <FaEnvelope className="text-sm" />
                      {event.organizer.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
