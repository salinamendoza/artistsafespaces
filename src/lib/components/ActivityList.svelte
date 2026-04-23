<script lang="ts">
  import { timeAgo } from '$lib/utils/date';
  import type { ActivityRow, ActivityType } from '$lib/types/activity';

  export let activity: ActivityRow[] = [];

  const LABELS: Record<ActivityType, string> = {
    brief_accepted: 'Accepted',
    brief_declined: 'Declined',
    invoice_submitted: 'Invoice',
    invoice_paid: 'Paid',
    contact_submitted: 'Contact',
    artist_applied: 'Artist app',
    partner_applied: 'Partner app'
  };

  const DOT: Record<ActivityType, string> = {
    brief_accepted: 'bg-green-600',
    brief_declined: 'bg-red-500',
    invoice_submitted: 'bg-brand-yellow',
    invoice_paid: 'bg-green-700',
    contact_submitted: 'bg-gray-400',
    artist_applied: 'bg-gray-400',
    partner_applied: 'bg-gray-400'
  };

  function href(a: ActivityRow): string {
    if (a.event_id && a.brief_id) return `/admin/events/${a.event_id}/briefs/${a.brief_id}`;
    if (a.type === 'artist_applied') return '/admin?view=artist-apps';
    if (a.type === 'partner_applied') return '/admin?view=partner-apps';
    return '/admin';
  }

  function description(a: ActivityRow): string {
    const actor = a.actor ?? 'Someone';
    switch (a.type) {
      case 'brief_accepted':
        return `${actor} accepted ${a.title ?? 'a brief'}${a.context ? ` — ${a.context}` : ''}`;
      case 'brief_declined':
        return `${actor} declined ${a.title ?? 'a brief'}${a.context ? ` — ${a.context}` : ''}`;
      case 'invoice_submitted':
        return `${actor} submitted invoice for ${a.title ?? 'a brief'}${a.context ? ` — ${a.context}` : ''}`;
      case 'invoice_paid':
        return `${actor}'s invoice marked paid — ${a.title ?? ''}${a.context ? ` (${a.context})` : ''}`.trim();
      case 'contact_submitted':
        return `${actor} sent a message${a.context ? `: "${a.context}"` : ''}`;
      case 'artist_applied':
        return `${actor} applied as artist${a.context ? ` · ${a.context}` : ''}`;
      case 'partner_applied':
        return `${actor} applied from ${a.context ?? 'an organization'}`;
    }
  }
</script>

{#if activity.length === 0}
  <p class="font-mono text-xs text-gray-400 py-2">Nothing yet. Accepted briefs, invoices, and applications will show up here.</p>
{:else}
  <ul class="divide-y divide-gray-100 border-t border-gray-100">
    {#each activity as a, i (i)}
      <li>
        <a href={href(a)} class="flex items-center justify-between gap-4 py-2.5 -mx-2 px-2 hover:bg-gray-50 rounded transition-colors">
          <div class="flex items-center gap-3 min-w-0 flex-1">
            <span class="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 {DOT[a.type]}"></span>
            <span class="font-mono text-[10px] uppercase tracking-widest text-gray-500 w-20 flex-shrink-0">{LABELS[a.type]}</span>
            <span class="text-sm text-gray-800 truncate">{description(a)}</span>
          </div>
          <time class="font-mono text-[10px] text-gray-400 whitespace-nowrap">{timeAgo(a.ts)}</time>
        </a>
      </li>
    {/each}
  </ul>
{/if}
