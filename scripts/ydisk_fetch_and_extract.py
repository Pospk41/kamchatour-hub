#!/usr/bin/env python3
import os
import sys
import json
import urllib.parse
import urllib.request
import zipfile
import xml.etree.ElementTree as ET

PUBLIC_KEY = "https://disk.yandex.ru/d/a8bAn0Gv2ztWmg"
DOWNLOAD_API = "https://cloud-api.yandex.net/v1/disk/public/resources/download"

TARGET_DIR = "/workspace/_ydisk"
TEXT_DIR = "/workspace/_ydisk_texts"

SELECTED_PATHS = [
	"/Пошаговая новая разработка.docx",
	"/Создание ЛК.docx",
	"/ВЕТКА 26.07.docx",
	"/Личный кабинет как БУКИНГ.docx",
	"/Создаем карточки активносте 2 Вариант.docx",
	"/сколково.pdf",
]


def ensure_dirs():
	os.makedirs(TARGET_DIR, exist_ok=True)
	os.makedirs(TEXT_DIR, exist_ok=True)


def get_download_href(path: str) -> str:
	params = urllib.parse.urlencode({
		"public_key": PUBLIC_KEY,
		"path": path,
	})
	url = f"{DOWNLOAD_API}?{params}"
	with urllib.request.urlopen(url) as resp:
		data = json.loads(resp.read().decode("utf-8"))
	return data.get("href", "")


def download_file(path: str, dest_path: str) -> None:
	href = get_download_href(path)
	if not href:
		raise RuntimeError(f"No download href for {path}")
	# Some hrefs include escaped ampersands; urllib handles them fine
	urllib.request.urlretrieve(href, dest_path)


def extract_docx_text(docx_path: str) -> str:
	with zipfile.ZipFile(docx_path) as zf:
		with zf.open("word/document.xml") as f:
			xml_bytes = f.read()
	root = ET.fromstring(xml_bytes)
	ns = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
	paragraphs: list[str] = []
	for p in root.findall(".//w:p", ns):
		texts = []
		for t in p.findall(".//w:t", ns):
			if t.text:
				texts.append(t.text)
		para = "".join(texts).strip()
		if para:
			paragraphs.append(para)
	return "\n".join(paragraphs)


def main():
	ensure_dirs()
	for path in SELECTED_PATHS:
		filename = os.path.basename(path)
		dest = os.path.join(TARGET_DIR, filename)
		print(f"Downloading {path} -> {dest}")
		download_file(path, dest)
		if filename.lower().endswith(".docx"):
			try:
				text = extract_docx_text(dest)
				with open(os.path.join(TEXT_DIR, filename + ".txt"), "w", encoding="utf-8") as out:
					out.write(text)
				print(f"Extracted text: {filename}.txt")
			except Exception as e:
				print(f"Failed to extract {filename}: {e}")
	print("Done.")


if __name__ == "__main__":
	main()

