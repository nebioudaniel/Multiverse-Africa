// app/contact/page.tsx
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import NavBar from "../../components/Navbar/page";
import Footer from "@/components/footer/page";
import { toast, Toaster } from "sonner"; // Toaster imported
import { Loader2, Mail, Phone, MapPin, Building2 } from "lucide-react";
import Image from "next/image";

// --- Company Information Placeholder ---
const COMPANY_INFO = {
  name: "Multivers Africa",
  tagline: "Trade Without Borders, Building the Growth Without Limits",
  email: "contact@multiverseafrica.com",
  phone: "+251 91 12 21 567",
  address: "Gotera, Addis Ababa, Ethiopia",
  description:
    "With over two decades of experience, we have earned the trust of governments, enterprises, financial institutions, and global suppliers. Through our subsidiaries, Multiverse aligns local expertise with international partnerships, making us a bridge between Ethiopia, Africa, and the world.",
};

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    interestedIn: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSelectChange = (name: string, value: string) => {
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/store-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        // --- Success Message ---
        toast.success("🎉 Message Successfully Delivered", {
          description:
            "Your message has been received! A team member will review your inquiry and respond within 1-2 business days.",
          duration: 5000,
        });

        // Reset form
        setForm({
          name: "",
          email: "",
          interestedIn: "",
          phone: "",
          message: "",
        });
      } else {
        const errorData = await res.json();
        toast.error("Error Submitting Message", {
          description:
            errorData.message || "An unexpected error occurred. Please try again or contact us directly by phone.",
        });
      }
    } catch {
      toast.error("Network Error", {
        description:
          "Could not establish connection. Please check your internet and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />

      <section className="min-h-[70vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        
        <div className="w-full max-w-6xl">
          <div className="text-center mb-12">
            
            {/* --- Image Alignment and Sizing --- */}
            <div className="flex justify-center mb-6"> 
                <Image
                src="/h.png"
                className="h-16 w-auto" 
                width={100} 
                height={64} 
                priority
                alt={`${COMPANY_INFO.name} Logo`}
                />
            </div>

            <h1 className="text-2xl font-extrabold text-gray-900 sm:text-5xl">
              Get In Touch
            </h1>
            <p className="mt-3 text-xl text-gray-600">
              We are here to help you drive the future.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* 1. Company Information Card (Left Column) */}
            <Card className="lg:w-1/3 p-8 lg:p-10 shadow-lg border-t-4 border-blue-600">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {COMPANY_INFO.name}
              </h2>
              <p className="text-gray-600 mb-8">{COMPANY_INFO.description}</p>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email Us</p>
                    <a href={`mailto:${COMPANY_INFO.email}`} className="text-gray-800 hover:text-blue-600">
                      {COMPANY_INFO.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Call Us</p>
                    <a href={`tel:${COMPANY_INFO.phone}`} className="text-gray-800 hover:text-blue-600">
                      {COMPANY_INFO.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <MapPin className="w-5 h-5 mt-1 text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Our Location</p>
                    <p className="text-gray-800">{COMPANY_INFO.address}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* 2. Contact Form Card (Right Column) */}
            <Card className="lg:w-2/3 p-8 lg:p-10 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">
                Send us a Message
              </h2>
              <form className="space-y-6" onSubmit={onSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      name="name"
                      value={form.name}
                      onChange={onChange}
                      placeholder="Full Name"
                      required
                    />

                    <Input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={onChange}
                      placeholder="Email Address"
                      required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Select
                      value={form.interestedIn}
                      onValueChange={(v) => onSelectChange("interestedIn", v)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Interested In (e.g., Application, Support)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="application">Vehicle Application</SelectItem>
                        <SelectItem value="partnership">Partnership/Investment</SelectItem>
                        <SelectItem value="support">Technical Support</SelectItem>
                        <SelectItem value="general">General Inquiry</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Input
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={onChange}
                      placeholder="Phone Number (Optional)"
                    />
                </div>

                <Textarea
                  name="message"
                  value={form.message}
                  onChange={onChange}
                  placeholder="Your Message/Detailed Inquiry"
                  required
                  rows={6}
                />

                <Button 
                    type="submit" 
                    className="w-full py-7 bg-blue-600 hover:bg-blue-700 text-lg" 
                    disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Submit Message"
                  )}
                </Button>
              </form>
            </Card>

          </div>
        </div>
      </section>

      <Footer />
      {/* --- FIXED: Changed position to top-center for a centered display --- */}
      <Toaster richColors position="top-center" />
    </>
  );
}