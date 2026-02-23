import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-8">
    <h2 className="font-display font-black text-lg mb-3 text-foreground">{title}</h2>
    <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">{children}</div>
  </div>
);

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border px-4 h-14 flex items-center gap-3">
        <Link to="/" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </Link>
        <span className="font-display font-black text-lg">Privacy Policy</span>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-8">
        <div className="mb-8">
          <div className="text-3xl mb-3">🔒</div>
          <h1 className="font-display font-black text-2xl mb-2">Your Privacy Matters</h1>
          <p className="text-sm text-muted-foreground">Last updated: February 19, 2026</p>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 mb-8">
          <p className="text-sm text-foreground font-semibold">
            MomCircle is built for moms, by moms. We collect only what we need, never sell your data, and put you in control of your information at every step.
          </p>
        </div>

        <Section title="1. Information We Collect">
          <p>We collect information you provide directly to us when you create an account, complete your profile, or use our services:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong className="text-foreground">Account information:</strong> email address, display name, and password (stored securely hashed).</li>
            <li><strong className="text-foreground">Profile information:</strong> neighborhood, kids' ages, interests, bio, and optional avatar photo.</li>
            <li><strong className="text-foreground">Location data:</strong> approximate neighborhood or city — never precise GPS coordinates stored without your explicit consent.</li>
            <li><strong className="text-foreground">Messages:</strong> messages you send to other members through our platform.</li>
            <li><strong className="text-foreground">Verification data:</strong> if you choose ID verification, this is processed by our third-party provider (Stripe Identity) and we receive only a verified/not-verified status.</li>
          </ul>
        </Section>

        <Section title="2. How We Use Your Information">
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Provide, maintain, and improve MomCircle services.</li>
            <li>Match you with nearby moms based on shared interests and location.</li>
            <li>Send notifications about playdates, messages, and connections (you can opt out anytime).</li>
            <li>Detect and prevent fraud, abuse, and safety violations.</li>
            <li>Comply with legal obligations.</li>
          </ul>
        </Section>

        <Section title="3. Information Sharing">
          <p>We do <strong className="text-foreground">not</strong> sell, trade, or rent your personal data to third parties.</p>
          <p>We share information only:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong className="text-foreground">With other members:</strong> your public profile (name, neighborhood, interests, avatar) is visible to verified members only.</li>
            <li><strong className="text-foreground">Service providers:</strong> trusted partners like Stripe (payments & verification) who are contractually bound to protect your data.</li>
            <li><strong className="text-foreground">Legal requirements:</strong> if required by law or to protect the safety of our users.</li>
          </ul>
        </Section>

        <Section title="4. Children's Privacy">
          <p>MomCircle is designed for adults (18+). We do not knowingly collect information from minors.</p>
          <p><strong className="text-foreground">No photos of children are permitted on the platform.</strong> This policy exists to protect the privacy and safety of all children. Profiles containing children's photos will be removed immediately.</p>
        </Section>

        <Section title="5. Data Security">
          <p>We use industry-standard encryption (TLS/SSL) for all data in transit. Passwords are hashed using bcrypt. We never store plain-text passwords or payment card numbers.</p>
          <p>Our platform undergoes regular security reviews and we promptly address any vulnerabilities discovered.</p>
        </Section>

        <Section title="6. Your Rights & Choices">
          <ul className="list-disc pl-5 space-y-1">
            <li><strong className="text-foreground">Access & Correction:</strong> View and update your profile information at any time in Settings.</li>
            <li><strong className="text-foreground">Deletion:</strong> Request account deletion by contacting us at privacy@momcircle.app — we'll process within 30 days.</li>
            <li><strong className="text-foreground">Notification opt-out:</strong> Manage push notification preferences in your Profile settings.</li>
            <li><strong className="text-foreground">Data export:</strong> Request a copy of your data at any time.</li>
          </ul>
        </Section>

        <Section title="7. Cookies & Analytics">
          <p>We use minimal, privacy-respecting analytics to understand how our app is used and improve the experience. We do not use third-party advertising cookies.</p>
        </Section>

        <Section title="8. Contact Us">
          <p>Questions about this policy? We're here to help:</p>
          <p className="text-foreground font-semibold">privacy@momcircle.app</p>
          <p>MomCircle · New Braunfels, TX</p>
        </Section>
      </div>

      <footer className="px-5 py-6 border-t border-border text-center">
        <div className="flex justify-center gap-4 text-xs text-muted-foreground">
          <Link to="/safety" className="hover:text-foreground transition">Safety</Link>
          <Link to="/terms" className="hover:text-foreground transition">Terms</Link>
          <Link to="/" className="hover:text-foreground transition">Home</Link>
        </div>
      </footer>
    </div>
  );
}
