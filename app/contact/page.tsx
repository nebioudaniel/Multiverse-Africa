"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import NavBar from "../../components/Navbar/page";
import Footer from "@/components/footer/page";
import { toast } from "sonner";
import Image from "next/image";
import { Loader2 } from "lucide-react";

type ContactData = {
  address: string;
  phoneNumbers: string[];
  emails: string[];
  hours?: string;
};

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    interestedIn: "",
    phone: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);

  // Note: The useEffect for fetching contact data was removed as per the user's request.
  // The 'data' state variable is now unused.

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast.success("Message sent 🎉", {
          description: "We’ve received your message and will reply soon.",
        });
        setForm({ name: "", email: "", interestedIn: "", phone: "", message: "" });
      } else {
        const errorData = await res.json();
        toast.error("Error sending message", {
          description: errorData.message || "Something went wrong. Please try again.",
        });
      }
    } catch {
      toast.error("Network error", {
        description: "Could not send your message. Please check your connection and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />

      {/* Header Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          {/* Logo */}
          <div className="mb-8">
            <Image src="/h.png" alt="Company Logo" width={160} height={90} className="mx-auto" />
          </div>
          <h1 className="text-5xl font-extrabold text-gray-900">Get in Touch</h1>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-lg">
            We’d love to hear from you. Please fill out the form below.
          </p>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
        
        {/* Contact Form */}
        <Card className="p-10 shadow-xl border border-gray-100 rounded-3xl transition-transform transform hover:scale-[1.01]">
          <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">Send us a message</h2>
          <form className="space-y-6" onSubmit={onSubmit}>
            <Input name="name" value={form.name} onChange={onChange} placeholder="Full Name" required />
            <Input name="email" type="email" value={form.email} onChange={onChange} placeholder="Email Address" required />
            <Select onValueChange={v => setForm(f => ({ ...f, interestedIn: v }))} value={form.interestedIn}>
              <SelectTrigger>
                <SelectValue placeholder="Interested In" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="services">Our Services</SelectItem>
                <SelectItem value="support">Support</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Input name="phone" value={form.phone} onChange={onChange} placeholder="Phone Number (Optional)" />
            <Textarea name="message" value={form.message} onChange={onChange} placeholder="Your Message" required rows={6} />
            <Button 
              type="submit" 
              className="w-full py-7 text-lg font-semibold bg-black hover:bg-black text-white transition-colors duration-200" 
              disabled={loading}
            >
              {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Submit Message"}
            </Button>
          </form>
        </Card>
      </section>

      {/* Map Section */}
      <section className="max-w-6xl mx-auto px-6 lg:px-8 pb-16">
        <div className="rounded-3xl overflow-hidden shadow-xl border border-gray-100">
          <iframe
            src="https://www.google.com/maps?q=Yeal%20Building%20Lafto%20View%20Addis%20Ababa&hl=en&z=17&output=embed"
            frameBorder="0"
            allowFullScreen
            className="w-full h-[500px]"
            title="Location Map"
          />
        </div>
      </section>

      <Footer />
    </>
  );
}