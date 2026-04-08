import { useState, useEffect, useRef } from "react";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const HOLIDAY_MAP = {
  "1-1": "New Year's Day",
  "1-15": "MLK Day",
  "2-14": "Valentine's Day",
  "3-17": "St. Patrick's Day",
  "4-22": "Earth Day",
  "5-26": "Memorial Day",
  "6-19": "Juneteenth",
  "7-4": "Independence Day",
  "9-1": "Labor Day",
  "10-31": "Halloween",
  "11-11": "Veterans Day",
  "11-27": "Thanksgiving",
  "12-25": "Christmas Day",
  "12-31": "New Year's Eve",
};

const MONTH_IMAGES = [
  { gradient: "linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)", label: "Winter Night", accent: "#e94560" },
  { gradient: "linear-gradient(135deg, #2d1b69 0%, #11998e 100%)", label: "Aurora", accent: "#f8f9fa" },
  { gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", label: "Spring Bloom", accent: "#fff" },
  { gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", label: "Clear Sky", accent: "#fff" },
  { gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", label: "Emerald", accent: "#fff" },
  { gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)", label: "Sunset", accent: "#fff" },
  { gradient: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)", label: "Lavender", accent: "#333" },
  { gradient: "linear-gradient(135deg, #fda085 0%, #f6d365 100%)", label: "Golden Hour", accent: "#fff" },
  { gradient: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)", label: "Ocean", accent: "#fff" },
  { gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #4facfe 100%)", label: "Autumn Mix", accent: "#fff" },
  { gradient: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)", label: "Deep Winter", accent: "#00b4d8" },
  { gradient: "linear-gradient(135deg, #1a1a2e 0%, #c0392b 100%)", label: "Festive", accent: "#f1c40f" },
];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}
function dateKey(y, m, d) { return `${y}-${m+1}-${d}`; }
function isSameDay(a, b) { return a && b && a.y===b.y && a.m===b.m && a.d===b.d; }
function isInRange(day, start, end) {
  if (!start || !end) return false;
  const t = new Date(day.y, day.m, day.d).getTime();
  const s = new Date(start.y, start.m, start.d).getTime();
  const e = new Date(end.y, end.m, end.d).getTime();
  return t > Math.min(s,e) && t < Math.max(s,e);
}
function isStart(day, start, end) { 
  if (!start || !end) return isSameDay(day, start);
  const s = new Date(start.y,start.m,start.d).getTime();
  const e = new Date(end.y,end.m,end.d).getTime();
  return isSameDay(day, s<e ? start : end);
}
function isEnd(day, start, end) {
  if (!start || !end) return false;
  const s = new Date(start.y,start.m,start.d).getTime();
  const e = new Date(end.y,end.m,end.d).getTime();
  return isSameDay(day, s<e ? end : start);
}

function getHoliday(y, m, d) {
  return HOLIDAY_MAP[`${m+1}-${d}`] || null;
}

export default function WallCalendar() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectStart, setSelectStart] = useState(null);
  const [selectEnd, setSelectEnd] = useState(null);
  const [hoverDay, setHoverDay] = useState(null);
  const [selecting, setSelecting] = useState(false);
  const [notes, setNotes] = useState({});
  const [monthNote, setMonthNote] = useState("");
  const [monthNotes, setMonthNotes] = useState({});
  const [activeTab, setActiveTab] = useState("month");
  const [theme, setTheme] = useState("light");
  const [animKey, setAnimKey] = useState(0);
  const notesRef = useRef(null);

  const imgInfo = MONTH_IMAGES[month];
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  useEffect(() => {
    const saved = localStorage.getItem("wallcal_notes");
    if (saved) setNotes(JSON.parse(saved));
    const savedMonthNotes = localStorage.getItem("wallcal_monthnotes");
    if (savedMonthNotes) setMonthNotes(JSON.parse(savedMonthNotes));
  }, []);

  useEffect(() => {
    const key = `${year}-${month}`;
    setMonthNote(monthNotes[key] || "");
  }, [year, month, monthNotes]);

  const saveMonthNote = (val) => {
    const key = `${year}-${month}`;
    const updated = { ...monthNotes, [key]: val };
    setMonthNotes(updated);
    localStorage.setItem("wallcal_monthnotes", JSON.stringify(updated));
    setMonthNote(val);
  };

  const handleDayClick = (d) => {
    if (!selecting) {
      setSelectStart({ y: year, m: month, d });
      setSelectEnd(null);
      setSelecting(true);
    } else {
      const clicked = { y: year, m: month, d };
      setSelectEnd(clicked);
      setSelecting(false);
      setActiveTab("range");
      setTimeout(() => notesRef.current?.focus(), 100);
    }
  };

  const getRangeLabel = () => {
    if (!selectStart) return "No range selected";
    if (!selectEnd) return `Start: ${MONTHS[selectStart.m]} ${selectStart.d}, ${selectStart.y}`;
    const s = new Date(selectStart.y, selectStart.m, selectStart.d);
    const e = new Date(selectEnd.y, selectEnd.m, selectEnd.d);
    const [from, to] = s < e ? [selectStart, selectEnd] : [selectEnd, selectStart];
    const diff = Math.round(Math.abs(e-s)/(1000*60*60*24));
    return `${MONTHS[from.m]} ${from.d} → ${MONTHS[to.m]} ${to.d}, ${to.y} (${diff} day${diff!==1?"s":""})`;
  };

  const getRangeNoteKey = () => {
    if (!selectStart || !selectEnd) return null;
    const s = new Date(selectStart.y, selectStart.m, selectStart.d);
    const e = new Date(selectEnd.y, selectEnd.m, selectEnd.d);
    const [from, to] = s < e ? [selectStart, selectEnd] : [selectEnd, selectStart];
    return `${from.y}-${from.m}-${from.d}_${to.y}-${to.m}-${to.d}`;
  };

  const saveRangeNote = (val) => {
    const key = getRangeNoteKey();
    if (!key) return;
    const updated = { ...notes, [key]: val };
    setNotes(updated);
    localStorage.setItem("wallcal_notes", JSON.stringify(updated));
  };

  const navigate = (dir) => {
    setAnimKey(k => k + 1);
    let m = month + dir;
    let y = year;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setMonth(m); setYear(y);
    setSelectStart(null); setSelectEnd(null); setSelecting(false);
  };

  const isDark = theme === "dark";

  const bg = isDark ? "#0d0d0d" : "#f5f2ee";
  const cardBg = isDark ? "#1a1a1a" : "#fff";
  const textPrimary = isDark ? "#f0ede8" : "#1a1704";
  const textSec = isDark ? "#888" : "#888";
  const border = isDark ? "#2a2a2a" : "#e8e4de";
  const accentBlue = "#2563eb";
  const accentRange = isDark ? "#1e3a5f" : "#dbeafe";
  const todayBg = isDark ? "#292900" : "#fef9c3";
  const todayText = isDark ? "#fef08a" : "#713f12";

  const previewEnd = selecting && hoverDay ? { y: year, m: month, d: hoverDay } : selectEnd;

  return (
    <div style={{ fontFamily: "'Georgia', 'Times New Roman', serif", background: bg, minHeight: "100vh", padding: "20px 12px", transition: "background 0.3s", color: textPrimary }}>
      
      {/* Top bar */}
      <div style={{ maxWidth: 960, margin: "0 auto 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 13, color: textSec, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "sans-serif" }}>Wall Calendar</div>
        <button onClick={() => setTheme(isDark ? "light" : "dark")} style={{ background: isDark ? "#2a2a2a" : "#e8e4de", border: "none", borderRadius: 20, padding: "6px 14px", cursor: "pointer", fontSize: 13, color: textPrimary, fontFamily: "sans-serif", transition: "all 0.2s" }}>
          {isDark ? "☀ Light" : "◑ Dark"}
        </button>
      </div>

      {/* Main card */}
      <div style={{ maxWidth: 960, margin: "0 auto", background: cardBg, borderRadius: 16, overflow: "hidden", border: `1px solid ${border}`, boxShadow: isDark ? "0 0 40px rgba(0,0,0,0.5)" : "0 4px 40px rgba(0,0,0,0.08)" }}>

        {/* Hero image panel */}
        <div key={animKey} style={{ background: imgInfo.gradient, minHeight: 180, position: "relative", overflow: "hidden", display: "flex", alignItems: "flex-end", padding: "24px 32px", animation: "fadeIn 0.5s ease" }}>
          <style>{`
            @keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes slideIn { from { opacity: 0; transform: translateX(-12px); } to { opacity: 1; transform: translateX(0); } }
            .day-cell:hover { transform: scale(1.08); z-index: 2; }
            .day-cell { transition: transform 0.12s, background 0.15s; }
            @media (max-width: 600px) {
              .cal-layout { flex-direction: column !important; }
              .notes-panel { border-left: none !important; border-top: 1px solid ${border} !important; }
            }
          `}</style>
          {/* Geometric SVG decoration */}
          <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0.15 }} viewBox="0 0 960 180" preserveAspectRatio="none">
            <polygon points="0,0 500,0 300,180 0,180" fill="white"/>
            <polygon points="960,0 700,0 900,180 960,180" fill="white"/>
          </svg>
          {/* Wave bottom shape */}
          <svg style={{ position: "absolute", bottom: -1, left: 0, width: "100%" }} viewBox="0 0 960 40" preserveAspectRatio="none">
            <path d="M0,40 L0,20 Q240,0 480,20 Q720,40 960,15 L960,40 Z" fill={cardBg}/>
          </svg>

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "sans-serif", marginBottom: 4 }}>{imgInfo.label} · {year}</div>
            <div style={{ fontSize: 52, fontWeight: 700, color: "#fff", lineHeight: 1, letterSpacing: "-0.02em", textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}>{MONTHS[month]}</div>
          </div>

          {/* Nav arrows */}
          <div style={{ position: "absolute", top: 20, right: 24, display: "flex", gap: 8 }}>
            <button onClick={() => navigate(-1)} style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 8, width: 36, height: 36, cursor: "pointer", color: "#fff", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)", transition: "background 0.2s" }}>‹</button>
            <button onClick={() => navigate(1)} style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 8, width: 36, height: 36, cursor: "pointer", color: "#fff", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)", transition: "background 0.2s" }}>›</button>
          </div>
          {/* Year display */}
          <div style={{ position: "absolute", top: 20, left: 32, fontFamily: "sans-serif", fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
            {selecting ? <span style={{ background: "rgba(255,255,255,0.2)", padding: "2px 10px", borderRadius: 20, backdropFilter: "blur(4px)" }}>Click end date...</span> : null}
          </div>
        </div>

        {/* Body */}
        <div className="cal-layout" style={{ display: "flex", minHeight: 380 }}>

          {/* Calendar grid */}
          <div style={{ flex: 1, padding: "24px 24px 28px", minWidth: 0 }}>
            {/* Day headers */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 8 }}>
              {DAYS.map(d => (
                <div key={d} style={{ textAlign: "center", fontSize: 11, fontFamily: "sans-serif", fontWeight: 600, color: textSec, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 0" }}>
                  {d}
                </div>
              ))}
            </div>

            {/* Date cells */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3 }}>
              {Array.from({ length: totalCells }, (_, i) => {
                const d = i - firstDay + 1;
                const isCurrentMonth = d >= 1 && d <= daysInMonth;
                const dayObj = isCurrentMonth ? { y: year, m: month, d } : null;
                const isToday = dayObj && year === today.getFullYear() && month === today.getMonth() && d === today.getDate();
                const isSat = i % 7 === 6;
                const isSun = i % 7 === 0;
                const holiday = dayObj ? getHoliday(year, month, d) : null;
                const inRange = dayObj && isInRange(dayObj, selectStart, previewEnd);
                const startMark = dayObj && isStart(dayObj, selectStart, previewEnd);
                const endMark = dayObj && isEnd(dayObj, selectStart, previewEnd);
                const hasRangeNote = (() => {
                  if (!selectStart || !previewEnd) return false;
                  const s = new Date(selectStart.y, selectStart.m, selectStart.d);
                  const e = new Date(previewEnd.y, previewEnd.m, previewEnd.d);
                  if (!dayObj) return false;
                  const t = new Date(dayObj.y, dayObj.m, dayObj.d);
                  return t >= Math.min(s,e) && t <= Math.max(s,e);
                })();

                let cellBg = "transparent";
                let cellColor = isCurrentMonth ? textPrimary : isDark ? "#333" : "#ccc";
                if (isSat && isCurrentMonth) cellColor = accentBlue;
                if (isSun && isCurrentMonth) cellColor = isDark ? "#ef4444" : "#dc2626";
                if (inRange) { cellBg = accentRange; }
                if (startMark || endMark) { cellBg = accentBlue; cellColor = "#fff"; }
                if (isToday && !startMark && !endMark) { cellBg = todayBg; cellColor = todayText; }

                return (
                  <div
                    key={i}
                    className="day-cell"
                    title={holiday || ""}
                    onClick={() => isCurrentMonth && handleDayClick(d)}
                    onMouseEnter={() => isCurrentMonth && selecting && setHoverDay(d)}
                    onMouseLeave={() => selecting && setHoverDay(null)}
                    style={{
                      borderRadius: 8,
                      background: cellBg,
                      color: cellColor,
                      padding: "6px 4px",
                      textAlign: "center",
                      cursor: isCurrentMonth ? "pointer" : "default",
                      position: "relative",
                      minHeight: 44,
                      userSelect: "none",
                    }}
                  >
                    <div style={{ fontFamily: "sans-serif", fontSize: 14, fontWeight: (startMark || endMark || isToday) ? 700 : 400 }}>
                      {isCurrentMonth ? d : ""}
                    </div>
                    {holiday && isCurrentMonth && (
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#f59e0b", margin: "2px auto 0" }}></div>
                    )}
                    {(startMark || endMark) && (
                      <div style={{ fontFamily: "sans-serif", fontSize: 8, color: "rgba(255,255,255,0.8)", letterSpacing: 0 }}>
                        {startMark ? "START" : "END"}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div style={{ marginTop: 16, display: "flex", gap: 16, flexWrap: "wrap" }}>
              {[
                { color: todayBg, textColor: todayText, label: "Today" },
                { color: accentBlue, textColor: "#fff", label: "Selected" },
                { color: accentRange, textColor: isDark ? "#93c5fd" : "#1d4ed8", label: "Range" },
              ].map(l => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "sans-serif", fontSize: 11, color: textSec }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: l.color, border: `1px solid ${border}` }}></div>
                  {l.label}
                </div>
              ))}
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "sans-serif", fontSize: 11, color: textSec }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#f59e0b" }}></div>
                Holiday
              </div>
            </div>
          </div>

          {/* Notes panel */}
          <div className="notes-panel" style={{ width: 240, borderLeft: `1px solid ${border}`, padding: "24px 20px", display: "flex", flexDirection: "column", gap: 16, background: isDark ? "#141414" : "#fafaf8" }}>
            
            {/* Tabs */}
            <div style={{ display: "flex", gap: 0, borderRadius: 8, overflow: "hidden", border: `1px solid ${border}` }}>
              {["month","range"].map(t => (
                <button key={t} onClick={() => setActiveTab(t)} style={{
                  flex: 1, padding: "7px 0", fontFamily: "sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase",
                  background: activeTab === t ? (isDark ? "#2a2a2a" : "#fff") : "transparent",
                  border: "none", borderRight: t === "month" ? `1px solid ${border}` : "none",
                  color: activeTab === t ? textPrimary : textSec, cursor: "pointer", transition: "all 0.15s"
                }}>{t}</button>
              ))}
            </div>

            {activeTab === "month" ? (
              <>
                <div>
                  <div style={{ fontFamily: "sans-serif", fontSize: 11, color: textSec, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Monthly memo</div>
                  <textarea
                    value={monthNote}
                    onChange={e => saveMonthNote(e.target.value)}
                    placeholder={`Notes for ${MONTHS[month]}...`}
                    style={{ width: "100%", minHeight: 160, background: isDark ? "#1a1a1a" : "#fff", border: `1px solid ${border}`, borderRadius: 8, padding: "10px 12px", fontFamily: "Georgia, serif", fontSize: 13, color: textPrimary, resize: "vertical", outline: "none", lineHeight: 1.7, boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <div style={{ fontFamily: "sans-serif", fontSize: 11, color: textSec, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Upcoming holidays</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {Object.entries(HOLIDAY_MAP).filter(([k]) => {
                      const [hm] = k.split("-").map(Number);
                      return hm === month + 1;
                    }).slice(0,4).map(([k, name]) => {
                      const [,hd] = k.split("-").map(Number);
                      return (
                        <div key={k} style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "sans-serif", fontSize: 12, color: textSec }}>
                          <div style={{ width: 28, height: 28, borderRadius: 6, background: isDark ? "#2a2a2a" : "#f1f0ec", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 11, color: textPrimary, flexShrink: 0 }}>{hd}</div>
                          <span style={{ fontSize: 11, lineHeight: 1.3 }}>{name}</span>
                        </div>
                      );
                    })}
                    {!Object.keys(HOLIDAY_MAP).some(k => k.startsWith(`${month+1}-`)) && (
                      <div style={{ fontFamily: "sans-serif", fontSize: 11, color: textSec, fontStyle: "italic" }}>No holidays this month</div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <div style={{ fontFamily: "sans-serif", fontSize: 11, color: textSec, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>Selected range</div>
                  <div style={{ fontFamily: "sans-serif", fontSize: 12, color: textPrimary, lineHeight: 1.5, padding: "8px 10px", background: isDark ? "#1e1e1e" : "#f1f0ec", borderRadius: 8 }}>
                    {getRangeLabel()}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "sans-serif", fontSize: 11, color: textSec, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Range notes</div>
                  <textarea
                    ref={notesRef}
                    value={getRangeNoteKey() ? (notes[getRangeNoteKey()] || "") : ""}
                    onChange={e => saveRangeNote(e.target.value)}
                    placeholder={selectStart && selectEnd ? "Add notes for this period..." : "Select a date range on the calendar first..."}
                    disabled={!selectStart || !selectEnd}
                    style={{ width: "100%", minHeight: 140, background: isDark ? "#1a1a1a" : "#fff", border: `1px solid ${border}`, borderRadius: 8, padding: "10px 12px", fontFamily: "Georgia, serif", fontSize: 13, color: textPrimary, resize: "vertical", outline: "none", lineHeight: 1.7, boxSizing: "border-box", opacity: (!selectStart || !selectEnd) ? 0.5 : 1 }}
                  />
                </div>
                <button
                  onClick={() => { setSelectStart(null); setSelectEnd(null); setSelecting(false); }}
                  style={{ fontFamily: "sans-serif", fontSize: 11, background: "transparent", border: `1px solid ${border}`, borderRadius: 8, padding: "7px 0", color: textSec, cursor: "pointer", letterSpacing: "0.06em" }}
                >
                  Clear selection
                </button>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ borderTop: `1px solid ${border}`, padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", background: isDark ? "#111" : "#fafaf8" }}>
          <div style={{ fontFamily: "sans-serif", fontSize: 11, color: textSec }}>
            {today.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </div>
          <button
            onClick={() => { setMonth(today.getMonth()); setYear(today.getFullYear()); setAnimKey(k=>k+1); }}
            style={{ fontFamily: "sans-serif", fontSize: 11, background: "transparent", border: `1px solid ${border}`, borderRadius: 6, padding: "5px 12px", color: textSec, cursor: "pointer" }}
          >
            Today
          </button>
        </div>
      </div>
    </div>
  );
}
