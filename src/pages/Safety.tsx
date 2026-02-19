import { Link } from "react-router-dom";
import { ArrowLeft, Shield, CheckCircle2 } from "lucide-react";

const SafetyCard = ({ emoji, title, points }: { emoji: string; title: string; points: string[] }) => (
  <div className="bg-card border border-border rounded-2xl p-5 shadow-card mb-4">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-lg flex-shrink-0 shadow-soft">
        {emoji}
      </div>
      <h3 className="font-display font-black text-base">{title}</h3>
    </div>
    <ul className="space-y-2">
      {points.map((p, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
          <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
          <span>{p}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default function Safety() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border px-4 h-14 flex items-center gap-3">
        <Link to="/" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </Link>
        <span className="font-display font-black text-lg">Safety Center</span>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-8">
        {/* Hero */}
        <div className="mb-8 text-center">
          <div className="w-16 h-16 rounded-3xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-soft">
            <Shield className="h-8 w-8 text-white" fill="white" />
          </div>
          <h1 className="font-display font-black text-2xl mb-2">Your Safety Is Our Priority</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Every decision we make at MomCircle is filtered through one question: does this keep our community safe? Here's how we protect you.
          </p>
        </div>

        {/* Trust badge */}
        <div className="gradient-hero border border-primary/20 rounded-2xl p-4 mb-8 text-center">
          <p className="text-sm font-bold text-foreground">
            🛡️ All verified members have completed ID verification. Look for the blue shield on profiles.
          </p>
        </div>

        {/* Safety features */}
        <SafetyCard
          emoji="🪪"
          title="ID Verification"
          points={[
            "Every member can verify their real identity through our secure ID verification partner.",
            "Verified status is displayed with a blue shield badge — giving you confidence before you connect.",
            "Your ID data is processed by Stripe Identity and never stored on our servers.",
            "Verification is optional but strongly encouraged and displayed prominently.",
          ]}
        />

        <SafetyCard
          emoji="🤝"
          title="Mutual Match Before Messaging"
          points={[
            "Neither party can send messages until both have expressed interest.",
            "This prevents unsolicited contact from strangers.",
            "You are always in control of who can reach you.",
          ]}
        />

        <SafetyCard
          emoji="📸"
          title="No Children's Photos Policy"
          points={[
            "Profile photos of children are strictly prohibited on MomCircle.",
            "This is a non-negotiable policy to protect the privacy of all children.",
            "Accounts violating this policy are removed immediately without appeal.",
            "You should never share photos that identify your child's location or routine.",
          ]}
        />

        <SafetyCard
          emoji="🏞️"
          title="Meet in Public First"
          points={[
            "We strongly recommend all first playdates happen in public parks or community spaces.",
            "Our Park Map highlights safe, well-known meeting locations in your neighborhood.",
            "Never share your home address before establishing trust.",
            "Bring a friend or another family to your first meetup.",
          ]}
        />

        <SafetyCard
          emoji="🚨"
          title="Reporting & Blocking"
          points={[
            "Report any profile or message that makes you uncomfortable — we review within 24 hours.",
            "Block any member instantly — they will not be notified.",
            "Zero tolerance for harassment, threats, or inappropriate content.",
            "Our safety team reviews all reports and takes appropriate action.",
          ]}
        />

        {/* Emergency section */}
        <div className="bg-destructive/10 border border-destructive/30 rounded-2xl p-5 mb-8">
          <h3 className="font-display font-black text-base mb-2 text-destructive">In an Emergency</h3>
          <p className="text-sm text-muted-foreground mb-3">
            If you are in immediate danger, please call <strong className="text-foreground">911</strong> first. For non-emergency safety concerns on the platform:
          </p>
          <p className="text-sm font-bold text-foreground">safety@momcircle.app</p>
          <p className="text-xs text-muted-foreground mt-1">We respond to safety reports within 24 hours.</p>
        </div>

        {/* Safety tips */}
        <div className="mb-8">
          <h2 className="font-display font-black text-lg mb-4">Quick Safety Tips</h2>
          <div className="space-y-3">
            {[
              { emoji: "✅", tip: "Always meet for the first time in a busy public place like a park or café." },
              { emoji: "✅", tip: "Tell a trusted friend or family member where you're going and who you're meeting." },
              { emoji: "✅", tip: "Trust your instincts — if something feels off, it's okay to cancel." },
              { emoji: "✅", tip: "Keep communication on the MomCircle platform until you've built trust." },
              { emoji: "✅", tip: "Don't share personal details like your home address or workplace early on." },
              { emoji: "❌", tip: "Never share photos that show your children's faces publicly." },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <span className="text-base flex-shrink-0">{item.emoji}</span>
                <span className="text-muted-foreground">{item.tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="px-5 py-6 border-t border-border text-center">
        <div className="flex justify-center gap-4 text-xs text-muted-foreground">
          <Link to="/privacy" className="hover:text-foreground transition">Privacy</Link>
          <Link to="/terms" className="hover:text-foreground transition">Terms</Link>
          <Link to="/" className="hover:text-foreground transition">Home</Link>
        </div>
      </footer>
    </div>
  );
}
