import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const ACCENT = "#008CFF";

const initialPackage = {
  company: "Ariess Holidays",
  consultant: "Jay Majithiya",
  phone: "+91 84602 42308",
  website: "ariesssholidays.com",
  destination: "Odisha, India",
  title: "Temples, Tides & Timeless Stone",
  subtitle: "A curated 3 night escape through Odisha's living heritage",
  guest: "Ms. Komal Matlawala",
  adults: 2,
  rooms: 1,
  startDate: "2026-11-15",
  endDate: "2026-11-18",
  nights: 3,
  days: 4,
  route: ["Bhubaneswar", "Puri", "Konark", "Bhubaneswar"],
  heroImage: "https://images.unsplash.com/photo-1606298855672-3efb63017be8?auto=format&fit=crop&w=1600&q=85",
  inclusions: [
    "Daily breakfast at hotel",
    "Twin/double-sharing stay on chosen meal plan",
    "All transfers & sightseeing by AC Sedan",
    "Vehicle at disposal per itinerary",
    "Services of a well-experienced driver",
    "Toll, parking, driver allowance & night halt",
    "Inter-state permit & applicable govt. taxes",
    "Pickup & drop, Bhubaneswar Rly./Airport"
  ],
  exclusions: [
    "Flight / train tickets",
    "Meals other than daily breakfast",
    "Beverages, tips & portage",
    "Anything not specifically mentioned as included"
  ],
  hotels: [
    {
      option: "Option 1",
      label: "SeaView Select",
      city1: "Puri",
      hotel1: "Hotel Naren Palace",
      room1: "Super Deluxe Sea View, AC Room",
      nights1: 2,
      city2: "Bhubaneswar",
      hotel2: "Cozzet Victoria",
      room2: "Superior Room",
      nights2: 1,
      price: 16000,
      vehicle: "AC Dzire · 3★ Deluxe Category"
    },
    {
      option: "Option 2",
      label: "Deluxe Comfort",
      city1: "Puri",
      hotel1: "Durene Beach Resort",
      room1: "Deluxe Room",
      nights1: 2,
      city2: "Bhubaneswar",
      hotel2: "Belford Hotel",
      room2: "Deluxe Room",
      nights2: 1,
      price: 18000,
      vehicle: "AC Dzire · 3★ Deluxe Category"
    }
  ],
  itinerary: [
    {
      day: 1,
      date: "15 November",
      route: "Bhubaneswar → Puri",
      title: "Arrival & the road to Puri, via Sakhigopal",
      description: "Arrive at Bhubaneswar Railway Station or Airport and transfer onward to Puri. En route, stop at the Rajarani Temple and the Sakhigopal Temple before checking in to your hotel. Overnight stay at Puri.",
      distance: "",
      activities: ["Rajarani Temple", "Sakhigopal Temple"]
    },
    {
      day: 2,
      date: "16 November",
      route: "Puri → Konark → Puri",
      title: "Sun Temple excursion & a golden-beach evening",
      description: "Begin the morning at the Shree Jagannath Temple. Then drive to the UNESCO World Heritage Sun Temple at Konark, followed by Chandrabhaga Beach. Return to Puri for a free evening on the shore.",
      distance: "Approx. 80 km",
      activities: ["Jagannath Temple", "Konark Sun Temple, UNESCO", "Chandrabhaga Beach", "Seaside shell-craft shopping"]
    },
    {
      day: 3,
      date: "17 November",
      route: "Puri → Bhubaneswar",
      title: "Ancient shrines, rock-cut caves & a white-tiger sanctuary",
      description: "Check out after breakfast and transfer to Bhubaneswar. Visit Lingaraj Temple, Udaigiri and Khandagiri Jain caves, then Nandan Kanan. Check in at your Bhubaneswar hotel for the night.",
      distance: "Approx. 65 km · ~2 hrs on road",
      activities: ["Lingaraj Temple", "Udaigiri & Khandagiri Caves", "Nandan Kanan"]
    },
    {
      day: 4,
      date: "18 November",
      route: "Bhubaneswar → Departure",
      title: "Breakfast, and homeward",
      description: "After breakfast, check out and transfer to Bhubaneswar Railway Station or Airport for your onward journey. Tour ends.",
      distance: "",
      activities: ["Railway Station / Airport drop"]
    }
  ],
  notes: [
    "This is an offer, not a confirmed booking.",
    "Rooms are held only once payment is received; equivalent hotels apply if originals are unavailable.",
    "Rates may change with hotel rate hikes or fuel / toll / permit / minimum-km revisions.",
    "No rooms have been blocked against this quote yet.",
    "Room preferences are requests, not guarantees.",
    "Any supplier rate change is passed through at cost."
  ]
};

function clone(v) { return JSON.parse(JSON.stringify(v)); }

function Field({ label, value, onChange, type = "text", placeholder }) {
  return <label className="field"><span>{label}</span><input type={type} value={value ?? ""} placeholder={placeholder} onChange={e => onChange(e.target.value)} /></label>;
}

function TextArea({ label, value, onChange }) {
  return <label className="field"><span>{label}</span><textarea value={value ?? ""} onChange={e => onChange(e.target.value)} /></label>;
}

function App() {
  const [pkg, setPkg] = useState(() => {
    try { return JSON.parse(localStorage.getItem("travel-package-v2")) || clone(initialPackage); }
    catch { return clone(initialPackage); }
  });
  const [section, setSection] = useState("general");
  const [previewPage, setPreviewPage] = useState(1);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    localStorage.setItem("travel-package-v2", JSON.stringify(pkg));
  }, [pkg]);

  const update = (key, value) => setPkg(p => ({ ...p, [key]: value }));

  const pages = useMemo(() => {
    return [
      { id: 1, name: "Cover" },
      { id: 2, name: "Journey & inclusions" },
      { id: 3, name: "Stay options" },
      { id: 4, name: "Itinerary" },
      { id: 5, name: "Good to know" }
    ];
  }, []);

  const save = () => {
    localStorage.setItem("travel-package-v2", JSON.stringify(pkg));
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  };

  const reset = () => {
    if (confirm("Reset the package to the Odisha sample?")) {
      setPkg(clone(initialPackage));
      setPreviewPage(1);
    }
  };

  const print = () => {
    setPreviewPage(1);
    setTimeout(() => window.print(), 100);
  };

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand"><div className="brandMark">A</div><div><strong>Travel Package Builder</strong><small>{pkg.company}</small></div></div>
        <div className="topActions">
          {saved && <span className="saved">Saved</span>}
          <button className="ghost" onClick={reset}>Reset</button>
          <button className="ghost" onClick={save}>Save</button>
          <button className="primary" onClick={print}>Export PDF</button>
        </div>
      </header>

      <main className="workspace">
        <aside className="sidebar">
          <div className="sideTitle">PACKAGE</div>
          {[
            ["general", "General"], ["cover", "Cover"], ["journey", "Journey"], ["hotels", "Hotels"], ["itinerary", "Itinerary"], ["inclusions", "Inclusions"], ["pricing", "Pricing"], ["fineprint", "Fine print"]
          ].map(([id, name]) => <button key={id} className={section === id ? "nav active" : "nav"} onClick={() => setSection(id)}><span className="dot"></span>{name}</button>)}
          <div className="sideTitle design">DESIGN</div>
          <button className="nav" onClick={() => alert("Template system is prepared for the next iteration.")}><span className="dot"></span>Templates</button>
          <button className="nav" onClick={() => alert("Brand settings are prepared for the next iteration.")}><span className="dot"></span>Brand settings</button>
          <div className="sideBottom"><small>Autosave enabled</small><small>Local browser storage</small></div>
        </aside>

        <section className="editor">
          <div className="editorHead"><div><h1>{sectionTitle(section)}</h1><p>Edit structured content; the client preview updates instantly.</p></div></div>
          {section === "general" && <General pkg={pkg} update={update} />}
          {section === "cover" && <Cover pkg={pkg} update={update} />}
          {section === "journey" && <Journey pkg={pkg} update={update} />}
          {section === "hotels" && <Hotels pkg={pkg} setPkg={setPkg} />}
          {section === "itinerary" && <Itinerary pkg={pkg} setPkg={setPkg} />}
          {section === "inclusions" && <Lists pkg={pkg} setPkg={setPkg} />}
          {section === "pricing" && <Pricing pkg={pkg} update={update} />}
          {section === "fineprint" && <FinePrint pkg={pkg} setPkg={setPkg} />}
        </section>

        <section className="previewPane">
          <div className="previewToolbar">
            <span>LIVE PREVIEW</span>
            <div className="pageNav"><button onClick={() => setPreviewPage(Math.max(1, previewPage - 1))}>‹</button><b>{previewPage}</b><span>/ 5</span><button onClick={() => setPreviewPage(Math.min(5, previewPage + 1))}>›</button></div>
          </div>
          <div className="screenPreview">
            <Preview pkg={pkg} page={previewPage} />
          </div>

          <div className="printPreview">
            {[1, 2, 3, 4, 5].map((page) => (
              <Preview
                key={page}
                pkg={pkg}
                page={page}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function sectionTitle(s) {
  return ({ general: "General information", cover: "Cover page", journey: "Journey overview", hotels: "Stay options", itinerary: "Day-by-day itinerary", inclusions: "What's included / excluded", pricing: "Package pricing", fineprint: "Good to know" })[s];
}

function General({ pkg, update }) {
  return <div className="formGrid">
    <Field label="Destination" value={pkg.destination} onChange={v => update("destination", v)} />
    <Field label="Trip title" value={pkg.title} onChange={v => update("title", v)} />
    <Field label="Guest name" value={pkg.guest} onChange={v => update("guest", v)} />
    <Field label="Adults" type="number" value={pkg.adults} onChange={v => update("adults", Number(v))} />
    <Field label="Rooms" type="number" value={pkg.rooms} onChange={v => update("rooms", Number(v))} />
    <Field label="Start date" type="date" value={pkg.startDate} onChange={v => update("startDate", v)} />
    <Field label="End date" type="date" value={pkg.endDate} onChange={v => update("endDate", v)} />
    <Field label="Nights" type="number" value={pkg.nights} onChange={v => update("nights", Number(v))} />
    <Field label="Days" type="number" value={pkg.days} onChange={v => update("days", Number(v))} />
    <Field label="Consultant" value={pkg.consultant} onChange={v => update("consultant", v)} />
    <Field label="Phone" value={pkg.phone} onChange={v => update("phone", v)} />
    <Field label="Website" value={pkg.website} onChange={v => update("website", v)} />
  </div>;
}

function Cover({ pkg, update }) {
  return <div className="stack">
    <Field label="Hero image URL" value={pkg.heroImage} onChange={v => update("heroImage", v)} />
    <Field label="Cover title" value={pkg.title} onChange={v => update("title", v)} />
    <TextArea label="Cover subtitle" value={pkg.subtitle} onChange={v => update("subtitle", v)} />
    <div className="tip"><b>Tip:</b> Use a wide destination photograph. The preview uses it as the hero image; the final browser print keeps the white/light theme and blue accent.</div>
  </div>;
}

function Journey({ pkg, update }) {
  const [route, setRoute] = useState(pkg.route.join(" → "));
  return <div className="stack">
    <Field label="Route" value={route} onChange={v => { setRoute(v); update("route", v.split("→").map(x => x.trim()).filter(Boolean)); }} />
    <div className="routePreview">{pkg.route.map((r, i) => <React.Fragment key={r + i}><span>{r}</span>{i < pkg.route.length - 1 && <b>→</b>}</React.Fragment>)}</div>
    <div className="tip">Use the route to drive the journey strip on the client PDF. Example: Bhubaneswar → Puri → Konark → Bhubaneswar.</div>
  </div>;
}

function Hotels({ pkg, setPkg }) {
  const edit = (i, key, val) => setPkg(p => { const hotels = clone(p.hotels); hotels[i][key] = ["price", "nights1", "nights2"].includes(key) ? Number(val) : val; return { ...p, hotels }; });
  const add = () => setPkg(p => ({ ...p, hotels: [...p.hotels, { option: `Option ${p.hotels.length + 1}`, label: "New Stay Option", city1: "", hotel1: "", room1: "", nights1: 2, city2: "", hotel2: "", room2: "", nights2: 1, price: 0, vehicle: "AC Sedan" }] }));
  const remove = i => setPkg(p => ({ ...p, hotels: p.hotels.filter((_, idx) => idx !== i) }));
  return <div className="stack">{pkg.hotels.map((h, i) => <div className="editorCard" key={i}>
    <div className="cardHead"><b>{h.option}</b><button className="danger" onClick={() => remove(i)}>Delete</button></div>
    <div className="formGrid">
      <Field label="Option label" value={h.label} onChange={v => edit(i, "label", v)} />
      <Field label="Price / person (₹)" type="number" value={h.price} onChange={v => edit(i, "price", v)} />
      <Field label="City 1" value={h.city1} onChange={v => edit(i, "city1", v)} />
      <Field label="Hotel 1" value={h.hotel1} onChange={v => edit(i, "hotel1", v)} />
      <Field label="Room 1" value={h.room1} onChange={v => edit(i, "room1", v)} />
      <Field label="Nights 1" type="number" value={h.nights1} onChange={v => edit(i, "nights1", v)} />
      <Field label="City 2" value={h.city2} onChange={v => edit(i, "city2", v)} />
      <Field label="Hotel 2" value={h.hotel2} onChange={v => edit(i, "hotel2", v)} />
      <Field label="Room 2" value={h.room2} onChange={v => edit(i, "room2", v)} />
      <Field label="Nights 2" type="number" value={h.nights2} onChange={v => edit(i, "nights2", v)} />
      <Field label="Vehicle / category" value={h.vehicle} onChange={v => edit(i, "vehicle", v)} />
    </div>
  </div>)}<button className="addBtn" onClick={add}>+ Add hotel option</button></div>;
}

function Itinerary({ pkg, setPkg }) {
  const edit = (i, key, val) => setPkg(p => { const a = clone(p.itinerary); a[i][key] = val; return { ...p, itinerary: a } });
  const activity = (i, j, val) => setPkg(p => { const a = clone(p.itinerary); a[i].activities[j] = val; return { ...p, itinerary: a } });
  const addDay = () => setPkg(p => ({ ...p, itinerary: [...p.itinerary, { day: p.itinerary.length + 1, date: "", route: "", title: "New day", description: "", distance: "", activities: ["New activity"] }] }));
  const addAct = i => setPkg(p => { const a = clone(p.itinerary); a[i].activities.push("New activity"); return { ...p, itinerary: a } });
  const removeDay = i => setPkg(p => ({ ...p, itinerary: p.itinerary.filter((_, idx) => idx !== i).map((x, idx) => ({ ...x, day: idx + 1 })) }));
  return <div className="stack">{pkg.itinerary.map((d, i) => <div className="editorCard" key={i}>
    <div className="cardHead"><b>DAY {d.day}</b><button className="danger" onClick={() => removeDay(i)}>Delete</button></div>
    <div className="formGrid"><Field label="Date" value={d.date} onChange={v => edit(i, "date", v)} /><Field label="Route" value={d.route} onChange={v => edit(i, "route", v)} /><Field label="Headline" value={d.title} onChange={v => edit(i, "title", v)} /><Field label="Distance / road time" value={d.distance} onChange={v => edit(i, "distance", v)} /></div>
    <TextArea label="Description" value={d.description} onChange={v => edit(i, "description", v)} />
    <div className="activityList"><b>Activities</b>{d.activities.map((a, j) => <div className="activityRow" key={j}><input value={a} onChange={e => activity(i, j, e.target.value)} /><button onClick={() => setPkg(p => { const x = clone(p.itinerary); x[i].activities.splice(j, 1); return { ...p, itinerary: x } })}>×</button></div>)}<button className="miniAdd" onClick={() => addAct(i)}>+ Add activity</button></div>
  </div>)}<button className="addBtn" onClick={addDay}>+ Add day</button></div>;
}

function Lists({ pkg, setPkg }) {
  const list = (key, title) => <div className="editorCard"><div className="cardHead"><b>{title}</b></div>{pkg[key].map((x, i) => <div className="activityRow" key={i}><input value={x} onChange={e => setPkg(p => ({ ...p, [key]: p[key].map((v, j) => j === i ? e.target.value : v) }))} /><button onClick={() => setPkg(p => ({ ...p, [key]: p[key].filter((_, j) => j !== i) }))}>×</button></div>)}<button className="miniAdd" onClick={() => setPkg(p => ({ ...p, [key]: [...p[key], "New item"] }))}>+ Add item</button></div>;
  return <div className="stack">{list("inclusions", "Included in your price")}{list("exclusions", "Not included")}</div>;
}

function Pricing({ pkg, update }) {
  const selected = pkg.hotels[0]?.price || 0;
  const total = selected * pkg.adults;
  return <div className="stack"><div className="priceHero"><span>Current package example</span><strong>₹{selected.toLocaleString("en-IN")} / person</strong><b>{pkg.adults} adults · ₹{total.toLocaleString("en-IN")} total</b></div><div className="tip">MVP pricing uses the selected hotel option's per-person price. A component-based cost engine (hotel + vehicle + sightseeing + margin + taxes) is the recommended next iteration.</div><Field label="Validity note" value={pkg.validity || "Valid till 15 Aug 2026"} onChange={v => update("validity", v)} /></div>;
}

function FinePrint({ pkg, setPkg }) {
  return <div className="editorCard"><div className="cardHead"><b>Booking notes</b></div>{pkg.notes.map((x, i) => <div className="activityRow" key={i}><input value={x} onChange={e => setPkg(p => ({ ...p, notes: p.notes.map((v, j) => j === i ? e.target.value : v) }))} /><button onClick={() => setPkg(p => ({ ...p, notes: p.notes.filter((_, j) => j !== i) }))}>×</button></div>)}<button className="miniAdd" onClick={() => setPkg(p => ({ ...p, notes: [...p.notes, "New booking note"] }))}>+ Add note</button></div>;
}

function Preview({ pkg, page }) {
  const money = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
  if (page === 1) return <div className="paper coverPage"><div className="coverImage" style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,.03), rgba(0,0,0,.58)), url(${pkg.heroImage})` }}></div><div className="coverContent"><span className="eyebrow">{pkg.destination}</span><h2>{pkg.title}</h2><p>{pkg.subtitle}</p><div className="guestBox"><b>{pkg.guest}</b><span>{pkg.adults} Adults · {pkg.rooms} Room</span><span>{pkg.nights} Nights · {pkg.days} Days</span></div><small>Prepared by {pkg.consultant}</small></div></div>;
  if (page === 2) return <div className="paper"><PaperHeader pkg={pkg} title="The Journey" /><div className="journeyStrip">{pkg.route.map((x, i) => <React.Fragment key={i}><span>{x}</span>{i < pkg.route.length - 1 && <b>→</b>}</React.Fragment>)}</div><h3>What's included</h3><div className="previewGrid">{pkg.inclusions.map((x, i) => <div className="pCard" key={i}><i>✓</i>{x}</div>)}</div></div>;
  if (page === 3) return <div className="paper"><PaperHeader pkg={pkg} title="Choose your stay" /><p className="muted">Two ways to stay · Pick your comfort</p>{pkg.hotels.map((h, i) => <div className="hotelPreview" key={i}><div className="hotelTop"><div><span className="eyebrow">{h.option}</span><h3>{h.label}</h3></div><strong>{money(h.price)}<small> / person</small></strong></div><div className="hotelGrid"><div><b>{h.city1}</b><br /><strong>{h.hotel1}</strong><br /><span>{h.room1}</span><br /><small>{h.nights1} nights</small></div><div><b>{h.city2}</b><br /><strong>{h.hotel2}</strong><br /><span>{h.room2}</span><br /><small>{h.nights2} night</small></div></div><div className="vehicle">{h.vehicle} · {pkg.adults} PAX</div></div>)}</div>;
  if (page === 4) return <div className="paper"><PaperHeader pkg={pkg} title="The Itinerary" />{pkg.itinerary.map(d => <div className="dayPreview" key={d.day}><div className="dayNo">0{d.day}</div><div><span className="eyebrow">{d.date} · {d.route}</span><h3>{d.title}</h3>{d.distance && <small className="muted">{d.distance}</small>}<p>{d.description}</p><div className="chips">{d.activities.map(a => <span key={a}>{a}</span>)}</div></div></div>)}</div>;
  return <div className="paper"><PaperHeader pkg={pkg} title="Good to know" /><h3>Included</h3><div className="previewGrid">{pkg.inclusions.slice(0, 6).map(x => <div className="pCard" key={x}><i>✓</i>{x}</div>)}</div><h3>Not included</h3><ul>{pkg.exclusions.map(x => <li key={x}>{x}</li>)}</ul><h3>Booking notes</h3><ul>{pkg.notes.map(x => <li key={x}>{x}</li>)}</ul><div className="contact">{pkg.phone} · {pkg.website}<br />Sales consultant: {pkg.consultant}</div></div>;
}

function PaperHeader({ pkg, title }) { return <><div className="paperBrand"><b>{pkg.company}</b><span>{pkg.destination}</span></div><div className="paperTitle"><span className="eyebrow">{pkg.destination}</span><h2>{title}</h2></div></>; }

createRoot(document.getElementById("root")).render(<App />);
