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
import { t } from 'svelte-i18n';
import * as Accordion from '$lib/components/ui/accordion';
import { Badge } from '$lib/components/ui/badge';
import { Button } from '$lib/components/ui/button';
import * as Dialog from '$lib/components/ui/dialog';

type Section = {
	value: string;
	icon: typeof Database;
};

type Props = { open: boolean; onOpenChange: (v: boolean) => void };
let { open = $bindable(false), onOpenChange }: Props = $props();

const PRIVACY_URL = 'https://seba3567.github.io/anticall_pages/';
const CONTACT_EMAIL = 'seba3567.dev@gmail.com';
const LAST_UPDATED = '3 de diciembre de 2025';

// Section list — static (the 7 sections are a fixed structure
// mandated by the law we're complying with). The titles,
// bodies, and bullets all come from the i18n dictionary.
const sections: Section[] = [
	{ value: 'datos', icon: Database },
	{ value: 'uso', icon: Eye },
	{ value: 'compartir', icon: ShareNetwork },
	{ value: 'derechos', icon: ShieldCheck },
	{ value: 'seguridad', icon: Lock },
	{ value: 'conservacion', icon: Trash },
	{ value: 'contacto', icon: Envelope },
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
					{$t('privacy.title')}
				</Badge>
				<Dialog.Close
					class="pointer-events-auto inline-flex size-9 items-center justify-center rounded-full border border-white/10 bg-neutral-950/80 text-neutral-300 backdrop-blur transition-colors hover:bg-white/10 hover:text-neutral-100"
					aria-label={$t('common.close')}
				>
					<X size={14} weight="bold" />
				</Dialog.Close>
			</div>

			<!-- Body -->
			<div class="scroll-thin max-h-[90vh] overflow-y-auto px-6 pt-20 pb-6 sm:px-10 sm:pt-24 sm:pb-8">
				<Dialog.Header class="mb-8">
					<Dialog.Title class="sr-only">{$t('privacy.title')}</Dialog.Title>
					<div
						class="text-balance text-3xl font-semibold leading-[1.05] tracking-[-0.03em] text-neutral-50 sm:text-4xl md:text-5xl"
					>
						{$t('privacy.title')}.
					</div>
					<Dialog.Description class="mt-3 text-sm text-neutral-400 sm:text-base">
						{$t('privacy.lastUpdated', { values: { date: LAST_UPDATED } })}
					</Dialog.Description>
				</Dialog.Header>

				<Accordion.Root type="multiple" class="space-y-2" value={['datos']}>
					{#each sections as s (s.value)}
						{@const Icon = s.icon}
						<Accordion.Item value={s.value} class="group rounded-2xl border border-white/5 bg-white/[0.02] transition-colors data-[state=open]:border-mint-400/20 data-[state=open]:bg-white/[0.04]">
							<Accordion.Trigger
								class="flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3.5 text-left font-sans text-base font-semibold text-neutral-100 transition-colors hover:text-mint-300 [&[data-state=open]>text-mint-300"
							>
								<div class="flex items-center gap-3">
									<div
										class="flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition-colors group-data-[state=open]:border-mint-400/40 group-data-[state=open]:bg-mint-500/10"
									>
										<Icon
											size={16}
											weight="duotone"
											class="text-neutral-300 transition-colors group-data-[state=open]:text-mint-300"
										/>
									</div>
									<span>{$t(`privacy.sections.${s.value}.title`)}</span>
								</div>
								<CaretDown
									size={14}
									weight="bold"
									class="shrink-0 text-neutral-500 transition-transform duration-300 group-data-[state=open]:rotate-180 group-data-[state=open]:text-mint-300"
								/>
							</Accordion.Trigger>
							<Accordion.Content
								class="overflow-hidden text-sm text-neutral-300 data-[state=closed]:animate-acc-up data-[state=open]:animate-acc-down"
							>
								<div class="space-y-3 px-4 pb-4 pt-1">
									<p class="leading-relaxed text-neutral-300">
										{$t(`privacy.sections.${s.value}.body`)}
									</p>
									<ul class="space-y-1.5">
										{#each $t(`privacy.sections.${s.value}.bullets`) as bullet (bullet)}
											{@const text = $t(`privacy.bullets.${bullet}`)}
											<li class="flex items-start gap-2 text-sm text-neutral-400">
												<span class="mt-1.5 size-1 shrink-0 rounded-full bg-mint-400/60"></span>
												<span>{text}</span>
											</li>
										{/each}
									</ul>
								</div>
							</Accordion.Content>
						</Accordion.Item>
					{/each}
				</Accordion.Root>

				<Dialog.Footer class="mt-8 flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
					<a
						href={PRIVACY_URL}
						target="_blank"
						rel="noreferrer noopener"
						class="group inline-flex items-center gap-1.5 font-mono text-[11px] text-neutral-400 transition-colors hover:text-neutral-100"
					>
						{$t('privacy.actions.viewOriginal')}
						<ArrowUpRight size={11} weight="bold" data-icon="inline-end" />
					</a>
					<Dialog.Close>
						{#snippet child({ props })}
							<Button {...props} size="sm">{$t('privacy.actions.understood')}</Button>
						{/snippet}
					</Dialog.Close>
				</Dialog.Footer>
			</div>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>

<style>
	/* accordion anim */
	:global([data-state='open'] > .acc-content) {
		animation: acc-down 320ms cubic-bezier(0.22, 1, 0.36, 1);
	}
	:global([data-state='closed'] > .acc-content) {
		animation: acc-up 240ms cubic-bezier(0.22, 1, 0.36, 1);
	}
	@keyframes acc-down {
		from {
			height: 0;
			opacity: 0;
		}
		to {
			height: var(--bits-accordion-content-height);
			opacity: 1;
		}
	}
	@keyframes acc-up {
		from {
			height: var(--bits-accordion-content-height);
			opacity: 1;
		}
		to {
			height: 0;
			opacity: 0;
		}
	}
</style>
