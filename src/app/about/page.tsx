import { FaBullseye, FaHandshake, FaRocket } from "react-icons/fa6";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#353595] text-white py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            More than ticketing. VGC Events is the secret sauce for the best events.
          </h1>
          <p className="text-xl opacity-90">
            Making event experiences seamless for everyone in Victoria Garden City
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-6 py-16 bg-white text-[#353595]">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div className="aspect-square bg-[#353595] from-blue-100 to-indigo-100 rounded-2xl"></div>
          <div>
            <h2 className="text-3xl font-bold mb-6 text-center md:text-left">Why VGC Events?</h2>
            <div className="space-y-4 text-gray-700 text-lg">
              <p>
                We built VGC Events because the residents of Victoria Garden City deserve better – too many barriers stand between you and the amazing events happening in your community.
              </p>
              <p>
                Long lines, hidden fees, and clunky experiences can take the magic out of local events. That's why we're building VGC Events to help creators design the best event experiences right here in VGC, focusing on every detail so you can focus on having a blast.
              </p>
              <p>
                By empowering local event creators, we ensure that everyone in VGC has the smoothest possible experience discovering and attending events in our vibrant community.
              </p>
            </div>
          </div>
        </div>

        {/* What We Do */}
        <div className="bg-white text-[#353595] rounded-2xl p-8 md:p-12 mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">What We Offer</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-xl mb-4 text-[#353595]">For Event Organizers</h3>
              <ul className="space-y-3 text-gray-700">
                <li>• Create and manage events in minutes</li>
                <li>• Sell tickets online with ease</li>
                <li>• Track sales in real-time</li>
                <li>• Promote events to VGC residents</li>
                <li>• Access detailed analytics and insights</li>
                <li>• Get support when you need it</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-xl mb-4 text-[#353595]">For Attendees</h3>
              <ul className="space-y-3 text-gray-700">
                <li>• Discover local events easily</li>
                <li>• Buy tickets securely online</li>
                <li>• Get mobile tickets instantly</li>
                <li>• Fast check-in with QR codes</li>
                <li>• Stay updated about events you love</li>
                <li>• Support your local community</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-20 bg-white text-[#353595]">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white text-[#353595] rounded-full flex items-center justify-center mx-auto mb-4">
                <FaBullseye className="text-3xl text-[#353595]" />
              </div>
              <h3 className="font-bold text-xl mb-3">Simplicity</h3>
              <p className="text-gray-600">
                We believe event ticketing should be simple and intuitive for everyone.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHandshake className="text-3xl text-[#353595]" />
              </div>
              <h3 className="font-bold text-xl mb-3">Community First</h3>
              <p className="text-gray-600">
                We're dedicated to strengthening the VGC community through amazing events.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaRocket className="text-3xl text-[#353595]" />
              </div>
              <h3 className="font-bold text-xl mb-3">Innovation</h3>
              <p className="text-gray-600">
                We continuously improve our platform to serve you better.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-[#353595] text-white rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">Join the VGC Events Community</h2>
          <p className="text-xl mb-8 opacity-90">
            Whether you're organizing events or looking for things to do, we're here for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/signup"
              className="inline-block bg-white text-[#353595] px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Create an Event
            </a>
            <a
              href="/discover"
              className="inline-block bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-[#353595] transition-colors"
            >
              Discover Events
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
