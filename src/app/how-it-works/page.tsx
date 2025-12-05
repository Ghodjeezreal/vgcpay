import { FaTicket, FaMoneyBill, FaRepeat, FaUsers, FaLock, FaMobile, FaQrcode, FaLink, FaPalette, FaShareNodes, FaPlug, FaMagnifyingGlass, FaChartLine, FaTag, FaCreditCard, FaGlobe, FaShield, FaCircleCheck, FaComments, FaUserShield, FaDownload, FaCode, FaBriefcase, FaList } from "react-icons/fa6";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#353595] text-white py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Create, promote, and sell tickets to your events in less than 10 minutes.
          </h1>
          <p className="text-xl opacity-90 mb-8">
            At VGC Events, we have everything event organizers need to easily create memorable experiences from beginning to end.
          </p>
          <a
            href="/signup"
            className="inline-block bg-white text-[#353595] px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            Get Started for free
          </a>
        </div>
      </div>

      {/* Features Sections */}
      <div className="max-w-7xl mx-auto px-6 py-16 bg-white text-black">
        {/* Create and Manage */}
        <div className="mb-20">
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              <FaTicket className="text-3xl text-[#353595]" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-center mb-12">Create and Manage</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {createFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-2 flex items-center">
                    <Icon className="mr-2 text-[#353595]" />
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sell and Promote */}
        <div className="mb-20">
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
              <FaShareNodes className="text-3xl text-pink-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-center mb-12">Sell and Promote</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sellFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-2 flex items-center">
                    <Icon className="mr-2 text-[#353595]" />
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Security & Support */}
        <div className="mb-20">
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <FaLock className="text-3xl text-green-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-center mb-12">Security & Support</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {securityFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-2 flex items-center">
                    <Icon className="mr-2 text-[#353595]" />
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Operational Efficiency */}
        <div>
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <FaChartLine className="text-3xl text-blue-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-center mb-12">Operational Efficiency</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {operationalFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-2 flex items-center">
                    <Icon className="mr-2 text-[#353595]" />
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white text-black py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-gray-600 mb-8 text-lg">
            Join hundreds of event organizers already using VGC Events
          </p>
          <a
            href="/signup"
            className="inline-block bg-[#353595] text-white px-10 py-4 rounded-full font-semibold text-lg hover:bg-[#2a276f] transition-colors"
          >
            Create Your First Event
          </a>
        </div>
      </div>
    </div>
  );
}

const createFeatures = [
  { icon: FaTicket, title: "Free events", description: "VGC Events is free to use for free events!" },
  { icon: FaMoneyBill, title: "Paid events", description: "We only make money when you make money. Check our pricing page for details." },
  { icon: FaRepeat, title: "Recurring events", description: "Create events that repeat more than once within a specific period." },
  { icon: FaTicket, title: "Free and paid tickets", description: "Mix free and paid ticket types in the same event." },
  { icon: FaUsers, title: "Group tickets", description: "Allow attendees to buy tickets in groups." },
  { icon: FaLock, title: "Invite only tickets", description: "Create private events with invite-only access." },
  { icon: FaMobile, title: "Mobile tickets", description: "Digital tickets accessible from any device." },
  { icon: FaQrcode, title: "QR code tickets", description: "Fast check-in with QR code scanning." },
  { icon: FaLink, title: "Customizable URL", description: "Create a branded URL for your event." },
];

const sellFeatures = [
  { icon: FaPalette, title: "Customizable themes", description: "Make your event page match your brand." },
  { icon: FaShareNodes, title: "Social sharing tools", description: "Easy sharing to social media platforms." },
  { icon: FaPlug, title: "Ticket widgets", description: "Embed ticket sales on your own website." },
  { icon: FaMagnifyingGlass, title: "Event discovery", description: "Get discovered by thousands of VGC residents." },
  { icon: FaChartLine, title: "Analytics integrations", description: "Track your marketing performance." },
  { icon: FaTag, title: "Discount codes", description: "Create promotional codes to boost sales." },
  { icon: FaCreditCard, title: "Multiple payment methods", description: "Accept payments via cards, bank transfers, and more." },
  { icon: FaGlobe, title: "Multi-currency support", description: "Sell tickets in different currencies." },
];

const securityFeatures = [
  { icon: FaShield, title: "PCI/DSS compliance", description: "Industry-standard security for payments." },
  { icon: FaLock, title: "HTTPS SSL protection", description: "Encrypted connections for all transactions." },
  { icon: FaCircleCheck, title: "Secure payment processing", description: "Safe and reliable payment handling." },
  { icon: FaComments, title: "Live support", description: "Fast chat and email support when you need it." },
];

const operationalFeatures = [
  { icon: FaMobile, title: "Ticket scanning app", description: "Check in attendees with our mobile app." },
  { icon: FaUserShield, title: "Staff access", description: "Give your team controlled access to manage events." },
  { icon: FaDownload, title: "Full data export", description: "Export all your attendee data anytime." },
  { icon: FaCode, title: "API access", description: "Integrate with your existing systems." },
  { icon: FaBriefcase, title: "Offline payments", description: "Record cash and other offline payments." },
  { icon: FaList, title: "Guest list management", description: "Manage your guest list efficiently." },
];
