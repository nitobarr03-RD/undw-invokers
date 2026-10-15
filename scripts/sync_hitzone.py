from datetime import datetime, timezone
from html.parser import HTMLParser
from html import unescape
from urllib.request import Request, urlopen
from urllib.parse import urljoin
import json, re
from pathlib import Path

HOME = "https://hitzone.helpshift.com/hc/en/"
SECTION = "https://hitzone.helpshift.com/hc/en/3-invokers-titan-legacy/section/7-news-and-updates/"
OUT = Path("data/hitzone-latest.json")

class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.links=[]; self.meta={}; self.title_parts=[]; self.p=[]; self._title=False; self._p=False; self._pbuf=[]
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if tag == "a" and a.get("href"): self.links.append((a["href"], ""))
        if tag == "meta":
            key=a.get("property") or a.get("name")
            if key and a.get("content"): self.meta[key.lower()]=a["content"]
        if tag == "title": self._title=True
        if tag == "p": self._p=True; self._pbuf=[]
    def handle_endtag(self, tag):
        if tag == "title": self._title=False
        if tag == "p" and self._p:
            text=" ".join("".join(self._pbuf).split())
            if len(text)>45: self.p.append(text)
            self._p=False
        if tag == "a" and self.links:
            href, text=self.links[-1]; self.links[-1]=(href,text)
    def handle_data(self, data):
        if self._title: self.title_parts.append(data)
        if self._p: self._pbuf.append(data)
        # Anchor text is handled separately by tracking the last open anchor in main() via a second parser fallback.

class Links(HTMLParser):
    def __init__(self): super().__init__(); self.items=[]; self.current=None
    def handle_starttag(self, tag, attrs):
        if tag=="a":
            a=dict(attrs); href=a.get("href","")
            if href: self.current=[href,""]
    def handle_data(self, data):
        if self.current is not None: self.current[1]+=" "+data
    def handle_endtag(self, tag):
        if tag=="a" and self.current is not None:
            self.items.append((self.current[0]," ".join(self.current[1].split())))
            self.current=None

def get(url):
    req=Request(url, headers={"User-Agent":"UNDW-Invokers-Community-Guide/1.0 (public Help Center news sync)","Accept":"text/html"})
    with urlopen(req, timeout=30) as response:
        if response.status != 200: raise RuntimeError(f"HitZone respondió {response.status}")
        return response.read().decode("utf-8", "replace")

candidates=[]
for page_url in (HOME, SECTION):
    html=get(page_url); links=Links(); links.feed(html)
    candidates=[(urljoin(page_url, href), title) for href,title in links.items if "/faq/" in href and "update-news" in href.lower()]
    if candidates: break
if not candidates: raise RuntimeError("No encontré una noticia pública de actualización en el Centro de ayuda de HitZone")
article_url,title=candidates[0]
article_html=get(article_url); page=Page(); page.feed(article_html)
article_title=page.meta.get("og:title") or " ".join(page.title_parts).strip() or title or "Novedad de Invokers"
article_title=re.sub(r"\s*[—|].*$", "", unescape(article_title)).strip()
summary=page.meta.get("description") or page.meta.get("og:description") or (page.p[0] if page.p else "Abre la publicación oficial de HitZone para leer todos los detalles.")
summary=" ".join(unescape(summary).split())[:420]
version_match=re.search(r"\b0\.\d+(?:\.\d+)?\b", article_title+" "+title)
result={"source":"HitZone Games · Help Center","title":article_title,"version":version_match.group(0) if version_match else "","url":article_url,"summary":summary,"checkedAt":datetime.now(timezone.utc).isoformat(timespec="seconds")}
OUT.parent.mkdir(parents=True,exist_ok=True)
OUT.write_text(json.dumps(result,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
print(f"Sincronizado: {article_title} -> {article_url}")
