import React from 'react';

function PaperHeader({ pkg, title }) {
  return (
    <>
      <div className="paperBrand"><b>{pkg.company}</b><span>{pkg.destination}</span></div>
      <div className="paperTitle"><span className="eyebrow">{pkg.destination}</span><h2>{title}</h2></div>
    </>
  );
}

export function Preview({ pkg, page }) {
  const money = n => `₹${Number(n || 0).toLocaleString('en-IN')}`;

  if (page === 1) {
    return (
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
  }

  if (page === 2) {
    return (
      <div className="paper">
        <PaperHeader pkg={pkg} title="The Journey" />
        <div className="journeyStrip">{pkg.route.map((x, i) => <React.Fragment key={i}><span>{x}</span>{i < pkg.route.length - 1 && <b>→</b>}</React.Fragment>)}</div>
        <h3>What&apos;s included</h3>
        <div className="previewGrid">{pkg.inclusions.map((x, i) => <div className="pCard" key={i}><i>✓</i>{x}</div>)}</div>
      </div>
    );
  }

  if (page === 3) {
    return (
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
  }

  if (page === 4) {
    return (
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
  }

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
