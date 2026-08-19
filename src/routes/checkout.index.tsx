import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, MapPin, Ticket, Truck, Store, Check, Loader2, Info, Package, ShieldCheck, ChevronRight, Lock } from "lucide-react";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { MainLayout } from "@/components/layout/MainLayout";
import { OrderProductGroup } from "@/components/checkout/OrderProductGroup";
import { Switch } from "@/components/ui/switch";
import { useCart } from "@/store/cart";
import { useCheckout, type FulfillmentMode, type BuyNowItem } from "@/store/checkout";
import { useCustomerLocation } from "@/store/customer-location";
import { useUser } from "@/store/user";
import { formatRupiah } from "@/lib/format";
import { ESTIMATED_GROUP_SHIPPING_FEE } from "@/data/shopping";
import type { CartWarehouseGroup } from "@/store/cart";
import { createBulkTrx, type BulkTrxRequest } from "@/lib/api/trx";
import { checkDelivery, type CheckDeliveryRequest } from "@/lib/api/delivery";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/checkout/")({
  head: () => ({ meta: [{ title: "Checkout — BahanMaterial.com" }] }),
  component: CheckoutPage,
});

// Helper to convert BuyNowItem to CartWarehouseGroup format
function createGroupFromBuyNowItem(item: BuyNowItem): CartWarehouseGroup {
  const cartItem = {
    id: item.productId,
    name: item.name,
    price: item.price,
    qty: item.qty,
    warehouse: item.warehouse,
    image: item.image,
    weightKg: item.weightKg,
    unit: "Sak",
    variant: item.variantName,
    variant_id: parseInt(item.variantId),
    branch_id: parseInt(item.branchId),
  };

  return {
    warehouse: item.warehouse,
    items: [cartItem],
    selectedItems: [cartItem],
    subTotal: item.price * item.qty,
    tonase: (item.weightKg * item.qty),
    allSelected: true,
    anySelected: true,
    lat: item.branch_latitude,
    long: item.branch_longitude,
  };
}

function CheckoutPage() {
  const { user } = useUser();
  const cart = useCart();
  const checkout = useCheckout();
  const customerLocation = useCustomerLocation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingStates, setShippingStates] = useState<Record<string, 'initial' | 'loading' | 'calculated'>>({});
  const [shippingFees, setShippingFees] = useState<Record<string, number>>({});
  const [shippingDistances, setShippingDistances] = useState<Record<string, number>>({});

  // Use buyNowItem if set, otherwise use cart groups
  const groups = checkout.buyNowItem
    ? [createGroupFromBuyNowItem(checkout.buyNowItem)]
    : cart.selectedGroups;

  const subtotalPesanan = groups.reduce((s, g) => s + g.subTotal, 0);
  const totalTonase = groups.reduce((s, g) => s + g.tonase, 0);
  // Pre-verification shipping estimate: per-group fee, only when "dikirim" and not COD.
  const showShipping = checkout.mode === "dikirim";
  const subtotalShipping = showShipping ? Object.values(shippingFees).reduce((sum, fee) => sum + fee, 0) : 0;
  const discount = checkout.voucher?.discount ?? 0;
  const total = subtotalPesanan + subtotalShipping - discount;

  const submit = async () => {
    const selectedLocation = customerLocation.selectedLocation;
    if (!selectedLocation) {
      toast.error("Silakan pilih alamat pengiriman terlebih dahulu.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Group items by warehouse + division
      const warehouseDivisionGroups = new Map<string, typeof groups[0]['selectedItems']>();
      
      groups.forEach((group) => {
        group.selectedItems.forEach((item) => {
          const division = checkout.buyNowItem?.division || item.division || "UNKNOWN";
          const key = `${group.warehouse}|${division}`;
          
          if (!warehouseDivisionGroups.has(key)) {
            warehouseDivisionGroups.set(key, []);
          }
          warehouseDivisionGroups.get(key)!.push(item);
        });
      });

      // Calculate original totals for validation
      const originalSubtotal = subtotalPesanan;
      const originalShipping = subtotalShipping;
      const originalTotal = total;

      // Build bulk transaction items
      const bulkItems = Array.from(warehouseDivisionGroups.entries()).map(([key, items]) => {
        const [warehouse, division] = key.split('|');
        
        // Get branch_id from first item or buyNowItem
        const branchId = checkout.buyNowItem
          ? parseInt(checkout.buyNowItem.branchId)
          : (items[0].branch_id || 0);

        // Get warehouse shipping cost
        const warehouseShippingCost = shippingFees[warehouse] || 0;

        // Check if this is the first division in this warehouse (gets shipping cost)
        const warehouseKeys = Array.from(warehouseDivisionGroups.keys()).filter(k => k.startsWith(`${warehouse}|`));
        const isFirstDivision = warehouseKeys.indexOf(key) === 0;

        // Allocate shipping cost to first division only
        const allocatedShippingCost = isFirstDivision ? warehouseShippingCost : 0;

        // Map shipping method: "dikirim" → "FRC", "diambil" → "LOC"
        const shippingMethod = checkout.mode === "dikirim" ? "FRC" : "LOC";

        // Map COD: checkout.cod → is_pay_store
        const isPayStore = checkout.cod;

        // Get warehouse note and delivery rule ID
        const warehouseNote = checkout.notes[warehouse] || "";
        const deliveryRuleId = checkout.deliveryRuleIds[warehouse] || undefined;

        // Build lines for this group
        const lines = items.map((item) => ({
          product_variant_id: checkout.buyNowItem
            ? parseInt(checkout.buyNowItem.variantId)
            : (item.variant_id || 0),
          product_id: checkout.buyNowItem
            ? parseInt(checkout.buyNowItem.productId)
            : (item.product_id || 0),
          price: item.price,
          qty: item.qty,
          subtotal: item.price * item.qty,
          division: checkout.buyNowItem?.division || item.division,
        }));

        // Recalculate financial totals for this order
        const orderSubtotal = lines.reduce((sum, line) => sum + line.subtotal, 0);
        const orderShippingCost = allocatedShippingCost;
        const orderTotal = orderSubtotal + orderShippingCost;

        return {
          doc_type: "ZEO1",
          trx_type: "order" as const,
          subtotal: orderSubtotal,
          shipping_cost: orderShippingCost,
          total: orderTotal,
          branch_id: branchId,
          division: division === "UNKNOWN" ? undefined : division,
          delivery_rule_id: deliveryRuleId,
          notes: warehouseNote,
          shipping_method: shippingMethod,
          is_pay_store: isPayStore,
          shipping_address: selectedLocation.address,
          shipping_phone: selectedLocation.phone,
          customer_location_address: selectedLocation.address,
          customer_location_phone: selectedLocation.phone,
          customer_location_lat: selectedLocation.lat || 0,
          customer_location_long: selectedLocation.long || 0,
          lines: lines,
        };
      });

      // Validate financial totals
      const calculatedSubtotal = bulkItems.reduce((sum, item) => sum + (item.subtotal || 0), 0);
      const calculatedShipping = bulkItems.reduce((sum, item) => sum + (item.shipping_cost || 0), 0);
      const calculatedTotal = bulkItems.reduce((sum, item) => sum + (item.total || 0), 0);

      // Allow small floating point differences
      const epsilon = 0.01;
      if (Math.abs(calculatedSubtotal - originalSubtotal) > epsilon) {
        console.error(`Subtotal mismatch: calculated=${calculatedSubtotal}, original=${originalSubtotal}`);
        toast.error("Terjadi kesalahan perhitungan subtotal. Silakan coba lagi.");
        return;
      }
      if (Math.abs(calculatedShipping - originalShipping) > epsilon) {
        console.error(`Shipping mismatch: calculated=${calculatedShipping}, original=${originalShipping}`);
        toast.error("Terjadi kesalahan perhitungan ongkir. Silakan coba lagi.");
        return;
      }
      if (Math.abs(calculatedTotal - originalTotal) > epsilon) {
        console.error(`Total mismatch: calculated=${calculatedTotal}, original=${originalTotal}`);
        toast.error("Terjadi kesalahan perhitungan total. Silakan coba lagi.");
        return;
      }

      const payload: BulkTrxRequest = {
        items: bulkItems,
      };

      const response = await createBulkTrx(payload);
      
      // Extract transaction codes from bulk response
      const codes = response.data.map((trx) => trx.code);
      checkout.setTransactionCodes(codes);
      
      toast.success("Pesanan berhasil dibuat!");
      
      // Clear buyNowItem after successful order
      if (checkout.buyNowItem) {
        checkout.clearBuyNowItem();
      }

      // Navigate to verification or success page
      const warehouses = groups.map((g) => g.warehouse);
      checkout.submitOrder(warehouses);
      navigate({ to: "/checkout/verifikasi" });
    } catch (error) {
      console.error("Failed to create order:", error);
      toast.error("Gagal membuat pesanan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQtyChange = (itemId: string, newQty: number) => {
    if (checkout.buyNowItem) {
      // Update buyNowItem quantity
      checkout.setBuyNowItem({
        ...checkout.buyNowItem,
        qty: newQty,
      });
    } else {
      // Update cart item quantity
      cart.updateQty(itemId, newQty);
    }
  };

  const handleCalculateShipping = async (group: CartWarehouseGroup) => {
    if (!customerLocation.selectedLocation) {
      toast.error("Silakan pilih alamat pengiriman terlebih dahulu.");
      return;
    }

    if (!group.lat || !group.long) {
      toast.error("Koordinat gudang tidak tersedia.");
      return;
    }

    setShippingStates(prev => ({ ...prev, [group.warehouse]: 'loading' }));

    try {
      const request: CheckDeliveryRequest = {
        customer_lat: customerLocation.selectedLocation.lat || 0,
        customer_long: customerLocation.selectedLocation.long || 0,
        branch_lat: group.lat,
        branch_long: group.long,
        tonase: Math.round(group.tonase),
      };

      const response = await checkDelivery(request);
      const deliveryPrice = parseFloat(response.delivery_rule.delivery_price);

      setShippingFees(prev => ({ ...prev, [group.warehouse]: deliveryPrice }));
      setShippingDistances(prev => ({ ...prev, [group.warehouse]: response.distance }));
      checkout.setDeliveryRuleId(group.warehouse, response.delivery_rule.id);
      setShippingStates(prev => ({ ...prev, [group.warehouse]: 'calculated' }));
    } catch (error) {
      console.error("Failed to calculate shipping:", error);
      toast.error("Gagal menghitung ongkir. Silakan coba lagi.");
      setShippingStates(prev => ({ ...prev, [group.warehouse]: 'initial' }));
    }
  };

  const handleChangeShipping = (warehouse: string) => {
    setShippingStates(prev => ({ ...prev, [warehouse]: 'initial' }));
    setShippingFees(prev => ({ ...prev, [warehouse]: 0 }));
    checkout.setDeliveryRuleId(warehouse, 0);
  };

  const handleViewMap = (group: CartWarehouseGroup) => {
    if (group.lat && group.long) {
      const url = `https://www.google.com/maps?q=${group.lat},${group.long}`;
      window.open(url, '_blank');
    } else {
      toast.error("Koordinat gudang tidak tersedia.");
    }
  };

  if (groups.length === 0) {
    return (
      <MainLayout>
        <div className="container mx-auto max-w-3xl px-4 py-12 text-center">
          <h1 className="text-xl font-bold text-foreground">Belum ada produk dipilih</h1>
          <p className="mt-2 text-sm text-muted-foreground">Kembali ke keranjang untuk memilih produk.</p>
          <Link to="/keranjang" className="mt-5 inline-block rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground">
            Ke Keranjang
          </Link>
        </div>
      </MainLayout>
    );
  }

  // Set warehouse from buyNowItem if available
  if (checkout.buyNowItem && checkout.buyNowItem.warehouse !== checkout.warehouse.name) {
    // Update checkout warehouse to match buyNowItem warehouse
    // This is a simplified approach - in production you might want to match by ID
  }

  return (
    <MainLayout>
      <div className="border-b border-border bg-card">
        <div className="container mx-auto flex max-w-7xl items-center gap-4 px-4 py-5">
          <h1 className="text-2xl font-bold text-primary">Checkout</h1>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-6">
        <Link to="/keranjang" className="inline-flex items-center gap-1 text-sm font-semibold text-foreground hover:text-primary">
          <ChevronLeft className="h-4 w-4" /> Kembali ke Keranjang
        </Link>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8">
          <div className="space-y-6">
            {/* Info banner */}
            <div className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary-soft/50 px-5 py-4">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div className="min-w-0 text-sm">
                <p className="font-semibold text-primary">Pesanan akan dibuat terpisah berdasarkan gudang pengirim.</p>
                <p className="mt-0.5 text-muted-foreground">Total pembayaran tetap dihitung menjadi satu.</p>
              </div>
            </div>

            {/* Address card — only when shipping */}
            {checkout.mode === "dikirim" ? (
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-primary"><MapPin className="h-5 w-5" /></span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-base font-bold text-foreground">Alamat Pengiriman</p>
                      <Link to="/checkout/alamat" className="text-sm font-semibold text-primary hover:underline">Ubah</Link>
                    </div>
                    {customerLocation.selectedLocation ? (
                      <>
                        <p className="mt-2 text-sm text-foreground">
                          <span className="font-semibold">{customerLocation.selectedLocation.name}</span>{" "}
                          <span className="text-muted-foreground">({customerLocation.selectedLocation.phone})</span>
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {customerLocation.selectedLocation.address}
                        </p>
                      </>
                    ) : (
                      <p className="mt-2 text-sm text-muted-foreground">Memuat alamat...</p>
                    )}
                  </div>
                </div>
              </div>
            ) : null}

            {/* Fulfillment mode toggle */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <h2 className="text-base font-bold text-foreground">Metode Pengiriman</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <ModeOption
                  active={checkout.mode === "dikirim"}
                  onClick={() => { checkout.setMode("dikirim"); checkout.setCod(false); }}
                  icon={<Truck className="h-5 w-5" />}
                  title="Dikirim"
                />
                <ModeOption
                  active={checkout.mode === "diambil"}
                  onClick={() => checkout.setMode("diambil")}
                  icon={<Store className="h-5 w-5" />}
                  title="Diambil"
                />
              </div>
            </div>

            {/* COD toggle — only when "diambil" */}
            {checkout.mode === "diambil" ? (
              <div className="rounded-2xl border border-border bg-card p-5">
                <h2 className="text-base font-bold text-foreground">Metode Pembayaran</h2>
                <div className="mt-3 flex items-center justify-between rounded-md border border-border px-4 py-3">
                  <span className="text-sm font-semibold text-foreground">COD (Cash On Delivery)</span>
                  <Switch checked={checkout.cod} onCheckedChange={checkout.setCod} />
                </div>
              </div>
            ) : null}

            {/* Multi-warehouse product groups */}
            {groups.map((g) => (
              <OrderProductGroup
                key={g.warehouse}
                group={g}
                note={checkout.notes[g.warehouse] ?? ""}
                onNoteChange={(t) => checkout.setNote(g.warehouse, t)}
                shippingFee={showShipping && shippingStates[g.warehouse] === 'calculated' ? shippingFees[g.warehouse] : undefined}
                onQtyChange={handleQtyChange}
                address={g.warehouse}
                etaLabel={shippingStates[g.warehouse] === 'calculated' ? `${shippingDistances[g.warehouse]?.toFixed(1)} km` : ""}
                onViewMap={() => handleViewMap(g)}
                shippingState={shippingStates[g.warehouse] || 'initial'}
                onCalculateShipping={() => handleCalculateShipping(g)}
                onChangeShipping={() => handleChangeShipping(g.warehouse)}
              />
            ))}

            {/* Voucher — below all warehouse cards */}
            <Link
              to="/checkout/voucher"
              className="flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-card p-5 shadow-sm transition-colors hover:border-primary"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                  <Ticket className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-base font-bold text-foreground">Gunakan Voucher</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {checkout.voucher?.title ?? "Pilih voucher untuk mendapatkan potongan harga"}
                  </p>
                </div>
              </div>
              {checkout.voucher ? (
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-3.5 w-3.5" />
                </span>
              ) : (
                <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
              )}
            </Link>
          </div>

          {/* Right rail */}
          <aside className="space-y-5 lg:sticky lg:top-24 lg:h-fit">
            <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
              <h2 className="text-base font-bold text-foreground">Ringkasan Pembayaran</h2>
              <dl className="mt-5 space-y-3.5 text-sm">
                <Row label="Subtotal Tonase" value={`${totalTonase.toLocaleString("id-ID")} Ton`} />
                <Row label="Subtotal Barang" value={formatRupiah(subtotalPesanan)} />
                {showShipping ? (
                  <Row label="Subtotal Ongkir" value={formatRupiah(subtotalShipping)} />
                ) : null}
                {checkout.voucher ? (
                  <Row
                    label={checkout.voucher.type === "shipping" ? "Voucher Gratis Ongkir" : `Voucher ${checkout.voucher.title}`}
                    value={`- ${formatRupiah(discount)}`}
                    accent="success"
                  />
                ) : null}
              </dl>
              <div className="mt-5 flex items-baseline justify-between gap-3 border-t border-border pt-5">
                <span className="text-sm font-bold text-foreground">Total Pembayaran</span>
                <span className="text-2xl font-bold text-accent">{formatRupiah(total)}</span>
              </div>
              <button
                onClick={submit}
                disabled={isSubmitting}
                className="mt-5 w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                    Memproses...
                  </>
                ) : (
                  "Ajukan Pesanan"
                )}
              </button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <Lock className="h-3.5 w-3.5" /> Data aman dan terenkripsi
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
              <h2 className="text-base font-bold text-foreground">Informasi Penting</h2>
              <ul className="mt-4 space-y-4 text-sm text-muted-foreground">
                <InfoItem icon={<Package className="h-4 w-4" />}>
                  Pesanan akan dibuat terpisah berdasarkan gudang pengirim.
                </InfoItem>
                <InfoItem icon={<Truck className="h-4 w-4" />}>
                  Pengiriman dari setiap gudang mungkin datang berbeda.
                </InfoItem>
                <InfoItem icon={<ShieldCheck className="h-4 w-4" />}>
                  Total pembayaran tetap dilakukan satu kali.
                </InfoItem>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </MainLayout>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: "success" }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={"font-semibold " + (accent === "success" ? "text-success" : "text-foreground")}>{value}</dd>
    </div>
  );
}

function InfoItem({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">{icon}</span>
      <span className="min-w-0 leading-relaxed">{children}</span>
    </li>
  );
}

function ModeOption({
  active, onClick, icon, title,
}: { active: boolean; onClick: () => void; icon: React.ReactNode; title: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "flex items-center justify-center gap-2 rounded-md border-2 px-4 py-3 text-sm font-bold transition-colors " +
        (active ? "border-primary bg-primary-soft/40 text-primary" : "border-border bg-card text-foreground hover:border-primary/60")
      }
    >
      {icon}
      {title}
    </button>
  );
}

// satisfy unused import elision in some TS configs
void (null as unknown as FulfillmentMode);
