<script>
  import { buildTags } from 'seo-tags';

  export let title = undefined;
  export let titleTemplate = undefined;
  export let description = undefined;
  export let keywords = undefined;
  export let author = undefined;
  export let generator = undefined;
  export let canonical = undefined;
  export let robots = undefined;
  export let googlebot = undefined;
  export let siteName = undefined;
  export let baseUrl = undefined;
  export let locale = undefined;
  export let alternateLocales = undefined;
  export let og = undefined;
  export let twitter = undefined;
  export let jsonLd = undefined;
  export let hreflang = undefined;
  export let pwa = undefined;
  export let security = undefined;
  export let hints = undefined;
  export let env = undefined;
  export let themeColor = undefined;
  export let viewport = undefined;
  export let charset = undefined;
  export let extra = undefined;

  // Reactively rebuild tags list on changes
  $: resolved = buildTags({
    title,
    titleTemplate,
    description,
    keywords,
    author,
    generator,
    canonical,
    robots,
    googlebot,
    siteName,
    baseUrl,
    locale,
    alternateLocales,
    og,
    twitter,
    jsonLd,
    hreflang,
    pwa,
    security,
    hints,
    env,
    themeColor,
    viewport,
    charset,
    extra
  }).resolve();
</script>

<svelte:head>
  {#each resolved as tag}
    {#if tag.tag === 'title'}
      <title>{tag.content || ''}</title>
    {:else if tag.tag === 'meta'}
      <meta {...tag.attributes} />
    {:else if tag.tag === 'link'}
      <link {...tag.attributes} />
    {:else if tag.tag === 'script'}
      <script {...tag.attributes}>{@html tag.content || ''}</script>
    {/if}
  {/each}
</svelte:head>
