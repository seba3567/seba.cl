<script lang="ts">
import {
	ArrowUpRight,
	CaretDown,
	Database,
	Envelope,
	Eye,
	Lock,
	ShareNetwork,
	ShieldCheck,
	Trash,
	X,
} from 'phosphor-svelte';
import * as Accordion from '$lib/components/ui/accordion';
import { Badge } from '$lib/components/ui/badge';
import { Button } from '$lib/components/ui/button';
import * as Dialog from '$lib/components/ui/dialog';

type Section = {
	value: string;
	icon: typeof Database;
	title: string;
	body: string;
	bullets: string[];
};

type Props = { open: boolean; onOpenChange: (v: boolean) => void };
let { open = $bindable(false), onOpenChange }: Props = $props();

const PRIVACY_URL = 'https://seba3567.github.io/anticall_pages/';
const CONTACT_EMAIL = 'seba3567.dev@gmail.com';
const LAST_UPDATED = '3 de diciembre de 2025';

const sections: Section[] = [
	{
		value: 'datos',
		icon: Database,
		title: 'Datos que recopilamos',
		body: 'Anticall Chile no recopila, almacena ni transmite datos personales a servidores externos. Toda la lógica de bloqueo y análisis ocurre localmente en tu dispositivo.',
		bullets: [
			'No solicitamos cuentas ni credenciales: la app opera sin registro.',
			'Los números bloqueados o listas personalizadas residen únicamente en tu teléfono.',
			'Las métricas de llamadas se guardan de manera local y puedes eliminarlas cuando quieras.',
			'Solo accedemos a permisos del sistema para ejecutar funciones esenciales y nunca copiamos esa información fuera del equipo.',
		],
	},
	{
		value: 'uso',
		icon: Eye,
		title: 'Cómo usamos la información',
		body: 'Al no existir transferencia a la nube, el uso de información se limita estrictamente al funcionamiento local de la aplicación.',
		bullets: [
			'Procesar eventos de llamadas en el dispositivo para detectar y bloquear spam.',
			'Recordar tus configuraciones, listas y preferencias solo dentro del almacenamiento de la app.',
			'Mostrar métricas básicas en la interfaz para que evalúes la efectividad del bloqueo.',
			'Permitir que exportes o elimines manualmente cualquier dato almacenado localmente.',
		],
	},
	{
		value: 'compartir',
		icon: ShareNetwork,
		title: 'Cuándo compartimos datos',
		body: 'No hay transferencia ni compartición automática de datos, porque la información nunca abandona tu dispositivo.',
		bullets: [
			'No trabajamos con terceros que procesen tus datos personales.',
			'Solo puedes compartir información si decides exportarla o enviarla voluntariamente.',
			'En caso de obligación legal, primero te solicitaríamos la información pertinente, ya que no la almacenamos por defecto.',
		],
	},
	{
		value: 'derechos',
		icon: ShieldCheck,
		title: 'Derechos de las personas usuarias',
		body: 'Aunque la aplicación no conserva datos en servidores, respetamos los derechos otorgados por la legislación chilena e internacional.',
		bullets: [
			'Control total desde la app para revisar o eliminar registros locales.',
			'Posibilidad de respaldar tus listas y métricas en tu propio dispositivo antes de desinstalar.',
			'Soporte para consultas relacionadas con privacidad o cumplimiento normativo.',
			'Canal abierto para reportar cualquier incidente o inquietud.',
		],
	},
	{
		value: 'seguridad',
		icon: Lock,
		title: 'Medidas de seguridad',
		body: 'Diseñamos la solución para minimizar superficie de ataque y dependencia externa.',
		bullets: [
			'Procesamiento local: sin sincronización con servidores ni copias en la nube.',
			'Uso de las API oficiales de la plataforma para gestionar permisos sensibles.',
			'Actualizaciones periódicas para mantener el software libre de vulnerabilidades conocidas.',
			'Recomendaciones dentro de la app para que protejas tu dispositivo (PIN, biometría, cifrado).',
		],
	},
	{
		value: 'conservacion',
		icon: Trash,
		title: 'Período de conservación',
		body: 'Como la información se mantiene solo en tu teléfono, tú decides cuánto tiempo conservarla.',
		bullets: [
			'Puedes borrar historial, listas y configuraciones desde los ajustes en cualquier momento.',
			'Al desinstalar la aplicación se eliminan automáticamente todos los datos asociados.',
		],
	},
	{
		value: 'contacto',
		icon: Envelope,
		title: 'Contacto de privacidad',
		body: '¿Tienes preguntas o solicitudes? Nuestro equipo está disponible para ayudarte.',
		bullets: ['Correo: seba3567.dev@gmail.com'],
	},
];
</script>

<Dialog.Root bind:open={() => open, (v) => { open = v; onOpenChange?.(v); }}>
	<Dialog.Portal>
		<Dialog.Overlay
			class="fixed inset-0 z-50 bg-neutral-950/85 backdrop-blur-2xl data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
		/>
		<Dialog.Content
			class="glass-liquid-static fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[min(96vw,860px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl shadow-2xl shadow-black/70 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
		>
			<!-- Top bar -->
			<div
				class="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-3 p-5 sm:p-6"
			>
				<Badge
					variant="outline"
					class="pointer-events-auto border-mint-400/20 bg-mint-500/5 px-2.5 py-0.5 font-mono text-[10px] font-normal uppercase tracking-wider text-mint-300"
				>
					<span class="relative flex size-1.5">
						<span
							class="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint-400 opacity-75"
						></span>
						<span class="relative inline-flex size-1.5 rounded-full bg-mint-400"></span>
					</span>
					Privacidad
				</Badge>
				<Dialog.Close
					class="pointer-events-auto inline-flex size-9 items-center justify-center rounded-full border border-white/10 bg-neutral-950/80 text-neutral-300 backdrop-blur transition-colors hover:bg-white/10 hover:text-neutral-100"
					aria-label="Cerrar"
				>
					<X size={14} weight="bold" />
				</Dialog.Close>
			</div>

			<!-- Body -->
			<div class="scroll-thin max-h-[90vh] overflow-y-auto px-6 pt-20 pb-6 sm:px-10 sm:pt-24 sm:pb-8">
				<Dialog.Header class="mb-8">
					<Dialog.Title class="sr-only">Política de Privacidad de Anticall Chile</Dialog.Title>
					<div class="text-balance text-3xl font-semibold leading-[1.05] tracking-[-0.03em] text-neutral-50 sm:text-4xl md:text-5xl">
						Política de Privacidad.
					</div>
					<Dialog.Description class="mt-3 text-sm text-neutral-400 sm:text-base">
						Tu confianza es fundamental. Esta política describe cómo recopilamos, utilizamos y
						protegemos tus datos al usar Anticall Chile.
					</Dialog.Description>
					<p class="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
						Última actualización · {LAST_UPDATED}
					</p>
				</Dialog.Header>

				<Accordion.Root type="multiple" class="space-y-2" value={['datos']}>
					{#each sections as s, i (s.value)}
						{@const Icon = s.icon}
						<Accordion.Item
							value={s.value}
							class="group rounded-2xl border border-white/5 bg-white/[0.015] transition-colors hover:border-white/10 data-[state=open]:border-mint-400/20 data-[state=open]:bg-white/[0.03]"
						>
							<Accordion.Trigger
								class="flex w-full items-center gap-4 rounded-2xl px-4 py-3.5 text-left transition-colors hover:bg-white/[0.02]"
							>
								<div
									class="flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition-colors group-data-[state=open]:border-mint-400/40 group-data-[state=open]:bg-mint-500/10"
								>
									<Icon
										size={16}
										weight="duotone"
										class="text-neutral-300 transition-colors group-data-[state=open]:text-mint-300"
									/>
								</div>
								<div class="min-w-0 flex-1">
									<div class="flex items-baseline gap-2.5">
										<span
											class="font-mono text-[10px] text-neutral-600 transition-colors group-data-[state=open]:text-mint-400"
											>0{i + 1}</span
										>
										<h3
											class="text-balance text-base font-semibold tracking-tight text-neutral-100 sm:text-lg"
										>
											{s.title}
										</h3>
									</div>
								</div>
								<CaretDown
									size={14}
									weight="bold"
									class="shrink-0 text-neutral-500 transition-transform duration-300 group-data-[state=open]:rotate-180 group-data-[state=open]:text-mint-300"
								/>
							</Accordion.Trigger>
							<Accordion.Content
								class="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
							>
								<div class="px-4 pb-4 pl-[60px]">
									<p class="text-pretty text-sm leading-relaxed text-neutral-300 sm:text-[15px]">
										{s.body}
									</p>
									{#if s.bullets.length}
										<ul class="mt-3 space-y-1.5">
											{#each s.bullets as b (b)}
												<li
													class="flex items-start gap-2.5 text-sm leading-relaxed text-neutral-400"
												>
													<span class="mt-1.5 size-1 shrink-0 rounded-full bg-neutral-600"></span>
													<span>{b}</span>
												</li>
											{/each}
										</ul>
									{/if}
								</div>
							</Accordion.Content>
						</Accordion.Item>
					{/each}
				</Accordion.Root>

				<Dialog.Footer
					class="mt-8 flex flex-col items-stretch gap-2 border-t border-white/5 pt-6 sm:flex-row sm:items-center sm:justify-between"
				>
					<p class="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
						© 2025 Anticall Chile · Todos los derechos reservados
					</p>
					<div class="flex flex-wrap items-center gap-2">
						<Button
							href={PRIVACY_URL}
							target="_blank"
							rel="noreferrer noopener"
							variant="outline"
							size="sm"
						>
							<ArrowUpRight size={11} weight="bold" data-icon="inline-end" />
							Ver original
						</Button>
						<Dialog.Close>
							{#snippet child({ props })}
								<Button {...props} size="sm">Entendido</Button>
							{/snippet}
						</Dialog.Close>
					</div>
				</Dialog.Footer>
			</div>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
