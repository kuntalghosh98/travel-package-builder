import React, { useEffect, useMemo, useState } from "react";
import { packageService } from "../services/packageService";
import { templateService } from "../services/templateService";
import { deepClone, generateId, formatCurrency, sameId } from "../utils/helpers";
import { useToast } from "../components/Toast.jsx";
import { useConfirm } from "../components/ConfirmDialog.jsx";

const ACCENT = "#008CFF";

function buildFolderSelectOptions(folders, parentId = null, depth = 0) {
  const options = [];
  folders
    .filter(f => sameId(f.parentId, parentId))
    .forEach(folder => {
      options.push({
        id: folder.id,
        label: `${"\u00A0\u00A0".repeat(depth)}${folder.name}`
      });
      options.push(...buildFolderSelectOptions(folders, folder.id, depth + 1));
    });
  return options;
}

function Field({ label, value, onChange, type = "text", placeholder }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type={type} value={value ?? ""} placeholder={placeholder} onChange={e => onChange(e.target.value)} />
    </label>
  );
}

function TextArea({ label, value, onChange }) {
  return (
    <label className="field">
      <span>{label}</span>
      <textarea value={value ?? ""} onChange={e => onChange(e.target.value)} />
    </label>
  );
}

function SectionTitle({ section }) {
  const titles = {
    general: "General information",
    cover: "Cover page",
    journey: "Journey overview",
    hotels: "Stay options",
    itinerary: "Day-by-day itinerary",
    inclusions: "What's included / excluded",
    pricing: "Package pricing",
    fineprint: "Good to know"
  };
  return titles[section] || section;
}

function General({ pkg, update }) {
  return (
    <div className="formGrid">
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
    </div>
  );
}

function Cover({ pkg, update }) {
  return (
    <div className="stack">
      <Field label="Hero image URL" value={pkg.heroImage} onChange={v => update("heroImage", v)} />
      <Field label="Cover title" value={pkg.title} onChange={v => update("title", v)} />
      <TextArea label="Cover subtitle" value={pkg.subtitle} onChange={v => update("subtitle", v)} />
      <div className="tip"><b>Tip:</b> Use a wide destination photograph. The preview uses it as the hero image; the final browser print keeps the white/light theme and blue accent.</div>
    </div>
  );
}

function Journey({ pkg, update }) {
  const [route, setRoute] = useState(pkg.route.join(" → "));
  return (
    <div className="stack">
      <Field label="Route" value={route} onChange={v => { setRoute(v); update("route", v.split("→").map(x => x.trim()).filter(Boolean)); }} />
      <div className="routePreview">{pkg.route.map((r, i) => <React.Fragment key={r + i}><span>{r}</span>{i < pkg.route.length - 1 && <b>→</b>}</React.Fragment>)}</div>
      <div className="tip">Use the route to drive the journey strip on the client PDF. Example: Bhubaneswar → Puri → Konark → Bhubaneswar.</div>
    </div>
  );
}

function Hotels({ pkg, setPkg }) {
  const edit = (i, key, val) => setPkg(p => { const hotels = deepClone(p.hotels); hotels[i][key] = ["price", "nights1", "nights2"].includes(key) ? Number(val) : val; return { ...p, hotels }; });
  const add = () => setPkg(p => ({ ...p, hotels: [...p.hotels, { option: `Option ${p.hotels.length + 1}`, label: "New Stay Option", city1: "", hotel1: "", room1: "", nights1: 2, city2: "", hotel2: "", room2: "", nights2: 1, price: 0, vehicle: "AC Sedan" }] }));
  const remove = i => setPkg(p => ({ ...p, hotels: p.hotels.filter((_, idx) => idx !== i) }));
  return (
    <div className="stack">
      {pkg.hotels.map((h, i) => (
        <div className="editorCard" key={i}>
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
        </div>
      ))}
      <button className="addBtn" onClick={add}>+ Add hotel option</button>
    </div>
  );
}

function Itinerary({ pkg, setPkg }) {
  const edit = (i, key, val) => setPkg(p => { const a = deepClone(p.itinerary); a[i][key] = val; return { ...p, itinerary: a } });
  const activity = (i, j, val) => setPkg(p => { const a = deepClone(p.itinerary); a[i].activities[j] = val; return { ...p, itinerary: a } });
  const addDay = () => setPkg(p => ({ ...p, itinerary: [...p.itinerary, { day: p.itinerary.length + 1, date: "", route: "", title: "New day", description: "", distance: "", activities: ["New activity"] }] }));
  const addAct = i => setPkg(p => { const a = deepClone(p.itinerary); a[i].activities.push("New activity"); return { ...p, itinerary: a } });
  const removeDay = i => setPkg(p => ({ ...p, itinerary: p.itinerary.filter((_, idx) => idx !== i).map((x, idx) => ({ ...x, day: idx + 1 })) }));
  return (
    <div className="stack">
      {pkg.itinerary.map((d, i) => (
        <div className="editorCard" key={i}>
          <div className="cardHead"><b>DAY {d.day}</b><button className="danger" onClick={() => removeDay(i)}>Delete</button></div>
          <div className="formGrid">
            <Field label="Date" value={d.date} onChange={v => edit(i, "date", v)} />
            <Field label="Route" value={d.route} onChange={v => edit(i, "route", v)} />
            <Field label="Headline" value={d.title} onChange={v => edit(i, "title", v)} />
            <Field label="Distance / road time" value={d.distance} onChange={v => edit(i, "distance", v)} />
          </div>
          <TextArea label="Description" value={d.description} onChange={v => edit(i, "description", v)} />
          <div className="activityList">
            <b>Activities</b>
            {d.activities.map((a, j) => (
              <div className="activityRow" key={j}>
                <input value={a} onChange={e => activity(i, j, e.target.value)} />
                <button onClick={() => setPkg(p => { const x = deepClone(p.itinerary); x[i].activities.splice(j, 1); return { ...p, itinerary: x } })}>×</button>
              </div>
            ))}
            <button className="miniAdd" onClick={() => addAct(i)}>+ Add activity</button>
          </div>
        </div>
      ))}
      <button className="addBtn" onClick={addDay}>+ Add day</button>
    </div>
  );
}

function Lists({ pkg, setPkg }) {
  const list = (key, title) => (
    <div className="editorCard">
      <div className="cardHead"><b>{title}</b></div>
      {pkg[key].map((x, i) => (
        <div className="activityRow" key={i}>
          <input value={x} onChange={e => setPkg(p => ({ ...p, [key]: p[key].map((v, j) => j === i ? e.target.value : v) }))} />
          <button onClick={() => setPkg(p => ({ ...p, [key]: p[key].filter((_, j) => j !== i) }))}>×</button>
        </div>
      ))}
      <button className="miniAdd" onClick={() => setPkg(p => ({ ...p, [key]: [...p[key], "New item"] }))}>+ Add item</button>
    </div>
  );
  return (
    <div className="stack">
      {list("inclusions", "Included in your price")}
      {list("exclusions", "Not included")}
    </div>
  );
}

function Pricing({ pkg, update }) {
  const selected = pkg.hotels[0]?.price || 0;
  const total = selected * pkg.adults;
  return (
    <div className="stack">
      <div className="priceHero">
        <span>Current package example</span>
        <strong>₹{selected.toLocaleString("en-IN")} / person</strong>
        <b>{pkg.adults} adults · ₹{total.toLocaleString("en-IN")} total</b>
      </div>
      <div className="tip">MVP pricing uses the selected hotel option's per-person price. A component-based cost engine (hotel + vehicle + sightseeing + margin + taxes) is the recommended next iteration.</div>
      <Field label="Validity note" value={pkg.validity || "Valid till 15 Aug 2026"} onChange={v => update("validity", v)} />
    </div>
  );
}

function FinePrint({ pkg, setPkg }) {
  return (
    <div className="editorCard">
      <div className="cardHead"><b>Booking notes</b></div>
      {pkg.notes.map((x, i) => (
        <div className="activityRow" key={i}>
          <input value={x} onChange={e => setPkg(p => ({ ...p, notes: p.notes.map((v, j) => j === i ? e.target.value : v) }))} />
          <button onClick={() => setPkg(p => ({ ...p, notes: p.notes.filter((_, j) => j !== i) }))}>×</button>
        </div>
      ))}
      <button className="miniAdd" onClick={() => setPkg(p => ({ ...p, notes: [...p.notes, "New booking note"] }))}>+ Add note</button>
    </div>
  );
}

function Preview({ pkg, page }) {
  const money = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
  if (page === 1) return (
    <div className="paper coverPage">
      <div className="coverImage" style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,.03), rgba(0,0,0,.58)), url(${pkg.heroImage})` }}></div>
      <div className="coverContent">
        <span className="eyebrow">{pkg.destination}</span>
        <h2>{pkg.title}</h2>
        <p>{pkg.subtitle}</p>
        <div className="guestBox">
          <b>{pkg.guest}</b>
          <span>{pkg.adults} Adults · {pkg.rooms} Room</span>
          <span>{pkg.nights} Nights · {pkg.days} Days</span>
        </div>
        <small>Prepared by {pkg.consultant}</small>
      </div>
    </div>
  );
  if (page === 2) return (
    <div className="paper">
      <PaperHeader pkg={pkg} title="The Journey" />
      <div className="journeyStrip">{pkg.route.map((x, i) => <React.Fragment key={i}><span>{x}</span>{i < pkg.route.length - 1 && <b>→</b>}</React.Fragment>)}</div>
      <h3>What's included</h3>
      <div className="previewGrid">{pkg.inclusions.map((x, i) => <div className="pCard" key={i}><i>✓</i>{x}</div>)}</div>
    </div>
  );
  if (page === 3) return (
    <div className="paper">
      <PaperHeader pkg={pkg} title="Choose your stay" />
      <p className="muted">Two ways to stay · Pick your comfort</p>
      {pkg.hotels.map((h, i) => (
        <div className="hotelPreview" key={i}>
          <div className="hotelTop">
            <div><span className="eyebrow">{h.option}</span><h3>{h.label}</h3></div>
            <strong>{money(h.price)}<small> / person</small></strong>
          </div>
          <div className="hotelGrid">
            <div><b>{h.city1}</b><br /><strong>{h.hotel1}</strong><br /><span>{h.room1}</span><br /><small>{h.nights1} nights</small></div>
            <div><b>{h.city2}</b><br /><strong>{h.hotel2}</strong><br /><span>{h.room2}</span><br /><small>{h.nights2} night</small></div>
          </div>
          <div className="vehicle">{h.vehicle} · {pkg.adults} PAX</div>
        </div>
      ))}
    </div>
  );
  if (page === 4) return (
    <div className="paper">
      <PaperHeader pkg={pkg} title="The Itinerary" />
      {pkg.itinerary.map(d => (
        <div className="dayPreview" key={d.day}>
          <div className="dayNo">0{d.day}</div>
          <div>
            <span className="eyebrow">{d.date} · {d.route}</span>
            <h3>{d.title}</h3>
            {d.distance && <small className="muted">{d.distance}</small>}
            <p>{d.description}</p>
            <div className="chips">{d.activities.map(a => <span key={a}>{a}</span>)}</div>
          </div>
        </div>
      ))}
    </div>
  );
  return (
    <div className="paper">
      <PaperHeader pkg={pkg} title="Good to know" />
      <h3>Included</h3>
      <div className="previewGrid">{pkg.inclusions.slice(0, 6).map(x => <div className="pCard" key={x}><i>✓</i>{x}</div>)}</div>
      <h3>Not included</h3>
      <ul>{pkg.exclusions.map(x => <li key={x}>{x}</li>)}</ul>
      <h3>Booking notes</h3>
      <ul>{pkg.notes.map(x => <li key={x}>{x}</li>)}</ul>
      <div className="contact">{pkg.phone} · {pkg.website}<br />Sales consultant: {pkg.consultant}</div>
    </div>
  );
}

function PaperHeader({ pkg, title }) {
  return (
    <>
      <div className="paperBrand"><b>{pkg.company}</b><span>{pkg.destination}</span></div>
      <div className="paperTitle"><span className="eyebrow">{pkg.destination}</span><h2>{title}</h2></div>
    </>
  );
}

export function BuilderPage({ templateId = "template-1", onBack }) {
  const toast = useToast();
  const { confirm, dialog: confirmDialog } = useConfirm();
  const [pkg, setPkg] = useState(null);
  const [section, setSection] = useState("general");
  const [previewPage, setPreviewPage] = useState(1);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showSaveAsTemplate, setShowSaveAsTemplate] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");
  const [templateCategory, setTemplateCategory] = useState("custom");
  const [templateTags, setTemplateTags] = useState("");
  const [templateFolderId, setTemplateFolderId] = useState(null);
  const [saveTemplateFolders, setSaveTemplateFolders] = useState([]);
  const [isDefaultTemplate, setIsDefaultTemplate] = useState(false);

  // Load package on mount or when templateId changes
  useEffect(() => {
    const loadPackage = async () => {
      try {
        if (templateId) {
          // Create new package from template (templateId provided means "use this template")
          const newPkg = await packageService.createPackage(templateId);
          setPkg(newPkg);
          
          // Check if the template is a default template
          const template = await templateService.getTemplateById(templateId);
          setIsDefaultTemplate(template?.isDefault === true);
        } else {
          // No templateId - load existing package or create default
          const loadedPkg = await packageService.getPackage();
          setPkg(loadedPkg);
          setIsDefaultTemplate(false);
        }
      } catch (err) {
        setError(err.message);
      }
    };
    loadPackage();
  }, [templateId]);

  // Auto-save via packageService (Node API)
  useEffect(() => {
    if (pkg) {
      const timer = setTimeout(async () => {
        try {
          await packageService.savePackage(pkg);
          setSaved(true);
          setTimeout(() => setSaved(false), 1600);
        } catch (err) {
          setError(err.message);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
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

  const handleSave = async () => {
    if (!pkg) return;
    setSaving(true);
    try {
      await packageService.savePackage(pkg);
      setSaved(true);
      setTimeout(() => setSaved(false), 1600);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateTemplate = async () => {
    if (!pkg || !templateId || isDefaultTemplate) return;
    setSaving(true);
    try {
      // Update the existing user template with current package data
      const updated = await templateService.updateTemplate(templateId, {
        name: pkg.title || pkg.destination || "Untitled Template",
        description: pkg.subtitle || "",
        category: pkg.category || "custom",
        tags: pkg.tags || [],
        thumbnail: pkg.heroImage || "",
        structure: {
          company: pkg.company || "",
          consultant: pkg.consultant || "",
          phone: pkg.phone || "",
          website: pkg.website || "",
          destination: pkg.destination || "",
          title: pkg.title || "",
          subtitle: pkg.subtitle || "",
          heroImage: pkg.heroImage || "",
          route: pkg.route || [],
          inclusions: pkg.inclusions || [],
          exclusions: pkg.exclusions || [],
          hotels: (pkg.hotels || []).map(h => ({
            option: h.option,
            label: h.label,
            city1: h.city1,
            hotel1: h.hotel1,
            room1: h.room1,
            nights1: h.nights1,
            city2: h.city2,
            hotel2: h.hotel2,
            room2: h.room2,
            nights2: h.nights2,
            city3: h.city3,
            hotel3: h.hotel3,
            room3: h.room3,
            nights3: h.nights3
          })),
          itinerary: (pkg.itinerary || []).map(day => ({
            day: day.day,
            title: day.title,
            description: day.description,
            activities: day.activities || [],
            meals: day.meals || "",
            stay: day.stay || ""
          })),
          notes: pkg.notes || [],
          pricing: pkg.pricing || {}
        }
      });
      
      if (updated) {
        setSaved(true);
        setTimeout(() => setSaved(false), 1600);
      } else {
        setError("Failed to update template (may be a default template)");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    const ok = await confirm({
      title: "Reset package",
      message: "Reset the package to the template default? Unsaved changes will be lost.",
      confirmLabel: "Reset",
      danger: true
    });
    if (!ok) return;

    try {
      const newPkg = await packageService.createPackage(templateId);
      setPkg(newPkg);
      setPreviewPage(1);
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePrint = () => {
    setPreviewPage(1);
    setTimeout(() => window.print(), 100);
  };

  const handleOpenSaveAsTemplate = async () => {
    try {
      const folderList = await templateService.getAllFolders();
      setSaveTemplateFolders(folderList);

      if (templateId && !isDefaultTemplate) {
        const currentTemplate = await templateService.getTemplateById(templateId);
        setTemplateFolderId(currentTemplate?.folderId ?? null);
      } else {
        setTemplateFolderId(null);
      }

      setShowSaveAsTemplate(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSaveAsTemplate = async () => {
    if (!pkg || !templateName.trim()) return;
    try {
      await templateService.saveAsTemplate(pkg, {
        name: templateName.trim(),
        description: templateDescription.trim(),
        category: templateCategory,
        tags: templateTags.split(',').map(t => t.trim()).filter(Boolean),
        folderId: templateFolderId
      });
      setShowSaveAsTemplate(false);
      setTemplateName("");
      setTemplateDescription("");
      setTemplateCategory("custom");
      setTemplateTags("");
      setTemplateFolderId(null);
      toast.success("Template saved successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  const saveTemplateFolderOptions = useMemo(
    () => buildFolderSelectOptions(saveTemplateFolders),
    [saveTemplateFolders]
  );

  if (!pkg) {
    return <div className="app"><div className="loading">Loading package...</div></div>;
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          {onBack && (
            <button className="topbar__back" onClick={onBack}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Templates
            </button>
          )}
          <div className="brandMark">A</div>
          <div>
            <strong>Travel Package Builder</strong>
            <small>{pkg.company}</small>
          </div>
        </div>
        <div className="topActions">
          {saved && <span className="saved">Saved</span>}
          {error && <span className="error">{error}</span>}
          <button className="ghost" onClick={handleReset}>Reset</button>
          {/* 
            Button logic:
            - No templateId (new package): Show "Save" + "Save as Template"
            - templateId + isDefaultTemplate (default template): Show ONLY "Save as Template"
            - templateId + !isDefaultTemplate (user template): Show "Update" + "Save as Template"
          */}
          {!templateId && (
            <button className="ghost" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</button>
          )}
          {templateId && !isDefaultTemplate && (
            <button className="ghost" onClick={handleUpdateTemplate} disabled={saving}>{saving ? "Updating..." : "Update"}</button>
          )}
          <button className="ghost" onClick={handleOpenSaveAsTemplate}>Save as Template</button>
          <button className="primary" onClick={handlePrint}>Export PDF</button>
        </div>
      </header>

      <main className="workspace">
        <aside className="sidebar">
          <div className="sideTitle">PACKAGE</div>
          {[
            ["general", "General"], ["cover", "Cover"], ["journey", "Journey"], ["hotels", "Hotels"], ["itinerary", "Itinerary"], ["inclusions", "Inclusions"], ["pricing", "Pricing"], ["fineprint", "Fine print"]
          ].map(([id, name]) => (
            <button key={id} className={section === id ? "nav active" : "nav"} onClick={() => setSection(id)}>
              <span className="dot"></span>{name}
            </button>
          ))}
          <div className="sideTitle design">DESIGN</div>
          <button className="nav" onClick={() => toast.info("Template system is prepared for the next iteration.")}><span className="dot"></span>Templates</button>
          <button className="nav" onClick={() => toast.info("Brand settings are prepared for the next iteration.")}><span className="dot"></span>Brand settings</button>
          <div className="sideBottom"><small>Autosave enabled</small><small>Local browser storage</small></div>
        </aside>

        <section className="editor">
          <div className="editorHead">
            <div>
              <h1>{SectionTitle({ section })}</h1>
              <p>Edit structured content; the client preview updates instantly.</p>
            </div>
          </div>
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
            <div className="pageNav">
              <button onClick={() => setPreviewPage(Math.max(1, previewPage - 1))}>‹</button>
              <b>{previewPage}</b>
              <span>/ 5</span>
              <button onClick={() => setPreviewPage(Math.min(5, previewPage + 1))}>›</button>
            </div>
          </div>
          <div className="screenPreview">
            <Preview pkg={pkg} page={previewPage} />
          </div>

          <div className="printPreview">
            {[1, 2, 3, 4, 5].map((page) => (
              <Preview key={page} pkg={pkg} page={page} />
            ))}
          </div>
        </section>
      </main>

      {/* Save as Template Modal */}
      {showSaveAsTemplate && (
        <div className="modal modal--save-template is-open" role="dialog" aria-modal="true" aria-labelledby="save-template-title" onClick={(e) => e.target === e.currentTarget && setShowSaveAsTemplate(false)}>
          <div className="modal__overlay" onClick={() => setShowSaveAsTemplate(false)}></div>
          <div className="modal__content">
            <header className="modal__header">
              <h2 id="save-template-title" className="modal__title">Save as Template</h2>
              <button className="modal__close" onClick={() => setShowSaveAsTemplate(false)} aria-label="Close">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </header>
            <div className="modal__body">
              <p style={{ margin: 0, color: '#7b8792', fontSize: '13px' }}>Save the current package structure as a reusable template.</p>
              <div className="form-group">
                <label htmlFor="template-name">Template Name *</label>
                <input
                  type="text"
                  id="template-name"
                  value={templateName}
                  onChange={e => setTemplateName(e.target.value)}
                  placeholder="e.g., Beach Getaway Template"
                  required
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label htmlFor="template-description">Description</label>
                <textarea
                  id="template-description"
                  value={templateDescription}
                  onChange={e => setTemplateDescription(e.target.value)}
                  placeholder="Brief description of this template..."
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label htmlFor="template-category">Category</label>
                <select
                  id="template-category"
                  value={templateCategory}
                  onChange={e => setTemplateCategory(e.target.value)}
                >
                  <option value="custom">Custom</option>
                  <option value="classic">Classic</option>
                  <option value="adventure">Adventure</option>
                  <option value="luxury">Luxury</option>
                  <option value="budget">Budget</option>
                  <option value="family">Family</option>
                  <option value="romantic">Romantic</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="template-folder">Folder</label>
                <select
                  id="template-folder"
                  value={templateFolderId || ""}
                  onChange={e => setTemplateFolderId(e.target.value || null)}
                >
                  <option value="">All templates (no folder)</option>
                  {saveTemplateFolderOptions.map(option => (
                    <option key={option.id} value={option.id}>{option.label}</option>
                  ))}
                </select>
                <small style={{ color: '#7b8792', fontSize: '12px' }}>Choose where to store this template in My Templates</small>
              </div>
              <div className="form-group">
                <label htmlFor="template-tags">Tags (comma-separated)</label>
                <input
                  type="text"
                  id="template-tags"
                  value={templateTags}
                  onChange={e => setTemplateTags(e.target.value)}
                  placeholder="e.g., beach, 7-days, family-friendly"
                />
                <small style={{ color: '#7b8792', fontSize: '12px' }}>Separate tags with commas</small>
              </div>
            </div>
            <footer className="modal__footer">
              <button type="button" className="btn btn--secondary" onClick={() => setShowSaveAsTemplate(false)}>Cancel</button>
              <button type="button" className="btn btn--primary" onClick={handleSaveAsTemplate} disabled={!templateName.trim()}>Save Template</button>
            </footer>
          </div>
        </div>
      )}
      {confirmDialog}
    </div>
  );
}