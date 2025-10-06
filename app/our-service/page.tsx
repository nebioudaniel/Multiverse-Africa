import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import NavBar from "@/components/Navbar/page";
import Footer from "@/components/footer/page";

// Define your service data here. You can easily add, remove, or modify services.
const services = [
  {
    title: "Construction & Consultancy",
    description:
      "We handle your projects by supplying high-end construction materials and providing expert guidance.",
    link: "/services/construction", // Use a unique link for each service page
  },
  {
    title: "Manufacturing",
    description:
      "We locally produce raw materials and provide services that are vital for production.",
    link: "/services/manufacturing",
  },
  {
    title: "Electronics",
    description:
      "We import and distribute a wide range of consumer electronics and home appliances.",
    link: "/services/electronics",
  },
  {
    title: "Export",
    description:
      "We export locally produced agricultural goods to the global market, connecting local producers with international buyers.",
    link: "/services/export",
  },
  {
    title: "Tenders",
    description:
      "We offer the best quality and price for our goods and services, helping you secure key business tenders.",
    link: "/services/tenders",
  },
  {
    title: "Import",
    description:
      "We specialize in sourcing and importing high-quality goods and products from around the world to meet our clients' diverse needs.",
    link: "/services/import",
  },
  {
    title: "Trade Representation",
    description:
      "We act as your trusted legal representative, facilitating and managing your business ventures to ensure seamless operations.",
    link: "/services/trade-representation",
  },
  {
    title: "Financial Services",
    description:
      "We provide crucial financial support for a variety of projects, offering the resources you need to turn your ideas into reality.",
    link: "/services/financial-services",
  },
];

export default function OurServicesPage() {
  return (
    <>
    <NavBar />
    <div className="container mx-auto py-31 px-4">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
        Our Services
      </h1>
      <p className="text-lg md:text-xl text-center text-muted-foreground max-w-2xl mx-auto mb-12">
        We provide a comprehensive range of professional services designed to meet your diverse business and project needs. Our expertise spans from high-end construction to global trade, all delivered with a commitment to quality and excellence.
      </p>

      {/* This is the responsive grid layout for the service cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <Card key={service.title} className="flex flex-col h-full">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">
                {service.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground">{service.description}</p>
            </CardContent>
            <div className="p-6 pt-0">
              <Button asChild>
                <Link href={service.link}>Read More</Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
    <Footer/>
    </>
  );
}