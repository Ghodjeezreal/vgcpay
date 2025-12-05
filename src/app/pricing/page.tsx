import { FaClipboardList, FaTicket, FaWandMagicSparkles, FaChartLine, FaBullhorn, FaShield } from "react-icons/fa6";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#353595] text-white py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Simple pricing. Sign Up for free.</h1>
          <p className="text-xl opacity-90">
            There is no charge for hosting free events on VGC Events. If you're selling tickets, a fee will apply.
          </p>
        </div>
      </div>

      {/* Pricing Card */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white text-gray-900 border-2 border-[#353595] rounded-2xl p-8 md:p-12 shadow-lg">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-[#353595] mb-2">5% + ₦100</h2>
            <p className="text-gray-600 text-lg">per paid ticket</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Event Types */}
            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <FaClipboardList className="mr-2 text-[#353595]" /> Event Types
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Unlimited free events</li>
                <li>• Unlimited paid events</li>
                <li>• Unlimited private (invite only) events</li>
                <li>• Virtual Events</li>
                <li>• Recurring events</li>
                <li>• 1:1 events</li>
              </ul>
            </div>

            {/* Selling Tickets */}
            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <FaTicket className="mr-2 text-[#353595]" /> Selling Tickets
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• No fee on free tickets</li>
                <li>• 5% + ₦100 fee per paid ticket</li>
                <li>• Pass online ticket fees to attendees</li>
                <li>• Ability to manage ticket inventory</li>
              </ul>
            </div>

            {/* Customization */}
            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <FaWandMagicSparkles className="mr-2 text-[#353595]" /> Customization
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Custom event page URL</li>
                <li>• Unlimited custom fields on checkout form</li>
                <li>• Customizable order confirmation email</li>
                <li>• Multiple event themes</li>
              </ul>
            </div>

            {/* Tracking & Management */}
            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <FaChartLine className="mr-2 text-[#353595]" /> Tracking And Management
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Unlimited Discount Codes</li>
                <li>• Detailed Export Of All Data</li>
                <li>• Sales Summary Dashboard</li>
                <li>• Mobile Apps For Attendee Check In</li>
                <li>• Check in analytics</li>
              </ul>
            </div>

            {/* Promotion */}
            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <FaBullhorn className="mr-2 text-[#353595]" /> Promotion And Growth
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Social Sharing Tools</li>
                <li>• Emails To Attendees</li>
                <li>• Automated Event Reminders</li>
                <li>• Search Engine Optimization</li>
                <li>• Public Listing On VGC Events</li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <FaShield className="mr-2 text-[#353595]" /> Support And Security
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Email And Chat Support</li>
                <li>• Card Payments</li>
                <li>• Bank Transfer Payments</li>
                <li>• Mobile money payments</li>
                <li>• Secure Payment Processing</li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-12">
            <a
              href="/signup"
              className="inline-block bg-[#353595] text-white px-10 py-4 rounded-full font-semibold text-lg hover:bg-[#2a276f] transition-colors"
            >
              Get Started Free
            </a>
          </div>
        </div>
      </div>

      {/* Custom Add-ons */}
      <div className="bg-white text-black py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Need a custom add-on?</h2>
          <p className="text-gray-600 mb-8 text-lg">
            Custom add-ons are available (for a small fee, of course). Reach out to our team for a tailored quote.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg">
              <p className="font-semibold">Event staffing</p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <p className="font-semibold">APIs and white labelling</p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <p className="font-semibold">Event wristbands</p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <p className="font-semibold">Equipment rentals</p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <p className="font-semibold">VGC Events point of sale</p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <p className="font-semibold">Key account manager</p>
            </div>
          </div>

          <a
            href="/contact"
            className="inline-block bg-[#353595] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#2a276f] transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
