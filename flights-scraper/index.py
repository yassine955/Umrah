import os
import json
from datetime import datetime
from serpapi import GoogleSearch
from html import escape

# ====== CONFIG ======
API_KEY = os.getenv("SERPAPI_KEY", "VUL_HIER_DESNOODS_TEMPORAR__KEY_IN")
OUT_JSON = "vluchten.json"
OUT_HTML = "vluchten.html"

# Hardcoded demo-data (zoals besproken)
OUTBOUND_DATE = "2025-09-10"
RETURN_DATE = "2025-09-20"
CURRENCY = "EUR"


def fetch_flights(departure_id: str, arrival_id: str, adults: int = 2):
    """Haalt Google Flights via SerpApi op en retourneert de dict."""
    params = {
        "api_key": API_KEY,
        "engine": "google_flights",
        "hl": "en",
        "gl": "nl",  # zoals in Playground
        "departure_id": departure_id,
        "arrival_id": arrival_id,
        "outbound_date": OUTBOUND_DATE,
        "return_date": RETURN_DATE,
        "currency": CURRENCY,
        "adults": str(adults),  # Playground gaf string
        "type": "1",  # 1 = round-trip in Playground output
        "sort_by": "2",  # 2 = prijs (goedkoopst eerst) in Playground
    }

    search = GoogleSearch(params)
    results = search.get_dict()
    return results


def save_json(data: dict, path: str = OUT_JSON):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def fmt_dt(value: str) -> str:
    """Formateer tijden mooi; verwacht 'YYYY-MM-DD HH:MM' of iso-achtige strings."""
    try:
        # Google Flights levert 'YYYY-MM-DD HH:MM'
        dt = datetime.strptime(value, "%Y-%m-%d %H:%M")
        return dt.strftime("%d %b %Y %H:%M")
    except Exception:
        return value


def mins_to_hhmm(total_minutes):
    try:
        m = int(total_minutes)
        h = m // 60
        r = m % 60
        return f"{h}u {r:02d}m"
    except Exception:
        return str(total_minutes)


def split_outbound_return(legs: list, arrival_id: str):
    """
    Heuristiek: alles t/m eerste aankomst op arrival_id = heenweg.
    Zodra we een leg zien die VERTREKT vanaf arrival_id, beschouwen we het als start van terugweg.
    Let op: SerpApi levert niet altijd teruglegs mee; dan blijft 'return_legs' leeg.
    """
    outbound_legs = []
    return_legs = []
    in_return = False

    for leg in legs:
        dep = leg.get("departure_airport", {}).get("id")
        arr = leg.get("arrival_airport", {}).get("id")
        if dep == arrival_id:
            in_return = True
        (return_legs if in_return else outbound_legs).append(leg)

    # fallback: als er nooit een leg vanaf arrival_id startte maar de laatste aankomst is arrival_id,
    # dan is het waarschijnlijk een one-way dataset.
    return outbound_legs, return_legs


def describe_layovers(flight_obj: dict):
    lays = flight_obj.get("layovers", [])
    if not lays:
        # afleiden via aantal legs
        legs = flight_obj.get("flights", []) or []
        if len(legs) <= 1:
            return "Non-stop"
        # probeer snelle samenvatting
        stops = [l.get("name") or l.get("id") for l in flight_obj.get("layovers", [])]
        if stops:
            return f"{len(stops)} stop(s): " + ", ".join(filter(None, stops))
        # laatste redmiddel: tel legs-1
        return f"{max(0, len(legs)-1)} stop(s)"
    names = []
    for l in lays:
        name = l.get("name") or l.get("id") or "Unknown"
        dur = l.get("duration")
        if dur is not None:
            names.append(f"{name} ({mins_to_hhmm(dur)})")
        else:
            names.append(name)
    return f"{len(lays)} stop(s): " + ", ".join(names)


def co2_badge(flight_obj: dict):
    ce = flight_obj.get("carbon_emissions")
    if not ce:
        return ""
    try:
        diff = ce.get("difference_percent")
        if diff is None:
            return ""
        color = "#2ecc71" if diff < 0 else "#e67e22" if diff < 20 else "#c0392b"
        sign = "+" if diff > 0 else ""
        return (
            f"<span style='display:inline-block;padding:2px 6px;border-radius:6px;"
            f"background:{color};color:#fff;font-size:12px;'>CO₂ {sign}{diff}% vs avg</span>"
        )
    except Exception:
        return ""


def render_leg_li(leg: dict) -> str:
    airline = escape(leg.get("airline", "?"))
    fn = escape(leg.get("flight_number", "?"))
    dep = leg.get("departure_airport", {})
    arr = leg.get("arrival_airport", {})
    dep_id = escape(dep.get("id", "?"))
    arr_id = escape(arr.get("id", "?"))
    dep_t = fmt_dt(dep.get("time", "?"))
    arr_t = fmt_dt(arr.get("time", "?"))
    dur = mins_to_hhmm(leg.get("duration", "?"))
    plane = escape(leg.get("airplane", "-") or "-")
    cls = escape(leg.get("travel_class", "-") or "-")
    legroom = escape(leg.get("legroom", "-") or "-")

    return (
        f"<li>"
        f"<b>{airline}</b> {fn}<br>"
        f"{dep_id} {dep_t} → {arr_id} {arr_t}<br>"
        f"Duur: {dur} • Toestel: {plane} • Klasse: {cls} • Beenruimte: {legroom}"
        f"</li>"
    )


def render_category(title: str, items: list, arrival_id: str) -> str:
    # sorteer op prijs ASC
    items_sorted = sorted(items, key=lambda x: x.get("price", 10**12))
    html = [f"<section><h2>{escape(title)}</h2>"]
    if not items_sorted:
        html.append("<p><i>Geen resultaten.</i></p></section>")
        return "".join(html)

    html.append("<div class='cards'>")
    for fobj in items_sorted:
        price = fobj.get("price", "Onbekend")
        total_minutes = fobj.get("total_duration")
        total_dur = (
            mins_to_hhmm(total_minutes) if total_minutes is not None else "Onbekend"
        )
        stops = describe_layovers(fobj)
        logo = fobj.get("airline_logo", "")
        trip_type = escape(fobj.get("type", ""))
        legs = fobj.get("flights", []) or []
        outbound, ret = split_outbound_return(legs, arrival_id)

        # bouw legs html
        out_html = (
            "<ul>" + "".join(render_leg_li(l) for l in outbound) + "</ul>"
            if outbound
            else "<p><i>Niet gevonden</i></p>"
        )
        ret_html = (
            "<ul>" + "".join(render_leg_li(l) for l in ret) + "</ul>"
            if ret
            else "<p><i>Niet gevonden (SerpApi levert soms alleen heen mee)</i></p>"
        )

        img_tag = f"<img class='logo' src='{logo}' alt='logo'>" if logo else ""
        card = (
            "<article class='card'>"
            f"{img_tag}"
            f"<div class='head'><span class='price'>€{price}</span>"
            f"<span class='meta'>{trip_type} • Totale duur: {total_dur} • {escape(stops)}</span>"
            f"{co2_badge(fobj)}</div>"
            "<div class='legs'>"
            "<div class='legcol'><h3>Heenweg</h3>" + out_html + "</div>"
            "<div class='legcol'><h3>Terugweg</h3>" + ret_html + "</div>"
            "</div>"
            "</article>"
        )
        html.append(card)
    html.append("</div></section>")
    return "".join(html)


def build_html(data: dict, arrival_id: str):
    title = "Vluchten Overzicht — SerpApi (Google Flights)"
    head = f"""
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <title>{escape(title)}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    :root {{
      --bg:#f6f8fb; --card:#fff; --border:#e5e7eb; --text:#111827; --muted:#6b7280;
      --accent:#2563eb; --chip:#eef2ff;
    }}
    body {{ font-family: ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto; margin: 24px; background: var(--bg); color: var(--text); }}
    header {{ display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; }}
    h1 {{ font-size: 22px; margin: 0; }}
    .pill {{ background: var(--chip); padding:4px 10px; border-radius:999px; color: var(--accent); font-size:12px; }}
    section {{ margin: 28px 0; }}
    h2 {{ font-size: 18px; margin: 8px 0 16px; color:#0f172a; }}
    .cards {{ display:grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap:16px; }}
    .card {{ background: var(--card); border:1px solid var(--border); border-radius:14px; padding:14px; box-shadow: 0 1px 2px rgb(0 0 0 / 0.04); }}
    .logo {{ height:20px; float:right; }}
    .head {{ display:flex; flex-direction:column; gap:6px; margin-bottom:8px; }}
    .price {{ font-weight: 700; font-size: 18px; }}
    .meta {{ color: var(--muted); font-size: 12px; }}
    .legs {{ display:grid; grid-template-columns: 1fr 1fr; gap:12px; }}
    .legcol h3 {{ font-size: 14px; margin: 8px 0; }}
    ul {{ list-style:none; padding:0; margin:0; }}
    li {{ padding:8px; border:1px dashed var(--border); border-radius:10px; margin-bottom:8px; background:#fafafa; }}
    @media (max-width: 720px) {{
      .legs {{ grid-template-columns: 1fr; }}
    }}
    footer {{ margin-top: 28px; color: var(--muted); font-size: 12px; }}
    a {{ color: var(--accent); text-decoration: none; }}
  </style>
</head>
<body>
<header>
  <h1>{escape(title)}</h1>
  <span class="pill">Demo • {escape(OUTBOUND_DATE)} → {escape(RETURN_DATE)}</span>
</header>
"""
    body = []

    if "cheapest_flights" in data and data["cheapest_flights"]:
        body.append(
            render_category("Cheapest Flights", data["cheapest_flights"], arrival_id)
        )
    if "best_flights" in data and data["best_flights"]:
        body.append(render_category("Best Flights", data["best_flights"], arrival_id))
    if "other_flights" in data and data["other_flights"]:
        body.append(render_category("Other Flights", data["other_flights"], arrival_id))

    footer = """
<footer>
  Bron: SerpApi → Google Flights (alleen voor demo/prototyping; resultaten en beschikbaarheid kunnen afwijken).
</footer>
</body>
</html>
"""
    return head + "".join(body) + footer


def save_html(html: str, path: str = OUT_HTML):
    with open(path, "w", encoding="utf-8") as f:
        f.write(html)


def main():
    print("=== SerpApi Google Flights → JSON + HTML ===")
    departure = (
        input("Vertrek (IATA of naam, bv. CMN of Casablanca): ").strip() or "CMN"
    )
    arrival = input("Bestemming (IATA of naam, bv. MED of Madinah): ").strip() or "MED"
    try:
        adults = int(input("Aantal personen (default 2): ").strip() or "2")
    except Exception:
        adults = 2

    results = fetch_flights(departure, arrival, adults)
    save_json(results, OUT_JSON)
    print(f"✅ JSON opgeslagen in {OUT_JSON}")

    html = build_html(results, arrival_id=arrival.upper())
    save_html(html, OUT_HTML)
    print(f"✅ HTML gegenereerd in {OUT_HTML}")

    # Klein console-overzicht
    for key in ("cheapest_flights", "best_flights", "other_flights"):
        lst = results.get(key) or []
        if not lst:
            continue
        cheapest = sorted(lst, key=lambda x: x.get("price", 10**12))[0]
        print(
            f"- {key}: min prijs €{cheapest.get('price')} (totale duur: {mins_to_hhmm(cheapest.get('total_duration'))})"
        )


if __name__ == "__main__":
    main()
