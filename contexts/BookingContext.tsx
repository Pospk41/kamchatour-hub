import { createContext, useContext, PropsWithChildren } from 'react';

export type BookingValue = unknown;

const BookingCtx = createContext<BookingValue>(null as unknown as BookingValue);

export function BookingProvider({ children }: PropsWithChildren<{}>) {
  return <BookingCtx.Provider value={null as unknown as BookingValue}>{children}</BookingCtx.Provider>;
}

export function useBooking(): BookingValue {
  return useContext(BookingCtx);
}
