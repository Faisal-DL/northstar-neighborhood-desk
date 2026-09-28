"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft, ArrowRight, CalendarDays, Check, CheckCircle2, ChevronRight,
  Clock3, Compass, FileText, Lightbulb, MapPin, RotateCcw, Search,
  ShieldCheck, Sparkles, Wrench,
} from "lucide-react";
import { journeyEvent } from "@/lib/analytics";

type Screen = "home" | "report" | "report-review" | "report-done" | "track" | "track-result" | "book" | "book-done";
type Report = { id: string; kind: string; location: string; details: string; status: string; created: string };
type Booking = { id: string; service: string; day: string; time: string };

const seedReport: Report = {
  id: "NS-1042", kind: "Streetlight", location: "Maple Street, near number 12",
  details: "The streetlight beside the crossing is not working.",
  status: "In progress", created: "Demo report",
};
const kinds = ["Streetlight", "Road or pavement", "Waste collection", "Other"];
const services = ["Housing advice", "Permits and forms", "General help"];
const days = [
  { label: "Today", caption: "Fully booked", slots: [] as string[] },
  { label: "Tomorrow", caption: "2 times", slots: ["09:30", "14:00"] },
  { label: "Next day", caption: "2 times", slots: ["10:15", "16:30"] },
];

function readStored<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  } catch {
    return fallback;
  }
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("home");
  const [reports, setReports] = useState<Report[]>(() => typeof window === "undefined" ? [] : readStored<Report[]>("northstar-reports", []));
  const [bookings, setBookings] = useState<Booking[]>(() => typeof window === "undefined" ? [] : readStored<Booking[]>("northstar-bookings", []));
  const [kind, setKind] = useState("");
  const [location, setLocation] = useState("");
  const [details, setDetails] = useState("");
  const [reportError, setReportError] = useState("");
  const [latestReport, setLatestReport] = useState<Report | null>(null);
  const [lookup, setLookup] = useState("NS-1042");
  const [foundReport, setFoundReport] = useState<Report | null>(null);
  const [lookupError, setLookupError] = useState("");
  const [service, setService] = useState(services[0]);
  const [dayIndex, setDayIndex] = useState(0);
  const [time, setTime] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [latestBooking, setLatestBooking] = useState<Booking | null>(null);

  useEffect(() => { window.localStorage.setItem("northstar-reports", JSON.stringify(reports)); }, [reports]);
  useEffect(() => { window.localStorage.setItem("northstar-bookings", JSON.stringify(bookings)); }, [bookings]);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [screen]);

  const goHome = () => setScreen("home");
  const startReport = () => {
    setKind(""); setLocation(""); setDetails(""); setReportError("");
    journeyEvent("report_started"); setScreen("report");
  };
  const reviewReport = () => {
    if (!kind) return setReportError("Choose the type of issue first.");
    if (location.trim().length < 6) return setReportError("Add a street and a nearby landmark so the team can find it.");
    if (details.trim().length < 12) return setReportError("Add a little more detail about what you noticed.");
    setReportError(""); setScreen("report-review");
  };
  const submitReport = () => {
    const report: Report = {
      id: `NS-${1043 + reports.length}`, kind, location: location.trim(),
      details: details.trim(), status: "Received", created: "Just now",
    };
    setReports((current) => [report, ...current]); setLatestReport(report);
    journeyEvent("report_completed", { issue_type: kind }); setScreen("report-done");
  };
  const startTrack = () => { setLookup("NS-1042"); setLookupError(""); journeyEvent("tracking_started"); setScreen("track"); };
  const searchReport = () => {
    const match = [seedReport, ...reports].find((report) => report.id.toLowerCase() === lookup.trim().toLowerCase());
    if (!match) return setLookupError("We couldn't find that reference. Try NS-1042 for the demo report.");
    setLookupError(""); setFoundReport(match);
    journeyEvent("tracking_completed", { status: match.status }); setScreen("track-result");
  };
  const startBooking = () => {
    setService(services[0]); setDayIndex(0); setTime(""); setBookingError("");
    journeyEvent("booking_started"); setScreen("book");
  };
  const submitBooking = () => {
    if (!time) return setBookingError("Choose an available time to continue.");
    const booking: Booking = { id: `AP-${3021 + bookings.length}`, service, day: days[dayIndex].label, time };
    setBookings((current) => [booking, ...current]); setLatestBooking(booking);
    journeyEvent("booking_completed", { service }); setScreen("book-done");
  };
  const resetDemo = () => {
    if (!window.confirm("Reset reports and bookings on this device?")) return;
    window.localStorage.removeItem("northstar-reports");
    window.localStorage.removeItem("northstar-bookings");
    setReports([]); setBookings([]); setScreen("home");
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={goHome} aria-label="Northstar home">
          <span className="brand-mark"><Compass size={23} strokeWidth={2.2} /></span>
          <span><strong>northstar</strong><small>service desk</small></span>
        </button>
        <span className="demo-pill"><span className="demo-dot" /> Demo mode</span>
      </header>

      <main className="main-content">
        {screen === "home" && <>
          <section className="hero surface">
            <div className="hero-copy">
              <span className="eyebrow"><Sparkles size={14} /> SIMPLE HELP, RIGHT HERE</span>
              <h1>What can we help<br /><em>you with today?</em></h1>
              <p>Report a local issue, check an update, or find time to talk. No account needed.</p>
            </div>
            <div className="hero-art" aria-hidden="true">
              <div className="orbit orbit-one" /><div className="orbit orbit-two" />
              <div className="hero-icon"><Lightbulb size={38} strokeWidth={1.7} /></div>
              <div className="tiny-star star-one">✦</div><div className="tiny-star star-two">✧</div>
            </div>
          </section>

          <div className="section-heading"><span>CHOOSE A PATH</span><span>01 / 03</span></div>
          <section className="action-grid" aria-label="Services">
            <button className="action-card surface" onClick={startReport}>
              <span className="action-icon blue"><Wrench size={24} /></span>
              <span className="action-text"><strong>Report an issue</strong><small>Tell us what needs attention nearby.</small></span>
              <span className="circle-arrow"><ArrowRight size={19} /></span>
            </button>
            <button className="action-card surface" onClick={startTrack}>
              <span className="action-icon peach"><Search size={24} /></span>
              <span className="action-text"><strong>Track a report</strong><small>See what is happening with a request.</small></span>
              <span className="circle-arrow"><ArrowRight size={19} /></span>
            </button>
            <button className="action-card surface" onClick={startBooking}>
              <span className="action-icon lilac"><CalendarDays size={24} /></span>
              <span className="action-text"><strong>Book a visit</strong><small>Find a short appointment with our team.</small></span>
              <span className="circle-arrow"><ArrowRight size={19} /></span>
            </button>
          </section>

          <section className="demo-note surface">
            <span className="note-icon"><ShieldCheck size={20} /></span>
            <div><strong>Ready to explore</strong><p>This is a self-contained demo. Try tracking reference <b>NS-1042</b>, or create your own report and booking.</p></div>
          </section>
        </>}

        {screen === "report" && <>
          <PageHead back={goHome} eyebrow="REPORT AN ISSUE" title="Something needs attention?" sub="A few details will help the team find and understand it." />
          <section className="form-card surface">
            <div className="step-row"><span className="step-number">01</span><div><strong>What happened?</strong><small>Pick the closest match.</small></div></div>
            <div className="choice-grid" role="group" aria-label="Issue type">
              {kinds.map((item) => <button key={item} type="button" className={`choice ${kind === item ? "selected" : ""}`} onClick={() => { setKind(item); setReportError(""); }} aria-pressed={kind === item}>{item}{kind === item && <Check size={16} />}</button>)}
            </div>
            <div className="field-group"><label htmlFor="report-location">Where is it?</label><span className="field-hint">Street and nearest landmark</span><div className="input-wrap"><MapPin size={19} /><input id="report-location" value={location} onChange={(e) => { setLocation(e.target.value); setReportError(""); }} placeholder="e.g. Maple Street, near number 12" /></div></div>
            <div className="field-group"><label htmlFor="report-details">What did you notice?</label><textarea id="report-details" value={details} onChange={(e) => { setDetails(e.target.value); setReportError(""); }} placeholder="Describe the issue in a sentence or two..." rows={4} /></div>
            {reportError && <p className="field-error" role="alert">{reportError}</p>}
            <button className="primary-button" onClick={reviewReport}>Review report <ArrowRight size={18} /></button>
          </section>
        </>}

        {screen === "report-review" && <>
          <PageHead back={() => setScreen("report")} eyebrow="ONE LAST LOOK" title="Check your report" sub="Make sure these details will help us find the issue." />
          <section className="form-card surface review-card">
            <InfoRow label="Issue" value={kind} /><InfoRow label="Location" value={location} /><InfoRow label="Details" value={details} />
            <div className="review-actions"><button className="text-button" onClick={() => setScreen("report")}>Edit details</button><button className="primary-button" onClick={submitReport}>Send report <ArrowRight size={18} /></button></div>
          </section>
        </>}

        {screen === "report-done" && latestReport && <>
          <SuccessHead title="Report sent." sub="We have your report and will take a look." />
          <section className="form-card surface success-card"><span className="caption">YOUR REFERENCE</span><strong className="reference">{latestReport.id}</strong><p>Keep this number to check the latest update. Your report is saved on this device.</p><button className="primary-button" onClick={() => { setLookup(latestReport.id); setFoundReport(latestReport); setScreen("track-result"); }}>View report <ArrowRight size={18} /></button></section>
          <button className="below-link" onClick={goHome}>Back to home</button>
        </>}

        {screen === "track" && <>
          <PageHead back={goHome} eyebrow="TRACK A REPORT" title="Let's find your update." sub="Enter a reference to see the latest status." />
          <section className="form-card surface"><div className="field-group"><label htmlFor="lookup">Report reference</label><div className="input-wrap"><FileText size={19} /><input id="lookup" value={lookup} onChange={(e) => { setLookup(e.target.value); setLookupError(""); }} onKeyDown={(e) => { if (e.key === "Enter") searchReport(); }} placeholder="NS-1042" /></div><span className="field-hint">A demo report is ready: NS-1042</span></div>{lookupError && <p className="field-error" role="alert">{lookupError}</p>}<button className="primary-button" onClick={searchReport}>Find report <ArrowRight size={18} /></button></section>
        </>}

        {screen === "track-result" && foundReport && <>
          <PageHead back={() => setScreen("track")} eyebrow="REPORT UPDATE" title="Here's the latest." sub={`Reference ${foundReport.id}`} />
          <section className="form-card surface"><div className="status-top"><span className="status-badge"><span /> {foundReport.status}</span><span className="muted-small">{foundReport.created}</span></div><h2 className="result-title">{foundReport.kind}</h2><p className="result-location"><MapPin size={17} />{foundReport.location}</p><p className="result-description">{foundReport.details}</p><div className="timeline"><div className="timeline-item done"><span className="timeline-dot"><Check size={12} /></span><div><strong>Report received</strong><small>We have the details.</small></div></div><div className={`timeline-item ${foundReport.status === "In progress" ? "done" : ""}`}><span className="timeline-dot">{foundReport.status === "In progress" ? <Check size={12} /> : null}</span><div><strong>Team review</strong><small>{foundReport.status === "In progress" ? "The team is looking into it." : "This is the next step."}</small></div></div><div className="timeline-item"><span className="timeline-dot" /><div><strong>Resolved</strong><small>We will update this status when complete.</small></div></div></div></section>
          <button className="below-link" onClick={goHome}>Back to home</button>
        </>}

        {screen === "book" && <>
          <PageHead back={goHome} eyebrow="BOOK A VISIT" title="Let's make time to talk." sub="Choose what you need help with, then pick a time." />
          <section className="form-card surface"><div className="field-group"><label htmlFor="service">What is your visit about?</label><div className="select-wrap"><select id="service" value={service} onChange={(e) => setService(e.target.value)}>{services.map((item) => <option key={item}>{item}</option>)}</select><ChevronRight size={19} /></div></div><div className="field-group"><label>Pick a day</label><div className="day-grid" role="group" aria-label="Appointment day">{days.map((item, index) => <button key={item.label} type="button" className={`day-choice ${dayIndex === index ? "selected" : ""}`} onClick={() => { setDayIndex(index); setTime(""); setBookingError(""); }} aria-pressed={dayIndex === index}><strong>{item.label}</strong><small>{item.caption}</small></button>)}</div></div><div className="field-group"><label>Available times</label>{days[dayIndex].slots.length ? <div className="slot-grid" role="group" aria-label="Appointment time">{days[dayIndex].slots.map((slot) => <button key={slot} type="button" className={`slot ${time === slot ? "selected" : ""}`} onClick={() => { setTime(slot); setBookingError(""); }} aria-pressed={time === slot}><Clock3 size={16} />{slot}</button>)}</div> : <div className="empty-slots"><CalendarDays size={22} /><span>No times left today. Try another day above.</span></div>}</div>{bookingError && <p className="field-error" role="alert">{bookingError}</p>}<button className="primary-button" onClick={submitBooking}>Confirm visit <ArrowRight size={18} /></button></section>
        </>}

        {screen === "book-done" && latestBooking && <>
          <SuccessHead title="You're booked." sub="Your appointment is saved on this device." />
          <section className="form-card surface success-card"><span className="caption">YOUR VISIT</span><strong className="booking-summary">{latestBooking.day} at {latestBooking.time}</strong><p>{latestBooking.service} · Reference {latestBooking.id}</p><button className="primary-button" onClick={goHome}>Done <ArrowRight size={18} /></button></section>
        </>}
      </main>

      <footer className="footer"><span>Northstar Service Desk <span className="footer-separator">·</span> A local demo</span><button onClick={resetDemo}><RotateCcw size={14} /> Reset demo</button></footer>
    </div>
  );
}

function PageHead({ back, eyebrow, title, sub }: { back: () => void; eyebrow: string; title: string; sub: string }) {
  return <div className="page-head"><button className="back-button" onClick={back}><ArrowLeft size={18} /> Back</button><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{sub}</p></div>;
}
function SuccessHead({ title, sub }: { title: string; sub: string }) {
  return <div className="success-head"><span className="success-icon"><CheckCircle2 size={36} /></span><span className="eyebrow">ALL DONE</span><h1>{title}</h1><p>{sub}</p></div>;
}
function InfoRow({ label, value }: { label: string; value: string }) {
  return <div className="info-row"><span>{label}</span><strong>{value}</strong></div>;
}
