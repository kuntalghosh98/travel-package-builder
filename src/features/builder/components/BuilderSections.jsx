import React, { useState } from 'react';
import { deepClone } from '../../../utils/helpers.js';

function Field({ label, value, onChange, type = 'text', placeholder }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type={type} value={value ?? ''} placeholder={placeholder} onChange={e => onChange(e.target.value)} />
    </label>
  );
}

function TextArea({ label, value, onChange }) {
  return (
    <label className="field">
      <span>{label}</span>
      <textarea value={value ?? ''} onChange={e => onChange(e.target.value)} />
    </label>
  );
}

export function SectionTitle({ section }) {
  const titles = {
    general: 'General information',
    cover: 'Cover page',
    journey: 'Journey overview',
    hotels: 'Stay options',
    itinerary: 'Day-by-day itinerary',
    inclusions: "What's included / excluded",
    pricing: 'Package pricing',
    fineprint: 'Good to know'
  };
  return titles[section] || section;
}

export function General({ pkg, update }) {
  return (
    <div className="formGrid">
      <Field label="Destination" value={pkg.destination} onChange={v => update('destination', v)} />
      <Field label="Trip title" value={pkg.title} onChange={v => update('title', v)} />
      <Field label="Guest name" value={pkg.guest} onChange={v => update('guest', v)} />
      <Field label="Adults" type="number" value={pkg.adults} onChange={v => update('adults', Number(v))} />
      <Field label="Rooms" type="number" value={pkg.rooms} onChange={v => update('rooms', Number(v))} />
      <Field label="Start date" type="date" value={pkg.startDate} onChange={v => update('startDate', v)} />
      <Field label="End date" type="date" value={pkg.endDate} onChange={v => update('endDate', v)} />
      <Field label="Nights" type="number" value={pkg.nights} onChange={v => update('nights', Number(v))} />
      <Field label="Days" type="number" value={pkg.days} onChange={v => update('days', Number(v))} />
      <Field label="Consultant" value={pkg.consultant} onChange={v => update('consultant', v)} />
      <Field label="Phone" value={pkg.phone} onChange={v => update('phone', v)} />
      <Field label="Website" value={pkg.website} onChange={v => update('website', v)} />
    </div>
  );
}

export function Cover({ pkg, update }) {
  return (
    <div className="stack">
      <Field label="Hero image URL" value={pkg.heroImage} onChange={v => update('heroImage', v)} />
      <Field label="Cover title" value={pkg.title} onChange={v => update('title', v)} />
      <TextArea label="Cover subtitle" value={pkg.subtitle} onChange={v => update('subtitle', v)} />
      <div className="tip"><b>Tip:</b> Use a wide destination photograph. The preview uses it as the hero image; the final browser print keeps the white/light theme and blue accent.</div>
    </div>
  );
}

export function Journey({ pkg, update }) {
  const [route, setRoute] = useState(pkg.route.join(' → '));
  return (
    <div className="stack">
      <Field label="Route" value={route} onChange={v => { setRoute(v); update('route', v.split('→').map(x => x.trim()).filter(Boolean)); }} />
      <div className="routePreview">{pkg.route.map((r, i) => <React.Fragment key={r + i}><span>{r}</span>{i < pkg.route.length - 1 && <b>→</b>}</React.Fragment>)}</div>
      <div className="tip">Use the route to drive the journey strip on the client PDF. Example: Bhubaneswar → Puri → Konark → Bhubaneswar.</div>
    </div>
  );
}

export function Hotels({ pkg, setPkg }) {
  const edit = (i, key, val) => setPkg(p => { const hotels = deepClone(p.hotels); hotels[i][key] = ['price', 'nights1', 'nights2'].includes(key) ? Number(val) : val; return { ...p, hotels }; });
  const add = () => setPkg(p => ({ ...p, hotels: [...p.hotels, { option: `Option ${p.hotels.length + 1}`, label: 'New Stay Option', city1: '', hotel1: '', room1: '', nights1: 2, city2: '', hotel2: '', room2: '', nights2: 1, price: 0, vehicle: 'AC Sedan' }] }));
  const remove = i => setPkg(p => ({ ...p, hotels: p.hotels.filter((_, idx) => idx !== i) }));
  return (
    <div className="stack">
      {pkg.hotels.map((h, i) => (
        <div className="editorCard" key={i}>
          <div className="cardHead"><b>{h.option}</b><button className="danger" onClick={() => remove(i)}>Delete</button></div>
          <div className="formGrid">
            <Field label="Option label" value={h.label} onChange={v => edit(i, 'label', v)} />
            <Field label="Price / person (₹)" type="number" value={h.price} onChange={v => edit(i, 'price', v)} />
            <Field label="City 1" value={h.city1} onChange={v => edit(i, 'city1', v)} />
            <Field label="Hotel 1" value={h.hotel1} onChange={v => edit(i, 'hotel1', v)} />
            <Field label="Room 1" value={h.room1} onChange={v => edit(i, 'room1', v)} />
            <Field label="Nights 1" type="number" value={h.nights1} onChange={v => edit(i, 'nights1', v)} />
            <Field label="City 2" value={h.city2} onChange={v => edit(i, 'city2', v)} />
            <Field label="Hotel 2" value={h.hotel2} onChange={v => edit(i, 'hotel2', v)} />
            <Field label="Room 2" value={h.room2} onChange={v => edit(i, 'room2', v)} />
            <Field label="Nights 2" type="number" value={h.nights2} onChange={v => edit(i, 'nights2', v)} />
            <Field label="Vehicle / category" value={h.vehicle} onChange={v => edit(i, 'vehicle', v)} />
          </div>
        </div>
      ))}
      <button className="addBtn" onClick={add}>+ Add hotel option</button>
    </div>
  );
}

export function Itinerary({ pkg, setPkg }) {
  const edit = (i, key, val) => setPkg(p => { const a = deepClone(p.itinerary); a[i][key] = val; return { ...p, itinerary: a }; });
  const activity = (i, j, val) => setPkg(p => { const a = deepClone(p.itinerary); a[i].activities[j] = val; return { ...p, itinerary: a }; });
  const addDay = () => setPkg(p => ({ ...p, itinerary: [...p.itinerary, { day: p.itinerary.length + 1, date: '', route: '', title: 'New day', description: '', distance: '', activities: ['New activity'] }] }));
  const addAct = i => setPkg(p => { const a = deepClone(p.itinerary); a[i].activities.push('New activity'); return { ...p, itinerary: a }; });
  const removeDay = i => setPkg(p => ({ ...p, itinerary: p.itinerary.filter((_, idx) => idx !== i).map((x, idx) => ({ ...x, day: idx + 1 })) }));
  return (
    <div className="stack">
      {pkg.itinerary.map((d, i) => (
        <div className="editorCard" key={i}>
          <div className="cardHead"><b>DAY {d.day}</b><button className="danger" onClick={() => removeDay(i)}>Delete</button></div>
          <div className="formGrid">
            <Field label="Date" value={d.date} onChange={v => edit(i, 'date', v)} />
            <Field label="Route" value={d.route} onChange={v => edit(i, 'route', v)} />
            <Field label="Headline" value={d.title} onChange={v => edit(i, 'title', v)} />
            <Field label="Distance / road time" value={d.distance} onChange={v => edit(i, 'distance', v)} />
          </div>
          <TextArea label="Description" value={d.description} onChange={v => edit(i, 'description', v)} />
          <div className="activityList">
            <b>Activities</b>
            {d.activities.map((a, j) => (
              <div className="activityRow" key={j}>
                <input value={a} onChange={e => activity(i, j, e.target.value)} />
                <button onClick={() => setPkg(p => { const x = deepClone(p.itinerary); x[i].activities.splice(j, 1); return { ...p, itinerary: x }; })}>×</button>
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

export function Lists({ pkg, setPkg }) {
  const list = (key, title) => (
    <div className="editorCard">
      <div className="cardHead"><b>{title}</b></div>
      {pkg[key].map((x, i) => (
        <div className="activityRow" key={i}>
          <input value={x} onChange={e => setPkg(p => ({ ...p, [key]: p[key].map((v, j) => j === i ? e.target.value : v) }))} />
          <button onClick={() => setPkg(p => ({ ...p, [key]: p[key].filter((_, j) => j !== i) }))}>×</button>
        </div>
      ))}
      <button className="miniAdd" onClick={() => setPkg(p => ({ ...p, [key]: [...p[key], 'New item'] }))}>+ Add item</button>
    </div>
  );
  return (
    <div className="stack">
      {list('inclusions', 'Included in your price')}
      {list('exclusions', 'Not included')}
    </div>
  );
}

export function Pricing({ pkg, update }) {
  const selected = pkg.hotels[0]?.price || 0;
  const total = selected * pkg.adults;
  return (
    <div className="stack">
      <div className="priceHero">
        <span>Current package example</span>
        <strong>₹{selected.toLocaleString('en-IN')} / person</strong>
        <b>{pkg.adults} adults · ₹{total.toLocaleString('en-IN')} total</b>
      </div>
      <div className="tip">MVP pricing uses the selected hotel option&apos;s per-person price. A component-based cost engine (hotel + vehicle + sightseeing + margin + taxes) is the recommended next iteration.</div>
      <Field label="Validity note" value={pkg.validity || 'Valid till 15 Aug 2026'} onChange={v => update('validity', v)} />
    </div>
  );
}

export function FinePrint({ pkg, setPkg }) {
  return (
    <div className="editorCard">
      <div className="cardHead"><b>Booking notes</b></div>
      {pkg.notes.map((x, i) => (
        <div className="activityRow" key={i}>
          <input value={x} onChange={e => setPkg(p => ({ ...p, notes: p.notes.map((v, j) => j === i ? e.target.value : v) }))} />
          <button onClick={() => setPkg(p => ({ ...p, notes: p.notes.filter((_, j) => j !== i) }))}>×</button>
        </div>
      ))}
      <button className="miniAdd" onClick={() => setPkg(p => ({ ...p, notes: [...p.notes, 'New booking note'] }))}>+ Add note</button>
    </div>
  );
}
