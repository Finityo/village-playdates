import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-8">
    <h2 className="font-display font-black text-lg mb-3 text-foreground">{title}</h2>
    <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">{children}</div>
  </div>
);

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border px-4 h-14 flex items-center gap-3">
        <Link to="/" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </Link>
        <span className="font-display font-black text-lg">Terms of Service</span>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-8">
        <div className="mb-8">
          <div className="text-3xl mb-3">📋</div>
          <h1 className="font-display font-black text-2xl mb-2">Terms of Service</h1>
          <p className="text-sm text-muted-foreground">Last updated: February 19, 2025</p>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 mb-8">
          <p className="text-sm text-foreground font-semibold">
            By using MomCircle, you agree to these terms. Please read them carefully — they're written in plain language, not legalese.
          </p>
        </div>

        <Section title="1. Who Can Use MomCircle">
          <p>MomCircle is available to adults aged 18 and older. By creating an account, you confirm that:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>You are at least 18 years of age.</li>
            <li>You are a parent, guardian, or primary caregiver of at least one child.</li>
            <li>The information you provide is accurate and truthful.</li>
            <li>You will use the platform only for its intended purpose — connecting with other moms and planning playdates.</li>
          </ul>
        </Section>

        <Section title="2. Your Account">
          <p>You are responsible for maintaining the security of your account. Please:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Use a strong, unique password for your MomCircle account.</li>
            <li>Never share your login credentials with anyone.</li>
            <li>Notify us immediately at support@momcircle.app if you suspect unauthorized access.</li>
          </ul>
          <p>We reserve the right to suspend or terminate accounts that violate these terms.</p>
        </Section>

        <Section title="3. Community Rules">
          <p>MomCircle is a community built on trust and respect. The following are strictly prohibited:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong className="text-foreground">No photos of children</strong> on any profile or in any message. This policy is non-negotiable and violations result in immediate removal.</li>
            <li>Harassment, threats, hate speech, or discriminatory behavior of any kind.</li>
            <li>Creating fake profiles or misrepresenting your identity.</li>
            <li>Soliciting money, selling products, or spamming other members.</li>
            <li>Sharing another member's personal information without consent (doxxing).</li>
            <li>Any activity that violates local, state, or federal law.</li>
          </ul>
        </Section>

        <Section title="4. Content You Share">
          <p>When you post content on MomCircle (profile info, messages, playdate details), you:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Retain ownership of your content.</li>
            <li>Grant MomCircle a limited license to display it to other members as part of the service.</li>
            <li>Are responsible for ensuring your content complies with these terms and applicable laws.</li>
          </ul>
          <p>We reserve the right to remove any content that violates our community rules without notice.</p>
        </Section>

        <Section title="5. Safety & Meetings">
          <p>MomCircle facilitates connections between members, but we are not responsible for in-person meetings. When meeting other members:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Always meet in public places for the first time.</li>
            <li>Use your best judgment about who to meet and when.</li>
            <li>MomCircle does not conduct background checks on all members (ID verification is voluntary).</li>
          </ul>
          <p>Please review our <Link to="/safety" className="text-primary font-semibold underline">Safety Center</Link> for detailed guidelines.</p>
        </Section>

        <Section title="6. Premium Services">
          <p>MomCircle offers free and premium membership tiers. For premium subscriptions:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Billing occurs monthly or annually, as selected at purchase.</li>
            <li>You may cancel at any time — your premium access continues until the end of the billing period.</li>
            <li>Refunds are available within 7 days of purchase if you haven't used premium features.</li>
            <li>Prices may change with 30 days' advance notice.</li>
          </ul>
        </Section>

        <Section title="7. Privacy">
          <p>Your privacy is important to us. Our <Link to="/privacy" className="text-primary font-semibold underline">Privacy Policy</Link> explains how we collect, use, and protect your information. By using MomCircle, you also agree to our Privacy Policy.</p>
        </Section>

        <Section title="8. Disclaimers & Limitations">
          <p>MomCircle is provided "as is." While we work hard to keep the platform safe and reliable:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>We cannot guarantee that all members are who they say they are.</li>
            <li>We are not liable for the actions of our members in-person or online.</li>
            <li>Service availability may be interrupted for maintenance or due to circumstances beyond our control.</li>
          </ul>
        </Section>

        <Section title="9. Changes to These Terms">
          <p>We may update these terms periodically. When we make significant changes, we'll notify you via email or in-app notification at least 14 days before the changes take effect. Continuing to use MomCircle after changes take effect constitutes acceptance of the new terms.</p>
        </Section>

        <Section title="10. Contact">
          <p>Questions about these terms? Get in touch:</p>
          <p className="text-foreground font-semibold">legal@momcircle.app</p>
          <p>MomCircle · New Braunfels, TX</p>
        </Section>
      </div>

      <footer className="px-5 py-6 border-t border-border text-center">
        <div className="flex justify-center gap-4 text-xs text-muted-foreground">
          <Link to="/privacy" className="hover:text-foreground transition">Privacy</Link>
          <Link to="/safety" className="hover:text-foreground transition">Safety</Link>
          <Link to="/" className="hover:text-foreground transition">Home</Link>
        </div>
      </footer>
    </div>
  );
}
