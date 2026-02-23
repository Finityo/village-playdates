import { useState } from "react";
import { MoreVertical, ShieldBan, Flag, ShieldOff } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const REPORT_REASONS = [
  "Fake or misleading profile",
  "Inappropriate content",
  "Harassment or threatening behavior",
  "Spam or solicitation",
  "Child photo violation",
  "Other",
];

interface ReportBlockMenuProps {
  isBlocked: boolean;
  loading: boolean;
  onBlock: () => void;
  onUnblock: () => void;
  onReport: (reason: string, details?: string) => void;
  userName: string;
}

export function ReportBlockMenu({ isBlocked, loading, onBlock, onUnblock, onReport, userName }: ReportBlockMenuProps) {
  const [showReport, setShowReport] = useState(false);
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [details, setDetails] = useState("");

  const handleSubmitReport = () => {
    if (!selectedReason) return;
    onReport(selectedReason, details.trim() || undefined);
    setShowReport(false);
    setSelectedReason("");
    setDetails("");
  };

  const handleBlock = () => {
    onBlock();
    setShowBlockConfirm(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-2.5 rounded-full bg-white/80 backdrop-blur shadow-soft hover:bg-white transition">
            <MoreVertical className="h-5 w-5 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuItem onClick={() => setShowReport(true)} className="gap-2 text-destructive focus:text-destructive">
            <Flag className="h-4 w-4" /> Report {userName.split(" ")[0]}
          </DropdownMenuItem>
          {isBlocked ? (
            <DropdownMenuItem onClick={onUnblock} disabled={loading} className="gap-2">
              <ShieldOff className="h-4 w-4" /> Unblock {userName.split(" ")[0]}
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => setShowBlockConfirm(true)} className="gap-2 text-destructive focus:text-destructive">
              <ShieldBan className="h-4 w-4" /> Block {userName.split(" ")[0]}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Report Dialog */}
      <Dialog open={showReport} onOpenChange={setShowReport}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display">Report {userName}</DialogTitle>
            <DialogDescription>
              Our safety team reviews all reports within 24 hours. Select a reason below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            {REPORT_REASONS.map((reason) => (
              <button
                key={reason}
                onClick={() => setSelectedReason(reason)}
                className={`w-full text-left text-sm font-semibold px-4 py-3 rounded-xl border transition ${
                  selectedReason === reason
                    ? "bg-primary/10 border-primary text-primary"
                    : "bg-muted/40 border-border text-foreground hover:bg-muted"
                }`}
              >
                {reason}
              </button>
            ))}
          </div>
          {selectedReason && (
            <Textarea
              placeholder="Additional details (optional)"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="resize-none"
              maxLength={500}
              rows={3}
            />
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReport(false)}>Cancel</Button>
            <Button
              onClick={handleSubmitReport}
              disabled={!selectedReason || loading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Submit Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Block Confirmation Dialog */}
      <Dialog open={showBlockConfirm} onOpenChange={setShowBlockConfirm}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display">Block {userName}?</DialogTitle>
            <DialogDescription>
              {userName.split(" ")[0]} won't be able to message you or see your profile. They won't be notified. You can unblock anytime.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBlockConfirm(false)}>Cancel</Button>
            <Button
              onClick={handleBlock}
              disabled={loading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Block
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
