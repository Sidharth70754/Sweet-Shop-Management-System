import type { Database } from '@/integrations/supabase/types';

type SweetInsert = Database['public']['Tables']['sweets']['Insert'];

export const sampleSweets: SweetInsert[] = [
  { name: 'Kaju Katli', category: 'Mithai', price: 450.00, quantity: 50 },
  { name: 'Gulab Jamun', category: 'Mithai', price: 300.00, quantity: 75 },
  { name: 'Rasgulla', category: 'Mithai', price: 280.00, quantity: 60 },
  { name: 'Barfi', category: 'Mithai', price: 350.00, quantity: 40 },
  { name: 'Ladoo', category: 'Mithai', price: 320.00, quantity: 55 },
  { name: 'Jalebi', category: 'Mithai', price: 250.00, quantity: 30 },
  { name: 'Rasmalai', category: 'Mithai', price: 380.00, quantity: 45 },
  { name: 'Peda', category: 'Mithai', price: 400.00, quantity: 50 },
  { name: 'Soan Papdi', category: 'Mithai', price: 220.00, quantity: 65 },
  { name: 'Besan Ladoo', category: 'Mithai', price: 280.00, quantity: 50 },
  { name: 'Kheer', category: 'Dessert', price: 150.00, quantity: 25 },
  { name: 'Gajar Halwa', category: 'Dessert', price: 200.00, quantity: 20 },
  { name: 'Rabri', category: 'Dessert', price: 180.00, quantity: 15 },
  { name: 'Shrikhand', category: 'Dessert', price: 160.00, quantity: 30 },
  { name: 'Chocolate Barfi', category: 'Mithai', price: 420.00, quantity: 35 },
  { name: 'Coconut Barfi', category: 'Mithai', price: 300.00, quantity: 40 },
  { name: 'Motichoor Ladoo', category: 'Mithai', price: 350.00, quantity: 45 },
  { name: 'Kalakand', category: 'Mithai', price: 380.00, quantity: 30 },
  { name: 'Mysore Pak', category: 'Mithai', price: 400.00, quantity: 25 },
  { name: 'Badam Halwa', category: 'Dessert', price: 450.00, quantity: 20 },
];

