import Link from "next/link";
import Image from "next/image";
import { FaUsers, FaPalette, FaDumbbell, FaBriefcase, FaUtensils, FaMasksTheater, FaTicket, FaBolt, FaChartLine, FaBuilding } from "react-icons/fa6";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <section className="relative bg-[#353595] text-white py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/hero2.jpg"
            alt="VGC Events"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
              Bringing you closer to all the VGC events you love
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 drop-shadow-lg">
              Find events and make memories that last a lifetime in Victoria Garden City
            </p>
            <Link
              href="/discover"
              className="inline-block bg-white text-[#353595] px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Discover events
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            There is something here for everyone
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            From dance parties to power talks, there's something for everyone in VGC
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.name}
                  href={`/discover?category=${category.slug}`}
                  className="p-6 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
                >
                  <Icon className="text-3xl mb-2 mx-auto text-[#353595]" />
                  <p className="font-medium text-sm text-gray-900">{category.name}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Event Organizers Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Planning an event? Selling tickets has never been easier
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                Sell tickets online, promote your event, and manage everything in one place.
              </p>
              <Link
                href="/dashboard"
                className="inline-block bg-[#353595] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#2a276f] transition-colors"
              >
                Create an event
              </Link>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="aspect-video bg-[#353595] from-purple-100 to-pink-100 rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Ticketing so easy, it's magical
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            Fans and organizers agree: VGC Events is the simplest way to buy and sell tickets
          </p>
          <Link
            href="/how-it-works"
            className="block text-center text-[#353595] font-semibold mb-12 hover:text-[#2a276f]"
          >
            Learn more →
          </Link>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-2xl text-[#353595]" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Real people, real rave reviews!
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow">
                <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                <p className="font-semibold">{testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const categories = [
  { name: "Community", slug: "community", icon: FaUsers },
  { name: "Art & Culture", slug: "art-culture", icon: FaPalette },
  { name: "Sports & Wellness", slug: "sports-wellness", icon: FaDumbbell },
  { name: "Career & Business", slug: "career-business", icon: FaBriefcase },
  { name: "Food & Drink", slug: "food-drink", icon: FaUtensils },
  { name: "Entertainment", slug: "entertainment", icon: FaMasksTheater },
];

const features = [
  {
    title: "Ticketing",
    icon: FaTicket,
    description: "Create, promote, and sell tickets to your live or virtual events on mobile"
  },
  {
    title: "Fast Checkout",
    icon: FaBolt,
    description: "Fans are guaranteed a seamless experience from browsing to buying"
  },
  {
    title: "Sales Dashboard",
    icon: FaChartLine,
    description: "Track ticket sales, revenue and your next payout in our data-driven platform"
  },
  {
    title: "Box Office",
    icon: FaBuilding,
    description: "Build your brand with a website for ongoing events and products"
  },
];

const testimonials = [
  {
    quote: "Working with VGC Events has been really great because ticketing and check-ins have become the easiest parts of our event.",
    author: "Event Organizer"
  },
  {
    quote: "The platform is so intuitive and easy to use. Our attendees love the smooth checkout experience.",
    author: "Community Leader"
  },
  {
    quote: "VGC Events helped us sell out our event in record time. Highly recommended!",
    author: "Business Owner"
  },
];
