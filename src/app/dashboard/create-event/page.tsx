"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaLocationDot, FaLaptop, FaGift, FaCreditCard } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import toast, { Toaster } from 'react-hot-toast';
import Image from "next/image";

export default function CreateEventPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [bannerPreview, setBannerPreview] = useState<string>("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    venue: "",
    eventType: "physical",
    ticketType: "paid",
    ticketPrice: "",
    totalTickets: "",
    feeBearer: "organizer",
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      toast.error("Please log in to create an event");
      router.push("/login");
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'banner') => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'image') {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
      } else {
        setBannerFile(file);
        setBannerPreview(URL.createObjectURL(file));
      }
    }
  };

  const uploadImage = async (file: File, folder: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please log in to create an event");
      return;
    }

    setIsLoading(true);

    try {
      // Upload images first if they exist
      let imageUrl = '';
      let bannerUrl = '';

      if (imageFile) {
        toast.loading('Uploading event image...');
        imageUrl = await uploadImage(imageFile, 'events/images');
        toast.dismiss();
      }

      if (bannerFile) {
        toast.loading('Uploading event banner...');
        bannerUrl = await uploadImage(bannerFile, 'events/banners');
        toast.dismiss();
      }

      const response = await fetch("/api/events/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          organizerId: user.id,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          eventDate: formData.date,
          startTime: formData.startTime,
          endTime: formData.endTime,
          eventType: formData.eventType,
          venue: formData.venue,
          location: formData.location,
          ticketType: formData.ticketType,
          ticketPrice: formData.ticketPrice,
          totalTickets: formData.totalTickets,
          feeBearer: formData.feeBearer,
          imageUrl,
          bannerUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to create event");
        setIsLoading(false);
        return;
      }

      toast.success("🎉 Event created successfully!");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Create event error:", error);
      toast.error("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="min-h-screen bg-white text-[#353595]">
      {/* Header */}
      <div className="bg-white text-[#353595] border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <Link href="/dashboard" className="text-[#353595] hover:text-[#2a276f] mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold">Create New Event</h1>
          <p className="text-gray-600 mt-1">Fill in the details below to create your event</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Payment Warning */}
        {user && user.kycStatus !== 'approved' && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-300 rounded-lg">
            <h3 className="font-semibold text-amber-900 mb-2">
              ⚠️ KYC Verification Required
            </h3>
            <p className="text-sm text-amber-800 mb-3">
              {user.kycStatus === 'not_submitted' && "You need to complete KYC verification to receive payments. You can create events, but won't receive payment split code until verified."}
              {user.kycStatus === 'pending' && "Your KYC is under review. You can create events, but won't receive payments until approved."}
              {user.kycStatus === 'rejected' && "Your KYC was rejected. Please resubmit for verification to receive payments."}
            </p>
            <Link
              href={user.kycStatus === 'not_submitted' || user.kycStatus === 'rejected' ? "/dashboard/kyc" : "/dashboard/settings"}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
            >
              {user.kycStatus === 'not_submitted' || user.kycStatus === 'rejected' ? "Submit KYC" : "View Status"} →
            </Link>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 space-y-8">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-bold mb-6">Basic Information</h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title *
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#353595]"
                  placeholder="Give your event a catchy title"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Event Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#353595]"
                  placeholder="Describe what makes your event special"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#353595]"
                >
                  <option value="">Select a category</option>
                  <option value="community">Community</option>
                  <option value="art-culture">Art & Culture</option>
                  <option value="sports-wellness">Sports & Wellness</option>
                  <option value="career-business">Career & Business</option>
                  <option value="food-drink">Food & Drink</option>
                  <option value="entertainment">Entertainment</option>
                </select>
              </div>

              {/* Event Image */}
              <div>
                <label htmlFor="eventImage" className="block text-sm font-medium text-gray-700 mb-2">
                  Event Image (Flyer)
                </label>
                <p className="text-sm text-gray-500 mb-2">Recommended: 3:4 ratio (e.g., 600x800px)</p>
                <input
                  id="eventImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 'image')}
                  className="w-full px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#353595]"
                />
                {imagePreview && (
                  <div className="mt-4 relative w-64 mx-auto">
                    <div className="relative aspect-[3/4] w-full">
                      <Image
                        src={imagePreview}
                        alt="Event preview"
                        fill
                        className="object-cover rounded-lg shadow-lg"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Event Banner */}
              <div>
                <label htmlFor="eventBanner" className="block text-sm font-medium text-gray-700 mb-2">
                  Event Banner (Wide)
                </label>
                <p className="text-sm text-gray-500 mb-2">Recommended: 16:9 ratio (e.g., 1920x1080px)</p>
                <input
                  id="eventBanner"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 'banner')}
                  className="w-full px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#353595]"
                />
                {bannerPreview && (
                  <div className="mt-4 relative w-full">
                    <div className="relative aspect-[16/9] w-full">
                      <Image
                        src={bannerPreview}
                        alt="Banner preview"
                        fill
                        className="object-cover rounded-lg shadow-lg"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div>
            <h2 className="text-xl font-bold mb-6">Date & Time</h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  Event Date *
                </label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#353595]"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time *
                  </label>
                  <input
                    id="startTime"
                    name="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#353595]"
                  />
                </div>
                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-2">
                    End Time *
                  </label>
                  <input
                    id="endTime"
                    name="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#353595]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h2 className="text-xl font-bold mb-6">Location</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Type *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, eventType: "physical" })}
                    className={`p-4 border-2 rounded-lg text-center transition-colors ${
                      formData.eventType === "physical"
                        ? "border-[#353595] bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <FaLocationDot className="text-2xl mb-2 mx-auto text-[#353595]" />
                    <div className="font-medium">Physical Event</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, eventType: "virtual" })}
                    className={`p-4 border-2 rounded-lg text-center transition-colors ${
                      formData.eventType === "virtual"
                        ? "border-[#353595] bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <FaLaptop className="text-2xl mb-2 mx-auto text-[#353595]" />
                    <div className="font-medium">Virtual Event</div>
                  </button>
                </div>
              </div>

              {formData.eventType === "physical" && (
                <>
                  <div>
                    <label htmlFor="venue" className="block text-sm font-medium text-gray-700 mb-2">
                      Venue Name *
                    </label>
                    <input
                      id="venue"
                      name="venue"
                      type="text"
                      value={formData.venue}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#353595]"
                      placeholder="e.g., VGC Community Center"
                    />
                  </div>
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Address *
                    </label>
                    <input
                      id="location"
                      name="location"
                      type="text"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#353595]"
                      placeholder="Enter the full address in VGC"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Ticketing */}
          <div>
            <h2 className="text-xl font-bold mb-6">Ticketing</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ticket Type *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, ticketType: "free" })}
                    className={`p-4 border-2 rounded-lg text-center transition-colors ${
                      formData.ticketType === "free"
                        ? "border-[#353595] bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <FaGift className="text-2xl mb-2 mx-auto text-[#353595]" />
                    <div className="font-medium">Free Event</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, ticketType: "paid" })}
                    className={`p-4 border-2 rounded-lg text-center transition-colors ${
                      formData.ticketType === "paid"
                        ? "border-[#353595] bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <FaCreditCard className="text-2xl mb-2 mx-auto text-[#353595]" />
                    <div className="font-medium">Paid Event</div>
                  </button>
                </div>
              </div>

              {formData.ticketType === "paid" && (
                <div>
                  <label htmlFor="ticketPrice" className="block text-sm font-medium text-gray-700 mb-2">
                    Ticket Price (₦) *
                  </label>
                  <input
                    id="ticketPrice"
                    name="ticketPrice"
                    type="number"
                    value={formData.ticketPrice}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#353595]"
                    placeholder="5000"
                  />
                </div>
              )}

              <div>
                <label htmlFor="totalTickets" className="block text-sm font-medium text-gray-700 mb-2">
                  Total Tickets Available *
                </label>
                <input
                  id="totalTickets"
                  name="totalTickets"
                  type="number"
                  value={formData.totalTickets}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-4 py-3 bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#353595]"
                  placeholder="100"
                />
              </div>

              {/* Platform Fee Bearer - Only for paid events */}
              {formData.ticketType === "paid" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Who Pays Platform Fee (8%)? *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, feeBearer: "organizer" })}
                      className={`p-4 border-2 rounded-lg text-center transition-colors ${
                        formData.feeBearer === "organizer"
                          ? "border-[#353595] bg-blue-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <div className="font-medium">I'll Pay</div>
                      <div className="text-sm text-gray-600 mt-1">Fee deducted from my earnings</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, feeBearer: "buyer" })}
                      className={`p-4 border-2 rounded-lg text-center transition-colors ${
                        formData.feeBearer === "buyer"
                          ? "border-[#353595] bg-blue-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <div className="font-medium">Buyer Pays</div>
                      <div className="text-sm text-gray-600 mt-1">Added to ticket price</div>
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {formData.feeBearer === "organizer" 
                      ? "You'll receive 92% of the ticket price" 
                      : "Buyers will pay ticket price + 8% platform fee"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <Link
              href="/dashboard"
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold text-center hover:bg-gray-300 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-[#353595] text-white py-3 rounded-lg font-semibold hover:bg-[#2a276f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating Event..." : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}
