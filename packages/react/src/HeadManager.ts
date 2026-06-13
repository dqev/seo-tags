import { mergeConfigs, MetaTagBuilder, type MetaTagsConfig, type ResolvedTag } from 'seo-tags';

/**
 * Registry class that stores, cascades, and updates metadata configurations.
 * Supports subscriptions for triggering head updates dynamically in SPAs,
 * and flushing raw HTML strings for SSR.
 */
export class HeadManager {
  private defaults: MetaTagsConfig = {};
  private configsMap = new Map<string, MetaTagsConfig>();
  private subscribers = new Set<() => void>();

  constructor(defaults: MetaTagsConfig = {}) {
    this.defaults = defaults;
  }

  /**
   * Subscribes a callback to run when configurations are added, removed, or updated.
   * Returns an unsubscribe function.
   */
  public subscribe(callback: () => void): () => void {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notify(): void {
    this.subscribers.forEach(cb => cb());
  }

  /**
   * Registers or updates a component's meta configuration in the cascade.
   */
  public addConfig(id: string, config: MetaTagsConfig): void {
    this.configsMap.set(id, config);
    this.notify();
  }

  /**
   * Unregisters a component's configuration from the cascade (usually on unmount).
   */
  public removeConfig(id: string): void {
    if (this.configsMap.delete(id)) {
      this.notify();
    }
  }

  /**
   * Dynamically overrides the site-wide defaults layer.
   */
  public updateDefaults(defaults: MetaTagsConfig): void {
    this.defaults = defaults;
    this.notify();
  }

  /**
   * Resolves the merged configuration of all registered layers.
   */
  public getMergedConfig(): MetaTagsConfig {
    const configsList = [this.defaults, ...Array.from(this.configsMap.values())];
    return mergeConfigs(configsList);
  }

  /**
   * Resolves the final deduplicated HTML tag instances.
   */
  public resolve(): ResolvedTag[] {
    const merged = this.getMergedConfig();
    return new MetaTagBuilder(merged).resolve();
  }

  /**
   * Renders the resolved tags into an HTML string.
   */
  public toString(): string {
    const merged = this.getMergedConfig();
    return new MetaTagBuilder(merged).toString();
  }

  /**
   * Injects the merged tags into the browser document.head.
   */
  public clientUpdate(): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    const merged = this.getMergedConfig();
    new MetaTagBuilder(merged).inject(document.head);
  }
}
