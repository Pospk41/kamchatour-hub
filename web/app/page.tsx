import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Kamchatka Tours (Web)</h1>
      <p>Веб-оболочка запущена. Страницы приложения будут добавляться постепенно.</p>
      <ul>
        <li>
          <Link href="/tours/demo">Пример страницы тура</Link>
        </li>
      </ul>
    </main>
  );
}
