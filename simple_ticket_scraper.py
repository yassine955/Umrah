#!/usr/bin/env python3

import subprocess
import tempfile
import os
import json
from bs4 import BeautifulSoup
import re
import time


class SimpleTicketScraper:
    def __init__(self):
        self.base_url = "https://sar.hhr.sa"
        self.home_url = f"{self.base_url}/web/booking/home"

    def get_tickets(
        self,
        from_station="5",
        to_station="1",
        travel_date="20/09/2025",
        adults=2,
        children=0,
        infants=0,
    ):
        """Get available train tickets"""

        # Create a temporary cookie jar
        cookie_file = tempfile.NamedTemporaryFile(
            mode="w+", delete=False, suffix=".txt"
        )
        cookie_file.close()

        try:
            # Step 1: Get the home page and establish session
            print("1. Loading home page...")
            home_cmd = [
                "curl",
                "-k",
                "-s",
                "-L",
                "-c",
                cookie_file.name,
                "-H",
                "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "-H",
                "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "-H",
                "Accept-Language: en-US,en;q=0.5",
                "-H",
                "Connection: keep-alive",
                "-H",
                "Upgrade-Insecure-Requests: 1",
                self.home_url,
            ]

            home_result = subprocess.run(
                home_cmd, capture_output=True, text=True, timeout=30
            )

            if home_result.returncode != 0:
                print(f"Failed to get home page: {home_result.stderr}")
                return []

            # Parse ViewState and form details
            soup = BeautifulSoup(home_result.stdout, "html.parser")
            view_state_input = soup.find("input", {"name": "javax.faces.ViewState"})

            if not view_state_input:
                print("Could not find ViewState")
                return []

            view_state = view_state_input.get("value")
            print(f"ViewState: {view_state[:50]}...")

            # Step 2: Set the FROM station first
            print("2. Setting FROM station...")
            set_from_cmd = [
                "curl",
                "-k",
                "-s",
                "-L",
                "-X",
                "POST",
                "-b",
                cookie_file.name,
                "-c",
                cookie_file.name,
                "-H",
                "Accept: application/xml, text/xml, */*; q=0.01",
                "-H",
                "Content-Type: application/x-www-form-urlencoded; charset=UTF-8",
                "-H",
                "Faces-Request: partial/ajax",
                "-H",
                "Origin: https://sar.hhr.sa",
                "-H",
                "Referer: https://sar.hhr.sa/web/booking/home",
                "-H",
                "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "-H",
                "X-Requested-With: XMLHttpRequest",
                "--data",
                f"javax.faces.partial.ajax=true&javax.faces.source=_ossportlet_WAR_ossliferay_:formSearchTravel:comboStationFrom&javax.faces.partial.execute=_ossportlet_WAR_ossliferay_:formSearchTravel:comboStationFrom&javax.faces.partial.render=_ossportlet_WAR_ossliferay_:formSearchTravel:comboStationTo _ossportlet_WAR_ossliferay_:formSearchTravel:yourSearch _ossportlet_WAR_ossliferay_:formSearchTravel:tableResult _ossportlet_WAR_ossliferay_:formSearchTravel:botoneraSearch&_ossportlet_WAR_ossliferay_:formSearchTravel:comboStationFrom={from_station}&_ossportlet_WAR_ossliferay_:formSearchTravel:comboStationTo=&_ossportlet_WAR_ossliferay_:formSearchTravel:choiceTravel=true&_ossportlet_WAR_ossliferay_:formSearchTravel:selectCalendar=gregorian&_ossportlet_WAR_ossliferay_:formSearchTravel:calendar={travel_date}&_ossportlet_WAR_ossliferay_:formSearchTravel:adults={adults}&_ossportlet_WAR_ossliferay_:formSearchTravel:children={children}&_ossportlet_WAR_ossliferay_:formSearchTravel:infants={infants}&javax.faces.ViewState={view_state}",
                "https://sar.hhr.sa/web/booking/home?p_p_id=ossportlet_WAR_ossliferay&p_p_lifecycle=2&p_p_state=normal&p_p_mode=view&p_p_cacheability=cacheLevelPage&p_p_col_id=column-2&p_p_col_count=1&_ossportlet_WAR_ossliferay__jsfBridgeAjax=true&_ossportlet_WAR_ossliferay__facesViewIdResource=%2FWEB-INF%2Fviews%2FsearchTravelResult.xhtml",
            ]

            set_from_result = subprocess.run(
                set_from_cmd, capture_output=True, text=True, timeout=30
            )
            print(f"Set FROM response length: {len(set_from_result.stdout)}")

            # Step 3: Set the TO station
            print("3. Setting TO station...")
            set_to_cmd = [
                "curl",
                "-k",
                "-s",
                "-L",
                "-X",
                "POST",
                "-b",
                cookie_file.name,
                "-c",
                cookie_file.name,
                "-H",
                "Accept: application/xml, text/xml, */*; q=0.01",
                "-H",
                "Content-Type: application/x-www-form-urlencoded; charset=UTF-8",
                "-H",
                "Faces-Request: partial/ajax",
                "-H",
                "Origin: https://sar.hhr.sa",
                "-H",
                "Referer: https://sar.hhr.sa/web/booking/home",
                "-H",
                "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "-H",
                "X-Requested-With: XMLHttpRequest",
                "--data",
                f"javax.faces.partial.ajax=true&javax.faces.source=_ossportlet_WAR_ossliferay_:formSearchTravel:comboStationTo&javax.faces.partial.execute=_ossportlet_WAR_ossliferay_:formSearchTravel:comboStationTo&javax.faces.partial.render=_ossportlet_WAR_ossliferay_:formSearchTravel:yourSearch _ossportlet_WAR_ossliferay_:formSearchTravel:tableResult _ossportlet_WAR_ossliferay_:formSearchTravel:botoneraSearch&_ossportlet_WAR_ossliferay_:formSearchTravel:comboStationFrom={from_station}&_ossportlet_WAR_ossliferay_:formSearchTravel:comboStationTo={to_station}&_ossportlet_WAR_ossliferay_:formSearchTravel:choiceTravel=true&_ossportlet_WAR_ossliferay_:formSearchTravel:selectCalendar=gregorian&_ossportlet_WAR_ossliferay_:formSearchTravel:calendar={travel_date}&_ossportlet_WAR_ossliferay_:formSearchTravel:adults={adults}&_ossportlet_WAR_ossliferay_:formSearchTravel:children={children}&_ossportlet_WAR_ossliferay_:formSearchTravel:infants={infants}&javax.faces.ViewState={view_state}",
                "https://sar.hhr.sa/web/booking/home?p_p_id=ossportlet_WAR_ossliferay&p_p_lifecycle=2&p_p_state=normal&p_p_mode=view&p_p_cacheability=cacheLevelPage&p_p_col_id=column-2&p_p_col_count=1&_ossportlet_WAR_ossliferay__jsfBridgeAjax=true&_ossportlet_WAR_ossliferay__facesViewIdResource=%2FWEB-INF%2Fviews%2FsearchTravelResult.xhtml",
            ]

            set_to_result = subprocess.run(
                set_to_cmd, capture_output=True, text=True, timeout=30
            )
            print(f"Set TO response length: {len(set_to_result.stdout)}")

            # Step 4: Perform the search
            print("4. Searching for trains...")
            search_cmd = [
                "curl",
                "-k",
                "-s",
                "-L",
                "-X",
                "POST",
                "-b",
                cookie_file.name,
                "-H",
                "Accept: application/xml, text/xml, */*; q=0.01",
                "-H",
                "Content-Type: application/x-www-form-urlencoded; charset=UTF-8",
                "-H",
                "Faces-Request: partial/ajax",
                "-H",
                "Origin: https://sar.hhr.sa",
                "-H",
                "Referer: https://sar.hhr.sa/web/booking/home",
                "-H",
                "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "-H",
                "X-Requested-With: XMLHttpRequest",
                "--data",
                f"javax.faces.partial.ajax=true&javax.faces.source=_ossportlet_WAR_ossliferay_:formSearchTravel:search&javax.faces.partial.execute=@all&javax.faces.partial.render=_ossportlet_WAR_ossliferay_:formSearchTravel _ossportlet_WAR_ossliferay_:dialogPromotionalCode&_ossportlet_WAR_ossliferay_:formSearchTravel:search=_ossportlet_WAR_ossliferay_:formSearchTravel:search&_ossportlet_WAR_ossliferay_:formSearchTravel=_ossportlet_WAR_ossliferay_:formSearchTravel&javax.faces.encodedURL=https://sar.hhr.sa/web/booking/home?p_p_id=ossportlet_WAR_ossliferay&p_p_lifecycle=2&p_p_state=normal&p_p_mode=view&p_p_cacheability=cacheLevelPage&p_p_col_id=column-2&p_p_col_count=1&_ossportlet_WAR_ossliferay__jsfBridgeAjax=true&_ossportlet_WAR_ossliferay__facesViewIdResource=%2FWEB-INF%2Fviews%2FsearchTravelResult.xhtml&_ossportlet_WAR_ossliferay_:formSearchTravel:choiceTravel=true&_ossportlet_WAR_ossliferay_:formSearchTravel:comboStationFrom={from_station}&_ossportlet_WAR_ossliferay_:formSearchTravel:comboStationTo={to_station}&_ossportlet_WAR_ossliferay_:formSearchTravel:selectCalendar=gregorian&_ossportlet_WAR_ossliferay_:formSearchTravel:calendar={travel_date}&_ossportlet_WAR_ossliferay_:formSearchTravel:adults={adults}&_ossportlet_WAR_ossliferay_:formSearchTravel:children={children}&_ossportlet_WAR_ossliferay_:formSearchTravel:infants={infants}&_ossportlet_WAR_ossliferay_:formSearchTravel:selectedTariff=&_ossportlet_WAR_ossliferay_:formSearchTravel:selectedTariffReturn=&javax.faces.ViewState={view_state}",
                "https://sar.hhr.sa/web/booking/home?p_p_id=ossportlet_WAR_ossliferay&p_p_lifecycle=2&p_p_state=normal&p_p_mode=view&p_p_cacheability=cacheLevelPage&p_p_col_id=column-2&p_p_col_count=1&_ossportlet_WAR_ossliferay__jsfBridgeAjax=true&_ossportlet_WAR_ossliferay__facesViewIdResource=%2FWEB-INF%2Fviews%2FsearchTravelResult.xhtml",
            ]

            search_result = subprocess.run(
                search_cmd, capture_output=True, text=True, timeout=30
            )

            if search_result.returncode == 0:
                print(f"Search response length: {len(search_result.stdout)}")

                # Save response for debugging
                with open("ticket_search_response.html", "w", encoding="utf-8") as f:
                    f.write(search_result.stdout)
                print("Saved search response to ticket_search_response.html")

                # Parse the results
                return self.parse_tickets(search_result.stdout)
            else:
                print(f"Search failed: {search_result.stderr}")
                return []

        finally:
            # Clean up cookie file
            try:
                os.unlink(cookie_file.name)
            except:
                pass

    def parse_tickets(self, html_content):
        """Parse the HTML to extract train ticket information"""
        try:
            soup = BeautifulSoup(html_content, "html.parser")
            tickets = []

            # Look for train data in various possible structures
            # Method 1: Look for table rows with data-ri attribute
            train_rows = soup.find_all("tr", {"data-ri": True})
            print(f"Found {len(train_rows)} train rows with data-ri")

            for row in train_rows:
                cells = row.find_all("td", {"role": "gridcell"})

                if len(cells) >= 5:
                    ticket = {}

                    # Extract departure time (2nd cell)
                    departure_cell = cells[1]
                    departure_time = departure_cell.get_text(strip=True)
                    if departure_time and ":" in departure_time:
                        ticket["departure"] = departure_time

                    # Extract arrival time (3rd cell)
                    arrival_cell = cells[2]
                    arrival_time = arrival_cell.get_text(strip=True)
                    if arrival_time and ":" in arrival_time:
                        ticket["arrival"] = arrival_time

                    # Extract duration (4th cell)
                    duration_cell = cells[3]
                    duration = duration_cell.get_text(strip=True)
                    if duration and ("h" in duration or "min" in duration):
                        ticket["duration"] = duration

                    # Extract train number and stops (5th cell)
                    train_cell = cells[4]
                    train_text = train_cell.get_text(strip=True)

                    # Look for train number (usually 5 digits)
                    train_number_match = re.search(r"\b\d{5}\b", train_text)
                    if train_number_match:
                        ticket["train_number"] = train_number_match.group()

                    # Look for stops information
                    if "non-stop" in train_text.lower():
                        ticket["stops"] = "Non-stop"
                    elif "stop" in train_text.lower():
                        stops_match = re.search(r"(\d+)\s+stop", train_text.lower())
                        if stops_match:
                            ticket["stops"] = f"{stops_match.group(1)} Stop"

                    # Only add if we have meaningful data
                    if len(ticket) >= 3:
                        tickets.append(ticket)

            # Method 2: Look for any table with train-like data
            if not tickets:
                print("Trying alternative parsing method...")
                tables = soup.find_all("table")

                for table in tables:
                    rows = table.find_all("tr")

                    for row in rows[1:]:  # Skip header
                        cells = row.find_all(["td", "th"])

                        if len(cells) >= 4:
                            # Look for time patterns in the cells
                            time_cells = []
                            for cell in cells:
                                text = cell.get_text(strip=True)
                                if ":" in text and len(text) <= 6:
                                    time_cells.append(text)

                            if len(time_cells) >= 2:
                                ticket = {
                                    "departure": time_cells[0],
                                    "arrival": time_cells[1],
                                    "duration": (
                                        time_cells[2]
                                        if len(time_cells) > 2
                                        else "Unknown"
                                    ),
                                }

                                # Look for train number in any cell
                                for cell in cells:
                                    text = cell.get_text(strip=True)
                                    train_match = re.search(r"\b\d{5}\b", text)
                                    if train_match:
                                        ticket["train_number"] = train_match.group()
                                        break

                                tickets.append(ticket)

            # Method 3: Look for any text that looks like train times
            if not tickets:
                print("Trying text-based parsing...")
                time_pattern = r"\b\d{1,2}:\d{2}\b"
                all_times = re.findall(time_pattern, html_content)

                if len(all_times) >= 2:
                    # Group times in pairs (departure, arrival)
                    for i in range(0, len(all_times) - 1, 2):
                        if i + 1 < len(all_times):
                            ticket = {
                                "departure": all_times[i],
                                "arrival": all_times[i + 1],
                                "duration": "Unknown",
                            }
                            tickets.append(ticket)

            print(f"Total tickets found: {len(tickets)}")
            return tickets

        except Exception as e:
            print(f"Error parsing tickets: {e}")
            return []


def main():
    scraper = SimpleTicketScraper()

    print("=== Simple SAR Train Ticket Scraper ===")
    print("Getting available train tickets...")

    # Search for trains
    tickets = scraper.get_tickets(
        from_station="3",  # AIRPORT - JEDDAH
        to_station="5",  # Madinah
        travel_date="26/09/2025",
        adults=2,
        children=0,
        infants=0,
    )

    if tickets:
        print(f"\n🎫 Found {len(tickets)} available train tickets:")
        print("=" * 50)

        for i, ticket in enumerate(tickets, 1):
            print(f"\n{i}. Train {ticket.get('train_number', 'N/A')}")
            print(f"   Departure: {ticket.get('departure', 'N/A')}")
            print(f"   Arrival: {ticket.get('arrival', 'N/A')}")
            print(f"   Duration: {ticket.get('duration', 'N/A')}")
            print(f"   Stops: {ticket.get('stops', 'N/A')}")

        # Save to JSON
        with open("available_tickets.json", "w", encoding="utf-8") as f:
            json.dump(tickets, f, indent=2, ensure_ascii=False)
        print(f"\n💾 Results saved to available_tickets.json")

    else:
        print("❌ No train tickets found or error occurred")
        print("Check ticket_search_response.html for debugging info")


if __name__ == "__main__":
    main()
