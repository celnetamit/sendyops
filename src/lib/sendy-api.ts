

export interface SendyConfig {
  baseUrl: string;
  apiKey: string;
}

export class SendyAPI {
  private config: SendyConfig;

  constructor(config?: Partial<SendyConfig>) {
    this.config = {
      baseUrl: config?.baseUrl || process.env.SENDY_BASE_URL || '',
      apiKey: config?.apiKey || process.env.SENDY_API_KEY || '',
    };

    if (!this.config.baseUrl) {
      console.warn('SENDY_BASE_URL is not set');
    }
    if (!this.config.apiKey) {
      console.warn('SENDY_API_KEY is not set');
    }
  }

  private async request(endpoint: string, params: Record<string, string | number | boolean | undefined>): Promise<string> {
    const url = `${this.config.baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    
    // Add API key to params
    const bodyArgs = new URLSearchParams();
    bodyArgs.append('api_key', this.config.apiKey);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        bodyArgs.append(key, String(value));
      }
    });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: bodyArgs,
      });

      if (!response.ok) {
        throw new Error(`Sendy API Error: ${response.status} ${response.statusText}`);
      }

      const text = await response.text();
      return text;
    } catch (error) {
      console.error(`Sendy API Request Failed (${endpoint}):`, error);
      throw error;
    }
  }

  // --- SUBSCRIBERS ---

  async subscribe(params: {
    name?: string;
    email: string;
    list: string; // List ID string (encrypted)
    country?: string;
    ipaddress?: string;
    referrer?: string;
    gdpr?: boolean;
    silent?: boolean;
    hp?: string; // Honeypot
  }): Promise<boolean> {
    const response = await this.request('/subscribe', {
      ...params,
      gdpr: params.gdpr ? 'true' : undefined,
      silent: params.silent ? 'true' : undefined,
      boolean: 'true'
    });
    return response === 'true' || response === '1'; // Handle '1' just in case
  }

  async unsubscribe(params: {
    email: string;
    list: string;
  }): Promise<boolean> {
    const response = await this.request('/unsubscribe', {
      ...params,
      boolean: 'true'
    });
    return response === 'true';
  }

  async deleteSubscriber(params: {
    list_id: string;
    email: string;
  }): Promise<boolean> {
    const response = await this.request('/api/subscribers/delete.php', params);
    return response === 'true';
  }

  async getSubscriptionStatus(params: {
    email: string;
    list_id: string;
  }): Promise<string> {
    return this.request('/api/subscribers/subscription-status.php', params);
  }

  async getActiveSubscriberCount(list_id: string): Promise<number | string> {
    return this.request('/api/subscribers/active-subscriber-count.php', { list_id });
  }

  // --- LISTS & BRANDS ---

  async getLists(params: {
    brand_id: string;
    include_hidden?: boolean;
  }): Promise<unknown> {
    const response = await this.request('/api/lists/get-lists.php', {
      ...params,
      include_hidden: params.include_hidden ? 'yes' : 'no'
    });
    try {
      return JSON.parse(response);
    } catch {
      return response; // Return error string if not JSON
    }
  }

  async getBrands(): Promise<unknown> {
    const response = await this.request('/api/brands/get-brands.php', {});
    try {
      return JSON.parse(response);
    } catch {
      return response;
    }
  }

  // --- CAMPAIGNS ---

  async createCampaign(params: {
    from_name: string;
    from_email: string;
    reply_to: string;
    title: string;
    subject: string;
    plain_text?: string;
    html_text: string;
    list_ids?: string;
    segment_ids?: string;
    exclude_list_ids?: string;
    exclude_segments_ids?: string;
    brand_id?: string;
    query_string?: string;
    track_opens?: 0 | 1 | 2;
    track_clicks?: 0 | 1 | 2;
    send_campaign?: 0 | 1;
    schedule_date_time?: string;
    schedule_timezone?: string;
  }): Promise<string> {
    return this.request('/api/campaigns/create.php', params);
  }
}

export const sendyAPI = new SendyAPI();
