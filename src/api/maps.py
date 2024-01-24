import os 
import googlemaps



api_key = os.getenv("PLACES_API_KEY")
maps_api = googlemaps.Client(key=env("PLACES_API_KEY"))

work_place_address = 'Avenida de la Transición española'
response = map_client.geocade(work_place_address)


