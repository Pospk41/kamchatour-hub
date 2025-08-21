import type { Metadata } from 'next';
import Link from 'next/link';

export const dynamic = 'force-static';

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	return { title: `Тур ${params.id} — Kamchatka` };
}

export default async function TourPage({ params }: Props) {
	return (
		<div className="max-w-3xl mx-auto px-4 py-6">
			<h1 className="text-2xl font-bold">Тур {params.id}</h1>
			<p className="text-slate-600 mt-2">Веб‑оболочка страницы тура. Интегрируем данные на следующем шаге.</p>
			<div className="mt-6">
				<Link href="/">На главную</Link>
			</div>
		</div>
	);
}

