from asyncio.windows_events import NULL
import requests, re, sys
from datetime import datetime
from bs4 import BeautifulSoup
import requests
import urllib.parse
import urllib.request

# get all arguments from command line and make them string

game = sys.argv[1:]
game = ' '.join(map(str, game))

# get game title
game = game.replace(" ", "_")

url = 'https://store.steampowered.com/search/?sort_by=_ASC&term='+game

headers = {'User-Agent': 'Mozillsa/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'}

response = requests.get(url, headers=headers)

# parse html content
soup = BeautifulSoup( response.content , 'html.parser')

# get the link for the game steam page

for referances in soup.findAll('div', attrs = {'id':'search_resultsRows'}):
    link = referances.a['href']

# get app id
app_index = re.search(r'app/\d+/', link)
app_index_start = app_index.start() + 3
app_index_end = app_index.end() - 1 

app_id = link[app_index_start+1:app_index_end]

print(app_id)

# get current price, game title and image from steam
response = requests.get(link)
soup = BeautifulSoup(response.content , 'html.parser')

game_title = soup.find("div", class_ = "apphub_AppName").get_text()
game_title = " ".join(game_title.split())
print(game_title)

price = soup.find("div", class_ = "game_purchase_price price").get_text()
price = " ".join(price.split())

print(price)

img = soup.find_all("img", class_ = "game_header_image_full")
for element in img:
    img = element['src']

print(img)

# get prices from steam price history
url = 'https://steampricehistory.com/app/'+app_id
response = requests.get(url)
soup = BeautifulSoup(response.content , 'html.parser')

price = soup.find("section", class_ = "breakdown")
print(price)

