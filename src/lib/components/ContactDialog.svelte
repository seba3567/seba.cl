<script lang="ts">
	/**
	 * ContactDialog — formulario de contacto público.
	 *
	 * Reemplaza el `mailto:` directo del contact panel por un POST al
	 * backend de la intranet (api.seba3567.cl / localhost:3000 en dev).
	 *
	 * La dirección de email del dueño (CONTACT_TO en el backend) NO
	 * aparece en el bundle del cliente: solo el server sabe a dónde
	 * mandar el mensaje. Esto protege la casilla de scraping.
	 *
	 * Honeypot: un input `name="website"` hidden con `tabindex="-1"`
	 * y `autocomplete="off"`. Los bots lo llenan; el handler lo detecta
	 * y rechaza el request. Los humanos ni lo ven.
	 *
	 * UX:
	 *   - Estado idle → escribiendo → enviando → ok / error
	 *   - Después de ok, el form se resetea y queda listo para otro msg
	 *   - ESC y click-outside cierran el dialog
	 *   - Mientras envía, los inputs quedan disabled
	 */
	import { onMount } from 'svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { animate, stagger } from 'animejs';
	import {
		EnvelopeSimple,
		PaperPlaneTilt,
		CheckCircle,
		WarningCircle,
		X,
		User,
		At,
		ChatTeardropText,
	} from 'phosphor-svelte';
	import ChileFlag from './ChileFlag.svelte';

	type Props = { open: boolean; onOpenChange?: (v: boolean) => void };
	let { open = $bindable(false), onOpenChange }: Props = $props();

	// API base. PUBLIC_API_URL se inyecta al build (Vite/SvelteKit).
	// Default localhost:3000 para dev; en prod apunta a la API de la intranet.
	const API_BASE =
		(import.meta.env?.PUBLIC_API_URL as string | undefined) ?? 'http://localhost:3000';

	type Status = 'idle' | 'sending' | 'ok' | 'error';
	let status = $state<Status>('idle');
	let errorMessage = $state('');
	let errorField = $state('');

	// Form state
	let name = $state('');
	let email = $state('');
	let subject = $state('');
	let message = $state('');
	let honeypot = $state(''); // hidden — bots lo llenan
	let submittedId = $state('');

	let formEl: HTMLFormElement | undefined = $state();
	let successEl: HTMLElement | undefined = $state();

	$effect(() => {
		// Cuando se cierra el dialog, reseteamos después de la animación
		// (250ms) para que el usuario vea el OK antes del reset.
		if (!open) {
			setTimeout(() => {
				if (!open) {
					status = 'idle';
					errorMessage = '';
					errorField = '';
					submittedId = '';
				}
			}, 300);
		}
	});

	$effect(() => {
		// Cuando llega a 'ok', animamos el check de éxito.
		if (status === 'ok' && successEl) {
			animate(successEl, {
				scale: [0.6, 1],
				opacity: [0, 1],
				duration: 500,
				ease: 'out(4)',
			});
		}
	});

	onMount(() => {
		// Stagger reveal del contenido al abrir
		const root = document.querySelector<HTMLElement>('[data-contact-root]');
		if (root) {
			animate(root.querySelectorAll<HTMLElement>('[data-contact-anim]'), {
				opacity: [0, 1],
				translateY: [16, 0],
				delay: stagger(50, { start: 80 }),
				duration: 500,
				ease: 'out(3)',
			});
		}
	});

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (status === 'sending') return;

		// Reset error state
		errorMessage = '';
		errorField = '';
		status = 'sending';

		try {
			const res = await fetch(`${API_BASE}/api/contact`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
				body: JSON.stringify({
					name: name.trim(),
					email: email.trim(),
					subject: subject.trim(),
					message: message.trim(),
					website: honeypot, // honeypot — vacío en humanos
				}),
			});

			const data = (await res.json().catch(() => ({}))) as {
				ok?: boolean;
				id?: string;
				field?: string;
				code?: string;
				message?: string;
			};

			if (!res.ok || !data.ok) {
				errorField = data.field ?? '';
				errorMessage =
					data.message ??
					`Error ${res.status}: no pudimos enviar tu mensaje. Probá de nuevo.`;
				status = 'error';

				// Shake animation en el form
				if (formEl) {
					animate(formEl, {
						translateX: [0, -6, 6, -4, 4, -2, 2, 0],
						duration: 500,
						ease: 'out(2)',
					});
				}
				return;
			}

			// Éxito
			submittedId = data.id ?? '';
			status = 'ok';

			// Limpiamos los campos después de un breve delay para que el
			// usuario vea su mensaje en pantalla un instante.
			setTimeout(() => {
				name = '';
				email = '';
				subject = '';
				message = '';
			}, 200);
		} catch (err) {
			errorMessage =
				'Error de red. Verificá tu conexión o usá el email directo de la página.';
			status = 'error';

			if (formEl) {
				animate(formEl, {
					translateX: [0, -6, 6, -4, 4, -2, 2, 0],
					duration: 500,
					ease: 'out(2)',
				});
			}
			// log silencioso (no PII)
			console.error('[contact] network error', err);
		}
	}

	function openChange(v: boolean) {
		open = v;
		onOpenChange?.(v);
	}
</script>

<Dialog.Root bind:open={() => open, openChange}>
	<Dialog.Portal>
		<Dialog.Overlay
			class="fixed inset-0 z-50 bg-neutral-950/85 backdrop-blur-2xl data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
		/>
		<Dialog.Content
			showCloseButton={false}
			class="glass-liquid-static fixed left-1/2 top-1/2 z-50 max-h-[92vh] w-[min(96vw,560px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl p-0 shadow-2xl shadow-black/70 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
		>
			<!-- Top bar: badge + close -->
			<div class="flex items-center justify-between border-b border-white/5 px-5 py-3">
				<div
					data-contact-anim
					class="inline-flex items-center gap-2 rounded-full border border-mint-400/20 bg-mint-500/[0.08] py-1 pl-1.5 pr-2.5"
				>
					<ChileFlag size={14} />
					<span class="font-mono text-[10px] uppercase tracking-[0.15em] text-mint-200"
						>Contacto · seba3567.cl</span
					>
				</div>
				<button
					type="button"
					onclick={() => openChange(false)}
					aria-label="Cerrar"
					data-contact-anim
					class="inline-flex size-8 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] text-neutral-400 transition-colors hover:bg-white/[0.08] hover:text-neutral-100"
				>
					<X size={14} weight="bold" />
				</button>
			</div>

			<!-- Body -->
			<div class="scroll-thin max-h-[calc(92vh-56px)] overflow-y-auto p-5 sm:p-6" data-contact-root>
				{#if status === 'ok'}
					<!-- Success state -->
					<div
						bind:this={successEl}
						class="flex flex-col items-center gap-4 py-8 text-center"
						style="opacity: 0;"
					>
						<div
							class="flex size-14 items-center justify-center rounded-full border border-mint-400/30 bg-mint-500/10"
						>
							<CheckCircle size={32} weight="fill" class="text-mint-300" />
						</div>
						<div>
							<h3
								class="text-balance text-2xl font-semibold tracking-tight text-neutral-50"
							>
								Mensaje enviado
							</h3>
							<p class="mt-2 max-w-sm text-sm text-neutral-400">
								Te respondo a la brevedad al email que dejaste. Si es urgente,
								usá los links de la sección de contacto.
							</p>
						</div>
						{#if submittedId}
							<p
								class="rounded-md border border-white/5 bg-white/[0.02] px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-neutral-500"
							>
								Referencia · #{submittedId}
							</p>
						{/if}
						<Button onclick={() => openChange(false)} size="sm" class="mt-2">
							Cerrar
						</Button>
					</div>
				{:else}
					<!-- Header -->
					<div data-contact-anim class="mb-5">
						<h2
							class="text-balance text-2xl font-semibold tracking-tight text-neutral-50"
						>
							Escríbime.
						</h2>
						<p class="mt-1.5 text-sm text-neutral-400">
							Llega directo a mi inbox. Sin tracking, sin newsletter.
						</p>
					</div>

					<form
						bind:this={formEl}
						onsubmit={handleSubmit}
						class="flex flex-col gap-3.5"
						novalidate
					>
						<!-- Honeypot: oculto a humanos, visible a bots -->
						<div
							aria-hidden="true"
							style="position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden;"
						>
							<label>
								Website
								<input
									type="text"
									tabindex="-1"
									autocomplete="off"
									bind:value={honeypot}
									name="website"
								/>
							</label>
						</div>

						<!-- Name + Email row -->
						<div class="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
							<label data-contact-anim class="flex flex-col gap-1.5">
								<span
									class="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500"
									>Nombre</span
								>
								<div
									class="flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 transition-colors focus-within:border-mint-400/40 focus-within:bg-mint-500/[0.04]"
								>
									<User size={14} weight="duotone" class="shrink-0 text-neutral-500" />
									<input
										type="text"
										bind:value={name}
										required
										minlength="2"
										maxlength="100"
										autocomplete="name"
										disabled={status === 'sending'}
										placeholder="Tu nombre"
										class="w-full bg-transparent text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none disabled:opacity-50"
									/>
								</div>
							</label>

							<label data-contact-anim class="flex flex-col gap-1.5">
								<span
									class="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500"
									>Email</span
								>
								<div
									class="flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 transition-colors focus-within:border-mint-400/40 focus-within:bg-mint-500/[0.04]"
								>
									<At size={14} weight="duotone" class="shrink-0 text-neutral-500" />
									<input
										type="email"
										bind:value={email}
										required
										autocomplete="email"
										disabled={status === 'sending'}
										placeholder="tu@email.com"
										class="w-full bg-transparent text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none disabled:opacity-50"
									/>
								</div>
							</label>
						</div>

						<!-- Subject -->
						<label data-contact-anim class="flex flex-col gap-1.5">
							<span
								class="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500"
								>Asunto</span
							>
							<div
								class="flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 transition-colors focus-within:border-mint-400/40 focus-within:bg-mint-500/[0.04]"
							>
								<ChatTeardropText
									size={14}
									weight="duotone"
									class="shrink-0 text-neutral-500"
								/>
								<input
									type="text"
									bind:value={subject}
									required
									minlength="3"
									maxlength="200"
									disabled={status === 'sending'}
									placeholder="¿En qué te puedo ayudar?"
									class="w-full bg-transparent text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none disabled:opacity-50"
								/>
							</div>
						</label>

						<!-- Message -->
						<label data-contact-anim class="flex flex-col gap-1.5">
							<span
								class="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500"
								>Mensaje</span
							>
							<textarea
								bind:value={message}
								required
								minlength="10"
								maxlength="5000"
								disabled={status === 'sending'}
								rows="5"
								placeholder="Contame un poco del proyecto, idea o consulta…"
								class="resize-none rounded-md border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-600 transition-colors focus:border-mint-400/40 focus:bg-mint-500/[0.04] focus:outline-none disabled:opacity-50"
							></textarea>
							<span class="self-end font-mono text-[10px] text-neutral-600">
								{message.length} / 5000
							</span>
						</label>

						<!-- Error state -->
						{#if status === 'error' && errorMessage}
							<div
								data-contact-anim
								role="alert"
								class="flex items-start gap-2.5 rounded-md border border-rose-400/20 bg-rose-500/[0.06] px-3 py-2.5 text-sm text-rose-200"
							>
								<WarningCircle size={16} weight="fill" class="mt-0.5 shrink-0" />
								<div>
									<p>{errorMessage}</p>
									{#if errorField}
										<p
											class="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-rose-300/70"
										>
											Campo: {errorField}
										</p>
									{/if}
								</div>
							</div>
						{/if}

						<!-- Actions -->
						<div data-contact-anim class="mt-1 flex items-center justify-between gap-3">
							<p class="text-[11px] text-neutral-500">
								<EnvelopeSimple size={11} weight="duotone" class="inline" />
								Llega al inbox · sin tracking
							</p>
							<div class="flex items-center gap-2">
								<button
									type="button"
									onclick={() => openChange(false)}
									disabled={status === 'sending'}
									class="rounded-md px-3 py-1.5 text-xs font-medium text-neutral-400 transition-colors hover:bg-white/5 hover:text-neutral-100 disabled:opacity-50"
								>
									Cancelar
								</button>
								<Button
									type="submit"
									size="sm"
									disabled={status === 'sending'}
									class="min-w-[110px]"
								>
									{#if status === 'sending'}
										<span class="inline-flex items-center gap-1.5">
											<span
												class="size-1.5 animate-pulse rounded-full bg-current"
											></span>
											Enviando…
										</span>
									{:else}
										<PaperPlaneTilt size={12} weight="fill" data-icon="inline-start" />
										Enviar
									{/if}
								</Button>
							</div>
						</div>
					</form>
				{/if}
			</div>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
