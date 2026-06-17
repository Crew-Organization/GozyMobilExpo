import { Seat, BoardingPoint, DroppingPoint } from '@/src/store/bus-booking-store';

export async function getSeatLayout(busId: string, isSleeper: boolean, basePrice: number): Promise<Seat[]> {
  const seats: Seat[] = [];
  
  // Lower Berth (15 seats)
  for (let row = 1; row <= 5; row++) {
    seats.push({ id: `L${row}A`, row, col: 1, deck: 'lower', status: row === 2 ? 'booked' : 'available', type: isSleeper ? 'sleeper' : 'seater', price: basePrice });
    seats.push({ id: `L${row}B`, row, col: 2, deck: 'lower', status: row === 3 ? 'ladies' : 'available', type: isSleeper ? 'sleeper' : 'seater', price: basePrice });
    seats.push({ id: `L${row}C`, row, col: 3, deck: 'lower', status: 'available', type: isSleeper ? 'sleeper' : 'seater', price: basePrice });
  }

  // Upper Berth (12 seats)
  for (let row = 1; row <= 4; row++) {
    seats.push({ id: `U${row}A`, row, col: 1, deck: 'upper', status: 'available', type: 'sleeper', price: basePrice + 100 });
    seats.push({ id: `U${row}B`, row, col: 2, deck: 'upper', status: row === 1 ? 'male' : 'available', type: 'sleeper', price: basePrice + 100 });
    seats.push({ id: `U${row}C`, row, col: 3, deck: 'upper', status: row === 4 ? 'booked' : 'available', type: 'sleeper', price: basePrice + 100 });
  }

  return seats;
}

export async function getBoardingPoints(city: string): Promise<BoardingPoint[]> {
  return [
    { id: 'b1', name: 'Main Bus Stand', time: '10:00 PM', address: `Central Area, ${city}`, landmark: 'Near Station' },
    { id: 'b2', name: 'Highway Toll Plaza', time: '10:30 PM', address: `Outer Ring Road, ${city}`, landmark: 'Toll Gate 2' },
  ];
}

export async function getDroppingPoints(city: string): Promise<DroppingPoint[]> {
  return [
    { id: 'd1', name: 'City Bus Terminal', time: '06:00 AM', address: `Downtown, ${city}`, landmark: 'City Square' },
    { id: 'd2', name: 'Bypass Cross', time: '06:45 AM', address: `Bypass Road, ${city}`, landmark: 'Signal Point' },
  ];
}

export async function initiatePayment(method: string, amount: number): Promise<{ success: boolean }> {
  return { success: true };
}

export async function createBooking(details: any, amount: number): Promise<{ pnr: string, bookingId: string, totalPaid: number }> {
  return { pnr: 'GZY' + Math.floor(Math.random() * 1000000), bookingId: 'BKG' + Math.floor(Math.random() * 1000000), totalPaid: amount };
}
