import requests, re
from bs4 import BeautifulSoup

req = requests.Session()

res = req.get("https://learn.tsinghua.edu.cn/f/login")

soup = BeautifulSoup(res.text, "lxml")

loginUrl = soup.find(id = "loginForm").get("action")

res = req.post(loginUrl, data = {
    "i_user": "<username>",
    "i_pass": "<password>",
    "atOnce": "true"
})

soup = BeautifulSoup(res.text, "lxml")

redirectUrl = re.search(r'window.location.replace\("([^"]+)" \);', soup.find_all("script")[0].get_text()).group(1)

res = req.get(redirectUrl)

soup = BeautifulSoup(res.text, "lxml")

redirectUrl = re.search(r'window.location="([^"]+)";', soup.find_all("script")[0].get_text()).group(1)

res = req.get("https://learn.tsinghua.edu.cn" + redirectUrl)

soup = BeautifulSoup(res.text, "lxml")

print(soup.find(id = "filtericon2").get_text().strip())
