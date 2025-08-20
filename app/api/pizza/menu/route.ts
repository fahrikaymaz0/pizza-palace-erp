import { NextResponse } from 'next/server'

// In-memory pizza data
const pizzas = [
  { id: 1, name: 'Margherita', price: 45, image: '/pizzas/margherita.png', category: 'Klasik' },
  { id: 2, name: 'Pepperoni', price: 55, image: '/pizzas/pepperoni.png', category: 'Etli' },
  { id: 3, name: 'Quattro Stagioni', price: 65, image: '/pizzas/quattro-stagioni.png', category: 'Özel' },
  { id: 4, name: 'Vegetarian', price: 50, image: '/pizzas/vegetarian.png', category: 'Vejetaryen' },
  { id: 5, name: 'BBQ Chicken', price: 60, image: '/pizzas/bbq-chicken.png', category: 'Tavuk' },
  { id: 6, name: 'Supreme', price: 70, image: '/pizzas/supreme.png', category: 'Özel' }
]

export async function GET() {
  return NextResponse.json({
    success: true,
    data: pizzas
  })
} 