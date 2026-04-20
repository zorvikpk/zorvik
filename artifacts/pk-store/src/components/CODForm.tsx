import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { STORE_CONFIG } from '../config';
import { trackInitiateCheckout, trackCompletePayment } from '../lib/tiktok-pixel';
import { CartItem } from '../hooks/use-cart';
import { saveOrder, setLastOrderId } from '../lib/orders';
import { ChevronDown, Clock, Truck, StickyNote, User, Phone, MapPin, X } from 'lucide-react';

// ─── Cities with delivery estimates ────────────────────────────────────────────
const CITIES: { name: string; days: string }[] = [
  { name: 'Lahore',          days: '1-2 days' },
  { name: 'Islamabad',       days: '1-2 days' },
  { name: 'Rawalpindi',      days: '1-2 days' },
  { name: 'Karachi',         days: '2-3 days' },
  { name: 'Faisalabad',      days: '2-3 days' },
  { name: 'Multan',          days: '2-3 days' },
  { name: 'Peshawar',        days: '2-3 days' },
  { name: 'Gujranwala',      days: '2-3 days' },
  { name: 'Sialkot',         days: '2-3 days' },
  { name: 'Hyderabad',       days: '2-3 days' },
  { name: 'Sargodha',        days: '2-3 days' },
  { name: 'Sahiwal',         days: '2-3 days' },
  { name: 'Bahawalpur',      days: '3-4 days' },
  { name: 'Sukkur',          days: '3-4 days' },
  { name: 'Mardan',          days: '3-4 days' },
  { name: 'Abbottabad',      days: '3-4 days' },
  { name: 'Jhang',           days: '3-4 days' },
  { name: 'Quetta',          days: '3-5 days' },
  { name: 'Larkana',         days: '3-5 days' },
  { name: 'Dera Ghazi Khan', days: '3-5 days' },
  { name: 'Other',           days: '3-5 days' },
];

const LS_KEY = 'sw_customer_info';

function generateOrderId() {
  const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const rand = Array.from({ length: 5 }, () => alpha[Math.floor(Math.random() * alpha.length)]).join('');
  return `SW-2026-${rand}`;
}

function formatPhoneDisplay(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 4) return digits;
  return digits.slice(0, 4) + '-' + digits.slice(4);
}

// ─── Validation schema ─────────────────────────────────────────────────────────
const schema = z.object({
  fullName:  z.string().min(2, 'Name must be at least 2 characters'),
  phone:     z.string().refine(v => /^03\d{9}$/.test(v.replace(/\D/g, '')), 'Enter valid number: 03XXXXXXXXX'),
  city:      z.string().min(1, 'Please select a city'),
  cityOther: z.string().optional(),
  address:   z.string().min(5, 'Please enter your complete address'),
  notes:     z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

// ─── Props ─────────────────────────────────────────────────────────────────────
interface CODFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CartItem[];
  onOrderSuccess: () => void;
}

// ─── Component ─────────────────────────────────────────────────────────────────
export function CODForm({ open, onOpenChange, items, onOrderSuccess }: CODFormProps) {
  const [, setLocation]   = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notesOpen, setNotesOpen]       = useState(false);
  const [isReturning, setIsReturning]   = useState(false);

  // ── Price calculations ───────────────────────────────────────────────────────
  const itemTotal = items.reduce((sum, item) => {
    const price = item.variant?.optionPrice ?? item.product.price;
    return sum + price * item.quantity;
  }, 0);
  const freeDelivery     = itemTotal >= 2000;
  const deliveryCharge   = freeDelivery ? 0 : STORE_CONFIG.deliveryCharge;
  const grandTotal       = itemTotal + deliveryCharge;

  // ── Form setup ──────────────────────────────────────────────────────────────
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: '', phone: '', city: '', cityOther: '', address: '', notes: '' },
  });

  const selectedCity = form.watch('city');
  const cityInfo     = CITIES.find(c => c.name === selectedCity);
  const isOtherCity  = selectedCity === 'Other';

  // ── Load saved customer info ─────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const trackItems = items.map(i => ({
      id:       i.product.id,
      price:    i.variant?.optionPrice ?? i.product.price,
      quantity: i.quantity,
    }));
    trackInitiateCheckout(trackItems, itemTotal);
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
        const info = JSON.parse(saved) as Partial<FormValues>;
        form.reset({
          fullName:  info.fullName  || '',
          phone:     info.phone     || '',
          city:      info.city      || '',
          cityOther: info.cityOther || '',
          address:   info.address   || '',
          notes:     '',
        });
        if (info.fullName) setIsReturning(true);
      } else {
        form.reset({ fullName: '', phone: '', city: '', cityOther: '', address: '', notes: '' });
        setIsReturning(false);
      }
    } catch { /* ignore */ }
  }, [open]);

  // ── Submit ───────────────────────────────────────────────────────────────────
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    const orderId     = generateOrderId();
    const rawPhone    = data.phone.replace(/\D/g, '');
    const cityDisplay = isOtherCity && data.cityOther ? data.cityOther : data.city;

    // Save to localStorage (without notes for privacy)
    localStorage.setItem(LS_KEY, JSON.stringify({
      fullName: data.fullName, phone: data.phone, city: data.city, cityOther: data.cityOther, address: data.address,
    }));

    // Build WhatsApp message
    let msg = `*New Order — ${STORE_CONFIG.storeName}*\n`;
    msg += `*Order ID:* ${orderId}\n\n`;
    msg += `*Customer:* ${data.fullName}\n`;
    msg += `*Phone:* ${rawPhone}\n`;
    msg += `*City:* ${cityDisplay}\n`;
    msg += `*Address:* ${data.address}\n`;
    if (data.notes?.trim()) msg += `*Notes:* ${data.notes.trim()}\n`;
    msg += `\n*Items:*\n`;
    items.forEach((item, i) => {
      const price = item.variant?.optionPrice ?? item.product.price;
      const parts = [item.variant?.size, item.variant?.color, item.variant?.optionName].filter(Boolean);
      msg += `${i + 1}. ${item.product.name}${parts.length ? ` (${parts.join(', ')})` : ''} × ${item.quantity} — Rs. ${price * item.quantity}\n`;
    });
    msg += `\n*Subtotal:* Rs. ${itemTotal}\n`;
    msg += `*Delivery:* ${freeDelivery ? 'FREE' : `Rs. ${deliveryCharge}`}\n`;
    msg += `*Total:* Rs. ${grandTotal}\n`;
    msg += `*Payment:* Cash on Delivery\n`;
    msg += `\n_Expected delivery: ${cityInfo?.days ?? '3-5 days'}_`;

    const trackItems = items.map(i => ({
      id:       i.product.id,
      price:    i.variant?.optionPrice ?? i.product.price,
      quantity: i.quantity,
    }));
    trackCompletePayment(trackItems, grandTotal, orderId);
    await new Promise(r => setTimeout(r, 300));
    window.open(`https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');

    // Persist full order in localStorage for tracking
    saveOrder({
      orderId,
      name:     data.fullName,
      phone:    rawPhone,
      city:     cityDisplay,
      address:  data.address,
      items:    items.map(item => ({
        productId:    item.product.id,
        productName:  item.product.name,
        productImage: item.product.image,
        price:        item.variant?.optionPrice ?? item.product.price,
        quantity:     item.quantity,
        variant:      item.variant ? {
          size:       item.variant.size,
          color:      item.variant.color,
          optionName: item.variant.optionName,
        } : undefined,
      })),
      subtotal:          itemTotal,
      deliveryCharge,
      grandTotal,
      status:            'placed',
      createdAt:         new Date().toISOString(),
      estimatedDelivery: cityInfo?.days ?? '3-5 days',
      notes:             data.notes?.trim() || undefined,
    });
    setLastOrderId(orderId);

    setIsSubmitting(false);
    onOrderSuccess();        // clear cart
    onOpenChange(false);     // close dialog
    setLocation('/order-confirmation'); // navigate to full page
  };

  // ── Main form ────────────────────────────────────────────────────────────────
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px] bg-card text-card-foreground p-0 overflow-hidden max-h-[92dvh] flex flex-col gap-0">
        {/* Header */}
        <DialogHeader className="px-5 pt-5 pb-3 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-black uppercase tracking-wide">Complete Order</DialogTitle>
            <button onClick={() => onOpenChange(false)} className="p-1.5 hover:bg-muted rounded-full transition-colors">
              <X size={18} className="text-muted-foreground" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">Cash on Delivery — Pay when delivered</p>

          {/* Welcome back banner */}
          {isReturning && (
            <div className="mt-2 bg-primary/10 text-primary text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-2">
              <User size={12} />
              Welcome back, {form.watch('fullName') || 'there'}! Your details are pre-filled.
            </div>
          )}
        </DialogHeader>

        <div className="overflow-y-auto flex-1">
          {/* ── Order Summary Card ───────────────────────────────────────── */}
          <div className="mx-4 mt-4 bg-muted/40 border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border/50">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Order Summary · {items.length} {items.length === 1 ? 'item' : 'items'}
              </p>
            </div>
            <div className="px-4 py-2 space-y-2.5 max-h-36 overflow-y-auto">
              {items.map((item, i) => {
                const price = item.variant?.optionPrice ?? item.product.price;
                const parts = [item.variant?.size, item.variant?.color, item.variant?.optionName].filter(Boolean);
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden flex-shrink-0 border border-border">
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm leading-tight truncate">{item.product.name}</p>
                      {parts.length > 0 && (
                        <p className="text-[11px] text-muted-foreground">{parts.join(' · ')} · Qty {item.quantity}</p>
                      )}
                      {parts.length === 0 && (
                        <p className="text-[11px] text-muted-foreground">Qty: {item.quantity}</p>
                      )}
                    </div>
                    <span className="font-black text-sm text-primary flex-shrink-0">Rs. {price * item.quantity}</span>
                  </div>
                );
              })}
            </div>

            {/* Totals */}
            <div className="px-4 py-3 border-t border-border/50 space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Subtotal</span>
                <span>Rs. {itemTotal}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Truck size={11} /> Delivery
                </span>
                {freeDelivery
                  ? <span className="text-green-600 dark:text-green-400 font-bold">FREE</span>
                  : <span>Rs. {deliveryCharge}</span>
                }
              </div>
              {freeDelivery && (
                <p className="text-[10px] text-green-600 dark:text-green-400">
                  Free delivery on orders above Rs. 2,000
                </p>
              )}
              <div className="flex justify-between font-black text-base pt-1.5 border-t border-border">
                <span>Total</span>
                <span className="text-primary">Rs. {grandTotal}</span>
              </div>
            </div>
          </div>

          {/* ── Form ─────────────────────────────────────────────────────── */}
          <Form {...form}>
            <form id="cod-form" onSubmit={form.handleSubmit(onSubmit)} className="px-4 py-4 space-y-3.5 pb-2">

              {/* Full Name */}
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <User size={11} /> Full Name *
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Ali Khan" autoComplete="name" {...field} data-testid="input-fullname" />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Phone size={11} /> Phone Number *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="03XX-XXXXXXX"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        value={field.value}
                        onChange={e => {
                          const formatted = formatPhoneDisplay(e.target.value);
                          field.onChange(formatted);
                        }}
                        data-testid="input-phone"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* City dropdown */}
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin size={11} /> City *
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <select
                          {...field}
                          className="w-full h-10 px-3 pr-8 bg-background border border-input rounded-md text-sm appearance-none outline-none focus:ring-2 focus:ring-ring cursor-pointer"
                          data-testid="select-city"
                        >
                          <option value="">— Select your city —</option>
                          {CITIES.map(c => (
                            <option key={c.name} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* "Other" city text input */}
              {isOtherCity && (
                <FormField
                  control={form.control}
                  name="cityOther"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Enter your city name" {...field} data-testid="input-city-other" />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              )}

              {/* Delivery estimate pill */}
              {cityInfo && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg">
                  <Clock size={12} className="text-primary flex-shrink-0" />
                  <span>
                    Estimated delivery to <strong className="text-foreground">{selectedCity}</strong>:{' '}
                    <span className="text-primary font-bold">{cityInfo.days}</span>
                  </span>
                </div>
              )}

              {/* Address */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-wider">Full Address *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="House #, Street, Block, Area..."
                        rows={2}
                        className="resize-none text-sm"
                        autoComplete="street-address"
                        {...field}
                        data-testid="input-address"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Notes — collapsed by default */}
              {!notesOpen ? (
                <button
                  type="button"
                  onClick={() => setNotesOpen(true)}
                  className="flex items-center gap-1.5 text-xs text-primary font-bold hover:underline"
                >
                  <StickyNote size={11} />
                  Add delivery notes (optional)
                </button>
              ) : (
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <StickyNote size={11} /> Delivery Notes (optional)
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Gate code, landmark, special instructions..."
                          rows={2}
                          className="resize-none text-sm"
                          {...field}
                          data-testid="input-notes"
                          autoFocus
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}

            </form>
          </Form>
        </div>

        {/* ── Submit Button ─────────────────────────────────────────────────── */}
        <div className="px-4 pb-5 pt-3 border-t border-border bg-card flex-shrink-0">
          <Button
            type="submit"
            form="cod-form"
            className="w-full h-13 text-base font-black uppercase tracking-wider shadow-lg shadow-primary/20"
            disabled={isSubmitting || items.length === 0}
            data-testid="button-submit-order"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                Processing...
              </span>
            ) : (
              `Place Order — Rs. ${grandTotal}`
            )}
          </Button>
          <p className="text-center text-[10px] text-muted-foreground mt-2">
            Pay on delivery — no payment needed now
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
