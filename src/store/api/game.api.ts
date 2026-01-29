import { api } from '@/api/api.ts';
import type { Rarity } from '@/ui/BackgroundPattern/BackgroundPattern.tsx';
import { showTelegramErrorPopup } from '@/utils/telegramError';

export interface Gift {
  id: number;
  type: string;
  model: string;
  slug: string;
  symbol: string;
  background: string;
  rarity: Rarity;
  floor_price: number;
  user_gift_id: number;
  status: string;
}
export interface Dust {
  name: 'DUST_1' | 'DUST_2' | 'DUST_3';
  rarity: Rarity;
  amount: number;
}

export interface WonItem {
  id: string;
  can_sell: boolean;
  can_withdraw: boolean;
  type: string;
  amount: string;
  rarity: Rarity;
  file_url: string;
  telegram_gift_template?: {
    gift: string;
    model: string;
    background: string;
  };
  direct_telegram_gift?: {
    gift: string;
    model: string;
    background: string;
    symbol: string;
  };
  promocode: {
    pepes: number;
    ton_amount: string;
    deposit_bonus: number;
    expires_at: string;
    is_expired: boolean;
  };
}

interface PlayGameResponse {
  success: boolean;
  roulette: {
    reward: {
      id: string;
      rarity: Rarity;
      file_url: string;
      amount: string;
    };
  }[];
  won_item: WonItem;
  safe_balance_charged: boolean;
  balance: string;
  safe_balance: string;
  demo_balance: string;
  pepes: number;
}

export const gameApi = api.injectEndpoints({
  endpoints: (builder) => ({
    playGame: builder.mutation<PlayGameResponse, { case_id: string }>({
      query: ({ case_id }) => ({
        method: 'POST',
        url: `/roulette/cases/${case_id}/spin`,
      }),
      invalidatesTags: ['Spins', 'Gifts', 'Info', 'Account'],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error: unknown) {
          showTelegramErrorPopup(error);
        }
      },
    }),
    claimTicket: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: '/me/collect-pepe',
        method: 'POST',
      }),
      invalidatesTags: ['Info', 'Account'],
    }),
  }),
});

export const { usePlayGameMutation, useClaimTicketMutation } = gameApi;
