import json


def generate_html(json_file, output_file="vluchten.html"):
    with open(json_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    def render_flights(category_name, flights):
        flights_sorted = sorted(flights, key=lambda x: x.get("price", 999999))
        html = f"<h2>{category_name}</h2>\n<ul>\n"
        for f in flights_sorted:
            prijs = f.get("price", "Onbekend")
            totaal_duur = f.get("total_duration", "Onbekend")
            airline_logo = f.get("airline_logo", "")
            vlucht_type = f.get("type", "")
            legs = []
            for leg in f.get("flights", []):
                legs.append(
                    f"<li>{leg['airline']} ({leg['flight_number']})<br>"
                    f"{leg['departure_airport']['name']} ({leg['departure_airport']['id']}) "
                    f"{leg['departure_airport']['time']} → "
                    f"{leg['arrival_airport']['name']} ({leg['arrival_airport']['id']}) "
                    f"{leg['arrival_airport']['time']}<br>"
                    f"Duur: {leg['duration']} min | Vliegtuig: {leg['airplane']} | "
                    f"Klasse: {leg['travel_class']} | Beenruimte: {leg.get('legroom','-')}</li>"
                )
            legs_html = "<ul>" + "".join(legs) + "</ul>"
            html += (
                f"<li>"
                f"<img src='{airline_logo}' alt='logo' style='height:20px;'> "
                f"<b>Prijs:</b> €{prijs} | <b>Totale duur:</b> {totaal_duur} min | {vlucht_type}"
                f"{legs_html}"
                f"</li>\n"
            )
        html += "</ul>\n"
        return html

    html_content = """
    <html>
    <head>
      <meta charset="utf-8">
      <title>Vluchten Overzicht</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        h1 { text-align: center; }
        h2 { margin-top: 40px; color: #2c3e50; }
        ul { list-style: none; padding: 0; }
        li { margin: 15px 0; padding: 10px; border: 1px solid #ccc; border-radius: 8px; background: #f9f9f9; }
        img { vertical-align: middle; margin-right: 8px; }
      </style>
    </head>
    <body>
      <h1>Vluchten Overzicht</h1>
    """

    if "best_flights" in data:
        html_content += render_flights("Best Flights", data["best_flights"])
    if "other_flights" in data:
        html_content += render_flights("Other Flights", data["other_flights"])

    html_content += "</body></html>"

    with open(output_file, "w", encoding="utf-8") as f:
        f.write(html_content)

    print(f"✅ HTML bestand gegenereerd: {output_file}")


if __name__ == "__main__":
    generate_html("vluchten.json")
